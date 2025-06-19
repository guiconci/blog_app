/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          light: "#fdfdfd",         // Light mode editor
          dark: "#1e1e2f",          // Dark mode editor (softer than black)
          subtle: "#f5f5f5",        // Light mode outer background
          subtleDark: "#2a2a3b",    // Dark mode outer background (mild contrast)
        },
        highlight1: {
          light: "#94A3B8", // Slate-400: soft neutral, perfect for focus/outline
          dark: "#475569", // Slate-600: subtle contrast, calm in dark UI
        },
        highlight2: {
          light: "#8B5CF6", // Violet-500 — vivid but balanced, modern SaaS vibe
          dark: "#A78BFA", // Violet-400 — soft neon in dark mode
        },
        buttonDisabled: {
          light: "#d1d5db", // "gray-300"
          dark: "#3f3f46" // "zinc-700"
        },
        textMain: {
          light: "#111827",         // Almost black
          dark: "#e5e7eb",          // Light gray for readability
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.textMain.light'),
            a: { color: theme('colors.highlight2.light') },
            strong: { color: theme('colors.textMain.light') },
            h1: { color: theme('colors.textMain.light') },
            h2: { color: theme('colors.textMain.light') },
            h3: { color: theme('colors.textMain.light') },
            code: { color: theme('colors.textMain.light') },
          },
        },
        invert: {
          css: {
            color: theme('colors.textMain.dark'),
            a: { color: theme('colors.highlight2.dark') },
            strong: { color: theme('colors.textMain.dark') },
            h1: { color: theme('colors.textMain.dark') },
            h2: { color: theme('colors.textMain.dark') },
            h3: { color: theme('colors.textMain.dark') },
            code: { color: theme('colors.textMain.dark') },
          },
        },
      }),

    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
