/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ED1C24',
          dark: '#9C1C21',
          light: '#FFE8E8',
        },
        secondary: {
          DEFAULT: '#12B669',
          light: '#ECFDF3',
        },
        success: '#00AA00',
        warning: '#FF9900',
        error: '#FF3B30',
        info: '#0066CC',
        gray: {
          100: '#F5F5F8',
          200: '#EFEFEF',
          300: '#DCDCE6',
          400: '#ABACC2',
          500: '#7B7D9D',
          600: '#555777',
          700: '#27273E',
        },
        text: {
          primary: '#27273E',
          secondary: '#7B7D9D',
          tertiary: '#ABACC2',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
