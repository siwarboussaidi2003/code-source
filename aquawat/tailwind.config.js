/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#90EE90',
          secondary: '#f0f0f0',
        }
      },
    },
    plugins: [],
  }