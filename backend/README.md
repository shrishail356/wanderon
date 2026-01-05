# WanderOn Authentication & Expense Tracker Backend

Production-ready secure authentication system with expense tracker functionality built for WanderOn technical assessment.

## 🚀 Features

### Authentication
- ✅ User Registration with email/password
- ✅ User Login with JWT
- ✅ Secure password hashing (bcrypt)
- ✅ JWT stored in HTTP-only cookies
- ✅ Protected routes with authentication middleware
- ✅ Session management (non-sticky cookies)

### Security
- ✅ XSS protection (input sanitization)
- ✅ NoSQL injection protection
- ✅ Rate limiting on auth endpoints
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ Data sanitization

### Expense Tracker
- ✅ Create, Read, Update, Delete expenses
- ✅ Filter expenses by type, category, date range
- ✅ Expense statistics (income, expenses, balance, by category)
- ✅ Pagination support
- ✅ User-specific data isolation

### Code Quality
- ✅ TypeScript for type safety
- ✅ SOLID principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ Enterprise-level code organization
- ✅ Comprehensive error handling
- ✅ Request logging

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Request handlers
│   │   ├── authController.ts
│   │   └── expenseController.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validate.ts
│   ├── models/          # MongoDB models
│   │   ├── User.ts
│   │   └── Expense.ts
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   ├── expenseRoutes.ts
│   │   └── index.ts
│   ├── services/        # Business logic
│   │   ├── authService.ts
│   │   └── expenseService.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── errors.ts
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   ├── sanitize.ts
│   │   └── validation.ts
│   └── server.ts        # Express app setup
├── scripts/             # Utility scripts
│   ├── seed.ts         # Seed database
│   └── test-security.ts # Security tests
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm (package manager)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Create `.env` file:**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRES_IN=7d
   COOKIE_SECURE=false
   COOKIE_SAME_SITE=lax
   CORS_ORIGIN=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Seed the database (optional):**
   ```bash
   pnpm run seed
   ```

5. **Run the server:**
   ```bash
   # Development
   pnpm run dev

   # Production
   pnpm run build
   pnpm start
   ```

## 📡 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt-token>
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=<jwt-token>
```

### Expenses

#### Create Expense
```http
POST /api/expenses
Content-Type: application/json
Cookie: token=<jwt-token>

{
  "title": "Groceries",
  "amount": 150.50,
  "category": "Food & Dining",
  "type": "expense",
  "description": "Weekly groceries",
  "date": "2024-01-15T00:00:00.000Z"
}
```

#### Get All Expenses
```http
GET /api/expenses?type=expense&category=Food&page=1&limit=10
Cookie: token=<jwt-token>
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
  "amount": 200.00
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Cookie: token=<jwt-token>
```

#### Get Statistics
```http
GET /api/expenses/statistics?startDate=2024-01-01&endDate=2024-01-31
Cookie: token=<jwt-token>
```

## 🔒 Security Features

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Passwords are never stored in plain text
- Passwords are never sent in API responses

### JWT Security
- JWT tokens stored in HTTP-only cookies (prevents XSS)
- Secure flag enabled in production (HTTPS only)
- SameSite attribute set for CSRF protection
- Token expiration: 7 days (configurable)

### Input Validation
- Email format validation
- Password strength requirements (min 8 chars, uppercase, lowercase, number)
- All user inputs sanitized to prevent XSS
- NoSQL injection protection using mongo-sanitize

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

### Security Headers
- Helmet.js configured for security headers
- CORS properly configured
- Content Security Policy enabled

## 🧪 Testing

### Run API Tests
```bash
pnpm run test:api
```

This will test:
- Health check endpoint
- User registration
- User login
- Get current user (protected route)
- Create expense (protected route)
- Get expenses (protected route)
- Get statistics (protected route)
- Logout
- Input validation

### Run Security Tests
```bash
pnpm run test:security
```

This will test:
- XSS protection
- NoSQL injection protection
- SQL injection protection
- Rate limiting
- Password hashing
- JWT security

## 📊 Database Schema

### User Model
```typescript
{
  email: string (unique, indexed)
  password: string (hashed)
  lastLogin: Date
  loginCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Expense Model
```typescript
{
  userId: ObjectId (ref: User, indexed)
  title: string
  amount: number
  category: ExpenseCategory
  type: 'income' | 'expense'
  description: string (optional)
  date: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret-min-32-chars
JWT_EXPIRES_IN=7d
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build for Production
```bash
pnpm run build
pnpm start
```

## 📝 Design Decisions

### Why TypeScript?
- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Easier refactoring and maintenance
- Industry standard for enterprise applications

### Why Service Layer?
- Separation of concerns (SOLID principle)
- Business logic separated from controllers
- Easier to test and maintain
- Reusable across different controllers

### Why HTTP-only Cookies?
- More secure than localStorage (XSS protection)
- Automatically sent with requests
- Cannot be accessed via JavaScript
- Meets WanderOn requirement for non-sticky cookies

### Why bcrypt with 12 rounds?
- Industry standard for password hashing
- 12 rounds provides good balance between security and performance
- Resistant to rainbow table attacks
- Future-proof against increasing computational power

## 🐛 Error Handling

All errors are handled consistently:
- Custom error classes for different error types
- Proper HTTP status codes
- User-friendly error messages
- Detailed error logging in development
- Generic error messages in production

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Security Guidelines](https://owasp.org/)


