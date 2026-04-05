# Finance Data Processing and Access Control Backend

A production-ready Node.js backend application for managing financial records with role-based access control (RBAC), JWT authentication, and advanced analytics using MongoDB aggregation pipelines.

## 👤 Developer Information
- **Name:** Sarthak Sanjay Kate
- **Email:** katesarthak26@gmail.com
- **Role:** Full Stack Developer (AI & Data Science Specialization)

---

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full CRUD access to all records and system-wide statistics.
  - **Analyst**: Can create/view records and access detailed financial analytics.
  - **Viewer**: Read-only access to their own transaction history.
- **Financial Record Management**: Track income and expenses with detailed categorization.
- **Dashboard Analytics**: High-performance MongoDB aggregation for summary statistics.
- **Advanced Filtering**: Filter records by date range, category, and transaction type.
- **Input Validation**: Comprehensive validation using `express-validator`.
- **Security**: Implementation of Helmet, CORS, and `bcryptjs` password hashing.

---

## 📁 Project Structure

```text
FinanceDataProcessing/
├── models/
│   ├── User.js                # User schema with authentication logic
│   └── Record.js              # Financial record schema with indexing
├── controllers/
│   ├── authController.js      # Registration, login, profile management
│   ├── recordController.js    # CRUD operations for records with filtering
│   └── summaryController.js   # Dashboard analytics with aggregation
├── routes/
│   ├── authRoutes.js          # Authentication endpoints
│   ├── recordRoutes.js        # Record management endpoints
│   └── summaryRoutes.js       # Summary & analytics endpoints
├── middleware/
│   ├── auth.js                # JWT authentication & RBAC middleware
│   ├── errorHandler.js        # Global error handling
│   └── validation.js          # Input validation for all endpoints
├── config/
│   └── database.js            # MongoDB connection management
├── server.js                  # Main Express application entry point
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── QUICKSTART.md              # Setup guide for evaluators
├── postman-collection.json    # Ready-to-import Postman file
└── api-examples.sh            # Shell script with cURL examples

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

Markdown# Finance Data Processing and Access Control Backend

A production-ready Node.js backend application for managing financial records with role-based access control (RBAC), JWT authentication, and advanced analytics using MongoDB aggregation pipelines.

## 👤 Developer Information
- **Name:** Sarthak Sanjay Kate
- **Email:** katesarthak26@gmail.com
- **Role:** Full Stack Developer (AI & Data Science Specialization)

---

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full CRUD access to all records and system-wide statistics.
  - **Analyst**: Can create/view records and access detailed financial analytics.
  - **Viewer**: Read-only access to their own transaction history.
- **Financial Record Management**: Track income and expenses with detailed categorization.
- **Dashboard Analytics**: High-performance MongoDB aggregation for summary statistics.
- **Advanced Filtering**: Filter records by date range, category, and transaction type.
- **Input Validation**: Comprehensive validation using `express-validator`.
- **Security**: Implementation of Helmet, CORS, and `bcryptjs` password hashing.

---

## 📁 Project Structure

```text
FinanceDataProcessing/
├── models/
│   ├── User.js                # User schema with authentication logic
│   └── Record.js              # Financial record schema with indexing
├── controllers/
│   ├── authController.js      # Registration, login, profile management
│   ├── recordController.js    # CRUD operations for records with filtering
│   └── summaryController.js   # Dashboard analytics with aggregation
├── routes/
│   ├── authRoutes.js          # Authentication endpoints
│   ├── recordRoutes.js        # Record management endpoints
│   └── summaryRoutes.js       # Summary & analytics endpoints
├── middleware/
│   ├── auth.js                # JWT authentication & RBAC middleware
│   ├── errorHandler.js        # Global error handling
│   └── validation.js          # Input validation for all endpoints
├── config/
│   └── database.js            # MongoDB connection management
├── server.js                  # Main Express application entry point
├── package.json               # Project dependencies and scripts
├── README.md                  # Project documentation
├── QUICKSTART.md              # Setup guide for evaluators
├── postman-collection.json    # Ready-to-import Postman file
└── api-examples.sh            # Shell script with cURL examples
🛠️ Installation & SetupPrerequisitesNode.js (v14+)MongoDB (Local instance or Atlas)npmStepsNavigate to the project directoryBashcd FinanceDataProcessing
Install dependenciesBashnpm install
Configure environment variablesCreate a .env file in the root directory:Code snippetPORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
JWT_EXPIRE=7d
Start the serverBash# Development (with nodemon)
npm run dev

# Production
npm start
📚 API Endpoints SummaryAuthenticationMethodEndpointAccessPOST/api/auth/registerPublicPOST/api/auth/loginPublicGET/api/auth/profileProtectedRecords (CRUD)MethodEndpointPermissionGET/api/recordsViewer+ (Own only)POST/api/recordsAnalyst+PUT/api/records/:idAnalyst+ (Own) / Admin (All)DELETE/api/records/:idAdmin OnlyAnalyticsMethodEndpointPermissionGET/api/summaryAnalyst+GET/api/summary/adminAdmin Only🧪 Testing with cURL1. Register Sarthak Kate (Admin)Bashcurl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarthak Kate",
    "email": "katesarthak26@gmail.com",
    "password": "password123",
    "role": "Admin"
  }'
2. LoginBashcurl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "katesarthak26@gmail.com",
    "password": "password123"
  }'
🔒 Security Best Practices ImplementedPassword Hashing: Passwords are never stored in plain text; bcryptjs is used with a salt factor of 10.JWT Security: Tokens are issued with an expiration and required for all sensitive routes.NoSQL Injection Prevention: Mongoose schemas and strict validation prevent malicious query injections.Error Privacy: Global error handlers ensure that sensitive stack traces are not leaked to the client in production.📝 LicenseThis project is licensed under the MIT License.
📞 ContactFor any queries regarding this implementation, please reach out to Sarthak Sanjay Kate at katesarthak26@gmail.com.
