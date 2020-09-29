module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    mode: 'all',
    content: ['./layouts/**/*.html'],
    options: {
      whitelist: ['pagination', 'page-item', 'page-link', 'disabled', 'active'],
    }
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
