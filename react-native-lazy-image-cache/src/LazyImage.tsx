import React, { useState, useEffect } from 'react';
import { Image, ImageProps, ActivityIndicator, View, ImageSourcePropType, NativeSyntheticEvent, ImageErrorEventData } from 'react-native';
import { getCachedImage } from './imageCache';
import { downloadQueue } from './downloadQueue';
import RNFS from 'react-native-fs';

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
  placeholderColor = '#f0f0f0',
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadImage();
  }, [source.uri]);

  const loadImage = async () => {
    try {
      const cachedUri = await getCachedImage(source.uri);
      if (cachedUri) {
        const fileExists = await RNFS.exists(cachedUri);
        if (fileExists) {
          const imageUri = `file://${cachedUri}`;
          setImageUri(imageUri);
          setLoading(false);
          onLoad?.();
        } else {
          throw new Error('Cached file does not exist');
        }
      } else {
        const downloadedUri = await downloadQueue.enqueue(source.uri, priority);
        const imageUri = `file://${downloadedUri}`;
        setImageUri(imageUri);
        setLoading(false);
        onLoad?.();
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      onCustomError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  return (
    <View style={style}>
      {loading ? (
        <View
          style={[
            style,
            {
              backgroundColor: placeholderColor,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {loadingComponent || <ActivityIndicator size="small" color="#999" />}
        </View>
      ) : error ? (
        fallbackSource ? (
          <Image source={fallbackSource} style={style} resizeMode={resizeMode} {...props} />
        ) : (
          <View
            style={[
              style,
              { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' },
            ]}
          />
        )
      ) : (
        <Image
          source={{ uri: imageUri || source.uri }}
          style={style}
          resizeMode={resizeMode}
          onError={(e) => {
            onError?.(e);
          }}
          {...props}
        />
      )}
    </View>
  );
};

export default LazyImage;