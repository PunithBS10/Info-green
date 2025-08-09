/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
    "../components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  safelist: [
    // Essential Shadcn UI component classes - CRITICAL for deployment
    'bg-background', 'text-foreground', 'bg-card', 'text-card-foreground', 
    'bg-popover', 'text-popover-foreground', 'bg-primary', 'text-primary-foreground',
    'bg-secondary', 'text-secondary-foreground', 'bg-muted', 'text-muted-foreground',
    'bg-accent', 'text-accent-foreground', 'border-border',
    // Custom green theme classes
    'text-green-primary', 'bg-green-primary', 'bg-green-light',
    // Color variants used in KPI cards
    'bg-green-50', 'bg-green-500', 'bg-green-600', 'bg-green-900',
    'bg-blue-50', 'bg-blue-900', 'bg-gray-50', 'bg-gray-900',
    'text-green-400', 'text-green-500', 'text-green-600',
    'text-blue-400', 'text-blue-600', 'text-orange-400', 'text-orange-600',
    // Dark mode variants - ESSENTIAL for dark mode deployment
    'dark:bg-background', 'dark:text-foreground', 'dark:bg-card',
    'dark:bg-popover', 'dark:bg-secondary', 'dark:bg-muted', 'dark:bg-accent',
    'dark:bg-green-900', 'dark:bg-blue-900', 'dark:bg-gray-900',
    'dark:text-green-400', 'dark:text-blue-400',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
}