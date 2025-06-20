import ContactForm from '@/components/feedback';
import { ServiceCard } from '@/components/service-card';
import { ServiceCatalogItem } from '@/components/service-catalog-item';

// --- Import your type definitions ---

// import { ServicesPagination } from '@/components/ServicesPagination'; // Keep if you have this client component

// --- Environment Variables ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.spb-cosmetologist.ru';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// --- ISR Revalidation ---

export const revalidate = 600; // Revalidate every 10 minutes

// --- Helper function to group services (can stay in Server Component) ---
function groupServicesByFirstLetter(services: any[]) {
  // ... (keep existing grouping logic) ...
  const grouped: { [key: string]: any[] } = {};
  services.forEach((service) => {
    let firstLetter = '#';
    if (service.title && service.title !== 'Без названия' && /^[a-zA-Zа-яА-Я]/.test(service.title)) {
      firstLetter = service.title.charAt(0).toUpperCase();
    }
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(service);
  });
  return Object.keys(grouped)
    .sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    })
    .map((letter) => ({ letter, services: grouped[letter] }));
}

// --- Async Server Component for the Services Page ---
export default async function ServicesPage() {
  let services: any[] = [];
  let error: string | null = null;

  // --- Data Fetching (Keep existing logic) ---
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    const response = await fetch(`${API_BASE_URL}/api/uslugas?populate=*`, {
      headers: headers,
      next: { revalidate: 600 },
    });
    if (!response.ok) throw new Error(`Не удалось загрузить услуги (Статус: ${response.status})`);
    const data: any = await response.json();
    if (!data || !Array.isArray(data.data)) throw new Error('Некорректный формат ответа от API');

    // --- Data Transformation (Keep existing logic) ---
    services = data.data.map((item: any): any => {
      let descriptionText = '';
      if (typeof item.description === 'string') descriptionText = item.description;
      else if (item.description) descriptionText = 'Подробности смотрите на странице услуги.';
      return {
        id: item.id,
        title: item.title || 'Без названия',
        description: descriptionText,
        slug: item.slug || `service-${item.id}`,
        image: Array.isArray(item.image)
          ? item.image.map(
              (
                // @ts-ignore
                img,
              ) => ({
                url: img.url || '',
                formats: {
                  thumbnail: img.formats?.thumbnail ? { url: img.formats.thumbnail.url } : undefined,
                  small: img.formats?.small ? { url: img.formats.small.url } : undefined,
                  medium: img.formats?.medium ? { url: img.formats.medium.url } : undefined,
                  large: img.formats?.large ? { url: img.formats.large.url } : undefined,
                },
              }),
            )
          : [],
      };
    });
  } catch (err: any) {
    console.error('Error fetching or processing services:', err);
    error = err.message || 'Произошла неизвестная ошибка при загрузке услуг.';
  }

  // --- Prepare Data for Rendering (Keep existing logic) ---
  const groupedServices = groupServicesByFirstLetter(services);
  const itemsPerPage = 9;
  const paginatedServices = services.slice(0, itemsPerPage);

  // --- Render JSX ---
  return (
    <div className="min-h-screen">
      {/* Header (Keep existing) */}
      {/* <header className="bg-orange-50 text-black dark:bg-gray-900 dark:text-white py-6 rounded-md mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Наши услуги</h1>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-12 md:py-16 bg-orange-50 text-black dark:bg-gray-900 dark:text-white py-6 rounded-md mb-16">
        {/* Error Display (Keep existing) */}
        {error && (
          <div
            className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
            role="alert">
            ...
          </div>
        )}
        {/* No Services Found (Keep existing) */}
        {!error && services.length === 0 && <div className="flex justify-center items-center min-h-[200px]">...</div>}

        {/* Content Display */}
        {!error && services.length > 0 && (
          <>
            {/* Card View Section - USE CLIENT COMPONENT */}

            <section className="mb-16">
              <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Все услуги</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedServices.map((service) => (
                  // Render the client component, passing data as props
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              {/* Pagination Component Placeholder (Keep existing) */}
              {/* <ServicesPagination services={services} itemsPerPage={itemsPerPage} /> */}
            </section>

            {/* Catalog View Section - USE CLIENT COMPONENT */}
            <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 md:p-8 shadow-sm bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 center dark:text-white">Каталог услуг</h2>
              <div className="space-y-8">
                {groupedServices.map((group) => (
                  <div key={group.letter}>
                    <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-primary-500 text-primary-700 dark:text-primary-400">{group.letter}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      {group.services.map((service) => (
                        // Render the client component, passing data as props
                        <ServiceCatalogItem key={service.id} service={service} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        <ContactForm />
      </main>

      {/* Footer (Keep existing) */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">...</footer>
    </div>
  );
}
