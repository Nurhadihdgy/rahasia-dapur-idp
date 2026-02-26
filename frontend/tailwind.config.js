/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tambahkan warna tema Anda di sini
        'dapur-orange': '#F27405', 
        'dapur-cream': '#F9F4F0',
      }
    },
  },
  plugins: [],
}