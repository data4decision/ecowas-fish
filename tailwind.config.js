
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: '#0b0b5c', // navy blue
        accent: '#f47b20',  // orange
      },
      animation: {
      fadeIn: 'fadeIn 1s ease-in-out forwards',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    }
    },
  },
  plugins: [],
}
// export default  {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
