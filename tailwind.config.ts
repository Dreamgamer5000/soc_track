import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: "var(--bg-main)",
          card: "var(--bg-card)",
          border: "var(--border-color)",
          muted: "var(--text-muted)",
          dark: "var(--text-primary)",
          surface: "var(--bg-surface)",
          primary: {
            DEFAULT: "#D05A3F",
            hover: "#B84A30",
            light: "var(--primary-light)",
            border: "var(--primary-border)",
          },
          amber: {
            DEFAULT: "#D97706",
            light: "var(--amber-light)",
            text: "var(--amber-text)",
            border: "var(--amber-border)",
          },
          sage: {
            DEFAULT: "#2D7A4D",
            light: "var(--sage-light)",
            text: "var(--sage-text)",
            border: "var(--sage-border)",
          },
          indigo: {
            DEFAULT: "#4F46E5",
            light: "var(--indigo-light)",
            text: "var(--indigo-text)",
            border: "var(--indigo-border)",
          },
          crimson: {
            DEFAULT: "#DC2626",
            light: "var(--crimson-light)",
            text: "var(--crimson-text)",
            border: "var(--crimson-border)",
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
