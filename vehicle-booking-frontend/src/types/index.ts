export interface User {
  userId: number;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  bookings?: Booking[];
}

export interface Vehicle {
  vehicleId: number;
  vehicleNumber: string;
  type: string;
  model: string;
  capacity: number;
  ratePerKM: number;
  isAvailable: boolean;
  imageUrl?: string;
  bookings?: Booking[];
  driver?: Driver;
}

export interface Booking {
  bookingId: number;
  userId: number;
  vehicleId: number;
  fromDateTime: string;
  toDateTime: string;
  status?: string;
  createdAt?: string;
  user?: User;
  vehicle?: Vehicle;
  payments?: Payment[];
}

export interface Driver {
  driverId: number;
  name: string;
  phone: string;
  assignedVehicleId: number | null;
  isActive: boolean;
  assignedVehicle?: Vehicle;
}

export interface Payment {
  paymentId: number;
  bookingId: number;
  amount: number;
  paymentDate: string;
  status: string;
  booking?: Booking;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface BookingFormData {
  vehicleId: number;
  fromDateTime: string;
  toDateTime: string;
}

export interface VehicleFilter {
  type?: string;
  isAvailable?: boolean;
  minCapacity?: number;
} 