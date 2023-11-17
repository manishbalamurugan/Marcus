/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', color: '#0c4a6e' }, // light gray
          '100%': { opacity: '1', color: '#075985' }, // dark gray
        },
      },
      animation: {
        fadeIn: 'fadeIn 2.5s ease-in forwards',
      },
    },
  },
  plugins: [],
}

