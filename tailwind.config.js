module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Roboto"', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      backgroundImage: {
        'cyber-pattern': "url('/path/to/cyber-pattern.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(0, 255, 213, 0.15), 0 0 20px rgba(0, 255, 213, 0.1)',
        'neon': '0 0 20px rgba(0, 255, 213, 0.2), 0 0 40px rgba(0, 255, 213, 0.1)',
        'neon-lg': '0 0 30px rgba(0, 255, 213, 0.3), 0 0 60px rgba(0, 255, 213, 0.15)',
        'neon-secondary': '0 0 20px rgba(255, 102, 204, 0.2), 0 0 40px rgba(255, 102, 204, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      dropShadow: {
        'neon': '0 0 8px rgba(0, 255, 213, 0.4)',
        'neon-lg': '0 0 20px rgba(0, 255, 213, 0.3)',
        'neon-secondary': '0 0 8px rgba(255, 102, 204, 0.4)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-glow': {
          textShadow: '0 0 15px rgba(0, 255, 213, 0.4), 0 0 30px rgba(0, 255, 213, 0.2)',
        },
        '.text-glow-lg': {
          textShadow: '0 0 20px rgba(0, 255, 213, 0.5), 0 0 40px rgba(0, 255, 213, 0.3)',
        },
        '.text-glow-secondary': {
          textShadow: '0 0 15px rgba(255, 102, 204, 0.4), 0 0 30px rgba(255, 102, 204, 0.2)',
        },
        '.glass-panel': {
          background: 'rgba(20, 20, 30, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}