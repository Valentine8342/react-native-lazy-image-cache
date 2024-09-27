import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageProps, ActivityIndicator, View, ImageSourcePropType, NativeSyntheticEvent, ImageErrorEventData, Dimensions, InteractionManager } from 'react-native';
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
  onVisibilityChange?: (isVisible: boolean) => void;
  cullingDistance?: number;
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
  onVisibilityChange,
  cullingDistance = 1000,
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const imageRef = useRef<View>(null);
  const checkVisibilityIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    loadImage();
    startVisibilityCheck();

    return () => {
      if (checkVisibilityIntervalRef.current !== null) {
        clearInterval(checkVisibilityIntervalRef.current);
      }
    };
  }, [source.uri]);

  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible]);

  const loadImage = async () => {
    try {
      const cachedUri = await getCachedImage(source.uri);
      if (cachedUri) {
        const fileExists = await RNFS.exists(cachedUri);
        if (fileExists) {
          setImageUri(`file://${cachedUri}`);
          setLoading(false);
          onLoad?.();
        } else {
          throw new Error('Cached file does not exist');
        }
      } else {
        const downloadedUri = await downloadQueue.enqueue(source.uri, priority);
        setImageUri(`file://${downloadedUri}`);
        setLoading(false);
        onLoad?.();
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      onCustomError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  const checkVisibility = () => {
    if (imageRef.current) {
      imageRef.current.measure((x, y, width, height, pageX, pageY) => {
        const screenHeight = Dimensions.get('window').height;
        const isVisible = (pageY >= -cullingDistance && pageY < screenHeight + cullingDistance);
        setIsVisible(isVisible);
      });
    }
  };

  const startVisibilityCheck = () => {
    checkVisibilityIntervalRef.current = setInterval(() => {
      InteractionManager.runAfterInteractions(checkVisibility);
    }, 100) as unknown as number;
  };

  return (
    <View style={style} ref={imageRef}>
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
      ) : isVisible ? (
        <Image
          source={{ uri: imageUri || source.uri }}
          style={style}
          resizeMode={resizeMode}
          onError={(e) => {
            onError?.(e);
          }}
          {...props}
        />
      ) : null}
    </View>
  );
};

export default LazyImage;