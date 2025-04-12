/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx}"
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Lexend', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '868px',
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  plugins: [],
}
