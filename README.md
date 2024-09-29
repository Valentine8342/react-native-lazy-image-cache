# react-native-lazy-image-loader

Supercharge your React Native app's image loading with advanced caching, lazy loading, and prefetching capabilities.

[<span style="color: red;">Lazy Loading Made Easy</span>](https://medium.com/@valentineminer27/lazy-loading-images-with-react-native-da614f652667)

![npm downloads](https://img.shields.io/npm/dt/react-native-lazy-image-loader.svg)
![npm version](https://img.shields.io/npm/v/react-native-lazy-image-loader.svg)
![license](https://img.shields.io/npm/l/react-native-lazy-image-loader.svg)

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

<table width="100%">
  <thead>
    <tr>
      <th width="20%">Prop</th>
      <th width="30%">Type</th>
      <th width="50%">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>source</code></td>
      <td><code>ImageSourcePropType</code></td>
      <td>The source of the image</td>
    </tr>
    <tr>
      <td><code>style</code></td>
      <td><code>ViewStyle</code></td>
      <td>Styles for the image container</td>
    </tr>
    <tr>
      <td><code>placeholderSource</code></td>
      <td><code>ImageSourcePropType</code></td>
      <td>(Optional) Custom placeholder image</td>
    </tr>
    <tr>
      <td><code>fallbackSource</code></td>
      <td><code>ImageSourcePropType</code></td>
      <td>(Optional) Fallback image to display on error</td>
    </tr>
    <tr>
      <td><code>resizeMode</code></td>
      <td><code>'cover' | 'contain' | 'stretch' | 'center'</code></td>
      <td>(Optional) Image resize mode</td>
    </tr>
    <tr>
      <td><code>cullingDistance</code></td>
      <td><code>number</code></td>
      <td>(Optional) Distance in pixels to start loading the image</td>
    </tr>
    <tr>
      <td><code>onVisibilityChange</code></td>
      <td><code>(isVisible: boolean) => void</code></td>
      <td>(Optional) Callback when image visibility changes</td>
    </tr>
    <tr>
      <td><code>fade</code></td>
      <td><code>boolean</code></td>
      <td>(Optional) Enable fade-in effect as image becomes visible</td>
    </tr>
    <tr>
      <td><code>blurRadius</code></td>
      <td><code>number</code></td>
      <td>(Optional) Blur radius for the placeholder image</td>
    </tr>
    <tr>
      <td><code>priority</code></td>
      <td><code>'low' | 'normal' | 'high'</code></td>
      <td>(Optional) Download priority for the image</td>
    </tr>
    <tr>
      <td><code>onLoad</code></td>
      <td><code>() => void</code></td>
      <td>(Optional) Callback when the image finishes loading</td>
    </tr>
    <tr>
      <td><code>onError</code></td>
      <td><code>(error: NativeSyntheticEvent<ImageErrorEventData>) => void</code></td>
      <td>(Optional) Callback when an error occurs during loading</td>
    </tr>
    <tr>
      <td><code>onCustomError</code></td>
      <td><code>(error: Error) => void</code></td>
      <td>(Optional) Callback for custom error handling</td>
    </tr>
  </tbody>
</table>

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