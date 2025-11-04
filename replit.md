# Drone Control Simulator

## Overview

This is a 3D drone flight simulator built with React, Three.js, and Express. Users can control a virtual drone using on-screen joysticks with two different control modes (Mode 1 and Mode 2), mimicking real RC drone controllers. The application features realistic physics simulation, 3D graphics rendering, and a clean UI built with Radix UI components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technologies**
- **React 18** with TypeScript for UI components and application logic
- **React Three Fiber** (@react-three/fiber) for declarative Three.js rendering
- **Drei** (@react-three/drei) for Three.js helpers and utilities
- **Vite** as the build tool and development server
- **Tailwind CSS** for styling with custom theme configuration

**State Management**
- **Zustand** with subscribeWithSelector middleware for centralized state management
- Three separate stores handle different concerns:
  - `useDrone`: Manages drone physics, position, rotation, velocity, joystick inputs, and flight parameters
  - `useGame`: Tracks game phase (ready/playing/ended) and game flow controls
  - `useAudio`: Controls sound effects and background music with mute functionality

**3D Rendering Architecture**
- Canvas wrapper component sets up the Three.js scene with shadow support
- Modular 3D components:
  - `Drone`: Renders the drone mesh with motors and propellers, updates based on physics state
  - `Environment`: Sets up lighting (ambient + directional with shadows) and ground plane
  - `Camera`: Implements smooth camera following with lerp interpolation
- Physics calculated in Zustand store, applied via useFrame hook for 60fps updates

**UI Components**
- Comprehensive Radix UI component library (accordion, dialog, dropdown, etc.)
- Custom `Joystick` component for touch/mouse control input
- `UI` overlay component displays flight telemetry (altitude, speed, heading) and controls
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- Middleware stack includes JSON parsing, URL encoding, and request logging
- Custom request/response logging captures API calls with timing and payload information

**Development Environment**
- Vite dev server runs in middleware mode during development
- HMR (Hot Module Replacement) enabled through Vite integration
- Production build uses esbuild for server bundling, Vite for client bundling

**Storage Layer**
- Abstract `IStorage` interface defines CRUD operations for future database integration
- `MemStorage` class provides in-memory implementation for development
- Schema defined using Drizzle ORM with PostgreSQL dialect
- User model includes id, username, and password fields with validation via Zod schemas

**Build Configuration**
- Separate build outputs: `dist/public` for client assets, `dist` for server code
- TypeScript path aliases (`@/*` for client, `@shared/*` for shared code)
- ESM module format throughout the project

### External Dependencies

**Database**
- **PostgreSQL** via Neon Database serverless driver (@neondatabase/serverless)
- **Drizzle ORM** for type-safe database queries and schema management
- Connection configured via `DATABASE_URL` environment variable
- Migrations stored in `./migrations` directory

**3D Graphics & Physics**
- **Three.js** (via React Three Fiber) for WebGL rendering
- **@react-three/drei** provides helpful abstractions (useTexture, etc.)
- **@react-three/postprocessing** for visual effects (though not actively used in current code)
- Custom physics implementation using Three.js Vector3 and Euler for drone simulation

**UI Framework**
- **Radix UI** primitives for accessible, unstyled components
- **Tailwind CSS** with PostCSS and Autoprefixer
- **class-variance-authority** and **clsx** for conditional styling
- **cmdk** for command menu functionality
- **date-fns** for date manipulation
- **lucide-react** for icon components

**Query & Data Fetching**
- **TanStack Query** (React Query) configured with custom fetch wrapper
- API requests use credentials-included fetch with JSON content type
- Custom error handling for non-OK responses

**Session Management**
- **express-session** with PostgreSQL store (connect-pg-simple) configured for production
- Session storage currently prepared but not actively implemented in routes

**Build Tools**
- **Vite** with React plugin and GLSL shader support
- **esbuild** for fast server-side bundling
- **tsx** for TypeScript execution in development
- **drizzle-kit** for database migrations and schema push