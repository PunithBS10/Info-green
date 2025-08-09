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
    // Color variants
    'text-green-600', 'text-green-400', 'text-blue-600', 'text-blue-400', 'text-orange-600', 'text-orange-400',
    'bg-green-50', 'bg-green-950/20', 'bg-blue-50', 'bg-blue-950/20', 'bg-orange-50', 'bg-orange-950/20',
    // Grid layouts
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5',
    'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'lg:grid-cols-4', 'lg:grid-cols-5',
    // Text sizes and weights
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    // Spacing
    'gap-2', 'gap-4', 'gap-6', 'gap-8', 'p-2', 'p-4', 'p-6', 'p-8', 'm-2', 'm-4', 'm-6', 'm-8',
    // Border and border radius
    'border', 'border-2', 'border-t', 'border-b', 'border-l', 'border-r',
    'rounded', 'rounded-lg', 'rounded-md', 'rounded-sm', 'rounded-full',
    // Dark mode variants
    'dark:bg-black', 'dark:bg-gray-900', 'dark:bg-gray-800', 'dark:bg-gray-700',
    'dark:text-white', 'dark:text-gray-100', 'dark:text-gray-200', 'dark:text-gray-300',
    'dark:border-gray-700', 'dark:border-gray-600', 'dark:border-gray-500',
    // Interactive states
    'hover:bg-gray-100', 'hover:bg-gray-200', 'dark:hover:bg-gray-800', 'dark:hover:bg-gray-700',
    // Map colors for renewable percentage visualization
    'fill-green-100', 'fill-green-200', 'fill-green-300', 'fill-green-400', 'fill-green-500', 'fill-green-600',
    'fill-blue-100', 'fill-blue-200', 'fill-blue-300', 'fill-blue-400', 'fill-blue-500', 'fill-blue-600',
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