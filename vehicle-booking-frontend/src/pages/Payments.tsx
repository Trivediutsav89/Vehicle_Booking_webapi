import { useEffect, useState } from 'react';
import { CreditCard, Plus, Search, Filter, DollarSign, CheckCircle, XCircle, Clock, TrendingUp, User, Car } from 'lucide-react';
import { paymentApi } from '../services/api';
import type { Payment } from '../types';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    paymentApi.getAll().then(res => {
      setPayments(res.data);
      setLoading(false);
    });
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.booking?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.booking?.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const paymentStatuses = [...new Set(payments.map(p => p.status).filter(Boolean))];

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payment Management</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage payment transactions</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>New Payment</span>
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
                  placeholder="Search payments by customer or vehicle..."
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
                <option value="">All Statuses</option>
                {paymentStatuses.map(status => (
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
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {payments.filter(p => p.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {payments.filter(p => p.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Grid */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No payments found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPayments.map((payment) => (
              <div key={payment.paymentId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4 min-w-0">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">Payment #{payment.paymentId}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(payment.status)} flex-shrink-0`}>
                      {getStatusIcon(payment.status)}
                      <span>{payment.status || 'Pending'}</span>
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center"><span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span> <span className="ml-1 text-gray-900 dark:text-gray-100 text-lg font-semibold">₹{payment.amount?.toLocaleString()}</span></div>
                    <div className="flex items-center"><span className="font-medium text-gray-700 dark:text-gray-300">Booking ID:</span> <span className="ml-1 text-gray-900">{payment.bookingId}</span></div>
                    <div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-300">User:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{payment.booking?.user?.name || `User #${payment.booking?.userId}`}</span> <span className="ml-2 text-gray-500">{payment.booking?.user?.email}</span></div>
                    <div className="flex items-center"><Car className="w-4 h-4 text-gray-400 mr-2" /><span className="font-medium text-gray-700 dark:text-gray-300">Vehicle:</span> <span className="ml-1 text-gray-900 dark:text-gray-100">{payment.booking?.vehicle?.model || `Vehicle #${payment.booking?.vehicleId}`}</span> <span className="ml-2 text-gray-500">{payment.booking?.vehicle?.vehicleNumber}</span></div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex space-x-2">
                    <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg font-medium transition-colors">View Receipt</button>
                    <button className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm">Edit</button>
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