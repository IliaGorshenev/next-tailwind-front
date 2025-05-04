'use client'; // <-- Mark as a Client Component

import { Service } from '@/app/state/services';
import { ChevronIcon } from '@heroui/shared-icons';
import Link from 'next/link';

// Helper function needed by this client component (or import it)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://startrixbot.ru';

// You might need to duplicate/import getImageUrl or pass the URL directly
function getImageUrl(imageData: Service['image'] | undefined | null, format: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'): string | null {
  if (!imageData || imageData.length === 0) return null;
  const image = imageData[0];
  if (!image) return null;
  let imageUrlPath: string | undefined | null = null;
  if (format !== 'original' && image.formats?.[format]?.url) {
    imageUrlPath = image.formats[format]?.url;
  } else {
    imageUrlPath = image.url;
  }
  if (!imageUrlPath) return null;
  if (imageUrlPath.startsWith('http://') || imageUrlPath.startsWith('https://')) {
    return imageUrlPath;
  }
  return `${API_BASE_URL}${imageUrlPath}`;
}

interface ServiceCatalogItemProps {
  service: Service;
}

export function ServiceCatalogItem({ service }: ServiceCatalogItemProps) {
  const thumbnailUrl = getImageUrl(service.image, 'thumbnail');

  return (
    <Link
      key={service.id}
      href={`/services/${service.slug}`}
      className="group flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out">
      <div className="flex-shrink-0 mr-4">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Миниатюра для ${service.title}`}
            className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            onError={(e) => (e.currentTarget.src = '/images/placeholder-thumbnail.png')}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center border border-primary-200 dark:border-primary-700">
            <span className="text-primary-600 dark:text-primary-300 font-semibold text-lg">
              {service.title && service.title !== 'Без названия' ? service.title.charAt(0).toUpperCase() : '#'}
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h4 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">{service.title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{service.description}</p>
      </div>
      <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </Link>
  );
}
