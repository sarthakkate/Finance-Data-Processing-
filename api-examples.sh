#!/bin/bash
# Finance Backend - API Curl Examples
# Copy and paste these commands to test the API

# ============================================
# 1. AUTHENTICATION EXAMPLES
# ============================================

# Register a new user
echo "=== Registering new user ==="
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Analyst",
    "email": "john.analyst@example.com",
    "password": "securePassword123",
    "role": "Analyst"
  }'

# Login and get token
echo -e "\n\n=== Logging in ==="
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.analyst@example.com",
    "password": "securePassword123"
  }'

# Get user profile (replace TOKEN with actual token)
echo -e "\n\n=== Getting user profile ==="
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN_HERE"

# ============================================
# 2. RECORD CREATION EXAMPLES
# ============================================

# Create income record
echo -e "\n\n=== Creating income record ==="
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "Income",
    "category": "Salary",
    "date": "2024-01-15T00:00:00Z",
    "description": "Monthly salary"
  }'

# Create expense record
echo -e "\n\n=== Creating expense record ==="
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.50,
    "type": "Expense",
    "category": "Food",
    "date": "2024-01-15T00:00:00Z",
    "description": "Grocery shopping"
  }'

# ============================================
# 3. RECORD RETRIEVAL & FILTERING EXAMPLES
# ============================================

# Get all records (paginated)
echo -e "\n\n=== Getting all records ==="
curl -X GET "http://localhost:5000/api/records?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get records with date range filter
echo -e "\n\n=== Getting records by date range ==="
curl -X GET "http://localhost:5000/api/records?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get expense records only
echo -e "\n\n=== Getting expense records ==="
curl -X GET "http://localhost:5000/api/records?type=Expense" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get records by category
echo -e "\n\n=== Getting food expense records ==="
curl -X GET "http://localhost:5000/api/records?category=Food&type=Expense" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get single record
echo -e "\n\n=== Getting single record ==="
curl -X GET "http://localhost:5000/api/records/RECORD_ID_HERE" \
  -H "Authorization: Bearer TOKEN_HERE"

# ============================================
# 4. RECORD UPDATE & DELETE EXAMPLES
# ============================================

# Update a record
echo -e "\n\n=== Updating record ==="
curl -X PUT "http://localhost:5000/api/records/RECORD_ID_HERE" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 200,
    "category": "Transport"
  }'

# Delete a record (Admin only)
echo -e "\n\n=== Deleting record ==="
curl -X DELETE "http://localhost:5000/api/records/RECORD_ID_HERE" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# ============================================
# 5. SUMMARY & ANALYTICS EXAMPLES
# ============================================

# Get dashboard summary
echo -e "\n\n=== Getting dashboard summary ==="
curl -X GET "http://localhost:5000/api/summary?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get advanced analytics
echo -e "\n\n=== Getting advanced analytics ==="
curl -X GET "http://localhost:5000/api/summary/advanced" \
  -H "Authorization: Bearer TOKEN_HERE"

# Get admin summary (Admin only)
echo -e "\n\n=== Getting admin summary ==="
curl -X GET "http://localhost:5000/api/summary/admin" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"

# ============================================
# 6. HEALTH CHECK
# ============================================

echo -e "\n\n=== Health check ==="
curl -X GET http://localhost:5000/api/health

# ============================================
# 7. ERROR EXAMPLE - Invalid Token
# ============================================

echo -e "\n\n=== Testing invalid token ==="
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer INVALID_TOKEN"

# ============================================
# 8. ERROR EXAMPLE - Unauthorized Access
# ============================================

echo -e "\n\n=== Testing unauthorized access (Viewer trying to create record) ==="
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer VIEWER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "type": "Expense",
    "category": "Food"
  }'

# ============================================
# NOTES
# ============================================
# Replace TOKEN_HERE with actual JWT token from login response
# Replace RECORD_ID_HERE with actual record ID
# Replace ADMIN_TOKEN_HERE with admin user token
# Replace VIEWER_TOKEN_HERE with viewer user token
#
# Date format: ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
# Categories: Salary, Bonus, Investment, Other Income, Food, Transport, Utilities, Entertainment, Healthcare, Education, Other Expense
