// FILE: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: { 

      // ======================
      // COLORS SYSTEM
      // ======================
      colors: {
        primary: {
          DEFAULT: "#002E1B", // vert principal
          light: "#0A3D2A",
          dark: "#00140C",
        },

        secondary: {
          DEFAULT: "#B08D3E", // doré accent
          light: "#FFF7D6",
        },

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        background: "#F8FAFC",
        card: "#FFFFFF",
        muted: "#94A3B8",
      },

      // ======================
      // SHADOW SYSTEM
      // ======================
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)",
        card: "0 2px 10px rgba(0,0,0,0.06)",
      },

      // ======================
      // BORDER RADIUS
      // ======================
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      // ======================
      // FONT SIZE (UI SCALE CLEAN)
      // ======================
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
    },
  },

  plugins: [],
};