/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#0B0E14",
          900: "#101522",
          850: "#141B2B",
          800: "#1A2236",
          700: "#25304A",
        },
        prism: {
          bg: "#0B0E14",
          panel: "#141B2B",
          neonPink: "#ff4fd8",
          neonPurple: "#9d4edd",
          cyan: "#22d3ee",
        },
        premium: {
          violet: "#8B5CF6",
          iris: "#A78BFA",
          gold: "#E7C66A",
          mint: "#5CE1C2",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Lexend", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "ui-serif", "Georgia", "serif"],
      },
      backgroundImage: {
        "obsidian-depth":
          "radial-gradient(1200px 700px at 10% -10%, rgba(139, 92, 246, 0.17), transparent 52%), radial-gradient(900px 500px at 90% -15%, rgba(231, 198, 106, 0.11), transparent 48%), linear-gradient(180deg, #101522 0%, #0B0E14 100%)",
        "premium-sheen": "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 48%, #E7C66A 100%)",
        "glass-line": "linear-gradient(120deg, rgba(255,255,255,0.4), rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.3) 100%)",
        "prism-neon": "linear-gradient(135deg, #9d4edd 0%, #ff4fd8 55%, #22d3ee 100%)",
        "pride-rainbow": "linear-gradient(90deg,#e11d48,#f59e0b,#84cc16,#06b6d4,#8b5cf6)",
      },
      boxShadow: {
        neon: "0 0 18px rgba(157, 78, 221, 0.45)",
        "glow-violet": "0 0 0 1px rgba(167, 139, 250, 0.2), 0 10px 40px rgba(139, 92, 246, 0.28)",
        "glow-gold": "0 0 0 1px rgba(231, 198, 106, 0.24), 0 12px 42px rgba(231, 198, 106, 0.2)",
        "card-soft": "0 14px 32px rgba(1, 6, 18, 0.42)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float-up": {
          "0%": { transform: "translateY(6px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        aurora: "aurora 4s ease infinite",
        "float-up": "float-up 450ms ease-out both",
      },
    },
  },
  plugins: [],
};
