import React, { useState, useEffect } from 'react';
import { Image, ImageProps, ActivityIndicator, View } from 'react-native';
import { cacheImage, getCachedImage } from './imageCache';
import { downloadQueue } from './downloadQueue';

interface LazyImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string };
  placeholderColor?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ source, style, placeholderColor = '#ccc', ...props }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const cachedUri = await getCachedImage(source.uri);
        if (cachedUri) {
          if (isMounted) {
            setImageUri(cachedUri);
            setLoading(false);
          }
        } else {
          const downloadedUri = await downloadQueue.enqueue(source.uri);
          if (isMounted) {
            setImageUri(downloadedUri);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [source.uri]);

  if (loading) {
    return (
      <View style={[style, { backgroundColor: placeholderColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  return <Image source={{ uri: imageUri || source.uri }} style={style} {...props} />;
};

export const prefetchImages = async (urls: string[]): Promise<void> => {
  await Promise.all(urls.map(url => downloadQueue.enqueue(url)));
};

export default LazyImage;