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
    // Essential base classes
    'bg-background', 'text-foreground', 'bg-card', 'text-card-foreground', 'bg-secondary', 'text-secondary-foreground',
    'bg-muted', 'text-muted-foreground', 'bg-primary', 'text-primary-foreground', 'border-border',
    // Layout and structure
    'flex', 'flex-1', 'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between', 'justify-start',
    'w-full', 'h-full', 'min-h-screen', 'max-w-7xl', 'max-w-2xl', 'max-w-md', 'max-w-sm', 'mx-auto',
    'overflow-auto', 'overflow-hidden', 'overflow-y-auto', 'relative', 'absolute', 'fixed', 'inset-0',
    // Grid layouts with all responsive variants
    'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5',
    'sm:grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4',
    'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5', 'xl:grid-cols-4', 'xl:grid-cols-5',
    // Spacing with all variants
    'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6', 'gap-8',
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'px-2', 'px-3', 'px-4', 'px-6', 'py-2', 'py-3', 'py-4', 'py-6', 'py-12',
    'm-0', 'm-1', 'm-2', 'm-4', 'mb-1', 'mb-2', 'mb-4', 'mb-6', 'mb-8', 'mt-4', 'mt-6', 'mt-8',
    // Text styling
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-sans', 'antialiased',
    'text-center', 'text-left', 'text-right', 'leading-relaxed',
    // Color variants for KPI cards and components
    'text-green-600', 'text-green-400', 'text-blue-600', 'text-blue-400', 'text-orange-600', 'text-orange-400',
    'text-red-600', 'text-red-400', 'text-yellow-600', 'text-yellow-400', 'text-purple-600', 'text-purple-400',
    'bg-green-50', 'bg-green-100', 'bg-green-950/20', 'bg-blue-50', 'bg-blue-100', 'bg-blue-950/20',
    'bg-orange-50', 'bg-orange-100', 'bg-orange-950/20', 'bg-red-50', 'bg-red-100', 'bg-red-950/20',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-950/20', 'bg-purple-50', 'bg-purple-100', 'bg-purple-950/20',
    // Border and radius
    'border', 'border-2', 'border-t', 'border-b', 'border-l', 'border-r', 'border-input',
    'rounded', 'rounded-lg', 'rounded-md', 'rounded-sm', 'rounded-full',
    // Dark mode variants for all backgrounds and text
    'dark:bg-background', 'dark:text-foreground', 'dark:bg-card', 'dark:text-card-foreground',
    'dark:bg-secondary', 'dark:text-secondary-foreground', 'dark:bg-muted', 'dark:text-muted-foreground',
    'dark:bg-primary', 'dark:text-primary-foreground', 'dark:border-border',
    'dark:bg-black', 'dark:bg-gray-950', 'dark:bg-gray-900', 'dark:bg-gray-800', 'dark:bg-gray-700',
    'dark:text-white', 'dark:text-gray-100', 'dark:text-gray-200', 'dark:text-gray-300',
    'dark:border-gray-800', 'dark:border-gray-700', 'dark:border-gray-600', 'dark:border-gray-500',
    // Interactive states
    'hover:bg-accent', 'hover:text-accent-foreground', 'hover:bg-gray-100', 'hover:bg-gray-200',
    'dark:hover:bg-accent', 'dark:hover:text-accent-foreground', 'dark:hover:bg-gray-800', 'dark:hover:bg-gray-700',
    'cursor-pointer', 'transition-colors', 'duration-200',
    // Map and chart colors
    'fill-green-100', 'fill-green-200', 'fill-green-300', 'fill-green-400', 'fill-green-500', 'fill-green-600',
    'fill-blue-100', 'fill-blue-200', 'fill-blue-300', 'fill-blue-400', 'fill-blue-500', 'fill-blue-600',
    'stroke-gray-300', 'stroke-gray-700', 'dark:stroke-gray-600',
    // Button and form elements
    'inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap', 'disabled:pointer-events-none',
    'disabled:opacity-50', 'h-8', 'h-9', 'h-10', 'w-8', 'w-9', 'w-10', 'shadow-sm',
    // Space and sizing
    'space-y-1', 'space-y-2', 'space-y-4', 'space-y-6', 'space-y-8',
    'w-4', 'w-6', 'w-8', 'w-12', 'w-16', 'h-4', 'h-6', 'h-8', 'h-12', 'h-16',
    // Sidebar and navigation
    'bg-green-primary', 'text-green-primary', 'bg-green-light',
    // Additional utility classes found in components
    'select-none', 'outline-none', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring',
    // Force include all CSS variables and theme-based classes
    'bg-background', 'bg-foreground', 'bg-card', 'bg-card-foreground', 'bg-popover', 'bg-popover-foreground',
    'bg-primary', 'bg-primary-foreground', 'bg-secondary', 'bg-secondary-foreground', 
    'bg-muted', 'bg-muted-foreground', 'bg-accent', 'bg-accent-foreground',
    'text-background', 'text-foreground', 'text-card', 'text-card-foreground', 'text-popover', 'text-popover-foreground',
    'text-primary', 'text-primary-foreground', 'text-secondary', 'text-secondary-foreground',
    'text-muted', 'text-muted-foreground', 'text-accent', 'text-accent-foreground',
    'border-background', 'border-foreground', 'border-card', 'border-input', 'border-ring',
    // Dark mode variants for theme classes
    'dark:bg-background', 'dark:bg-foreground', 'dark:bg-card', 'dark:bg-card-foreground',
    'dark:bg-popover', 'dark:bg-popover-foreground', 'dark:bg-primary', 'dark:bg-primary-foreground',
    'dark:bg-secondary', 'dark:bg-secondary-foreground', 'dark:bg-muted', 'dark:bg-muted-foreground',
    'dark:bg-accent', 'dark:bg-accent-foreground',
    'dark:text-background', 'dark:text-foreground', 'dark:text-card', 'dark:text-card-foreground',
    'dark:text-popover', 'dark:text-popover-foreground', 'dark:text-primary', 'dark:text-primary-foreground',
    'dark:text-secondary', 'dark:text-secondary-foreground', 'dark:text-muted', 'dark:text-muted-foreground',
    'dark:text-accent', 'dark:text-accent-foreground',
    'dark:border-background', 'dark:border-foreground', 'dark:border-card', 'dark:border-input', 'dark:border-ring'
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