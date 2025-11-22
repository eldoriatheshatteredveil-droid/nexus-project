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
      },
      boxShadow: {
        'neon-sm': '0 0 5px rgba(0, 255, 213, 0.3), 0 0 10px rgba(0, 255, 213, 0.1)',
        'neon': '0 0 10px rgba(0, 255, 213, 0.5), 0 0 20px rgba(0, 255, 213, 0.3), 0 0 40px rgba(0, 255, 213, 0.1)',
        'neon-lg': '0 0 15px rgba(0, 255, 213, 0.6), 0 0 30px rgba(0, 255, 213, 0.4), 0 0 60px rgba(0, 255, 213, 0.2)',
        'neon-secondary': '0 0 10px rgba(255, 102, 204, 0.5), 0 0 20px rgba(255, 102, 204, 0.3), 0 0 40px rgba(255, 102, 204, 0.1)',
      },
      dropShadow: {
        'neon': '0 0 5px rgba(0, 255, 213, 0.5)',
        'neon-lg': '0 0 15px rgba(0, 255, 213, 0.5)',
        'neon-secondary': '0 0 5px rgba(255, 102, 204, 0.5)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-glow': {
          textShadow: '0 0 10px rgba(0, 255, 213, 0.5), 0 0 20px rgba(0, 255, 213, 0.3)',
        },
        '.text-glow-lg': {
          textShadow: '0 0 15px rgba(0, 255, 213, 0.6), 0 0 30px rgba(0, 255, 213, 0.4)',
        },
        '.text-glow-secondary': {
          textShadow: '0 0 10px rgba(255, 102, 204, 0.5), 0 0 20px rgba(255, 102, 204, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}