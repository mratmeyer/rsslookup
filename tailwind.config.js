module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        'hero': '1.15',
      },
    },
    fontFamily: {
      sans: ["Inter"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
