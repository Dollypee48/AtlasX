/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        atlasx: {
          bg: '#020617',
          bgAlt: '#02081b',
          surfaceSoft: '#020617',
        },
        solana: {
          main: '#020617',
          card: '#020617',
        },
        atlasxBorder: '#1f2937',
        atlasxBorderSoft: 'rgba(148, 163, 184, 0.28)',
        brand: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
        },
        'brand-purple': '#6366f1',
        text: {
          primary: '#e5e7eb',
          secondary: '#9ca3af',
          muted: '#6b7280',
          inverse: '#020617',
        },
        profit: '#22c55e',
        loss: '#f97373',
      },
      boxShadow: {
        'card-soft': '0 22px 45px rgba(15, 23, 42, 0.8)',
        'glow-green': '0 0 26px rgba(34, 197, 94, 0.45)',
        'glow-purple': '0 0 26px rgba(129, 140, 248, 0.5)',
      },
      borderColor: {
        'atlasx-border': '#1f2937',
        'atlasx-borderSoft': 'rgba(148, 163, 184, 0.28)',
      },
      backgroundImage: {
        'solana-main':
          'radial-gradient(circle at top, rgba(56,189,248,0.16), transparent 55%), radial-gradient(circle at bottom, rgba(129,140,248,0.18), #020617)',
      },
    },
  },
  plugins: [],
}
