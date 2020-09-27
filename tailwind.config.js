module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'all',
    content: ['./**/layouts/**/*.html'],
  },
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
        '2/3': '66%'
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
