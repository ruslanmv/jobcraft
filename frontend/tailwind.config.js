/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jc: {
          950: '#07070a',
          900: '#0b0b12',
          800: '#141426',
          700: '#1d1d33',
          accent: '#22c55e'
        }
      }
    }
  },
  plugins: []
}
