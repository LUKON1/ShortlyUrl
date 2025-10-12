/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fallDown: {
          "from": { height: "0vh" },
          "to": { height: "50vh" },
        },
        fallUp: {
          "from": { height: "50vh" },
          "to": { height: "0vh" },
        },
        fadeOut: {
          "from": { opacity: "70%", transform: "translateX(0)" },
          "to": { opacity: "0", transform: "translateX(100px)" },
        },
        reverseSpin: {
          "from": { transform: "rotate(360deg)" },
          "to": { transform: "rotate(0deg)" },
        }
      },
      fontFamily: {
        amazedoom: ["AmazeDoom", "sans-serif"]
      },
      animation: {
        fallDown: "fallDown 0.3s ease-out forwards",
        fallUp: "fallUp 0.5s ease-out forwards",
        fadeOut: "fadeOut 0.5s ease-out 2.5s forwards",
        reverseSpin: "reverseSpin 1s linear infinite",
      },
    },
  },
  plugins: [],
}