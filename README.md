# AIML Attendance Management System

A secure, location-verified attendance tracking system built with React and Vite for BMSIT college events.

## 🚀 Features

- **Admin Portal**: Create and manage events with unique codes
- **Student Portal**: Mark attendance with location verification
- **Anti-Proxy Protection**: GPS-based location verification
- **Email Validation**: College email domain verification (@bmsit.in)
- **Real-time Tracking**: Live attendance monitoring
- **CSV Export**: Download attendance records

## 📋 Prerequisites

- Node.js (v14 or higher)
- Modern web browser with location services
- Internet connection

## 🛠️ Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🔧 Configuration

Edit `src/config.js` to customize:

```javascript
export const CONFIG = {
  ADMIN_PASSWORD: 'aiml2024admin',           // Change admin password
  GOOGLE_SCRIPT_URL: 'YOUR_URL_HERE',        // Add Google Apps Script URL
  MAX_DISTANCE_METERS: 50,                   // Maximum distance from event
  COLLEGE_EMAIL_DOMAIN: '@bmsit.in'          // Your college email domain
};
```

## 📖 How to Use

### For Administrators

1. **Access Admin Portal**
   - Click "Admin Portal" on home page
   - Login with password (default: `aiml2024admin`)

2. **Create Event**
   - Fill in event details (name, date, time, duration)
   - Click "Get Current Location" to set event location
   - Submit to generate unique event code

3. **Share Event Code**
   - Share the 6-digit code with students
   - Monitor attendance in real-time
   - Download CSV when complete

4. **End Event**
   - Click "End Event" when done
   - Download attendance records

### For Students

1. **Access Student Portal**
   - Click "Student Portal" on home page

2. **Fill Details**
   - Enter full name
   - Enter USN (University Seat Number)
   - Enter college email (@bmsit.in)
   - Enter event code from instructor

3. **Submit**
   - Allow location permissions when prompted
   - Wait for verification
   - Confirmation message on success

## 🔐 Security Features

- ✅ **Location Verification**: Students must be within 50m of event location
- ✅ **Email Validation**: Only college emails accepted
- ✅ **Unique Codes**: Random 6-character event codes
- ✅ **One-time Attendance**: Prevents duplicate submissions
- ✅ **Password Protected**: Admin access requires authentication

## 📊 Google Sheets Integration (Optional)

To save attendance to Google Sheets:

1. Create a Google Apps Script
2. Deploy as Web App
3. Add URL to `CONFIG.GOOGLE_SCRIPT_URL`

Example Apps Script:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.name,
    data.usn,
    data.email,
    data.eventCode,
    data.latitude,
    data.longitude
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🏗️ Project Structure

```
attendance-management/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx    # Admin interface
│   │   └── StudentAttendance.jsx # Student interface
│   ├── App.jsx                   # Main app component
│   ├── config.js                 # Configuration
│   ├── utils.js                  # Utility functions
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3
- **Icons**: Lucide React
- **Location**: Geolocation API

## 🚨 Troubleshooting

### Location Not Working
- Enable location services in browser
- Allow location permissions when prompted
- Check if HTTPS is enabled (required for geolocation)

### Admin Login Fails
- Verify password in `src/config.js`
- Default password: `aiml2024admin`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 13+)
- Opera: ✅ Full support

## 📝 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🔒 Security Notes

1. Change default admin password before deployment
2. Use HTTPS in production for geolocation
3. Implement backend validation for production use
4. Add rate limiting to prevent abuse
5. Store event data securely

## 📄 License

This project is for educational purposes at BMSIT College.

## 👥 Support

For issues or questions, contact your course instructor.

---

**Made with ❤️ for BMSIT AIML Department**
