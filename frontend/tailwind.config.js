/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: { 'anti-flash_white': { DEFAULT: '#f3f2ef', 100: '#37342a', 200: '#6e6853', 300: '#a19982', 400: '#cac6b9', 500: '#f3f2ef', 600: '#f6f6f3', 700: '#f8f8f6', 800: '#fbfaf9', 900: '#fdfdfc'}, 'kelly_green': { DEFAULT: '#5da414', 100: '#122104', 200: '#254108', 300: '#37620c', 400: '#498310', 500: '#5da414', 600: '#7cde1b', 700: '#9de951', 800: '#bef18b', 900: '#def8c5' }, 'ebony': { DEFAULT: '#465136', 100: '#0e100b', 200: '#1c2015', 300: '#293020', 400: '#37402a', 500: '#465136', 600: '#6c7d53', 700: '#92a477', 800: '#b7c3a4', 900: '#dbe1d2' }, 'night': { DEFAULT: '#0a0a0a', 100: '#020202', 200: '#040404', 300: '#060606', 400: '#080808', 500: '#0a0a0a', 600: '#3b3b3b', 700: '#6c6c6c', 800: '#9d9d9d', 900: '#cecece' } },
			fontFamily: {
				sans: ['var(--font-inter)', 'sans-serif'],
				heading: ['var(--font-bricolage)', 'cursive']
			  },
		},

	},
	plugins: [],
}