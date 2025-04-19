// Define location coordinates for Istanbul regions
interface Coordinates {
  lat: number;
  lng: number;
}

// Location coordinates mapping (approximate center points)
export const locationCoordinates: Record<string, Coordinates> = {
  // Airports
  ist: { lat: 41.2606, lng: 28.7427 }, // Istanbul Airport
  saw: { lat: 40.8983, lng: 29.3080 }, // Sabiha Gökçen Airport

  // Districts - European Side
  adalar: { lat: 40.8739, lng: 29.0897 },
  arnavutkoy: { lat: 41.1843, lng: 28.7403 },
  avcilar: { lat: 40.9795, lng: 28.7214 },
  bagcilar: { lat: 41.0398, lng: 28.8627 },
  bahcelievler: { lat: 41.0001, lng: 28.8724 },
  bakirkoy: { lat: 40.9797, lng: 28.8772 },
  basaksehir: { lat: 41.0928, lng: 28.8027 },
  bayrampasa: { lat: 41.0461, lng: 28.9117 },
  besiktas: { lat: 41.0429, lng: 29.0083 },
  beylikduzu: { lat: 40.9825, lng: 28.6283 },
  beyoglu: { lat: 41.0361, lng: 28.9795 },
  buyukcekmece: { lat: 41.0209, lng: 28.5950 },
  catalca: { lat: 41.1435, lng: 28.4564 },
  esenler: { lat: 41.0437, lng: 28.8769 },
  esenyurt: { lat: 41.0291, lng: 28.6735 },
  eyupsultan: { lat: 41.0550, lng: 28.9341 },
  fatih: { lat: 41.0082, lng: 28.9393 },
  gaziosmanpasa: { lat: 41.0636, lng: 28.9092 },
  gungoren: { lat: 41.0198, lng: 28.8846 },
  kagithane: { lat: 41.0871, lng: 28.9700 },
  kucukcekmece: { lat: 41.0015, lng: 28.7787 },
  sariyer: { lat: 41.1672, lng: 29.0536 },
  silivri: { lat: 41.0736, lng: 28.2459 },
  sultanahmet: { lat: 41.0054, lng: 28.9768 },
  sultangazi: { lat: 41.1066, lng: 28.8674 },
  sisli: { lat: 41.0602, lng: 28.9877 },
  taksim: { lat: 41.0369, lng: 28.9833 },
  zeytinburnu: { lat: 40.9947, lng: 28.9139 },

  // Districts - Asian Side
  atasehir: { lat: 40.9761, lng: 29.1175 },
  beykoz: { lat: 41.1479, lng: 29.0818 },
  cekmekoy: { lat: 41.0333, lng: 29.1823 },
  kadikoy: { lat: 40.9927, lng: 29.0257 },
  kartal: { lat: 40.8891, lng: 29.1857 },
  maltepe: { lat: 40.9342, lng: 29.1361 },
  pendik: { lat: 40.8774, lng: 29.2518 },
  sancaktepe: { lat: 41.0013, lng: 29.2209 },
  sile: { lat: 41.1759, lng: 29.6115 },
  sultanbeyli: { lat: 40.9655, lng: 29.2674 },
  tuzla: { lat: 40.8156, lng: 29.3007 },
  umraniye: { lat: 41.0161, lng: 29.1211 },
  uskudar: { lat: 41.0233, lng: 29.0151 },

  // Major Cities
  istanbul: { lat: 41.0082, lng: 28.9784 },
  ankara: { lat: 39.9334, lng: 32.8597 },
  izmir: { lat: 38.4237, lng: 27.1428 },
  bursa: { lat: 40.1885, lng: 29.0610 },
  antalya: { lat: 36.8969, lng: 30.7133 }
};

/**
 * Calculate the great-circle distance between two points
 * using the Haversine formula
 *
 * @param lat1 - Latitude of point 1 in degrees
 * @param lon1 - Longitude of point 1 in degrees
 * @param lat2 - Latitude of point 2 in degrees
 * @param lon2 - Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  // Earth's radius in kilometers
  const radius = 6371;
  const distance = radius * c;

  // Return distance in kilometers, rounded to one decimal place
  return Math.round(distance * 10) / 10;
}

/**
 * Get real distance between two locations using their IDs
 *
 * @param fromLocationId - ID of the starting location
 * @param toLocationId - ID of the destination location
 * @returns Distance in kilometers or null if locations not found
 */
export function getRealDistance(fromLocationId: string, toLocationId: string): number | null {
  const fromCoordinates = locationCoordinates[fromLocationId];
  const toCoordinates = locationCoordinates[toLocationId];

  if (!fromCoordinates || !toCoordinates) {
    return null;
  }

  return calculateHaversineDistance(
    fromCoordinates.lat,
    fromCoordinates.lng,
    toCoordinates.lat,
    toCoordinates.lng
  );
}

/**
 * Get estimated travel time based on distance
 *
 * @param distance - Distance in kilometers
 * @returns Estimated travel time range as a string (e.g., "45-60 min")
 */
export function getEstimatedTime(distance: number): string {
  if (distance < 10) {
    return "15-25 min";
  } else if (distance < 25) {
    return "25-40 min";
  } else if (distance < 40) {
    return "40-55 min";
  } else if (distance < 60) {
    return "45-60 min";
  } else if (distance < 80) {
    return "60-75 min";
  } else if (distance < 100) {
    return "70-90 min";
  } else if (distance < 150) {
    return "90-120 min";
  } else if (distance < 300) {
    return "2-3 hours";
  } else {
    return "3+ hours";
  }
}
