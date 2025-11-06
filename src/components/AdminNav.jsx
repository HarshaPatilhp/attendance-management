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
const ChevronRight = lazy(() => import('lucide-react').then(module => ({ default: module.ChevronRight })));

export const AdminNav = ({ currentUser, onLogout, mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/admin',
      count: 3
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar, 
      path: '/admin/events',
      count: 5,
      active: true
    },
    { 
      id: 'staff', 
      label: 'Staff', 
      icon: Users, 
      path: '/admin/staff',
      count: 12
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/admin/settings'
    },
  ];

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ icon: Icon, label, active, onClick, count, path }) => (
    <div 
      onClick={() => {
        onClick?.();
        if (path) navigate(path);
      }}
      className={`flex items-center justify-between px-6 py-3 text-sm font-medium rounded-lg mx-2 cursor-pointer transition-colors ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
          active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
        }`}>
          <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
            <Icon className="w-4 h-4" />
          </Suspense>
        </div>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md text-white hover:bg-gray-700"
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
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 w-80 bg-gray-900 text-white">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Suspense fallback={<div className="w-6 h-6 bg-white rounded"></div>}>
                    <Users className="h-6 w-6 text-white" />
                  </Suspense>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white">Admin Panel</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-2">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.path) || item.active}
                    count={item.count}
                    onClick={() => setMobileMenuOpen(false)}
                    path={item.path}
                  />
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.username || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentUser?.email || 'admin@example.com'}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
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
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-900 text-white h-screen sticky top-0">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Suspense fallback={<div className="w-6 h-6 bg-white rounded"></div>}>
                  <Users className="h-6 w-6 text-white" />
                </Suspense>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white">Admin Panel</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.path) || item.active}
                  count={item.count}
                  path={item.path}
                />
              ))}
            </nav>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  {currentUser?.username || 'Admin User'}
                </p>
                <p className="text-xs text-gray-400">
                  {currentUser?.email || 'admin@example.com'}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
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
