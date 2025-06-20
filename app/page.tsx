import { Link } from '@heroui/link'; // Keep Link if used for buttons/navigation
import { button as buttonStyles } from '@heroui/theme'; // Keep buttonStyles if used
import Image from 'next/image'; // Keep Next/Image for optimized images

import ContactForm from '@/components/feedback';
import { subtitle, title } from '@/components/primitives'; // Keep custom primitives if used in new/existing sections
import Works from '@/components/works';
import { Service } from './state/services';
import { ServicesInitializer } from './state/services-initializer';

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
    return { services: services.slice(0, 3), error: null };
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
      {/* <section className="py-16 md:py-20 bg-gradient-to-r from-orange-50/80 to-white text-content1-foreground border-l border-r border-orange-100 dark:border-l-0 dark:border-r-0 dark:bg-gradient-to-r dark:from-gray-700/90 dark:to-gray-800 rounded-lg shadow-md"> */}
      <section className="py-16 md:py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50 via-orange-50/70 to-white text-content1-foreground dark:border-none dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-gray-950 dark:to-gray-1000 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1
            className={title({
              size: 'lg',
              class: 'mb-4 text-gray-900 dark:text-white animate-fade-in',
            })}
            style={{
              opacity: 0,
              animation: 'fadeIn 0.8s ease-out forwards',
            }}>
            Добро пожаловать!
          </h1>
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            {/* Profile Picture with animation */}
            <div
              className="mb-6 animate-fade-in-up"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.2s',
              }}>
              <Image
                priority // Load profile picture early
                alt="Фото косметолога Ольга" // *** REPLACE with your name ***
                className="rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700 hover:scale-105 transition-transform duration-300"
                height={180}
                src="/olga.jpg" // *** REPLACE with your actual profile picture path ***
                width={180}
              />
            </div>

            <h2
              className={subtitle({
                class: 'text-xl md:text-2xl mb-6 text-gray-700 dark:text-gray-300',
              })}
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.4s',
              }}>
              Меня зовут <span className="font-semibold text-primary">Ольга</span>, ваш эксперт-косметолог
            </h2>
            <p
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}>
              Я посвятила свою карьеру искусству и науке ухода за кожей. Моя миссия — помочь вам обрести здоровую, сияющую кожу и повысить вашу уверенность в себе с
              помощью персонализированных процедур и профессиональных советов. Имея <span className="font-medium">5</span> лет опыта {/* *** REPLACE [X] *** */} и страсть
              к постоянному обучению, я предлагаю самые современные и эффективные решения для ваших нужд.
            </p>
            {/* Optional: Call to action button with animation */}
            <div
              className="mt-8"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.8s',
              }}>
              <Link
                className={buttonStyles({
                  color: 'primary',
                  radius: 'full',
                  variant: 'shadow',
                  size: 'lg',
                })}
                href="/contact" // *** Link to your contact page ***
              >
                Записаться на консультацию
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* My Philosophy/Approach Section */}

      <section className="py-16 md:py-20 text-content1-foreground dark:border-none dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Мой подход к красоте</h2>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left side video instead of image */}
            <div
              className="w-full md:w-1/2 relative animate-fade-in-left"
              style={{
                opacity: 0,
                animation: 'fadeInLeft 0.8s ease-out forwards',
                animationDelay: '0.2s',
              }}>
              <div className="relative h-80 md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
                <video
                  src="/olga_action.mp4"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '50% 20%' }}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>

            {/* Right side text content */}
            <div
              className="w-full md:w-1/2 animate-fade-in-right"
              style={{
                opacity: 0,
                animation: 'fadeInRight 0.8s ease-out forwards',
                animationDelay: '0.4s',
              }}>
              <div className="text-left">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Индивидуальный подход к каждому клиенту</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Я верю, что истинная красота идет изнутри и отражается в здоровье вашей кожи. Моя философия основана на целостном подходе, сочетании передовых
                  технологий с проверенными методиками и качественными продуктами.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Каждая процедура подбирается индивидуально, учитывая ваши уникальные особенности и цели. Я стремлюсь не только решить текущие проблемы, но и
                  предотвратить появление новых.
                </p>

                {/* Key principles with icons */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="flex items-start space-x-3 animate-fade-up"
                    style={{
                      opacity: 0,
                      animation: 'fadeUp 0.6s ease-out forwards',
                      animationDelay: '0.6s',
                    }}>
                    <div className="text-primary dark:text-primary-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Безопасность</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Использую только проверенные методики и сертифицированные продукты</p>
                    </div>
                  </div>

                  <div
                    className="flex items-start space-x-3 animate-fade-up"
                    style={{
                      opacity: 0,
                      animation: 'fadeUp 0.6s ease-out forwards',
                      animationDelay: '0.8s',
                    }}>
                    <div className="text-primary dark:text-primary-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Эффективность</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Гарантирую видимый результат после каждой процедуры</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section (Kept from original) */}
      <section className="py-16 md:py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50 via-orange-50/70 to-white text-content1-foreground dark:border-none dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]  dark:from-gray-900 dark:via-gray-950 dark:to-gray-1000  rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Популярные услуги</h2>
          {error ? (
            <div className="text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 p-4 rounded-md max-w-md mx-auto">
              <p>Ошибка загрузки услуг: {error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">Услуги не найдены.</p>
            </div>
          ) : (
            // Grid for services
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const imageUrl = service.image?.[0]?.formats?.medium?.url || service.image?.[0]?.url;
                const fullImageUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`) : '/images/placeholder-service.png'; // Fallback service image

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent dark:border-gray-700/50 flex flex-col">
                    {imageUrl ? (
                      <div className="relative h-48 w-full">
                        <Image
                          fill
                          alt={service.title || 'Изображение услуги'}
                          className="object-cover"
                          priority={index < 3} // Prioritize loading images for the first few cards
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          src={fullImageUrl}
                        />
                      </div>
                    ) : (
                      // Optional: Placeholder if no image URL at all
                      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Нет изображения</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      {' '}
                      {/* Use flex-grow to push button down */}
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm flex-grow">
                        {' '}
                        {/* Use flex-grow here too */}
                        {service.description}
                      </p>
                      <div className="mt-auto">
                        {' '}
                        {/* Pushes button to the bottom */}
                        <Link
                          className={buttonStyles({
                            color: 'primary',
                            variant: 'solid',
                            size: 'sm',
                            radius: 'md',
                          })}
                          href={`/services/${service.slug}`} // Make sure this route exists
                        >
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
                href="/services" // Make sure this route exists
              >
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
