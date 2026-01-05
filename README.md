# Expense Tracker - Secure Authentication & Financial Management

A production-ready, enterprise-grade expense tracking application with secure authentication, built with modern technologies and best security practices.

🌐 **Live Application**: [https://wanderon.shrishail.io/](https://wanderon.shrishail.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Measures](#security-measures)
- [Seed Data](#seed-data)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

**🌐 Live Demo**: [https://wanderon.shrishail.io/](https://wanderon.shrishail.io/)

This is a full-stack expense tracking application that allows users to securely manage their income and expenses. The application features:

- **Secure Authentication**: Enterprise-grade authentication with JWT tokens, HTTP-only cookies, and account lockout protection
- **Expense Management**: Track income and expenses with categories, dates, and descriptions
- **Real-time Statistics**: View financial insights with category breakdowns and analytics
- **Modern UI**: Beautiful, responsive interface with dark/light mode support
- **Production-Ready**: Built with security best practices and scalable architecture

## ✨ Features

### Authentication
- User registration with email validation
- Secure login with password hashing (bcrypt)
- JWT-based session management
- HTTP-only cookie storage
- Account lockout after failed attempts
- Rate limiting for API protection

### Expense Management
- Add, view, edit, and delete expenses
- Filter by category, type, date range, and search
- Multiple view modes (Grid, Table, Compact)
- Pagination support
- Real-time statistics and analytics
- Category-wise breakdowns

### Security
- Password hashing with bcrypt (12 salt rounds)
- XSS protection with input sanitization
- NoSQL injection prevention
- SQL injection protection
- Rate limiting on API endpoints
- Security logging for suspicious activities
- Request validation middleware
- Helmet.js for security headers

### UI/UX
- Modern, responsive design
- Dark/Light mode support
- Smooth animations with Framer Motion
- Beautiful landing page
- Modal-based interactions
- Real-time form validation
- Loading states and error handling

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion, GSAP
- **UI Components**: Shadcn UI, Radix UI
- **HTTP Client**: Axios
- **Icons**: Lucide React, Tech Stack Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, express-rate-limit, xss, mongo-sanitize

## 📁 Project Structure

```
wanderon-assignment/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Express server setup
│   ├── scripts/             # Utility scripts
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (dashboard)/     # Dashboard pages
│   │   ├── _components/     # Landing page components
│   │   └── api/             # API proxy routes
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions
│   ├── store/               # Zustand stores
│   └── package.json
└── README.md
```

## 📦 Prerequisites

- **Node.js**: v18.x or higher
- **pnpm**: v8.x or higher (or npm/yarn)
- **MongoDB**: v6.x or higher (local or Atlas)
- **Git**: For version control

## 🔐 Environment Variables

### Backend (.env in `backend/` directory)

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECURE=false  # Set to true in production with HTTPS
COOKIE_SAME_SITE=lax  # Options: strict, lax, none

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

### Frontend (.env.local in `frontend/` directory)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wanderon-assignment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env  # Or create manually
# Edit .env with your configuration

# Build the project
pnpm run build
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Create .env.local file
# Add NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## ▶️ Running the Application

### Development Mode

#### Backend

```bash
cd backend
pnpm run dev
# Server runs on http://localhost:4000
```

#### Frontend

```bash
cd frontend
pnpm run dev
# Application runs on http://localhost:3000
```

### Production Mode

#### Backend

```bash
cd backend
pnpm run build
pnpm start
```

#### Frontend

```bash
cd frontend
pnpm run build
pnpm start
```

## 📡 API Endpoints

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com"
    }
  }
}
```
*Sets HTTP-only cookie with JWT token*

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=<jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Expense Endpoints

*All expense endpoints require authentication*

#### Create Expense
```http
POST /api/expenses
Content-Type: application/json
Cookie: token=<jwt-token>

{
  "title": "Grocery Shopping",
  "amount": 2500,
  "category": "Food & Dining",
  "type": "expense",
  "description": "Weekly groceries",
  "date": "2024-01-15"
}
```

#### Get Expenses (with filters)
```http
GET /api/expenses?type=expense&category=Food%20%26%20Dining&startDate=2024-01-01&endDate=2024-01-31&search=grocery&page=1&limit=10
Cookie: token=<jwt-token>
```

**Query Parameters:**
- `type`: `all` | `income` | `expense`
- `category`: Category name
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Get Expense Statistics
```http
GET /api/expenses/statistics
Cookie: token=<jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpense": 25000,
    "balance": 25000,
    "categoryBreakdown": {
      "Food & Dining": 5000,
      "Transportation": 3000,
      ...
    }
  }
}
```

#### Get Expense by ID
```http
GET /api/expenses/:id
Cookie: token=<jwt-token>
```

#### Update Expense
```http
PUT /api/expenses/:id
Content-Type: application/json
Cookie: token=<jwt-token>

{
  "title": "Updated Title",
  "amount": 3000,
  ...
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Cookie: token=<jwt-token>
```

## 🔒 Security Measures

### Authentication Security

1. **Password Hashing**
   - Uses bcryptjs with 12 salt rounds
   - Passwords are never stored in plain text
   - One-way hashing ensures passwords cannot be reversed

2. **JWT Tokens**
   - Tokens stored in HTTP-only cookies (prevents XSS)
   - Secure flag enabled in production
   - Configurable expiration (default: 7 days)
   - Secret key must be at least 32 characters

3. **Account Lockout**
   - Account locked after 5 failed login attempts
   - Lock duration: 30 minutes
   - Prevents brute force attacks

4. **Rate Limiting**
   - Authentication endpoints: 5 requests per 15 minutes
   - General API: 100 requests per 15 minutes
   - Prevents abuse and DDoS attacks

### Input Validation & Sanitization

1. **Server-Side Validation**
   - express-validator for request validation
   - Validates email format, password strength, required fields
   - Returns detailed error messages

2. **XSS Protection**
   - xss library for input sanitization
   - Removes malicious scripts from user input
   - Prevents cross-site scripting attacks

3. **NoSQL Injection Prevention**
   - express-mongo-sanitize middleware
   - Removes MongoDB operators from input
   - Prevents NoSQL injection attacks

4. **SQL Injection Protection**
   - Request validator middleware
   - Detects and blocks SQL injection patterns
   - Validates request structure

5. **Request Validation**
   - Custom request validator middleware
   - Checks for injection patterns (SQL, XSS, NoSQL, Command)
   - Validates Content-Type and request size
   - Blocks malformed requests

### Security Headers

- **Helmet.js**: Sets security headers
  - Content Security Policy (CSP)
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security (HSTS)

### Security Logging

- Logs authentication events
- Tracks failed login attempts
- Monitors suspicious activities
- Logs security-related errors

### CORS Configuration

- Configured for specific origins
- Credentials enabled for cookie support
- Restricted HTTP methods
- Allowed headers specified

## 🌱 Seed Data

### Add Seed Data for Test User

The project includes a script to add seed data for testing:

```bash
cd backend
pnpm run seed:user
```

This script:
- Creates or finds user: `test01@gmail.com`
- Password: `TestPass@01`
- Adds 40+ diverse expense entries
- Includes income and expense transactions
- Covers all categories

**Test Credentials:**
- Email: `test01@gmail.com`
- Password: `TestPass@01`

*These credentials are also displayed on the login page for easy access.*

## 🧪 Testing

### Test API Endpoints

```bash
cd backend
pnpm run test:api
```

### Test Security Features

```bash
cd backend
pnpm run test:security
```

## 🚢 Deployment

### Backend Deployment

**✅ Backend is deployed to Azure Container Apps**

The backend is **deployed to Azure Container Apps** using Terraform. See the [Terraform Deployment Guide](./terraform/README.md) for detailed instructions.

**Deployment Architecture:**
- **Platform**: Azure Container Apps (serverless container platform)
- **Container Registry**: Azure Container Registry (ACR) - `acrwanderon`
- **Secrets Management**: Azure Key Vault (`wanderon-kv`)
- **Authentication**: User Assigned Managed Identity (no passwords/secrets in code)
- **Scaling**: Auto-scales from 1 to 3 replicas based on traffic
- **Health Checks**: Automatic health monitoring via `/api/health` endpoint
- **Logging**: Log Analytics Workspace for centralized logging
- **Networking**: Public ingress with HTTPS enabled

**Quick Overview:**
- **Platform**: Azure Container Apps
- **Container Registry**: Azure Container Registry (ACR) - `acrwanderon`
- **Secrets Management**: Azure Key Vault
- **Authentication**: Managed Identity (no passwords in code)
- **Scaling**: Auto-scales from 1 to 3 replicas based on load
- **Health Checks**: Automatic health monitoring

**Deployment Steps:**
1. Store secrets in Azure Key Vault
2. Build Docker image for `linux/amd64` platform
3. Push image to Azure Container Registry
4. Deploy with Terraform

For local development:

1. **Environment Variables**
   - Set all required environment variables
   - Use strong JWT_SECRET (minimum 32 characters)
   - Set `COOKIE_SECURE=true` for HTTPS
   - Configure `CORS_ORIGIN` for production domain

2. **MongoDB**
   - Use MongoDB Atlas for cloud database
   - Or configure your own MongoDB instance
   - Ensure connection string is secure

3. **Build & Start**
   ```bash
   pnpm run build
   pnpm start
   ```

### Frontend Deployment

1. **Environment Variables**
   - Set `NEXT_PUBLIC_API_URL` to production API URL

2. **Build & Start**
   ```bash
   pnpm run build
   pnpm start
   ```

3. **Vercel Deployment** (Recommended)
   - Connect your repository to Vercel
   - Configure environment variables
   - Deploy automatically on push

### Production Checklist

- [x] Backend deployed to Azure Container Apps
- [x] Secrets stored in Azure Key Vault
- [x] Managed Identity configured for secure access
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable `COOKIE_SECURE=true` (HTTPS required)
- [ ] Configure proper CORS_ORIGIN
- [ ] Use MongoDB Atlas or secure database
- [x] Enable HTTPS/SSL (via Azure Container Apps)
- [ ] Configure rate limiting appropriately
- [x] Set up monitoring and logging (Log Analytics Workspace)
- [ ] Regular security updates
- [ ] Backup database regularly

## 📝 Additional Information

### Expense Categories

- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Education
- Travel
- Income
- Other

### Expense Types

- `income`: Money received
- `expense`: Money spent

### Pagination

- Default page size: 10 items
- Configurable via `limit` query parameter
- Returns pagination metadata in response

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Shrishail Patil**

---

## 🆘 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using modern technologies and security best practices**

