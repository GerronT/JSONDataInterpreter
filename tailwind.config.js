/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#212b36",
        "navy-blue": "#305278"
      }
    },
  },
  plugins: [],
}

