/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#E8E4DD',
        signal: '#E63B2E',
        cream: '#F5F3EE',
        ink: '#111111',
        'ink-muted': '#444444',
        'ink-light': '#888888',
        'surface': '#EDEAE3',
        'surface-dark': '#1A1A1A',
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}
