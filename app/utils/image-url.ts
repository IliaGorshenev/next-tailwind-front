
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://startrixbot.ru';
export function getImageUrl(imageData: any['image'], format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
    if (!imageData || imageData.length === 0) return null;
    const image = imageData[0];
    if (!image) return null;
    let urlPath = image.formats?.[format]?.url || image.url;
    if (!urlPath) return null;
    return urlPath.startsWith('http') ? urlPath : `${API_BASE_URL}${urlPath}`;
  }


