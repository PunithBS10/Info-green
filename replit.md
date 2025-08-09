# Overview

This is a Global Renewable Electricity Dashboard that visualizes renewable electricity data from Our World in Data (OWID). The application provides interactive maps, country analytics, and comprehensive global renewable energy statistics through a modern web interface. Users can explore renewable electricity shares by country, view global trends, and analyze regional performance with interactive visualizations.

## Deployment Status
✅ **Ready for Static Hosting** - Configured for Netlify/Cloudflare deployment
- Base directory: `client`
- Build command: `npm run build` (or leave empty)
- Publish directory: `dist`
- Tailwind CSS optimized for production with comprehensive safelist
- All styling issues resolved for deployment environments

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Routing**: Client-side routing with Wouter for lightweight navigation
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and data fetching
- **Visualization**: ECharts library for interactive world maps and data charts
- **Theme System**: Custom theme provider supporting light/dark modes with system preference detection

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Development Setup**: Vite integration for hot module replacement in development
- **API Structure**: Clean REST endpoints for renewable data operations (GET, POST, filtering by country/year)
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Request Logging**: Custom middleware for API request logging and performance monitoring

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless connection for scalable PostgreSQL hosting
- **Schema Management**: Drizzle migrations for database schema versioning
- **Caching Strategy**: Browser localStorage with 24-hour TTL for renewable data caching
- **Memory Fallback**: In-memory storage implementation for development/testing scenarios

## Data Processing
- **CSV Parsing**: Custom CSV parser for OWID renewable electricity datasets
- **Data Transformation**: Client-side processing for country ranking, regional aggregation, and KPI calculations
- **Real-time Updates**: Data refresh capabilities with loading states and error handling
- **Performance Optimization**: Memoized calculations using React.useMemo for expensive data operations

## Authentication & Authorization
- **User Schema**: Basic user authentication schema (username/password) prepared for future implementation
- **Session Handling**: Express sessions configured with PostgreSQL session store
- **Security**: Prepared authentication endpoints without current implementation

# External Dependencies

## Core Services
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Our World in Data (OWID)**: Primary data source for global renewable electricity statistics

## Development Tools
- **Vite**: Build tool and development server with HMR support
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundler for production builds

## UI & Visualization Libraries
- **Radix UI**: Accessible component primitives for form controls, dialogs, and navigation
- **ECharts**: Interactive charting library for world maps and data visualization
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

## Data & State Management
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **React Hook Form**: Form validation and submission with Zod schema validation
- **Date-fns**: Date formatting and manipulation utilities

## Development Experience
- **TypeScript**: Full type safety across client, server, and shared code
- **Zod**: Runtime type validation for API requests and data schemas
- **Replit Integration**: Development environment optimizations and error overlay