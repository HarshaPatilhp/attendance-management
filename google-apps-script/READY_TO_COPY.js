/**
 * AIML Attendance System - Google Apps Script Backend
 *
 * This script acts as a backend API for the attendance system
 * Replace localStorage with Google Sheets storage
 */

// ============================================
// CONFIGURATION - Replace with your Sheet ID
// ============================================
const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE'; // ← REPLACE THIS WITH YOUR ACTUAL SHEET ID FROM URL
const SPREADSHEET = SpreadsheetApp.openById(SHEET_ID);

// Sheet names
const SHEETS = {
  SETTINGS: 'Settings',
  STAFF: 'Staff',
  EVENTS: 'Events',
  ATTENDANCE: 'Attendance'
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize sheets if they don't exist
 */
function initializeSheets() {
  const ss = SPREADSHEET;

  // Create Settings sheet
  if (!ss.getSheetByName(SHEETS.SETTINGS)) {
    const sheet = ss.insertSheet(SHEETS.SETTINGS);
    sheet.appendRow(['Key', 'Value', 'Updated']);
    sheet.appendRow(['adminPassword', 'aiml2024admin', new Date()]);
  }

  // Create Staff sheet
  if (!ss.getSheetByName(SHEETS.STAFF)) {
    const sheet = ss.insertSheet(SHEETS.STAFF);
    sheet.appendRow(['ID', 'Username', 'Password', 'Created', 'Active']);
  }

  // Create Events sheet
  if (!ss.getSheetByName(SHEETS.EVENTS)) {
    const sheet = ss.insertSheet(SHEETS.EVENTS);
    sheet.appendRow(['Code', 'Name', 'Date', 'Time', 'Duration', 'Latitude', 'Longitude', 'Status', 'Created', 'Ended']);
  }

  // Create Attendance sheet
  if (!ss.getSheetByName(SHEETS.ATTENDANCE)) {
    const sheet = ss.insertSheet(SHEETS.ATTENDANCE);
    sheet.appendRow(['EventCode', 'Name', 'USN', 'Email', 'Timestamp', 'Latitude', 'Longitude', 'Distance', 'Status', 'ManualEntry', 'AddedBy']);
  }

  return { success: true, message: 'Sheets initialized' };
}

// ============================================
// WEB APP ENDPOINTS
// ============================================

/**
 * Handle GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    switch(action) {
      case 'getAdminPassword':
        return jsonResponse(getAdminPassword());

      case 'getStaffUsers':
        return jsonResponse(getStaffUsers());

      case 'getActiveEvent':
        return jsonResponse(getActiveEvent());

      case 'getPastEvents':
        return jsonResponse(getPastEvents());

      case 'getAttendance':
        return jsonResponse(getAttendance(e.parameter.eventCode));

      case 'init':
        return jsonResponse(initializeSheets());

      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch(action) {
      case 'setAdminPassword':
        return jsonResponse(setAdminPassword(data.password));

      case 'addStaff':
        return jsonResponse(addStaff(data.staff));

      case 'deleteStaff':
        return jsonResponse(deleteStaff(data.staffId));

      case 'createEvent':
        return jsonResponse(createEvent(data.event));

      case 'endEvent':
        return jsonResponse(endEvent(data.eventCode));

      case 'addAttendance':
        return jsonResponse(addAttendance(data.attendance));

      case 'deleteEvent':
        return jsonResponse(deleteEvent(data.eventCode));

      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================

function getAdminPassword() {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'adminPassword') {
      return { password: data[i][1] };
    }
  }

  return { password: 'aiml2024admin' };
}

function setAdminPassword(newPassword) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.SETTINGS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'adminPassword') {
      sheet.getRange(i + 1, 2).setValue(newPassword);
      sheet.getRange(i + 1, 3).setValue(new Date());
      return { success: true, message: 'Password updated' };
    }
  }

  // If not found, add it
  sheet.appendRow(['adminPassword', newPassword, new Date()]);
  return { success: true, message: 'Password set' };
}

// ============================================
// STAFF FUNCTIONS
// ============================================

function getStaffUsers() {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.STAFF);
  const data = sheet.getDataRange().getValues();
  const staffList = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][4]) { // Active
      staffList.push({
        id: data[i][0],
        username: data[i][1],
        password: data[i][2],
        createdAt: data[i][3]
      });
    }
  }

  return { staffUsers: staffList };
}

function addStaff(staff) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.STAFF);

  // Check if username exists
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === staff.username && data[i][4]) {
      return { success: false, error: 'Username already exists' };
    }
  }

  // Add new staff
  sheet.appendRow([
    staff.id,
    staff.username,
    staff.password,
    new Date(),
    true
  ]);

  return { success: true, staff: staff };
}

function deleteStaff(staffId) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.STAFF);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === staffId) {
      // Soft delete - set Active to false
      sheet.getRange(i + 1, 5).setValue(false);
      return { success: true, message: 'Staff deleted' };
    }
  }

  return { success: false, error: 'Staff not found' };
}

// ============================================
// EVENT FUNCTIONS
// ============================================

function getActiveEvent() {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.EVENTS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][7] === 'active') {
      return {
        event: {
          code: data[i][0],
          name: data[i][1],
          date: data[i][2],
          time: data[i][3],
          duration: data[i][4],
          location: {
            latitude: parseFloat(data[i][5]),
            longitude: parseFloat(data[i][6])
          },
          createdAt: data[i][8]
        }
      };
    }
  }

  return { event: null };
}

function getPastEvents() {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.EVENTS);
  const data = sheet.getDataRange().getValues();
  const events = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][7] === 'completed') {
      // Get attendance count for this event
      const attendanceCount = getAttendanceCount(data[i][0]);

      events.push({
        code: data[i][0],
        name: data[i][1],
        date: data[i][2],
        time: data[i][3],
        duration: data[i][4],
        location: {
          latitude: parseFloat(data[i][5]),
          longitude: parseFloat(data[i][6])
        },
        createdAt: data[i][8],
        endedAt: data[i][9],
        attendanceCount: attendanceCount
      });
    }
  }

  // Sort by date (newest first)
  events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { events: events };
}

function createEvent(event) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.EVENTS);

  // Check if there's already an active event
  const activeEvent = getActiveEvent();
  if (activeEvent.event) {
    return { success: false, error: 'An event is already active' };
  }

  // Add new event
  sheet.appendRow([
    event.code,
    event.name,
    event.date,
    event.time,
    event.duration,
    event.location.latitude,
    event.location.longitude,
    'active',
    new Date(),
    ''
  ]);

  return { success: true, event: event };
}

function endEvent(eventCode) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.EVENTS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === eventCode && data[i][7] === 'active') {
      sheet.getRange(i + 1, 8).setValue('completed');
      sheet.getRange(i + 1, 10).setValue(new Date());
      return { success: true, message: 'Event ended' };
    }
  }

  return { success: false, error: 'Event not found or already ended' };
}

function deleteEvent(eventCode) {
  const eventsSheet = SPREADSHEET.getSheetByName(SHEETS.EVENTS);
  const attendanceSheet = SPREADSHEET.getSheetByName(SHEETS.ATTENDANCE);

  // Delete event
  const eventData = eventsSheet.getDataRange().getValues();
  for (let i = 1; i < eventData.length; i++) {
    if (eventData[i][0] === eventCode) {
      eventsSheet.deleteRow(i + 1);
      break;
    }
  }

  // Delete associated attendance records
  const attendanceData = attendanceSheet.getDataRange().getValues();
  for (let i = attendanceData.length - 1; i >= 1; i--) {
    if (attendanceData[i][0] === eventCode) {
      attendanceSheet.deleteRow(i + 1);
    }
  }

  return { success: true, message: 'Event deleted' };
}

// ============================================
// ATTENDANCE FUNCTIONS
// ============================================

function getAttendance(eventCode) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.ATTENDANCE);
  const data = sheet.getDataRange().getValues();
  const records = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === eventCode) {
      records.push({
        name: data[i][1],
        usn: data[i][2],
        email: data[i][3],
        timestamp: data[i][4],
        latitude: parseFloat(data[i][5]),
        longitude: parseFloat(data[i][6]),
        distance: parseFloat(data[i][7]),
        status: data[i][8],
        manualEntry: data[i][9],
        addedBy: data[i][10]
      });
    }
  }

  return { attendance: records };
}

function getAttendanceCount(eventCode) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.ATTENDANCE);
  const data = sheet.getDataRange().getValues();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === eventCode) {
      count++;
    }
  }

  return count;
}

function addAttendance(attendance) {
  const sheet = SPREADSHEET.getSheetByName(SHEETS.ATTENDANCE);

  // Check for duplicate USN in same event
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === attendance.eventCode && data[i][2] === attendance.usn) {
      return { success: false, error: 'Attendance already marked for this USN' };
    }
  }

  // Add attendance record
  sheet.appendRow([
    attendance.eventCode,
    attendance.name,
    attendance.usn,
    attendance.email,
    attendance.timestamp || new Date(),
    attendance.latitude || 0,
    attendance.longitude || 0,
    attendance.distance || 0,
    attendance.status || 'verified',
    attendance.manualEntry || false,
    attendance.addedBy || 'Student'
  ]);

  return { success: true, message: 'Attendance added' };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function jsonResponse(data, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - call this to initialize sheets
 */
function testInitialize() {
  initializeSheets();
  Logger.log('Sheets initialized');
}
