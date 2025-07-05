'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import BeforeAfterSlider from '@/components/work-divider';
import VideoToggler from '@/components/video-toggler';
import MediaSwiper from '@/components/media-swiper';

// Import the same interfaces and helper functions from works component
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

interface Work {
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

interface WorksResponse {
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
function getImageUrl(imageData: ImageData | undefined, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
  if (!imageData) return null;

  // Try to get the requested format, fall back to original URL
  if (imageData.formats && imageData.formats[format]) {
    return `https://admin.spb-cosmetologist.ru${imageData.formats[format].url}`;
  }

  // Fall back to the original URL if the format doesn't exist
  return `https://admin.spb-cosmetologist.ru${imageData.url}`;
}

// Helper function to check if media is a video
function isVideoMedia(media: ImageData | undefined): boolean {
  if (!media) return false;

  return media.mime?.startsWith('video/');
}

function getMediaUrl(media: ImageData | undefined): string | null {
  if (!media) return null;

  const url = media.url;
  if (!url) return null;

  return `https://admin.spb-cosmetologist.ru${url}`;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const response = await fetch('https://admin.spb-cosmetologist.ru/api/works?populate=*');

        if (!response.ok) {
          throw new Error('Failed to fetch works');
        }

        const data: WorksResponse = await response.json();
        setWorks(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching works:', err);
        setError('Произошла ошибка при загрузке работ');
        setLoading(false);
      }
    }

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Мои работы" />
        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Мои работы" />
        <main className="container mx-auto px-4 py-12">
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header title="Мои работы" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div
                key={work.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent dark:border-gray-700/50 flex flex-col h-full">
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

                <div className="p-4 flex-1">
                  <p className="text-gray-600 dark:text-gray-300">{work.description}</p>
                  {work.additional_description && <p className="italic text-gray-500 dark:text-gray-400 mt-4">{work.additional_description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
