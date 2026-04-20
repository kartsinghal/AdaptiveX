import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        panel: '#111111',
        brand: {
          50: '#fff3ea',
          100: '#ffe5cd',
          200: '#fec99b',
          300: '#fca65b',
          400: '#f97c21',
          500: '#f55c00',
          600: '#e54500',
          700: '#be3102',
          800: '#98280a',
          900: '#7a230c',
          950: '#420f04',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
