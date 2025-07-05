'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

export default function PhilosophySection() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      if (sectionRef.current) {
        setSectionTop(sectionRef.current.offsetTop);
      }
    };

    // Add passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Set initial values
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate how much the section has scrolled past the top of the viewport
  const sectionScrollOffset = Math.max(0, scrollY - sectionTop);
  
  // Calculate opacity based on scroll - start fading after 200px of scroll
  const fadeStart = 200;
  const fadeDistance = 300;
  const opacity = Math.max(0, Math.min(0.6, 0.6 - Math.max(0, sectionScrollOffset - fadeStart) / fadeDistance));

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 text-content1-foreground dark:border-none dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 rounded-lg"
    >
      <div className="container z-[1] mx-auto px-4">
        <h2 className="text-3xl relative block z-[100] font-bold text-center mb-10 text-gray-900 dark:text-white">
          Мой подход к красоте
        </h2>
        <div className="flex flex-col z-[4] md:flex-row items-center gap-8 md:gap-12">
          {/* Left side video with decorative sculptures */}
          <div
            className="w-full md:w-1/2 relative animate-fade-in-left z-[3]"
            style={{
              opacity: 0,
              animation: 'fadeInLeft 0.8s ease-out forwards',
              animationDelay: '0.2s',
            }}>
            {/* Video container */}
            <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg z-[4]">
              <video
                src="/olga_action.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: '50% 20%' }}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>

          {/* Right side text content */}
          <div
            className="w-full z-[4] relative md:w-1/2 animate-fade-in-right"
            style={{
              opacity: 0,
              animation: 'fadeInRight 0.8s ease-out forwards',
              animationDelay: '0.4s',
            }}>
            <div className="relative z-[-5]">
              {/* <div
                className="absolute top-[-290px] left-[-160px] md:left-[-120px] lg:left-[-130px]"
                style={{
                  transform: `rotate(${-21 + scrollY * 0.05}deg) translateX(${-sectionScrollOffset * 0.5}px) translateY(${sectionScrollOffset * 0.3}px)`,
                  opacity: opacity,
                  transition: 'transform 0.1s ease-out',
                }}>
                <Image 
                  src="/sculptures/10.png" 
                  alt="Decorative sculpture" 
                  className="object-cover rounded-lg" 
                  width={360} 
                  height={300} 
                />
              </div> */}
              <div
                className="absolute top-[-260px] left-[220px] hidden lg:block"
                style={{
                  transform: `rotate(${18 - scrollY * 0.01}deg) translateX(${sectionScrollOffset * 0.1}px) translateY(${sectionScrollOffset * 0.1}px)`,
                  opacity: opacity,
                  transition: 'transform 0.1s ease-out',
                }}>
                <Image 
                  src="/sculptures/3.png" 
                  alt="Decorative sculpture" 
                  className="object-cover rounded-lg" 
                  width={300} 
                  height={300} 
                />
              </div>
            </div>

            <div className="text-left z-[10]">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                Индивидуальный подход к каждому клиенту
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Я верю, что истинная красота идет изнутри и отражается в здоровье вашей кожи. Моя философия основана на целостном подходе, сочетании передовых
                технологий с проверенными методиками и качественными продуктами.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Каждая процедура подбирается индивидуально, учитывая ваши уникальные особенности и цели. Я стремлюсь не только решить текущие проблемы, но и
                предотвратить появление новых.
              </p>

              {/* Key principles with icons */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="flex items-start space-x-3 animate-fade-up"
                  style={{
                    opacity: 0,
                    animation: 'fadeUp 0.6s ease-out forwards',
                    animationDelay: '0.6s',
                  }}>
                  <div className="text-primary dark:text-primary-400 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Безопасность</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Использую только проверенные методики и сертифицированные продукты
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 animate-fade-up"
                  style={{
                    opacity: 0,
                    animation: 'fadeUp 0.6s ease-out forwards',
                    animationDelay: '0.8s',
                  }}>
                  <div className="text-primary dark:text-primary-400 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Эффективность</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Гарантирую видимый результат после каждой процедуры
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
