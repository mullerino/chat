import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5D5FEF',  // Azul violeta principal (botões, header)
        'primary-dark': '#3F51B5',  // Variante mais escura do primary
        secondary: '#7879F1', // Fundo das mensagens recebidas
        accent: '#7C3AED', // Botão de enviar (hover/acento)
        background: '#F9FAFB',  // Cor de fundo geral
        surface: '#FFFFFF', // Cartões, chats, mensagens
        border: '#E5E7EB', // Linhas divisórias
        'text-primary': '#1F2937',  // Títulos
        'text-secondary': '#6B7280',  // Subtítulos, informações de apoio
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
