  /** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')
const flowbite = require("flowbite-react/tailwind");


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    avatarSize: {
      sm: '3rem',
      md: '6rem',
      lg: '10rem',
      xl: '12rem',
    },
    fontFamily: {
      'Rubik': ['monkshadow-title', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
    },
    fontSize: {
      xs: '10px ',
      sm: '12px ',
      md: '14px ',
      lg: '16px ',
      xl: '20px ',
      xxl: '36px ',
    },
    screens: {
      // 'xxs': '320px',
      // 'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1260px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        mainBg: "#F8F7FA",
        cardBg: "#ffffff",
        accent: "#F05F23",
        lightAccent: "#FCDDD0",
        darkAccent: "#C03A03",
        primaryText: "#444050",
        secondaryText: "#848484",
        lightText: "#AFADB4",
        placeHolder: "#E1E1E1",
        safeGreen: "#00A329",
        lightGreen: "#D2F6E1",
        dangerRed: "#FF2023",
        lightRed: "#FF787A",
        border: "#E1E1E1",
        menuActive: "#EFEEF0",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { filter: 'drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #27a8c9) hue-rotate(220deg) invert(1)', opacity: '0.1', transform: 'scale(0.95) translate(0px,12px)' },
          '50%': { filter: 'drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #7f25ba) drop-shadow(2px 4px 6px #27a8c9) hue-rotate(120deg) invert(1)', opacity: '0.05', transform: 'scale(1) translate(0px, 0px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 3s linear infinite'
      },
      gridColumn: {
        'span-1.5': 'span 1.5 / span 1.5',
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      }
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',  /* 0.125rem = 2px */
      1: '0.25rem',  /* 0.25rem = 4px */
      1.5: '0.375rem',  /* 0.375rem = 6px */
      2: '0.5rem', /* 0.5rem = 8px */
      2.5: '0.625rem', /* 0.625rem = 10px */
      3: '0.75rem', /* 0.75rem = 12px */
      3.5: '0.875rem', /* 0.875rem = 14px */
      4: '1rem', /* 1rem = 16px */
      4.5: '1.125rem', /* 1.125rem= 18px */
      5: '1.25rem', /* 1.25rem = 20px */
      5.5: '1.375rem', /* 1.375rem = 22px */
      6: '1.5rem',  /* 1.5rem = 24px */
      6.5: '1.625rem',  /* 1.625rem = 26px */
      7: '1.75rem',  /* 1.75rem = 28px */
      7.5: '1.875rem',  /* 1.875rem = 30px */
      8: '2rem', /* 2rem = 32px */
      8.5: '2.125rem', /* 2.125rem= 34px */
      9: '2.25rem', /* 2.25rem = 36px */
      9.5: '2.375rem', /* 2.375rem = 38px */
      10: '2.5rem',  /* 2.5rem = 40px */
      10.5: '2.625rem',  /* 2.625rem = 42px */
      11: '2.75rem',  /* 2.75rem = 44px */
      11.5: '2.875rem',  /* 2.875rem = 46px */
      12: '3rem', /* 3rem = 48px */
      12.5: '3.125rem', /* 3.125rem= 50px */
      13: '3.25rem', /* 3.25rem = 52px */
      13.5: '3.375rem', /* 3.375rem = 54px */
      14: '3.5rem',  /* 3.5rem = 56px */
      14.5: '3.625rem',  /* 3.625rem = 58px */
      15: '3.75rem',  /* 3.75rem = 60px */
      15.5: '3.875rem',  /* 3.875rem = 62px */
      16: '4rem', /* 4rem = 64px */
      16.5: '4.125rem', /* 4.125rem= 66px */
      17: '4.25rem', /* 4.25rem = 68px */
      17.5: '4.375rem', /* 4.375rem = 70px */
      18.5: '4.5rem',  /* 4.5rem = 72px */
      18.5: '4.625rem',  /* 4.625rem = 74px */
      19: '4.75rem',  /* 4.75rem = 76px */
      19.5: '4.875rem',  /* 4.875rem = 78px */
      20: '5rem', /* 5rem = 80px */
      24: '6rem',  /* 6rem = 96px */
      25: '6.25rem', /* 6.25rem = 100px */
      28: '7rem', /* 7rem = 112px */
      32: '8rem',/* 8rem = 128px */
      36: '9rem', /* 9rem = 144px */
      37: '9.375rem', /* 9.375rem = 150px */
      40: '10rem', /* 10rem = 160px */
      44: '11rem', /* 11rem = 176px */
      47: '11.25rem', /* 11.375rem = 180px */
      48: '12rem',  /* 12rem = 192px */
      50: '12.5rem',  /* 12.5rem = 200px */
      52: '13rem', /* 13rem = 208px */
      56: '14rem', /* 14rem = 224px */
      60: '15rem',  /* 15rem = 240px */
      65: '15.625rem',  /* 15.625rem = 250px */
      64: '16rem',  /* 16rem = 256px */
      72: '18rem',  /* 18rem = 288px */
      80: '20rem',  /* 20rem = 320px */
      96: '24rem',  /* 24rem = 384px */
      100: '25rem',  /* 25rem = 400px */
    },
    iconSize: {
      // sm: '20px',
      // md: '24px',
      // lg: '32px',
      // xl: '46px',

      sm: '16px',
      md: '18px',
      lg: '24px',
      xl: '32px',
      xxl: '36px',
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          avatar: (value) => ({
            width: value,
            height: value,
            borderRadius: '100px',
            boxShadow: theme('boxshadow.md')
          }),
        },
        { values: theme('avatarSize') }
      )

      matchUtilities(
        {
          icon: (value) => ({
            width: value,
            height: value,
          }),
        },
        { values: theme('iconSize') }
      )
    }),
    plugin(function ({ addComponents }) {
      addComponents({
        '.container-card': {
          backgroundclip: 'padding-box',
          background: 'linear-gradient(71deg, #080509, #1a171c, #080509)'
        },
        ' .bg-green-box': {
          "&:after": {
            background: 'linear-gradient(71deg, #0d1212, #3da077, #0d1212)'
          }
        },
        '.bg-white-box': {
          "&:after": {
            background: 'linear-gradient(71deg, #121013, #b0afb0, #121013)'
          }
        },
        '.bg-yellow-box': {
          "&:after": {
            background: 'linear-gradient(71deg, #110e0e, #afa220, #110e0e)'
          }
        },
        '.bg-blue-box': {
          "&:after": {
            background: 'linear-gradient(71deg, #0c0a0e, #5f6fad, #0c0a0e)'
          }
        },
      })
    }),
    // plugin(function({matchComponents, theme}){
    //   matchComponents(
    //     {
    //       icon: (value) => ({
    //         width: value,
    //         height: value,
    //       }),
    //     },
    //     {
    //       value: theme('iconSize')
    //     }
    //   )
    // })
  ],
}

