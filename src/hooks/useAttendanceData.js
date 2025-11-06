import { useState, useEffect, useCallback } from 'react';
import { AttendanceStorage } from '../services/storageAdapter';

export const useAttendanceData = (eventCode, isActive) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!eventCode) return;
    
    setLoading(true);
    try {
      const records = await AttendanceStorage.getAttendance(eventCode);
      setData(records || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [eventCode]);

  // Set up polling for active events
  useEffect(() => {
    if (!isActive) return;
    
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [eventCode, isActive, fetchData]);

  // For one-time fetch when not active
  useEffect(() => {
    if (!isActive) {
      fetchData();
    }
  }, [eventCode, isActive, fetchData]);

  const addRecord = useCallback(async (record) => {
    try {
      await AttendanceStorage.addAttendance(record);
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Error adding record:', err);
      return { success: false, error: err.message };
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    addRecord,
  };
};
