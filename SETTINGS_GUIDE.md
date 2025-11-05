# Settings & Admin Features Guide

## Overview

The Admin Settings panel provides powerful tools to manage your attendance system, including password management, manual attendance entry, and bulk user uploads.

---

## 🔐 Password Management

### Changing Your Password

1. **Navigate to Settings**
   - Click the **Settings** tab in the admin navigation bar
   
2. **Change Password Section**
   - Enter your current password
   - Enter new password (minimum 6 characters)
   - Confirm new password
   - Click "Change Password"

### Password Storage
- Passwords are securely stored in browser localStorage
- Default password: `aiml2024admin`
- Custom passwords persist across sessions
- To reset: Clear browser data or use "Clear All Data" button

### Security Best Practices
- ✅ Change default password immediately
- ✅ Use strong passwords (8+ characters, mixed case, numbers)
- ✅ Don't share admin password
- ✅ Change password regularly

---

## 👤 Manual Attendance Entry

### When to Use
- Student's device has issues
- Network connectivity problems
- Student forgot to mark attendance during event
- Late arrivals with valid reason
- Technical difficulties

### Single Student Entry

1. **Navigate to Settings**
   - Click Settings tab → "Add Attendance Manually" section

2. **Check Active Event**
   - Ensure an event is active (shown in blue info box)
   - Current attendance count is displayed

3. **Add Student**
   - Click "Add Single Student" button
   - Fill in the form:
     - **Full Name**: Student's complete name
     - **USN**: University Seat Number (auto-uppercase)
     - **Email**: College email address
   - Click "Add Student"

4. **Confirmation**
   - Student appears in attendance list immediately
   - Marked with blue background and edit icon
   - Status shows "Manual" instead of "Verified"

### Visual Indicators

Manually added attendance records are distinguished by:
- 🔹 **Blue background** in the attendance table
- ✏️ **Edit icon** next to student name
- 📝 **"Manual" status** badge (green with checkmark)
- `manualEntry: true` flag in stored data

---

## 📊 Bulk User Upload (CSV)

### CSV File Format

Your CSV file must follow this structure:

```csv
Name,USN,Email
Rahul Kumar,1MS21CS001,rahul.kumar@bmsit.in
Priya Sharma,1MS21CS002,priya.sharma@bmsit.in
Amit Patel,1MS21CS003,amit.patel@bmsit.in
```

### Creating a CSV File

**Option 1: Excel/Google Sheets**
1. Create spreadsheet with columns: Name, USN, Email
2. Fill in student data
3. Save as → CSV (Comma delimited)

**Option 2: Text Editor**
1. Create new file
2. Add header: `Name,USN,Email`
3. Add student rows (comma-separated)
4. Save with `.csv` extension

### Uploading CSV

1. **Navigate to Settings**
   - Go to "Add Attendance Manually" section
   - Scroll to "Bulk Upload (CSV)"

2. **Select File**
   - Click the file upload area
   - Choose your CSV file
   - System automatically processes the file

3. **Results**
   - Alert shows:
     - ✅ Number of students added
     - ⚠️ Number skipped (duplicates/invalid)
   - All valid entries appear in attendance list

### CSV Upload Rules

✅ **Accepted:**
- Valid name, USN, and email
- Unique USN (not already in attendance)
- Any order (system skips header row)

❌ **Skipped:**
- Duplicate USN
- Missing name, USN, or email
- Empty rows
- Invalid format

### Example CSV Templates

**Basic Template:**
```csv
Name,USN,Email
John Doe,1MS21CS001,john@bmsit.in
Jane Smith,1MS21CS002,jane@bmsit.in
```

**With Header Variations:**
```csv
Student Name,University Seat Number,Email Address
John Doe,1MS21CS001,john@bmsit.in
```
*Note: System detects headers automatically*

**Large Class:**
```csv
Name,USN,Email
Student 1,1MS21CS001,student1@bmsit.in
Student 2,1MS21CS002,student2@bmsit.in
Student 3,1MS21CS003,student3@bmsit.in
... (up to hundreds of students)
```

---

## 🔍 Quick Access Features

### From Active Event View

When viewing an active event:
1. **"Add Manual" Button** (blue)
   - Located next to "Download CSV" in attendance section
   - Quick access to Settings → Manual Attendance
   - Redirects to Settings tab

### From Settings View

Direct access to:
- Password change form
- Manual attendance entry
- Bulk CSV upload
- System information
- Data management

---

## 📈 System Information

### Dashboard Overview

Located at bottom of Settings page:

- **Password Status**
  - Shows: "Custom Password Set" or "Default Password"
  - Green indicator for custom, yellow for default

- **Total Past Events**
  - Count of all completed events
  - Stored in localStorage

- **Active Event**
  - Current event name or "None"
  - Links to event details

- **Storage Type**
  - Browser localStorage (client-side)

### Data Management

**Clear All Data Button:**
- 🗑️ Red button at bottom of System Information
- Clears: events, attendance, password, all settings
- **Warning:** Cannot be undone!
- Use for: fresh start, testing, troubleshooting

---

## 💡 Usage Scenarios

### Scenario 1: Student Device Issues

**Problem:** Student's phone not working during event

**Solution:**
1. Verify student identity
2. Go to Settings → Manual Attendance
3. Add single student with their details
4. Student marked as present (Manual status)

### Scenario 2: Bulk Pre-marking

**Problem:** Need to mark attendance for students who registered but couldn't attend

**Solution:**
1. Get list of registered students
2. Create CSV file with their details
3. Upload via Bulk Upload feature
4. All students marked instantly

### Scenario 3: Late Arrivals

**Problem:** Students arrived after event code expired

**Solution:**
1. Don't create new event
2. Use manual entry for each student
3. Marked with timestamp showing actual entry time
4. Distinguished as manual entries in reports

### Scenario 4: Network Issues

**Problem:** Internet down during event, students can't submit

**Solution:**
1. Collect physical attendance sheet
2. After internet restored, use bulk CSV upload
3. Process entire class at once
4. Download updated attendance report

---

## 🎯 Best Practices

### Password Management
- ✅ Change on first login
- ✅ Use unique, strong password
- ✅ Document securely offline
- ✅ Don't use default password in production

### Manual Attendance
- ✅ Verify student identity before adding
- ✅ Document reason for manual entry
- ✅ Add as soon as possible after event
- ✅ Double-check USN to avoid duplicates

### Bulk Uploads
- ✅ Validate CSV format before upload
- ✅ Check for typos in USNs
- ✅ Keep master CSV as backup
- ✅ Review skipped entries alert

### Data Management
- ✅ Regularly download CSV backups
- ✅ Don't clear data unnecessarily
- ✅ Export reports before clearing
- ✅ Keep offline copies of important events

---

## 🚨 Troubleshooting

### Password Issues

**"Invalid password" error**
- Check caps lock
- Try default: `aiml2024admin`
- Clear browser cache if custom password forgotten
- Use "Clear All Data" as last resort

**Can't change password**
- Must enter correct current password
- New password minimum 6 characters
- Confirm password must match exactly

### Manual Attendance Issues

**"No active event" message**
- Create an event first
- Check if event was accidentally ended
- Verify you're in Admin portal

**"USN already exists" error**
- Student already marked
- Check past attendance records
- Verify USN spelling/format

**Form not appearing**
- Click "Add Single Student" button
- Check if active event exists
- Refresh page if needed

### CSV Upload Issues

**"Error processing CSV"**
- Check file format (.csv)
- Verify comma-separated values
- Remove special characters
- Save as plain CSV (not Excel)

**All entries skipped**
- Check USN format
- Verify no duplicates in file
- Ensure columns: Name, USN, Email
- Check for empty rows

---

## 📋 Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit current form
- **Esc**: Close modal dialogs
- **Ctrl/Cmd + S**: Save forms (when applicable)

---

## 🔗 Related Features

- **Active Event View**: Real-time attendance monitoring
- **Past Events**: Historical data and reports
- **CSV Export**: Download attendance records
- **Location Verification**: GPS-based validation (for student portal)

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review DEMO_INSTRUCTIONS.md
3. Check main README.md
4. Contact course instructor

---

**Last Updated:** November 6, 2025  
**Version:** 2.0 with Settings Panel
