import React, { lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Lazy load icons
const Home = lazy(() => import('lucide-react').then(module => ({ default: module.Home })));
const Calendar = lazy(() => import('lucide-react').then(module => ({ default: module.Calendar })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const Settings = lazy(() => import('lucide-react').then(module => ({ default: module.Settings })));
const LogOut = lazy(() => import('lucide-react').then(module => ({ default: module.LogOut })));
const Menu = lazy(() => import('lucide-react').then(module => ({ default: module.Menu })));
const X = lazy(() => import('lucide-react').then(module => ({ default: module.X })));
const UserPlus = lazy(() => import('lucide-react').then(module => ({ default: module.UserPlus })));
const Clock = lazy(() => import('lucide-react').then(module => ({ default: module.Clock })));

const NavItem = ({ icon: Icon, label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center">
      <Suspense fallback={<div className="w-5 h-5 mr-3 bg-gray-200 animate-pulse rounded"></div>}>
        <Icon className="w-5 h-5 mr-3" />
      </Suspense>
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span className={`px-2 py-0.5 text-xs rounded-full ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
        {count}
      </span>
    )}
  </button>
);

export const AdminNav = ({ currentUser, onLogout, mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data - replace with actual data from your state/API
  const stats = {
    totalEvents: 12,
    upcomingEvents: 3,
    totalStaff: 24,
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/admin/events', count: stats.upcomingEvents },
    { id: 'staff', label: 'Staff', icon: Users, path: '/admin/staff', count: stats.totalStaff },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Suspense fallback={<div className="w-6 h-6"></div>}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Suspense>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 w-80 bg-white">
          <div className="flex flex-col h-full">
            {/* Mobile header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Suspense fallback={<div className="w-5 h-5 bg-white rounded"></div>}>
                    <Users className="h-5 w-5 text-white" />
                  </Suspense>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin Panel</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
            
            {/* Mobile navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.path)}
                    count={item.count}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>
            </div>

            {/* Mobile footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-700">
                    {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {currentUser?.username || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || 'admin@example.com'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Suspense fallback={<div className="w-5 h-5"></div>}>
                    <LogOut className="h-5 w-5" />
                  </Suspense>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72 border-r border-gray-200 bg-white">
          {/* Sidebar header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Suspense fallback={<div className="w-5 h-5 bg-white rounded"></div>}>
                  <Users className="h-5 w-5 text-white" />
                </Suspense>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin Panel</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.path)}
                  count={item.count}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {currentUser?.username || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser?.email || 'admin@example.com'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Sign out"
              >
                <Suspense fallback={<div className="w-5 h-5"></div>}>
                  <LogOut className="h-5 w-5" />
                </Suspense>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNav;
