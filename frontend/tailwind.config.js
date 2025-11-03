/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--bg-card)",
        text: {
          main: "var(--text-main)",
          muted: "var(--text-muted)",
        },
        accent: "var(--accent)",
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 1vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 1.2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 1.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.25rem, 2vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 2.5vw, 2rem)',
        'fluid-2xl': 'clamp(2rem, 3.5vw, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 4vw, 4rem)',
        'fluid-4xl': 'clamp(3rem, 5vw, 5rem)',
        'fluid-5xl': 'clamp(4rem, 6vw, 6rem)', 
        'fluid-6xl': 'clamp(5rem, 8vw, 7rem)', // nouvelle taille hero
        'fluid-7xl': 'clamp(6rem, 8vw, 7rem)',
      },
      spacing: {
        'fluid-1': 'clamp(0.25rem, 0.5vw, 0.5rem)',
        'fluid-2': 'clamp(0.5rem, 1vw, 0.75rem)',
        'fluid-4': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-8': 'clamp(2rem, 4vw, 3rem)',
        'fluid-12': 'clamp(3rem, 6vw, 4.5rem)',
        'fluid-16': 'clamp(4rem, 8vw, 6rem)',
        'fluid-24': 'clamp(6rem, 10vw, 8rem)',
        'fluid-32': 'clamp(8rem, 12vw, 10rem)',
      },
      boxShadow: {
        card: "0 4px 20px rgba(127, 207, 127, 0.2)",
      },
    },
  },
  plugins: [typography],
};
