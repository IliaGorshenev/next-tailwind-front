'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import MediaSwiper from './media-swiper';
import VideoToggler from './video-toggler';
import BeforeAfterSlider from './work-divider';
import { Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { button as buttonStyles } from '@heroui/theme';
import Link from 'next/link';
export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ImageData {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Work {
  id: number;
  documentId: string;
  title: string;
  before_after: boolean;
  description: string;
  additional_description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  photos: ImageData[];
}

export interface WorksResponse {
  data: Work[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Helper function to extract image URL from Strapi image data
export function getImageUrl(imageData: ImageData | undefined, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
  if (!imageData) return null;

  // Try to get the requested format, fall back to original URL
  if (imageData.formats && imageData.formats[format]) {
    return `https://admin.spb-cosmetologist.ru${imageData.formats[format].url}`;
  }

  // Fall back to the original URL if the format doesn't exist
  return `https://admin.spb-cosmetologist.ru${imageData.url}`;
}

// Helper function to check if media is a video
export function isVideoMedia(media: ImageData | undefined): boolean {
  if (!media) return false;

  return media.mime?.startsWith('video/');
}

export function getMediaUrl(media: ImageData | undefined): string | null {
  if (!media) return null;

  const url = media.url;
  if (!url) return null;

  return `https://admin.spb-cosmetologist.ru${url}`;
}

async function getWorks() {
  try {
    const response = await fetch('https://admin.spb-cosmetologist.ru/api/works?populate=*', {
      next: { revalidate: 3000 }, // Revalidate every hour
    });

    if (!response.ok) {
      return { works: [], error: 'Не удалось загрузить работы' };
    }

    const data: WorksResponse = await response.json();
    return { works: data.data, error: null };
  } catch (error) {
    console.error('Error fetching works:', error);
    return { works: [], error: 'Произошла ошибка при загрузке работ' };
  }
}
export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setDomLoaded(true);

    async function fetchWorks() {
      try {
        const response = await fetch('https://admin.spb-cosmetologist.ru/api/works?populate=*');

        if (!response.ok) {
          setError('Не удалось загрузить работы');
          setLoading(false);
          return;
        }

        const data: WorksResponse = await response.json();
        setWorks(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching works:', error);
        setError('Произошла ошибка при загрузке работ');
        setLoading(false);
      }
    }

    fetchWorks();
  }, []);

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

  if (!domLoaded || loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Мои работы</h2>
        <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Мои работы</h2>
        <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Мои работы</h2>
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">Работы не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex-grow">Мои работы</h2>
        <div className="flex space-x-2">
          <button onClick={handlePrev} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" aria-label="Previous work">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" aria-label="Next work">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-full">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView={1}
          modules={[Navigation]}
          allowTouchMove={false}
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
          className="mySwiper ">
          {works.map((work) => {
            // Get the first two photos for before/after if available
            const beforeMedia = work.photos && work.photos.length > 0 ? work.photos[0] : undefined;
            const afterMedia = work.photos && work.photos.length > 1 ? work.photos[1] : beforeMedia;

            // Check if media items are videos
            const isBeforeVideo = isVideoMedia(beforeMedia);
            const isAfterVideo = isVideoMedia(afterMedia);

            // Get URLs for media items
            const beforeImageUrl = !isBeforeVideo ? getImageUrl(beforeMedia, 'medium') : null;
            const afterImageUrl = !isAfterVideo ? getImageUrl(afterMedia, 'medium') : null;

            const beforeVideoUrl = isBeforeVideo ? getMediaUrl(beforeMedia) : null;
            const afterVideoUrl = isAfterVideo ? getMediaUrl(afterMedia) : null;

            // Get poster images for videos if available
            const beforePoster = beforeMedia?.formats?.thumbnail?.url ? `https://admin.spb-cosmetologist.ru${beforeMedia.formats.thumbnail.url}` : undefined;
            const afterPoster = afterMedia?.formats?.thumbnail?.url ? `https://admin.spb-cosmetologist.ru${afterMedia.formats.thumbnail.url}` : undefined;

            // Fallback to placeholder images if no photos are available
            const fallbackBeforeUrl = `/images/work-${work.id}-before.jpg`;
            const fallbackAfterUrl = `/images/work-${work.id}-after.jpg`;

            return (
              <SwiperSlide key={work.id}>
                <div className="bg-white my-2 h-fulll dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent dark:border-gray-700/50 flex flex-col h-full ">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white p-4 text-left">{work.title}</h3>

                  {/* Before/After slider for images */}
                  {work.before_after && beforeImageUrl && afterImageUrl ? (
                    <div className="w-full">
                      <div className="min-h-[400px] max-h-[400px] h-[400px] w-full overflow-hidden">
                        <BeforeAfterSlider beforeImage={beforeImageUrl} afterImage={afterImageUrl} />
                      </div>
                    </div>
                  ) : /* Before/After toggler for videos */
                  work.before_after && beforeVideoUrl && afterVideoUrl ? (
                    <div className="relative min-h-[400px] max-h-[400px] h-[400px] w-full overflow-hidden">
                      <VideoToggler beforeVideo={beforeVideoUrl} afterVideo={afterVideoUrl} beforePoster={beforePoster} afterPoster={afterPoster} />
                    </div>
                  ) : /* Use Swiper for auto-sliding when before_after is false */
                  !work.before_after && work.photos.length > 0 ? (
                    <MediaSwiper mediaItems={work.photos} title={work.title} />
                  ) : /* Single video display - with autoplay and no controls */
                  beforeVideoUrl || afterVideoUrl ? (
                    <div className="relative min-h-[400px] max-h-[400px] h-[400px] w-full overflow-hidden">
                      <video
                        src={beforeVideoUrl || afterVideoUrl || ''}
                        className="object-cover w-full h-full"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={beforeMedia?.formats?.thumbnail?.url ? `https://admin.spb-cosmetologist.ru${beforeMedia.formats.thumbnail.url}` : undefined}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : /* Single image display */
                  beforeImageUrl ? (
                    <div className="relative min-h-[400px] max-h-[400px] h-[400px] w-full overflow-hidden">
                      <img src={beforeImageUrl} alt={work.title} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="relative min-h-[400px] max-h-[400px] h-[400px] w-full overflow-hidden">
                      <img src={fallbackAfterUrl} alt={work.title} className="object-cover w-full h-full" />
                    </div>
                  )}

                  <div className="p-4 min-h-[100px] flex-1">
                    <p className="text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">{work.description}</p>
                    <p className="italic text-gray-500 dark:text-gray-400 mt-4 overflow-hidden text-ellipsis whitespace-nowrap">{work?.additional_description || ' '}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="text-center mt-12">
        <Link
          href="/works"
          className={buttonStyles({
            color: 'primary',
            variant: 'solid',
            radius: 'md',
            size: 'lg',
          })}>
          Смотреть все работы
        </Link>
      </div>
    </div>
  );
}
