import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sauge: { 50: '#f4f6f1', 100: '#e6ebe0', 300: '#c2cfb3', 500: '#9CAF88', 700: '#6f8560' },
        creme: '#FAF8F2',
      },
    },
  },
  plugins: [],
};
export default config;
