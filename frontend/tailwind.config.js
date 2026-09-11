/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF4',
          100: '#FAF4E1',
          200: '#F4E7BD',
          300: '#EBD593',
          400: '#DFC068',
          500: '#D4AF37', // Primary Classic Royal Gold
          600: '#B89328',
          700: '#94731C',
          800: '#735715',
          900: '#523C0E',
        },
        rani: {
          50: '#FDF2F4',
          100: '#FCE7EA',
          200: '#F8C2C9',
          500: '#B73239', // Royal Rani / Crimson
          700: '#8A1820',
          900: '#520B10',
        },
        marigold: {
          50: '#FFF9EB',
          100: '#FEF0CE',
          400: '#F5A623',
          500: '#E67E22',
        },
        parchment: '#FDFBF7',
        sand: '#F5EFEB',
        charcoal: '#23201E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'luxury': '0 20px 45px -15px rgba(212, 175, 55, 0.25), 0 0 15px rgba(0,0,0,0.06)',
        'postcard': '0 25px 60px -15px rgba(35, 32, 30, 0.18), 0 0 1px rgba(212, 175, 55, 0.4)',
      }
    },
  },
  plugins: [],
}
