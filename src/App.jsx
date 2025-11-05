import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import StudentAttendance from './components/StudentAttendance';
import { Shield, Users } from 'lucide-react';

function App() {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              AIML Attendance System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure event attendance with anti-proxy verification and location tracking
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

          <div className="mt-16 max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Security Features</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Location Verification:</strong> Ensures students are physically present at the event</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Time-Limited Codes:</strong> Event codes expire automatically</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Email Verification:</strong> Only college email addresses accepted</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span><strong>Duplicate Prevention:</strong> Each student can mark attendance only once</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => setMode(null)}
          className="mb-6 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-gray-700 hover:text-gray-900"
        >
          ← Back to Home
        </button>
        {mode === 'admin' ? <AdminDashboard /> : <StudentAttendance />}
      </div>
    </div>
  );
}

export default App;
