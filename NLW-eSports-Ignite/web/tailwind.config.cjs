/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // onde vai ter classes do tailwind todas as pastas dentro de 
    // src e todos os arquivos terminados em tsx
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    extend: {      
      backgroundImage: {
        galaxy: "url('/Fundo.png')",
        'gradient': 'linear-gradient(90deg, #9572FC 25.00%, #43E7AD 75.00%, #E1D55D 5.00%)',
        'game-gradient' : ' linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 67.08%)'
      }
    },
  },
  plugins: [],
}