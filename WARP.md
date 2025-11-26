# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

# Project Overview
This is a CRM application built with **Next.js 16** (App Router) and **Supabase**. 
The project uses a centralized API client to communicate with Supabase Edge Functions, avoiding direct database access from the client.

# Common Commands

### Development
- **Start Development Server**: `npm run dev`
  - Runs the app at `http://localhost:3000`.
- **Lint Code**: `npm run lint`
  - Runs ESLint to check for code quality issues.

### Production
- **Build**: `npm run build`
  - Compiles the application for production.
- **Start Production Server**: `npm run start`
  - Runs the built application.

### Testing
- *No test scripts are currently configured in `package.json`.*

# Architecture

### High-Level Structure
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS.
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth).
- **Data Flow**: 
  1. **Frontend** (React Components) calls methods in `src/lib/api/client.ts`.
  2. **API Client** attaches Supabase Auth JWT and calls **Edge Functions**.
  3. **Edge Functions** execute business logic and interact with the **PostgreSQL Database**.
  - **Important**: The frontend **does not** access the database directly. All operations go through Edge Functions.

### Key Directories
- `src/app/`: Next.js App Router pages and layouts.
  - `login/`: Authentication page.
  - `dashboard/`: Main dashboard.
  - `contacts/`, `inbox/`, `pipeline/`, `integration/`: Feature pages.
- `src/components/`: Reusable UI components.
  - `features/`: Feature-specific components (e.g., `contacts/contact-form.tsx`).
  - `layout/`: Layout components (navbar, etc.).
- `src/lib/`: Core utilities.
  - `api/client.ts`: **Centralized API client**. Use this for all data fetching.
  - `supabase/`: Supabase configuration and client initialization.

### Authentication
- Handled via Supabase Auth.
- JWT is managed automatically by the Supabase client and sent with requests via the API client.
- Login page: `src/app/login/page.tsx`.

### Important Documentation
- `FRONTEND_IMPLEMENTATION.md`: Detailed feature specs and implementation status.
- `SUPABASE_CONFIG.md`: Backend configuration, environment variables, and deployed Edge Functions.
- `DEPLOY_GUIDE.md`: Deployment instructions for Vercel.
