import { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  Calendar, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Activity,
  DollarSign,
  UserCheck,
  Car as CarIcon
} from 'lucide-react';
import { vehicleApi, bookingApi, userApi, paymentApi } from '../services/api';
import type { Booking, Vehicle, User, Payment } from '../types';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  textColor: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        console.log('Fetching dashboard data...');
        
        const [vehiclesRes, bookingsRes, usersRes, paymentsRes] = await Promise.all([
          vehicleApi.getAll(),
          bookingApi.getAll(),
          userApi.getAll(),
          paymentApi.getAll(),
        ]);

        console.log('Dashboard API responses:', { vehiclesRes, bookingsRes, usersRes, paymentsRes });

        const vehicleData = vehiclesRes.data;
        const bookingData = bookingsRes.data;
        const userData = usersRes.data;
        const paymentData = paymentsRes.data;

        setVehicles(vehicleData);
        setUsers(userData);
        setPayments(paymentData);

        // Calculate stats
        const totalVehicles = vehicleData.length;
        const availableVehicles = vehicleData.filter(v => v.isAvailable).length;
        const totalBookings = bookingData.length;
        const confirmedBookings = bookingData.filter(b => b.status === 'Confirmed').length;
        const activeUsers = userData.filter(u => u.isActive).length;
        const totalRevenue = paymentData
          .filter(p => p.status === 'Completed')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats([
          {
            title: 'Total Vehicles',
            value: totalVehicles,
            change: 8,
            icon: Car,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
          },
          {
            title: 'Available Vehicles',
            value: availableVehicles,
            change: -3,
            icon: CheckCircle,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
          },
          {
            title: 'Total Bookings',
            value: totalBookings,
            change: 12,
            icon: Calendar,
            color: 'purple',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600'
          },
          {
            title: 'Active Users',
            value: activeUsers,
            change: 15,
            icon: UserCheck,
            color: 'orange',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
          },
          {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            change: 23,
            icon: DollarSign,
            color: 'emerald',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-600'
          }
        ]);

        // Get recent bookings
        const recent = bookingData
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
          .slice(0, 5);
        setRecentBookings(recent);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Connection Error</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Overview of your vehicle booking system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Last updated</p>
                <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bgColor} dark:${stat.bgColor.replace('-100', '-900')} group-hover:scale-105 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor} dark:text-${stat.color}-300`} />
                </div>
                <div className="flex items-center">
                  {stat.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-300 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-300 mr-1" />
                  )}
                  <span className={`text-xs font-medium ${stat.change > 0 ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">{stat.title}</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Quick Stats */}
          <div className="card lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">System Overview</h2>
              <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-300" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CarIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{vehicles.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">Total Vehicles</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{vehicles.filter(v => v.isAvailable).length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">Available</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{users.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">Total Users</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{payments.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">Transactions</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
              <Activity className="w-4 h-4 text-gray-400 dark:text-gray-300" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">New booking created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Payment completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">New user registered</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Vehicle returned</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Bookings</h2>
            <button className="btn-primary text-sm">View All Bookings</button>
          </div>
          <div className="p-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">No recent bookings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Bookings will appear here once they are created</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.bookingId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {booking.vehicle?.model || `Vehicle ${booking.vehicleId}`} - {booking.user?.name || `User ${booking.userId}`}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-300">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {new Date(booking.fromDateTime).toLocaleDateString()} - {new Date(booking.toDateTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span>{booking.status || 'Pending'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 