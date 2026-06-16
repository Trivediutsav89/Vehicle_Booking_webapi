import axios from 'axios';
import type { User, Vehicle, Booking, Driver, Payment, VehicleFilter, BookingFormData } from '../types';

const API_BASE_URL = 'http://localhost:5015/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Vehicle API
export const vehicleApi = {
  getAll: () => api.get<Vehicle[]>('/vehicle'),
  getById: (id: number) => api.get<Vehicle>(`/vehicle/${id}`),
  create: (vehicle: Omit<Vehicle, 'vehicleId'>) => api.post<Vehicle>('/vehicle', vehicle),
  update: (id: number, vehicle: Vehicle) => api.put<Vehicle>(`/vehicle/${id}`, vehicle),
  delete: (id: number) => api.delete(`/vehicle/${id}`),
  filter: (filters: VehicleFilter) => api.get<Vehicle[]>('/vehicle/filter', { params: filters }),
  getTypes: () => api.get<string[]>('/vehicle/dropdown/types'),
};

// Booking API
export const bookingApi = {
  getAll: () => api.get<Booking[]>('/booking'),
  getById: (id: number) => api.get<Booking>(`/booking/${id}`),
  create: (booking: BookingFormData) => api.post<Booking>('/booking', booking),
  update: (id: number, booking: Partial<Booking>) => api.put<Booking>(`/booking/${id}`, booking),
  delete: (id: number) => api.delete(`/booking/${id}`),
};

// User API
export const userApi = {
  getAll: () => api.get<User[]>('/user'),
  getById: (id: number) => api.get<User>(`/user/${id}`),
  create: (user: Omit<User, 'userId'>) => api.post<User>('/user', user),
  update: (id: number, user: Partial<User>) => api.put<User>(`/user/${id}`, user),
  delete: (id: number) => api.delete(`/user/${id}`),
};

// Driver API
export const driverApi = {
  getAll: () => api.get<Driver[]>('/driver'),
  getById: (id: number) => api.get<Driver>(`/driver/${id}`),
  create: (driver: Omit<Driver, 'driverId'>) => api.post<Driver>('/driver', driver),
  update: (id: number, driver: Partial<Driver>) => api.put<Driver>(`/driver/${id}`, driver),
  delete: (id: number) => api.delete(`/driver/${id}`),
};

// Payment API
export const paymentApi = {
  getAll: () => api.get<Payment[]>('/payment'),
  getById: (id: number) => api.get<Payment>(`/payment/${id}`),
  create: (payment: Omit<Payment, 'paymentId'>) => api.post<Payment>('/payment', payment),
  update: (id: number, payment: Partial<Payment>) => api.put<Payment>(`/payment/${id}`, payment),
  delete: (id: number) => api.delete(`/payment/${id}`),
};

export default api; 