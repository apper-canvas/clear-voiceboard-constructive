/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#6B7280',
        accent: '#10B981',
        surface: '#FFFFFF',
        background: '#F9FAFB',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scale-bounce': 'scaleBounce 0.2s ease-out',
        'vote-increment': 'voteIncrement 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        scaleBounce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1.05)' },
        },
        voteIncrement: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}