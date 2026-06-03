import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        'surface-2': '#1A1A24',
        'surface-3': '#22222F',
        card: { DEFAULT: 'var(--color-surface)', foreground: 'var(--color-foreground)' },
        muted: { DEFAULT: 'var(--color-muted)', foreground: 'var(--color-muted-foreground)' },
        // <alpha-value> enables bg-primary/20, text-primary/60, border-primary/30, etc.
        primary: {
          DEFAULT: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
          foreground: 'var(--color-primary-foreground)',
        },
        accent: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        'accent-hover': '#5A52E8',
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary-rgb) / <alpha-value>)',
          foreground: 'var(--color-secondary-foreground)',
          hover: '#00B896',
        },
        'secondary-hover': '#00B896',
        ring: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        border: 'var(--color-border)',
        input: 'var(--color-muted)',
        'text-primary': 'var(--color-foreground)',
        'text-secondary': 'rgba(255,255,255,0.6)',
        'text-muted': 'rgba(255,255,255,0.35)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        'gradient-card': 'linear-gradient(145deg, rgb(var(--color-primary-rgb) / 0.1), rgb(var(--color-secondary-rgb) / 0.05))',
        'gradient-dark': 'linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, rgb(var(--color-primary-rgb) / 0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgb(var(--color-primary-rgb) / 0.4)',
        'glow-secondary': '0 0 20px rgb(var(--color-secondary-rgb) / 0.4)',
        'glow-success': '0 0 20px rgba(34,197,94,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
        'modal': '0 25px 80px rgba(0,0,0,0.8)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'count-up': 'countUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(34,197,94,0.4), 0 0 20px rgba(34,197,94,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(34,197,94,0.7), 0 0 40px rgba(34,197,94,0.4)' },
        },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        countUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      spacing: { '18': '4.5rem', '22': '5.5rem', '30': '7.5rem' },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};

export default config;
