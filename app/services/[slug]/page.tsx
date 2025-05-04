// app/services/[slug]/page.tsx

import Image from 'next/image'; // Используем Next.js Image для оптимизации
import { notFound } from 'next/navigation';

// Импорты типов

import { RichTextRenderer } from '@/components/rich-text-renderer';
import Link from 'next/link';

// --- Переменные окружения ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://startrixbot.ru';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// --- ISR Настройки ---
export const revalidate = 3600; // Ревалидация каждый час

// --- Функция для генерации статических путей (опционально, для ISR) ---
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
async function getServiceData(slug: string): Promise<DetailedService | null> {
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

    const response = await fetch(url, {
      headers: headers,
      next: { revalidate }, // Используем ревалидацию
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

// --- Компонент Страницы Услуги (Серверный) ---
interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  // Await the params object before destructuring
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const service = await getServiceData(slug);

  // Если услуга не найдена, показать страницу 404
  if (!service) {
    notFound();
  }

  // Функция для получения URL изображения (можно вынести в хелперы)
  function getImageUrl(imageData: DetailedService['image'], format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
    if (!imageData || imageData.length === 0) return null;
    const image = imageData[0];
    if (!image) return null;
    let urlPath = image.formats?.[format]?.url || image.url;
    if (!urlPath) return null;
    return urlPath.startsWith('http') ? urlPath : `${API_BASE_URL}${urlPath}`;
  }

  const mainImageUrl = getImageUrl(service.image, 'large');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Можно добавить общий Header/Navbar */}

      <article className="container mx-auto px-4 py-8 md:py-16">
        {/* Заголовок */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">{service.title}</h1>

        {/* Основное изображение */}
        {mainImageUrl && (
          <div className="mb-8 md:mb-12 relative w-full aspect-[16/9] max-h-[500px] overflow-hidden rounded-lg shadow-lg mx-auto">
            <Image
              src={mainImageUrl}
              alt={`Изображение для услуги ${service.title}`}
              fill // Заполняет контейнер
              style={{ objectFit: 'cover' }} // Масштабирует изображение
              priority // Загружать в первую очередь
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
            />
          </div>
        )}

        {/* Описание */}
        {service.description && (
          <section className="mb-8 md:mb-12 prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Описание процедуры</h2>
            <RichTextRenderer content={service.description} />
          </section>
        )}

        {/* Колонки для Показаний, Эффекта, Противопоказаний */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Показания */}
          {service.indications && service.indications.length > 0 && (
            <section className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg shadow border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">Показания</h3>
              <RichTextRenderer content={service.indications} className="text-sm text-gray-700 dark:text-gray-300 space-y-1" />
            </section>
          )}

          {/* Эффект */}
          {service.effect_description && service.effect_description.length > 0 && (
            <section className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg shadow border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300">Эффект</h3>
              <RichTextRenderer content={service.effect_description} className="text-sm text-gray-700 dark:text-gray-300 space-y-1" />
            </section>
          )}

          {/* Противопоказания */}
          {service.contraindications && service.contraindications.length > 0 && (
            <section className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg shadow border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-300">Противопоказания</h3>
              <RichTextRenderer content={service.contraindications} className="text-sm text-gray-700 dark:text-gray-300 space-y-1" />
            </section>
          )}
        </div>

        {/* Детали процедуры и Прайс-лист */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Детали процедуры */}
          {service.procedure_details && (
            <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Детали процедуры</h3>
              <dl className="space-y-2 text-sm">
                {service.procedure_details.duration_summary && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Длительность:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.duration_summary}</dd>
                  </div>
                )}
                {service.procedure_details.frequency && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Частота:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.frequency}</dd>
                  </div>
                )}
                {service.procedure_details.preparations_used && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Препараты:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.preparations_used}</dd>
                  </div>
                )}
                {service.procedure_details.anesthesia_info && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Анестезия:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.anesthesia_info}</dd>
                  </div>
                )}
                {service.procedure_details.course_recommendation && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Курс:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.course_recommendation}</dd>
                  </div>
                )}
                {service.procedure_details.effect_summary && (
                  <div>
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Стойкость эффекта:</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{service.procedure_details.effect_summary}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {/* Прайс-лист */}
          {service.price_list && service.price_list.length > 0 && (
            <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Стоимость</h3>
              {/* Здесь можно использовать таблицу или список */}
              <ul className="space-y-3 text-sm">
                {service.price_list.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 dark:border-gray-700">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name || 'Услуга'}</span>
                      {item.description && <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>}
                    </div>
                    <div className="text-right">
                      {/* Добавь цену, если она есть в API */}
                      {/* <span className="font-semibold text-primary-600 dark:text-primary-400">{item.price} ₽</span> */}
                      {item.unit && <span className="block text-xs text-gray-500 dark:text-gray-400">за {item.unit}</span>}
                      {item.duration && <span className="block text-xs text-gray-500 dark:text-gray-400">({item.duration})</span>}
                    </div>
                  </li>
                ))}
              </ul>
              {/* Можно добавить Клиентский компонент для интерактивного прайса */}
            </section>
          )}
        </div>

        {/* Примечание */}
        {service.primechanie && (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 rounded" role="alert">
            <p className="font-medium text-yellow-800 dark:text-yellow-300">Важно!</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-200">{service.primechanie}</p>
          </div>
        )}

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
  );
}
