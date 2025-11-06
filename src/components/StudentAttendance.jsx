import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Mail, Hash, KeyRound, MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { CONFIG } from '../config';
import { calculateDistance, validateEmail } from '../utils';
import { EventsAPI, AttendanceAPI, isGoogleSheetsEnabled } from '../services/googleSheetsAPI';

function StudentAttendance() {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    eventCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMessage('');

    try {
      if (!validateEmail(formData.email, CONFIG.COLLEGE_EMAIL_DOMAIN)) {
        throw new Error(`Please use your college email (${CONFIG.COLLEGE_EMAIL_DOMAIN})`);
      }

      const position = await getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      await simulateAttendanceSubmission(position);

    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          let errorMessage = 'Unable to get your location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout for mobile
          maximumAge: 300000, // Cache location for 5 minutes
        }
      );
    });
  };

  const checkExistingAttendance = useCallback(async (usn, eventCode) => {
    if (!usn || !eventCode || !isGoogleSheetsEnabled()) {
      setAlreadyMarked(false);
      return;
    }

    try {
      const existingRecords = await AttendanceAPI.getAttendance(eventCode.toUpperCase());
      const hasMarked = existingRecords.some(
        (record) => record.usn.toUpperCase() === usn.toUpperCase()
      );
      setAlreadyMarked(hasMarked);
    } catch (error) {
      console.error('Error checking existing attendance:', error);
      setAlreadyMarked(false);
    }
  }, []);

  // Debounced version of checkExistingAttendance
  const debouncedCheckAttendance = useMemo(() => {
    let timeoutId;
    return (usn, eventCode) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkExistingAttendance(usn, eventCode);
      }, 500); // 500ms debounce
    };
  }, [checkExistingAttendance]);

  // Optimized form data update
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Trigger attendance check when USN or eventCode changes
      if (field === 'usn' || field === 'eventCode') {
        if (newData.usn && newData.eventCode) {
          debouncedCheckAttendance(newData.usn, newData.eventCode);
        } else {
          setAlreadyMarked(false);
        }
      }
      
      return newData;
    });
  }, [debouncedCheckAttendance]);

  const simulateAttendanceSubmission = useCallback(async (position) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!isGoogleSheetsEnabled()) {
      throw new Error('System is not configured for shared attendance. Please contact administrator.');
    }

    // Verify event code using Google Sheets API
    const activeEvent = await EventsAPI.getActiveEvent();
    if (!activeEvent) {
      throw new Error('No active event found. Please check the event code.');
    }

    if (activeEvent.code !== formData.eventCode.toUpperCase()) {
      throw new Error('Invalid event code. Please check and try again.');
    }

    // Check distance from event location
    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      activeEvent.location.latitude,
      activeEvent.location.longitude
    );

    if (distance > CONFIG.MAX_DISTANCE_METERS) {
      throw new Error(`You are ${Math.round(distance)}m away from the event location. You must be within ${CONFIG.MAX_DISTANCE_METERS}m.`);
    }

    // Check for duplicate attendance using Google Sheets API
    const existingRecords = await AttendanceAPI.getAttendance(activeEvent.code);
    const alreadyMarked = existingRecords.find(
      (record) => record.usn.toUpperCase() === formData.usn.toUpperCase()
    );

    if (alreadyMarked) {
      throw new Error('You have already marked attendance for this event.');
    }

    // Create attendance record
    const attendanceRecord = {
      eventCode: activeEvent.code,
      name: formData.name,
      usn: formData.usn.toUpperCase(),
      email: formData.email,
      timestamp: new Date().toLocaleString(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      distance: Math.round(distance),
      status: 'verified',
      manualEntry: false,
      addedBy: 'Student'
    };

    // Save attendance record using Google Sheets API
    await AttendanceAPI.addAttendance(attendanceRecord);

    setStatus('Success');
    setMessage('🪄🤖 Presence confirmed — machine learning magic activated!.');
    
    setTimeout(() => {
      setFormData({ name: '', usn: '', email: '', eventCode: '' });
      setStatus(null);
      setMessage('');
    }, 5000);
  }, [formData]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mark Your Attendance</h2>
          <p className="text-gray-600">Fill in your details to check in to the event</p>
        </div>

        {/* System Status Banner */}
        {!isGoogleSheetsEnabled() && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">System Not Configured</p>
                <p className="text-sm text-red-700">
                  Attendance marking requires system configuration. Please contact your administrator to set up cloud storage for multi-device support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* {isGoogleSheetsEnabled() && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">System Ready</p>
                <p className="text-sm text-green-700">
                  Attendance system is configured and ready. You can mark attendance.
                </p>
              </div>
            </div>
          </div>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              USN (University Seat Number)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.usn}
                onChange={(e) => updateFormData('usn', e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="e.g., 1MS21CS001"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`your.name${CONFIG.COLLEGE_EMAIL_DOMAIN}`}
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Must be a valid {CONFIG.COLLEGE_EMAIL_DOMAIN} email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.eventCode}
                onChange={(e) => updateFormData('eventCode', e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider text-lg font-semibold"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Get the event code from your instructor
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Location Required</p>
                <p className="text-sm text-gray-700">
                  We will verify your location to ensure you're physically present at the event.
                  Please enable location services when prompted.
                </p>
              </div>
            </div>
          </div>

          {status && (
            <div
              className={`p-4 rounded-lg border ${
                status.toLowerCase() === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start">
                {status.toLowerCase() === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      status.toLowerCase() === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {status.toLowerCase() === 'success' ? 'Success!' : 'Error'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      status.toLowerCase() === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-4 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Mark my attendance.'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Notes:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You can only mark attendance once per event</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>You must be within 50 meters of the event location</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Location permissions are required to verify your presence</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Make sure you're using your official college email address</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentAttendance);
