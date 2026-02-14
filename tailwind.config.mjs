/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        atlasx: {
          bg: '#020617',
          bgAlt: '#050816',
          surface: '#020617',
          surfaceSoft: '#020818',
          surfaceElevated: '#02091f',
          border: '#111827',
          borderSoft: '#0b1220',
          borderStrong: '#1f2937',
        },
        // Brand / Solana-inspired accents
        brand: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#15803D',
          purple: '#8B5CF6',
        },
        // Financial semantics
        profit: {
          DEFAULT: '#22C55E',
          soft: '#022C22',
          muted: '#16A34A',
        },
        loss: {
          DEFAULT: '#F97373',
          soft: '#2A0B0F',
          muted: '#F87171',
        },
        neutral: {
          DEFAULT: '#9CA3AF',
          soft: '#02091A',
        },
        warning: {
          DEFAULT: '#FACC15',
          soft: '#3B2703',
        },
        info: {
          DEFAULT: '#38BDF8',
          soft: '#032538',
        },
        // Text hierarchy
        text: {
          primary: '#E5E7EB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
          disabled: '#4B5563',
          inverse: '#020617',
        },
        // Chart palette
        chart: {
          pnl: '#22C55E',
          pnlAlt: '#4ADE80',
          drawdown: '#F97373',
          volume: '#38BDF8',
          fee: '#F97316',
          long: '#22C55E',
          short: '#F97373',
          grid: '#1F2933',
          axis: '#9CA3AF',
        },
        // UI states
        state: {
          hover: '#0B1220',
          active: '#111827',
          focus: '#22C55E',
        },
      },
      backgroundImage: {
        solana-main:
          'radial-gradient(circle at top left, rgba(139,92,246,0.32), transparent 55%), radial-gradient(circle at top right, rgba(34,197,94,0.28), transparent 55%)',
        solana-card:
          'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(3,7,18,0.98))',
      },
      boxShadow: {
        'card-soft':
          '0 18px 40px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)',
        'glow-green': '0 0 22px rgba(34,197,94,0.45)',
        'glow-purple': '0 0 24px rgba(139,92,246,0.42)',
      },
      ringColor: {
        brand: '#22C55E',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

