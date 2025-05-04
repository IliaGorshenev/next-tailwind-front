'use client';

import { useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export default function AnimatedSection({ 
  children, 
  direction = 'right', 
  delay = 0,
  className = '' 
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const getAnimationStyle = () => {
    let initial = {};
    
    switch(direction) {
      case 'left':
        initial = { x: -50, opacity: 0 };
        break;
      case 'right':
        initial = { x: 50, opacity: 0 };
        break;
      case 'up':
        initial = { y: -30, opacity: 0 };
        break;
      case 'down':
        initial = { y: 30, opacity: 0 };
        break;
      default:
        initial = { opacity: 0 };
    }
    
    return {
      transform: isInView 
        ? 'translateX(0) translateY(0)' 
        // @ts-ignore
        : `translateX(${initial.x || 0}px) translateY(${initial.y || 0}px)`,
      opacity: isInView ? 1 : 0,
      transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
    };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={getAnimationStyle()}
    >
      {children}
    </div>
  );
}
