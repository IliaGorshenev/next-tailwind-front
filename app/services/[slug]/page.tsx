import { RichTextRenderer } from '@/components/rich-text-renderer';
import Image from 'next/image'; // Используем Next.js Image для оптимизации
import Link from 'next/link';
import { notFound } from 'next/navigation';
// Import icons
import ContactForm from '@/components/feedback';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, InformationCircleIcon, SparklesIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.spb-cosmetologist.ru';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    // Запрашиваем только slug для всех услуг
    const res = await fetch(`${API_BASE_URL}/api/uslugas?fields[0]=slug`, { headers });

    if (!res.ok) {
      console.error('Failed to fetch slugs for generateStaticParams:', res.status, res.statusText);
      return [];
    }

    const result: { data: { slug: string }[] } = await res.json();

    if (!result || !Array.isArray(result.data)) {
      console.error('Invalid data structure for slugs:', result);
      return [];
    }

    return result.data.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// --- Функция для загрузки данных одной услуги ---
async function getServiceData(slug: string): Promise<any | null> {
  const queryParams = new URLSearchParams({
    // Здесь используется переменная slug, а не жестко заданное значение
    'filters[slug][$eq]': slug,
    populate: '*', // Загружаем все связанные данные
  }).toString();

  // Собираем полный URL
  const url = `${API_BASE_URL}/api/uslugas?${queryParams}`;
  console.log(`Workspaceing service data from: ${url}`); // Логирование URL

  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

    // In your getServiceData function, update the fetch options:
    const response = await fetch(url, {
      headers: headers,
      next: { revalidate: 600 }, // Use 600 seconds (10 minutes) instead of the variable
    });

    if (!response.ok) {
      // Если услуга не найдена (404), API может вернуть пустой массив data
      if (response.status === 404) {
        return null; // Сигнализируем, что услуга не найдена
      }
      // Другие ошибки сервера
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`Не удалось загрузить данные услуги (Статус: ${response.status})`);
    }
    // @ts-ignore

    const data: SingleServiceApiResponse = await response.json();

    // Проверяем, есть ли данные и содержит ли массив хотя бы один элемент
    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      console.log(`Service with slug "${slug}" not found in API response.`);
      return null; // Услуга не найдена
    }

    // Возвращаем первый (и единственный) объект услуги
    return data.data[0];
  } catch (error) {
    console.error(`Error fetching service data for slug "${slug}":`, error);
    // Можно выбросить ошибку или вернуть null для отображения страницы ошибки
    throw new Error(`Ошибка при загрузке услуги: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    // return null;
  }
}

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function Page({ params }: { params: any }) {
  console.log('Page params:', params); // Debug log
  const { slug } = params;
  console.log('Extracted slug:', slug); // Debug log

  const service = await getServiceData(slug);
  console.log('Service data fetched:', !!service); // Debug log

  // Если услуга не найдена, показать страницу 404
  if (!service || service === null) {
    notFound();
  }

  // Функция для получения URL изображения (можно вынести в хелперы)
  function getImageUrl(imageData: any['image'], format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
    if (!imageData || imageData.length === 0) return null;
    const image = imageData[0];
    if (!image) return null;
    let urlPath = image.formats?.[format]?.url || image.url;
    if (!urlPath) return null;
    return urlPath.startsWith('http') ? urlPath : `${API_BASE_URL}${urlPath}`;
  }

  const mainImageUrl = getImageUrl(service.image, 'large');

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col gap-8 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Можно добавить общий Header/Navbar */}

        <article className="container mx-auto px-4 py-8 md:py-16">
          {/* Заголовок */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">{service.title}</h1>
          {/* Основное изображение */}
          {/* Основное изображение */}
          {/* Основное изображение и описание в двухколоночном макете */}
          <div className="flex flex-col md:flex-row gap-8 mb-10 md:mb-14">
            {/* Основное изображение (левая колонка) */}
            {mainImageUrl && (
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={mainImageUrl}
                    alt={`Изображение для услуги ${service.title}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}

            {/* Описание (правая колонка) */}
            {service.description && (
              <div className="md:w-2/3">
                <section className="h-full prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-3 text-primary-700 dark:text-primary-300">Описание процедуры</h2>
                  <RichTextRenderer content={service.description} />
                </section>
              </div>
            )}
          </div>

          {/* Колонки для Показаний, Эффекта, Противопоказаний */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-10 md:mb-14">
            {/* Показания */}
            {service.indications && service.indications.length > 0 && (
              <section className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 h-full">
                <h3 className="text-xl font-semibold mb-6 text-orange-800 dark:text-orange-300 flex items-center">
                  <CheckCircleIcon className="w-7 h-7 mr-3 text-orange-600 dark:text-orange-400" />
                  Показания
                </h3>
                <RichTextRenderer content={service.indications} className="text-base text-gray-700 dark:text-gray-300 space-y-2" />
              </section>
            )}

            {/* Эффект */}
            {service.effect_description && service.effect_description.length > 0 && (
              <section className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 h-full">
                <h3 className="text-xl font-semibold mb-6 text-orange-800 dark:text-orange-300 flex items-center">
                  <SparklesIcon className="w-7 h-7 mr-3 text-orange-600 dark:text-orange-400" />
                  Эффект
                </h3>
                <RichTextRenderer content={service.effect_description} className="text-base text-gray-700 dark:text-gray-300 space-y-2" />
              </section>
            )}

            {/* Противопоказания */}
            {service.contraindications && service.contraindications.length > 0 && (
              <section className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 h-full">
                <h3 className="text-xl font-semibold mb-6 text-orange-800 dark:text-orange-300 flex items-center">
                  <XCircleIcon className="w-7 h-7 mr-3 text-orange-600 dark:text-orange-400" />
                  Противопоказания
                </h3>
                <RichTextRenderer content={service.contraindications} className="text-base text-gray-700 dark:text-gray-300 space-y-2" />
              </section>
            )}
          </div>

          {/* Детали процедуры и Прайс-лист */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-10 md:mb-14">
            {/* Детали процедуры */}
            {service.procedure_details && (
              <section className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 h-full">
                <h3 className="text-xl font-semibold mb-6 text-orange-800 dark:text-orange-300 flex items-center">
                  <InformationCircleIcon className="w-7 h-7 mr-3 text-orange-600 dark:text-orange-400" />
                  Детали процедуры
                </h3>
                <dl className="space-y-5 text-base">
                  {service.procedure_details.duration_summary && (
                    <div className="flex items-start">
                      <ClockIcon className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <dt className="font-medium text-gray-700 dark:text-gray-300">Длительность:</dt>
                        <dd className="text-gray-600 dark:text-gray-400">{service.procedure_details.duration_summary}</dd>
                      </div>
                    </div>
                  )}
                  {/* Other procedure details remain the same but with increased spacing */}
                  {/* ... */}
                </dl>
              </section>
            )}

            {/* Прайс-лист */}
            {service.price_list && service.price_list.length > 0 && (
              <section className="bg-orange-50 dark:bg-orange-900/30 p-8 rounded-xl shadow-md border border-orange-200 dark:border-orange-800 h-full">
                <h3 className="text-xl font-semibold mb-6 text-orange-800 dark:text-orange-300 flex items-center">
                  {/* <CurrencyRubleIcon className="w-7 h-7 mr-3 text-orange-600 dark:text-orange-400" /> */}
                  Стоимость
                </h3>
                <div className="overflow-hidden rounded-lg border border-orange-200 dark:border-orange-700">
                  <table className="min-w-full divide-y divide-orange-200 dark:divide-orange-700">
                    <thead className="bg-orange-100 dark:bg-orange-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">
                          Услуга
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-orange-800 dark:text-orange-300 uppercase tracking-wider">
                          Детали
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-orange-200 dark:divide-orange-700">
                      {service.price_list.map(
                        (
                          // @ts-ignore
                          item,
                            // @ts-ignore
                          index,
                        ) => (
                          <tr key={item.id || index} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-gray-800'}>
                            <td className="px-6 py-4 whitespace-normal">
                              <div className="text-base font-medium text-gray-900 dark:text-white">{item.name || 'Услуга'}</div>
                              {item.description && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</div>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {item.unit && <div className="text-sm text-gray-500 dark:text-gray-400">{item.unit}</div>}
                              {item.duration && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-end mt-1">
                                  <ClockIcon className="w-5 h-5 mr-1" />
                                  {item.duration}
                                </div>
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Примечание */}
          {service.primechanie && (
            <div className="mt-10 p-6 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-400 dark:border-orange-600 rounded-lg shadow-md" role="alert">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 mr-3 text-orange-600 dark:text-orange-400" />
                <p className="font-medium text-lg text-orange-800 dark:text-orange-300">Важно!</p>
              </div>
              <p className="text-base text-orange-700 dark:text-orange-200 mt-3">{service.primechanie}</p>
            </div>
          )}

          {/* Кнопка возврата или записи */}
          <div className="mt-16 flex justify-center space-x-6">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 border border-primary-300 dark:border-primary-700 text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition duration-150 ease-in-out">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Вернуться ко всем услугам
            </Link>
            {/* Appointment button would go here */}
          </div>

          {/* Кнопка возврата или записи */}
          <div className="mt-12 text-center">
            <Link href="/services" className="text-primary-600 dark:text-primary-400 hover:underline">
              &larr; Вернуться ко всем услугам
            </Link>
            {/* Можно добавить кнопку записи, возможно, как Клиентский компонент */}
            {/* <AppointmentButton serviceId={service.id} serviceTitle={service.title} /> */}
          </div>
        </article>

        {/* Можно добавить общий Footer */}
      </div>
      <ContactForm />
    </>
  );
}
