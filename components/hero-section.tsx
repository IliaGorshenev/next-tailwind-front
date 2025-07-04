import Image from 'next/image';
import { Link } from '@heroui/link';
import { button as buttonStyles } from '@heroui/theme';
import { subtitle, title } from '@/components/primitives';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-50 via-orange-50/70 to-white text-content1-foreground dark:border-none dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-gray-900 dark:via-gray-950 dark:to-gray-1000 rounded-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left side content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
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
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8"
              style={{
                opacity: 0,
                animation: 'fadeInUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}>
              Я посвятила свою карьеру искусству и науке ухода за кожей. Моя миссия — помочь вам обрести здоровую, сияющую кожу и повысить вашу уверенность в себе с
              помощью персонализированных процедур и профессиональных советов.
            </p>
            <div
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
                href="/contact"
              >
                Записаться на консультацию
              </Link>
            </div>
          </div>
          
          {/* Right side hero image */}
          <div 
            className="w-full md:w-1/2 animate-fade-in-right"
            style={{
              opacity: 0,
              animation: 'fadeInRight 0.8s ease-out forwards',
              animationDelay: '0.4s',
            }}>
            <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/olga.jpg" 
                alt="Косметолог Ольга"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
