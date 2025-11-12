// CONFIGURATION
export const CONFIG = {
  ADMIN_PASSWORD: 'aiml2024admin', // Change this to your desired password
  STUDENT_PASSWORD: 'student2024', // Password for student login (change as needed)
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx3NQsL7d5dEwg1-_-EHMBdmRkDH2JzqYOdNNPMHXlkV5SD3yWxkNBPqAZiW-MEjTAx/exec', // ← This needs to be the Apps Script DEPLOYMENT URL (not Sheets URL)
  MAX_DISTANCE_METERS: 200, // Maximum allowed distance from event location
  COLLEGE_EMAIL_DOMAIN: '@bmsit.in', // Change to your college domain
  USE_SHARED_STORAGE: true, // Set to true when Google Sheets is configured
  GOOGLE_SHEETS_ENABLED: true, // Set to false to temporarily disable Google Sheets
};
