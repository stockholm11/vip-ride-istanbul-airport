import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export interface TourType {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: number; // hours
  capacity: number; // people
  includes: string[];
  type: string; // For category filtering
  rating?: number; // Make rating optional
  location?: string; // Make location optional
}

interface TourCardProps {
  tour: TourType;
  onViewDetails: (tour: TourType) => void;
  onBookNow: (tour: TourType) => void;
}

const TourCard = ({ tour, onViewDetails, onBookNow }: TourCardProps) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  // Format price based on current language
  const formatPrice = (price: number) => {
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
      {/* Tour Image with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-64 object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-2 rounded-md shadow-lg">
          <span className="font-bold">{formatPrice(tour.price)}</span>
        </div>

        {/* Rating - only if it exists */}
        {tour.rating && (
          <div className="absolute bottom-4 left-4 flex items-center bg-white/90 px-2 py-1 rounded-md">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-4 w-4 ${index < (tour.rating || 0) ? 'text-secondary' : 'text-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-primary mb-2">{tour.title}</h3>

        {/* Location - only if it exists */}
        {tour.location && (
          <div className="text-gray-500 mb-2 text-sm flex items-center">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1">
              {tour.location}
            </span>
          </div>
        )}

        {/* Tour Type Category Badge */}
        {!tour.location && tour.type && (
          <div className="text-gray-500 mb-2 text-sm flex items-center">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 capitalize">
              {tour.type.replace(/-/g, ' ')}
            </span>
          </div>
        )}

        <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>

        {/* Tour Details */}
        <div className="flex flex-wrap gap-3 mb-4 mt-auto">
          <div className="flex items-center text-gray-700">
            <ClockIcon className="h-5 w-5 mr-1 text-secondary" />
            <span>{tour.duration} {t('vipTours.hours')}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <UserGroupIcon className="h-5 w-5 mr-1 text-secondary" />
            <span>{tour.capacity} {t('vipTours.persons')}</span>
          </div>
        </div>

        {/* Includes */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tour.includes.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center text-gray-700 text-sm">
                <CheckCircleIcon className="h-4 w-4 mr-1 text-secondary" />
                <span>{item}</span>
              </div>
            ))}
            {tour.includes.length > 3 && (
              <span className="text-secondary text-sm cursor-pointer hover:underline" onClick={() => onViewDetails(tour)}>
                +{tour.includes.length - 3} {t('vipTours.more')}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(tour)}
            className="flex-1 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
          >
            {t('vipTours.viewDetails')}
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </button>
          <button
            onClick={() => onBookNow(tour)}
            className="flex-1 px-4 py-2 bg-secondary text-white hover:bg-secondary-dark transition-colors"
          >
            {t('vipTours.bookNow')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
