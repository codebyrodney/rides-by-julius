/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9A7D26',
          800: '#7C641E',
          900: '#5E4B16',
        },
        obsidian: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#666666',
          600: '#444444',
          700: '#2a2a2a',
          800: '#1a1a1a',
          900: '#0a0a0a',
          950: '#050505',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-gold': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E17A 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      }
    }
  },
  plugins: []
}
