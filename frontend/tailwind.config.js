/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'anti-flash_white':
        {
          DEFAULT: '#ffffff',
          100: '#fafaf9',
        },
        'primary':
        {
          DEFAULT: '#e8471e',
          500: '#ff8566',
          100: '#ffedd5',
        },
        'secondary':
        {
          DEFAULT: '#B8CE12',
          500: '#16a34a',
          100: '#dcfce7',
        },
        'tertiary':
        {
          DEFAULT: '#a16207',
          500: '#facc15',
          100: '#fef9c3',
        },
        'quaternary':
        {
          DEFAULT: '#06b6d4',
          500: '#67e8f9',
          100: '#cffafe'
        },
        'crema':
        {
          DEFAULT: '#1c1917',
          200: '#e7e5e4',
          500: '#a8a29e',
          800: '#292524'
        }

      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-bricolage)', 'cursive']
      },
    },

  },
  plugins: [],
}
