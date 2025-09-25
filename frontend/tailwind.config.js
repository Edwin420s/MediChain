/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A3D62',
        secondary: '#16A085',
        accent: '#8247E5',
      }
    },
  },
  plugins: [],
}