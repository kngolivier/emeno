// FILE: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Les variables sont définies dans index.css
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
        },
        accent: "var(--color-accent)",
        surface: "var(--color-surface)", // Pour les cartes sur fond sombre
        border: "var(--color-border)",   // Bordures harmonisées
      },
      boxShadow: {
        'glow': '0 0 20px var(--color-secondary-glow)',
        'soft': "0 10px 40px -10px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2.5rem",
        "4xl": "4rem",
      },
      fontSize: {
        "xs": "0.85rem",
        "sm": "0.95rem",
        "base": "1.05rem",
        "lg": "1.15rem",
        "xl": "1.3rem",
        "2xl": "1.6rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
        "huge": ["clamp(3rem, 10vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'drive': 'drive 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drive: {
          '0%': { transform: 'translateX(-20%) opacity(0)' },
          '10%': { opacity: '0.1' },
          '90%': { opacity: '0.1' },
          '100%': { transform: 'translateX(120%) opacity(0)' },
        }
      }
    },
  },
  plugins: [],
};