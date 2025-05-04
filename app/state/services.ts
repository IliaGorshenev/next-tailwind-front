import { atom } from 'jotai';

// Define the service type based on your API response
export interface Service {
  id: number | string;
  title: string;
  description: string;
  slug: string;
  image?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
}

// Create atoms for services state
export const servicesAtom = atom<Service[]>([]);
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<Service[]>(get => {
  const services = get(servicesAtom);
  const query = get(searchQueryAtom).toLowerCase().trim();
  
  if (!query) return [];
  
  return services.filter(service => 
    service.title.toLowerCase().includes(query) || 
    service.description.toLowerCase().includes(query)
  );
});
