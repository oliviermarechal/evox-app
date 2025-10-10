/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'evox-bg': '#0F0F10',
        'evox-accent': '#FF2E2E',
        'evox-text': '#F4F4F4', 
        'evox-secondary': '#00E0FF',
        'evox-gray': '#1A1A1A',
        'evox-border': '#333333',
      }
    },
  },
  plugins: [],
}