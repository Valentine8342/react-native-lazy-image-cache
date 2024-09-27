import React, { useState, useEffect } from 'react';
import { Image, ImageProps, ActivityIndicator, View, ImageSourcePropType, NativeSyntheticEvent, ImageErrorEventData } from 'react-native';
import { cacheImage, getCachedImage } from './imageCache';
import { downloadQueue } from './downloadQueue';

interface LazyImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string };
  placeholderColor?: string;
  placeholderSource?: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  loadingComponent?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: NativeSyntheticEvent<ImageErrorEventData>) => void;
  onCustomError?: (error: Error) => void;
  priority?: 'low' | 'normal' | 'high';
}

const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  placeholderColor = '#ccc',
  placeholderSource,
  fallbackSource,
  resizeMode = 'cover',
  loadingComponent,
  onLoad,
  onError,
  onCustomError,
  priority = 'normal',
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const cachedUri = await getCachedImage(source.uri);
        if (cachedUri) {
          if (isMounted) {
            setImageUri(cachedUri);
            setLoading(false);
            onLoad?.();
          }
        } else {
          const downloadedUri = await downloadQueue.enqueue(source.uri, priority);
          if (isMounted) {
            setImageUri(downloadedUri);
            setLoading(false);
            onLoad?.();
          }
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setLoading(false);
          setError(error instanceof Error ? error : new Error('Unknown error'));
          onCustomError?.(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [source.uri, priority, onLoad, onCustomError]);

  if (loading) {
    return (
      <View style={[style, { backgroundColor: placeholderColor, justifyContent: 'center', alignItems: 'center' }]}>
        {loadingComponent || (
          placeholderSource ? (
            <Image source={placeholderSource} style={style} resizeMode={resizeMode} />
          ) : (
            <ActivityIndicator size="small" color="#999" />
          )
        )}
      </View>
    );
  }

  if (error && fallbackSource) {
    return <Image source={fallbackSource} style={style} resizeMode={resizeMode} {...props} />;
  }

  return <Image source={{ uri: imageUri || source.uri }} style={style} resizeMode={resizeMode} onError={onError} {...props} />;
};

export default LazyImage;

export const prefetchImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => downloadQueue.enqueue(url)));
};