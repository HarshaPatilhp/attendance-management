# Staff User Management Guide

## Overview

The Staff User system allows administrators to create additional user accounts with limited permissions for trusted staff members to help manage attendance.

---

## 🔐 User Roles

### Administrator (Admin)
- **Full access** to all features
- Change admin password
- Create and manage staff users
- Create and manage events
- Manual attendance entry
- View all reports
- Delete data and events
- Clear all system data

### Staff Member (Staff)
- **Limited access** to core features
- Create and manage events
- Manual attendance entry
- View all reports and history
- Download attendance CSV
- **CANNOT** change admin password
- **CANNOT** manage staff users
- **CANNOT** delete system data

---

## 👥 Creating Staff Users (Admin Only)

### Step-by-Step

1. **Login as Admin**
   - Use admin credentials
   
2. **Navigate to Settings**
   - Click the **Settings** tab in navigation bar

3. **Find Staff Management Section**
   - Scroll to "Staff Management" (blue icon)
   - This section is only visible to admins

4. **Click "Add New Staff User"**
   - Blue button with UserPlus icon

5. **Fill in Staff Details**
   - **Username**: Minimum 3 characters
     - Example: `john_staff`, `teachersmith`, `coordinator1`
   - **Password**: Minimum 6 characters
     - Create a secure password for the staff member

6. **Submit**
   - Click "Create Staff User"
   - Staff account is created immediately

### Example Staff Users

```
Username: teacher_john
Password: SecurePass123
Role: Staff Member

Username: coordinator_priya  
Password: AttendAdmin456
Role: Staff Member

Username: assistant_raj
Password: Helper2024!
Role: Staff Member
```

---

## 🔑 Staff Login

### How Staff Members Login

1. **Open Admin Portal**
   - Click "Admin Portal" on home page

2. **Toggle to Staff Login**
   - Click the **"Staff"** tab (blue button)
   - Login screen changes to staff mode

3. **Enter Credentials**
   - Username: Staff username (provided by admin)
   - Password: Staff password (provided by admin)

4. **Login**
   - Click "Login as Staff"
   - Staff dashboard opens

### Login Screen

```
┌────────────────────────┐
│   [Admin] [Staff]      │ ← Toggle
├────────────────────────┤
│ Username: _________    │ ← Only for staff
│ Password: _________    │
│                        │
│ [Login as Staff]       │
└────────────────────────┘
```

---

## 📊 Staff Permissions Matrix

| Feature | Admin | Staff |
|---------|-------|-------|
| **Authentication** | | |
| Login | ✅ | ✅ |
| Change own password | ❌ | ❌ |
| Change admin password | ✅ | ❌ |
| **Staff Management** | | |
| View staff users | ✅ | ❌ |
| Create staff users | ✅ | ❌ |
| Delete staff users | ✅ | ❌ |
| **Event Management** | | |
| Create events | ✅ | ✅ |
| View active event | ✅ | ✅ |
| End events | ✅ | ✅ |
| **Attendance** | | |
| View real-time attendance | ✅ | ✅ |
| Manual attendance entry | ✅ | ✅ |
| Bulk CSV upload | ✅ | ✅ |
| Download CSV | ✅ | ✅ |
| **Reports** | | |
| View past events | ✅ | ✅ |
| View past event details | ✅ | ✅ |
| Download past CSVs | ✅ | ✅ |
| Delete past events | ✅ | ✅ |
| **System** | | |
| View system info | ✅ | ✅ |
| Clear all data | ✅ | ❌ |
| Logout | ✅ | ✅ |

---

## 🎯 Staff Capabilities

### What Staff CAN Do

✅ **Event Management**
- Create new events with location
- Set event details (name, date, time, duration)
- Share event codes with students
- Monitor live attendance
- End events when complete

✅ **Attendance Management**
- Add single students manually
- Upload bulk attendance via CSV
- View all attendance records
- Download attendance reports

✅ **Historical Data**
- View all past events
- Access detailed attendance lists
- Download CSV for any event
- Review event statistics

✅ **Real-Time Operations**
- Monitor active event
- See students as they check in
- Add late arrivals manually
- Handle technical issues

### What Staff CANNOT Do

❌ **Administrative Functions**
- Change administrator password
- Create other staff accounts
- Delete staff users
- Modify staff permissions

❌ **System Management**
- Clear all system data
- Reset database
- Change system settings
- Modify security settings

---

## 🔍 Visual Indicators

### User Role Display

Staff users will see their role displayed in the User Info Bar:

**Admin View:**
```
┌─────────────────────────────────────┐
│ 🛡️ Admin               [Logout]     │
│    Administrator                    │
└─────────────────────────────────────┘
```

**Staff View:**
```
┌─────────────────────────────────────┐
│ 👥 john_staff          [Logout]     │
│    Staff Member                     │
└─────────────────────────────────────┘
```

### Settings Page Differences

**Admin sees:**
- ✅ Change Admin Password section
- ✅ Staff Management section
- ✅ Manual Attendance section
- ✅ System Information
- ✅ Clear All Data button

**Staff sees:**
- ❌ Change Admin Password (hidden)
- ❌ Staff Management (hidden)
- ✅ Manual Attendance section
- ✅ System Information (limited)
- ❌ Clear All Data (hidden)

---

## 🛠️ Managing Staff Users

### Viewing Staff List (Admin Only)

Location: **Settings → Staff Management**

Each staff user card shows:
- 👤 Username
- 📅 Creation date
- 🗑️ Delete button

### Deleting Staff Users

1. Navigate to Settings → Staff Management
2. Find the staff user card
3. Click the red **Trash** icon
4. Confirm deletion
5. Staff user is removed immediately
6. Staff member can no longer login

### Password Management

**Current Limitation:**
- Staff cannot change their own passwords
- Admin must delete and recreate staff accounts for password changes

**Future Enhancement:**
- Staff self-service password change
- Password reset functionality
- Email-based password recovery

---

## 💡 Use Cases

### Scenario 1: Multiple Event Coordinators

**Problem:** Large department with multiple events

**Solution:**
```
Admin creates staff accounts for:
- Event Coordinator 1 (morning events)
- Event Coordinator 2 (afternoon events)
- Event Coordinator 3 (evening events)

Each can manage their own events independently
```

### Scenario 2: Faculty Assistance

**Problem:** Faculty members need to mark attendance

**Solution:**
```
Admin creates:
- prof_kumar (for CS department)
- prof_sharma (for IT department)
- prof_patel (for AI/ML department)

Each professor manages their course events
```

### Scenario 3: Department Volunteers

**Problem:** Student volunteers help with large events

**Solution:**
```
Admin creates temporary staff accounts:
- volunteer_desk1
- volunteer_desk2
- volunteer_desk3

Can mark attendance during event
Delete accounts after event ends
```

---

## 🔒 Security Best Practices

### For Administrators

✅ **Do:**
- Create staff accounts only for trusted individuals
- Use strong, unique passwords for each staff account
- Remove staff access when no longer needed
- Regularly review staff user list
- Monitor activity in past events

❌ **Don't:**
- Share admin credentials with staff
- Use simple passwords like "password123"
- Leave inactive staff accounts enabled
- Give staff access without proper authorization

### For Staff Users

✅ **Do:**
- Keep credentials confidential
- Logout after completing tasks
- Report suspicious activity
- Use secure devices
- Verify student identities for manual entry

❌ **Don't:**
- Share your staff credentials
- Login from public computers
- Leave session unattended
- Attempt to access admin features

---

## 📋 Quick Reference

### Admin Quick Actions

| Action | Location | Steps |
|--------|----------|-------|
| Create Staff | Settings → Staff Management | Add New Staff User |
| View Staff | Settings → Staff Management | See list |
| Delete Staff | Settings → Staff Management | Click trash icon |
| Check Staff Count | Settings → System Info | View "Staff Users" |

### Staff Quick Actions

| Action | Location | Steps |
|--------|----------|-------|
| Login | Admin Portal → Staff Tab | Enter credentials |
| Create Event | Create Event Tab | Fill form |
| Manual Entry | Settings → Manual Attendance | Add student |
| Download CSV | Active/Past Event | Download button |

---

## 🐛 Troubleshooting

### Staff Cannot Login

**Symptoms:**
- "Invalid staff credentials" error

**Solutions:**
1. Verify username (case-sensitive)
2. Check password (case-sensitive)
3. Ensure staff account still exists
4. Contact admin to verify account

### Staff Sees Admin Features

**Issue:** Should not happen if implemented correctly

**Steps:**
1. Logout completely
2. Clear browser cache
3. Login again with staff credentials
4. If persists, report to admin

### Staff Account Disappeared

**Possible Causes:**
- Admin deleted the account
- System data was cleared
- localStorage was cleared

**Solution:**
- Contact administrator to recreate account

---

## 📊 Staff User Data Storage

### localStorage Keys

```javascript
{
  "staffUsers": [
    {
      "id": "1234567890",
      "username": "john_staff",
      "password": "hashedpass",
      "createdAt": "2025-11-06T00:00:00.000Z"
    }
  ]
}
```

### Data Persistence

- ✅ Staff accounts persist across sessions
- ✅ Survives page refreshes
- ❌ Lost if localStorage cleared
- ❌ Lost if browser data cleared

**Backup Recommendation:**
- Admin should maintain offline list of staff credentials
- Document who has access
- Record creation dates

---

## ⚙️ Advanced Configuration

### Adding More Staff Permissions (Future)

Potential enhancements:
- Role-based permissions (Viewer, Editor, Manager)
- Department-specific access
- Time-based access (temp accounts)
- Audit logs for staff actions
- Two-factor authentication

### Custom Staff Roles

Could be implemented:
```javascript
{
  "role": "staff",
  "permissions": {
    "createEvents": true,
    "manualEntry": true,
    "viewReports": true,
    "downloadCSV": false  // Restricted
  }
}
```

---

## 📞 Support

### For Staff Users
- Contact your administrator for:
  - Account creation
  - Password resets
  - Permission questions
  - Technical issues

### For Administrators
- Review this documentation
- Check SETTINGS_GUIDE.md
- Check QUICK_REFERENCE.md
- Contact technical support if needed

---

**Version:** 3.0 with Staff User Management  
**Last Updated:** November 6, 2025  
**Feature Status:** ✅ Production Ready
