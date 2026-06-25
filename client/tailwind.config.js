/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#0B1B2B",
          50: "#F4F6F8",
          100: "#1E3349",
          200: "#16273D",
          300: "#0F2031",
          400: "#0B1B2B",
          500: "#081420",
          600: "#050E16",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#16273D",
        },
        signal: {
          DEFAULT: "#F2A93B",
          50: "#FDF2E2",
          100: "#FBE4BF",
          400: "#F2A93B",
          500: "#E0922A",
          600: "#B97419",
        },
        cyan: {
          DEFAULT: "#3FC1C9",
          50: "#E5F8F9",
          400: "#3FC1C9",
          500: "#2BA3AB",
        },
        danger: {
          DEFAULT: "#E2483D",
          50: "#FCE9E7",
          400: "#E2483D",
          500: "#C53A30",
        },
        safe: {
          DEFAULT: "#2FB67C",
          50: "#E4F7EE",
          400: "#2FB67C",
          500: "#22965F",
        },
        mist: "#F4F6F8",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        panel: "0 8px 32px rgba(8, 20, 32, 0.24)",
        glow: "0 0 0 1px rgba(63, 193, 201, 0.25), 0 8px 24px rgba(63, 193, 201, 0.15)",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(244,246,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,246,248,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        "trace-sweep": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        trace: "trace-sweep 2.4s ease-out forwards",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
