
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8d9d4f",
        secondary: "#6b7a3a",
        background: "#faf8f2",
        foreground: "#2c2a1e",
        card: "#e7dbbf",
        muted: "#f0ead6",
        accent: "#b5a97c",
        border: "#d9cfb0",
        sidebar: "#f5f0e0",
        ink: {
          DEFAULT: "#2A1B3D",
          soft: "#5B4A70",
          faint: "#8A7B9E"
        },
        cream: "#FFF8F5",
        blush: "#F7DCE5",
        lilac: "#E9E0F6",
        sos: {
          DEFAULT: "#E5384F",
          dark: "#C42A40"
        },
        safe: {
          DEFAULT: "#1F9D8A",
          soft: "#D8F1EC"
        },
      },
      fontFamily: {
        headline: ["Merriweather", "serif"],
        body: ["Source Serif 4", "serif"],
        label: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(42,27,61,.06), 0 12px 32px -12px rgba(42,27,61,.18)",
        sos: "0 10px 30px -6px rgba(229,56,79,.55)",
      },
      keyframes: {
        ring: {
          "0%": { transform: "scale(1)", opacity: ".45" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        ring: "ring 2.8s ease-out infinite"
      },
    },
  },
  plugins: [],
};
