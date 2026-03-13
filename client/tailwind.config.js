/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        prism: {
          bg: "#0f172a",
          panel: "#1e293b",
          neonPink: "#ff4fd8",
          neonPurple: "#9d4edd",
          cyan: "#22d3ee",
        },
      },
      backgroundImage: {
        "prism-neon": "linear-gradient(135deg, #9d4edd 0%, #ff4fd8 55%, #22d3ee 100%)",
        "pride-rainbow": "linear-gradient(90deg,#e11d48,#f59e0b,#84cc16,#06b6d4,#8b5cf6)",
      },
      boxShadow: {
        neon: "0 0 18px rgba(157, 78, 221, 0.45)",
      },
    },
  },
  plugins: [],
};
