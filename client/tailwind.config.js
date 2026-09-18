/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          950: '#060813',
          900: '#0a0d1d',
          850: '#0d1127',
          800: '#131836',
          700: '#1e254d',
        },
        cyanGlow: '#06b6d4',
        indigoGlow: '#6366f1',
        violetGlow: '#8b5cf6',
      },
      boxShadow: {
        'antigravity': '0 20px 50px -10px rgba(99, 102, 241, 0.25), 0 0 30px rgba(6, 182, 212, 0.15)',
        'antigravity-lg': '0 30px 60px -12px rgba(139, 92, 246, 0.35), 0 0 45px rgba(6, 182, 212, 0.25)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'neon-indigo': '0 0 20px rgba(99, 102, 241, 0.4)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'bar-dance': 'barDance 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.08)' },
        },
        barDance: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
