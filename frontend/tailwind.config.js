/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  
  theme: {
    screens: {
      'xs': '475px',     // telefoane mari
      'sm': '640px',     // tablete mici
      'md': '768px',     // laptop-uri mici
      'lg': '1024px',    // desktop-uri
      'xl': '1280px',    // ecrane mari
      '2xl': '1536px',   // ecrane foarte mari
      '3xl': '1920px',   // ultra-wide
    },
    
    extend: {
      colors: {
        // Culorile tale pentru Forest Guardian
        'forest-dark': '#2D5016',
        'forest-medium': '#4A7C59',
        'forest-light': '#A8D8A8',
        'sky-blue': '#87CEEB',
        'earth-brown': '#8B4513',
        'cream-bg': '#F5F5DC',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}