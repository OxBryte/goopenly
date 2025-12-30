# Backend API Documentation

This document describes the Next.js API routes that power the Openly backend.

## Architecture

The backend is built using Next.js API Routes (App Router), which provides:
- Server-side API endpoints
- Built-in authentication with Clerk
- Database integration with MongoDB
- Type-safe request/response handling

## API Structure

```
app/api/
├── protected/          # Routes requiring authentication
│   ├── payment/        # Payment-related endpoints
│   ├── product/        # Product management
│   ├── wallet/         # Wallet operations
│   └── unique-name/    # Unique name management
├── public/             # Public endpoints (no auth)
│   ├── payment/        # Public payment endpoints
│   └── p/              # Public product access
└── webhooks/           # Webhook handlers
```

## Protected Routes

All protected routes require Clerk authentication. The `requireAuth` middleware handles authentication and returns the authenticated user.

### Payment Endpoints

#### GET `/api/protected/payment/earnings`
Get earnings by status for authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (pending, completed, failed, cancelled)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEarningsUSDC": "1000000000",
    "totalEarningsUSD": "1000.00",
    "totalPayments": 10,
    "earningsByStatus": {
      "pending": 2,
      "completed": 8,
      "failed": 0,
      "cancelled": 0
    },
    "payments": [...]
  }
}
```

#### GET `/api/protected/payment/transactions`
Get transaction history for authenticated user.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

#### GET `/api/protected/payment/sales-heatmap`
Get sales heatmap data (365 days).

**Response:**
```json
{
  "success": true,
  "data": {
    "heatmapData": [
      { "date": "2024-01-01", "value": 100.50 },
      ...
    ],
    "totalDays": 365,
    "totalSales": 50,
    "dateRange": {
      "start": "2023-01-01T00:00:00.000Z",
      "end": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Product Endpoints

#### POST `/api/protected/product`
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "priceUSD": 99.99,
  "imageUrl": "https://...",
  "category": "Category",
  "allowMultiplePayments": false
}
```

#### GET `/api/protected/product`
Get all products for authenticated user (paginated).

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `isActive` (optional): Filter by active status

#### PUT `/api/protected/product/[productId]`
Update a product.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "priceUSD": 149.99,
  "isActive": true
}
```

#### GET `/api/protected/product/stats`
Get product statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 10,
    "activeProducts": 8,
    "inactiveProducts": 2,
    "totalPayments": 50,
    "totalRevenueUSDC": "5000000000",
    "totalRevenueUSD": "5000.00"
  }
}
```

### Wallet Endpoints

#### GET `/api/protected/wallet/balance`
Get wallet balance for authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": "1000000000",
    "currency": "USDC"
  }
}
```

#### POST `/api/protected/wallet/withdraw/single`
Initiate single asset withdrawal.

**Request Body:**
```json
{
  "amount": "1000000",
  "currency": "USDC",
  "toAddress": "0x..."
}
```

### Unique Name Endpoints

#### GET `/api/protected/unique-name`
Get user's unique name.

**Response:**
```json
{
  "success": true,
  "data": {
    "uniqueName": "username"
  }
}
```

#### POST `/api/protected/unique-name`
Set user's unique name.

**Request Body:**
```json
{
  "uniqueName": "username"
}
```

#### GET `/api/protected/unique-name/check/[uniqueName]`
Check if unique name is available.

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "uniqueName": "username"
  }
}
```

## Public Routes

Public routes don't require authentication.

### Payment Endpoints

#### POST `/api/public/payment/intent`
Create a payment intent for a payment link.

**Request Body:**
```json
{
  "paymentLink": "product-slug"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentIntentId": "pi_...",
    "clientSecret": "pi_..._secret_...",
    "amount": 9999,
    "currency": "usd"
  }
}
```

### Product Endpoints

#### GET `/api/public/p/[uniqueName]/[slug]`
Get product by unique name and slug (public access).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Product Name",
    "description": "Description",
    "priceUSD": 99.99,
    "priceUSDC": "99990000",
    "paymentLink": "product-slug",
    "imageUrl": "https://...",
    "category": "Category",
    "seller": {
      "uniqueName": "username",
      "name": "Seller Name"
    }
  }
}
```

## Webhooks

### POST `/api/webhooks/stripe`
Handle Stripe webhook events.

### POST `/api/webhooks/clerk`
Handle Clerk user events (user.created, user.updated, etc.).

### POST `/api/webhooks/blockradar`
Handle Blockradar webhook events.

## Authentication

All protected routes use the `requireAuth` middleware from `lib/api/auth.ts`, which:
1. Verifies Clerk authentication
2. Retrieves user from database
3. Returns 401 if not authenticated
4. Returns 404 if user not found in database

## API Client

The API client (`lib/api/client.ts`) automatically:
- Uses local API routes if `NEXT_PUBLIC_API_URL` is not set
- Falls back to external API if configured
- Handles authentication tokens
- Provides type-safe request/response handling

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": {} // Optional error details
}
```

Status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., unique name taken)
- `500`: Internal Server Error

## Database Models

The backend uses MongoDB with Mongoose models:
- `User`: User accounts
- `Product`: Products
- `Payment`: Payment transactions
- `PaymentLink`: Payment links

## Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `CLERK_SECRET_KEY`: Clerk secret key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `BLOCKRADAR_API_KEY`: Blockradar API key
- `NEXT_PUBLIC_API_URL` (optional): External API URL (if not using local routes)

