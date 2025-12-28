// Distance calculation utilities

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate distance for a meal from user's current location
 */
export function addDistanceToMeal<T extends { latitude: number; longitude: number }>(
  meal: T,
  userLat: number,
  userLon: number
): T & { distance: number } {
  const distance = calculateDistance(
    userLat,
    userLon,
    meal.latitude,
    meal.longitude
  );
  return { ...meal, distance: Math.round(distance * 10) / 10 }; // Round to 1 decimal
}

