/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        headerbg: "#2d3748",
        // …otros colores…
      },
      fontFamily: {
        base: ['Verdana','Geneva','Tahoma','sans-serif'],
        // …otras familias…
      },
    },
  },
  plugins: [],
};
