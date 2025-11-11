import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventsAPI, StaffAPI, AttendanceAPI } from '../../services/googleSheetsAPI';

// Lazy load icons
const Calendar = lazy(() => import('lucide-react').then(module => ({ default: module.Calendar })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const UserPlus = lazy(() => import('lucide-react').then(module => ({ default: module.UserPlus })));
const CheckCircle = lazy(() => import('lucide-react').then(module => ({ default: module.CheckCircle })));
const Clock = lazy(() => import('lucide-react').then(module => ({ default: module.Clock })));
const Plus = lazy(() => import('lucide-react').then(module => ({ default: module.Plus })));
const ChevronRight = lazy(() => import('lucide-react').then(module => ({ default: module.ChevronRight })));
const BarChart = lazy(() => import('lucide-react').then(module => ({ default: module.BarChart })));
const CalendarDays = lazy(() => import('lucide-react').then(module => ({ default: module.CalendarDays })));

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend = 'up', change = '0%' }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
    green: { bg: 'bg-green-100', text: 'text-green-800' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colors[color].bg} ${colors[color].text}`}>
            <Suspense fallback={<div className="w-6 h-6 bg-gray-200 rounded"></div>}>
              <Icon className="h-6 w-6" />
            </Suspense>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trend]}`}>
                  {change}
                  <Suspense fallback={<div className="w-3 h-3 ml-1"></div>}>
                    <ChevronRight className={`h-3 w-3 ml-1 ${trend === 'up' ? 'transform -rotate-90' : 'transform rotate-90'}`} />
                  </Suspense>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentActivityItem = ({ user, action, time, event, status = 'success' }) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center">
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-sm font-medium text-indigo-700">{user.charAt(0)}</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{user}</p>
          <p className="text-xs text-gray-500">{action} • {time}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-xs text-gray-500 mr-3">{event}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};

const DashboardView = () => {
  const [stats, setStats] = useState([
    { title: 'Total Events', value: '0', icon: Calendar, color: 'indigo', trend: 'up', change: '0%' },
    { title: 'Active Staff', value: '0', icon: Users, color: 'blue', trend: 'up', change: '0%' },
    { title: 'Total Students', value: '0', icon: Users, color: 'green', trend: 'up', change: '0%' },
    { title: 'Attendance Rate', value: '0%', icon: CheckCircle, color: 'yellow', trend: 'up', change: '0%' },
  ]);

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [events, staff, attendance] = await Promise.all([
          EventsAPI.getAllEvents(),
          StaffAPI.getStaffUsers(),
          AttendanceAPI.getAttendance()
        ]);

        // Calculate stats
        const totalEvents = events?.length || 0;
        const activeStaff = staff?.length || 0;
        const totalStudents = [...new Set(attendance?.map(a => a.usn))]?.length || 0;
        const attendanceRate = attendance?.length > 0 
          ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) 
          : 0;

        // Update stats
        setStats([
          { title: 'Total Events', value: totalEvents.toString(), icon: Calendar, color: 'indigo', trend: 'up', change: '0%' },
          { title: 'Active Staff', value: activeStaff.toString(), icon: Users, color: 'blue', trend: 'up', change: '0%' },
          { title: 'Total Students', value: totalStudents.toString(), icon: UserPlus, color: 'green', trend: 'up', change: '0%' },
          { title: 'Attendance Rate', value: `${attendanceRate}%`, icon: CheckCircle, color: 'yellow', trend: 'up', change: '0%' },
        ]);

        // Get upcoming events (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcoming = events
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today && eventDate <= nextWeek;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);

        setUpcomingEvents(upcoming);

        // Get recent activities (last 10 attendance records)
        const recent = attendance
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10)
          .map(record => ({
            user: record.name,
            action: 'marked attendance',
            time: formatTimeAgo(record.timestamp),
            event: record.eventName || 'Event',
            status: record.status === 'present' ? 'success' : 'warning'
          }));

        setRecentActivities(recent);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening today. Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
              <CalendarDays className="h-4 w-4 mr-2" />
            </Suspense>
            New Event
          </Link>
          <Link
            to="/admin/staff/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
              <UserPlus className="h-4 w-4 mr-2" />
            </Suspense>
            Add Staff
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
              <BarChart className="h-4 w-4 mr-2" />
            </Suspense>
            View Reports
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <span className="text-sm text-gray-500">Last {recentActivities.length} activities</span>
          </div>
          <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <RecentActivityItem key={index} {...activity} />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recent activities found
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
            <Link 
              to="/admin/activity" 
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all activity
              <Suspense fallback={<div className="w-4 h-4 ml-1"></div>}>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Suspense>
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            <span className="text-sm text-gray-500">Next 7 days</span>
          </div>
          <div className="px-6 py-4">
            {upcomingEvents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.map((event, index) => (
                  <li key={index} className="py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                    <Link to={`/admin/events/${event.id}`} className="block">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                            <Suspense fallback={<div className="w-5 h-5 bg-indigo-200 rounded"></div>}>
                              <Calendar className="h-5 w-5 text-indigo-600" />
                            </Suspense>
                          </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{event.name || 'Untitled Event'}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{event.time || 'All day'}</span>
                            <span className="mx-1">•</span>
                            <span>{event.date ? new Date(event.date).toLocaleDateString() : 'No date'}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Suspense fallback={<div className="w-5 h-5"></div>}>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </Suspense>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Suspense fallback={<div className="w-12 h-12 mx-auto bg-gray-200 rounded-full"></div>}>
                  <Calendar className="h-12 w-12 mx-auto text-gray-300" />
                </Suspense>
                <p className="mt-2 text-sm text-gray-500">No upcoming events in the next 7 days</p>
                <Link
                  to="/admin/events/new"
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Event
                </Link>
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
            <Link 
              to="/admin/events" 
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all events
              <Suspense fallback={<div className="w-4 h-4 ml-1"></div>}>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Suspense>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
