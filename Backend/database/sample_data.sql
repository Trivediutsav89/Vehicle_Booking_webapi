-- Sample Data for Vehicle Booking System
-- Run this script in your SQL Server database

USE vehicle_booking;
GO

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM Payments;
-- DELETE FROM Bookings;
-- DELETE FROM Drivers;
-- DELETE FROM Vehicles;
-- DELETE FROM Users;
-- GO

-- Check current data and reset identity if needed
PRINT 'Current data counts:';
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

-- Insert Sample Users (only if table is empty)
IF NOT EXISTS (SELECT 1 FROM Users)
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, Role, IsActive) VALUES
    ('John Doe', 'john.doe@example.com', 'hashed_password_123', 'Admin', 1),
    ('Jane Smith', 'jane.smith@example.com', 'hashed_password_456', 'User', 1),
    ('Mike Johnson', 'mike.johnson@example.com', 'hashed_password_789', 'User', 1),
    ('Sarah Wilson', 'sarah.wilson@example.com', 'hashed_password_101', 'User', 1),
    ('David Brown', 'david.brown@example.com', 'hashed_password_202', 'User', 1),
    ('Lisa Davis', 'lisa.davis@example.com', 'hashed_password_303', 'User', 0),
    ('Robert Miller', 'robert.miller@example.com', 'hashed_password_404', 'User', 1),
    ('Emily Taylor', 'emily.taylor@example.com', 'hashed_password_505', 'User', 1);
    PRINT 'Users inserted successfully';
END
ELSE
BEGIN
    PRINT 'Users table already has data, skipping user insertion';
END
GO

-- Insert Sample Vehicles (only if table is empty)
IF NOT EXISTS (SELECT 1 FROM Vehicles)
BEGIN
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
    PRINT 'Vehicles inserted successfully';
END
ELSE
BEGIN
    PRINT 'Vehicles table already has data, skipping vehicle insertion';
END
GO

-- Get the actual Vehicle IDs for reference
DECLARE @VehicleIDs TABLE (RowNum INT IDENTITY(1,1), VehicleID INT);
INSERT INTO @VehicleIDs (VehicleID)
SELECT VehicleID FROM Vehicles ORDER BY VehicleID;

-- Insert Sample Drivers (only if table is empty)
IF NOT EXISTS (SELECT 1 FROM Drivers)
BEGIN
    -- Get first 8 vehicles for driver assignment
    DECLARE @Vehicle1 INT, @Vehicle2 INT, @Vehicle3 INT, @Vehicle4 INT, @Vehicle5 INT, @Vehicle6 INT, @Vehicle7 INT, @Vehicle8 INT;
    
    SELECT @Vehicle1 = VehicleID FROM @VehicleIDs WHERE RowNum = 1;
    SELECT @Vehicle2 = VehicleID FROM @VehicleIDs WHERE RowNum = 2;
    SELECT @Vehicle3 = VehicleID FROM @VehicleIDs WHERE RowNum = 3;
    SELECT @Vehicle4 = VehicleID FROM @VehicleIDs WHERE RowNum = 4;
    SELECT @Vehicle5 = VehicleID FROM @VehicleIDs WHERE RowNum = 5;
    SELECT @Vehicle6 = VehicleID FROM @VehicleIDs WHERE RowNum = 6;
    SELECT @Vehicle7 = VehicleID FROM @VehicleIDs WHERE RowNum = 7;
    SELECT @Vehicle8 = VehicleID FROM @VehicleIDs WHERE RowNum = 8;
    
    INSERT INTO Drivers (Name, Phone, AssignedVehicleID, IsActive) VALUES
    ('Rajesh Kumar', '+91-9876543210', @Vehicle1, 1),
    ('Amit Singh', '+91-9876543211', @Vehicle2, 1),
    ('Suresh Patel', '+91-9876543212', @Vehicle3, 1),
    ('Mohan Sharma', '+91-9876543213', @Vehicle4, 0),
    ('Vikram Verma', '+91-9876543214', @Vehicle5, 1),
    ('Rahul Gupta', '+91-9876543215', @Vehicle6, 1),
    ('Anil Yadav', '+91-9876543216', @Vehicle7, 1),
    ('Prakash Tiwari', '+91-9876543217', @Vehicle8, 1);
    PRINT 'Drivers inserted successfully';
END
ELSE
BEGIN
    PRINT 'Drivers table already has data, skipping driver insertion';
END
GO

-- Get the actual User IDs for reference
DECLARE @UserIDs TABLE (RowNum INT IDENTITY(1,1), UserID INT);
INSERT INTO @UserIDs (UserID)
SELECT UserID FROM Users ORDER BY UserID;

-- Get the actual Vehicle IDs for booking reference
DECLARE @BookingVehicleIDs TABLE (RowNum INT IDENTITY(1,1), VehicleID INT);
INSERT INTO @BookingVehicleIDs (VehicleID)
SELECT VehicleID FROM Vehicles ORDER BY VehicleID;

-- Insert Sample Bookings (only if table is empty)
IF NOT EXISTS (SELECT 1 FROM Bookings)
BEGIN
    DECLARE @User2 INT, @User3 INT, @User4 INT, @User5 INT, @User7 INT, @User8 INT;
    DECLARE @Veh1 INT, @Veh2 INT, @Veh3 INT, @Veh5 INT, @Veh6 INT, @Veh7 INT, @Veh8 INT, @Veh10 INT;
    
    SELECT @User2 = UserID FROM @UserIDs WHERE RowNum = 2;
    SELECT @User3 = UserID FROM @UserIDs WHERE RowNum = 3;
    SELECT @User4 = UserID FROM @UserIDs WHERE RowNum = 4;
    SELECT @User5 = UserID FROM @UserIDs WHERE RowNum = 5;
    SELECT @User7 = UserID FROM @UserIDs WHERE RowNum = 7;
    SELECT @User8 = UserID FROM @UserIDs WHERE RowNum = 8;
    
    SELECT @Veh1 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 1;
    SELECT @Veh2 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 2;
    SELECT @Veh3 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 3;
    SELECT @Veh5 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 5;
    SELECT @Veh6 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 6;
    SELECT @Veh7 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 7;
    SELECT @Veh8 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 8;
    SELECT @Veh10 = VehicleID FROM @BookingVehicleIDs WHERE RowNum = 10;
    
    INSERT INTO Bookings (UserID, VehicleID, FromDateTime, ToDateTime, Status, CreatedAt) VALUES
    (@User2, @Veh1, '2024-01-15 09:00:00', '2024-01-15 18:00:00', 'Confirmed', GETDATE()),
    (@User3, @Veh2, '2024-01-16 10:00:00', '2024-01-16 20:00:00', 'Confirmed', GETDATE()),
    (@User4, @Veh3, '2024-01-17 08:00:00', '2024-01-17 16:00:00', 'Pending', GETDATE()),
    (@User5, @Veh5, '2024-01-18 11:00:00', '2024-01-18 22:00:00', 'Confirmed', GETDATE()),
    (@User7, @Veh6, '2024-01-19 09:30:00', '2024-01-19 19:30:00', 'Confirmed', GETDATE()),
    (@User8, @Veh7, '2024-01-20 07:00:00', '2024-01-20 17:00:00', 'Pending', GETDATE()),
    (@User2, @Veh8, '2024-01-21 10:00:00', '2024-01-21 18:00:00', 'Confirmed', GETDATE()),
    (@User3, @Veh10, '2024-01-22 08:30:00', '2024-01-22 16:30:00', 'Cancelled', GETDATE()),
    (@User4, @Veh1, '2024-01-23 12:00:00', '2024-01-23 20:00:00', 'Confirmed', GETDATE()),
    (@User5, @Veh2, '2024-01-24 09:00:00', '2024-01-24 17:00:00', 'Pending', GETDATE());
    PRINT 'Bookings inserted successfully';
END
ELSE
BEGIN
    PRINT 'Bookings table already has data, skipping booking insertion';
END
GO

-- Get the actual Booking IDs for reference
DECLARE @BookingIDs TABLE (RowNum INT IDENTITY(1,1), BookingID INT);
INSERT INTO @BookingIDs (BookingID)
SELECT BookingID FROM Bookings ORDER BY BookingID;

-- Insert Sample Payments (only if table is empty)
IF NOT EXISTS (SELECT 1 FROM Payments)
BEGIN
    DECLARE @Booking1 INT, @Booking2 INT, @Booking3 INT, @Booking4 INT, @Booking5 INT, @Booking6 INT, @Booking7 INT, @Booking8 INT, @Booking9 INT, @Booking10 INT;
    
    SELECT @Booking1 = BookingID FROM @BookingIDs WHERE RowNum = 1;
    SELECT @Booking2 = BookingID FROM @BookingIDs WHERE RowNum = 2;
    SELECT @Booking3 = BookingID FROM @BookingIDs WHERE RowNum = 3;
    SELECT @Booking4 = BookingID FROM @BookingIDs WHERE RowNum = 4;
    SELECT @Booking5 = BookingID FROM @BookingIDs WHERE RowNum = 5;
    SELECT @Booking6 = BookingID FROM @BookingIDs WHERE RowNum = 6;
    SELECT @Booking7 = BookingID FROM @BookingIDs WHERE RowNum = 7;
    SELECT @Booking8 = BookingID FROM @BookingIDs WHERE RowNum = 8;
    SELECT @Booking9 = BookingID FROM @BookingIDs WHERE RowNum = 9;
    SELECT @Booking10 = BookingID FROM @BookingIDs WHERE RowNum = 10;
    
    INSERT INTO Payments (BookingID, Amount, PaymentDate, Status) VALUES
    (@Booking1, 139.50, '2024-01-15 09:00:00', 'Completed'),
    (@Booking2, 187.50, '2024-01-16 10:00:00', 'Completed'),
    (@Booking4, 220.00, '2024-01-18 11:00:00', 'Completed'),
    (@Booking5, 350.00, '2024-01-19 09:30:00', 'Completed'),
    (@Booking7, 160.00, '2024-01-21 10:00:00', 'Completed'),
    (@Booking9, 139.50, '2024-01-23 12:00:00', 'Completed'),
    (@Booking3, 96.00, '2024-01-17 08:00:00', 'Pending'),
    (@Booking6, 225.00, '2024-01-20 07:00:00', 'Pending'),
    (@Booking8, 104.00, '2024-01-22 08:30:00', 'Failed'),
    (@Booking10, 150.00, '2024-01-24 09:00:00', 'Pending');
    PRINT 'Payments inserted successfully';
END
ELSE
BEGIN
    PRINT 'Payments table already has data, skipping payment insertion';
END
GO

-- Display final data summary
PRINT 'Final data counts:';
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

PRINT 'Sample data script completed successfully!';
PRINT 'You can now test your frontend application.'; 