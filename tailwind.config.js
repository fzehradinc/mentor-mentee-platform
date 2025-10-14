/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark mode (mentörler sayfası için)
        base: {
          bg: '#0b0c0f',       // koyu arka plan
          soft: '#121418',
          panel: '#151821',
        },
        // Light mode (dashboard'lar için)
        light: {
          bg: '#f7f8fb',       // açık gri arka plan
          card: '#ffffff',
          border: '#e5e7eb',
        },
        text: {
          high: '#e6e8ec',     // dark mode
          dim: '#a6adbb',
          subtle: '#7c8394',
          // Light mode
          primary: '#1f2937',  // koyu gri metin
          secondary: '#6b7280', // orta gri
          tertiary: '#9ca3af', // açık gri
        },
        border: {
          subtle: '#1f2430',   // dark
          light: '#e5e7eb',    // light
        },
        brand: {
          primary: '#2563eb',  // mavi (TEK AKSAN)
          hover: '#1d4ed8',
          ring: '#3b82f6',
        },
        success: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
        // Eski renkler (geriye uyumluluk)
        accent: {
          primary: '#2563eb',
          warm: '#f59e0b',
          mint: '#22c55e',
        }
      },
      boxShadow: {
        subtle: '0 1px 0 0 rgba(255,255,255,0.06) inset',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        xl2: '14px',
      }
    },
  },
  plugins: [],
};
