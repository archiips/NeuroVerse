# NeuroData - Neuroscience Data Visualization Platform

## Current Implementation - Landing Page

This is the current implementation of the NeuroData landing page built with React, Vite, and TailwindCSS.

### ✅ What's Implemented

#### 🏗️ **Project Structure**
```
src/
├── components/
│   ├── Header.jsx          # Navigation header with logo and menu
│   ├── Footer.jsx          # Footer with links and copyright
│   ├── HomePage.jsx        # Main landing page content
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx      # Styled button component with variants
│       ├── Card.tsx        # Card component with glassmorphism option
│       ├── Input.tsx       # Input component with icons and validation
│       └── LoadingSpinner.tsx # Loading spinner component
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   └── cn.ts              # Class name utility (clsx + tailwind-merge)
├── App.jsx                # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind imports
```

#### 🎨 **Design System**
- **Color Palette**:
  - Primary: `#3db8f5` (NeuroData Blue) with full scale (50-950)
  - Background Light: `#f8fafc`
  - Background Dark: `#0f172a`
  - Surface colors for light/dark modes
- **Typography**: Inter font family
- **Components**: Glassmorphism effects, custom animations
- **Responsive**: Mobile-first design with proper breakpoints

#### 🧩 **Components**

##### Header Component (`src/components/Header.jsx`)
- Sticky navigation with backdrop blur
- NeuroData logo (SVG)
- Navigation menu (Explore, Datasets, Publications, About)
- Get Started CTA button
- Responsive design (mobile menu hidden)

##### HomePage Component (`src/components/HomePage.jsx`)
- **Hero Section**:
  - Full-width background image with gradient overlay
  - Main headline: "Democratizing Neuroscience Research Data"
  - Descriptive text about the platform
  - Primary CTA button
- **Key Features Section**:
  - Three-column grid layout
  - Interactive Exploration feature
  - Advanced Visualization feature
  - Collaborative Research feature
  - Each with icons and descriptions
- **Call-to-Action Section**:
  - "Ready to Explore?" heading
  - Secondary CTA to explore datasets

##### Footer Component (`src/components/Footer.jsx`)
- Links: Terms of Service, Privacy Policy, Contact Us
- Copyright notice
- Responsive layout

#### 🎛️ **Configuration**

##### TailwindCSS Config (`tailwind.config.js`)
```javascript
{
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#38bdf8',
          // Full scale 50-950
        },
        'background-light': '#f8fafc',
        'background-dark': '#0f172a',
        // Additional surface and text colors
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      // Custom animations and keyframes
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
```

##### Global Styles (`src/index.css`)
- TailwindCSS imports
- Inter font import
- Material Symbols icons
- Glassmorphism utility classes
- Custom scrollbar styles
- Hero background image class

#### 📦 **Dependencies**
Current dependencies installed:
```json
{
  "dependencies": {
    "@headlessui/react": "^2.2.9",
    "@heroicons/react": "^2.2.0",
    "@tailwindcss/forms": "^0.5.10",
    "@tanstack/react-query": "^5.90.2",
    "@tanstack/react-query-devtools": "^5.90.2",
    "@types/d3": "^7.4.3",
    "axios": "^1.12.2",
    "chart.js": "^4.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "d3": "^7.9.0",
    "react": "^19.1.1",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2",
    "recharts": "^3.2.1",
    "tailwind-merge": "^3.3.1"
  }
}
```

### 🚀 **Current Status**

✅ **Completed Features:**
- Responsive landing page layout
- NeuroData branding and theme
- Hero section with background image
- Features showcase section
- Call-to-action section
- Navigation header and footer
- Mobile-responsive design
- TailwindCSS configuration
- UI component library foundation

### 🎯 **Next Steps** (Not Yet Implemented)

When ready to expand beyond the landing page:

1. **Routing**: Add React Router for navigation between pages
2. **Pages**: Create Explore, About, and Dataset detail pages
3. **State Management**: Implement React Query for API calls
4. **Charts**: Add Chart.js/D3 visualizations
5. **API Integration**: Connect to backend services
6. **Authentication**: Add user login/registration
7. **Dark Mode**: Implement theme switching
8. **Search**: Add dataset search functionality

### 🖥️ **Development**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 📝 **Notes**

- Currently uses `.jsx` files (can be converted to `.tsx` when adding TypeScript)
- Styling matches the provided design template exactly
- All components are functional and responsive
- Ready for incremental feature additions
- Uses modern React patterns and best practices

This implementation provides a solid foundation for the NeuroVis platform with a polished landing page that can be expanded step by step.