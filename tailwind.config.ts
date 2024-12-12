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
      animation: {
        'warrior-walk': 'walk 1s steps(6) infinite',
        'warrior-idle': 'warriorIdle 1s steps(4) infinite', 
      },
      keyframes: {
        walk: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-216px 0' }, // Adjust based on the sprite width
        },
        warriorIdle: {
          '0%': { backgroundPosition: '0px 0px' },         // First frame
          '25%': { backgroundPosition: '-36px 0px' },       // Second frame
          '50%': { backgroundPosition: '-72px 0px' },       // Third frame
          '75%': { backgroundPosition: '-108px 0px' },      // Fourth frame
          '100%': { backgroundPosition: '-144px 0px' },     // Last frame (end of idle animation)
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
