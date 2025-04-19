/**
 * Enhanced Image Utilities for optimized loading
 *
 * This module provides utility functions for handling images optimally
 */

// Supported image formats for modern browsers
const IMAGE_FORMATS = ['webp', 'avif', 'jpg', 'png'];

// Predefined sizes for responsive images
const RESPONSIVE_SIZES = {
  thumbnail: 240,
  small: 480,
  medium: 768,
  large: 1024,
  xlarge: 1600
};

// Quality settings based on image purpose
const QUALITY_SETTINGS = {
  high: 90,
  medium: 75,
  low: 60,
  thumbnail: 50
};

/**
 * A more robust image loader with loading strategy
 *
 * @param src - Source URL of the image
 * @param options - Options for loading optimization
 * @returns Optimized image URL or original if can't be optimized
 */
export const optimizedImageLoader = (
  src: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'avif';
    loading?: 'lazy' | 'eager';
    fallback?: string;
  } = {}
): string => {
  // Return fallback if src is empty
  if (!src) return options.fallback || '';

  // For local assets, we can't manipulate them programmatically at runtime
  // We would need a build-time tool for full optimization
  if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
    return src;
  }

  // For external images like Unsplash, we can add optimization parameters
  if (src.includes('unsplash.com')) {
    const width = options.width || RESPONSIVE_SIZES.medium;
    const quality = options.quality || QUALITY_SETTINGS.medium;
    const format = options.format || 'webp';

    // Build optimized URL with parameters
    const baseUrl = src.split('?')[0];
    const params = new URLSearchParams();
    params.append('w', width.toString());
    params.append('q', quality.toString());
    params.append('fm', format);
    params.append('auto', 'compress');

    return `${baseUrl}?${params.toString()}`;
  }

  // For other image hosts, return as is
  return src;
};

/**
 * Generate a proper srcSet string for responsive images
 *
 * @param src - Source URL of the image
 * @param options - Options for srcSet generation
 * @returns srcSet string for responsive images
 */
export const getResponsiveSrcSet = (
  src: string,
  options: {
    sizes?: number[];
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'avif';
  } = {}
): string => {
  // If not optimizable, return as is
  if (!src || !(src.includes('unsplash.com'))) {
    return src;
  }

  const sizes = options.sizes || [
    RESPONSIVE_SIZES.small,
    RESPONSIVE_SIZES.medium,
    RESPONSIVE_SIZES.large
  ];
  const quality = options.quality || QUALITY_SETTINGS.medium;
  const format = options.format || 'webp';

  // Generate srcSet with different widths
  const baseUrl = src.split('?')[0];

  return sizes.map(size => {
    const params = new URLSearchParams();
    params.append('w', size.toString());
    params.append('q', quality.toString());
    params.append('fm', format);
    params.append('auto', 'compress');
    return `${baseUrl}?${params.toString()} ${size}w`;
  }).join(', ');
};

/**
 * Generate BlurHash placeholder for progressive loading
 * This is a simplified version - actual implementation would use a library like blurhash
 *
 * @param src - Source URL of the image
 * @returns A tiny version of the image for placeholders
 */
export const getPlaceholderImage = (src: string): string => {
  if (!src || !(src.includes('unsplash.com'))) {
    return src;
  }

  // Create a tiny placeholder version of the image
  const baseUrl = src.split('?')[0];
  const params = new URLSearchParams();
  params.append('w', '10');
  params.append('q', '10');
  params.append('blur', '10');

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Get appropriate image size based on viewport or container size
 *
 * @param containerWidth - Width of the container in pixels or percentage
 * @param viewportWidth - Width of the viewport
 * @returns Best matching standardized width for responsive images
 */
export const getOptimalImageSize = (
  containerWidth: number | string,
  viewportWidth = window.innerWidth
): number => {
  // Convert percentage to pixels
  const calculatedWidth = typeof containerWidth === 'string' && containerWidth.includes('%')
    ? (viewportWidth * parseInt(containerWidth, 10)) / 100
    : typeof containerWidth === 'number'
      ? containerWidth
      : viewportWidth;

  // Match to nearest standardized size
  const sizes = Object.values(RESPONSIVE_SIZES).sort((a, b) => a - b);

  // Find the first size that is greater than the calculated width
  // or return the largest size if none found
  for (const size of sizes) {
    if (size >= calculatedWidth) {
      return size;
    }
  }

  return sizes[sizes.length - 1];
};

/**
 * Enhanced image component props
 */
export interface EnhancedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  quality?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
}

/**
 * Helper constants exported for use in components
 */
export const ImageSizes = RESPONSIVE_SIZES;
export const ImageQuality = QUALITY_SETTINGS;
export const ImageFormats = IMAGE_FORMATS;

export default {
  optimizedImageLoader,
  getResponsiveSrcSet,
  getPlaceholderImage,
  getOptimalImageSize,
  ImageSizes,
  ImageQuality,
  ImageFormats
};
