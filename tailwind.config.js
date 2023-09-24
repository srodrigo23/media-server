/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/**/*.{html,js,pug}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

