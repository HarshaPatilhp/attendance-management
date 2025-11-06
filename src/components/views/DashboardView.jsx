import React, { lazy, Suspense } from 'react';

// Lazy load icons
const Calendar = lazy(() => import('lucide-react').then(module => ({ default: module.Calendar })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const CheckCircle = lazy(() => import('lucide-react').then(module => ({ default: module.CheckCircle })));
const Clock = lazy(() => import('lucide-react').then(module => ({ default: module.Clock })));

const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 bg-${color}-100`}>
          <Suspense fallback={<div className="w-6 h-6 bg-gray-200 rounded"></div>}>
            <Icon className={`h-6 w-6 text-${color}-600`} aria-hidden="true" />
          </Suspense>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const DashboardView = () => {
  // These would typically come from your API/state
  const stats = [
    { title: 'Active Events', value: '3', icon: Calendar, color: 'indigo' },
    { title: 'Total Staff', value: '12', icon: Users, color: 'green' },
    { title: 'Today\'s Attendance', value: '87%', icon: CheckCircle, color: 'yellow' },
    { title: 'Upcoming Events', value: '2', icon: Clock, color: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your attendance system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-medium">U{item}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      User {item} marked attendance
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {item} hour{item !== 1 ? 's' : ''} ago
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
