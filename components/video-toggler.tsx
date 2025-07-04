'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoTogglerProps {
  beforeVideo: string;
  afterVideo: string;
  title?: string;
  beforePoster?: string;
  afterPoster?: string;
}

export default function VideoToggler({ beforeVideo, afterVideo, title, beforePoster, afterPoster }: VideoTogglerProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate position as percentage
    const position = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate position as percentage
    const position = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(position);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove as any);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  // Sync video playback
  const syncVideos = (isPlaying: boolean) => {
    if (beforeVideoRef.current && afterVideoRef.current) {
      if (isPlaying) {
        beforeVideoRef.current.play();
        afterVideoRef.current.play();
      } else {
        beforeVideoRef.current.pause();
        afterVideoRef.current.pause();
      }
    }
  };

  const handleVideoPlay = () => syncVideos(true);
  const handleVideoPause = () => syncVideos(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
      {title && (
        <h3 className="text-xl font-bold text-center mb-3 text-gray-800 dark:text-white">
          {title}
        </h3>
      )}
      <div 
        ref={containerRef} 
        className="relative h-[400px] w-full cursor-col-resize"
      >
        {/* After video (full width) */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            ref={afterVideoRef}
            src={afterVideo} 
            className="object-cover w-full h-full"
            poster={afterPoster}
            muted
            loop
            controls
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Before video (clipped) */}
        <div 
          className="absolute inset-0 h-full overflow-hidden" 
          style={{ width: `${sliderPosition}%` }}
        >
          <video 
            ref={beforeVideoRef}
            src={beforeVideo} 
            className="object-cover w-full h-full"
            poster={beforePoster}
            muted
            loop
            controls
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Slider divider */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
          До
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-10">
          После
        </div>
      </div>
    </div>
  );
}
