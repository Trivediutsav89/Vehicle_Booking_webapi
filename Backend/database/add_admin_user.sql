-- Add Admin User for Testing
-- This script adds an admin user to the database
-- The password is hashed using SHA256 (password: admin123)

-- First, check if admin user already exists
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@vehiclebooking.com')
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive)
    VALUES (
        'Admin User',
        'admin@vehiclebooking.com',
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA256 hash of 'admin123'
        'Admin',
        1
    );
    
    PRINT 'Admin user created successfully!';
    PRINT 'Email: admin@vehiclebooking.com';
    PRINT 'Password: admin123';
    PRINT 'Role: Admin';
END
ELSE
BEGIN
    PRINT 'Admin user already exists!';
    PRINT 'Email: admin@vehiclebooking.com';
    PRINT 'Password: admin123';
    PRINT 'Role: Admin';
END

-- Also add a regular user for testing
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'user@vehiclebooking.com')
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive)
    VALUES (
        'Regular User',
        'user@vehiclebooking.com',
        'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- SHA256 hash of 'user123'
        'User',
        1
    );
    
    PRINT 'Regular user created successfully!';
    PRINT 'Email: user@vehiclebooking.com';
    PRINT 'Password: user123';
    PRINT 'Role: User';
END
ELSE
BEGIN
    PRINT 'Regular user already exists!';
    PRINT 'Email: user@vehiclebooking.com';
    PRINT 'Password: user123';
    PRINT 'Role: User';
END

-- Display all users
SELECT UserId, Name, Email, Role, IsActive FROM Users ORDER BY UserId; 