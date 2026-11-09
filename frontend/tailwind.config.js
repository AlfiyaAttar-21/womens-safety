/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      },
      fontFamily: {
        headline: ["Merriweather", "serif"],
        body: ["Source Serif 4", "serif"],
        label: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}