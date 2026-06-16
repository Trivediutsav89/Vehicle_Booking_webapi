@echo off
echo Starting Vehicle Booking Backend with JWT Authentication...
echo.
echo Make sure you have:
echo 1. .NET 8.0 SDK installed
echo 2. SQL Server running
echo 3. Database created and migrated
echo.
echo Press any key to continue...
pause > nul

echo.
echo Building the project...
dotnet build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Build successful! Starting the application...
echo.
echo The API will be available at:
echo - HTTP: http://localhost:5015
echo - Swagger UI: http://localhost:5015/swagger
echo.
echo Press Ctrl+C to stop the application
echo.

dotnet run

pause 