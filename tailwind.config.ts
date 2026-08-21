import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "#FAF8F5",
          card: "#FFFFFF",
          border: "#EADBCC",
          muted: "#78716C",
          dark: "#292524",
          surface: "#F5EFEB",
          primary: {
            DEFAULT: "#D05A3F",
            hover: "#B84A30",
            light: "#FDF3F0",
            border: "#F7C5BA",
          },
          amber: {
            DEFAULT: "#D97706",
            light: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
          },
          sage: {
            DEFAULT: "#2D7A4D",
            light: "#DCFCE7",
            text: "#166534",
            border: "#BBF7D0",
          },
          indigo: {
            DEFAULT: "#4F46E5",
            light: "#EEF2FF",
            text: "#3730A3",
            border: "#C7D2FE",
          },
          crimson: {
            DEFAULT: "#DC2626",
            light: "#FEE2E2",
            text: "#991B1B",
            border: "#FECACA",
          },
        },
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(90, 50, 20, 0.06), 0 2px 6px -1px rgba(90, 50, 20, 0.04)",
        "warm-lg": "0 10px 30px -4px rgba(90, 50, 20, 0.08), 0 4px 10px -2px rgba(90, 50, 20, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
