import renaultTrafficImage from '../assets/images/vehicles/renault-traffic.jpg'; // Replace with actual Renault Trafic image when available
import mercedesSClassImage from '../assets/images/vehicles/mercedes-s-class.jpg';
import mercedesVitoTourerImage from '../assets/images/vehicles/mercedes-vito-tourer.jpg';
import mercedesSprinterImage from '../assets/images/vehicles/mercedes-sprinter-new.jpg';
import mercedesSprinterVIPImage from '../assets/images/vehicles/mercedes-sprinter-vip-exterior.jpg';

// Define transfer types (moved from priceCalculator.ts)
export type TransferType = 'airport' | 'intercity' | 'city';

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  basePrice: number;
  priceMultiplier: number;
  discountPercentage?: number;
  passengerCapacity: number;
  luggageCapacity: number;
  features: string[];
  category: 'sedan' | 'minivan' | 'minibus';
  type: 'premium' | 'vip' | 'luxury';
  available: boolean;
  availableForTransfer: boolean;
  availableForChauffeur: boolean;
}

// Centralized vehicle data store
const vehicles: Vehicle[] = [
  {
    id: "renault-trafic",
    name: "Renault Trafic",
    description: "Comfortable and spacious minivan perfect for small groups and families with ample luggage space.",
    image: renaultTrafficImage,
    basePrice: 50,
    priceMultiplier: 1.1,
    discountPercentage: 0,
    passengerCapacity: 8,
    luggageCapacity: 6,
    features: [
      "Air conditioning",
      "Comfortable seating",
      "USB charging ports",
      "Bluetooth audio",
      "Professional driver",
      "Bottled water",
    ],
    category: "minivan",
    type: "vip", // Changed from "premium" to "vip"
    available: true,
    availableForTransfer: true,
    availableForChauffeur: true
  },
  {
    id: "mercedes-s-class",
    name: "Mercedes-Benz S Class",
    description: "Luxury sedan with premium amenities, perfect for business executives and VIP guests seeking the ultimate comfort.",
    image: mercedesSClassImage,
    basePrice: 80,
    priceMultiplier: 1.6,
    discountPercentage: 0,
    passengerCapacity: 3,
    luggageCapacity: 3,
    features: [
      "Premium leather seats",
      "Climate control",
      "Ambient lighting",
      "Wi-Fi connectivity",
      "Privacy glass",
      "High-end sound system",
      "Professional chauffeur",
      "Complimentary refreshments"
    ],
    category: "sedan",
    type: "luxury",
    available: true,
    availableForTransfer: true,
    availableForChauffeur: true
  },
  {
    id: "mercedes-vito-tourer",
    name: "Mercedes-Benz Vito Tourer",
    description: "Spacious luxury van with premium comfort, perfect for families or small groups traveling together.",
    image: mercedesVitoTourerImage,
    basePrice: 60,
    priceMultiplier: 1.3,
    discountPercentage: 5,
    passengerCapacity: 7,
    luggageCapacity: 5,
    features: [
      "Leather seats",
      "Climate control",
      "Wi-Fi connectivity",
      "Bottled water",
      "Extra legroom",
      "Professional driver",
      "USB charging ports"
    ],
    category: "minivan",
    type: "vip",
    available: true,
    availableForTransfer: true,
    availableForChauffeur: true
  },
  {
    id: "mercedes-sprinter",
    name: "Mercedes-Benz Sprinter",
    description: "Premium passenger van with comfortable seating for larger groups, ideal for airport transfers and group tours.",
    image: mercedesSprinterImage,
    basePrice: 70,
    priceMultiplier: 1.4,
    discountPercentage: 0,
    passengerCapacity: 12,
    luggageCapacity: 10,
    features: [
      "Comfortable seating",
      "Climate control",
      "Wi-Fi",
      "Bottled water",
      "Large luggage space",
      "Professional driver",
      "USB charging ports"
    ],
    category: "minibus",
    type: "premium",
    available: true,
    availableForTransfer: true,
    availableForChauffeur: true
  },
  {
    id: "mercedes-sprinter-vip",
    name: "Mercedes-Benz Sprinter VIP",
    description: "Ultimate luxury VIP minibus with exclusive interior, perfect for executive groups and VIP transportation.",
    image: mercedesSprinterVIPImage,
    basePrice: 100,
    priceMultiplier: 1.8,
    discountPercentage: 10,
    passengerCapacity: 14,
    luggageCapacity: 12,
    features: [
      "VIP leather seating",
      "Climate control",
      "High-speed Wi-Fi",
      "Refreshment bar",
      "Entertainment system",
      "Professional chauffeur",
      "Privacy divider",
      "Premium sound system",
      "USB & power outlets"
    ],
    category: "minibus",
    type: "luxury",
    available: true,
    availableForTransfer: true,
    availableForChauffeur: true
  }
];

export default vehicles;

// Helper functions to work with vehicles
export const getAvailableVehicles = (): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.available);
};

export const getVehiclesForTransfer = (): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.availableForTransfer && vehicle.available);
};

export const getVehiclesForChauffeur = (): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.availableForChauffeur && vehicle.available);
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find(vehicle => vehicle.id === id);
};

// Filter vehicles by passenger/luggage capacity
export const filterVehiclesByCapacity = (
  minPassengers: number,
  minLuggage: number,
  forService: 'transfer' | 'chauffeur' | 'both' = 'both'
): Vehicle[] => {
  return vehicles.filter(vehicle => {
    // Check if vehicle meets capacity requirements
    const meetsCapacityRequirements = vehicle.passengerCapacity >= minPassengers &&
                                      vehicle.luggageCapacity >= minLuggage &&
                                      vehicle.available;

    // Check service type requirements
    if (forService === 'transfer') {
      return meetsCapacityRequirements && vehicle.availableForTransfer;
    } else if (forService === 'chauffeur') {
      return meetsCapacityRequirements && vehicle.availableForChauffeur;
    } else {
      return meetsCapacityRequirements;
    }
  });
};

// Calculate price based on distance and vehicle multiplier
export const calculateVehiclePrice = (
  vehicleId: string,
  distanceInKm: number,
  isRushHour = false
): number => {
  const vehicle = getVehicleById(vehicleId);

  if (!vehicle) {
    return 0;
  }

  // Base rate of 1 EUR per kilometer
  const baseRatePerKm = 1;

  // Calculate distance price
  const distancePrice = distanceInKm * baseRatePerKm;

  // Apply vehicle multiplier to the distance price only
  // No longer adding the basePrice
  const price = distancePrice * vehicle.priceMultiplier;

  // Note: Rush hour multiplier is now disabled in the system

  // Round to nearest 10
  return Math.round(price / 10) * 10;
};
