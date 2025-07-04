'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface ImageFormat {
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

interface ImageData {
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

// Helper functions
function isVideoMedia(media: ImageData | undefined): boolean {
  if (!media) return false;
  return media.mime?.startsWith('video/');
}

function getImageUrl(imageData: ImageData | undefined, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
  if (!imageData) return null;

  // Try to get the requested format, fall back to original URL
  if (imageData.formats && imageData.formats[format]) {
    return `https://admin.spb-cosmetologist.ru${imageData.formats[format].url}`;
  }

  // Fall back to the original URL if the format doesn't exist
  return `https://admin.spb-cosmetologist.ru${imageData.url}`;
}

function getMediaUrl(media: ImageData | undefined): string | null {
  if (!media) return null;
  const url = media.url;
  if (!url) return null;
  return `https://admin.spb-cosmetologist.ru${url}`;
}

interface MediaSwiperProps {
  mediaItems: ImageData[];
  title?: string;
}

export default function MediaSwiper({ mediaItems, title }: MediaSwiperProps) {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (!domLoaded || mediaItems.length === 0) {
    return <div className="h-[400px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>;
  }

  return (
    <div className="h-[400px] w-full overflow-hidden">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={'fade'}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        modules={[Autoplay, EffectFade]}
        className="h-full w-full">
        {mediaItems.map((media, index) => {
          const isVideo = isVideoMedia(media);
          const mediaUrl = isVideo ? getMediaUrl(media) : getImageUrl(media, 'medium');
          const posterUrl = media?.formats?.thumbnail?.url ? `https://admin.spb-cosmetologist.ru${media.formats.thumbnail.url}` : undefined;

          return (
            <SwiperSlide key={index} className="h-full w-full">
              {isVideo ? (
                <video
                  src={mediaUrl || ''}
                  className="object-cover w-full h-full"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={posterUrl}>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={mediaUrl || ''} alt={media.alternativeText || title || `Slide ${index + 1}`} className="object-cover w-full h-full" />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
