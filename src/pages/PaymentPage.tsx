import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import { TransferFormData } from "../components/TransferBookingForm";
import { Vehicle, getVehiclesForTransfer } from "../data/vehicles";
import TransferBookingConfirmation from "../components/TransferBookingConfirmation";

// Vehicle options for the payment page (using data from vehicles.ts)
const vehicles: Vehicle[] = getVehiclesForTransfer().filter(v =>
  v.type === 'premium' || v.type === 'vip'
).slice(0, 2); // Just get first two premium/vip vehicles for payment options

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

// Distance estimates for quick calculation
const distanceEstimates: Record<string, Record<string, number>> = {
  // Airport to district distances (in km)
  airports: {
    ist_taksim: 41,
    ist_sultanahmet: 47,
    ist_besiktas: 38,
    ist_kadikoy: 52,
    ist_uskudar: 46,
    ist_sisli: 35,
    ist_fatih: 44,
    saw_taksim: 53,
    saw_sultanahmet: 48,
    saw_besiktas: 45,
    saw_kadikoy: 30,
    saw_uskudar: 25,
    saw_sisli: 40,
    saw_fatih: 50
  },
  // District to district distances (in km)
  districts: {
    taksim_sultanahmet: 6,
    taksim_besiktas: 5,
    taksim_kadikoy: 12,
    taksim_uskudar: 10,
    taksim_sisli: 4,
    taksim_fatih: 7
  }
};

export default function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);
  const [transferData, setTransferData] = useState<TransferFormData | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [locationInfo, setLocationInfo] = useState<{
    fromName: string;
    toName: string;
    distance?: number;
    fromId?: string;
    toId?: string;
    travelTime?: string;
  } | null>(null);

  // When component mounts, check URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Extract parameters
    const fromLocation = params.get('from') || '';
    const toLocation = params.get('to') || '';
    const transferType = (params.get('type') || 'airport') as 'airport' | 'city' | 'intercity';
    const date = params.get('date') || new Date().toISOString().split('T')[0];
    const time = params.get('time') || '10:00';
    const passengers = parseInt(params.get('passengers') || '1', 10);
    const luggage = parseInt(params.get('luggage') || '1', 10);
    const roundTrip = params.get('roundTrip') === 'true';
    const returnDate = params.get('returnDate');
    const returnTime = params.get('returnTime');

    // Validate required parameters
    if (!fromLocation || !toLocation || !transferType || !date || !time) {
      navigate('/transfer');
      return;
    }

    // Set transfer data
    setTransferData({
      transferType,
      fromLocation,
      toLocation,
      date,
      time,
      passengers,
      luggage,
      roundTrip,
      returnDate: returnDate || '',
      returnTime: returnTime || ''
    });

    // Get location names and estimate distance
    const fromName = getLocationName(fromLocation, transferType);
    const toName = getLocationName(toLocation, transferType);

    // Calculate distance
    let distance = 0;
    if (transferType === 'airport') {
      // Check which one is the airport
      if (fromLocation in locationMap.airports) {
        distance = distanceEstimates.airports[`${fromLocation}_${toLocation}`] || 40;
      } else {
        distance = distanceEstimates.airports[`${toLocation}_${fromLocation}`] || 40;
      }
    } else if (transferType === 'city') {
      // Sort locations to match the format in distance estimates
      const [locA, locB] = [fromLocation, toLocation].sort();
      distance = distanceEstimates.districts[`${locA}_${locB}`] || 10;
    } else {
      // Intercity
      distance = 150; // Default distance for intercity
      if (fromLocation === 'istanbul' && toLocation === 'bursa') {
        distance = 154;
      } else if (fromLocation === 'istanbul' && toLocation === 'ankara') {
        distance = 450;
      }
    }

    // Set location info
    setLocationInfo({
      fromName,
      toName,
      fromId: fromLocation,
      toId: toLocation,
      distance,
      travelTime: `${Math.floor(distance / 60)}-${Math.ceil(distance / 45)} ${t('transfer.minutes')}`
    });

    // Automatically select the first vehicle if we have valid parameters
    if (vehicles.length > 0) {
      // Find an appropriate vehicle based on passenger count
      const appropriateVehicle = vehicles.find(v =>
        v.passengerCapacity >= passengers && v.luggageCapacity >= luggage
      ) || vehicles[0];

      setSelectedVehicle(appropriateVehicle);

      // Automatically show confirmation modal after a slight delay
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  }, [navigate, t]);

  // Get readable location names
  const getLocationName = (id: string, transferType: 'airport' | 'city' | 'intercity') => {
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

  // Handle modal close - only allow closing after successful submission or via cancel button
  const handleModalClose = () => {
    // We're not allowing the modal to be closed via the backdrop or escape key
    // This ensures the user can't accidentally close the form before completion

    // If you absolutely need to close it (for testing), uncomment these lines:
    // setShowModal(false);
    // navigate('/transfer');
  };

  return (
    <>
      <Hero
        title={t("transfer.bookNow")}
        subtitle={t("transfer.completeYourBooking")}
        overlayOpacity={0.7}
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-primary">{t("transfer.completeBooking")}</h1>
            <p className="text-lg text-gray-600">{t("transfer.reviewAndPay")}</p>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      {transferData && selectedVehicle && locationInfo && (
        <TransferBookingConfirmation
          isOpen={showModal}
          onClose={handleModalClose}
          vehicle={selectedVehicle}
          transferData={transferData}
          locations={locationInfo}
        />
      )}
    </>
  );
}
