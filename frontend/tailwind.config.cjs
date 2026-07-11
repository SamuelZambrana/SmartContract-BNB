/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          50: '#f5f0ff',
          100: '#ebe0ff',
          200: '#d4b8ff',
          300: '#c090f8',
          400: '#b070f0',
          500: '#a05ee8',
          600: '#8b4ad4',
          700: '#7138b0',
          800: '#5a2c8c',
          900: '#3d1e60',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          50: '#f8f7fb',
          100: '#f1eff6',
          200: '#e4e0ed',
          300: '#c9c2d9',
          400: '#9a91b0',
          500: '#6f6685',
          600: '#524a66',
          700: '#3d3650',
          800: '#292436',
          900: '#17141f',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        nm: '0 8px 30px rgba(176, 112, 240, 0.18)',
        'nm-sm': '0 4px 14px rgba(176, 112, 240, 0.12)',
      },
    },
  },
  plugins: [
    // Official Tailwind CSS plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/aspect-ratio'),

    // Community plugins
    require('tailwindcss-animate'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwind-motionkit')({
      classes: ['fadeIn', 'fadeOut', 'slideInUp', 'slideInDown', 'zoomIn'],
      duration: '1s',
      delay: '500ms',
      iterationCount: '1',
    }),
  ],
}
