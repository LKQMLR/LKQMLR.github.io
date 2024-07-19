export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ["Josefin Slab", "serif"],
      },
      colors: {
        customBlur: ["#0A8754", "#EA3C76", "#CD8987", "#4C6085", "#F46036", "#000000"],
      },
      boxShadow: {
        customBoxShadow: "0px 0px 20px 1px rgba(0,0,0,0.63)",
      },
    },
  },
  plugins: [],
};
