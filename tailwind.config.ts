import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#0D1B2A',
          light: '#1A2F45',
          lighter: '#243B55',
        },
        coral: {
          DEFAULT: '#E84855',
          dark: '#C73641',
          light: '#FF6B75',
        },
        sand: '#F5F0E8',
        emerald: '#2D6A4F',
        muted: '#8B9BB4',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0,0,0,0.2)',
        md: '0 4px 24px rgba(0,0,0,0.3)',
        lg: '0 8px 40px rgba(0,0,0,0.4)',
        coral: '0 4px 20px rgba(232,72,85,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
