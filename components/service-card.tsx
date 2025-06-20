'use client'; // <-- Mark as a Client Component

import { Service } from '@/app/state/services';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import Link from 'next/link';

// Helper function needed by this client component (or import it)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.spb-cosmetologist.ru';

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

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const imageUrl = getImageUrl(service.image, 'medium');

  return (
    <Card
      key={service.id}
      className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col">
      {imageUrl ? (
        <CardHeader className="p-0 relative h-48">
          {/* Using standard img tag here for simplicity with onError, adapt if HeroUI Image handles it */}
          <img
            src={imageUrl}
            alt={`Изображение для ${service.title}`}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = '/images/placeholder-image.png')} // Basic fallback
          />
        </CardHeader>
      ) : (
        <CardHeader className="p-0 relative h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-sm">Нет изображения</span>
        </CardHeader>
      )}
      <CardBody className="flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{service.description}</p>
      </CardBody>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50">
        <Link
          href={`/services/${service.slug}`}
          className="group w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium text-gray-800 bg-[#FFCCC5] hover:bg-[#FFB8AE] rounded-md shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFCCC5] focus:ring-opacity-50 dark:text-gray-800">
          Подробнее <span className="ml-1 transform transition-transform duration-200 group-hover:scale-125">→</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
