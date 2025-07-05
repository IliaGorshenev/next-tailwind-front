'use client';

import Image from 'next/image';
import { Link } from '@heroui/link';
import { button as buttonStyles } from '@heroui/theme';
import { subtitle, title } from '@/components/primitives';
import { useEffect, useState, useRef } from 'react';

export default function HeroSection() {
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

    // Call once to set initial value
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
      className="py-16 md:py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50 via-orange-50/70 to-white text-content1-foreground dark:border-none dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-gray-950 dark:to-gray-1000 rounded-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left side content */}
          <div className="w-full z-[3] md:w-1/2 text-center md:text-left relative">
            {/* Decorative sculpture */}
            <div
              style={{
                opacity: 0,
                animation: 'fadeInLeft 1.2s ease-out forwards',
                animationDelay: '0.2s',
                transform: `rotate(${scrollY * 0.1}deg)`,
                transition: 'transform 0.1s ease-out',
              }}>
              {/* w-20 h-28 md:w-28 md:h-40 lg:w-332 lg:h-444" */}
              <div className="relative z-[5]">
                <div
                  className="absolute top-[-270px] left-[-160px] md:left-[-80px] lg:left-[-160px]"
                  style={{
                    transform: `rotate(${-14 + scrollY * 0.05}deg) translateX(${-sectionScrollOffset * 0.05}px) translateY(${sectionScrollOffset * 0.03}px)`,
                    opacity: opacity,
                    transition: 'transform 0.1s ease-out',
                  }}>
                  <Image src="/sculptures/8.png" alt="Decorative sculpture" className="object-cover rounded-lg" width={390} height={390} />
                </div>
                <div
                  className="absolute top-[-240px] left-[220px] hidden lg:block"
                  style={{
                    transform: `rotate(${18 - scrollY * 0.05}deg) translateX(${sectionScrollOffset * 0.06}px) translateY(${sectionScrollOffset * 0.04}px)`,
                    opacity: opacity,
                    transition: 'transform 0.1s ease-out',
                  }}>
                  <Image src="/sculptures/2.png" alt="Decorative sculpture" className="object-cover rounded-lg" width={340} height={340} />
                </div>
              </div>
            </div>

            <h1
              className={title({
                size: 'lg',
                class: 'mb-4 text-gray-900 dark:text-white animate-fade-in',
              })}
              style={{
                opacity: 0,
                animation: 'fadeIn 0.8s ease-out forwards',
              }}>
              Добро пожаловать!
            </h1>
            <h2
              className={subtitle({
                class: 'text-xl md:text-2xl mb-6 text-gray-700 dark:text-gray-300',
              })}
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.4s',
              }}>
              Меня зовут <span className="font-semibold text-primary">Ольга</span>, ваш эксперт-косметолог
            </h2>
            <p
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}>
              Я посвятила свою карьеру искусству и науке ухода за кожей. Моя миссия — помочь вам обрести здоровую, сияющую кожу и повысить вашу уверенность в себе с
              помощью персонализированных процедур и профессиональных советов.
            </p>
            <div
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.8s',
              }}>
              <Link
                className={buttonStyles({
                  color: 'primary',
                  radius: 'full',
                  variant: 'shadow',
                  size: 'lg',
                })}
                href="/contact">
                Записаться на консультацию
              </Link>
            </div>
          </div>

          {/* Right side hero image */}
          <div
            className="w-full md:w-1/2 animate-fade-in-right"
            style={{
              opacity: 0,
              animation: 'fadeInRight 0.8s ease-out forwards',
              animationDelay: '0.4s',
            }}>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image src="/olga.jpg" alt="Косметолог Ольга" fill priority className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
