// components/RichTextRenderer.tsx

import React from 'react';

interface RichTextRendererProps {
  content: any[] | string | null | undefined;
  className?: string;
}

// Простой рендерер для Rich Text (можно расширить для поддержки списков, заголовков и т.д.)
export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) {
    return null;
  }

  // Если это простая строка (старый формат?)
  if (typeof content === 'string') {
    // Разделяем строку на параграфы по переводу строки и рендерим
    return (
      <div className={className}>
        {content.split('\n').map((paragraph, index) => (
          <p key={index} className={paragraph.trim() === '' ? 'h-4' : '' /* Добавляем пустой отступ для пустых строк */}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  // Если это массив блоков (Strapi Rich Text)
  if (!Array.isArray(content)) {
    console.warn('RichTextRenderer: Ожидался массив блоков, получен другой тип.', content);
    return (
      <div className={className}>
        <p>Некорректный формат контента.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            // Проверяем, содержит ли параграф только пустой текстовый узел
            const isEmptyParagraph = block.children.length === 1 && block.children[0].text.trim() === '';
            return (
              <p key={index} className={isEmptyParagraph ? 'h-4' : '' /* Добавляем пустой отступ */}>
                {block.children.map((
                   // @ts-ignore
                  child, childIndex) => (
                  <React.Fragment key={childIndex}>{child.bold ? <strong>{child.text}</strong> : child.text}</React.Fragment>
                ))}
              </p>
            );
          // Добавь обработку других типов блоков (heading, list, etc.) здесь по мере необходимости
          // case 'heading':
          //   const level = block.level || 1; // Уровень заголовка
          //   const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          //   return <Tag key={index}>{block.children.map(c => c.text).join('')}</Tag>;
          // case 'list':
          //   const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          //   return <ListTag key={index}>{block.children.map((item, itemIdx) => <li key={itemIdx}>{item.children.map(c => c.text).join('')}</li>)}</ListTag>;

          default:
            console.warn(`RichTextRenderer: Неизвестный тип блока "${block.type}"`);
            // Попытка отобразить текст по умолчанию
            return <p key={index}>{block.children.map((
               // @ts-ignore
              c) => c.text).join('')}</p>;
        }
      })}
    </div>
  );
}
