/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')], // Add NativeWind preset
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
