# Finance Data Processing and Access Control Backend

A production-ready Node.js backend application for managing financial records with role-based access control (RBAC), JWT authentication, and advanced analytics using MongoDB aggregation pipelines.

## Features

- **User Authentication**: JWT-based authentication system
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full CRUD access to all records
  - **Analyst**: Can create and view records, access analytics
  - **Viewer**: Read-only access to own records
- **Financial Record Management**: Track income and expenses with categorization
- **Dashboard Analytics**: MongoDB aggregation for summary statistics
- **Advanced Filtering**: Filter records by date range, category, and type
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Global error handling middleware
- **Security**: Helmet, CORS, bcryptjs password hashing

## Project Structure

```
zonsor/
├── models/                 # Mongoose schemas
│   ├── User.js            # User model with authentication
│   └── Record.js          # Financial record model
├── controllers/           # Business logic
│   ├── authController.js  # Auth operations
│   ├── recordController.js # Record CRUD operations
│   └── summaryController.js # Analytics and summary
├── routes/                # API endpoints
│   ├── authRoutes.js      # Auth endpoints
│   ├── recordRoutes.js    # Record endpoints
│   └── summaryRoutes.js   # Summary endpoints
├── middleware/            # Express middleware
│   ├── auth.js           # JWT authentication & RBAC
│   ├── errorHandler.js   # Error handling
│   └── validation.js     # Input validation
├── config/               # Configuration files
│   └── database.js       # MongoDB connection
├── server.js             # Main server file
├── package.json          # Dependencies
└── .env                  # Environment variables
```

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Steps

1. **Clone/Copy the project**
   ```bash
   cd zonsor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file with your MongoDB URI and JWT secret
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/finance_db
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=7d
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the server**
   ```bash
   # Development with nodemon
   npm run dev

   # Production
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Analyst"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Analyst",
    "status": "Active"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Record Endpoints

#### Get All Records (with filtering)
```http
GET /api/records?page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31&category=Food&type=Expense
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10, max: 100)
- `startDate`: ISO 8601 date format
- `endDate`: ISO 8601 date format
- `category`: Category name
- `type`: 'Income' or 'Expense'

#### Get Single Record
```http
GET /api/records/:id
Authorization: Bearer <token>
```

#### Create Record (Analyst/Admin only)
```http
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.50,
  "type": "Expense",
  "category": "Food",
  "date": "2024-01-15T00:00:00Z",
  "description": "Grocery shopping"
}
```

#### Update Record (Analyst/Admin only)
```http
PUT /api/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200.00,
  "category": "Transport"
}
```

#### Delete Record (Admin only)
```http
DELETE /api/records/:id
Authorization: Bearer <token>
```

### Summary/Analytics Endpoints

#### Get Dashboard Summary (Analyst/Admin only)
```http
GET /api/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalIncome": 5000,
    "totalExpense": 3000,
    "netBalance": 2000,
    "incomeCount": 5,
    "expenseCount": 15,
    "periodStart": "2024-01-01",
    "periodEnd": "2024-12-31"
  },
  "categoryBreakdown": [
    {
      "_id": "Food",
      "total": 800,
      "count": 10,
      "type": "Expense"
    },
    ...
  ],
  "recentTransactions": [...]
}
```

#### Get Advanced Analytics (Analyst/Admin only)
```http
GET /api/summary/advanced?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Get Admin Summary (Admin only)
```http
GET /api/summary/admin
Authorization: Bearer <token>
```

**Response includes:**
- Total records in system
- Total income/expense across all users
- Top 5 users by expense
- Most active categories

## Role-Based Access Control

| Endpoint | Viewer | Analyst | Admin |
|----------|--------|---------|-------|
| `/api/records` (GET) | Own only | Own only | All |
| `/api/records/:id` (GET) | Own only | Own only | All |
| `/api/records` (POST) | ✗ | ✓ | ✓ |
| `/api/records/:id` (PUT) | ✗ | Own only | All |
| `/api/records/:id` (DELETE) | ✗ | ✗ | ✓ |
| `/api/summary` (GET) | ✗ | ✓ | ✓ |
| `/api/summary/advanced` (GET) | ✗ | ✓ | ✓ |
| `/api/summary/admin` (GET) | ✗ | ✗ | ✓ |

## Categories

**Income Categories:**
- Salary
- Bonus
- Investment
- Other Income

**Expense Categories:**
- Food
- Transport
- Utilities
- Entertainment
- Healthcare
- Education
- Other Expense

## Error Handling

All errors are returned in a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/finance_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# API
API_BASE_URL=http://localhost:5000
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Analyst"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Record (replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.50,
    "type": "Expense",
    "category": "Food",
    "description": "Lunch"
  }'
```

### Get Summary
```bash
curl -X GET "http://localhost:5000/api/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer TOKEN"
```

## Database Schema

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, email format),
  password: String (required, hashed, 6+ chars),
  role: String (enum: 'Admin', 'Analyst', 'Viewer'),
  status: String (enum: 'Active', 'Inactive'),
  createdAt: Date,
  updatedAt: Date
}
```

### Record Schema
```javascript
{
  amount: Number (required, >= 0),
  type: String (required, enum: 'Income', 'Expense'),
  category: String (required, from predefined list),
  date: Date (default: now),
  description: String (optional, max 500 chars),
  userId: ObjectId (required, ref to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Best Practices Implemented

✓ **Security:**
- Password hashing with bcryptjs
- JWT token-based authentication
- Helmet for security headers
- CORS enabled
- Input validation

✓ **Database:**
- Indexed fields for performance (userId, category, type, date)
- Proper schema validation
- Automatic timestamps

✓ **Code Quality:**
- Modular folder structure
- Separation of concerns
- Comprehensive error handling
- Input validation middleware
- Consistent response format

✓ **Scalability:**
- Pagination support
- Efficient aggregation queries
- Indexed database queries
- Connection pooling

## Future Enhancements

- Rate limiting middleware
- Caching layer (Redis)
- Audit logging
- Export data (CSV/PDF)
- Budget management and alerts
- Recurring transactions
- Multi-currency support
- Two-factor authentication
- Email notifications

## License

MIT

## Support

For issues or questions, please refer to the code comments and API documentation.
