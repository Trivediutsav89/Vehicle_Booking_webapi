import { createContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { userApi } from '../services/api';

export const UserContext = createContext<{ user: User | null, setUser: (u: User) => void }>({ user: null, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: Replace with real auth logic. For now, fetch user with ID 1 as mock.
    userApi.getById(1).then(res => setUser(res.data)).catch(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
} 