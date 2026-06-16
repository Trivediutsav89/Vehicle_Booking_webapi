import { useEffect, useState } from 'react';
import { Car, Plus, Search, Filter, MapPin, Users, Zap, CheckCircle, XCircle, X, Clock, Settings } from 'lucide-react';
import { vehicleApi } from '../services/api';
import type { Vehicle } from '../types';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<Omit<Vehicle, 'vehicleId'>>({
    vehicleNumber: '',
    type: '',
    model: '',
    capacity: 4,
    ratePerKM: 0,
    isAvailable: true,
    imageUrl: '',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [bulkUpdateAvailable, setBulkUpdateAvailable] = useState(true);

  useEffect(() => {
    vehicleApi.getAll().then(res => {
      console.log('Vehicles API response:', res);
      setVehicles(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching vehicles:', err);
      setLoading(false);
    });
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || vehicle.type === selectedType;
    return matchesSearch && matchesType;
  });

  const vehicleTypes = [...new Set(vehicles.map(v => v.type))];

  const openCreateModal = () => {
    setForm({ vehicleNumber: '', type: '', model: '', capacity: 4, ratePerKM: 0, isAvailable: true, imageUrl: '' });
    setModalMode('create');
    setEditId(null);
    setShowModal(true);
    setFormError(null);
  };
  const openEditModal = (vehicle: Vehicle) => {
    setForm({
      vehicleNumber: vehicle.vehicleNumber || '',
      type: vehicle.type || '',
      model: vehicle.model || '',
      capacity: vehicle.capacity ?? 4,
      ratePerKM: vehicle.ratePerKM ?? 0,
      isAvailable: vehicle.isAvailable ?? true,
      imageUrl: vehicle.imageUrl || '',
    });
    setModalMode('edit');
    setEditId(vehicle.vehicleId);
    setShowModal(true);
    setFormError(null);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : inputType === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (modalMode === 'create') {
        const res = await vehicleApi.create(form);
        setVehicles((prev) => [...prev, res.data]);
      } else if (modalMode === 'edit' && editId !== null) {
        const res = await vehicleApi.update(editId, { ...form, vehicleId: editId });
        setVehicles((prev) => prev.map(v => v.vehicleId === editId ? res.data : v));
      }
      closeModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Error saving vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter(v => v.vehicleId !== id));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete vehicle';
      alert(errorMessage);
    }
  };

  const isAllSelected = filteredVehicles.length > 0 && filteredVehicles.every(v => selectedVehicles.includes(v.vehicleId));
  const isIndeterminate = selectedVehicles.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(filteredVehicles.map(v => v.vehicleId));
    }
  };

  const handleSelectOne = (vehicleId: number) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedVehicles.length} selected vehicles?`)) return;
    try {
      await Promise.all(selectedVehicles.map(id => vehicleApi.delete(id)));
      setVehicles(prev => prev.filter(v => !selectedVehicles.includes(v.vehicleId)));
      setSelectedVehicles([]);
    } catch (err) {
      alert('Failed to delete some vehicles');
    }
  };

  // Bulk Update
  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all(selectedVehicles.map(id => vehicleApi.update(id, { ...vehicles.find(v => v.vehicleId === id), isAvailable: bulkUpdateAvailable } as Vehicle)));
      setVehicles(prev => prev.map(v => selectedVehicles.includes(v.vehicleId) ? { ...v, isAvailable: bulkUpdateAvailable } : v));
      setShowBulkUpdateModal(false);
      setSelectedVehicles([]);
    } catch (err) {
      alert('Failed to update some vehicles');
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
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Vehicle Management</h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">Manage your vehicle inventory and details</p>
            </div>
            <button onClick={openCreateModal} className="btn-primary flex items-center space-x-2 w-full sm:w-auto text-sm">
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-3 mb-2">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search vehicles by model or number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>
              </div>
              <div className="relative">
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-8 pr-6 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm w-full"
                >
                  <option value="">All Types</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vehicles</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{vehicles.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{vehicles.filter(v => v.isAvailable).length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Use</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{vehicles.filter(v => !v.isAvailable).length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 mb-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 mb-3">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={el => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={handleSelectAll}
              className="mr-3 w-5 h-5 rounded-full border-2 border-primary-500 focus:ring-2 focus:ring-primary-300 transition-shadow shadow-sm hover:shadow-md bg-white checked:bg-primary-600 checked:border-primary-600"
              id="selectAllVehicles"
            />
            <label htmlFor="selectAllVehicles" className="text-base font-medium text-gray-800 select-none">
              Select All
            </label>
            {selectedVehicles.length > 0 && (
              <span className="ml-4 text-primary-700 text-sm font-semibold bg-primary-50 px-3 py-1 rounded-full">
                {selectedVehicles.length} selected
              </span>
            )}
          </div>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.vehicleId} className="card overflow-hidden relative group">
                  {/* Vehicle Image */}
                  <div className="h-32 sm:h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.vehicleId)}
                      onChange={() => handleSelectOne(vehicle.vehicleId)}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white focus:ring-2 focus:ring-primary-300 transition-shadow shadow-sm hover:shadow-md bg-white checked:bg-primary-600 checked:border-primary-600"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.isAvailable 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {vehicle.isAvailable ? 'Available' : 'In Use'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.make} • {vehicle.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ₹{vehicle.dailyRate}/day
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">License Plate:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{vehicle.licensePlate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{vehicle.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Color:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{vehicle.color}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(vehicle)}
                        className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.vehicleId)}
                        className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {modalMode === 'create' ? 'Add Vehicle' : 'Edit Vehicle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Make</label>
                <input
                  type="text"
                  name="make"
                  value={form.make}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Plate</label>
                <input
                  type="text"
                  name="licensePlate"
                  value={form.licensePlate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Rate</label>
                <input
                  type="number"
                  name="dailyRate"
                  value={form.dailyRate}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available</label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  {modalMode === 'create' ? 'Add' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 