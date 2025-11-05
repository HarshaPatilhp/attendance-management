# 📊 Google Sheets Integration Setup Guide

## Overview

This guide will help you connect your attendance system to Google Sheets, replacing browser localStorage with cloud storage.

### ✅ Benefits of Google Sheets Integration:
- ☁️ **Cloud Storage** - Data persists across devices
- 📊 **Centralized Data** - All data in one spreadsheet
- 🔄 **Real-time Sync** - Multiple users see same data
- 📈 **Easy Analysis** - Use Google Sheets formulas/charts
- 💾 **Automatic Backup** - Google's infrastructure
- 🔗 **API Access** - Can integrate with other tools

---

## 🚀 Step-by-Step Setup

### Step 1: Create Google Sheet

1. **Go to Google Sheets**
   - Visit [https://sheets.google.com](https://sheets.google.com)
   - Create new blank spreadsheet
   - Name it: `AIML Attendance System`

2. **Get the Sheet ID**
   - Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
                                          ^^^^^^^^^^^
   ```
   - Copy the **SHEET_ID** (between `/d/` and `/edit`)
   - Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

### Step 2: Create Google Apps Script

1. **Open Script Editor**
   - In your Google Sheet
   - Click **Extensions** → **Apps Script**
   - Delete any default code

2. **Copy the Backend Code**
   - Open file: `google-apps-script/Code.gs`
   - Copy **ALL the code**
   - Paste into Apps Script editor

3. **Update Sheet ID**
   - Find this line (near top):
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
   - Replace with your actual Sheet ID:
   ```javascript
   const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```

4. **Save the Script**
   - Click **💾 Save** (or Ctrl+S)
   - Name it: `Attendance API`

---

### Step 3: Initialize the Sheets

1. **Run Initialization**
   - In Apps Script editor
   - Select function: `testInitialize`
   - Click **▶ Run**

2. **Grant Permissions**
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to Attendance API (unsafe)**
   - Click **Allow**

3. **Verify Setup**
   - Go back to your Google Sheet
   - You should now see 4 new sheets:
     - ✅ Settings
     - ✅ Staff
     - ✅ Events
     - ✅ Attendance

---

### Step 4: Deploy as Web App

1. **Start Deployment**
   - In Apps Script editor
   - Click **Deploy** → **New deployment**

2. **Configure Deployment**
   - Click **⚙️ gear icon** (Select type)
   - Choose **Web app**
   
   **Settings:**
   - Description: `Attendance System API`
   - Execute as: **Me** (your email)
   - Who has access: **Anyone**
   
   ⚠️ **Important**: Must be "Anyone" for the app to work!

3. **Deploy**
   - Click **Deploy**
   - Copy the **Web app URL**
   - It looks like:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
   
4. **Save the URL**
   - ⚠️ **IMPORTANT**: Save this URL - you'll need it!

---

### Step 5: Update React App Configuration

1. **Open config.js**
   - File: `src/config.js`

2. **Add Your Web App URL**
   ```javascript
   export const CONFIG = {
     ADMIN_PASSWORD: 'aiml2024admin',
     GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbz.../exec', // ← Paste here
     MAX_DISTANCE_METERS: 50,
     COLLEGE_EMAIL_DOMAIN: '@bmsit.in'
   };
   ```

3. **Save the file**

---

### Step 6: Test the Connection

1. **Rebuild the App**
   ```powershell
   npm run dev
   ```

2. **Open Browser Console** (F12)

3. **Check Connection**
   - Open admin portal
   - Look for console logs
   - Should see: "Google Sheets API connected"

4. **Test Login**
   - Try logging in as admin
   - Default password: `aiml2024admin`
   - If it works, connection is successful! ✅

---

## 🔄 Migrating Existing Data

If you already have data in localStorage:

### Option 1: Automatic Migration (Recommended)

1. **Open Browser Console** (F12)
2. **Run Migration**:
   ```javascript
   import { migrateLocalStorageToSheets } from './services/googleSheetsAPI';
   migrateLocalStorageToSheets();
   ```

3. **Wait for completion**
   - Watch console for progress
   - Takes 1-2 minutes depending on data size

4. **Verify in Google Sheets**
   - Check all sheets for data
   - Verify attendance records

### Option 2: Manual Migration

1. **Export Data**
   - Download CSV from each event
   - Save staff user list

2. **Import to Google Sheets**
   - Open your Google Sheet
   - Copy data to appropriate sheets

---

## 📊 Understanding the Sheet Structure

### Settings Sheet
| Key | Value | Updated |
|-----|-------|---------|
| adminPassword | aiml2024admin | 2025-11-06 |

### Staff Sheet
| ID | Username | Password | Created | Active |
|----|----------|----------|---------|--------|
| 1730... | john_staff | pass123 | 2025-11-06 | TRUE |

### Events Sheet
| Code | Name | Date | Time | Duration | Lat | Long | Status | Created | Ended |
|------|------|------|------|----------|-----|------|--------|---------|-------|
| ABC123 | Workshop | 2025-11-06 | 10:00 | 60 | 12.97 | 77.59 | active | 2025-11-06 | |

### Attendance Sheet
| EventCode | Name | USN | Email | Timestamp | Lat | Long | Distance | Status | Manual | AddedBy |
|-----------|------|-----|-------|-----------|-----|------|----------|--------|--------|---------|
| ABC123 | Student | 1MS... | s@bmsit.in | 2025-11-06 | 12.97 | 77.59 | 25 | verified | FALSE | Student |

---

## 🔧 How It Works

### Architecture

```
┌─────────────────┐
│   React App     │  (Your Attendance System)
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS Requests
         ↓
┌─────────────────┐
│ Google Apps     │  (Backend API)
│    Script       │
└────────┬────────┘
         │ Read/Write
         ↓
┌─────────────────┐
│ Google Sheets   │  (Database)
│   (Storage)     │
└─────────────────┘
```

### API Endpoints

**GET Requests:**
- `?action=getAdminPassword`
- `?action=getStaffUsers`
- `?action=getActiveEvent`
- `?action=getPastEvents`
- `?action=getAttendance&eventCode=ABC123`

**POST Requests:**
- `action: setAdminPassword`
- `action: addStaff`
- `action: deleteStaff`
- `action: createEvent`
- `action: endEvent`
- `action: addAttendance`
- `action: deleteEvent`

---

## ⚡ Performance Considerations

### Response Times
- **Read operations**: 200-500ms
- **Write operations**: 500-1500ms
- **Batch operations**: 1-3 seconds

### Quotas (Free Google Account)
- **Daily**: 20,000 URL Fetch calls
- **Per minute**: 100 URL Fetch calls
- **Script runtime**: 6 minutes per execution

**These limits are more than enough for typical use!**

---

## 🛡️ Security & Privacy

### Access Control
- ✅ Web app deployed as "Anyone" - required for anonymous access
- ✅ Google Sheet remains private (only you can edit)
- ✅ Apps Script validates data
- ✅ No sensitive data exposed in URLs

### Best Practices
1. **Don't share the Sheet directly** - only share the app URL
2. **Keep Script URL private** - don't commit to public repos
3. **Use environment variables** for production
4. **Regular backups** - File → Make a copy

### Data Privacy
- Data stored in **your Google account**
- Google's standard privacy policies apply
- You control all data
- Can export/delete anytime

---

## 🐛 Troubleshooting

### Issue: "Script not found" error

**Solutions:**
1. Check GOOGLE_SCRIPT_URL in config.js
2. Verify deployment is active
3. Redeploy the web app
4. Make sure URL ends with `/exec`

### Issue: CORS errors

**Solutions:**
1. Web app must be deployed as "Anyone"
2. Execute as "Me" (not "User accessing the web app")
3. Try incognito mode
4. Clear browser cache

### Issue: Slow performance

**Solutions:**
1. Check internet connection
2. Reduce polling frequency
3. Use batch operations
4. Consider upgrading to Google Workspace

### Issue: Permissions error

**Solutions:**
1. Reauthorize the script
2. Run `testInitialize` again
3. Check Google account permissions
4. Try removing and re-granting access

### Issue: Data not syncing

**Solutions:**
1. Check console for errors
2. Verify Sheet ID is correct
3. Check sheet names match exactly
4. Run initialization again

---

## 🔄 Updating the Backend

### When you need to modify the Apps Script:

1. **Edit the code** in Apps Script editor
2. **Save** (Ctrl+S)
3. **Deploy new version**:
   - Deploy → Manage deployments
   - Click ✏️ Edit
   - Version: New version
   - Deploy
4. **No need to change URL** - same URL works!

---

## 📊 Advanced Features

### Custom Formulas in Sheets

Add analysis sheets with formulas:

**Total Attendance:**
```
=COUNTA(Attendance!A2:A)
```

**Unique Students:**
```
=COUNTA(UNIQUE(Attendance!C2:C))
```

**Average Distance:**
```
=AVERAGE(Attendance!H2:H)
```

### Data Visualization

1. Create new sheet: "Dashboard"
2. Insert → Chart
3. Select data from other sheets
4. Beautiful graphs and charts!

### Export Options

**To CSV:**
- File → Download → CSV

**To Excel:**
- File → Download → Microsoft Excel

**To PDF:**
- File → Download → PDF

---

## 🔗 Integration with Other Tools

### Google Data Studio
- Connect Google Sheets
- Create dashboards
- Share with stakeholders

### Zapier/IFTTT
- Trigger on new attendance
- Send notifications
- Auto-generate reports

### Google Forms
- Alternative to student portal
- Responses go to sheet
- Process with Apps Script

---

## 💰 Costs

### Free Tier (Sufficient for most)
- ✅ Google Sheets: Free
- ✅ Apps Script: Free
- ✅ 20,000 requests/day: Free
- ✅ Unlimited storage*: Free

*Within Google account limits (15 GB shared)

### Paid Options (If needed)
- **Google Workspace**: $6-18/month
  - Higher quotas
  - Better support
  - Custom domains

---

## 📞 Support

### Resources
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-apps-script)

### Common Questions

**Q: Can multiple people use it simultaneously?**  
A: Yes! Google Sheets handles concurrent access.

**Q: What happens if Google is down?**  
A: The app won't work. Consider adding localStorage fallback.

**Q: Can I use my college's Google Workspace?**  
A: Yes! Works with any Google account.

**Q: Is the data secure?**  
A: Yes, same security as your Google Drive.

---

## ✅ Setup Checklist

Use this checklist to verify setup:

- [ ] Created Google Sheet
- [ ] Copied Sheet ID
- [ ] Created Apps Script
- [ ] Updated SHEET_ID in code
- [ ] Ran testInitialize
- [ ] Granted permissions
- [ ] Verified 4 sheets created
- [ ] Deployed as Web app
- [ ] Copied Web App URL
- [ ] Updated config.js with URL
- [ ] Tested connection
- [ ] Successfully logged in
- [ ] Created test event
- [ ] Verified data in sheets

---

## 🎯 Next Steps

1. ✅ Complete setup using this guide
2. 🧪 Test all features thoroughly
3. 📊 Customize sheets for your needs
4. 🔄 Migrate existing data (if any)
5. 🚀 Deploy to production
6. 📧 Share with team
7. 📈 Monitor usage

---

**Setup Time:** 15-20 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Google account, Basic understanding of APIs

**Ready to get started?** Follow Step 1! 🚀
