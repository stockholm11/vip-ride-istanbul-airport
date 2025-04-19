/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F1A2A', // dark navy
          light: '#1E2B3D',
          dark: '#06101C',
        },
        secondary: {
          DEFAULT: '#B8A346', // gold
          light: '#D1BE63',
          dark: '#9A882E',
        },
        accent: {
          DEFAULT: '#FFFFFF', // white
          light: '#F5F5F5',
          dark: '#E0E0E0',
        },
        dark: {
          DEFAULT: '#121212', // near black
          light: '#1E1E1E',
          dark: '#000000',
        },
      },
      fontFamily: {
        sans: ['Kumbh Sans', 'sans-serif'],
        heading: ['Kumbh Sans', 'sans-serif'],
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
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/images/hero-bg.jpg')",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
