import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Mail, X } from 'lucide-react';
import { userApi } from '../services/api';
import type { User } from '../types';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<Omit<User, 'userId' | 'passwordHash'>>({
    name: '',
    email: '',
    role: 'User',
    isActive: true,
  });
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    userApi.getAll().then(res => {
      console.log('Users API response:', res);
      setUsers(res.data);
      setLoading(false);
      setError(null);
    }).catch(err => {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please check if the backend is running.');
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userRoles = [...new Set(users.map(u => u.role))];

  const openCreateModal = () => {
    setForm({ name: '', email: '', role: 'User', isActive: true });
    setPassword('');
    setModalMode('create');
    setEditId(null);
    setShowModal(true);
    setFormError(null);
  };

  const openEditModal = (user: User) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setPassword('');
    setModalMode('edit');
    setEditId(user.userId);
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
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

      const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setFormError(null);

      const userPayload: any = { ...form };
      if (password) userPayload.passwordHash = password;

      try {
        if (modalMode === 'create') {
          const res = await userApi.create(userPayload);
          setUsers(prev => [...prev, res.data]);
        } else if (modalMode === 'edit' && editId !== null) {
          const res = await userApi.update(editId, { ...userPayload, userId: editId });
          setUsers(prev => prev.map(u => (u.userId === editId ? res.data : u)));
        }
        closeModal();
      } catch (err: any) {
        setFormError(err?.response?.data?.message || 'Error saving user');
      } finally {
        setSubmitting(false);
      }
    };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userApi.delete(id);
      setUsers(prev => prev.filter(u => u.userId !== id));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete user';
      alert(errorMessage);
    }
  };

  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedUsers.includes(u.userId));
  const isIndeterminate = selectedUsers.length > 0 && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.userId));
    }
  };

  const handleSelectOne = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
            <p className="text-gray-600">Manage users and permissions</p>
          </div>
        </div>
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
    );
  }

  return (
    <div className="px-1 py-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-1 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-600">Manage users and permissions</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 w-full sm:w-auto text-sm">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="pl-8 pr-3 py-1.5 border rounded-md w-full text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="pl-8 pr-3 py-1.5 border rounded-md w-full text-sm"
          >
            <option value="">All Roles</option>
            {userRoles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
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
          id="selectAllUsers"
        />
        <label htmlFor="selectAllUsers" className="text-sm font-medium text-gray-800 select-none">
          Select All
        </label>
        {selectedUsers.length > 0 && (
          <span className="ml-2 text-primary-700 text-xs font-semibold bg-primary-50 px-2 py-0.5 rounded-full">
            {selectedUsers.length} selected
          </span>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filteredUsers.map(user => (
          <div key={user.userId} className="border rounded-lg shadow p-4 relative flex flex-col max-w-xs overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate" title={user.name}>{user.name}</h3>
                  <p className="text-sm text-gray-500 break-all truncate" title={user.email}>{user.email}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.userId)}
                onChange={() => handleSelectOne(user.userId)}
                className="w-4 h-4 rounded-full border-2 border-primary-500 focus:ring-2 focus:ring-primary-300 transition-shadow shadow-sm hover:shadow-md bg-white checked:bg-primary-600 checked:border-primary-600 mt-1 ml-2 flex-shrink-0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium">{user.role || 'User'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">N/A</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => openEditModal(user)}
                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.userId)}
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
              {modalMode === 'create' ? 'Add User' : 'Edit User'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
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
