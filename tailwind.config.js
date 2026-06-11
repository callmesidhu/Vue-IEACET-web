
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{vue,js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        noir: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#121212',
          600: '#1a1a1a',
          500: '#262626',
        },
        slate: {
          gray: '#334155',
          light: '#94a3b8'
        },
        accent: {
          DEFAULT: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.5)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oxanium', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
