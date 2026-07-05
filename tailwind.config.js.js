/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#7627C5',
          700: '#5A1E9E',
        },
        dark: {
          bg: '#1a1a2e',
          card: '#2a2a3e',
          darker: '#0d0d1a',
        },
      },
    },
  },
  plugins: [],
};