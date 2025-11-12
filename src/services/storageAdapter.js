/**
 * Storage Adapter - Unified interface for localStorage and Google Sheets
 * 
 * Automatically uses Google Sheets if configured, otherwise falls back to localStorage
 */

import { 
  SettingsAPI, 
  StaffAPI, 
  EventsAPI, 
  AttendanceAPI,
  isGoogleSheetsEnabled 
} from './googleSheetsAPI';

// ============================================
// SETTINGS STORAGE
// ============================================

export const SettingsStorage = {
  /**
   * Get admin password
   */
  async getAdminPassword() {
    // First check localStorage (primary source)
    const localPassword = localStorage.getItem('adminPassword');
    if (localPassword) {
      return localPassword;
    }
    
    // If not in localStorage, try Google Sheets
    if (isGoogleSheetsEnabled()) {
      try {
        return await SettingsAPI.getAdminPassword();
      } catch (error) {
        console.error('Failed to get password from Sheets, using default:', error);
      }
    }
    
    // Final fallback to default
    return 'aiml2024admin';
  },
  
  /**
   * Set admin password
   */
  async setAdminPassword(password) {
    if (isGoogleSheetsEnabled()) {
      try {
        await SettingsAPI.setAdminPassword(password);
      } catch (error) {
        console.error('Failed to save password to Sheets, using localStorage:', error);
      }
    }
    // Always save to localStorage as backup
    localStorage.setItem('adminPassword', password);
    return true;
  }
};

// ============================================
// STAFF STORAGE
// ============================================

export const StaffStorage = {
  /**
   * Get all staff users
   */
  async getStaffUsers() {
    if (isGoogleSheetsEnabled()) {
      try {
        return await StaffAPI.getStaffUsers();
      } catch (error) {
        console.error('Failed to get staff from Sheets, using localStorage:', error);
        const data = localStorage.getItem('staffUsers');
        return data ? JSON.parse(data) : [];
      }
    }
    const data = localStorage.getItem('staffUsers');
    return data ? JSON.parse(data) : [];
  },
  
  /**
   * Save staff users
   */
  async saveStaffUsers(staffList) {
    if (isGoogleSheetsEnabled()) {
      // Note: Individual add/delete handled separately
      // This is for bulk operations
    }
    localStorage.setItem('staffUsers', JSON.stringify(staffList));
  },
  
  /**
   * Add staff user
   */
  async addStaff(staff) {
    if (isGoogleSheetsEnabled()) {
      try {
        console.log('Adding staff to Google Sheets:', staff);
        await StaffAPI.addStaff(staff);
        console.log('Staff added to Google Sheets successfully');
      } catch (error) {
        console.error('Failed to add staff to Sheets:', error);
        throw new Error(`Google Sheets error: ${error.message}`);
      }
    }
    
    // Update localStorage
    const staffList = await this.getStaffUsers();
    staffList.push(staff);
    localStorage.setItem('staffUsers', JSON.stringify(staffList));
    return staff;
  },
  
  /**
   * Delete staff user
   */
  async deleteStaff(staffId) {
    if (isGoogleSheetsEnabled()) {
      try {
        await StaffAPI.deleteStaff(staffId);
      } catch (error) {
        console.error('Failed to delete staff from Sheets:', error);
      }
    }
    
    // Update localStorage
    const staffList = await this.getStaffUsers();
    const updated = staffList.filter(s => s.id !== staffId);
    localStorage.setItem('staffUsers', JSON.stringify(updated));
    return true;
  }
};

// ============================================
// EVENTS STORAGE
// ============================================

export const EventsStorage = {
  /**
   * Get active event
   */
  async getActiveEvent() {
    if (isGoogleSheetsEnabled()) {
      try {
        return await EventsAPI.getActiveEvent();
      } catch (error) {
        console.error('Failed to get active event from Sheets, using localStorage:', error);
        const data = localStorage.getItem('activeEvent');
        return data ? JSON.parse(data) : null;
      }
    }
    const data = localStorage.getItem('activeEvent');
    return data ? JSON.parse(data) : null;
  },
  
  /**
   * Save active event
   */
  async saveActiveEvent(event) {
    if (isGoogleSheetsEnabled()) {
      try {
        console.log('Saving event to Google Sheets:', event);
        await EventsAPI.createEvent(event);
        console.log('Event saved to Google Sheets successfully');
      } catch (error) {
        console.error('Failed to save event to Sheets, using localStorage fallback:', error);
        // Don't throw error, just log and continue with localStorage
      }
    }
    localStorage.setItem('activeEvent', JSON.stringify(event));
    return event;
  },
  
  /**
   * Clear active event
   */
  async clearActiveEvent() {
    localStorage.removeItem('activeEvent');
  },
  
  /**
   * Get past events
   */
  async getPastEvents() {
    if (isGoogleSheetsEnabled()) {
      try {
        return await EventsAPI.getPastEvents();
      } catch (error) {
        console.error('Failed to get past events from Sheets, using localStorage:', error);
        const data = localStorage.getItem('pastEvents');
        return data ? JSON.parse(data) : [];
      }
    }
    const data = localStorage.getItem('pastEvents');
    return data ? JSON.parse(data) : [];
  },
  
  /**
   * Save past events
   */
  async savePastEvents(events) {
    localStorage.setItem('pastEvents', JSON.stringify(events));
  },
  
  /**
   * End event (move to past events)
   */
  async endEvent(event) {
    if (isGoogleSheetsEnabled()) {
      try {
        await EventsAPI.endEvent(event.code);
      } catch (error) {
        console.error('Failed to end event in Sheets:', error);
      }
    }
    
    // Update localStorage
    const pastEvents = await this.getPastEvents();
    pastEvents.push(event);
    await this.savePastEvents(pastEvents);
    await this.clearActiveEvent();
    return true;
  },
  
  /**
   * Delete event
   */
  async deleteEvent(eventCode) {
    if (isGoogleSheetsEnabled()) {
      try {
        await EventsAPI.deleteEvent(eventCode);
      } catch (error) {
        console.error('Failed to delete event from Sheets:', error);
      }
    }
    
    // Update localStorage
    const pastEvents = await this.getPastEvents();
    const updated = pastEvents.filter(e => e.code !== eventCode);
    await this.savePastEvents(updated);
    
    // Also remove attendance
    localStorage.removeItem(`attendance_${eventCode}`);
    return true;
  }
};

// ============================================
// ATTENDANCE STORAGE
// ============================================

export const AttendanceStorage = {
  /**
   * Get attendance for an event
   */
  async getAttendance(eventCode) {
    if (isGoogleSheetsEnabled()) {
      try {
        return await AttendanceAPI.getAttendance(eventCode);
      } catch (error) {
        console.error('Failed to get attendance from Sheets, using localStorage:', error);
        const data = localStorage.getItem(`attendance_${eventCode}`);
        return data ? JSON.parse(data) : [];
      }
    }
    const data = localStorage.getItem(`attendance_${eventCode}`);
    return data ? JSON.parse(data) : [];
  },
  
  /**
   * Save attendance for an event
   */
  async saveAttendance(eventCode, records) {
    localStorage.setItem(`attendance_${eventCode}`, JSON.stringify(records));
  },
  
  /**
   * Add attendance record
   */
  async addAttendance(eventCode, record) {
    if (isGoogleSheetsEnabled()) {
      try {
        await AttendanceAPI.addAttendance({
          eventCode,
          ...record
        });
      } catch (error) {
        console.error('Failed to add attendance to Sheets:', error);
      }
    }
    
    // Update localStorage
    const records = await this.getAttendance(eventCode);
    records.push(record);
    await this.saveAttendance(eventCode, records);
    return record;
  },
  
  /**
   * Check if USN already exists for event
   */
  async checkDuplicate(eventCode, usn) {
    const records = await this.getAttendance(eventCode);
    return records.some(r => r.usn === usn);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear all data (both localStorage and optionally Sheets)
 */
export async function clearAllData(includingSheets = false) {
  // Clear localStorage
  localStorage.clear();
  
  // Optionally clear Google Sheets
  if (includingSheets && isGoogleSheetsEnabled()) {
    console.warn('Clearing Google Sheets not implemented - manually delete data in sheets');
  }
  
  return true;
}

/**
 * Check storage status
 */
export function getStorageStatus() {
  return {
    googleSheetsEnabled: isGoogleSheetsEnabled(),
    localStorageAvailable: typeof(Storage) !== "undefined",
    mode: isGoogleSheetsEnabled() ? 'Google Sheets (with localStorage backup)' : 'localStorage only'
  };
}

/**
 * Get storage info for display
 */
export function getStorageInfo() {
  const status = getStorageStatus();
  
  if (status.googleSheetsEnabled) {
    return {
      type: 'Google Sheets',
      icon: '☁️',
      description: 'Cloud storage with automatic sync',
      color: 'text-blue-600'
    };
  }
  
  return {
    type: 'Browser Storage',
    icon: '💾',
    description: 'Local browser localStorage',
    color: 'text-gray-600'
  };
}
