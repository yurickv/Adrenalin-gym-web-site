/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        main: '#f97316', //#F67831
        hover: '#EB3C5A',
        hoverBlack: '#C2C2C2',
        mainText: '#737373', //neutral-500
        mainTextBlack: '#d4d4d4', //neutral-300
        mainTitle: '#171717', //neutral-900
        mainTitleBlack: '#fafafa', //neutral-50
        background: '#ECECEC;',
        backgroundBlack: '#5F5C5D',
        darkBody: '#5F5C5D',
        'txt-accent': '#0A0A0A',
        'grey-bg': '#F5F5F5',
        error: '#E53935',
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        rounded: '4px',
        md: '6px',
        lg: '8px',
        'pre-xl': '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
      fontFamily: {
        poppins: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      screens: {
        sm: '320px',
        md: '768px',
        lg: '1280px',
        xl: '1440px',
      },
      backgroundImage: {
        'hero-bg':
          'linear-gradient(to right, rgba(46, 47, 66, 0.5), rgba(46, 47, 66, 0.5))', //, url('/bg-hero.webp')
        'calc-bg':
          'linear-gradient(to right, rgba(219, 219, 219, 0.5), rgba(219, 219, 219, 0.5)) ',
        'calc-bg-woman': "url('/woman.webp')",
        'pay-bg': "url('/bg-payment.webp')",
        'orange-gradient':
          'linear-gradient(277deg, #F97316 -5.07%, #EF4444 84.13%)',
      },
      listStyleImage: {
        checkmark: 'url("/chack.png")',
      },

      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
