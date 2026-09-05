/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        accent: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
        },
        macro: {
          protein: '#3b82f6', // Blue
          carbs: '#f59e0b',   // Amber
          fat: '#ec4899',     // Pink
          fiber: '#10b981',   // Emerald
          water: '#06b6d4',   // Cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
