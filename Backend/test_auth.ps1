# Test JWT Authentication Endpoints
# Make sure the backend is running before executing this script

$baseUrl = "http://localhost:5015/api"

Write-Host "=== Testing JWT Authentication Endpoints ===" -ForegroundColor Green
Write-Host ""

# Test 1: Public endpoint (no auth required)
Write-Host "1. Testing public endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/public" -Method Get
    Write-Host "   ✓ Public endpoint works: $($response)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Public endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Protected endpoint (should fail without token)
Write-Host "2. Testing protected endpoint without token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/protected" -Method Get
    Write-Host "   ✗ Protected endpoint should have failed without token" -ForegroundColor Red
} catch {
    Write-Host "   ✓ Protected endpoint correctly rejected request: $($_.Exception.Message)" -ForegroundColor Green
}
Write-Host ""

# Test 3: Register a new user
Write-Host "3. Testing user registration..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "password123"
    role = "User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "   ✓ User registered successfully" -ForegroundColor Green
    Write-Host "   Token: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
    $token = $response.token
} catch {
    Write-Host "   ✗ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Trying to login with existing user..." -ForegroundColor Yellow
    
    # Try to login instead
    $loginData = @{
        email = "testuser@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        Write-Host "   ✓ User login successful" -ForegroundColor Green
        Write-Host "   Token: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
        $token = $response.token
    } catch {
        Write-Host "   ✗ User login failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Skipping remaining tests..." -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Test 4: Protected endpoint with token
Write-Host "4. Testing protected endpoint with token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/test/protected" -Method Get -Headers $headers
    Write-Host "   ✓ Protected endpoint works with token" -ForegroundColor Green
    Write-Host "   User ID: $($response.userId)" -ForegroundColor Cyan
    Write-Host "   User Email: $($response.userEmail)" -ForegroundColor Cyan
    Write-Host "   User Role: $($response.userRole)" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Protected endpoint failed with token: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get current user
Write-Host "5. Testing get current user..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
    Write-Host "   ✓ Get current user works: $($response.name) - $($response.email)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Get current user failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: User-only endpoint
Write-Host "6. Testing user-only endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/user" -Method Get -Headers $headers
    Write-Host "   ✓ User-only endpoint works: $($response)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ User-only endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Admin-only endpoint (should fail for regular user)
Write-Host "7. Testing admin-only endpoint with regular user..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test/admin" -Method Get -Headers $headers
    Write-Host "   ✗ Admin endpoint should have failed for regular user" -ForegroundColor Red
} catch {
    Write-Host "   ✓ Admin endpoint correctly rejected regular user: $($_.Exception.Message)" -ForegroundColor Green
}
Write-Host ""

# Test 8: Try to access protected user endpoint
Write-Host "8. Testing protected user endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/user/1" -Method Get -Headers $headers
    Write-Host "   ✓ User endpoint works (if user ID 1 exists)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ User endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Authentication Tests Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create an admin user in the database" -ForegroundColor White
Write-Host "2. Test admin endpoints with admin token" -ForegroundColor White
Write-Host "3. Test other protected endpoints" -ForegroundColor White
Write-Host "4. Integrate with frontend" -ForegroundColor White 