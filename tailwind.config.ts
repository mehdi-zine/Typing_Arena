import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '350px',
      },
      colors: {
        primary: "#3DB6A9", // Teal
        secondary: "#FF6F61",
        neutralLight: "#FFFFFF", // White
        neutralDark: "#2C3E50", // Dark Gray
      },
    },
  },
  plugins: [],
} satisfies Config;
