/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030D16',
          900: '#071A2B', // Main background
          800: '#0B2C47', // Deep blue card surface
          700: '#113E63',
          600: '#1A5383',
          500: '#266DA5',
        },
        electric: {
          500: '#2D9CDB', // Electric blue primary
          400: '#4AB2EC',
          600: '#1C7EB8',
        },
        cyanGlow: {
          400: '#24D6E8', // Cyan accent
          500: '#0FBECD',
          300: '#67E8F6',
        },
        purpleAccent: {
          500: '#7C3AED',
          400: '#8B5CF6',
          600: '#6D28D9',
        },
        safe: {
          500: '#22C55E', // Green safe
          400: '#4ADE80',
          600: '#16A34A',
          900: '#052E16',
        },
        caution: {
          500: '#FACC15', // Yellow caution
          400: '#FDE047',
          600: '#CA8A04',
          900: '#422006',
        },
        construction: {
          500: '#F97316', // Orange construction
          400: '#FB923C',
          600: '#EA580C',
          900: '#431407',
        },
        danger: {
          500: '#EF4444', // Red danger/accident
          400: '#F87171',
          600: '#DC2626',
          900: '#450A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-electric': '0 0 20px -3px rgba(45, 156, 219, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(36, 214, 232, 0.45)',
        'glow-danger': '0 0 20px -3px rgba(239, 68, 68, 0.45)',
        'glow-safe': '0 0 20px -3px rgba(34, 197, 94, 0.45)',
        'glow-caution': '0 0 20px -3px rgba(250, 204, 21, 0.45)',
        'card': '0 8px 30px -4px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
