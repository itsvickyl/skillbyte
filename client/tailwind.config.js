/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          darkGreen: '#075E54',
          teal: '#128C7E',
          blue: '#34B7F1',
          bg: '#f0f2f5',
          chatBg: '#efeae2',
          bubbleSelf: '#d9fdd3',
          bubbleOther: '#ffffff',
          panelBg: '#f0f2f5',
          textPrimary: '#111b21',
          textSecondary: '#667781',
          
          // Dark Mode Hues (for high fidelity dark themes)
          darkBg: '#0c1317',
          darkChatBg: '#0b141a',
          darkPanelBg: '#202c33',
          darkBubbleSelf: '#005c4b',
          darkBubbleOther: '#202c33',
          darkTextPrimary: '#e9edef',
          darkTextSecondary: '#8696a0'
        }
      },
      backgroundImage: {
        'whatsapp-pattern': "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"
      }
    },
  },
  plugins: [],
}
