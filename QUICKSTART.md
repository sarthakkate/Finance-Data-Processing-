/**
 * Quick Start Guide
 * Step-by-step instructions to get the Finance Backend running
 */

## INSTALLATION STEPS

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
- Update `.env` with your MongoDB URI
- Change JWT_SECRET to something secure in production

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, just update MONGODB_URI in .env
```

### 4. Run the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Verify the Server
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## QUICK TEST WORKFLOW

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "demo123456",
    "role": "Analyst"
  }'
```

Save the returned `token`

### 2. Create a Record
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "type": "Expense",
    "category": "Food",
    "description": "Lunch"
  }'
```

### 3. Get Dashboard Summary
```bash
curl -X GET "http://localhost:5000/api/summary" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## POSTMAN SETUP

1. Import `postman-collection.json` into Postman
2. Set the `base_url` variable to `http://localhost:5000`
3. After login, copy the token and set it in the `token` variable
4. Now you can test all endpoints!

---

## FOLDER STRUCTURE OVERVIEW

```
zonsor/
├── models/           - Data schemas
├── controllers/      - Business logic
├── routes/           - API endpoints
├── middleware/       - Auth, validation, error handling
├── config/           - Database connection
├── utils/            - Helper functions
├── server.js         - Main entry point
├── package.json      - Dependencies
└── .env             - Configuration
```

---

## KEY CONCEPTS

### Roles
- **Viewer**: Read-only access to own records
- **Analyst**: Can create/view records and access analytics
- **Admin**: Full access including user management and deletion

### Authentication
- All protected endpoints require JWT token in header
- Token format: `Authorization: Bearer <token>`

### Error Handling
- All errors return consistent JSON format
- Check `success` field to determine if request succeeded
- Error details in `message` field

---

## TROUBLESHOOTING

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env is correct
- Try connecting locally first: `mongodb://localhost:27017/finance_db`

### Token Expired
- Log in again to get a new token
- Token expires based on JWT_EXPIRE setting in .env

### Access Denied
- Verify your user role has permission for the endpoint
- Check the RBAC table in README.md

### Validation Errors
- Ensure all required fields are provided
- Double-check field formats and types
- Review error message for specific field issues

---

## SECURITY NOTES

⚠️ **Before Deployment:**

1. Change `JWT_SECRET` in .env to a strong, random value
2. Set `NODE_ENV=production`
3. Configure `CORS` origin to specific domain
4. Use HTTPS in production
5. Enable MongoDB authentication
6. Use environment variables for sensitive data
7. Implement rate limiting for production
8. Add HTTPS/TLS to MongoDB connection

---

## TESTING with Different Roles

### Create Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123456",
    "role": "Admin"
  }'
```

### Create Viewer User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viewer User",
    "email": "viewer@example.com",
    "password": "viewer123456",
    "role": "Viewer"
  }'
```

### Test Each Role
- Viewer: Can only GET own records
- Analyst: Can POST, GET records, access summary
- Admin: Can do everything + delete records

---

## NEXT STEPS

1. Read the full README.md for API documentation
2. Explore the code structure to understand implementation
3. Customize categories in models/Record.js as needed
4. Add more analytics endpoints as required
5. Implement caching for frequently accessed data
6. Add rate limiting middleware for production

---

Happy coding! 🚀
