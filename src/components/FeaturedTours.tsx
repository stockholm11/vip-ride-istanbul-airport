import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CalendarIcon, StarIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { generateSrcSet, getResponsiveImageUrl } from "../utils/imageOptimizer";
import { getFeaturedTours, getLocalizedTourDetails } from "../data/tours";
import TourDetailModal from "./TourDetailModal";
import BookingForm from "./BookingForm";
import { TourType } from "./TourCard";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Filter types
type FilterType = "popular" | "seasonal";

// Define a basic tour interface for the featured tours
interface BasicTourInfo {
  id: string;
  title: string;
  image: string;
  duration: number;
  price: number;
  description: string;
  isPopular?: boolean;
  isSeasonal?: boolean;
}

export default function FeaturedTours() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("popular");
  const [filteredTours, setFilteredTours] = useState<BasicTourInfo[]>([]);
  const [tours, setTours] = useState<BasicTourInfo[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Slider states
  const [currentPage, setCurrentPage] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Number of tours to display per page
  const toursPerPage = 3;
  // Total tours we want to show (9 total)
  const totalToursToShow = 9;

  // Load localized tours based on current language
  useEffect(() => {
    const localizedTours = getFeaturedTours(i18n.language);
    console.log("=== DEBUG: Tours Loading ===");
    console.log("All tours:", localizedTours);
    console.log("Popular tours count:", localizedTours.filter(t => t.isPopular).length);
    console.log("Seasonal tours count:", localizedTours.filter(t => t.isSeasonal).length);
    setTours(localizedTours);
  }, [i18n.language]);

  // Apply filter when activeFilter or tours change
  useEffect(() => {
    console.log("=== DEBUG: Filter Change ===");
    console.log("Active filter:", activeFilter);
    console.log("Total tours:", tours.length);

    let filtered: BasicTourInfo[] = [];

    if (activeFilter === "popular") {
      filtered = tours.filter(tour => tour.isPopular === true);
      console.log("Popular tours found:", filtered.length);
      console.log("Popular tour IDs:", filtered.map(t => t.id));
    } else if (activeFilter === "seasonal") {
      filtered = tours.filter(tour => tour.isSeasonal === true);
      console.log("Seasonal tours found:", filtered.length);
      console.log("Seasonal tour IDs:", filtered.map(t => t.id));
    }

    // If no tours found for the current filter, show all tours
    if (filtered.length === 0) {
      console.log("No tours found for filter, showing all tours");
      filtered = tours;
    }

    // Limit the number of tours
    const limitedTours = filtered.slice(0, totalToursToShow);
    console.log("Final tours to display:", limitedTours.length);
    console.log("Final tour IDs:", limitedTours.map(t => t.id));

    setFilteredTours(limitedTours);
  }, [activeFilter, tours]);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  // Get current visible tours
  const currentTours = filteredTours.slice(
    currentPage * toursPerPage,
    currentPage * toursPerPage + toursPerPage
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

  // Handle opening the detail modal
  const handleViewDetails = (tour: BasicTourInfo) => {
    // Prepare full tour data for modal
    const localizedData = getLocalizedTourDetails(tour.id, i18n.language);
    const fullTourData: TourType = {
      ...tour,
      title: tour.title || localizedData.title,
      description: tour.description || localizedData.description,
      capacity: 6, // Default value
      includes: localizedData.includes || [],
      type: "cultural" // Default tour type
    };

    setSelectedTour(fullTourData);
    setIsDetailModalOpen(true);
  };

  // Handle booking
  const handleBookNow = (tour: TourType) => {
    // Close detail modal and open booking modal
    setIsDetailModalOpen(false);
    setIsBookingModalOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            {t("featuredTours.title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("featuredTours.subtitle")}
          </p>
        </div>

        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => {
                console.log("Popular filter clicked");
                setActiveFilter("popular");
              }}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "popular"
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t("featuredTours.popular")}
            </button>
            <button
              onClick={() => {
                console.log("Seasonal filter clicked");
                setActiveFilter("seasonal");
              }}
              className={`px-4 py-2 rounded-md ${
                activeFilter === "seasonal"
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t("featuredTours.seasonal")}
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
                    {filteredTours
                      .slice(
                        pageIndex * toursPerPage,
                        pageIndex * toursPerPage + toursPerPage
                      )
                      .map((tour, index) => {
                        console.log(`Rendering tour card: ${tour.id}`);
                        return (
                          <motion.div
                            key={tour.id}
                            variants={item}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                            style={{ height: '500px' }}
                          >
                            <div className="relative h-64">
                              <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(`Image load error for tour ${tour.id}:`, e);
                                  e.currentTarget.src = '/placeholder.jpg';
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded">
                                €{tour.price}
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                              <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{tour.description}</p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm text-gray-500">
                                  {tour.duration} {t("featuredTours.hours")}
                                </span>
                                <button
                                  onClick={() => handleViewDetails(tour)}
                                  className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-dark transition-colors"
                                >
                                  {t("featuredTours.viewDetails")}
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

        <div className="mt-12 text-center">
          <Link
            to="/vip-tours"
            className="inline-flex items-center px-6 py-3 border border-secondary text-secondary font-medium rounded-md hover:bg-secondary hover:text-white transition-colors"
          >
            {t("featuredTours.viewAll")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Tour Detail Modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onBookNow={handleBookNow}
        />
      )}

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={selectedTour}
      />
    </section>
  );
}
