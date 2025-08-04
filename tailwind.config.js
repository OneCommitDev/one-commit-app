/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
       colors: {
        primary: '#235D48',
        secondary: '#F5A623',
        danger: '#E3342F',
        background: '#F5F5F5',

        introTtilecolor : '#313A34',
        introContentcolor : '#647067',

        title : '#313A34',
        light : '#647067',
        border_color : '#6C9284',
        graylight : '#E3E4E3',
      },
      fontSize: {
        splashtitle : 30,
        splashSubTitle : 16,
        introWelcomtitle : 24,
        tiny: 10,
        base: 14,
        btntextsize : 18,
        8: 8,
        12 : 12,
        16 : 16,
        18 : 18,
        20 : 20,
        24 : 24,
        26: 26,
        28 : 28,
        30: 30,
      },
      fontFamily: {
       sans: ['Inter', 'System'],
       nunitoextrabold: ['Nunito-ExtraBold'],
       nunitoregular: ['Nunito-Regular'],  
       nunitosemibold: ['Nunito-SemiBold'],
      },
      spacing: {
        'btn': 12,
        'card': 16,
        'icon': 24,
        'img-sm': 40,
        'img-md': 80,
        'img-lg': 120,
      },
    margin: {
      15: 15,
      20: 20,
       30: 30,
       50 : 50,
    },
      borderRadius: {
        xl: 20,
        pill: 9999,
      },
      borderColor: {
         primary: '#318264',
  },
    },
  },
  plugins: [],
};
