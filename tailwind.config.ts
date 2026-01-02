import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dora Patisserie brand colors
        rose: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7894',
          500: '#e14b71',
          600: '#cd2a57',
          700: '#ac1f47',
          800: '#8f1c3f',
          900: '#7a1b3a',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf3e6',
          300: '#f5e8d3',
          400: '#edd5b3',
          500: '#e3be8f',
          600: '#d4a06a',
          700: '#c08350',
          800: '#9d6a43',
          900: '#805739',
        },
        gold: {
          50: '#fdfaeb',
          100: '#faf3c8',
          200: '#f5e58c',
          300: '#efd250',
          400: '#e9be23',
          500: '#d9a516',
          600: '#bb7f10',
          700: '#965c11',
          800: '#7b4915',
          900: '#693c17',
        },
        brown: {
          50: '#f9f6f3',
          100: '#f1ebe3',
          200: '#e2d5c6',
          300: '#cfb9a1',
          400: '#ba977a',
          500: '#ab7f61',
          600: '#9e6e55',
          700: '#835948',
          800: '#6b4a3e',
          900: '#4a3728',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
