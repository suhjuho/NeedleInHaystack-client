import colors from "tailwindcss/colors";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      animation: {
        scan: "upDown 6s infinite",
      },
      keyframes: {
        upDown: {
          "0%": {
            top: "0",
            animationTimingFunction: "cubic - bezier(0.8, 0, 1, 1)",
          },
          "100%": {
            top: "99%",
            animationTimingFunction: "cubic - bezier(0.8, 0, 1, 1)",
          },
        },
      },
      colors: {
        secondary: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          border: colors.neutral[400],
          text: colors.neutral[500],
          dark: colors.neutral[800],
          "dark-hover": colors.neutral[900],
        },
        main: "#38D430",
      },
    },
  },
  plugins: [],
};
