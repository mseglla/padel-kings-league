/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        ring: "0 0 0 3px rgba(59,130,246,0.25)"
      },
      borderRadius: {
        xl: "14px"
      }
    }
  },
  plugins: []
};
