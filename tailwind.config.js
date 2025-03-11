import svgToDataUri from "mini-svg-data-uri";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        marquee: "marquee var(--duration) linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }, // Move exactly half to loop seamlessly
        },
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => {
            return {
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
              )}")`,
              backgroundSize: "32px 32px",
            };
          },
          "bg-grid-small": (value) => {
            return {
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H7.5V8"/></svg>`
              )}")`,
              backgroundSize: "8px 8px",
            };
          },
          "bg-dot": (value) => {
            return {
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="none"><circle fill="${value}" cx="8" cy="8" r="1.5"/></svg>`
              )}")`,
              backgroundSize: "16px 16px",
            };
          },
        },
        { values: theme("colors"), type: "color" }
      );
    },
  ],
};

export default config;
