import type { Config } from "tailwindcss";
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Extend or override Tailwind default colors
        gray: colors.zinc,
        blue: colors.sky,
        red: colors.rose,
        yellow: colors.amber,
        purple: colors.violet,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'slow-pulse-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-fade': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'spin-slow-reverse': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(-360deg)' },
        },
        'fade-in-out': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.2' },
        }
      },
      animation: {
        'slow-pulse-gradient': 'slow-pulse-gradient 20s ease-in-out infinite alternate',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'pulse-fade': 'pulse-fade 1.8s ease-in-out infinite',
        'spin-slow-reverse': 'spin-slow-reverse 60s linear infinite',
        'fade-in-out': 'fade-in-out 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
