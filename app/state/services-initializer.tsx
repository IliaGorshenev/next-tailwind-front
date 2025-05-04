'use client';

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { servicesAtom } from './services';


interface ServicesInitializerProps {
  initialServices: Service[];
}

export function ServicesInitializer({ initialServices }: ServicesInitializerProps) {
  const setServices = useSetAtom(servicesAtom);
  
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices, setServices]);
  
  return null; // This component doesn't render anything
}
