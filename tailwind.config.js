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
      animation: {
        customKeyframe: "customKeyframe 1s",
        opacityBounce: "opacityBounce 1.3s infinite alternate ease-in-out ",
      },
      keyframes: {
        customKeyframe: {
          "0%": { opacity: "1", boxShadow: "0px 4px 150px rgba(0, 0, 0, 1)" },
          "100%": { opacity: "0", boxShadow: "0px 4px 150px rgba(0, 0, 0, 0)" },
        },

        opacityBounce: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
