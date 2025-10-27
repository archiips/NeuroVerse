/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#60a5fa',     // Softer light blue
        'secondary-blue': '#3b82f6',   // Medium blue  
        'light-blue': '#93c5fd',       // Light blue
        'eerie-black': '#101922',
        'dark-border': '#1e2933',
        'background-light': '#f7f8fa',
        'background-dark': '#0D0D0D',
        primary: '#2563eb',
      },
      fontFamily: {
        display: ["Space Grotesk"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};