/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Map all old dark/obsidian colors to white/light grays
        gold: {
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#000000',
          600: '#111111',
          700: '#222222',
        },
        dark: {
          900: '#ffffff',
          800: '#f9fafb',
          700: '#f3f4f6',
          600: '#e5e7eb',
          500: '#d1d5db',
          400: '#9ca3af',
        },
        obsidian: {
          950: '#ffffff',
          900: '#f9fafb',
          800: '#f3f4f6',
          700: '#e5e7eb',
          600: '#9ca3af',
          500: '#6b7280',
          400: '#374151',
          300: '#1f2937',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};