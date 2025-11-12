import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { AdminNav } from './AdminNav';
import { LogOut, Shield, Users, Settings, Sun, Moon, Calendar, History, Eye, Download, Trash2, Clock, UserPlus, MapPin, CheckCircle, Copy, XCircle, Edit } from 'lucide-react';
// Lazy load views
const DashboardView = lazy(() => import('./views/DashboardView'));
const CreateEventView = lazy(() => import('./views/CreateEventView'));
const PastEventsView = lazy(() => import('./views/PastEventsView'));
const SettingsView = lazy(() => import('./views/SettingsView'));
import { CONFIG } from '../config';
import { generateEventCode } from '../utils';
import { SettingsStorage, StaffStorage, EventsStorage, AttendanceStorage } from '../services/storageAdapter';

// Loading component
const ViewLoader = () => (
  <div className="flex items-center justify-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Card component for consistent UI
const Card = ({ children, className = '', title, icon: Icon }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && (
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2 text-indigo-600" />}
          {title}
        </h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Button component for consistent styling
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none';
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

// Navigation component
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if we have a valid session on initial load
    const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
    return session?.isAuthenticated || false;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const session = JSON.parse(localStorage.getItem('adminSession') || 'null');
    return session?.user || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [loginMode, setLoginMode] = useState('admin');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('create');
  const [activeEvent, setActiveEvent] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [newStaffForm, setNewStaffForm] = useState({ username: '', password: '' });
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', date: '', time: '', duration: 60 });
  const [eventLocation, setEventLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [manualAttendanceForm, setManualAttendanceForm] = useState({ name: '', usn: '', email: '' });
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [selectedPastEvent, setSelectedPastEvent] = useState(null);
  const [copied, setCopied] = useState(false);
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      let user = null;
      
      if (loginMode === 'admin') {
        // Admin login
        const savedPassword = await SettingsStorage.getAdminPassword();
        if (password !== savedPassword) {
          throw new Error('Invalid admin password');
        }
        user = { username: 'admin', role: 'admin' };
      } else {
        // Staff login
        const staffList = await StaffStorage.getStaffUsers();
        const staff = staffList.find(
          s => s.username.toLowerCase() === staffUsername.toLowerCase() && 
               s.password === password
        );
        
        if (!staff) {
          throw new Error('Invalid staff credentials');
        }
        user = { username: staffUsername, role: 'staff' };
      }
      
      // Set authentication state
      const session = { isAuthenticated: true, user };
      localStorage.setItem('adminSession', JSON.stringify(session));
      setIsAuthenticated(true);
      setCurrentUser(user);
      setViewMode('dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPassword('');
    setStaffUsername('');
    setViewMode('login');
    onLogout && onLogout();
  }, [onLogout]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(saved === 'true');
    }
  }, []);

  // Load data on mount - optimized with caching
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Load admin password (only for admin)
          if (isAdmin()) {
            SettingsStorage.getAdminPassword().then(setAdminPassword).catch(console.error);
          }

          // Load staff users (only for admin)
          if (isAdmin()) {
            StaffStorage.getStaffUsers().then(setStaffUsers).catch(console.error);
          }

          // Load events and active event
          const [pastEventsData, activeEventData] = await Promise.allSettled([
            EventsStorage.getPastEvents(),
            EventsStorage.getActiveEvent()
          ]);

          if (pastEventsData.status === 'fulfilled') {
            setPastEvents(pastEventsData.value);
          }

          if (activeEventData.status === 'fulfilled' && activeEventData.value) {
            setActiveEvent(activeEventData.value);
            setViewMode('active');

            // Load attendance records for active event (only when needed)
            try {
              const records = await AttendanceStorage.getAttendance(activeEventData.value.code);
              setAttendanceRecords(records);
            } catch (attendanceError) {
              console.error('Failed to load attendance records:', attendanceError);
            }
          }
        } catch (error) {
          console.error('Failed to load initial data:', error);
          setError('Failed to load data. Please refresh the page.');
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [isAuthenticated]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    if (newStaffForm.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (newStaffForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      console.log('Creating new staff user:', newStaffForm.username);

      // Check if username already exists
      const existingStaff = await StaffStorage.getStaffUsers();
      const usernameExists = existingStaff.find(s => s.username === newStaffForm.username);

      if (usernameExists) {
        setError('Username already exists. Please choose a different username.');
        return;
      }

      const newStaff = {
        id: Date.now().toString(),
        username: newStaffForm.username,
        password: newStaffForm.password,
        createdAt: new Date()
      };

      console.log('Adding staff to storage:', newStaff);

      await StaffStorage.addStaff(newStaff);
      console.log('Staff added successfully');

      setStaffUsers([...staffUsers, newStaff]);
      setNewStaffForm({ username: '', password: '' });
      setShowAddStaff(false);
      setError('');
      alert(`Staff user "${newStaff.username}" created successfully!`);

    } catch (error) {
      console.error('Failed to add staff:', error);
      setError(`Failed to create staff user: ${error.message}`);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await StaffStorage.deleteStaff(staffId);
      const updatedStaff = staffUsers.filter(s => s.id !== staffId);
      setStaffUsers(updatedStaff);
      setError('');
    } catch (error) {
      console.error('Failed to delete staff:', error);
      setError('Failed to delete staff user. Please try again.');
    }
  };


  const isAdmin = useCallback(() => currentUser?.role === 'admin', [currentUser?.role]);
  const isStaff = useCallback(() => currentUser?.role === 'staff', [currentUser?.role]);

  // Memoize computed values
  const attendanceCount = useMemo(() => attendanceRecords.length, [attendanceRecords.length]);
  const totalPastEvents = useMemo(() => pastEvents.length, [pastEvents.length]);
  const activeEventCode = useMemo(() => activeEvent?.code, [activeEvent?.code]);

  const handlePasswordChange = async (newPassword) => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    try {
      await SettingsStorage.setAdminPassword(newPassword);
      setAdminPassword(newPassword);
      setError('');
      return true;
    } catch (error) {
      console.error('Failed to update password:', error);
      setError('Failed to update password. Please try again.');
      return false;
    }
  };

  const handleManualAttendance = async (e) => {
    e.preventDefault();
    if (!activeEvent) {
      setError('No active event. Please create an event first.');
      return;
    }

    try {
      // Check for duplicate using storage adapter
      const existingRecords = await AttendanceStorage.getAttendance(activeEvent.code);
      const alreadyExists = existingRecords.find(
        (record) => record.usn.toUpperCase() === manualAttendanceForm.usn.toUpperCase()
      );

      if (alreadyExists) {
        setError('This USN already exists in attendance records.');
        return;
      }

      const newRecord = {
        name: manualAttendanceForm.name,
        usn: manualAttendanceForm.usn.toUpperCase(),
        email: manualAttendanceForm.email,
        timestamp: new Date().toLocaleString(),
        latitude: 0,
        longitude: 0,
        distance: 0,
        status: 'verified',
        manualEntry: true,
        addedBy: currentUser?.username || 'Admin'
      };

      // Save using storage adapter
      await AttendanceStorage.addAttendance(activeEvent.code, newRecord);

      // Update local state
      setAttendanceRecords([...attendanceRecords, newRecord]);

      // Clear form
      setManualAttendanceForm({ name: '', usn: '', email: '' });
      setError('');
      alert('Attendance marked successfully!');

    } catch (error) {
      console.error('Failed to add manual attendance:', error);
      setError('Failed to add attendance. Please try again.');
    }
  };

  const handleBulkUserUpload = async (csvText) => {
    if (!activeEvent) {
      setError('No active event. Please create an event first.');
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      const existingRecords = await AttendanceStorage.getAttendance(activeEvent.code);
      
      let addedCount = 0;
      let skippedCount = 0;

      // Skip header row if it exists
      const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [name, usn, email] = line.split(',').map(item => item.trim());
        
        if (!name || !usn || !email) {
          skippedCount++;
          continue;
        }

        // Check for duplicate
        const alreadyExists = existingRecords.find(
          (record) => record.usn.toUpperCase() === usn.toUpperCase()
        );

        if (alreadyExists) {
          skippedCount++;
          continue;
        }

        const newRecord = {
          eventCode: activeEvent.code,
          name,
          usn: usn.toUpperCase(),
          email,
          timestamp: new Date().toLocaleString(),
          latitude: 0,
          longitude: 0,
          distance: 0,
          status: 'verified',
          manualEntry: true,
          addedBy: currentUser?.username || 'Admin'
        };

        // Add using storage adapter
        await AttendanceStorage.addAttendance(activeEvent.code, newRecord);
        existingRecords.push(newRecord);
        addedCount++;
      }

      // Update local state
      setAttendanceRecords(existingRecords);

      alert(`Bulk upload completed!\nAdded: ${addedCount}\nSkipped: ${skippedCount}`);
      setError('');

    } catch (error) {
      console.error('Failed to process bulk upload:', error);
      setError('Failed to process bulk upload. Please try again.');
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setLoadingLocation(true);
    setError('');
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            let errorMessage = 'Could not get your location. ';
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Please enable location permissions in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage += 'The request to get your location timed out. Please try again.';
                break;
              default:
                errorMessage += 'An unknown error occurred.';
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
      
      const currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      
      setEventLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      setError(error.message || 'Could not get your location. Please try again or enter coordinates manually.');
      return null;
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();

    if (!eventLocation) {
      setError('Please get your current location first');
      return;
    }

    try {
      const code = generateEventCode();
      console.log('Generated event code:', code);

      const event = {
        code,
        name: eventForm.name,
        date: eventForm.date,
        time: eventForm.time,
        duration: eventForm.duration,
        location: eventLocation,
        createdAt: new Date().toISOString(),
      };

      console.log('Creating event:', event);

      await EventsStorage.saveActiveEvent(event);
      console.log('Event saved successfully');

      setActiveEvent(event);
      setAttendanceRecords([]);
      setError('');

      // Show success message with event code
      alert(`Event "${event.name}" created successfully!\n\nEvent Code: ${event.code}\n\nStudents can now mark attendance using this code.`);

      setViewMode('active');

    } catch (error) {
      console.error('Failed to create event:', error);
      setError(`Failed to create event: ${error.message}`);
    }
  };

  const endEvent = async () => {
    if (!activeEvent) return;
    
    try {
      // End the event using storage adapter
      await EventsStorage.endEvent(activeEvent);

      // Update local state
      const completedEvent = {
        ...activeEvent,
        endedAt: new Date().toISOString(),
        attendanceCount: attendanceRecords.length,
        attendanceRecords: [...attendanceRecords],
      };

      setPastEvents(prevEvents => [completedEvent, ...prevEvents]);
      
      // Clear active event in storage
      await EventsStorage.clearActiveEvent();
      
      // Reset form and state
      setActiveEvent(null);
      setEventForm({ name: '', date: '', time: '', duration: 60 });
      setEventLocation(null);
      setAttendanceRecords([]);
      setViewMode('create');
      setError('');
      
    } catch (error) {
      console.error('Failed to end event:', error);
      setError('Failed to end event. Please try again.');
    }
  };

  const copyEventCode = () => {
    navigator.clipboard.writeText(activeEvent.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAttendance = () => {
    const csv = [
      ['Name', 'USN', 'Email', 'Time', 'Status'].join(','),
      ...attendanceRecords.map(record => 
        [record.name, record.usn, record.email, record.timestamp, record.status].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${activeEvent.name}_${new Date().toISOString()}.csv`;
    a.click();
  };

  // Auto-refresh attendance records - optimized polling
  useEffect(() => {
    if (activeEvent) {
      let pollInterval;
      let pollCount = 0;

      const loadAttendanceRecords = async () => {
        try {
          const attendanceKey = `attendance_${activeEvent.code}`;
          const recordsData = localStorage.getItem(attendanceKey);

          if (recordsData) {
            const records = JSON.parse(recordsData);
            // Only update state if records actually changed
            setAttendanceRecords(prevRecords => {
              if (prevRecords.length !== records.length) {
                return records;
              }
              // Check if any records are different
              for (let i = 0; i < records.length; i++) {
                if (JSON.stringify(prevRecords[i]) !== JSON.stringify(records[i])) {
                  return records;
                }
              }
              return prevRecords; // No change, don't trigger re-render
            });
          }
        } catch (error) {
          console.error('Error polling attendance:', error);
        }
      };

      const startPolling = () => {
        // Clear any existing interval
        if (pollInterval) clearInterval(pollInterval);

        // Initial load
        loadAttendanceRecords();

        // Dynamic polling: more frequent initially, then slower
        pollInterval = setInterval(() => {
          pollCount++;

          // Only poll if window is focused and visible
          if (document.hidden || !document.hasFocus()) {
            return;
          }

          loadAttendanceRecords();

          // Adjust polling frequency based on time
          // 0-10 polls: every 2 seconds (initial rapid updates)
          // 11-30 polls: every 5 seconds
          // 30+ polls: every 15 seconds (background updates)
          if (pollCount > 30) {
            clearInterval(pollInterval);
            pollInterval = setInterval(loadAttendanceRecords, 15000);
          } else if (pollCount > 10) {
            clearInterval(pollInterval);
            pollInterval = setInterval(loadAttendanceRecords, 5000);
          }
        }, 2000);
      };

      const stopPolling = () => {
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      };

      // Start polling
      startPolling();

      // Handle visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopPolling();
        } else {
          startPolling();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        stopPolling();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [activeEvent]);

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'} flex items-center justify-center p-4 transition-colors duration-300`}>
        <div className="w-full max-w-md">
          <div className={`${darkMode ? 'bg-slate-900' : 'bg-slate-900'} backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl`}>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="flex gap-2 p-4">
                <button
                  type="button"
                  onClick={() => setLoginMode('admin')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${loginMode === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('staff')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${loginMode === 'staff' ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
                >
                  Staff
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {loginMode === 'admin' ? 'Admin Password' : 'Password'}
                </label>
                {loginMode === 'staff' && (
                  <input
                    type="text"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    className="w-full mb-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter staff username"
                    required
                  />
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                )}
                Sign In as {loginMode === 'admin' ? 'Admin' : 'Staff'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <Suspense fallback={<div className="w-5 h-5"></div>}>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Suspense>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const UserInfoBar = React.memo(() => (
    <div className={`${darkMode ? 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900' : 'bg-slate-900'} backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl`}>
      <div className="flex items-center gap-4 p-6">
        <div className={`p-3 rounded-2xl ${isAdmin() ? 'bg-indigo-500' : 'bg-blue-500'}`}>
          <Suspense fallback={<div className="w-6 h-6 bg-slate-600 rounded"></div>}>
            {isAdmin() ? (
              <Shield className="w-6 h-6 text-indigo-400" />
            ) : (
              <Users className="w-6 h-6 text-blue-400" />
            )}
          </Suspense>
        </div>
        <div>
          <p className="text-lg font-bold text-white">{currentUser?.username}</p>
          <p className="text-sm text-slate-400">
            {isAdmin() ? 'Administrator' : 'Staff Member'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 pb-6">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <Suspense fallback={<div className="w-5 h-5"></div>}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Suspense>
        </button>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setCurrentUser(null);
            setPassword('');
            onLogout && onLogout();
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  ));

  const NavigationBar = React.memo(() => null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* <UserInfoBar /> */}
        <div className="flex gap-6">
          {/* <NavigationBar /> */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeEvent ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Active Event</h2>
                    <button
                      onClick={endEvent}
                      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                    >
                      End Event
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Event Name</p>
                          <p className="font-semibold">{activeEvent?.name || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-semibold">{activeEvent?.date || 'N/A'} at {activeEvent?.time || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-semibold text-xs">
                            {activeEvent?.location?.lat ? activeEvent.location.lat.toFixed(4) : (activeEvent?.location?.latitude ? activeEvent.location.latitude.toFixed(4) : 'N/A')}, {activeEvent?.location?.lng ? activeEvent.location.lng.toFixed(4) : (activeEvent?.location?.longitude ? activeEvent.location.longitude.toFixed(4) : 'N/A')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                      <p className="text-sm opacity-90 mb-2">Event Code</p>
                      <div className="flex items-center justify-between">
                        <p className="text-4xl font-bold tracking-wider">{activeEvent?.code || ''}</p>
                        <button
                          onClick={copyEventCode}
                          className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </button>
                      </div>
                      <p className="text-sm opacity-90 mt-4">Share this code with students</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-indigo-600" />
                        Attendance ({attendanceCount})
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('settings')}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Add attendance manually"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Manual
                        </button>
                        {attendanceRecords.length > 0 && (
                          <button
                            onClick={downloadAttendance}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download CSV
                          </button>
                        )}
                      </div>
                    </div>

                    {attendanceRecords.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No attendance records yet</p>
                        <p className="text-sm mt-2">Students will appear here as they mark attendance</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">USN</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {attendanceRecords.map((record, index) => (
                              <tr key={index} className={`hover:bg-gray-50 ${record.manualEntry ? 'bg-blue-50' : ''}`}>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {record.name}
                                  {record.manualEntry && (
                                    <span className="ml-2 text-xs text-blue-600 font-semibold" title="Manually Added">
                                      <Edit className="w-3 h-3 inline" />
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{record.usn}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.timestamp}</td>
                                <td className="px-4 py-3">
                                  {record.status === 'verified' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {record.manualEntry ? 'Manual' : 'Verified'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Failed
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Create Event</h2>
                    <p className="text-sm text-gray-600 mt-1">Get your current location and create a new event.</p>
                  </div>
                  <form onSubmit={createEvent} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                        <input
                          type="text"
                          value={eventForm.name}
                          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                        <input
                          type="number"
                          min="1"
                          value={eventForm.duration}
                          onChange={(e) => setEventForm({ ...eventForm, duration: Number(e.target.value) })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        disabled={loadingLocation}
                      >
                        {loadingLocation ? 'Getting location...' : 'Use Current Location'}
                      </button>
                      {eventLocation && (
                        <span className="text-sm text-gray-600">
                          Location set: {eventLocation.lat?.toFixed(4) || eventLocation.latitude?.toFixed(4)}, {eventLocation.lng?.toFixed(4) || eventLocation.longitude?.toFixed(4)}
                        </span>
                      )}
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Create Event
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
