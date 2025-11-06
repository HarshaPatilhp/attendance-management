import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load icons
const Calendar = lazy(() => import('lucide-react').then(module => ({ default: module.Calendar })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const CheckCircle = lazy(() => import('lucide-react').then(module => ({ default: module.CheckCircle })));
const Clock = lazy(() => import('lucide-react').then(module => ({ default: module.Clock })));
const Plus = lazy(() => import('lucide-react').then(module => ({ default: module.Plus })));
const ChevronRight = lazy(() => import('lucide-react').then(module => ({ default: module.ChevronRight })));

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
  // These would typically come from your API/state
  const stats = [
    { title: 'Total Events', value: '24', icon: Calendar, color: 'indigo', trend: 'up', change: '12%' },
    { title: 'Active Staff', value: '18', icon: Users, color: 'blue', trend: 'up', change: '5%' },
    { title: 'Attendance Rate', value: '92%', icon: CheckCircle, color: 'green', trend: 'up', change: '3%' },
    { title: 'Upcoming Events', value: '3', icon: Clock, color: 'yellow', trend: 'down', change: '2%' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'marked attendance', time: '2 min ago', event: 'Weekly Meeting', status: 'success' },
    { user: 'Jane Smith', action: 'created new event', time: '10 min ago', event: 'Workshop', status: 'success' },
    { user: 'Robert Johnson', action: 'updated profile', time: '1 hour ago', event: 'Profile', status: 'warning' },
    { user: 'Emily Davis', action: 'requested leave', time: '3 hours ago', event: 'Time Off', status: 'error' },
    { user: 'Michael Wilson', action: 'marked attendance', time: '5 hours ago', event: 'Team Sync', status: 'success' },
  ];

  const upcomingEvents = [
    { title: 'Team Meeting', time: '10:00 AM', date: 'Today' },
    { title: 'Project Review', time: '2:00 PM', date: 'Tomorrow' },
    { title: 'Workshop', time: '9:30 AM', date: 'Mar 15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
            <Plus className="h-4 w-4 mr-2" />
          </Suspense>
          New Event
        </Link>
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
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="px-6 py-4 divide-y divide-gray-200">
            {recentActivities.map((activity, index) => (
              <RecentActivityItem key={index} {...activity} />
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/admin/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all activity
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="px-6 py-4">
            <ul className="divide-y divide-gray-200">
              {upcomingEvents.map((event, index) => (
                <li key={index} className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                        <Suspense fallback={<div className="w-5 h-5 bg-indigo-200 rounded"></div>}>
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </Suspense>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.time} • {event.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link to="/admin/events" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
