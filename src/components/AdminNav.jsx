import React, { lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Lazy load icons
const Home = lazy(() => import('lucide-react').then(module => ({ default: module.Home })));
const Plus = lazy(() => import('lucide-react').then(module => ({ default: module.Plus })));
const History = lazy(() => import('lucide-react').then(module => ({ default: module.History })));
const Settings = lazy(() => import('lucide-react').then(module => ({ default: module.Settings })));
const Shield = lazy(() => import('lucide-react').then(module => ({ default: module.Shield })));
const LogOut = lazy(() => import('lucide-react').then(module => ({ default: module.LogOut })));
const Menu = lazy(() => import('lucide-react').then(module => ({ default: module.Menu })));
const X = lazy(() => import('lucide-react').then(module => ({ default: module.X })));

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Suspense fallback={<div className="w-5 h-5 mr-3 bg-gray-200 animate-pulse rounded"></div>}>
      <Icon className="w-5 h-5 mr-3" />
    </Suspense>
    {label}
  </button>
);

export const AdminNav = ({ currentUser, onLogout, mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'create-event', label: 'Create Event', icon: Plus, path: '/admin/create-event' },
    { id: 'past-events', label: 'Past Events', icon: History, path: '/admin/past-events' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
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
      <div className={`md:hidden fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <Suspense fallback={<div className="w-8 h-8 bg-gray-200 rounded-full"></div>}>
                  <Shield className="h-8 w-8 text-indigo-600" />
                </Suspense>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.path)}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
              >
                <Suspense fallback={<div className="w-5 h-5 mr-3 bg-gray-200 animate-pulse rounded"></div>}>
                  <LogOut className="w-5 h-5 mr-3" />
                </Suspense>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Suspense fallback={<div className="w-8 h-8 bg-gray-200 rounded-full"></div>}>
                <Shield className="h-8 w-8 text-indigo-600" />
              </Suspense>
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={onLogout}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNav;
