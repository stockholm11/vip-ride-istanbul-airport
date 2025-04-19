import { useState, useEffect } from 'react';
import {
  optimizedImageLoader,
  getResponsiveSrcSet,
  getPlaceholderImage,
  type EnhancedImageProps,
  ImageSizes
} from '../../utils/imageUtils';

interface OptimizedImageProps extends EnhancedImageProps {
  containerClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  sizes = '100vw',
  quality,
  objectFit = 'cover',
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurSrc, setBlurSrc] = useState<string | null>(null);

  // Load placeholder if needed
  useEffect(() => {
    if (placeholder === 'blur' && src) {
      setBlurSrc(getPlaceholderImage(src));
    }
  }, [src, placeholder]);

  // Generate optimal sizes for srcSet
  const srcSet = getResponsiveSrcSet(src, {
    sizes: [
      ImageSizes.small,
      ImageSizes.medium,
      ImageSizes.large,
      ImageSizes.xlarge
    ],
    quality
  });

  // Generate optimized src
  const optimizedSrc = optimizedImageLoader(src, {
    width: width || ImageSizes.medium,
    quality,
    loading: priority ? 'eager' : loading
  });

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Style for container
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  // Style for image
  const imageStyle: React.CSSProperties = {
    objectFit,
    width: '100%',
    height: '100%',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  // Style for placeholder
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
    objectFit,
    width: '100%',
    height: '100%',
  };

  // Fallback for error state
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${containerClassName}`}
        style={containerStyle}
      >
        <span className="text-gray-400">{alt || 'Image not available'}</span>
      </div>
    );
  }

  return (
    <div className={containerClassName} style={containerStyle}>
      {/* Placeholder with blur effect */}
      {placeholder === 'blur' && blurSrc && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          style={placeholderStyle}
        />
      )}

      {/* The actual image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={className}
        style={imageStyle}
        width={width}
        height={height}
      />
    </div>
  );
}
