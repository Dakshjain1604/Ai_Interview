import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class", // allows manual toggle with `.dark`
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
}

export default config
