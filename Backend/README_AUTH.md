# JWT Authentication System

This document describes the JWT authentication system implemented in the Vehicle Booking API.

## Overview

The API now uses JWT (JSON Web Tokens) for authentication and authorization. All protected endpoints require a valid JWT token in the Authorization header.

## Configuration

### JWT Settings (appsettings.json)

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-with-at-least-32-characters",
    "Issuer": "VehicleBookingAPI",
    "Audience": "VehicleBookingClient",
    "ExpirationMinutes": 60
  }
}
```

**Important**: Change the `SecretKey` in production to a secure, randomly generated key.

## Authentication Endpoints

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "User"
}
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User",
    "isActive": true
  }
}
```

### 3. Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

### 4. Change Password
```
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

## Using Protected Endpoints

Include the JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

## Role-Based Access Control

### Admin Role
- Can access all endpoints
- Can view, create, update, and delete all resources
- Can manage users, vehicles, drivers, bookings, and payments

### User Role
- Can only access their own data
- Can view and manage their own bookings and payments
- Cannot access admin-only endpoints

## Protected Controllers

All main controllers now require authentication:

- **UserController**: `[Authorize]` - Users can only access their own profile, admins can access all
- **VehicleController**: `[Authorize]` - Read access for all authenticated users, write access for admins only
- **BookingController**: `[Authorize]` - Users can only access their own bookings, admins can access all
- **DriverController**: `[Authorize]` - Read access for all authenticated users, write access for admins only
- **PaymentController**: `[Authorize]` - Users can only access their own payments, admins can access all

## Testing Authentication

### Public Endpoint (No Auth Required)
```
GET /api/test/public
```

### Protected Endpoint (Auth Required)
```
GET /api/test/protected
Authorization: Bearer {token}
```

### Admin-Only Endpoint
```
GET /api/test/admin
Authorization: Bearer {token}
```

### User-Only Endpoint
```
GET /api/test/user
Authorization: Bearer {token}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using SHA256 before storage
2. **JWT Validation**: Tokens are validated for signature, expiration, issuer, and audience
3. **Role-Based Access**: Different endpoints require different user roles
4. **User Isolation**: Regular users can only access their own data
5. **Token Expiration**: JWT tokens expire after 60 minutes (configurable)

## Frontend Integration

To use the authenticated API from the frontend:

1. Call `/api/auth/login` to get a JWT token
2. Store the token securely (localStorage, sessionStorage, or secure cookie)
3. Include the token in all subsequent API calls:
   ```typescript
   const response = await fetch('/api/user/1', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

## Error Handling

- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: Valid token but insufficient permissions
- **400 Bad Request**: Invalid request data
- **500 Internal Server Error**: Server-side errors

## Production Considerations

1. **Change the JWT secret key** to a secure, randomly generated value
2. **Use HTTPS** in production
3. **Implement refresh token storage** in a database for better security
4. **Add rate limiting** to prevent brute force attacks
5. **Consider using Identity Server** for enterprise applications
6. **Implement token blacklisting** for logout functionality

## Troubleshooting

### Common Issues

1. **"Invalid token" errors**: Check if the token is properly formatted and not expired
2. **"Forbidden" errors**: Check if the user has the required role
3. **"Unauthorized" errors**: Check if the Authorization header is properly set

### Debug Endpoints

Use the test endpoints to verify authentication:
- `/api/test/public` - Should work without authentication
- `/api/test/protected` - Should work with valid token
- `/api/test/admin` - Should only work with admin role
- `/api/test/user` - Should work with any authenticated user 