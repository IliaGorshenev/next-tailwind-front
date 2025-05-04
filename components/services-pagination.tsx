'use client';

import { Service } from '@/app/types/types';
import { Card, Pagination } from '@heroui/react';
import { useState } from 'react';

// Function to get image URL (same as in your main file)
function getImageUrl(imageData: any[] | undefined | null, format: string = 'medium'): string | null {
  // Implementation same as before
}

export default function ServicesPagination({ services }: { services: Service[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Все услуги</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedServices.map((service) => {
          const imageUrl = getImageUrl(service.image, 'medium');
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              {/* Card content same as before */}
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination total={totalPages} initialPage={1} page={currentPage} onChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
