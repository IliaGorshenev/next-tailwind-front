'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { RichTextRenderer } from './rich-text-renderer';

interface AnimatedInfoCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
}

export const AnimatedInfoCard = ({
  title,
  content,
  icon,
  bgColor = "bg-orange-50 dark:bg-orange-900/30",
  borderColor = "border-orange-200 dark:border-orange-800",
  textColor = "text-orange-800 dark:text-orange-300",
  iconColor = "text-orange-600 dark:text-orange-400"
}: AnimatedInfoCardProps) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`${bgColor} p-8 rounded-xl shadow-md border ${borderColor} h-full`}
    >
      <motion.h3 
        className={`text-xl font-semibold mb-6 ${textColor} flex items-center`}
        initial={{ x: -20 }}
        whileInView={{ x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.div 
          className={`mr-3 ${iconColor}`}
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        {title}
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <RichTextRenderer content={content} className="text-base text-gray-700 dark:text-gray-300 space-y-2" />
      </motion.div>
    </motion.section>
  );
};
