/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "eerie-black": "#1A1A1A",
        "pakistan-green": "#16381A",
        "hunter-green": "#386641",
        "fern-green": "#6A994E",
        "aquamarine": "#A7E09A",
        primary: "#6A994E",
        "background-light": "#FFFFFF",
        "background-dark": "#1A1A1A",
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