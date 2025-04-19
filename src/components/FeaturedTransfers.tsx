import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UsersIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useIsMobile } from "../hooks/useMediaQuery";
import { calculateVehiclePrice, getVehicleById, Vehicle, TransferType } from "../data/vehicles";
import { getRealDistance, getEstimatedTime } from "../utils/distanceCalculator";
import { TransferFormData } from "./TransferBookingForm";
import VehicleCard from "./VehicleCard";

// Import components
import QuickBookingWidget from "./QuickBookingWidget";
import TransferBookingConfirmation from "./TransferBookingConfirmation";

// Import vehicle images
import mercedesVitoTourer from "../assets/images/vehicles/mercedes-vito-tourer.jpg";
import mercedesSprinter from "../assets/images/vehicles/mercedes-sprinter-new.jpg";
import mercedesSprinterVIP from "../assets/images/vehicles/mercedes-sprinter-vip-exterior.jpg";
import mercedesSClass from "../assets/images/vehicles/mercedes-s-class.jpg";
import renaultTrafic from "../assets/images/vehicles/renault-traffic.jpg";

// Define types
interface FeaturedRoute {
  id: string;
  fromLocation: string;
  fromLocationId: string;
  toLocation: string;
  toLocationId: string;
  estimatedTime: string;
  price: number;
  distance: number;
  image: string;
  transferType: 'airport' | 'city' | 'intercity';
  isPopular?: boolean;
  vehicleName: string;
  vehicleType: 'vito' | 'sprinter' | 'sprinterVIP';
  vehicleId: string; // Add vehicleId to track which vehicle is used
}

export default function FeaturedTransfers() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeFilter, setActiveFilter] = useState<'airport' | 'popular'>('airport');
  const [quickBookingData, setQuickBookingData] = useState<{
    isOpen: boolean;
    fromLocationId: string;
    toLocationId: string;
    transferType: 'airport' | 'city' | 'intercity';
    selectedRoute?: FeaturedRoute;
  } | null>(null);

  // New state for direct booking confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [transferData, setTransferData] = useState<{
    transferType: TransferType;
    fromLocation: string;
    toLocation: string;
    date: string;
    time: string;
    passengers: number;
    luggage: number;
    roundTrip: boolean;
    returnDate?: string;
    returnTime?: string;
  } | null>(null);
  const [locations, setLocations] = useState<{
    fromName: string;
    toName: string;
    fromId?: string;
    toId?: string;
    distance?: number;
    travelTime?: string;
  } | null>(null);

  // Slider states
  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Updated timer reference type

  // Number of routes to display per page
  const routesPerPage = 3;
  // Total routes we want to show (9 total)
  const totalRoutesToShow = 9;

  // Expanded featured routes data with more vehicles and destinations
  const featuredRoutes: FeaturedRoute[] = [
    // Mercedes-Benz Vito Tourer routes
    {
      id: "ist-taksim-vito",
      fromLocation: "Istanbul Airport (IST)",
      fromLocationId: "ist",
      toLocation: "Taksim",
      toLocationId: "taksim",
      estimatedTime: "45-60",
      price: calculateVehiclePrice("mercedes-vito-tourer", 41, false),
      distance: 41,
      image: mercedesVitoTourer,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz Vito Tourer",
      vehicleType: 'vito',
      vehicleId: "mercedes-vito-tourer"
    },
    {
      id: "kadikoy-ist-s-class",
      fromLocation: "Kadıköy",
      fromLocationId: "kadikoy",
      toLocation: "Istanbul Airport (IST)",
      toLocationId: "ist",
      estimatedTime: "55-70",
      price: calculateVehiclePrice("mercedes-s-class", 50, false),
      distance: 50,
      image: mercedesSClass,
      transferType: 'airport',
      isPopular: false,
      vehicleName: "Mercedes-Benz S Class",
      vehicleType: 'vito',
      vehicleId: "mercedes-s-class"
    },
    {
      id: "ist-kadikoy-sprinter",
      fromLocation: "Istanbul Airport (IST)",
      fromLocationId: "ist",
      toLocation: "Kadıköy",
      toLocationId: "kadikoy",
      estimatedTime: "55-70",
      price: calculateVehiclePrice("mercedes-sprinter", 49, false),
      distance: 49,
      image: mercedesSprinter,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz Sprinter",
      vehicleType: 'sprinter',
      vehicleId: "mercedes-sprinter"
    },
    {
      id: "taksim-sultanahmet-vito",
      fromLocation: "Taksim",
      fromLocationId: "taksim",
      toLocation: "Sultanahmet",
      toLocationId: "sultanahmet",
      estimatedTime: "15-25",
      price: calculateVehiclePrice("mercedes-vito-tourer", 6, false),
      distance: 6,
      image: mercedesVitoTourer,
      transferType: 'city',
      isPopular: true,
      vehicleName: "Mercedes-Benz Vito Tourer",
      vehicleType: 'vito',
      vehicleId: "mercedes-vito-tourer"
    },

    // Mercedes-Benz Sprinter routes
    
    {
      id: "istanbul-bursa-sprinter",
      fromLocation: "Istanbul",
      fromLocationId: "istanbul",
      toLocation: "Bursa",
      toLocationId: "bursa",
      estimatedTime: "145-170",
      price: calculateVehiclePrice("mercedes-sprinter", 154, false),
      distance: 154,
      image: mercedesSprinter,
      transferType: 'intercity',
      isPopular: true,
      vehicleName: "Mercedes-Benz Sprinter",
      vehicleType: 'sprinter',
      vehicleId: "mercedes-sprinter"
    },

    // Mercedes S-Class routes
    {
      id: "ist-besiktas-s-class",
      fromLocation: "Istanbul Airport (IST)",
      fromLocationId: "ist",
      toLocation: "Beşiktaş",
      toLocationId: "besiktas",
      estimatedTime: "40-55",
      price: calculateVehiclePrice("mercedes-s-class", 40, false),
      distance: 40,
      image: mercedesSClass,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz S Class",
      vehicleType: 'vito',
      vehicleId: "mercedes-s-class"
    },
    

    // Renault Trafic routes
    {
      id: "ist-sisli-trafic",
      fromLocation: "Istanbul Airport (IST)",
      fromLocationId: "ist",
      toLocation: "Şişli",
      toLocationId: "sisli",
      estimatedTime: "40-55",
      price: calculateVehiclePrice("renault-trafic", 38, false),
      distance: 38,
      image: renaultTrafic,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Renault Trafic",
      vehicleType: 'vito',
      vehicleId: "renault-trafic"
    },
    {
      id: "saw-taksim-sprinter-vip",
      fromLocation: "Sabiha Gökçen Airport (SAW)",
      fromLocationId: "saw",
      toLocation: "Taksim",
      toLocationId: "taksim",
      estimatedTime: "60-75",
      price: calculateVehiclePrice("mercedes-sprinter-vip", 45, false),
      distance: 45,
      image: mercedesSprinterVIP,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz Sprinter VIP",
      vehicleType: 'sprinterVIP',
      vehicleId: "mercedes-sprinter-vip"
    },
    {
      id: "sisli-saw-trafic",
      fromLocation: "Şişli",
      fromLocationId: "sisli",
      toLocation: "Sabiha Gökçen Airport (SAW)",
      toLocationId: "saw",
      estimatedTime: "60-75",
      price: calculateVehiclePrice("renault-trafic", 55, false),
      distance: 55,
      image: renaultTrafic,
      transferType: 'airport',
      isPopular: false,
      vehicleName: "Renault Trafic",
      vehicleType: 'vito',
      vehicleId: "renault-trafic"
    },

    // Mercedes-Benz Sprinter VIP routes
    {
      id: "ist-nisantasi-sprinter-vip",
      fromLocation: "Istanbul Airport (IST)",
      fromLocationId: "ist",
      toLocation: "Nişantaşı",
      toLocationId: "nisantasi",
      estimatedTime: "40-55",
      price: calculateVehiclePrice("mercedes-sprinter-vip", 39, false),
      distance: 39,
      image: mercedesSprinterVIP,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz Sprinter VIP",
      vehicleType: 'sprinterVIP',
      vehicleId: "mercedes-sprinter-vip"
    },
    {
      id: "istanbul-ankara-sprinter-vip",
      fromLocation: "Istanbul",
      fromLocationId: "istanbul",
      toLocation: "Ankara",
      toLocationId: "ankara",
      estimatedTime: "280-320",
      price: calculateVehiclePrice("mercedes-sprinter-vip", 450, false),
      distance: 450,
      image: mercedesSprinterVIP,
      transferType: 'intercity',
      isPopular: false,
      vehicleName: "Mercedes-Benz Sprinter VIP",
      vehicleType: 'sprinterVIP',
      vehicleId: "mercedes-sprinter-vip"
    },

    // Yeni havalimanı rotaları
    
    {
      id: "saw-kadikoy-s-class",
      fromLocation: "Sabiha Gökçen Airport (SAW)",
      fromLocationId: "saw",
      toLocation: "Kadıköy",
      toLocationId: "kadikoy",
      estimatedTime: "45-60",
      price: calculateVehiclePrice("mercedes-s-class", 35, false),
      distance: 35,
      image: mercedesSClass,
      transferType: 'airport',
      isPopular: true,
      vehicleName: "Mercedes-Benz S Class",
      vehicleType: 'vito',
      vehicleId: "mercedes-s-class"
    },

    // Yeni popüler rotalar
    {
      id: "besiktas-sultanahmet-sprinter",
      fromLocation: "Beşiktaş",
      fromLocationId: "besiktas",
      toLocation: "Sultanahmet",
      toLocationId: "sultanahmet",
      estimatedTime: "20-30",
      price: calculateVehiclePrice("mercedes-sprinter", 8, false),
      distance: 8,
      image: mercedesSprinter,
      transferType: 'city',
      isPopular: true,
      vehicleName: "Mercedes-Benz Sprinter",
      vehicleType: 'sprinter',
      vehicleId: "mercedes-sprinter"
    },
    {
      id: "nisantasi-sisli-vito",
      fromLocation: "Nişantaşı",
      fromLocationId: "nisantasi",
      toLocation: "Şişli",
      toLocationId: "sisli",
      estimatedTime: "10-15",
      price: calculateVehiclePrice("mercedes-vito-tourer", 3, false),
      distance: 3,
      image: mercedesVitoTourer,
      transferType: 'city',
      isPopular: true,
      vehicleName: "Mercedes-Benz Vito Tourer",
      vehicleType: 'vito',
      vehicleId: "mercedes-vito-tourer"
    }
  ];

  // Get filtered routes based on active filter
  const filteredRoutes = featuredRoutes
    .filter(route => {
      if (activeFilter === 'airport') return route.transferType === 'airport';
      if (activeFilter === 'popular') return !!route.isPopular;
      return true;
    })
    .slice(0, totalRoutesToShow); // Show up to 9 routes

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredRoutes.length / routesPerPage);

  // Get current visible routes
  const currentRoutes = filteredRoutes.slice(
    currentPage * routesPerPage,
    currentPage * routesPerPage + routesPerPage
  );

  // Handle auto-rotation
  useEffect(() => {
    const startAutoPlay = () => {
      // Clear existing interval if any
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);

      // Set new interval
      autoPlayRef.current = setTimeout(() => {
        setCurrentPage(prev => (prev + 1) % totalPages);
      }, 5000); // Auto-rotate every 5 seconds
    };

    startAutoPlay();

    // Pause auto-rotation when mouse is over the slider
    const handleMouseEnter = () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };

    const handleMouseLeave = () => {
      startAutoPlay();
    };

    // Add event listeners to slider
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', handleMouseEnter);
      sliderElement.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (sliderElement) {
        sliderElement.removeEventListener('mouseenter', handleMouseEnter);
        sliderElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [currentPage, totalPages]);

  // Reset current page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  // Navigation functions
  const goToNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate pre-populated transfer link
  const generateTransferLink = (route: FeaturedRoute) => {
    return `/transfer?from=${route.fromLocationId}&to=${route.toLocationId}&type=${route.transferType}`;
  };

  // Handle quick booking submission
  const handleQuickBooking = async (
    fromLocationId: string,
    toLocationId: string,
    transferType: 'airport' | 'city' | 'intercity',
    date: string,
    time: string,
    passengers: number,
    luggage: number,
    roundTrip: boolean,
    returnDate?: string,
    returnTime?: string
  ) => {
    // If we have a selected route stored in quickBookingData
    if (quickBookingData?.selectedRoute) {
      // Get the vehicle from the selected route
      const vehicleId = quickBookingData.selectedRoute.vehicleType === 'vito'
        ? 'mercedes-vito-tourer'
        : quickBookingData.selectedRoute.vehicleType === 'sprinter'
          ? 'mercedes-sprinter'
          : 'mercedes-sprinter-vip';

      const vehicle = getVehicleById(vehicleId);

      if (vehicle) {
        // Calculate the distance between the locations
        const distance = quickBookingData.selectedRoute.distance ||
          getRealDistance(fromLocationId, toLocationId) ||
          15; // Default distance if actual distance can't be determined

        // Just use the route price directly
        const price = quickBookingData.selectedRoute.price;

        // Create vehicle with price
        const vehicleWithPrice = {
          ...vehicle,
          price: price
        };

        // Get location names for display
        const fromName = getLocationName(fromLocationId, transferType);
        const toName = getLocationName(toLocationId, transferType);

        // Calculate estimated travel time
        const travelTime = getEstimatedTime(distance);

        // Set all necessary state for the confirmation modal
        setSelectedVehicle(vehicleWithPrice);
        setTransferData({
          transferType,
          fromLocation: fromLocationId,
          toLocation: toLocationId,
          date,
          time,
          passengers,
          luggage,
          roundTrip,
          returnDate,
          returnTime
        });
        setLocations({
          fromName,
          toName,
          fromId: fromLocationId,
          toId: toLocationId,
          distance,
          travelTime
        });

        // Close quick booking widget and show confirmation
        setQuickBookingData(null);
        setShowConfirmation(true);
        return;
      }
    }

    // Fallback for when route details aren't available - use normal redirection
    const params = new URLSearchParams();
    params.append('from', fromLocationId);
    params.append('to', toLocationId);
    params.append('type', transferType);
    params.append('date', date);
    params.append('time', time);
    params.append('passengers', passengers.toString());
    params.append('luggage', luggage.toString());
    params.append('booking', 'true');

    if (roundTrip && returnDate && returnTime) {
      params.append('roundTrip', 'true');
      params.append('returnDate', returnDate);
      params.append('returnTime', returnTime);
    }

    window.location.href = `/transfer?${params.toString()}`;
  };

  // Helper function to get location name
  const getLocationName = (id: string, transferType: TransferType): string => {
    // Define a basic location map (you can expand this with more locations)
    const locationMap: Record<string, Record<string, string>> = {
      airports: {
        ist: "Istanbul Airport (IST)",
        saw: "Sabiha Gökçen Airport (SAW)"
      },
      districts: {
        adalar: "Adalar",
        atasehir: "Ataşehir",
        besiktas: "Beşiktaş",
        beyoglu: "Beyoğlu",
        kadikoy: "Kadıköy",
        sisli: "Şişli",
        taksim: "Taksim",
        sultanahmet: "Sultanahmet",
        nisantasi: "Nişantaşı",
        florya: "Florya"
      },
      cities: {
        istanbul: "Istanbul",
        ankara: "Ankara",
        bursa: "Bursa"
      }
    };

    switch (transferType) {
      case 'airport':
        return id in locationMap.airports
          ? locationMap.airports[id]
          : id in locationMap.districts
            ? locationMap.districts[id]
            : id;
      case 'city':
        return id in locationMap.districts ? locationMap.districts[id] : id;
      case 'intercity':
        return id in locationMap.cities ? locationMap.cities[id] : id;
      default:
        return id;
    }
  };

  // Handle closing confirmation modal
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedVehicle(null);
    setTransferData(null);
    setLocations(null);
  };

  // Helper function to get card color based on vehicle type
  const getCardColorClass = (vehicleType: string) => {
    switch (vehicleType) {
      case 'vito':
        return 'border-blue-500';
      case 'sprinter':
        return 'border-green-500';
      case 'sprinterVIP':
        return 'border-amber-500';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-primary mb-4">{t('featured.popularTransfers')}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t('featured.popularTransfersDesc')}
          </p>
        </motion.div>

        {/* View filters */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveFilter('airport')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'airport'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('featured.airportRoutes')}
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'popular'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('featured.popularRoutes')}
            </button>
          </div>
        </div>

        {/* Slider container */}
        <div className="relative" ref={sliderRef}>
          {/* Navigation buttons */}
          {totalPages > 1 && (
            <>
              <button
                onClick={goToPrevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="h-5 w-5 text-primary" />
              </button>

              <button
                onClick={goToNextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                aria-label="Next"
              >
                <ChevronRightIcon className="h-5 w-5 text-primary" />
              </button>
            </>
          )}

          {/* Slider content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRoutes
                      .slice(
                        pageIndex * routesPerPage,
                        pageIndex * routesPerPage + routesPerPage
                      )
                      .map((route, index) => {
                        const cardColorClass = getCardColorClass(route.vehicleType);

                        return (
                          <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${cardColorClass}`}
                          >
                            {/* Route image */}
                            <div className="relative h-64 overflow-hidden">
                              <img
                                src={route.image}
                                alt={`${route.fromLocation} to ${route.toLocation}`}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent text-white p-4">
                                <span className="text-sm font-medium">
                                  {route.transferType === 'airport'
                                    ? t('transfer.airport')
                                    : route.transferType === 'intercity'
                                    ? t('transfer.intercity')
                                    : t('transfer.cityTransfer')}
                                </span>
                              </div>

                              {/* Popular badge */}
                              {route.isPopular && (
                                <div className="absolute bottom-0 left-0 bg-yellow-500 text-white text-xs font-medium px-2 py-1 m-2 rounded-md flex items-center">
                                  <CheckIcon className="h-3 w-3 mr-1" />
                                  {t('featured.popularRoute')}
                                </div>
                              )}
                            </div>

                            {/* Route info */}
                            <div className="p-5">
                              <div className="flex items-center mb-4">
                                <MapPinIcon className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="ml-2 flex-1 flex items-center">
                                  <span className="text-gray-700 truncate">{route.fromLocation}</span>
                                  <ArrowRightIcon className="h-4 w-4 mx-2 text-secondary flex-shrink-0" />
                                  <span className="text-gray-700 truncate">{route.toLocation}</span>
                                </div>
                              </div>

                              {/* Vehicle Name */}
                              <div className="mb-3 text-sm font-medium text-primary">
                                <span>{route.vehicleName}</span>
                              </div>

                              <div className="grid grid-cols-3 gap-3 mb-5">
                                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
                                  <ClockIcon className="h-4 w-4 text-secondary mb-1" />
                                  <span className="text-xs text-gray-500">{t('transfer.time')}</span>
                                  <span className="text-sm font-medium">{route.estimatedTime} {t('transfer.minutes')}</span>
                                </div>
                                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-secondary mb-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                  </svg>
                                  <span className="text-xs text-gray-500">{t('transfer.distance')}</span>
                                  <span className="text-sm font-medium">{route.distance} km</span>
                                </div>
                                <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2">
                                  <CurrencyEuroIcon className="h-4 w-4 text-secondary mb-1" />
                                  <span className="text-xs text-gray-500">{t('transfer.price')}</span>
                                  <span className="text-sm font-medium">{formatPrice(route.price)}</span>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setQuickBookingData({
                                    isOpen: true,
                                    fromLocationId: route.fromLocationId,
                                    toLocationId: route.toLocationId,
                                    transferType: route.transferType,
                                    selectedRoute: route
                                  })}
                                  className={`w-full py-2 bg-secondary text-white text-center font-medium rounded-md hover:bg-secondary-dark transition-colors block`}
                                >
                                  {t('featured.quickBook')}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentPage === index ? 'bg-primary' : 'bg-gray-300'
                  } hover:bg-primary-light transition-colors`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Booking Widget Modal */}
      <AnimatePresence>
        {quickBookingData && quickBookingData.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <div className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-md'}`}>
              {isMobile && (
                <button
                  onClick={() => setQuickBookingData(null)}
                  className="absolute right-4 top-4 z-10 bg-white rounded-full p-2 shadow-md"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600" />
                </button>
              )}
              <QuickBookingWidget
                fromLocationId={quickBookingData.fromLocationId}
                toLocationId={quickBookingData.toLocationId}
                transferType={quickBookingData.transferType}
                onClose={() => setQuickBookingData(null)}
                onSubmit={handleQuickBooking}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Booking Confirmation Modal */}
      <TransferBookingConfirmation
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        vehicle={selectedVehicle}
        transferData={transferData}
        locations={locations}
      />
    </section>
  );
}
