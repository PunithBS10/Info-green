import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Essential Shadcn UI component classes
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
    // Dark mode variants
    'dark:bg-background', 'dark:text-foreground', 'dark:bg-card',
    'dark:bg-popover', 'dark:bg-secondary', 'dark:bg-muted', 'dark:bg-accent',
    'dark:bg-green-900', 'dark:bg-blue-900', 'dark:bg-gray-900',
    'dark:text-green-400', 'dark:text-blue-400',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
