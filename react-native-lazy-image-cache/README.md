# react-native-lazy-image-cache

Supercharge your React Native app's image loading with advanced caching, lazy loading, and prefetching capabilities.

## Features

- 🚀 Lazy loading for optimal performance
- 💾 Intelligent caching system
- 🔄 Prefetching for seamless user experience
- 🎨 Customizable placeholders and error images
- 📏 Automatic image resizing
- 🔧 Flexible cache management

## Installation

Get started with a simple npm install:

```bash
npm install react-native-lazy-image-cache
```

## Quick Start

Here's a basic example to get you up and running:

```jsx
import React from 'react';
import { View } from 'react-native';
import { LazyImage } from 'react-native-lazy-image-cache';

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
import { prefetchImages } from 'react-native-lazy-image-cache';

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
import { clearCache } from 'react-native-lazy-image-cache';

// Clear all cached images
clearCache();
```

## API Reference

### LazyImage

| Prop | Type | Description |
|------|------|-------------|
| `source` | `ImageSourcePropType` | The source of the image |
| `style` | `ViewStyle` | Styles for the image container |
| `placeholderSource` | `ImageSourcePropType` | (Optional) Custom placeholder image |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'center'` | (Optional) Image resize mode |

### Utility Functions

- `prefetchImages(urls: string[]): Promise<void>`
- `clearCache(): Promise<void>`
- `getCacheSize(): Promise<number>`

## Contributing

We welcome contributions! Please check out our Contributing Guide for guidelines on how to proceed.

## License

This project is licensed under the MIT License - see the LICENSE file for details.