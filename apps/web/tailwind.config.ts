import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pomelli: {
          hero: "#191E0B",
          dark: "#11120E",
          card: "#242620",
          cardBase: "#181916",
          inputCard: "#23251F",
          inputField: "#161713",
          backdrop: "#121210",
          border: "#2E3029",
          borderModal: "#3A3D34",
          borderFocused: "#44473E",
          borderMoss: "#363E1D",
          lime: "#B8C468",
          limeHover: "#C6D276",
          limeText: "#14180A",
          limeTextLight: "#C5D37A",
          moss: "#363E1D",
          mossHover: "#454F26",
          greyBtn: "#373835",
          greyBtnHover: "#4A4C47",
          swatchTeal: "#34534d",
          swatchSlate: "#80979a",
          swatchOchre: "#d3b79c",
          riskGraveyard: "#F87171",
          metricMrr: "#4ADE80",
          textPrimary: "#EDEFE6",
          textSecondary: "#9A9D93",
          textMuted: "#686B60",
        },
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "IvyPresto Headline", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", "Google Sans", "sans-serif"],
        handwriting: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      dropShadow: {
        scrap: "0 15px 30px rgba(0,0,0,0.45)",
        collage: [
          "0px 20px 30px rgba(0, 0, 0, 0.70)",
          "0px 4px 10px rgba(0, 0, 0, 0.40)",
        ],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        float: "float 4.5s ease-in-out infinite",
        floatDelayed: "float 5s ease-in-out 1.5s infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

