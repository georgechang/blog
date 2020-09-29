module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: 'true',
    mode: 'all',
    content: ['./layouts/**/*.html'],
  },
  theme: {
    extend: {
      maxWidth: {
        '1/3': '33%',
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
