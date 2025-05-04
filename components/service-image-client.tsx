'use client'; 

import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

interface ServiceImageClientProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string | null | undefined; // Allow null/undefined src
  fallbackSrc?: string | null; // Optional fallback image URL
  renderOnError?: () => React.ReactNode; // Optional function to render custom content on error
}

const ServiceImageClient: React.FC<ServiceImageClientProps> = ({
  src,
  fallbackSrc,
  renderOnError,
  alt,
  ...props // Spread the rest of the ImageProps
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc || null);
  const [hasError, setHasError] = useState(!src); // Start with error if src is initially invalid

  // Handle image loading errors
  const handleError = () => {
    setHasError(true);
    // If a fallbackSrc is provided, try using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    // If no fallbackSrc or fallback also failed, the component might render nothing or custom content
  };

  // If there's an error and a custom error renderer is provided, use it
  if (hasError && renderOnError) {
    return <>{renderOnError()}</>;
  }

  // If there's an error and NO custom renderer or fallback, render nothing or a default placeholder
  if (hasError && !currentSrc && !renderOnError) {
     // Optionally render a default placeholder SVG or div here instead of null
     // e.g., <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">...</div>
    return null; // Or return a default placeholder
  }

  // If we have a valid source (original or fallback), render the image
  if (currentSrc) {
    return (
      <Image
        src={currentSrc}
        alt={alt} // Pass alt text
        onError={handleError} // Attach the error handler
        {...props} // Spread remaining props (fill, sizes, className, etc.)
      />
    );
  }

  // Fallback case if src was initially null/undefined and no fallback/renderOnError provided
  return null; // Or return a default placeholder
};

export default ServiceImageClient;

