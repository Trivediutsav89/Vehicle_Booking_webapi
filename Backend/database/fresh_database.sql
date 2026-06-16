-- Fresh Database Setup for Vehicle Booking System
-- This script will completely reset your database and create fresh tables with sample data
-- WARNING: This will delete ALL existing data and recreate everything from scratch!

USE master;
GO

-- Drop the database if it exists and recreate it
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'vehicle_booking')
BEGIN
    ALTER DATABASE vehicle_booking SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE vehicle_booking;
    PRINT 'Existing vehicle_booking database dropped.';
END
GO

-- Create fresh database
CREATE DATABASE vehicle_booking;
PRINT 'Fresh vehicle_booking database created.';
GO

-- Use the new database
USE vehicle_booking;
GO

-- Create Users table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) CHECK (Role IN ('Admin', 'User')) NOT NULL,
    IsActive BIT DEFAULT 1
);
PRINT 'Users table created.';
GO

-- Create Vehicles table
CREATE TABLE Vehicles (
    VehicleID INT PRIMARY KEY IDENTITY(1,1),
    VehicleNumber NVARCHAR(50) UNIQUE NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Model NVARCHAR(100) NOT NULL,
    Capacity INT NOT NULL,
    RatePerKM DECIMAL(10, 2) NOT NULL,
    IsAvailable BIT DEFAULT 1
);
PRINT 'Vehicles table created.';
GO

-- Create Drivers table
CREATE TABLE Drivers (
    DriverID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(15) UNIQUE NOT NULL,
    AssignedVehicleID INT UNIQUE,
    FOREIGN KEY (AssignedVehicleID) REFERENCES Vehicles(VehicleID),
    IsActive BIT DEFAULT 1
);
PRINT 'Drivers table created.';
GO

-- Create Bookings table
CREATE TABLE Bookings (
    BookingID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    VehicleID INT NOT NULL,
    FromDateTime DATETIME NOT NULL,
    ToDateTime DATETIME NOT NULL,
    Status NVARCHAR(20) CHECK (Status IN ('Pending', 'Confirmed', 'Cancelled')) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID)
);
PRINT 'Bookings table created.';
GO

-- Create Payments table
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    BookingID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) CHECK (Status IN ('Completed', 'Pending', 'Failed')) DEFAULT 'Pending',
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID)
);
PRINT 'Payments table created.';
GO

-- Insert Sample Users
INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive) VALUES
('John Doe', 'john.doe@example.com', 'hashed_password_123', 'Admin', 1),
('Jane Smith', 'jane.smith@example.com', 'hashed_password_456', 'User', 1),
('Mike Johnson', 'mike.johnson@example.com', 'hashed_password_789', 'User', 1),
('Sarah Wilson', 'sarah.wilson@example.com', 'hashed_password_101', 'User', 1),
('David Brown', 'david.brown@example.com', 'hashed_password_202', 'User', 1),
('Lisa Davis', 'lisa.davis@example.com', 'hashed_password_303', 'User', 0),
('Robert Miller', 'robert.miller@example.com', 'hashed_password_404', 'User', 1),
('Emily Taylor', 'emily.taylor@example.com', 'hashed_password_505', 'User', 1);
PRINT 'Sample users inserted.';
GO

-- Insert Sample Vehicles
INSERT INTO Vehicles (VehicleNumber, Type, Model, Capacity, RatePerKM, IsAvailable) VALUES
('MH12AB1234', 'Sedan', 'Toyota Camry', 4, 15.50, 1),
('MH12CD5678', 'SUV', 'Honda CR-V', 6, 18.75, 1),
('MH12EF9012', 'Hatchback', 'Maruti Swift', 5, 12.00, 1),
('MH12GH3456', 'Sedan', 'Hyundai Verna', 4, 14.25, 0),
('MH12IJ7890', 'SUV', 'Mahindra XUV500', 7, 20.00, 1),
('MH12KL1234', 'Luxury', 'BMW 5 Series', 4, 35.00, 1),
('MH12MN5678', 'Van', 'Toyota Innova', 8, 22.50, 1),
('MH12OP9012', 'Sedan', 'Honda City', 4, 16.00, 1),
('MH12QR3456', 'SUV', 'Ford EcoSport', 5, 17.50, 0),
('MH12ST7890', 'Hatchback', 'Hyundai i20', 5, 13.00, 1);
PRINT 'Sample vehicles inserted.';
GO

-- Insert Sample Drivers
INSERT INTO Drivers (Name, Phone, AssignedVehicleID, IsActive) VALUES
('Rajesh Kumar', '+91-9876543210', 1, 1),
('Amit Singh', '+91-9876543211', 2, 1),
('Suresh Patel', '+91-9876543212', 3, 1),
('Mohan Sharma', '+91-9876543213', 4, 0),
('Vikram Verma', '+91-9876543214', 5, 1),
('Rahul Gupta', '+91-9876543215', 6, 1),
('Anil Yadav', '+91-9876543216', 7, 1),
('Prakash Tiwari', '+91-9876543217', 8, 1);
PRINT 'Sample drivers inserted.';
GO

-- Insert Sample Bookings
INSERT INTO Bookings (UserID, VehicleID, FromDateTime, ToDateTime, Status, CreatedAt) VALUES
(2, 1, '2024-01-15 09:00:00', '2024-01-15 18:00:00', 'Confirmed', GETDATE()),
(3, 2, '2024-01-16 10:00:00', '2024-01-16 20:00:00', 'Confirmed', GETDATE()),
(4, 3, '2024-01-17 08:00:00', '2024-01-17 16:00:00', 'Pending', GETDATE()),
(5, 5, '2024-01-18 11:00:00', '2024-01-18 22:00:00', 'Confirmed', GETDATE()),
(7, 6, '2024-01-19 09:30:00', '2024-01-19 19:30:00', 'Confirmed', GETDATE()),
(8, 7, '2024-01-20 07:00:00', '2024-01-20 17:00:00', 'Pending', GETDATE()),
(2, 8, '2024-01-21 10:00:00', '2024-01-21 18:00:00', 'Confirmed', GETDATE()),
(3, 10, '2024-01-22 08:30:00', '2024-01-22 16:30:00', 'Cancelled', GETDATE()),
(4, 1, '2024-01-23 12:00:00', '2024-01-23 20:00:00', 'Confirmed', GETDATE()),
(5, 2, '2024-01-24 09:00:00', '2024-01-24 17:00:00', 'Pending', GETDATE());
PRINT 'Sample bookings inserted.';
GO

-- Insert Sample Payments
INSERT INTO Payments (BookingID, Amount, PaymentDate, Status) VALUES
(1, 139.50, '2024-01-15 09:00:00', 'Completed'),
(2, 187.50, '2024-01-16 10:00:00', 'Completed'),
(4, 220.00, '2024-01-18 11:00:00', 'Completed'),
(5, 350.00, '2024-01-19 09:30:00', 'Completed'),
(7, 160.00, '2024-01-21 10:00:00', 'Completed'),
(9, 139.50, '2024-01-23 12:00:00', 'Completed'),
(3, 96.00, '2024-01-17 08:00:00', 'Pending'),
(6, 225.00, '2024-01-20 07:00:00', 'Pending'),
(8, 104.00, '2024-01-22 08:30:00', 'Failed'),
(10, 150.00, '2024-01-24 09:00:00', 'Pending');
PRINT 'Sample payments inserted.';
GO

-- Display final data summary
PRINT '=== FINAL DATABASE SUMMARY ===';
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM Users
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM Vehicles
UNION ALL
SELECT 'Drivers', COUNT(*) FROM Drivers
UNION ALL
SELECT 'Bookings', COUNT(*) FROM Bookings
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payments;
GO

-- Show sample data from each table
PRINT '=== SAMPLE DATA PREVIEW ===';
PRINT 'Users:';
SELECT TOP 3 * FROM Users;
PRINT 'Vehicles:';
SELECT TOP 3 * FROM Vehicles;
PRINT 'Drivers:';
SELECT TOP 3 * FROM Drivers;
PRINT 'Bookings:';
SELECT TOP 3 * FROM Bookings;
PRINT 'Payments:';
SELECT TOP 3 * FROM Payments;
GO

PRINT '========================================';
PRINT 'FRESH DATABASE CREATED SUCCESSFULLY!';
PRINT 'All tables have been recreated with fresh sample data.';
PRINT 'All IDs start from 1.';
PRINT 'You can now test your frontend application.';
PRINT '========================================'; 