-- Add ImageUrl column to Vehicles table
USE vehicle_booking;
GO

-- Add ImageUrl column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Vehicles' AND COLUMN_NAME = 'ImageUrl')
BEGIN
    ALTER TABLE Vehicles ADD ImageUrl NVARCHAR(500) NULL;
    PRINT 'ImageUrl column added to Vehicles table';
END
ELSE
BEGIN
    PRINT 'ImageUrl column already exists in Vehicles table';
END
GO

-- Update existing vehicles with image URLs
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop' WHERE Model = 'Toyota Camry';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop' WHERE Model = 'Honda CR-V';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop' WHERE Model = 'Maruti Swift';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop' WHERE Model = 'Hyundai Verna';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop' WHERE Model = 'Mahindra XUV500';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop' WHERE Model = 'BMW 5 Series';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop' WHERE Model = 'Toyota Innova';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop' WHERE Model = 'Honda City';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop' WHERE Model = 'Ford EcoSport';
UPDATE Vehicles SET ImageUrl = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop' WHERE Model = 'Hyundai i20';
GO

PRINT 'Vehicle images updated successfully!';