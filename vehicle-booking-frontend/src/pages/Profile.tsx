import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { userApi } from '../services/api';

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!user) return <div className="p-8">No user data.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await userApi.update(user.userId, { name: form.name, email: form.email });
      setUser(res.data);
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className="input-field bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
            className="input-field bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Role</label>
          <input value={user.role} disabled className="input-field bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 mt-4">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email }); }} className="btn-secondary">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
} 