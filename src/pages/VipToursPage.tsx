import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import TourCard from "../components/TourCard";
import TourDetailModal from "../components/TourDetailModal";
import BookingForm from "../components/BookingForm";
import Hero from "../components/Hero";
import CategoryFilter, { TourCategory } from "../components/CategoryFilter";

// Import tour data utilities
import { TourType, getAllTours } from "../data/tours";

// Import hero image
import vipTourImage from "../assets/images/vip_tur.png";

const VipToursPage = ({ categoryFilter = "" }: { categoryFilter?: string }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [selectedTour, setSelectedTour] = useState<TourType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [tours, setTours] = useState<TourType[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TourCategory>(categoryFilter as TourCategory);

  // Get localized tours
  useEffect(() => {
    // Get tours with localization based on current language
    const localizedTours = getAllTours(i18n.language);
    setTours(localizedTours);
  }, [i18n.language]);

  // Filter tours based on category and update when tours change
  useEffect(() => {
    if (selectedCategory) {
      setFilteredTours(tours.filter((tour) => tour.type === selectedCategory));
    } else {
      setFilteredTours(tours);
    }
  }, [selectedCategory, tours]);

  // Check for tour query parameter in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tourId = params.get("tour");

    if (tourId) {
      const tour = tours.find((tour) => tour.id === tourId);
      if (tour) {
        setSelectedTour(tour);
        setIsDetailModalOpen(true);
      }
    }
  }, [location.search, tours]);

  // Handle opening the detail modal
  const handleViewDetails = (tour: TourType) => {
    setSelectedTour(tour);
    setIsDetailModalOpen(true);
  };

  // Handle booking
  const handleBookNow = (tour: TourType) => {
    setSelectedTour(tour);
    setIsBookingModalOpen(true);
  };

  // Handle category change
  const handleCategoryChange = (category: TourCategory) => {
    setSelectedCategory(category);
  };

  // Get the appropriate hero title based on category filter
  const getCategoryTitle = () => {
    if (!selectedCategory) return t("vipTours.title");

    switch (selectedCategory) {
      case "cultural-historical":
        return t("nav.culturalHistoricalTours");
      case "shopping-entertainment":
        return t("nav.shoppingEntertainmentTours");
      case "nature-excursion":
        return t("nav.natureExcursionTours");
      case "yacht-boat":
        return t("nav.yachtBoatTours");
      default:
        return t("vipTours.title");
    }
  };

  return (
    <>
      <Hero
        title={getCategoryTitle()}
        subtitle={t("vipTours.subtitle")}
        backgroundImage={vipTourImage}
        overlayOpacity={0.6}
      />

      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <CategoryFilter
            currentCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TourCard
                    tour={tour}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t("transfer.noVehiclesAvailable")}
                </h3>
                <p className="text-gray-600">
                  {t("transfer.noVehiclesMessage")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <TourDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          tour={selectedTour}
          onBookNow={() => {
            setIsDetailModalOpen(false);
            setIsBookingModalOpen(true);
          }}
        />
      )}

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={selectedTour}
      />
    </>
  );
};

export default VipToursPage;
