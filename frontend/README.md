# Expense Tracker Frontend

A production-grade expense tracking application built with Next.js 16.0.10, TypeScript, and the same design system as the portfolio website.

## ✨ Features

- 🎨 **Portfolio Design System**: Same dark/light theme, colors, and typography
- 🔒 **Secure API Proxy**: Backend URL hidden from client via Next.js API routes
- 🚀 **Next.js 16.0.10**: Latest Next.js with App Router
- 📱 **Fully Responsive**: Mobile-first approach with beautiful UI
- 🌙 **Theme Support**: Dark/Light mode with system preference
- 🔐 **Protected Routes**: Middleware-based authentication
- 📊 **State Management**: Zustand for global state
- 🎯 **DRY Principles**: Reusable components and clean code organization

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.10
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theme**: next-themes
- **Animations**: motion (framer-motion)
- **Icons**: lucide-react
- **HTTP Client**: axios
- **State Management**: Zustand
- **Validation**: zod
- **Date Formatting**: date-fns

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── login-form.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── _components/
│   │           └── register-form.tsx
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── layout.tsx        # Dashboard layout with navbar
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── stats-cards.tsx
│   │   │       └── expenses-list.tsx
│   │   └── expenses/
│   │       ├── page.tsx      # All expenses list
│   │       ├── _components/
│   │       │   ├── expenses-grid.tsx
│   │       │   └── expense-filters.tsx
│   │       ├── [id]/         # View expense
│   │       ├── new/          # Add expense
│   │       └── edit/[id]/    # Edit expense
│   ├── api/
│   │   └── proxy/
│   │       └── [...path]/     # API proxy route
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Loader.tsx
├── store/
│   ├── auth-store.ts
│   └── expense-store.ts
├── hooks/
│   └── use-auth.ts
├── lib/
│   ├── api.ts               # Axios instance
│   ├── fonts.ts
│   └── utils.ts
├── middleware.ts            # Route protection
└── env.mjs                  # Environment validation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit .env and set your backend URL
BACKEND_API_URL=http://localhost:4000
```

### Development

```bash
# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔐 API Proxy

All API calls go through `/api/proxy/*` which forwards requests to the backend. This:

- ✅ Hides backend URL from client
- ✅ Avoids CORS issues
- ✅ Allows middleware, caching, rate limiting
- ✅ Better for production

### Usage

```typescript
import api from '@/lib/api';

// All requests automatically go through /api/proxy
const response = await api.get('/auth/me');
const expenses = await api.get('/expenses');
```

## 🎨 Design System

The app uses the same design system as the portfolio:

- **Colors**: Dark theme with light mode support
- **Fonts**: Space Grotesk (primary), IBM Plex Mono (monospace)
- **Components**: Consistent styling with portfolio components
- **Responsive**: Mobile-first design with breakpoints

## 📱 Pages

- **Login/Register**: Beautiful authentication pages
- **Dashboard**: Overview with stats and recent expenses
- **All Expenses**: Filterable list of all expenses
- **Add Expense**: Form to create new expense/income
- **View Expense**: Detailed view of a single expense
- **Edit Expense**: Update expense details

## 🔒 Protected Routes

Routes under `/dashboard/*` are protected by middleware. Unauthenticated users are redirected to `/login`.

## 📦 State Management

- **Zustand**: Lightweight state management
- **Auth Store**: User authentication state
- **Expense Store**: Expenses list and operations

## 🎯 Best Practices

- ✅ DRY principles - reusable components
- ✅ TypeScript for type safety
- ✅ Component separation - page components in `_components/`
- ✅ Responsive design from the start
- ✅ Production-grade code organization
- ✅ Clean, maintainable structure

## 📄 License

MIT
