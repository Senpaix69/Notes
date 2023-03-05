/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      rotate: {
        16: "16deg",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
