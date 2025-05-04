import BeforeAfterSlider from './work-divider';

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
export function getImageUrl(imageData: ImageData | undefined, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
  if (!imageData) return null;

  // Try to get the requested format, fall back to original URL
  if (imageData.formats && imageData.formats[format]) {
    return `https://startrixbot.ru${imageData.formats[format].url}`;
  }

  // Fall back to the original URL if the format doesn't exist
  return `https://startrixbot.ru${imageData.url}`;
}

async function getWorks() {
  try {
    const response = await fetch('https://startrixbot.ru/api/works?populate=*', {
      next: { revalidate: 3600 }, // Revalidate every hour
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

export default async function Works() {
  const { works, error } = await getWorks();

  if (error) {
    return (
      <div className="bg-red-100 dark-theme:bg-red-900/50 border border-red-400 dark-theme:border-red-700 text-red-700 dark-theme:text-red-300 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark-theme:text-gray-400">Работы не найдены</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Мои работы</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((work) => {
          // Get the first two photos for before/after if available
          const beforeImage = work.photos && work.photos.length > 0 ? work.photos[0] : undefined;
          const afterImage = work.photos && work.photos.length > 1 ? work.photos[1] : beforeImage;

          const beforeImageUrl = getImageUrl(beforeImage, 'medium');
          const afterImageUrl = getImageUrl(afterImage, 'medium');

          // Fallback to placeholder images if no photos are available
          const fallbackBeforeUrl = `/images/work-${work.id}-before.jpg`;
          const fallbackAfterUrl = `/images/work-${work.id}-after.jpg`;

          return (
            <div
              key={work.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent dark:border-gray-700/50 flex flex-col">
              {work.before_after && beforeImageUrl && afterImageUrl ? (
                <div className="w-full">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white p-4 text-left">{work.title}</h3>
                  <div className="h-84 w-full overflow-hidden">
                    <BeforeAfterSlider beforeImage={beforeImageUrl} afterImage={afterImageUrl} />
                  </div>
                </div>
              ) : beforeImageUrl ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white p-4 text-left">{work.title}</h3>
                  <div className="relative h-84 w-full overflow-hidden">
                    <img src={beforeImageUrl} alt={work.title} className="object-cover w-full h-full" />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 dark-theme:text-white p-4 text-left">{work.title}</h3>
                  <div className="relative h-84 w-full overflow-hidden">
                    <img src={fallbackAfterUrl} alt={work.title} className="object-cover w-full h-full" />
                  </div>
                </>
              )}

              <div className="p-4 flex-1">
                <p className="text-gray-600 dark:text-gray-300">{work.description}</p>
                {work.additional_description && <p className="italic text-gray-500 dark:text-gray-400 mt-4">{work.additional_description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
