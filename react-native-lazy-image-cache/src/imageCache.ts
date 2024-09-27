import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as CryptoJS from 'crypto-js';

const BASE_DIR = Platform.OS === 'ios' 
  ? `${RNFS.CachesDirectoryPath}/imageCache`
  : `${RNFS.ExternalCachesDirectoryPath}/imageCache`;

const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

export const getCacheKey = (uri: string): string => {
  return CryptoJS.SHA1(uri).toString();
};

const getFileExtension = (uri: string): string => {
  const match = uri.match(/\.(\w+)(\?.*)?$/);
  return match ? `.${match[1]}` : '.jpg';
};

export const getCachedImage = async (uri: string): Promise<string | null> => {
  const cacheKey = getCacheKey(uri);
  const fileExtension = getFileExtension(uri);
  const cachePath = `${BASE_DIR}/${cacheKey}${fileExtension}`;

  try {
    await RNFS.mkdir(BASE_DIR);
    const exists = await RNFS.exists(cachePath);


    if (exists) {
      const stats = await RNFS.stat(cachePath);
      const now = Date.now();
      if (now - stats.mtime > CACHE_EXPIRATION) {
        await RNFS.unlink(cachePath);
        return null;
      }
      return cachePath;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const cacheImage = async (uri: string): Promise<string> => {
  const cacheKey = getCacheKey(uri);
  const fileExtension = getFileExtension(uri);
  const cachePath = `${BASE_DIR}/${cacheKey}${fileExtension}`;

  try {
    await RNFS.mkdir(BASE_DIR);
    const result = await RNFS.downloadFile({
      fromUrl: uri,
      toFile: cachePath,
    }).promise;

    if (result.statusCode === 200) {
      return cachePath;
    } else {
      return uri;
    }
  } catch (error) {
    return uri;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await RNFS.unlink(BASE_DIR);
  } catch (error) {
  }
};

export const getCacheSize = async (): Promise<number> => {
  try {
    const stats = await RNFS.stat(BASE_DIR);
    return stats.size;
  } catch (error) {
    return 0;
  }
};