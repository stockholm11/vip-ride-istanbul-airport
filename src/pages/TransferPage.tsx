import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import TransferBookingForm, { TransferFormData } from "../components/TransferBookingForm";
import MobileBookingForm from "../components/MobileBookingForm";
import VehicleCard from "../components/VehicleCard";
import TransferBookingConfirmation from "../components/TransferBookingConfirmation";
import { getRealDistance, getEstimatedTime } from "../utils/distanceCalculator";
import { useIsMobile } from "../hooks/useMediaQuery";
import { filterVehiclesByCapacity, getVehiclesForTransfer, Vehicle, calculateVehiclePrice, TransferType } from "../data/vehicles";

// Images
import heroImage from "../assets/images/vehicles/mercedes-s-class-airport.jpg";

// Location name mapping
const locationMap: Record<string, Record<string, string>> = {
  airports: {
    ist: "Istanbul Airport (IST)",
    saw: "Sabiha Gökçen Airport (SAW)"
  },
  districts: {
    adalar: "Adalar",
    arnavutkoy: "Arnavutköy",
    atasehir: "Ataşehir",
    avcilar: "Avcılar",
    bagcilar: "Bağcılar",
    bahcelievler: "Bahçelievler",
    bakirkoy: "Bakırköy",
    basaksehir: "Başakşehir",
    bayrampasa: "Bayrampaşa",
    besiktas: "Beşiktaş",
    beykoz: "Beykoz",
    beylikduzu: "Beylikdüzü",
    beyoglu: "Beyoğlu",
    buyukcekmece: "Büyükçekmece",
    catalca: "Çatalca",
    cekmekoy: "Çekmeköy",
    esenler: "Esenler",
    esenyurt: "Esenyurt",
    eyupsultan: "Eyüpsultan",
    fatih: "Fatih",
    gaziosmanpasa: "Gaziosmanpaşa",
    gungoren: "Güngören",
    kadikoy: "Kadıköy",
    kagithane: "Kağıthane",
    kartal: "Kartal",
    kucukcekmece: "Küçükçekmece",
    maltepe: "Maltepe",
    pendik: "Pendik",
    sancaktepe: "Sancaktepe",
    saryer: "Sarıyer",
    silivri: "Silivri",
    sultanahmet: "Sultanahmet",
    sultanbeyli: "Sultanbeyli",
    sultangazi: "Sultangazi",
    sile: "Şile",
    sisli: "Şişli",
    taksim: "Taksim",
    tuzla: "Tuzla",
    umraniye: "Ümraniye",
    uskudar: "Üsküdar",
    zeytinburnu: "Zeytinburnu"
  },
  cities: {
    istanbul: "Istanbul",
    ankara: "Ankara",
    izmir: "Izmir",
    bursa: "Bursa",
    antalya: "Antalya"
  }
};

export default function TransferPage({ initialTransferType }: { initialTransferType?: TransferType }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useState<TransferFormData | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [showVehicles, setShowVehicles] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<{
    fromName: string;
    toName: string;
    fromId?: string;
    toId?: string;
    distance?: number;
    time?: string;
    travelTime?: string;
  } | null>(null);

  // Get default distance based on transfer type when real distance can't be calculated
  const getDefaultDistance = (transferType: TransferType): number => {
    switch (transferType) {
      case 'airport':
        return 40;
      case 'intercity':
        return 200;
      case 'city':
        return 15;
      default:
        return 20;
    }
  };

  // Get readable location names
  const getLocationName = (id: string, transferType: TransferType) => {
    switch (transferType) {
      case 'airport':
        return id in locationMap.airports
          ? locationMap.airports[id]
          : locationMap.districts[id] || id;
      case 'intercity':
        return locationMap.cities[id] || id;
      case 'city':
        return locationMap.districts[id] || id;
      default:
        return id;
    }
  };

  // Handle form search - wrapped in useCallback to prevent recreating the function on each render
  const handleSearch = useCallback((formData: TransferFormData) => {
    setSearchParams(formData);
    setShowVehicles(true);

    // Filter vehicles based on passengers and luggage for transfer service
    const filtered = filterVehiclesByCapacity(
      formData.passengers,
      formData.luggage,
      'transfer'
    );

    setFilteredVehicles(filtered);

    // Set location names for display
    const fromName = getLocationName(formData.fromLocation, formData.transferType);
    const toName = getLocationName(formData.toLocation, formData.transferType);

    // Calculate real distance between locations
    const calculatedDistance = getRealDistance(
      formData.fromLocation,
      formData.toLocation
    );

    // Use the calculated real distance or a fallback depending on transfer type
    const realDistance = calculatedDistance || getDefaultDistance(formData.transferType);

    // Calculate estimated travel time based on distance
    const travelTime = getEstimatedTime(realDistance);

    setLocations({
      fromName,
      toName,
      fromId: formData.fromLocation,
      toId: formData.toLocation,
      distance: realDistance,
      time: formData.time,
      travelTime: travelTime
    });

    // Scroll to vehicles section
    setTimeout(() => {
      const vehiclesElement = document.getElementById('vehicles-section');
      if (vehiclesElement) {
        vehiclesElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // Get vehicles for transfer on component mount
  useEffect(() => {
    // Pre-load all transfer vehicles to have them ready
    getVehiclesForTransfer();

    // Check if there are URL parameters and automatically fill the form
    const location = window.location;
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has('from') && searchParams.has('to')) {
      const fromLocation = searchParams.get('from') || '';
      const toLocation = searchParams.get('to') || '';
      const transferType = (searchParams.get('type') || 'airport') as TransferType;
      const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
      const time = searchParams.get('time') || '10:00';
      const passengers = parseInt(searchParams.get('passengers') || '1', 10);
      const luggage = parseInt(searchParams.get('luggage') || '1', 10);
      const roundTrip = searchParams.get('roundTrip') === 'true';
      const returnDate = roundTrip ? searchParams.get('returnDate') || '' : '';
      const returnTime = roundTrip ? searchParams.get('returnTime') || '' : '';

      // Create a form data object with the URL parameters
      const formData: TransferFormData = {
        transferType,
        fromLocation,
        toLocation,
        date,
        time,
        passengers,
        luggage,
        roundTrip,
        returnDate,
        returnTime,
      };

      // Automatically submit the search
      setTimeout(() => {
        handleSearch(formData);
      }, 300);
    }
  }, [handleSearch]);

  // Determine if it's rush hour
  const isRushHour = (time: string): boolean => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0], 10);
    return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  };

  // Calculate price for a vehicle based on distance
  const calculatePrice = (vehicle: Vehicle, distance?: number): number => {
    if (!distance) return vehicle.basePrice;

    // Check if it's rush hour
    const isRushHourTime = searchParams?.time ? isRushHour(searchParams.time) : false;

    // Call calculateVehiclePrice with only the parameters it accepts
    return calculateVehiclePrice(
      vehicle.id,
      distance,
      isRushHourTime
    );
  };

  // Calculate discounted price directly (replacing calculateDiscountedPrice function)
  const getDiscountedPrice = (vehicle: Vehicle, price: number): number | undefined => {
    if (!vehicle.discountPercentage || vehicle.discountPercentage <= 0) {
      return undefined;
    }

    // Apply discount and round to nearest 10
    const discountedPrice = price * (1 - vehicle.discountPercentage / 100);
    return Math.round(discountedPrice / 10) * 10;
  };

  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: Vehicle) => {
    // Calculate prices for the selected vehicle
    const distance = locations?.distance || 0;
    const price = calculatePrice(vehicle, distance);
    const discountedPrice = getDiscountedPrice(vehicle, price);

    // Create a vehicle with calculated prices
    const vehicleWithPrices = {
      ...vehicle,
      price,
      discountedPrice
    };

    setSelectedVehicle(vehicleWithPrices);
    setShowModal(true);
  };

  return (
    <>
      <Hero
        title={t("transfer.title")}
        subtitle={t("transfer.subtitle")}
        backgroundImage={heroImage}
        overlayOpacity={0.6}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-primary">{t("transfer.title")}</h1>
            <p className="text-lg text-gray-600">{t("transfer.subtitle")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            {isMobile ? (
              <MobileBookingForm onSearch={handleSearch} initialTransferType={initialTransferType} />
            ) : (
              <TransferBookingForm onSearch={handleSearch} initialTransferType={initialTransferType} />
            )}
          </motion.div>
        </div>
      </section>

      {showVehicles && filteredVehicles.length > 0 && (
        <section id="vehicles-section" className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-10 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-primary">
                {locations && (
                  <>
                    {locations.fromName} <span className="text-secondary">→</span> {locations.toName}
                  </>
                )}
              </h2>
              <p className="text-gray-600">
                {searchParams?.roundTrip
                  ? t('transfer.roundTripAvailable')
                  : t('transfer.oneWayTrip')}
              </p>
              {locations?.distance && (
                <p className="mt-2 text-gray-600">
                  {t('transfer.actualDistance')}: {locations.distance} km
                </p>
              )}
              {locations?.travelTime && (
                <p className="mt-1 text-gray-600">
                  {t('transfer.estimatedTravelTime')}: {locations.travelTime}
                </p>
              )}
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle, index) => {
                // Calculate price for each vehicle
                const distance = locations?.distance || 0;
                const price = calculatePrice(vehicle, distance);
                const discountedPrice = getDiscountedPrice(vehicle, price);

                // Create vehicle with calculated price
                const vehicleWithPrice = {
                  ...vehicle,
                  price,
                  discountedPrice
                };

                return (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <VehicleCard
                      vehicle={vehicleWithPrice}
                      onSelectVehicle={handleSelectVehicle}
                      selectedRoute={locations ? {
                        from: locations.fromName,
                        to: locations.toName,
                        fromId: locations.fromId,
                        toId: locations.toId,
                        distance: locations.distance,
                        time: locations.time
                      } : undefined}
                      transferType={searchParams?.transferType}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* No results section */}
      {showVehicles && filteredVehicles.length === 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-md">
                <h3 className="mb-4 text-2xl font-bold text-primary">
                  {t('transfer.noVehiclesAvailable')}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t('transfer.noVehiclesMessage')}
                </p>
                <button
                  onClick={() => setShowVehicles(false)}
                  className="btn-gold px-6 py-3"
                >
                  {t('transfer.modifySearch')}
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Why choose us section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary">
              {t('transfer.whyChooseUs')}
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {t('transfer.whyChooseUsSubtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-primary">
                {t('transfer.punctuality')}
              </h3>
              <p className="text-gray-600">
                {t('transfer.punctualityText')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-primary">
                {t('transfer.safety')}
              </h3>
              <p className="text-gray-600">
                {t('transfer.safetyText')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-primary">
                {t('transfer.comfort')}
              </h3>
              <p className="text-gray-600">
                {t('transfer.comfortText')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-primary">
                {t('transfer.affordability')}
              </h3>
              <p className="text-gray-600">
                {t('transfer.affordabilityText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking confirmation modal */}
      <TransferBookingConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vehicle={selectedVehicle}
        transferData={searchParams}
        locations={locations}
      />
    </>
  );
}
