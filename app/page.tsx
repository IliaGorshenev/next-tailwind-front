import { Link } from '@heroui/link'; // Keep Link if used for buttons/navigation
import { button as buttonStyles } from '@heroui/theme'; // Keep buttonStyles if used
import Image from 'next/image'; // Keep Next/Image for optimized images

import ContactForm from '@/components/feedback';
import { subtitle, title } from '@/components/primitives'; // Keep custom primitives if used in new/existing sections
import Works from '@/components/works';
import { Service } from './state/services';
import { ServicesInitializer } from './state/services-initializer';
import ServicesCarousel from '@/components/services-swiper';
import HeroSection from '@/components/hero-section';
import PhilosophySection from '@/components/philosophy-section';

// This function gets called at build time and also on revalidation (Copied from old code)
async function getFeaturedServices(): Promise<{
  services: Service[];
  error: string | null;
}> {
  // Use environment variable for API URL if possible
  const apiUrl = process.env.API_URL || 'https://admin.spb-cosmetologist.ru'; // Example: Use env var
  const endpoint = `${apiUrl}/api/uslugas?populate=*`;

  console.log(`Workspaceing services from: ${endpoint}`); // Add logging for debugging

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
      headers: {
        // Add Authorization header if your API requires it
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (!response.ok) {
      // Log detailed error info
      const errorBody = await response.text();

      console.error(`API Error Response (${response.status}): ${errorBody}`);

      return {
        services: [],
        error: `Не удалось загрузить услуги (Статус: ${response.status})`,
      };
    }

    const data: any = await response.json();
    if (!data || !Array.isArray(data.data)) {
      console.error('Invalid data structure received from API:', data);

      return { services: [], error: 'Некорректный формат ответа от API' };
    }

    // Transform the data to match our Service type
    const services = data.data.map(
      (
        // @ts-ignore
        item,
      ): any => {
        // Check if attributes exist, otherwise use item directly (adjust based on actual API response)
        const serviceData = item.attributes || item;

        // Handle potentially missing image data gracefully (Strapi v4 structure)
        const imageDataArray = item.image;
        let imageArray: any[] = [];

        if (Array.isArray(imageDataArray) && imageDataArray.length > 0) {
          imageArray = imageDataArray.map((img: any) => {
            // img - это объект изображения
            // Напрямую берем url и formats из объекта img
            return {
              url: img?.url || '', // Добавляем проверку на существование img.url
              formats: img?.formats || {}, // Добавляем проверку на существование img.formats
            };
          });
        }

        return {
          id: item.id,
          title: serviceData.title || 'Без названия',
          // Limit description length for display card
          description: (serviceData.description || '').substring(0, 100) + ((serviceData.description || '').length > 100 ? '...' : ''),
          slug: serviceData.slug || `service-${item.id}`,
          image: imageArray, // Use the processed image array
        };
      },
    );

    // Limit to 3 services for the featured section
    return { services: services, error: null };
  } catch (error) {
    console.error('Error fetching services:', error);
    // Provide more context on the type of error if possible
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

    return {
      services: [],
      error: `Произошла ошибка при загрузке услуг: ${errorMessage}`,
    };
  }
}

export default async function Home() {
  // Fetch services when the page component renders (or at build time/revalidation)
  const { services, error } = await getFeaturedServices();
  const API_BASE_URL = process.env.API_URL || 'https://admin.spb-cosmetologist.ru'; // Ensure consistency

  let allServices: Service[] = [];
  try {
    const apiUrl = process.env.API_URL || 'https://admin.spb-cosmetologist.ru';
    const response = await fetch(`${apiUrl}/api/uslugas?populate=*`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        allServices = data.data.map((item: any): Service => {
          const imageDataArray = item.image;
          let imageArray: any[] = [];

          if (Array.isArray(imageDataArray) && imageDataArray.length > 0) {
            imageArray = imageDataArray.map((img: any) => ({
              url: img?.url || '',
              formats: img?.formats || {},
            }));
          }

          return {
            id: item.id,
            title: item.title || 'Без названия',
            description: typeof item.description === 'string' ? item.description : 'Подробности смотрите на странице услуги.',
            slug: item.slug || `service-${item.id}`,
            image: imageArray,
          };
        });
      }
    }
  } catch (error) {
    console.error('Error fetching all services for search:', error);
  }

  return (
    <>
      {/* About Me Section */}
      <ServicesInitializer initialServices={allServices} />
      <HeroSection />
      {/* <section className="py-16 md:py-20 bg-gradient-to-r from-orange-50/80 to-white text-content1-foreground border-l border-r border-orange-100 dark:border-l-0 dark:border-r-0 dark:bg-gradient-to-r dark:from-gray-700/90 dark:to-gray-800 rounded-lg shadow-md"> */}

      {/* My Philosophy/Approach Section */}

      <PhilosophySection />
      {/* Featured Services Section (Kept from original) */}
      <section className="py-16 md:py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50 via-orange-50/70 to-white text-content1-foreground dark:border-none dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]  dark:from-gray-900 dark:via-gray-950 dark:to-gray-1000  rounded-lg">
      
        <div className="container mx-auto px-4">
          {error ? (
            <div className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 p-4 rounded-md max-w-md mx-auto">
              <p>Ошибка загрузки услуг: {error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Услуги не найдены.</p>
            </div>
          ) : (
            // Replace the grid with the ServicesCarousel component
            <ServicesCarousel services={services} apiBaseUrl={API_BASE_URL} />
          )}

          {/* Link to all services */}
          {!error && services.length > 0 && (
            <div className="text-center mt-12">
              <Link
                className={buttonStyles({
                  color: 'danger',
                  variant: 'ghost',
                  radius: 'full',
                  size: 'lg',
                })}
                href="/services">
                Смотреть все услуги
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="py-8 md:py-12  text-content1-foreground  dark:border-none dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 rounded-lg  ">
        <div className="container mx-auto px-4">
          <Works />
        </div>
      </section>
      <ContactForm />

      {/* You can add more sections here, e.g., Testimonials, Contact Form */}
    </>
  );
}
