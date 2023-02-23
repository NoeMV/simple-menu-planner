/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'signika-negative': ['Signika Negative', 'sans-serif'],
      },
      backgroundImage: {
        'start-image': "url('./assets/blurry-gradient-haikei.svg')",
      }
    },
  },
  plugins: [],
}
