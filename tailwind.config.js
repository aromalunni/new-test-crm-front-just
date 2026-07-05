/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F26B3A',
          orangeDk: '#E2552A',
        },
        sidebar: {
          bg: '#0E1B2E',
          bgAlt: '#1C3151',
          text: '#93A4BC',
        },
        canvas: '#F7F5F2',
        card: '#FFFFFF',
        border: '#ECE7E1',
        ink: '#1B2433',
        inkSoft: '#5B6675',
        green: '#1FA463',
        greenSoft: '#E5F4EC',
        amber: '#F1A33B',
        amberSoft: '#FCF1DF',
        red: '#E0533D',
        redSoft: '#FBE9E4',
        blue: '#2F6FED',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
