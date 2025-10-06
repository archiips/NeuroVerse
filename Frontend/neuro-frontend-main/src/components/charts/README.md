# 3D Bar Chart Component

## Overview
The `BarChart3D` component is a modern, interactive 3D bar chart visualization built with Three.js. It's designed to visualize neuroscience dataset statistics with an intuitive and engaging interface.

## Features

### 🎨 Visual Design
- **NeuroVerse Color Scheme**: Uses your project's blue theme (#58A6FF, #9ECFFF)
- **Modern Materials**: Metallic finish with emissive glow for a futuristic look
- **Shadows & Lighting**: Realistic shadows and three-point lighting setup
- **Grid Floor**: Helps with depth perception and spatial understanding

### 🖱️ Interactive Controls
- **Orbit Controls**:
  - Click and drag to rotate the view
  - Scroll to zoom in/out
  - Damping for smooth, natural movement
- **Hover Effects**:
  - Bars highlight when you hover over them
  - Scale up slightly for visual feedback
  - Cursor changes to pointer
- **Click Events**: Click on bars to select categories

### 📊 Data Visualization
- **Dynamic Scaling**: Bar heights automatically scale based on data values
- **Color Coding**: Each category has its own color (blue, green, red, etc.)
- **Labels**: Floating labels above each bar showing name and statistics
- **Responsive**: Adapts to container size

### 🎯 Usage Example

```jsx
import BarChart3D from "./components/charts/BarChart3D";

const data = [
  { name: "Autism", count: 85, percentage: 41.5, color: "bg-blue-500" },
  { name: "Healthy", count: 70, percentage: 34.1, color: "bg-green-500" },
  { name: "ADHD", count: 50, percentage: 24.4, color: "bg-red-500" }
];

<BarChart3D
  data={data}
  totalSubjects={205}
  activeCategory={selectedCategory}
  onBarClick={(categoryName) => console.log(categoryName)}
/>
```

### 🎛️ Props
- `data`: Array of objects with `{ name, count, percentage, color }`
- `totalSubjects`: Total number of subjects (used for height scaling)
- `activeCategory`: Currently selected category name (for highlighting)
- `onBarClick`: Callback function when a bar is clicked

### 🚀 Performance Optimizations
- High-performance rendering mode
- Automatic pixel ratio detection (max 2x for performance)
- Soft shadows for better performance
- Proper cleanup on unmount to prevent memory leaks

### 🎨 Color Mapping
Supports Tailwind color classes:
- `bg-blue-500` → Blue (#3B82F6)
- `bg-green-500` → Green (#10B981)
- `bg-red-500` → Red (#EF4444)
- `bg-purple-500` → Purple (#A855F7)
- `bg-yellow-500` → Yellow (#F59E0B)
- `bg-pink-500` → Pink (#EC4899)

### 📐 Technical Details
- **Camera**: Perspective camera positioned at (6, 5, 8)
- **Lighting**: Ambient + Directional + Point lights
- **Controls**: OrbitControls with damping enabled
- **Grid**: 12x12 grid helper with dark borders
- **Shadow Map**: PCF soft shadows, 2048x2048 resolution

## Browser Compatibility
Requires WebGL support. Works best in modern browsers:
- Chrome 56+
- Firefox 51+
- Safari 11+
- Edge 79+
