// FILE: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: { 

      // ======================
      // COLORS SYSTEM
      // ======================
      colors: {
        // ========== VERT + DORE =============

        // primary: {
        //   DEFAULT: "#002E1B", // vert principal
        //   light: "#0A3D2A",
        //   dark: "#00140C",
        // },

        // secondary: {
        //   DEFAULT: "#B08D3E", // doré accent
        //   light: "#FFF7D6",
        // },

        // ============= BLEU NUIT + EMERAUDE
        // primary: {
        //   DEFAULT: "#0F172A", // Slate très sombre (Bleu Nuit)
        //   light: "#1E293B",
        //   dark: "#020617",
        // },
        // secondary: {
        //   DEFAULT: "#10B981", // Émeraude vibrant (l'accent "Tech")
        //   light: "#D1FAE5",
        // },

        // ============ NOIR + GRIS =================
        // primary: {
        //   DEFAULT: "#111111", // Noir profond
        //   light: "#222222",
        //   dark: "#000000",
        // },
        // secondary: {
        //   DEFAULT: "#64748B", // Gris ardoise/acier
        //   light: "#F1F5F9",
        // },

        // ============= VIOLET + ROSE ===================
        primary: {
          DEFAULT: "#2D1B4E", // Violet Royal très sombre
          light: "#3D2B5E",
          dark: "#1A0F2E",
        },
        secondary: {
          DEFAULT: "#F43F5E", // Rose Corail (donne énormément de "peps")
          light: "#FFF1F2",
        },

      //   success: "#10B981",
      //   warning: "#F59E0B",
      //   danger: "#EF4444",

      //   background: "#F8FAFC",
      //   card: "#FFFFFF",
      //   muted: "#94A3B8",
      // },

      // ============== BLEU CYAN + BLEU ARDOISE =========================
      // primary: {
      //   DEFAULT: "#0F172A", // Un bleu ardoise très sombre (presque noir) pour le côté chic
      //   light: "#1E293B",
      //   dark: "#020617",
      // },

      // secondary: {
      //   DEFAULT: "#06B6D4", // Le Cyan vibrant (Cyan 500 de Tailwind)
      //   light: "#CFFAFE",   // Pour les fonds d'étiquettes ou halos
      // },

      success: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",

      background: "#F8FAFC", // Un gris bleuté très clair pour le fond de page
      card: "#FFFFFF",
      muted: "#64748B",
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
        xs: "0.95rem",
        sm: "1rem",
        base: "1.1rem",
        lg: "1.25rem",
        xl: "1.4rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },

      // ===============================
      // CONFIGURATION DE LA TYPOGRAPHIE
      // ===============================
      fontFamily: {
        // Pour les titres, les KPI, et le côté "chic/italique"
        display: ['"Inter"', 'system-ui', 'sans-serif'], 
        // Pour le corps de texte et les données
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },

  plugins: [],
};