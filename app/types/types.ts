// // Define types for the API response (Copied from old code)
// export type ImageFormat = {
//   url: string;
// };

// export type ImageData = {
//   formats: {
//     thumbnail?: ImageFormat;
//     small?: ImageFormat;
//     medium?: ImageFormat;
//     large?: ImageFormat;
//   };
//   url: string;
// };

// export type Service = {
//   id: number;
//   title: string;
//   description: string;
//   slug: string;
//   image: ImageData[]; // Assuming image is an array as per old code
// };

// export type ApiResponse = {
//   data: {
//     id: number;
//     attributes: Service; // Adjusted based on typical Strapi structure
//   }[];
// };




// Example type definitions (place in a types file)

interface ApiImageFormat {
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

interface ApiImageData {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: { // Note: formats is optional at the top level
      thumbnail?: ApiImageFormat;
      small?: ApiImageFormat;
      medium?: ApiImageFormat;
      large?: ApiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // Original URL
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  // If using Strapi v3 or different populate settings, the structure might differ
}

// Raw service object from the API
interface ApiService {
  id: number;
  title: string;
  description: any; // Can be string, complex object (Rich Text), or null
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  // Add other fields returned by your API (indications, etc.) if needed
  image?: ApiImageData[]; // Image is optional and an array
  // ... other populated fields
}

// The overall API response structure
interface ApiResponse {
  data: ApiService[];
  meta?: {
      pagination?: {
          page: number;
          pageSize: number;
          pageCount: number;
          total: number;
      };
  };
}

// Your internal representation (already defined previously)
interface ImageData {
url: string;
formats: {
  thumbnail?: { url: string };
  small?: { url: string };
  medium?: { url: string };
  large?: { url: string };
  [key: string]: { url: string } | undefined;
};
}

interface Service {
id: number;
title: string;
description: string;
slug: string;
image: ImageData[];
}


// types/types.ts (добавь или обнови)

// Формат Rich Text блока (упрощенный пример)
interface RichTextBlockChild {
  type: string;
  text: string;
  bold?: boolean;
  italic?: boolean;
  // другие свойства...
}

interface RichTextBlock {
  type: string; // 'paragraph', 'heading', 'list', etc.
  children: RichTextBlockChild[];
}

// Формат элемента прайс-листа
interface PriceListItem {
  id: number;
  name: string | null;
  description: string | null;
  unit: string | null;
  duration: string | null;
  // добавь price, если он есть в API
}

// Формат деталей процедуры
interface ProcedureDetails {
  id: number;
  duration_summary: string | null;
  frequency: string | null;
  preparations_used: string | null;
  anesthesia_info: string | null;
  course_recommendation: string | null;
  effect_summary: string | null;
}

// Формат данных изображения (уже должен быть определен)
interface ImageData {
  url: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    [key: string]: { url: string } | undefined;
  };
}

// Детальный тип услуги, полученный из API
interface DetailedService {
  id: number;
  title: string;
  description: string | RichTextBlock[]; // Может быть простой строкой или rich text
  slug: string;
  indications: RichTextBlock[] | null;
  effect_description: RichTextBlock[] | null;
  contraindications: RichTextBlock[] | null;
  primechanie: string | null;
  image: ImageData[] | null;
  price_list: PriceListItem[] | null;
  procedure_details: ProcedureDetails | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Тип ответа API для одной услуги (данные - массив с одним элементом)
interface SingleServiceApiResponse {
  data: DetailedService[];
  meta?: any;
}


// types/types.ts (добавь или обнови)

// Формат Rich Text блока (упрощенный пример)
interface RichTextBlockChild {
  type: string;
  text: string;
  bold?: boolean;
  italic?: boolean;
  // другие свойства...
}

interface RichTextBlock {
  type: string; // 'paragraph', 'heading', 'list', etc.
  children: RichTextBlockChild[];
}

// Формат элемента прайс-листа
interface PriceListItem {
  id: number;
  name: string | null;
  description: string | null;
  unit: string | null;
  duration: string | null;
  // добавь price, если он есть в API
}

// Формат деталей процедуры
interface ProcedureDetails {
  id: number;
  duration_summary: string | null;
  frequency: string | null;
  preparations_used: string | null;
  anesthesia_info: string | null;
  course_recommendation: string | null;
  effect_summary: string | null;
}

// Формат данных изображения (уже должен быть определен)
interface ImageData {
  url: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
    [key: string]: { url: string } | undefined;
  };
}

// Детальный тип услуги, полученный из API
interface DetailedService {
  id: number;
  title: string;
  description: string | RichTextBlock[]; // Может быть простой строкой или rich text
  slug: string;
  indications: RichTextBlock[] | null;
  effect_description: RichTextBlock[] | null;
  contraindications: RichTextBlock[] | null;
  primechanie: string | null;
  image: ImageData[] | null;
  price_list: PriceListItem[] | null;
  procedure_details: ProcedureDetails | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Тип ответа API для одной услуги (данные - массив с одним элементом)
interface SingleServiceApiResponse {
  data: DetailedService[];
  meta?: any;
}



export interface Work {
  id: number;
  documentId: string;
  title: string;
  before_after: boolean;
  description: string;
  additional_description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images?: {
    before: string;
    after: string;
  };
}

export interface WorksResponse {
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



// interface ImageFormat {
//   name: string;
//   hash: string;
//   ext: string;
//   mime: string;
//   path: string | null;
//   width: number;
//   height: number;
//   size: number;
//   sizeInBytes: number;
//   url: string;
// }

// interface ImageData {
//   id: number;
//   documentId: string;
//   name: string;
//   alternativeText: string | null;
//   caption: string | null;
//   width: number;
//   height: number;
//   formats: {
//     thumbnail?: ImageFormat;
//     small?: ImageFormat;
//     medium?: ImageFormat;
//     large?: ImageFormat;
//   };
//   hash: string;
//   ext: string;
//   mime: string;
//   size: number;
//   url: string;
//   previewUrl: string | null;
//   provider: string;
//   provider_metadata: any | null;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
// }

// interface Work {
//   id: number;
//   documentId: string;
//   title: string;
//   before_after: boolean;
//   description: string;
//   additional_description: string | null;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
//   photos: ImageData[];
// }

// interface WorksResponse {
//   data: Work[];
//   meta: {
//     pagination: {
//       page: number;
//       pageSize: number;
//       pageCount: number;
//       total: number;
//     };
//   };
// }

