/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales basados en las imágenes de referencia
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8B5FBF', // Color principal púrpura
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#6366F1', // Color secundario azul
          600: '#3b82f6',
          700: '#2563eb',
          800: '#1d4ed8',
          900: '#1e40af',
        },
        dark: {
          primary: '#0a0a1a',    // Fondo principal oscuro
          secondary: '#050510',   // Fondo más oscuro para secciones
          card: 'rgba(15, 15, 30, 0.8)', // Fondo glass para cards
        },
        glass: {
          bg: 'rgba(15, 15, 30, 0.8)',
          border: 'rgba(139, 95, 191, 0.2)',
          hover: 'rgba(139, 95, 191, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 95, 191, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 95, 191, 0.6)' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        'glass': '20px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8B5FBF, #6366F1)',
        'gradient-glass': 'linear-gradient(135deg, rgba(139, 95, 191, 0.1), rgba(99, 102, 241, 0.1))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 95, 191, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 95, 191, 0.4)',
        'glow-purple': '0 10px 20px rgba(139, 95, 191, 0.25)',
        'glow-blue': '0 10px 20px rgba(99, 102, 241, 0.25)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      borderColor: {
        'glass': 'rgba(139, 95, 191, 0.2)',
        'glass-hover': 'rgba(139, 95, 191, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin personalizado para utilidades glass
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-card': {
          background: 'rgba(15, 15, 30, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 95, 191, 0.2)',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        '.glass-card:hover': {
          borderColor: 'rgba(139, 95, 191, 0.4)',
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 40px rgba(139, 95, 191, 0.15)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #8B5FBF 0%, #6366F1 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.btn-gradient': {
          background: 'linear-gradient(135deg, #8B5FBF 0%, #6366F1 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
        },
        '.btn-gradient:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 20px 40px rgba(139, 95, 191, 0.25)',
        },
        '.hero-illustration': {
          background: 'linear-gradient(135deg, rgba(139, 95, 191, 0.1), rgba(99, 102, 241, 0.1))',
          border: '1px solid rgba(139, 95, 191, 0.2)',
          backdropFilter: 'blur(20px)',
        },
        '.nav-backdrop': {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
        '.animate-on-scroll': {
          opacity: '0',
          transform: 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        '.animate-slide-up': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}