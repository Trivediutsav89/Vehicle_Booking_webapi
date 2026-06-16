import { useEffect, useState } from 'react';
import { User, Plus, Search, Filter, Car, Phone, MapPin, CheckCircle, XCircle, Star, X } from 'lucide-react';
import { driverApi } from '../services/api';
import type { Driver } from '../types';

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<Omit<Driver, 'driverId'>>({
    name: '',
    phone: '',
    assignedVehicleId: null,
    isActive: true,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);

  useEffect(() => {
    driverApi.getAll().then(res => {
      console.log('Drivers API response:', res);
      setDrivers(res.data);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching drivers:', err);
      setLoading(false);
    });
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === 'Available' ? driver.isActive : !driver.isActive);
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setForm({ name: '', phone: '', assignedVehicleId: null, isActive: true });
    setModalMode('create');
    setEditId(null);
    setShowModal(true);
    setFormError(null);
  };

  const openEditModal = (driver: Driver) => {
    setForm({
      name: driver.name,
      phone: driver.phone,
      assignedVehicleId: driver.assignedVehicleId,
      isActive: driver.isActive,
    });
    setModalMode('edit');
    setEditId(driver.driverId);
    setShowModal(true);
    setFormError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setForm(prev => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : name === 'assignedVehicleId'
        ? value ? Number(value) : null
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      if (modalMode === 'create') {
        const res = await driverApi.create(form);
        setDrivers(prev => [...prev, res.data]);
      } else if (modalMode === 'edit' && editId !== null) {
        const res = await driverApi.update(editId, { ...form, driverId: editId });
        setDrivers(prev => prev.map(d => d.driverId === editId ? res.data : d));
      }
      closeModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Error saving driver');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      await driverApi.delete(id);
      setDrivers(prev => prev.filter(d => d.driverId !== id));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete driver';
      alert(errorMessage);
    }
  };

  const isAllSelected = filteredDrivers.length > 0 && filteredDrivers.every(d => selectedDrivers.includes(d.driverId));
  const isIndeterminate = selectedDrivers.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(filteredDrivers.map(d => d.driverId));
    }
  };

  const handleSelectOne = (driverId: number) => {
    setSelectedDrivers(prev =>
      prev.includes(driverId) ? prev.filter(id => id !== driverId) : [...prev, driverId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="px-1 py-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-1 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Driver Management</h1>
          <p className="text-sm text-gray-600">Manage your drivers and assignments</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 w-full sm:w-auto text-sm">
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone"
            className="pl-8 pr-3 py-1.5 border rounded-md w-full text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="pl-8 pr-3 py-1.5 border rounded-md w-full text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Select All Section */}
      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-2 py-1 mb-2">
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={el => {
            if (el) el.indeterminate = isIndeterminate;
          }}
          onChange={handleSelectAll}
          className="mr-2 w-4 h-4 rounded-full border-2 border-primary-500 focus:ring-2 focus:ring-primary-300 transition-shadow shadow-sm hover:shadow-md bg-white checked:bg-primary-600 checked:border-primary-600"
          id="selectAllDrivers"
        />
        <label htmlFor="selectAllDrivers" className="text-sm font-medium text-gray-800 select-none">
          Select All
        </label>
        {selectedDrivers.length > 0 && (
          <span className="ml-2 text-primary-700 text-xs font-semibold bg-primary-50 px-2 py-0.5 rounded-full">
            {selectedDrivers.length} selected
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filteredDrivers.map(driver => (
          <div key={driver.driverId} className="border rounded-lg shadow p-4 relative">
            <input
              type="checkbox"
              checked={selectedDrivers.includes(driver.driverId)}
              onChange={() => handleSelectOne(driver.driverId)}
              className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-primary-500 focus:ring-2 focus:ring-primary-300 transition-shadow shadow-sm hover:shadow-md bg-white checked:bg-primary-600 checked:border-primary-600"
            />
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {driver.name?.charAt(0) || 'D'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                <p className="text-sm text-gray-500">{driver.phone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">License:</span>
                <span className="font-medium">{driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  driver.status === 'Available' ? 'bg-green-100 text-green-800' : 
                  driver.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {driver.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Experience:</span>
                <span className="font-medium">{driver.experienceYears} years</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => openEditModal(driver)}
                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(driver.driverId)}
                className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === 'create' ? 'Add Driver' : 'Edit Driver'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
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
