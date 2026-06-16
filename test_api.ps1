# Test script for Vehicle Booking API
Write-Host "Testing Vehicle Booking API..." -ForegroundColor Green

# Test User API
Write-Host "Testing User API:" -ForegroundColor Yellow
try {
    $users = Invoke-WebRequest -Uri "http://localhost:5015/api/user" -Method GET -UseBasicParsing
    Write-Host "GET /api/user - Success" -ForegroundColor Green
} catch {
    Write-Host "GET /api/user - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Vehicle API
Write-Host "Testing Vehicle API:" -ForegroundColor Yellow
try {
    $vehicles = Invoke-WebRequest -Uri "http://localhost:5015/api/vehicle" -Method GET -UseBasicParsing
    Write-Host "GET /api/vehicle - Success" -ForegroundColor Green
} catch {
    Write-Host "GET /api/vehicle - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Driver API
Write-Host "Testing Driver API:" -ForegroundColor Yellow
try {
    $drivers = Invoke-WebRequest -Uri "http://localhost:5015/api/driver" -Method GET -UseBasicParsing
    Write-Host "GET /api/driver - Success" -ForegroundColor Green
} catch {
    Write-Host "GET /api/driver - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Booking API
Write-Host "Testing Booking API:" -ForegroundColor Yellow
try {
    $bookings = Invoke-WebRequest -Uri "http://localhost:5015/api/booking" -Method GET -UseBasicParsing
    Write-Host "GET /api/booking - Success" -ForegroundColor Green
} catch {
    Write-Host "GET /api/booking - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Payment API
Write-Host "Testing Payment API:" -ForegroundColor Yellow
try {
    $payments = Invoke-WebRequest -Uri "http://localhost:5015/api/payment" -Method GET -UseBasicParsing
    Write-Host "GET /api/payment - Success" -ForegroundColor Green
} catch {
    Write-Host "GET /api/payment - Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "API Testing Complete!" -ForegroundColor Green 