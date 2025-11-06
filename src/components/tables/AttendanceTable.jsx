import React, { useMemo } from 'react';
import { CheckCircle, XCircle, Edit } from 'lucide-react';

const AttendanceTable = ({ data, loading }) => {
  const memoizedRows = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
            {loading ? 'Loading...' : 'No records found'}
          </td>
        </tr>
      );
    }

    return data.map((record, index) => (
      <tr key={`${record.usn}-${index}`} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">{record.name}</div>
              <div className="text-sm text-gray-500">{record.usn}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{record.eventName || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{record.timestamp}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {record.status === 'verified' ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1 inline" />
              Verified
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              <XCircle className="w-4 h-4 mr-1 inline" />
              Failed
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-indigo-600 hover:text-indigo-900 mr-4">
            <Edit className="w-4 h-4 inline" />
          </button>
        </td>
      </tr>
    ));
  }, [data, loading]);

  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full border-b border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="border-t border-gray-200">
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {memoizedRows}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(AttendanceTable);
