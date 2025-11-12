/**
 * Google Sheets API Service
 * 
 * Handles all communication with Google Apps Script backend
 * Replaces localStorage with Google Sheets storage
 */

import { CONFIG } from '../config';

// API endpoint - will be set from config
const API_URL = CONFIG.GOOGLE_SCRIPT_URL;

/**
 * Make GET request to Google Apps Script
 */
async function apiGet(action, params = {}) {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('action', action);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
}

/**
 * Make POST request to Google Apps Script
 */
async function apiPost(action, payload = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...payload
      }),
      redirect: 'follow'
    });
    
    // Note: with no-cors mode, we can't read the response
    // Google Apps Script will execute successfully
    // We'll verify by fetching the data again
    
    return { success: true };
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
}

// ============================================
// SETTINGS API
// ============================================

export const SettingsAPI = {
  /**
   * Get admin password
   */
  async getAdminPassword() {
    const response = await apiGet('getAdminPassword');
    return response.password || 'aiml2024admin';
  },
  
  /**
   * Set admin password
   */
  async setAdminPassword(password) {
    await apiPost('setAdminPassword', { password });
    // Wait a bit for Google Sheets to update
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// ============================================
// STAFF API
// ============================================

export const StaffAPI = {
  /**
   * Get all staff users
   */
  async getStaffUsers() {
    const response = await apiGet('getStaffUsers');
    return response.staffUsers || [];
  },
  
  /**
   * Add new staff user
   */
  async addStaff(staff) {
    await apiPost('addStaff', { staff });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return staff;
  },
  
  /**
   * Delete staff user
   */
  async deleteStaff(staffId) {
    await apiPost('deleteStaff', { staffId });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// ============================================
// EVENTS API
// ============================================

export const EventsAPI = {
  /**
   * Get active event
   */
  async getActiveEvent() {
    const response = await apiGet('getActiveEvent');
    return response.event;
  },
  
  /**
   * Get past events
   */
  async getPastEvents() {
    const response = await apiGet('getPastEvents');
    return response.events || [];
  },
  
  /**
   * Create new event
   */
  async createEvent(event) {
    await apiPost('createEvent', { event });
    
    // Wait longer for Google Sheets to update and retry verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Retry verification up to 3 times with increasing delays
    let verificationAttempts = 0;
    const maxAttempts = 3;
    
    while (verificationAttempts < maxAttempts) {
      try {
        const activeEvent = await this.getActiveEvent();
        if (activeEvent && activeEvent.code === event.code) {
          return event; // Success
        }
        
        // Wait longer between retries
        const waitTime = 2000 * (verificationAttempts + 1);
        console.log(`Event verification attempt ${verificationAttempts + 1} failed, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
      } catch (verifyError) {
        console.error(`Event verification attempt ${verificationAttempts + 1} failed:`, verifyError);
        if (verificationAttempts === maxAttempts - 1) {
          // On last attempt, throw the error
          throw new Error(`Event creation verification failed after ${maxAttempts} attempts: ${verifyError.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      verificationAttempts++;
    }
    
    throw new Error('Event creation verification failed - event not found in Google Sheets after all attempts');
  },
  
  /**
   * End active event
   */
  async endEvent(eventCode) {
    await apiPost('endEvent', { eventCode });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the event was ended by checking if it's no longer active
    try {
      const activeEvent = await this.getActiveEvent();
      if (activeEvent && activeEvent.code === eventCode) {
        throw new Error('Event ending failed - event still active in Google Sheets');
      }
    } catch (verifyError) {
      console.error('Event ending verification failed:', verifyError);
      throw new Error(`Event ending verification failed: ${verifyError.message}`);
    }
    
    return true;
  },
  
  /**
   * Delete event
   */
  async deleteEvent(eventCode) {
    await apiPost('deleteEvent', { eventCode });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// ============================================
// ATTENDANCE API
// ============================================

export const AttendanceAPI = {
  /**
   * Get attendance for an event
   */
  async getAttendance(eventCode) {
    const response = await apiGet('getAttendance', { eventCode });
    return response.attendance || [];
  },
  
  /**
   * Add attendance record
   */
  async addAttendance(attendance) {
    await apiPost('addAttendance', { attendance });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize Google Sheets (call this once)
 */
export async function initializeSheets() {
  try {
    const response = await apiGet('init');
    console.log('Sheets initialized:', response);
    return true;
  } catch (error) {
    console.error('Failed to initialize sheets:', error);
    return false;
  }
}

/**
 * Test API connection
 */
export async function testConnection() {
  try {
    await apiGet('getAdminPassword');
    return true;
  } catch (error) {
    console.error('API connection failed:', error);
    return false;
  }
}

// ============================================
// HYBRID MODE - localStorage fallback
// ============================================

// Cache the Google Sheets enabled status
let _isSheetsEnabled = null;

/**
 * Check if Google Sheets is configured (cached)
 */
export function isGoogleSheetsEnabled() {
  if (_isSheetsEnabled === null) {
    _isSheetsEnabled = CONFIG.GOOGLE_SHEETS_ENABLED && 
                     CONFIG.GOOGLE_SCRIPT_URL && 
                     CONFIG.GOOGLE_SCRIPT_URL !== '' && 
                     CONFIG.GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL';
  }
  return _isSheetsEnabled;
}

/**
 * Migrate data from localStorage to Google Sheets
 */
export async function migrateLocalStorageToSheets() {
  if (!isGoogleSheetsEnabled()) {
    console.log('Google Sheets not configured, skipping migration');
    return false;
  }
  
  try {
    console.log('Starting migration from localStorage to Google Sheets...');
    
    // Migrate admin password
    const adminPassword = localStorage.getItem('adminPassword');
    if (adminPassword) {
      await SettingsAPI.setAdminPassword(adminPassword);
      console.log('✓ Admin password migrated');
    }
    
    // Migrate staff users
    const staffUsers = localStorage.getItem('staffUsers');
    if (staffUsers) {
      const staff = JSON.parse(staffUsers);
      for (const user of staff) {
        await StaffAPI.addStaff(user);
      }
      console.log(`✓ ${staff.length} staff users migrated`);
    }
    
    // Migrate active event
    const activeEvent = localStorage.getItem('activeEvent');
    if (activeEvent) {
      const event = JSON.parse(activeEvent);
      await EventsAPI.createEvent(event);
      
      // Migrate attendance for active event
      const attendance = localStorage.getItem(`attendance_${event.code}`);
      if (attendance) {
        const records = JSON.parse(attendance);
        for (const record of records) {
          await AttendanceAPI.addAttendance({
            eventCode: event.code,
            ...record
          });
        }
        console.log(`✓ ${records.length} attendance records migrated for active event`);
      }
    }
    
    // Migrate past events
    const pastEvents = localStorage.getItem('pastEvents');
    if (pastEvents) {
      const events = JSON.parse(pastEvents);
      for (const event of events) {
        // End the event (creates as completed)
        await EventsAPI.createEvent(event);
        await EventsAPI.endEvent(event.code);
        
        // Migrate attendance for this event
        const attendance = localStorage.getItem(`attendance_${event.code}`);
        if (attendance) {
          const records = JSON.parse(attendance);
          for (const record of records) {
            await AttendanceAPI.addAttendance({
              eventCode: event.code,
              ...record
            });
          }
        }
      }
      console.log(`✓ ${events.length} past events migrated`);
    }
    
    console.log('✓ Migration completed successfully!');
    console.log('You can now clear localStorage data');
    return true;
    
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}
