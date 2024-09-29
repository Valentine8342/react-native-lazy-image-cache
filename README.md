# react-native-lazy-image-loader

Supercharge your React Native app's image loading with advanced caching, lazy loading, and prefetching capabilities.

## Features

- 🚀 Lazy loading for optimal performance
- 💾 Intelligent caching system
- 🔄 Prefetching for seamless user experience
- 🎨 Customizable placeholders and error images
- 📏 Automatic image resizing
- 🔧 Flexible cache management
- 👁️ Visibility culling for improved performance
- 🔍 Dynamic image quality adjustment
- 🌟 Smooth fade-in effect
- 🖼️ Blurred placeholder while loading

## Installation

Get started with a simple npm install:

```bash
npm install react-native-lazy-image-loader
```

## Quick Start

Here's a basic example to get you up and running:

```jsx
import React from 'react';
import { View } from 'react-native';
import { LazyImage } from 'react-native-lazy-image-loader';

const MyComponent = () => (
  <View>
    <LazyImage
      source={{ uri: 'https://example.com/image.jpg' }}
      style={{ width: 300, height: 200 }}
    />
  </View>
);

export default MyComponent;
```

## Advanced Usage

### Prefetching

Preload images for a buttery-smooth UX:

```jsx
import { prefetchImages } from 'react-native-lazy-image-loader';

const imageUrls = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
];

prefetchImages(imageUrls);
```

### Custom Placeholders

Add your own flair while images load:

```jsx
<LazyImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 300, height: 200 }}
  placeholderSource={require('./assets/placeholder.png')}
/>
```

### Cache Management

Take control of your app's image cache:

```jsx
import { clearCache, getCacheSize } from 'react-native-lazy-image-loader';

// Clear all cached images
clearCache();

// Get current cache size
const size = await getCacheSize();
console.log(`Current cache size: ${size} bytes`);
```

### Visibility Culling

Optimize performance by only loading visible images:

```jsx
<LazyImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 300, height: 200 }}
  cullingDistance={300}
  onVisibilityChange={(isVisible) => console.log('Image visibility:', isVisible)}
/>
```

### Fade Effect

Implement a smooth fade-in effect as images come into view:

```jsx
<LazyImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 300, height: 200 }}
  fade={true}
/>
```

Here's how the fade effect looks in action:

![Fade Effect Demo](https://github.com/Valentine8342/react-native-lazy-image-cache/blob/main/react-native-lazy-image-cache/src/assets/fade-effect-demo.gif?raw=true)

### Blur Effect

Add a blurred placeholder while the image is loading:

```jsx
<LazyImage
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 300, height: 200 }}
  blurRadius={5}
/>
```

Here's how the blur effect looks in action:

![Blur Effect Demo](https://github.com/Valentine8342/react-native-lazy-image-cache/blob/main/react-native-lazy-image-cache/src/assets/blur-effect-demo.gif?raw=true)

## API Reference

### LazyImage

| Prop | Type | Description |
|------|------|-------------|
| `source` | `ImageSourcePropType` | The source of the image |
| `style` | `ViewStyle` | Styles for the image container |
| `placeholderSource` | `ImageSourcePropType` | (Optional) Custom placeholder image |
| `fallbackSource` | `ImageSourcePropType` | (Optional) Fallback image to display on error |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'center'` | (Optional) Image resize mode |
| `cullingDistance` | `number` | (Optional) Distance in pixels to start loading the image |
| `onVisibilityChange` | `(isVisible: boolean) => void` | (Optional) Callback when image visibility changes |
| `fade` | `boolean` | (Optional) Enable fade-in effect as image becomes visible |
| `blurRadius` | `number` | (Optional) Blur radius for the placeholder image |
| `priority` | `'low' \| 'normal' \| 'high'` | (Optional) Download priority for the image |
| `onLoad` | `() => void` | (Optional) Callback when the image finishes loading |
| `onError` | `(error: NativeSyntheticEvent<ImageErrorEventData>) => void` | (Optional) Callback when an error occurs during loading |
| `onCustomError` | `(error: Error) => void` | (Optional) Callback for custom error handling |

### Utility Functions

- `prefetchImages(urls: string[]): Promise<void>`
- `clearCache(): Promise<void>`
- `getCacheSize(): Promise<number>`

## Performance Tips

- Use `cullingDistance` to fine-tune when images start loading based on your app's scroll behavior.
- Implement `onVisibilityChange` to pause/resume other operations based on image visibility.
- Prefetch critical images during app initialization for instant display.
- Utilize the `priority` prop to manage download order for important images.

## Contributing

To contribute, please visit the GitHub repository at https://github.com/Valentine8342/react-native-lazy-image-cache.

## License

This project is licensed under the MIT License - see the LICENSE file for details.