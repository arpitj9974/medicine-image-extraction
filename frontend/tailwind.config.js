/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch design tokens
        app: {
          bg: '#0F172A',           // slate-900
          surface: '#1E293B',      // slate-800
          surfaceHover: '#334155', // slate-700
          border: '#334155',       // slate-700
          primary: '#3B82F6',      // blue-500
          primaryHover: '#2563EB', // blue-600
          success: '#10B981',      // emerald-500
          successBg: 'rgba(16, 185, 129, 0.1)',
          warning: '#F59E0B',      // amber-500
          warningBg: 'rgba(245, 158, 11, 0.1)',
          textMain: '#F8FAFC',     // slate-50
          textMuted: '#94A3B8',    // slate-400
        },
        // Keep legacy tokens so existing code doesn't break
        navy: '#0F172A',
        slateBlue: '#1E293B',
        electric: '#3B82F6',
        emerald: '#10B981',
        amber: '#F59E0B',
        failed: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
