import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getResponsiveImageUrl } from "../utils/imageOptimizer";

interface CategoryHeroProps {
  categoryId?: string;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

// Category background images and info
const categoryImages: Record<string, {
  image: string;
  title?: string;
  subtitle?: string;
}> = {
  "all": {
    image: "https://images.unsplash.com/photo-1624798911782-d5754408b763?q=80&w=1000&auto=format&fit=crop",
  },
  "cultural-historical": {
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1000&auto=format&fit=crop",
    title: "Cultural & Historical Tours",
    subtitle: "Discover Istanbul's rich heritage with our guided cultural and historical tours"
  },
  "shopping-entertainment": {
    image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1000&auto=format&fit=crop",
    title: "Shopping & Entertainment Tours",
    subtitle: "Experience Istanbul's vibrant shopping destinations and entertainment venues"
  },
  "nature-excursion": {
    image: "https://images.unsplash.com/photo-1533113241425-39c95dd2cdaf?q=80&w=1000&auto=format&fit=crop",
    title: "Nature & Excursion Tours",
    subtitle: "Escape the city and explore the natural beauty surrounding Istanbul"
  },
  "yacht-boat": {
    image: "https://images.unsplash.com/photo-1599499347331-c0d08a0f0e3b?q=80&w=1000&auto=format&fit=crop",
    title: "Yacht & Boat Tours",
    subtitle: "Cruise the Bosphorus in style with our luxury yacht and boat tours"
  },
  "medical": {
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
    title: "Medical Tourism Packages",
    subtitle: "Combine healthcare services with luxury accommodation and transportation"
  },
  "sports": {
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop",
    title: "Sports & Activities",
    subtitle: "Experience Istanbul's sporting events and active adventures"
  }
};

export default function CategoryHero({
  categoryId = "all",
  title,
  subtitle,
  backgroundImage
}: CategoryHeroProps) {
  const { t } = useTranslation();

  // Get category details if categoryId is provided
  const categoryDetails = categoryId ? (categoryImages[categoryId] || categoryImages["all"]) : { image: "" };

  // Use provided image or fall back to category image
  const imageUrl = backgroundImage || categoryDetails.image || categoryImages["all"].image;

  // Use provided title/subtitle or fall back to category details or translations
  const displayTitle = title || (categoryId ? categoryDetails.title : null) || t("vipTours.title");
  const displaySubtitle = subtitle || (categoryId ? categoryDetails.subtitle : null) || t("vipTours.subtitle");

  // Get optimized image based on screen size
  const mobileImage = getResponsiveImageUrl(imageUrl, 'mobile');
  const desktopImage = getResponsiveImageUrl(imageUrl, 'desktop');

  return (
    <div className="relative h-96 w-full overflow-hidden">
      {/* Background Image with picture element for responsive images */}
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopImage} />
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <img
          src={mobileImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </picture>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {displayTitle}
            </h1>
            <p className="mb-10 text-lg text-gray-200 md:text-xl">
              {displaySubtitle}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
