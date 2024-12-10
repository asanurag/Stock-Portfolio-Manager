# Stock Portfolio Management System

## Overview
A backend system for tracking and managing stock portfolios with real-time price updates and transaction history.

## Features
- User authentication and authorization
- Portfolio management (add/remove stocks)
- Transaction tracking
- Real-time stock price updates
- Historical price data
- Performance Analytics
- Caching system for improved performance

## Database Schema
User Collection -
Represents users in the system. Each user can have a single portfolio and multiple transactions.

Field	        Type	      Description
_id	          ObjectId	  Unique identifier for the user.
email	        String	    User's email address (unique).
password	    String	    Encrypted password for authentication.
createdAt	    Date	      Account creation timestamp.

Portfolio Collection -
Tracks a user's stock holdings. Each portfolio belongs to a single user.

Field	        Type	      Description
_id	          ObjectId	  Unique identifier for the portfolio.
userId	      ObjectId	  References the user owning the portfolio.
holdings	    Array	      List of holdings embedded in the portfolio.
lastUpdated	  Date	      Timestamp of the last update.
Embedded Document: Holdings

Field	          Type	      Description
symbol	        String	    Stock symbol (e.g., AAPL, TSLA).
shares	        Number	    Number of shares held.
averageCost	    Number	    Average cost per share.

Transaction Collection-
Logs all buy and sell operations for users. Each transaction belongs to a single user.

Field	          Type	      Description
_id	ObjectId	  Unique      identifier for the transaction.
userId	        ObjectId	  References the user who is making the transaction.
symbol	        String	    Stock symbol (e.g., AAPL, TSLA).
type	          String	    Type of transaction (BUY or SELL).
shares	        Number	    Number of shares bought/sold.
price	          Number	    Price per share during the transaction.
date	          Date	      Transaction timestamp.

Relationships
Database Collections -
User Collection:
{
  "email": String,
  "password": String,
  "createdAt": Date
}
1:1 relationship with Portfolio.
1:N relationship with Transaction.

Portfolio Collection:
{
  "userId": ObjectId,
  "holdings": [{
    "symbol": String,
    "shares": Number,
    "averageCost": Number
  }],
  "lastUpdated": Date
}
Contains N Holdings (embedded documents).
Belongs to one User.

Transaction Collection:
{
  "userId": ObjectId,
  "symbol": String,
  "type": Enum["BUY", "SELL"],
  "shares": Number,
  "price": Number,
  "date": Date
}
Belongs to one User.
Maintains historical data for all stock buy/sell operations.

## Technical Stack
- Node.js with Express
- MongoDB Atlas for database
- JWT for authentication
- Node-cache for caching

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git (optional)

### Installation Steps

1. Clone the repository (or download the code):
git clone <repository-url>
cd stock-portfolio-manager


2. Install dependencies:
npm install


3. Set up environment variables:
Create a .env file in the root directory with the following:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-secret-key-here


Replace your_mongodb_atlas_connection_string with your MongoDB Atlas connection string:
- Log in to MongoDB Atlas
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace <password> with your database user password

4. Run the application:
# Development mode with auto-reload
npm run dev

# Production mode
npm start


The server will start on port 5000 (http://localhost:5000)

## API Documentation using Postman

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.
json -
{
    "email": "shivam@example.com",
    "password": "1q2w3e4r"
}


#### POST /api/auth/login
Login and receive JWT token.
json -
{
  "email": "test@example.com",
  "password": "password123"
}

Response: 
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU4NDRmMGYzMWU2YzQ0N2NhZTY3YmEiLCJlbWFpbCI6InNoaXZhbUBleGFtcGxlLmNvbSIsImlhdCI6MTczMzgzODE2NCwiZXhwIjoxNzMzOTI0NTY0fQ.cqBFicMye8i2azqPjoO0PTy5w2tfuc5yuHqKTCbBczk"}

#### POST /api/portfolio/stock
POST http://localhost:5000/api/portfolio/stock
BODY - Raw - JSON

{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "AAPL",
    "shares": 10,
    "price": 175.50
}

{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "GOOGL",
    "shares": 5,
    "price": 142.75
}

{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "MSFT",
    "shares": 15,
    "price": 338.25
}

Get Portfolio Holdings:
#### GET http://localhost:5000/api/portfolio/holdings/675742231fa66686725bb7a0

{
    "holdings": [
        {
            "symbol": "AAPL",
            "shares": 10,
            "averageCost": 175.50,
            "currentPrice": 176.80,
            "currentValue": 1768.00,
            "gainLoss": 13.00
        },
        {
            "symbol": "GOOGL",
            "shares": 5,
            "averageCost": 142.75,
            "currentPrice": 144.20,
            "currentValue": 721.00,
            "gainLoss": 7.25
        },
        {
            "symbol": "MSFT",
            "shares": 15,
            "averageCost": 338.25,
            "currentPrice": 340.50,
            "currentValue": 5107.50,
            "gainLoss": 33.75
        }
    ]
}

Get Portfolio Value:
#### GET http://localhost:5000/api/portfolio/value/675742231fa66686725bb7a0
{
    "totalValue": 7596.50
}

#### DELETE http://localhost:5000/api/portfolio/stock
Remove stock from portfolio
json -
{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "AAPL",
    "shares": 5,
    "price": 176.80
}

Remove Stock (Sell Partial Position):
#### DELETE http://localhost:5000/api/portfolio/stock
json-
{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "AAPL",
    "shares": 5,
    "price": 176.80
}

Get Transaction History:
#### GET http://localhost:5000/api/transactions/675742231fa66686725bb7a0
{
    "transactions": [
        {
            "userId": "675742231fa66686725bb7a0",
            "symbol": "AAPL",
            "type": "BUY",
            "shares": 10,
            "price": 175.50,
            "date": "2024-12-10T10:30:00.000Z"
        },
        {
            "userId": "675742231fa66686725bb7a0",
            "symbol": "GOOGL",
            "type": "BUY",
            "shares": 5,
            "price": 142.75,
            "date": "2024-12-10T10:35:00.000Z"
        },
        {
            "userId": "675742231fa66686725bb7a0",
            "symbol": "MSFT",
            "type": "BUY",
            "shares": 15,
            "price": 338.25,
            "date": "2024-12-10T10:40:00.000Z"
        },
        {
            "userId": "675742231fa66686725bb7a0",
            "symbol": "AAPL",
            "type": "SELL",
            "shares": 5,
            "price": 176.80,
            "date": "2024-12-10T11:00:00.000Z"
        }
    ]
}

Testing Sequence:
1. First Buy Operation:
#### POST http://localhost:5000/api/portfolio/stock
{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "AAPL",
    "shares": 10,
    "price": 175.50
}

2. Check Holdings:
#### GET http://localhost:5000/api/portfolio/holdings/675742231fa66686725bb7a0

3. Add More Stocks:
#### POST http://localhost:5000/api/portfolio/stock
{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "GOOGL",
    "shares": 5,
    "price": 142.75
}

4. Check Updated Portfolio Value:
#### GET http://localhost:5000/api/portfolio/value/675742231fa66686725bb7a0

5. Sell Operation:
#### DELETE http://localhost:5000/api/portfolio/stock
{
    "userId": "675742231fa66686725bb7a0",
    "symbol": "AAPL",
    "shares": 5,
    "price": 176.80
}

6. Check Transaction History:
#### GET http://localhost:5000/api/transactions/675742231fa66686725bb7a0

## Performance Considerations
- Implemented caching for stock prices using node-cache (5-minute TTL)
- Database indexes on frequently queried fields
- Pagination for transaction history (100 records per request)
- Concurrent request handling through Express.js

## Error Handling
The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Security Considerations
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- MongoDB Atlas security features enabled

## Notes
- The stock price service currently uses mock data. In production, replace it with a real stock API service.
- Make sure to set appropriate indexes in MongoDB Atlas for optimal performance.
- Consider implementing rate limiting for production use.
