# Lucija Ercegovac - Opera Singer Portfolio

## Overview

This is a full-stack web application for opera singer Lucija Ercegovac, featuring a sophisticated dark-mode portfolio site with an admin panel for content management. The application showcases upcoming and past performances, YouTube videos, blog posts, reviews, and biographical information. Built with modern web technologies, it provides a seamless experience for visitors while offering comprehensive content management capabilities for the artist.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Styling**
- **React** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with custom design system based on shadcn/ui components
- **Dark mode by default** with sophisticated color palette inspired by premium portfolio sites

**State Management**
- **TanStack Query (React Query)** for server state management, data fetching, and caching
- Local component state using React hooks
- No global state management library - relies on React Query's caching layer

**Design Philosophy**
- Image-first experience with full-screen photography
- Mobile-first responsive design
- Smooth scroll-based navigation with accessible hamburger menu
- Typography using Google Fonts: Cormorant Garamond (serif display) and Inter (sans-serif body)
- Minimalist aesthetic letting the artist's work take center stage

**Component Structure**
- Reusable UI components from shadcn/ui (buttons, cards, dialogs, forms, etc.)
- Feature components for each portfolio section (Hero, Events, YouTube Gallery, Blog, About)
- Separate admin components for content management
- Examples directory demonstrating component usage

### Backend Architecture

**Server Framework**
- **Express.js** for HTTP server and API routing
- RESTful API design pattern
- Middleware-based request processing
- Custom error handling and logging

**API Structure**
- `/api/auth/*` - Authentication endpoints
- `/api/reviews` - Press reviews management
- `/api/events` - Event management (upcoming/past)
- `/api/event-images` - Event photo uploads
- `/api/videos` - YouTube video gallery
- `/api/blog/*` - Blog post CRUD operations
- `/api/about` - Biography content
- `/public-objects/*` - Public file serving
- `/objects/*` - Protected file access

**Authentication & Authorization**
- **Replit Auth** via OpenID Connect (OIDC) integration
- Passport.js strategy for authentication flow
- Session-based authentication using express-session
- PostgreSQL-backed session storage
- Role-based access control (admin vs. regular users)
- Protected routes requiring authentication
- Admin-only routes for content management

### Data Storage

**Database**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for type-safe database operations and schema management
- Connection pooling for optimal performance

**Database Schema**
- `sessions` - Express session storage (required for auth)
- `users` - User profiles with admin flag
- `reviews` - Press reviews with ordering
- `events` - Performance events with date and venue information
- `event_images` - Photos associated with events
- `youtube_videos` - YouTube gallery entries
- `blog_posts` - Blog content with publish status
- `about_content` - Biography/about section content

**File Storage**
- **Google Cloud Storage** for images and media files
- Replit Object Storage integration via sidecar endpoint
- Custom ACL (Access Control List) system for file permissions
- Public and private file access patterns
- Uppy file uploader integration on the frontend

**Storage Abstraction**
- Repository pattern with `IStorage` interface
- All database operations centralized in `server/storage.ts`
- Separation of concerns between data access and business logic

### External Dependencies

**Authentication & Infrastructure**
- **Replit Auth** - OpenID Connect authentication provider
- **Replit Object Storage** - File storage via Google Cloud Storage adapter
- **Neon** - Serverless PostgreSQL database hosting

**Core Libraries**
- **Drizzle ORM** - Type-safe database toolkit
- **TanStack Query** - Server state management
- **Uppy** - File upload handling with AWS S3 adapter
- **Wouter** - Lightweight routing
- **React Hook Form** with Zod validation - Form management

**UI Components**
- **Radix UI** - Headless component primitives (30+ components)
- **shadcn/ui** - Pre-styled component library built on Radix
- **Lucide React** - Icon library

**Development Tools**
- **TypeScript** - Type safety across the stack
- **ESBuild** - Backend bundling for production
- **Vite** - Frontend bundling and dev server
- **PostCSS** with Autoprefixer - CSS processing

**Third-party Services**
- **Google Fonts** - Cormorant Garamond and Inter typography
- **YouTube** - Embedded video player integration