/**
 * Image Utility Functions for Cart Component Redesign
 * Provides common image handling logic for fallbacks, validation, and sizing
 */

/**
 * Get image URL with fallback to placeholder
 * @param imageUrl   Source image URL (optional)
 * @param fallback   Fallback image URL (defaults to placeholder)
 * @returns          Valid image URL to display
 */
export function getImageUrl(imageUrl?: string, fallback: string = '/assets/placeholder-product.svg'): string {
  if (!imageUrl || !isValidImageUrl(imageUrl)) {
    return fallback;
  }
  return imageUrl;
}

/**
 * Validate if image URL is valid
 * @param url   URL to validate
 * @returns     true if valid URL format
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get responsive image dimensions for breakpoint
 * @param breakpoint  Screen width in pixels (e.g., 320, 480, 768, 1024, 1440)
 * @returns           {width, height, maxWidth, maxHeight} in pixels
 */
export function getResponsiveImageDimensions(breakpoint: number): {
  width: number;
  height: number;
} {
  // Mobile-first: start with smallest size, increase for larger screens
  if (breakpoint < 320) {
    return { width: 60, height: 60 }; // Extra small
  } else if (breakpoint < 480) {
    return { width: 70, height: 70 }; // Mobile
  } else if (breakpoint < 768) {
    return { width: 80, height: 80 }; // Small mobile
  } else if (breakpoint < 1024) {
    return { width: 85, height: 85 }; // Tablet
  } else {
    return { width: 100, height: 100 }; // Desktop+
  }
}

/**
 * Get image alt text for accessibility
 * @param productName   Product name (English)
 * @param productNameTA Product name (Tamil, optional)
 * @returns             Alt text for image
 */
export function getImageAltText(productName: string, productNameTA?: string): string {
  return `Product: ${productName}${productNameTA ? ` / ${productNameTA}` : ''}`;
}

/**
 * Handle image load error
 * Replaces with fallback placeholder
 * @param event         Image load error event
 * @param fallback      Fallback image URL
 */
export function handleImageError(event: Event, fallback: string = '/assets/placeholder-product.svg'): void {
  const img = event.target as HTMLImageElement;
  if (img && img.src !== fallback) {
    console.warn(`Image failed to load: ${img.src}, using fallback`);
    img.src = fallback;
    img.classList.add('image-load-error');
  }
}

/**
 * Preload image for eager-loading
 * Useful for above-fold images (first 3 items in cart)
 * @param imageUrl  URL of image to preload
 */
export function preloadImage(imageUrl: string): void {
  if (!isValidImageUrl(imageUrl)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;
  document.head.appendChild(link);
}

/**
 * Calculate optimal image quality based on connection speed
 * Can be extended for adaptive image loading (WebP format, srcset, etc.)
 * @param isSlowConnection  Whether on slow network (4G, etc.)
 * @returns                 Recommended image quality (1-100)
 */
export function getOptimalImageQuality(isSlowConnection: boolean = false): number {
  if (isSlowConnection) {
    return 75; // Lower quality for slow networks
  }
  return 90; // High quality for normal/fast networks
}
