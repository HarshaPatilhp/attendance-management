# Demo Instructions - AIML Attendance System

## Quick Test Guide

### Testing the Complete Flow

1. **Create an Event (Admin)**
   - Navigate to Admin Portal
   - Login with password: `aiml2024admin`
   - Click "Get Current Location"
   - Fill in event details:
     - Name: "AI/ML Workshop Demo"
     - Date: Today's date
     - Time: Current time
     - Duration: 60 minutes
   - Click "Create Event"
   - Note the 6-digit event code displayed

2. **Mark Attendance (Student)**
   - Open the app in a new tab/window
   - Click "Student Portal"
   - Fill in your details:
     - Name: "John Doe"
     - USN: "1MS21CS001"
     - Email: "john.doe@bmsit.in"
     - Event Code: [Enter the code from step 1]
   - Allow location access when prompted
   - Submit attendance

3. **View Real-time Updates (Admin)**
   - Go back to Admin Portal tab
   - The attendance record should appear within 3 seconds
   - You'll see the student's details in the table

4. **End Event and View History**
   - Click "End Event" button
   - Navigate to "Past Events" tab
   - You'll see your completed event with attendance count
   - Click the eye icon to view full details
   - Click download icon to get CSV export

## Features Demonstration

### ✅ Past Events History
- All completed events are stored in browser localStorage
- Access via "Past Events" tab in admin portal
- Shows event name, date, time, and attendance count
- Each event card has action buttons:
  - 👁️ **View**: See full event details and attendance records
  - 💾 **Download**: Export attendance as CSV
  - 🗑️ **Delete**: Remove event from history

### ✅ Real-time Attendance Tracking
- Admin dashboard auto-refreshes every 3 seconds
- New attendance submissions appear automatically
- No page refresh needed

### ✅ Data Persistence
- Active events persist across page refreshes
- Past events stored permanently (until cleared)
- Attendance records saved with each event

### ✅ Location Verification
- Students must be within 50m of event location
- Distance calculated using Haversine formula
- GPS coordinates stored with each attendance record

### ✅ Duplicate Prevention
- Each USN can mark attendance only once per event
- System checks existing records before submission

## Testing Location Verification

**Note**: Since you're likely testing on the same device for both admin and student:

1. **Same Location Test**:
   - Create event as admin
   - Mark attendance as student
   - Should succeed (both at same location)

2. **Distance Test** (Advanced):
   - You can modify `MAX_DISTANCE_METERS` in `src/config.js` to test distance validation
   - Set to a very small value (e.g., 1 meter) to simulate being too far

## Sample Test Data

### Admin Login
```
Password: aiml2024admin
```

### Sample Student Data
```
Student 1:
Name: Rahul Kumar
USN: 1MS21CS001
Email: rahul.kumar@bmsit.in

Student 2:
Name: Priya Sharma
USN: 1MS21CS002
Email: priya.sharma@bmsit.in

Student 3:
Name: Amit Patel
USN: 1MS21CS003
Email: amit.patel@bmsit.in
```

### Sample Events
```
Event 1:
Name: Introduction to Machine Learning
Date: Current date
Time: Current time
Duration: 90 minutes

Event 2:
Name: Deep Learning Workshop
Date: Current date
Time: Current time + 2 hours
Duration: 120 minutes
```

## CSV Export Format

Downloaded CSV files contain:
```
Name,USN,Email,Time,Status
Rahul Kumar,1MS21CS001,rahul.kumar@bmsit.in,11/5/2025 11:45 PM,verified
Priya Sharma,1MS21CS002,priya.sharma@bmsit.in,11/5/2025 11:46 PM,verified
```

## Clearing Data

To reset all data:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Click "localStorage" 
4. Click "Clear All" or delete specific items:
   - `activeEvent` - Current active event
   - `pastEvents` - Event history
   - `attendance_[CODE]` - Attendance records for specific event

## Known Limitations

1. **Browser Storage**: Data stored in localStorage (browser-specific)
   - Not shared across devices
   - Clearing browser data will delete all records

2. **Location Services**: Requires HTTPS or localhost
   - Must allow location permissions
   - Accuracy depends on device GPS

3. **Single Active Event**: Only one event can be active at a time
   - End current event before creating new one

## Production Deployment Notes

For production use, implement:
- Backend API for data storage
- Database (MySQL, MongoDB, etc.)
- Google Sheets integration for data export
- User authentication system
- HTTPS for secure location access
- Rate limiting for API endpoints

## Troubleshooting

### Attendance not appearing in admin panel
- Wait 3-5 seconds for auto-refresh
- Check if event codes match
- Verify localStorage has `attendance_[CODE]` key

### Location permission denied
- Check browser location settings
- Ensure HTTPS or localhost
- Try different browser

### Event code invalid
- Verify event is still active (not ended)
- Check for typos in code entry
- Ensure admin created event successfully

---

**For Support**: Contact your course instructor or check the main README.md file.
