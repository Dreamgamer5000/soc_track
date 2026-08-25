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
            DEFAULT: "#F68048",
            hover: "#FF9768",
            light: "var(--primary-light)",
            border: "var(--primary-border)",
          },
          amber: {
            DEFAULT: "#FFCC00",
            light: "var(--amber-light)",
            text: "var(--amber-text)",
            border: "var(--amber-border)",
          },
          sage: {
            DEFAULT: "#00E599",
            light: "var(--sage-light)",
            text: "var(--sage-text)",
            border: "var(--sage-border)",
          },
          indigo: {
            DEFAULT: "#8A7CFF",
            light: "var(--indigo-light)",
            text: "var(--indigo-text)",
            border: "var(--indigo-border)",
          },
          crimson: {
            DEFAULT: "#FF4D4D",
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
        warm: "0 4px 20px -2px rgba(246, 128, 72, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "warm-lg": "0 10px 30px -4px rgba(246, 128, 72, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
