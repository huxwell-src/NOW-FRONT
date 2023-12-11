/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f2f8fd',
          '100': '#e4effa',
          '200': '#c3dff4',
          '300': '#8fc5ea',
          '400': '#53a7dd',
          '500': '#2980b9',
          '600': '#1e6fab',
          '700': '#19598b',
          '800': '#194c73',
          '900': '#1a4060',
          '950': '#112940',
        },
      },
      boxShadow: {
        'custom': 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
      },
    },
  },
  plugins: [],
};
