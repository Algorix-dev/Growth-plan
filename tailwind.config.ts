import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				bebas: ['var(--font-bebas)', 'sans-serif'],
				mono: ['var(--font-mono)', 'monospace'],
				serif: ['var(--font-serif)', 'serif'],
			},
			colors: {
				bg: {
					base: 'var(--bg-base)',
					surface: 'var(--bg-surface)',
					elevated: 'var(--bg-elevated)',
					muted: 'var(--bg-muted)',
				},
				gold: {
					DEFAULT: 'var(--gold)',
					light: 'var(--gold-light)',
					dim: 'var(--gold-dim)',
				},
				blue: 'var(--blue)',
				purple: 'var(--purple)',
				green: 'var(--green)',
				red: 'var(--red)',
				teal: 'var(--teal)',
				orange: 'var(--orange)',
				pink: 'var(--pink)',
				background: 'var(--bg-base)',
				foreground: 'var(--text)',
				card: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--text)'
				},
				popover: {
					DEFAULT: 'var(--bg-elevated)',
					foreground: 'var(--text)'
				},
				primary: {
					DEFAULT: 'var(--gold)',
					foreground: '#000000'
				},
				secondary: {
					DEFAULT: 'var(--bg-muted)',
					foreground: 'var(--text)'
				},
				muted: {
					DEFAULT: 'var(--bg-muted)',
					foreground: 'var(--text-muted)'
				},
				accent: {
					DEFAULT: 'var(--gold-dim)',
					foreground: 'var(--gold)'
				},
				border: 'var(--border)',
				'border-2': 'var(--border-2)',
				input: 'var(--bg-muted)',
				ring: 'var(--gold)',
			},
			borderRadius: {
				lg: '14px',
				md: '10px',
				sm: '4px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
