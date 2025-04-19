import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOptimalImageSize } from "../utils/imageUtils";

// Default hero image
import defaultHeroImage from "../assets/images/hero-istanbul.jpg";

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  height?: string;
  overlayOpacity?: number;
}

export default function Hero({
  title,
  subtitle,
  backgroundImage = defaultHeroImage,
  children,
  height = "50vh",
  overlayOpacity = 0.5
}: HeroProps) {
  const { t } = useTranslation();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Update viewport width on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => setIsImageLoaded(true);
  }, [backgroundImage]);

  // Calculate optimal image dimensions
  const imageDimensions = getOptimalImageSize(viewportWidth);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height }}
    >
      {/* Background Image with optimized loading */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}
        aria-label={title || "Hero image"}
        role="img"
      />

      {/* Low quality image placeholder (would be better with a real placeholder) */}
      {!isImageLoaded && (
        <div
          className="absolute inset-0 bg-gray-300"
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {title && (
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl md:text-2xl mb-6">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
