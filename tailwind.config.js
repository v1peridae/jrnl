/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontSize: {
        "9xl": ["400px"],
      },

      fontFamily: {
        neuebit: ["neuebit", "sans-serif"],
        mondwest: ["mondwest", "sans-serif"],
      },

      borderRadius: {
        "3xl": "2.2rem",
      },
    },

    plugins: [],
  },
};
