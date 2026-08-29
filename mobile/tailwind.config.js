/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          coral: "#E94560",
          teal: "#0F3460",
          gold: "#E9A319",
          dark: "#1A1A2E",
          light: "#F9F9F9"
        }
      }
    },
  },
  plugins: [],
}
