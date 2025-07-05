'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const sculptureImages = [
  '/sculptures/1.png',
  '/sculptures/2.png',
  '/sculptures/3.png',
  '/sculptures/4.png',
  '/sculptures/5.png',
  '/sculptures/6.png',
  '/sculptures/7.png',
  '/sculptures/8.png',
  '/sculptures/9.png',
  '/sculptures/10.png',
  '/sculptures/11.png',
  '/sculptures/12.png',
];

export default function ScrollingSculptures() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSculptures, setVisibleSculptures] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Calculate which sculptures should be visible based on scroll position
      const scrollSections = Math.floor(currentScrollY / 200); // Every 200px of scroll
      const activeSculptures: number[] = [];

      // Show different sculptures based on scroll position
      for (let i = 0; i < 8; i++) {
        const shouldShow = Math.floor((currentScrollY + i * 100) / 300) % 2 === 0;
        if (shouldShow) {
          activeSculptures.push(i);
        }
      }

      setVisibleSculptures(activeSculptures);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSculptureOpacity = (index: number) => {
    if (!visibleSculptures.includes(index)) return 0;
    
    // Create a fade effect based on scroll position
    const fadePosition = (scrollY + index * 50) % 400;
    if (fadePosition < 100) return fadePosition / 100 * 0.2;
    if (fadePosition > 300) return (400 - fadePosition) / 100 * 0.2;
    return 0.2;
  };

  const getSculptureImage = (index: number) => {
    const imageIndex = Math.floor((scrollY / 150 + index) % sculptureImages.length);
    return sculptureImages[imageIndex];
  };

  return (
    <>
      {/* Top Left */}
      <div 
        className="fixed top-20 left-8 z-0 transition-opacity duration-500"
        style={{ opacity: getSculptureOpacity(0) }}
      >
        <div className="relative w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52">
          <Image
            src={getSculptureImage(0)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-lg shadow-xl"
            style={{ filter: 'grayscale(60%)' }}
          />
        </div>
      </div>

      {/* Top Right */}
      <div 
        className="fixed top-32 right-8 z-0 transition-opacity duration-700"
        style={{ opacity: getSculptureOpacity(1) }}
      >
        <div className="relative w-20 h-28 md:w-28 md:h-36 lg:w-36 lg:h-48">
          <Image
            src={getSculptureImage(1)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-full shadow-xl"
            style={{ filter: 'grayscale(70%) sepia(10%)' }}
          />
        </div>
      </div>

      {/* Middle Left */}
      <div 
        className="fixed top-1/2 left-4 -translate-y-1/2 z-0 transition-opacity duration-600"
        style={{ opacity: getSculptureOpacity(2) }}
      >
        <div className="relative w-28 h-36 md:w-36 md:h-48 lg:w-44 lg:h-60">
          <Image
            src={getSculptureImage(2)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-lg shadow-2xl"
            style={{ filter: 'grayscale(50%) contrast(1.1)' }}
          />
        </div>
      </div>

      {/* Middle Right */}
      <div 
        className="fixed top-1/3 right-4 z-0 transition-opacity duration-800"
        style={{ opacity: getSculptureOpacity(3) }}
      >
        <div className="relative w-26 h-34 md:w-34 md:h-44 lg:w-42 lg:h-56">
          <Image
            src={getSculptureImage(3)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-lg shadow-2xl"
            style={{ filter: 'grayscale(40%) sepia(15%)' }}
          />
        </div>
      </div>

      {/* Bottom Left */}
      <div 
        className="fixed bottom-32 left-12 z-0 transition-opacity duration-500"
        style={{ opacity: getSculptureOpacity(4) }}
      >
        <div className="relative w-22 h-30 md:w-30 md:h-38 lg:w-38 lg:h-50">
          <Image
            src={getSculptureImage(4)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-full shadow-xl"
            style={{ filter: 'grayscale(65%) blur(0.5px)' }}
          />
        </div>
      </div>

      {/* Bottom Right */}
      <div 
        className="fixed bottom-20 right-12 z-0 transition-opacity duration-700"
        style={{ opacity: getSculptureOpacity(5) }}
      >
        <div className="relative w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52">
          <Image
            src={getSculptureImage(5)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-lg shadow-xl"
            style={{ filter: 'grayscale(55%) contrast(1.2)' }}
          />
        </div>
      </div>

      {/* Center floating elements */}
      <div 
        className="fixed top-1/4 left-1/4 z-0 transition-opacity duration-900"
        style={{ opacity: getSculptureOpacity(6) }}
      >
        <div className="relative w-16 h-22 md:w-20 md:h-28 lg:w-24 lg:h-32">
          <Image
            src={getSculptureImage(6)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-full shadow-lg"
            style={{ filter: 'grayscale(80%) blur(1px)' }}
          />
        </div>
      </div>

      <div 
        className="fixed bottom-1/3 right-1/3 z-0 transition-opacity duration-600"
        style={{ opacity: getSculptureOpacity(7) }}
      >
        <div className="relative w-18 h-24 md:w-24 md:h-32 lg:w-28 lg:h-36">
          <Image
            src={getSculptureImage(7)}
            alt="Decorative sculpture"
            fill
            className="object-cover rounded-lg shadow-lg"
            style={{ filter: 'grayscale(75%) sepia(5%)' }}
          />
        </div>
      </div>
    </>
  );
}
