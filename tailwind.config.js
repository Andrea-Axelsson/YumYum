/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    animation: {
      'fade-in': 'fadeIn 0.5s forwards',
      'fade-out': 'fadeOut 0.5s forwards',
    },
    
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      fadeOut: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
    },

    screens: {
      'sm': '640px', // default
      'md': '768px', // default
      'lg': '1200px', // default
      'xl': '1280px', // default
      '2xl': '1536px', // default
    },
    extend: {
      fontSize: {
        32: '2rem',
        28: '1.75rem',
        26: '1.625',
        24: '1.5rem',
        22: '1.375',
        16: '1rem',
        15: '0.9375rem',
        14: '0.875rem',
      },
      fontFamily: {
        'fira-sans': ['"Fira Sans"', 'sans-serif'],
      },
      colors: {
        'primary' : {
          100: '#8ED8BF',
          200: '#489078',
          300: '#605858',
          400: '#353131',
          500: '#837D7C',
          600: '#C2C1C1'
        },
        'secondary' : {
          100: '#00C3FF',
          200: '#EB5757',
          300: '#F4F3F1',
          400: '#EEEEEE',
          500: '#FBE9E9',
          600: '#66605F',
          700: '#1E1B1B',
        }
      }
    },
  },
  plugins: [],
}

