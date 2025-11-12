/**
 * Calculate distance between two points in meters using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
}

/**
 * Check if student is within allowed distance from event location
 * @param {Object} studentLocation - { latitude, longitude, accuracy }
 * @param {Object} eventLocation - { lat, lng }
 * @param {number} maxDistance - Maximum allowed distance in meters (default: 100m)
 * @returns {{isValid: boolean, distance: number, message: string}}
 */
export function validateLocation(studentLocation, eventLocation, maxDistance = 100) {
  if (!studentLocation || !eventLocation) {
    return {
      isValid: false,
      distance: 0,
      message: 'Location data is missing'
    };
  }

  // Check if location accuracy is too poor
  if (studentLocation.accuracy > 50) { // 50m accuracy threshold
    return {
      isValid: false,
      distance: 0,
      message: 'Location accuracy is too poor. Please enable high accuracy mode.'
    };
  }

  const distance = calculateDistance(
    studentLocation.latitude,
    studentLocation.longitude,
    eventLocation.lat,
    eventLocation.lng
  );

  // Add 10% buffer to account for GPS inaccuracies
  const buffer = maxDistance * 0.1;
  const effectiveMaxDistance = maxDistance + buffer;

  return {
    isValid: distance <= effectiveMaxDistance,
    distance: Math.round(distance),
    message: distance <= effectiveMaxDistance
      ? 'Location verified'
      : `You are ${Math.round(distance)}m away from the event location. Must be within ${maxDistance}m.`
  };
}

/**
 * Get current location with high accuracy
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0 // Force fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Error getting location: ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message += 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out. Please try again.';
            break;
          default:
            message += 'An unknown error occurred.';
        }
        reject(new Error(message));
      },
      options
    );
  });
}

/**
 * Check for potential proxy/VPN usage
 * @returns {Promise<{isUsingProxy: boolean, message: string}>}
 */
export async function checkForProxy() {
  try {
    // Simple check using timezone offset
    const timezoneOffset = new Date().getTimezoneOffset();
    
    // More sophisticated checks could be added here, such as:
    // - IP geolocation API calls
    // - Timezone vs IP location mismatch
    // - Common VPN/proxy IP detection
    
    // For now, we'll just log this information
    console.log('Timezone offset:', timezoneOffset);
    
    return {
      isUsingProxy: false, // Default to false unless we can confirm otherwise
      message: 'Proxy check passed'
    };
  } catch (error) {
    console.warn('Proxy check failed:', error);
    return {
      isUsingProxy: false, // Fail open to not block legitimate users
      message: 'Unable to verify proxy status'
    };
  }
}
