import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load icons
const Calendar = lazy(() => import('lucide-react').then(module => ({ default: module.Calendar })));
const Users = lazy(() => import('lucide-react').then(module => ({ default: module.Users })));
const Eye = lazy(() => import('lucide-react').then(module => ({ default: module.Eye })));
const Download = lazy(() => import('lucide-react').then(module => ({ default: module.Download })));
const Search = lazy(() => import('lucide-react').then(module => ({ default: module.Search })));
const Plus = lazy(() => import('lucide-react').then(module => ({ default: module.Plus })));
const MapPin = lazy(() => import('lucide-react').then(module => ({ default: module.MapPin })));

// Mock data - replace with actual API calls
const mockEvents = [
  {
    id: 1,
    name: 'Annual Tech Conference',
    date: '2023-11-15',
    time: '09:00',
    attendees: 124,
    location: 'Main Auditorium',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Workshop on AI',
    date: '2023-11-10',
    time: '14:00',
    attendees: 45,
    location: 'Block B - Room 201',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Faculty Meeting',
    date: '2023-11-05',
    time: '11:00',
    attendees: 32,
    location: 'Conference Room A',
    status: 'completed'
  },
];

const PastEventsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events] = useState(mockEvents);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage past attendance events
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/create-event"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
              <Plus className="h-4 w-4 mr-2" />
            </Suspense>
            New Event
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
            <Search className="h-4 w-4 text-gray-400" />
          </Suspense>
        </div>
        <input
          type="text"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredEvents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <li key={event.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {event.name}
                    </p>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        </Suspense>
                        {formatDate(event.date)} at {event.time}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        </Suspense>
                        {event.location}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        </Suspense>
                        {event.attendees} attendees
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link
                      to={`/admin/events/${event.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
                        <Eye className="h-4 w-4 mr-1" />
                      </Suspense>
                      View
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Suspense fallback={<div className="w-4 h-4 bg-gray-200 rounded"></div>}>
                        <Download className="h-4 w-4 mr-1" />
                      </Suspense>
                      Export
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Suspense fallback={<div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>}>
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            </Suspense>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No events match your search.' : 'Get started by creating a new event.'}
            </p>
            <div className="mt-6">
              <Link
                to="/admin/create-event"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Suspense fallback={<div className="w-4 h-4 bg-white rounded"></div>}>
                  <Plus className="h-4 w-4 mr-2" />
                </Suspense>
                New Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEventsView;
