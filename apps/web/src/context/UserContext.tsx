"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id?: string;
  username?: string;
  name?: string; // fallback if needed
  email: string;
  role?: string;
  department?: string;
  college?: string;
  isSenior?: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On mount, check if there's a stored user
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    } else {
      // If we are on a dashboard route and no session is found, redirect to login
      if (pathname?.startsWith('/dashboard')) {
        router.push('/login');
      }
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    // Ensure name mapping works well for the UI if username is available
    const enrichedUser = {
      ...userData,
      name: userData.username || userData.name || 'User',
      role: userData.role || 'STUDENT'
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(enrichedUser));
    setUser(enrichedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
