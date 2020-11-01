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
    typography: {
      default: {
        css : {
          maxWidth: '72ch',
          pre: {
            marginTop: '0',
            marginBottom: '0',
            maxWidth: 'calc(100vw - 2rem)'
          },
          ol: {
            marginTop: '0',
            marginBottom: '0',
          },
          a: {
              wordBreak: 'break-word'
            },
          h2: {
            marginTop: '1rem'
          },

          'code::before': {
            content: ''
          },

          'code::after': {
            content: ''
          },

          'blockquote p:first-of-type::before': {
            content: ''
          },
          'blockquote p:last-of-type::after': {
            content: ''
          },
        }
      }
    },
    extend: {
      maxWidth: {
        '1/3': '33%',
        '1/2': '50%',
        '2/3': '66%',
        'full-border': 'calc(100vw - 4rem)',
        'full-border-sm': 'calc(100vw - 2rem)',
        'full-border-lg': 'calc(100vw - 6rem)',
        'full-text': '72ch'
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
