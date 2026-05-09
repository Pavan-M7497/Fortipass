export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        fortiblue: '#40b7ff',
        fortipurple: '#9155ff',
        fortidark: '#060a16',
        fortiblack: '#090b14',
        cyber: {
          cyan: '#22d3ee',
          magenta: '#e879f9',
          green: '#34d399',
        },
      },
      boxShadow: {
        glass: '0 20px 70px rgba(16, 34, 74, 0.35)',
        neon: '0 0 35px rgba(64, 183, 255, 0.2)',
        'neon-strong': '0 0 45px rgba(64, 183, 255, 0.35), 0 0 90px rgba(145, 85, 255, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top, rgba(64, 183, 255, 0.18), transparent 45%), radial-gradient(circle at right, rgba(145, 85, 255, 0.18), transparent 28%), linear-gradient(180deg, #050816 0%, #090d18 100%)',
        'mesh-gradient':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(64, 183, 255, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(145, 85, 255, 0.2), transparent), radial-gradient(ellipse 50% 30% at 0% 100%, rgba(34, 211, 238, 0.12), transparent)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-12px) translateX(4px)' },
          '66%': { transform: 'translateY(6px) translateX(-6px)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '0.5', filter: 'blur(40px)' },
          '50%': { opacity: '0.85', filter: 'blur(48px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 14s ease infinite',
        float: 'float 18s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 6s ease-in-out infinite',
        shimmer: 'shimmer 2.2s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.1s linear infinite',
      },
    },
  },
  plugins: [],
}
