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
          light: "#F4F3EE",         // Light mode editor
          dark: "#1e1e2f",          // Dark mode editor (softer than black)
          subtle: "#ECE8E1",        // Light mode outer background
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
          light: "#2B2D42",         // Almost black
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
            pre: {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowX: 'hidden',
            },
            iframe: {
              display: 'block',
              margin: '8px auto',
              maxWidth: '750px',
              width: '100%',
              /* let the browser keep its intrinsic ratio: */
              aspectRatio: '16/9',
              borderRadius: '5px'
            },
            hr: { margin: '26px 0' },
            '.prose ul': {
              listStyleType: 'disc',
              paddingLeft: theme('spacing.4'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            '.prose ul ul': {
              listStyleType: 'circle',
              paddingLeft: theme('spacing.3'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            '.prose ul ul ul': {
              listStyleType: 'square',
              paddingLeft: theme('spacing.3'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            '.prose ol': {
              listStyleType: 'decimal',
              paddingLeft: theme('spacing.4'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            '.prose ol ol': {
              listStyleType: 'lower-alpha',
              paddingLeft: theme('spacing.4'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            '.prose ol ol ol': {
              listStyleType: 'lower-roman',
              paddingLeft: theme('spacing.4'),
              '@screen md': {
                paddingLeft: theme('spacing.8'),
              },
            },
            'li > p': {
              marginTop: '0',
              marginBottom: '0',
            },
            'li + li': {
              marginTop: theme('spacing.2'),
            },
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
