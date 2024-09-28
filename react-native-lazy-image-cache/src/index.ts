import { clearCache, getCacheSize, prefetchImage as prefetchSingleImage } from './imageCache';

export { default as LazyImage } from './LazyImage';
export { clearCache, getCacheSize };
export { downloadQueue } from './downloadQueue';

export const prefetchImage = prefetchSingleImage;

export const prefetchImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(prefetchSingleImage));
};