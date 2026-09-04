import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBFAF8",
        paper: "#FCFBF9",
        ink: "#14161A",
        // sidebar / panels
        panel: "#F6F4F0",
        "panel-alt": "#F9F7F4",
        // dark surfaces (welcome / live-run hero)
        dark: "#101215",
        "dark-ink": "#14161A",
        // borders
        border1: "#E7E3DB",
        border2: "#EDE9E1",
        border3: "#DDD8CE",
        // text
        muted1: "#5B5750",
        muted2: "#6B675F",
        muted3: "#7D786F",
        muted4: "#8C877E",
        muted5: "#9A948A",
        muted6: "#A8A296",
        // accents
        accent: "#2159C5",
        "accent-soft": "#EDF2FD",
        good: "#2C7A55",
        "good-soft": "#EDF6F1",
        warn: "#8C5A13",
        "warn-soft": "#FDF4E7",
        bad: "#A8412C",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-newsreader)", "serif"],
      },
      keyframes: {
        "kl-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "kl-rise": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "kl-pulse": "kl-pulse 1.2s ease-in-out infinite",
        "kl-rise": "kl-rise 0.5s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
