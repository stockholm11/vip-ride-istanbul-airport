import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// Import testimonial images
import businessWoman from "../assets/images/testimonials/business-woman.jpg";
import businessMan from "../assets/images/testimonials/business-man.jpg";
import couple from "../assets/images/testimonials/couple.jpg";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Executive",
    company: "Global Ventures",
    image: businessWoman,
    text: "The service was exceptional from start to finish. The Mercedes V-Class was immaculate, and the driver was professional and punctual. Perfect for my business trips in Istanbul!",
    rating: 5,
    service: "Airport Transfer"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Senior Manager",
    company: "Tech Innovations",
    image: businessMan,
    text: "I've used many transfer services around the world, but VIP Ride Istanbul Airport stands out. The Sprinter VIP was luxurious and comfortable, making my intercity travel in Turkey a pleasure.",
    rating: 5,
    service: "Intercity Transfer"
  },
  {
    id: 3,
    name: "Ayşe & Ali Yilmaz",
    role: "Newlyweds",
    company: "",
    image: couple,
    text: "We booked the Mercedes V-Class for our wedding day transfers, and it was the perfect choice. Elegant, spacious, and the driver was so accommodating. It made our special day even better!",
    rating: 5,
    service: "Wedding Transfer"
  }
];

export default function CustomerTestimonials() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-[460px] md:h-[400px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`absolute top-0 left-0 w-full bg-white rounded-lg shadow-lg overflow-hidden ${
                  index === activeIndex ? "z-10" : "opacity-0"
                }`}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  x: index === activeIndex ? 0 : 100,
                  zIndex: index === activeIndex ? 10 : 0
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-2/5 h-64 md:h-auto">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                      <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>

                      <div className="flex items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-primary">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600">
                            {testimonial.role}
                            {testimonial.company && `, ${testimonial.company}`}
                          </p>
                          <p className="text-secondary font-medium mt-1">
                            {testimonial.service}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                        Mercedes-Benz {testimonial.service.includes("Wedding") ? "V-Class" : testimonial.service.includes("Intercity") ? "Sprinter VIP" : "V-Class"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? "bg-secondary" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
