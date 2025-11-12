import React, { Suspense, lazy, useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Shield, Users, AlertCircle } from 'lucide-react';

// Lazy load components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const StudentAttendance = lazy(() => import('./components/StudentAttendance'));

// Loading component
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              The application encountered an error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">Technical Details</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [mode, setMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setMode(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Clear any stored credentials
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Show mode selection if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AIML Attendance System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure event attendance tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => setMode('admin')}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
                  <p className="text-gray-600">Create and manage events</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('student')}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h2>
                  <p className="text-gray-600">Mark your attendance</p>
                </div>
              </div>
            </button>
          </div>
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-6">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-medium">Time-Limited Codes</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Event codes expire automatically after the event ends</p>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-medium">Email Verification</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Only @bmsit.ac.in email addresses are accepted</p>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="font-medium">Duplicate Prevention</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Each student can mark attendance only once per event</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to={mode === 'admin' ? '/admin' : '/student'} replace />} 
            />
            <Route 
              path="/admin/*" 
              element={
                <ErrorBoundary>
                  <React.Suspense fallback={<Loader />}>
                    <AdminDashboard />
                  </React.Suspense>
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ErrorBoundary>
                  <React.Suspense fallback={<Loader />}>
                    <StudentAttendance />
                  </React.Suspense>
                </ErrorBoundary>
              } 
            />
          </Routes>
        </Suspense>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
