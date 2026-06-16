import { useEffect, useState } from 'react';
import { Calendar, Plus, Search, Filter, Car, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingApi } from '../services/api';
import type { Booking } from '../types';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    bookingApi.getAll().then(res => {
      setBookings(res.data);
      setLoading(false);
    });
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const bookingStatuses = [...new Set(bookings.map(b => b.status).filter(Boolean))];

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Booking Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage vehicle reservations</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings by vehicle or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Status</option>
                {bookingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {bookings.filter(b => b.status === 'Confirmed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {bookings.filter(b => b.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {bookings.filter(b => b.status === 'Cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No bookings found</h3>
            <p className="text-gray-500 dark:text-gray-300">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.bookingId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4 min-w-0">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">Booking #{booking.bookingId}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)} dark:bg-gray-700 dark:text-gray-200 flex-shrink-0`}>
                      {getStatusIcon(booking.status)}
                      <span>{booking.status || 'Pending'}</span>
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-200">User:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{booking.user?.name || `User #${booking.userId}`}</span> <span className="ml-2 text-gray-500">{booking.user?.email}</span></div>
                    <div className="flex items-center"><Car className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-200">Vehicle:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{booking.vehicle?.model || `Vehicle #${booking.vehicleId}`}</span> <span className="ml-2 text-gray-500">{booking.vehicle?.vehicleNumber}</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-200">From:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{new Date(booking.fromDateTime).toLocaleString()}</span></div>
                    <div className="flex items-center"><Clock className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-200">To:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{new Date(booking.toDateTime).toLocaleString()}</span></div>
                    {booking.payments && booking.payments.length > 0 && (
                      <div className="flex items-center"><span className="font-medium text-gray-700 dark:text-gray-200">Payments:</span>
                        <ul className="ml-2 list-disc list-inside text-gray-900 dark:text-gray-100">
                          {booking.payments.map(payment => (
                            <li key={payment.paymentId}>Payment #{payment.paymentId}: ₹{payment.amount?.toLocaleString()} ({payment.status})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex space-x-2">
                    <button className="flex-1 py-2 px-4 bg-white dark:bg-gray-900 border border-primary-500 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-800 hover:text-primary-800 rounded-lg font-medium transition-colors shadow-sm">Edit</button>
                    <button className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 