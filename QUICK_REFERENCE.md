# Quick Reference - Admin Settings Features

## 🎯 Quick Actions

| Action | Location | Steps |
|--------|----------|-------|
| **Change Password** | Settings Tab | Settings → Change Password → Enter current & new password |
| **Add Single Student** | Settings Tab | Settings → Add Manual → Fill form → Add Student |
| **Bulk Upload** | Settings Tab | Settings → Bulk Upload → Choose CSV file |
| **Quick Manual Add** | Active Event | Active Event → "Add Manual" button → Settings |
| **View Manual Entries** | Active Event | Blue-highlighted rows with ✏️ icon |
| **Clear All Data** | Settings Tab | Settings → System Info → Clear All Data button |

---

## 📊 CSV Upload Format

```csv
Name,USN,Email
Rahul Kumar,1MS21CS001,rahul.kumar@bmsit.in
Priya Sharma,1MS21CS002,priya.sharma@bmsit.in
```

**Rules:**
- ✅ Comma-separated values
- ✅ Header row optional
- ✅ Unique USNs only
- ❌ No duplicates
- ❌ No empty fields

---

## 🔐 Password Info

| Type | Password | Location |
|------|----------|----------|
| **Default** | `aiml2024admin` | Config file |
| **Custom** | Your password | localStorage |
| **Minimum** | 6 characters | Validation |

**Reset:** Clear browser data or use "Clear All Data"

---

## 👁️ Visual Indicators

### Manual Attendance Markers

| Indicator | Meaning |
|-----------|---------|
| 🔹 Blue background | Manually added entry |
| ✏️ Edit icon | Manual entry badge |
| "Manual" status | Green badge with checkmark |
| Regular row | Student-submitted entry |

---

## ⌨️ Navigation Tabs

```
┌─────────────────────────────────────────┐
│ [Active Event] [Past Events] [Settings] │
└─────────────────────────────────────────┘
```

- **Active Event** - Current event & real-time attendance
- **Past Events** - Historical data & completed events  
- **Settings** - Password, manual entry, bulk upload

---

## 🚀 Common Workflows

### 1️⃣ First-Time Setup
```
1. Login with default password (aiml2024admin)
2. Settings → Change Password
3. Create first event
```

### 2️⃣ Add Single Missed Student
```
1. Settings → Add Attendance Manually
2. Add Single Student
3. Fill: Name, USN, Email
4. Submit
```

### 3️⃣ Bulk Upload Class List
```
1. Create CSV file (Name, USN, Email)
2. Settings → Bulk Upload
3. Choose file
4. Review results alert
```

### 4️⃣ Quick Manual Add During Event
```
1. Active Event view
2. Click "Add Manual" button
3. Redirects to Settings
4. Add student details
```

### 5️⃣ Download & Clear Data
```
1. Active Event → Download CSV
2. Past Events → Download all events
3. Settings → Clear All Data (if needed)
```

---

## 📱 Button Colors Guide

| Color | Purpose | Examples |
|-------|---------|----------|
| 🔵 **Blue** | Navigation, Info | Settings tab, Add Manual |
| 🟢 **Green** | Success, Download | Download CSV, Add Student |
| 🟣 **Purple** | Primary Action | Create Event, Change Password |
| 🔴 **Red** | Danger, Delete | End Event, Clear Data |
| ⚪ **Gray** | Cancel, Back | Cancel forms, Back buttons |

---

## ⚡ Keyboard Tips

- **Tab** - Move between fields
- **Enter** - Submit forms
- **Esc** - Close modals
- **Shift+Tab** - Move backward

---

## 🔢 Attendance Count

```
Total Attendance = Auto + Manual
├── Auto: Student-submitted (GPS verified)
└── Manual: Admin-added (Settings panel)
```

**Status Labels:**
- ✅ "Verified" - Auto (GPS location verified)
- ✅ "Manual" - Manually added by admin
- ❌ "Failed" - Verification failed

---

## 💾 Data Storage

| Item | Storage Key | Persistent |
|------|-------------|------------|
| Admin Password | `adminPassword` | ✅ Yes |
| Active Event | `activeEvent` | ✅ Yes |
| Past Events | `pastEvents` | ✅ Yes |
| Attendance | `attendance_[CODE]` | ✅ Yes |

**Backup:** Download CSV before clearing data!

---

## 🎓 Student vs Manual Entry

### Student-Submitted Entry
```json
{
  "name": "Rahul Kumar",
  "usn": "1MS21CS001",
  "email": "rahul@bmsit.in",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "distance": 25,
  "status": "verified",
  "manualEntry": false
}
```

### Manual Entry
```json
{
  "name": "Priya Sharma",
  "usn": "1MS21CS002",
  "email": "priya@bmsit.in",
  "latitude": 0,
  "longitude": 0,
  "distance": 0,
  "status": "verified",
  "manualEntry": true  ← Flag
}
```

---

## 🔄 Data Flow

```
┌──────────────┐
│ Admin Action │
└──────┬───────┘
       │
       ├─→ Password Change → localStorage
       │
       ├─→ Manual Entry → attendance_[CODE]
       │
       └─→ CSV Upload → attendance_[CODE]
                ↓
         ┌──────────────┐
         │ Auto-refresh │
         │  (3 seconds) │
         └──────┬───────┘
                ↓
         ┌──────────────┐
         │ Update Table │
         └──────────────┘
```

---

## 📋 Checklist: Before Event

- [ ] Change default password
- [ ] Create event with location
- [ ] Note event code
- [ ] Test manual attendance entry
- [ ] Prepare CSV backup (if needed)

## ✅ Checklist: After Event

- [ ] Download attendance CSV
- [ ] Review manual entries
- [ ] End event (moves to history)
- [ ] Archive CSV file offline
- [ ] Clear data if needed

---

## 🆘 Emergency Actions

### Lost Password
```
1. Chrome DevTools (F12)
2. Application → localStorage
3. Delete 'adminPassword'
4. Reload page
5. Login with default
```

### Duplicate Entry Error
```
1. Check attendance table
2. Search for USN
3. If exists, skip or delete old entry first
```

### CSV Upload Failed
```
1. Check file encoding (UTF-8)
2. Verify CSV format
3. Remove special characters
4. Try smaller batch
```

---

**Quick Help:** See SETTINGS_GUIDE.md for detailed instructions  
**Demo:** See DEMO_INSTRUCTIONS.md for testing scenarios
