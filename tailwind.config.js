/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        'tigo-blue': '#0056A0',
        'tigo-cyan': '#00C0F1',
        'tigo-light': '#F5F7FA'
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
