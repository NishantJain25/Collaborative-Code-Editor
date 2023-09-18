/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'pastel-blue': "#c6def1",
        'pastel-green': "#c9e4de",
      },
      boxShadow: {
        'custom-black': "5px 5px 0 black",
        'slider-shadow': "-10px 0 0 0 rgb(148 163 184 )"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        main: "2.4fr 1fr",
      },
    },
  },
  plugins: [],
}
