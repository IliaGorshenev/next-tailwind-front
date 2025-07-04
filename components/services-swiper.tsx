'use client';

import { button as buttonStyles } from '@heroui/theme';
import { Link } from '@heroui/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Define the Service type to match your data structure
interface Service {
  id: string | number;
  title: string;
  description: string;
  slug: string;
  image?: any[];
}

interface ServicesCarouselProps {
  services: Service[];
  apiBaseUrl: string;
}

export default function ServicesCarousel({ services, apiBaseUrl }: ServicesCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center flex-grow">Популярные услуги</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrev} 
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" 
            aria-label="Previous service"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext} 
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" 
            aria-label="Next service"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swiper component */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1}
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {services.map((service, index) => {
          const imageUrl = service.image?.[0]?.formats?.medium?.url || service.image?.[0]?.url;
          const fullImageUrl = imageUrl 
            ? (imageUrl.startsWith('http') ? imageUrl : `${apiBaseUrl}${imageUrl}`) 
            : '/images/placeholder-service.png';

          return (
            <SwiperSlide key={service.id}>
              <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent dark:border-gray-700/50 flex flex-col h-full">
                {imageUrl ? (
                  <div className="relative h-48 w-full">
                    <Image
                      fill
                      alt={service.title || 'Изображение услуги'}
                      className="object-cover"
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={fullImageUrl}
                    />
                  </div>
                ) : (
                  <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Нет изображения</span>
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm flex-grow">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      className={buttonStyles({
                        color: 'primary',
                        variant: 'solid',
                        size: 'sm',
                        radius: 'md',
                      })}
                      href={`/services/${service.slug}`}
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
