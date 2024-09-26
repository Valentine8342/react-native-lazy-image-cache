import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as CryptoJS from 'crypto-js';

const BASE_DIR = Platform.OS === 'ios' 
  ? RNFS.CachesDirectoryPath 
  : RNFS.ExternalCachesDirectoryPath;

const CACHE_DIR = `${BASE_DIR}/imageCache`;
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const getCacheKey = (uri: string): string => {
  return CryptoJS.SHA1(uri).toString();
};

export const getCachedImage = async (uri: string): Promise<string | null> => {
  const cacheKey = getCacheKey(uri);
  const cachePath = `${CACHE_DIR}/${cacheKey}`;

  try {
    const exists = await RNFS.exists(cachePath);
    if (exists) {
      const stats = await RNFS.stat(cachePath);
      const now = new Date().getTime();
      if (now - stats.mtime > CACHE_EXPIRATION) {
        await RNFS.unlink(cachePath);
        return null;
      }
      return `file://${cachePath}`;
    }
    return null;
  } catch (error) {
    console.error('Error checking cached image:', error);
    return null;
  }
};

export const cacheImage = async (uri: string): Promise<string> => {
  const cacheKey = getCacheKey(uri);
  const cachePath = `${CACHE_DIR}/${cacheKey}`;

  try {
    await RNFS.mkdir(CACHE_DIR);
    await RNFS.downloadFile({
      fromUrl: uri,
      toFile: cachePath,
    }).promise;

    return `file://${cachePath}`;
  } catch (error) {
    console.error('Error caching image:', error);
    return uri;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const exists = await RNFS.exists(CACHE_DIR);
    if (exists) {
      await RNFS.unlink(CACHE_DIR);
    }
    await RNFS.mkdir(CACHE_DIR);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const getCacheSize = async (): Promise<number> => {
  try {
    const exists = await RNFS.exists(CACHE_DIR);
    if (!exists) {
      await RNFS.mkdir(CACHE_DIR);
      return 0;
    }
    const result = await RNFS.readDir(CACHE_DIR);
    return result.reduce((total, file) => total + file.size, 0);
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
};