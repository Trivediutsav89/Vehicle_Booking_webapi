import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, vehicleApi, driverApi, bookingApi, paymentApi } from '../services/api';
import type { User, Vehicle, Driver, Booking, Payment } from '../types';

export interface SearchResult {
  type: 'user' | 'vehicle' | 'driver' | 'booking' | 'payment';
  id: number;
  title: string;
  subtitle: string;
  data: User | Vehicle | Driver | Booking | Payment;
}

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  performSearch: () => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results: SearchResult[] = [];
      const searchLower = searchTerm.toLowerCase();

      // Search Users
      try {
        const usersResponse = await userApi.getAll();
        const users = usersResponse.data.filter(user =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
        users.forEach(user => {
          results.push({
            type: 'user',
            id: user.userId,
            title: user.name,
            subtitle: user.email,
            data: user
          });
        });
      } catch (error) {
        console.error('Error searching users:', error);
      }

      // Search Vehicles
      try {
        const vehiclesResponse = await vehicleApi.getAll();
        const vehicles = vehiclesResponse.data.filter(vehicle =>
          vehicle.model.toLowerCase().includes(searchLower) ||
          vehicle.vehicleNumber.toLowerCase().includes(searchLower) ||
          vehicle.type.toLowerCase().includes(searchLower)
        );
        vehicles.forEach(vehicle => {
          results.push({
            type: 'vehicle',
            id: vehicle.vehicleId,
            title: vehicle.model,
            subtitle: `${vehicle.vehicleNumber} - ${vehicle.type}`,
            data: vehicle
          });
        });
      } catch (error) {
        console.error('Error searching vehicles:', error);
      }

      // Search Drivers
      try {
        const driversResponse = await driverApi.getAll();
        const drivers = driversResponse.data.filter(driver =>
          driver.name.toLowerCase().includes(searchLower) ||
          driver.phone.toLowerCase().includes(searchLower)
        );
        drivers.forEach(driver => {
          results.push({
            type: 'driver',
            id: driver.driverId,
            title: driver.name,
            subtitle: driver.phone,
            data: driver
          });
        });
      } catch (error) {
        console.error('Error searching drivers:', error);
      }

      // Search Bookings
      try {
        const bookingsResponse = await bookingApi.getAll();
        const bookings = bookingsResponse.data.filter(booking =>
          booking.bookingId.toString().includes(searchLower) ||
          (booking.user?.name && booking.user.name.toLowerCase().includes(searchLower)) ||
          (booking.vehicle?.model && booking.vehicle.model.toLowerCase().includes(searchLower))
        );
        bookings.forEach(booking => {
          results.push({
            type: 'booking',
            id: booking.bookingId,
            title: `Booking #${booking.bookingId}`,
            subtitle: `${booking.user?.name || 'Unknown'} - ${booking.vehicle?.model || 'Unknown Vehicle'}`,
            data: booking
          });
        });
      } catch (error) {
        console.error('Error searching bookings:', error);
      }

      // Search Payments
      try {
        const paymentsResponse = await paymentApi.getAll();
        const payments = paymentsResponse.data.filter(payment =>
          payment.paymentId.toString().includes(searchLower) ||
          payment.amount.toString().includes(searchLower) ||
          payment.status.toLowerCase().includes(searchLower)
        );
        payments.forEach(payment => {
          results.push({
            type: 'payment',
            id: payment.paymentId,
            title: `Payment #${payment.paymentId}`,
            subtitle: `₹${payment.amount} - ${payment.status}`,
            data: payment
          });
        });
      } catch (error) {
        console.error('Error searching payments:', error);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const value: SearchContextType = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    showSearchResults,
    setShowSearchResults,
    performSearch,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 