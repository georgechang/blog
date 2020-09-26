module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    ['./layouts/**/*.html']
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
