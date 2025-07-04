
// // Helper function to extract image URL from Strapi image data
// export function getImageUrl(imageData: ImageData | undefined, format: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string | null {
//   if (!imageData) return null;

//   // Try to get the requested format, fall back to original URL
//   if (imageData.formats && imageData.formats[format]) {
//     return `https://admin.spb-cosmetologist.ru${imageData.formats[format].url}`;
//   }

//   // Fall back to the original URL if the format doesn't exist
//   return `https://admin.spb-cosmetologist.ru${imageData.url}`;
// }

// // Helper function to check if media is a video
// export function isVideoMedia(media: ImageData | undefined): boolean {
//   if (!media) return false;

//   return media.mime?.startsWith('video/');
// }

// export function getMediaUrl(media: ImageData | undefined): string | null {
//   if (!media) return null;

//   const url = media.url;
//   if (!url) return null;

//   return `https://admin.spb-cosmetologist.ru${url}`;
// }
