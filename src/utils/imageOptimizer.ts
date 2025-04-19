/**
 * Utility to optimize images by appending query parameters to Unsplash URLs
 * for responsive loading based on device size
 */

interface OptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  fit?: 'crop' | 'clamp' | 'fill';
}

/**
 * Optimizes Unsplash image URLs by adding query parameters
 * for different device sizes and image quality
 */
export const optimizeImage = (url: string, options: OptimizationOptions = {}): string => {
  if (!url) return '';

  // Only process Unsplash URLs
  if (!url.includes('unsplash.com')) {
    return url;
  }

  // Default values
  const {
    width = 800,
    quality = 80,
    format = 'auto',
    fit = 'crop'
  } = options;

  // Parse existing URL
  const baseUrl = url.split('?')[0];

  // Construct query parameters
  const params = new URLSearchParams();
  params.append('q', quality.toString());
  params.append('w', width.toString());
  params.append('fit', fit);
  params.append('fm', format);
  params.append('auto', 'compress');

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Returns a srcSet string for responsive images with multiple sizes
 */
export const generateSrcSet = (url: string, sizes: number[] = [400, 800, 1200]): string => {
  if (!url || !url.includes('unsplash.com')) {
    return url;
  }

  // Parse existing URL
  const baseUrl = url.split('?')[0];

  // Generate srcSet string with multiple widths
  return sizes.map(size => {
    const params = new URLSearchParams();
    params.append('q', '80');
    params.append('w', size.toString());
    params.append('fit', 'crop');
    params.append('auto', 'compress');
    return `${baseUrl}?${params.toString()} ${size}w`;
  }).join(', ');
};

/**
 * Returns an optimized image for thumbnails and previews
 */
export const getThumbnail = (url: string, size = 200): string => {
  return optimizeImage(url, { width: size, quality: 70 });
};

/**
 * Returns different sizes for different devices
 */
export const getResponsiveImageUrl = (url: string, deviceSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'): string => {
  const sizes = {
    mobile: 480,
    tablet: 768,
    desktop: 1200
  };

  return optimizeImage(url, { width: sizes[deviceSize] });
};

export default {
  optimizeImage,
  generateSrcSet,
  getThumbnail,
  getResponsiveImageUrl
};
