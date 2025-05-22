import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  UsersIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Vehicle, TransferType } from "../data/vehicles";

// Extend the Vehicle interface for our component to include price property
interface VehicleWithPrice extends Vehicle {
  price?: number;
}

interface VehicleCardProps {
  vehicle: VehicleWithPrice;
  onSelectVehicle: (vehicle: VehicleWithPrice) => void;
  selectedRoute?: {
    from: string;
    to: string;
    fromId?: string;
    toId?: string;
    distance?: number;
    time?: string;
  };
  transferType?: TransferType;
}

const VehicleCard = ({ vehicle, onSelectVehicle, selectedRoute, transferType = 'airport' }: VehicleCardProps) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Format price based on current language
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '';

    return new Intl.NumberFormat(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Vehicle Image with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-64 object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />

        {/* Vehicle Type Badge - Use translations */}
        <div className={`
          absolute top-4 left-4 px-3 py-1 text-xs uppercase font-bold tracking-wider rounded-md
          ${vehicle.type === 'premium' ? 'bg-blue-600 text-white' :
            vehicle.type === 'vip' ? 'bg-purple-600 text-white' : 'bg-secondary text-white'}
        `}>
          {t(`chauffeur.vehicleTypes.${vehicle.type}`)}
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-2 rounded-md shadow-lg">
          <span className="font-bold">{formatPrice(vehicle.price)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-primary mb-1">{vehicle.name}</h3>

        <div className="text-gray-500 mb-3 text-sm">
          <span className="capitalize">{t(`chauffeur.vehicleTypes.${vehicle.type}`)}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {t(`chauffeur.vehicleDescriptions.${vehicle.id}`)}
        </p>

        {/* Vehicle Details */}
        <div className="flex flex-wrap gap-4 mb-4 mt-auto">
          <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            <UsersIcon className="h-5 w-5 mr-1 text-secondary" />
            <span>{vehicle.passengerCapacity} {t('transfer.passengers')}</span>
          </div>
          <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            <BriefcaseIcon className="h-5 w-5 mr-1 text-secondary" />
            <span>{vehicle.luggageCapacity} {t('transfer.luggage')}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {vehicle.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-gray-700 text-sm">
                <CheckCircleIcon className="h-4 w-4 mr-1 text-secondary flex-shrink-0" />
                <span className="truncate">{t(`chauffeur.features.${feature}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onSelectVehicle(vehicle)}
          className="w-full py-3 bg-secondary text-white font-semibold rounded-md hover:bg-secondary-dark transition-colors mt-auto"
        >
          {t('transfer.selectVehicle')}
        </button>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
