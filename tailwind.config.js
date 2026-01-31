/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette
        'cream': {
          DEFAULT: '#F7F5F0',
          dark: '#EBE7DF',
          muted: '#D8D4CA',
        },
        'slate': {
          DEFAULT: '#1A2332',
          light: '#2A3847',
          muted: '#566478',
        },
        // Accent Colors
        'accent': {
          DEFAULT: '#E84D1C',
          hover: '#D44318',
          light: 'rgba(232, 77, 28, 0.1)',
        },
        'success': '#2D8A5F',
        'warning': '#D4970A',
        'info': '#3B7DD8',
        'danger': '#C73E3E',
        // Blueprint
        'blueprint': {
          DEFAULT: '#3B7DD8',
          light: 'rgba(59, 125, 216, 0.12)',
          line: 'rgba(59, 125, 216, 0.4)',
        },
        // Legacy compatibility
        'neon-blue': '#3B7DD8',
        'neon-purple': '#8B5CF6',
        'neon-green': '#2D8A5F',
        'neon-orange': '#E84D1C',
        'neon-pink': '#EC4899',
        'dark-bg': '#F7F5F0',
        'dark-card': '#EBE7DF',
        'dark-border': '#D8D4CA',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['Spectral', 'Georgia', 'serif'],
      },
      animation: {
        'reveal': 'reveal-up 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
        'draw': 'draw 2s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(26, 35, 50, 0.06), 0 1px 2px rgba(26, 35, 50, 0.04)',
        'paper-md': '0 4px 12px rgba(26, 35, 50, 0.08)',
        'paper-lg': '0 12px 32px rgba(26, 35, 50, 0.12)',
        'accent': '0 4px 20px rgba(232, 77, 28, 0.25)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
