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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "warm-50": "#fef9f3",
        "warm-100": "#fef3e7",
        "warm-200": "#fde4c3",
        "warm-300": "#fcd59f",
        "warm-400": "#fbb757",
        "warm-500": "#fa990f",
        "cool-50": "#f0f9ff",
        "cool-100": "#e0f2fe",
        "cool-200": "#b9e6fe",
        "cool-300": "#7dd3fc",
        "cool-400": "#38bdf8",
        "cool-500": "#0ea5e9",
      },
      animation: {
        "pulse-soft": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
