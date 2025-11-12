import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
// Lazy load icons
const User = lazy(() => import('lucide-react').then(module => ({ default: module.User })));
const Mail = lazy(() => import('lucide-react').then(module => ({ default: module.Mail })));
const Hash = lazy(() => import('lucide-react').then(module => ({ default: module.Hash })));
const KeyRound = lazy(() => import('lucide-react').then(module => ({ default: module.KeyRound })));
const MapPin = lazy(() => import('lucide-react').then(module => ({ default: module.MapPin })));
const LoaderIcon = lazy(() => import('lucide-react').then(module => ({ default: module.Loader })));
const CheckCircle = lazy(() => import('lucide-react').then(module => ({ default: module.CheckCircle })));
const AlertCircle = lazy(() => import('lucide-react').then(module => ({ default: module.AlertCircle })));
import { CONFIG } from '../config';
import { validateEmail } from '../utils';
import { isGoogleSheetsEnabled } from '../services/googleSheetsAPI';
import { EventsStorage, AttendanceStorage } from '../services/storageAdapter';
import { getCurrentLocation, validateLocation, checkForProxy } from '../utils/geolocation';

// Memoized form input component
const FormInput = React.memo(({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
    <input
      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    />
  </div>
));

function StudentAttendance() {
  // Memoize initial form state
  const initialFormState = useMemo(() => ({
    name: '',
    usn: '',
    email: '',
    eventCode: ''
  }), []);

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  // Check if student has already marked attendance for this event
  const checkExistingAttendance = useCallback(async (usn, eventCode) => {
    if (!usn || !eventCode) {
      setAlreadyMarked(false);
      return false;
    }

    try {
      const existingRecords = await AttendanceStorage.getAttendance(eventCode.toUpperCase());
      const hasMarked = existingRecords.some(
        (record) => record.usn?.toUpperCase() === usn.toUpperCase()
      );
      setAlreadyMarked(hasMarked);
      return hasMarked;
    } catch (error) {
      console.error('Error checking existing attendance:', error);
      setAlreadyMarked(false);
      return false;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMessage('');
    setAlreadyMarked(false);

    try {
      // Basic validation
      if (!formData.name || !formData.usn || !formData.email || !formData.eventCode) {
        throw new Error('All fields are required');
      }

      if (!validateEmail(formData.email, CONFIG.COLLEGE_EMAIL_DOMAIN)) {
        throw new Error(`Please use your college email (${CONFIG.COLLEGE_EMAIL_DOMAIN})`);
      }

      // Check for proxy/VPN
      setMessage('Checking for proxy/VPN...');
      const proxyCheck = await checkForProxy();
      if (proxyCheck.isUsingProxy) {
        throw new Error('Proxy/VPN detected. Please disable it to mark attendance.');
      }

      // Get and validate active event
      setMessage('Verifying event...');
      const event = await EventsStorage.getActiveEvent();
      if (!event || event.code?.toUpperCase() !== formData.eventCode.toUpperCase()) {
        throw new Error('Invalid event code');
      }

      // Check if already marked attendance
      setMessage('Checking existing attendance...');
      const hasMarkedAttendance = await checkExistingAttendance(formData.usn, event.code);
      if (hasMarkedAttendance) {
        throw new Error('You have already marked attendance for this event');
      }

      // Get current location
      setMessage('Verifying your location...');
      const currentLocation = await getCurrentLocation();
      
      // Validate location
      // Normalize event location shape to { lat, lng }
      const eventLocation = event.location?.lat !== undefined
        ? { lat: event.location.lat, lng: event.location.lng }
        : { lat: event.location?.latitude, lng: event.location?.longitude };
      const locationValidation = validateLocation(currentLocation, eventLocation, CONFIG.MAX_DISTANCE_METERS || 100);
      if (!locationValidation.isValid) {
        throw new Error(locationValidation.message);
      }

      // Submit attendance
      setMessage('Submitting attendance...');
      const timestamp = new Date().toISOString();
      
      await AttendanceStorage.addAttendance(event.code, {
        name: formData.name,
        usn: formData.usn.toUpperCase(),
        email: formData.email,
        timestamp,
        status: 'verified',
        location: currentLocation,
        deviceInfo: navigator.userAgent
      });

      // Update UI
      setStatus('success');
      setMessage('Attendance marked successfully!');
      setFormData(initialFormState);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);

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
  // Debounced form update
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'usn' || field === 'eventCode' ? value.toUpperCase() : value
    }));
  }, []);

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Could not get IP address:', error);
      return ''; // Return empty string if we can't get the IP
    }
  };

  const simulateAttendanceSubmission = useCallback(async (position) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!isGoogleSheetsEnabled()) {
      throw new Error('System is not configured for shared attendance. Please contact administrator.');
    }

    // Get client IP address
    const ipAddress = await getClientIP();

    // Verify event code using Google Sheets API
    const activeEvent = await EventsAPI.getActiveEvent();
    if (!activeEvent) {
      throw new Error('No active event found. Please check the event code.');
    }

    if (activeEvent.code !== formData.eventCode.toUpperCase()) {
      throw new Error('Invalid event code. Please check the code and try again.');
    }

    // Check distance from event location
    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      activeEvent.location.latitude,
      activeEvent.location.longitude
    );

    if (distance > CONFIG.MAX_DISTANCE_METERS) {
      throw new Error('Unable to verify your location. Please make sure you are at the correct event location and try again. If the issue persists, contact your teacher or admin.');
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
      addedBy: 'Student',
      ipAddress: ipAddress
    };

    // Save attendance record using Google Sheets API
    const result = await AttendanceAPI.addAttendance(attendanceRecord);
    
    // If there was an error from the server (like duplicate IP), throw it
    if (result && result.error) {
      throw new Error(result.error);
    }

    setStatus('Success');
    setMessage('🪄🤖 Presence confirmed — machine learning magic activated!.');
    
    setTimeout(() => {
      setFormData({ name: '', usn: '', email: '', eventCode: '' });
      setStatus(null);
      setMessage('');
    }, 5000);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Mark Your Attendance</h2>
                <p className="text-gray-600">Fill in your details to check in to the event</p>
              </div>

              {!isGoogleSheetsEnabled() && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-1">System Not Configured</p>
                      <p className="text-sm text-red-700">
                        Attendance marking requires system configuration. Please contact your administrator.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <FormInput
                    icon={User}
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    USN (University Seat Number)
                  </label>
                  <FormInput
                    icon={Hash}
                    type="text"
                    value={formData.usn}
                    onChange={(e) => updateFormData('usn', e.target.value)}
                    placeholder="e.g., 1MS21CS001"
                    required
                    disabled={loading}
                    className="uppercase"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College Email
                  </label>
                  <FormInput
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder={`your.name${CONFIG.COLLEGE_EMAIL_DOMAIN}`}
                    required
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Must be a valid {CONFIG.COLLEGE_EMAIL_DOMAIN} email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Code
                  </label>
                  <FormInput
                    icon={KeyRound}
                    type="text"
                    value={formData.eventCode}
                    onChange={(e) => updateFormData('eventCode', e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    disabled={loading}
                    className="uppercase tracking-wider text-lg font-semibold"
                  />
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
                      <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    '𝒨𝒂𝒓𝒌 𝒎𝒚 𝒂𝒕𝒕𝒆𝒏𝒅𝒂𝒏𝒄𝒆'
                  )}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200 md:hidden">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Notes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>You can only mark attendance once per event</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Location verification is required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Important Notes Sidebar - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Important Notes</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">You can only mark attendance once per event</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">Location verification is required</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">Enable location services when prompted</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">Use your official college email</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentAttendance);
