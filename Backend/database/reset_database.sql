-- Reset Database and Insert Fresh Sample Data
-- WARNING: This will delete ALL existing data!

USE vehicle_booking;
GO

-- Clear all existing data
DELETE FROM Payments;
DELETE FROM Bookings;
DELETE FROM Drivers;
DELETE FROM Vehicles;
DELETE FROM Users;
GO

-- Reset identity columns
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Vehicles', RESEED, 0);
DBCC CHECKIDENT ('Drivers', RESEED, 0);
DBCC CHECKIDENT ('Bookings', RESEED, 0);
DBCC CHECKIDENT ('Payments', RESEED, 0);
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
GO

-- Insert Sample Vehicles
INSERT INTO Vehicles (VehicleNumber, Type, Model, Capacity, RatePerKM, IsAvailable, ImageUrl) VALUES
('MH12AB1234', 'Sedan', 'Toyota Camry', 4, 15.50, 1, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'),
('MH12CD5678', 'SUV', 'Honda CR-V', 6, 18.75, 1, 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop'),
('MH12EF9012', 'Hatchback', 'Maruti Swift', 5, 12.00, 1, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'),
('MH12GH3456', 'Sedan', 'Hyundai Verna', 4, 14.25, 0, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'),
('MH12IJ7890', 'SUV', 'Mahindra XUV500', 7, 20.00, 1, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'),
('MH12KL1234', 'Luxury', 'BMW 5 Series', 4, 35.00, 1, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'),
('MH12MN5678', 'Van', 'Toyota Innova', 8, 22.50, 1, 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop'),
('MH12OP9012', 'Sedan', 'Honda City', 4, 16.00, 1, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'),
('MH12QR3456', 'SUV', 'Ford EcoSport', 5, 17.50, 0, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'),
('MH12ST7890', 'Hatchback', 'Hyundai i20', 5, 13.00, 1, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop');
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
GO

-- Display final data summary
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

PRINT 'Database reset and sample data inserted successfully!';
PRINT 'All tables now have fresh data starting from ID 1.'; 