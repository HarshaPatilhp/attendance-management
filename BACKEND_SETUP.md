# 🚀 Backend Setup: Google Sheets API (5 Minutes)

## ✅ What This Does
- **Replaces localStorage** with Google Sheets cloud storage
- **Enables multi-device attendance** - anyone can mark attendance from any device
- **Centralized data** - all events and attendance stored in Google Sheets
- **No database setup** - Google Sheets is your database!

## 📋 Step-by-Step Setup

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Click "Blank" to create new sheet
3. Name it: `AIML Attendance System`
4. Copy the Sheet ID from URL:
   - URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Copy: `YOUR_SHEET_ID_HERE` (the long string)

### Step 2: Add Apps Script
1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any default code
3. **Copy the entire script below** and paste it:

```javascript
// PASTE THE ENTIRE SCRIPT FROM google-apps-script/Code.gs HERE
```

4. **Update the Sheet ID** on line 18:
   ```javascript
   const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
   ```

5. **Save** (Ctrl+S or click Save button)

### Step 3: Initialize Database
1. In Apps Script: Select `testInitialize` from dropdown
2. Click **Run** (▶️)
3. **Authorize** the script when prompted
4. Go back to your Google Sheet - you should see 4 new sheets:
   - Settings
   - Staff
   - Events
   - Attendance

### Step 4: Deploy as Web App
1. In Apps Script: Click **Deploy → New deployment**
2. Click gear icon ⚙️ → Choose **Web app**
3. Settings:
   - **Execute as:** Me (your@email.com)
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### Step 5: Update React App
1. Open `src/config.js`
2. Replace the placeholder URL:
   ```javascript
   GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_ACTUAL_URL/exec',
   ```
3. Keep `USE_SHARED_STORAGE: true`

### Step 6: Rebuild & Deploy
```bash
npm run build
# Then deploy dist folder to Netlify
```

## 🎯 What Happens Now

### ✅ Multi-Device Support
- **Admin creates event** on any device → stored in Google Sheets
- **Students mark attendance** from any device → fetches from Google Sheets
- **Real-time updates** - all devices see same data

### ✅ Centralized Storage
- **No more localStorage** - everything in Google Sheets
- **Data persists** forever in your Google account
- **Export anytime** - CSV, Excel, PDF
- **Share with staff** - multiple admins possible

### ✅ API Endpoints Available
- `GET /exec?action=getActiveEvent` - Get current event
- `GET /exec?action=getAttendance&eventCode=ABC123` - Get attendance
- `POST /exec` - Create events, add attendance, etc.

## 🧪 Test Your Backend

1. **Create event** as admin
2. **Open student portal** on different device/browser
3. **Enter event code** - should work! ✅
4. **Mark attendance** - data appears in Google Sheet ✅

## 🔒 Security

- ✅ **Your Google account** controls all data
- ✅ **HTTPS encryption** for all requests
- ✅ **Password protection** for admin access
- ✅ **Event codes** prevent unauthorized access

## 💰 Cost: FREE!

- ✅ **Google Sheets:** Free
- ✅ **Apps Script:** Free (20k API calls/day)
- ✅ **Netlify:** Free hosting
- ✅ **No database fees**

## 🚀 Advanced Features

Once setup, you get:
- **Multi-admin support** - multiple staff can manage
- **Real-time attendance** - see updates instantly
- **Data export** - download CSVs anytime
- **Version history** - Google tracks all changes
- **Scalable** - handle 1000+ students

## 📞 Need Help?

**If setup fails:**
1. Check Sheet ID is correct
2. Verify Apps Script permissions
3. Check browser console for errors
4. Make sure "Who has access" is "Anyone"

**Test endpoints:**
- Visit: `YOUR_URL/exec?action=init` - should initialize sheets
- Visit: `YOUR_URL/exec?action=getActiveEvent` - should return JSON

---

**Setup Time:** 5 minutes  
**Result:** Full cloud backend!  
**Cost:** $0 forever  

**Your attendance system now works across ALL devices!** 🎉
