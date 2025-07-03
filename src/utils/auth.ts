import { User } from '../types';

const STORAGE_KEY = 'collaborative_todo_auth';

export const mockUsers: User[] = [
  { id: '1', email: 'alice@example.com', name: 'Alice Johnson' },
  { id: '2', email: 'bob@example.com', name: 'Bob Smith' },
  { id: '3', email: 'charlie@example.com', name: 'Charlie Brown' },
  { id: '4', email: 'diana@example.com', name: 'Diana Prince' },
];

export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  // Simple mock authentication - in real app, verify password hash
  if (user && password.length > 0) {
    return user;
  }
  return null;
};

export const generateToken = (user: User): string => {
  // Mock JWT token generation
  return btoa(JSON.stringify({ userId: user.id, email: user.email }));
};

export const saveAuthState = (user: User, token: string) => {
  const authState = { user, token, isAuthenticated: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
};

export const getAuthState = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { user: null, token: null, isAuthenticated: false };
};

export const clearAuthState = () => {
  localStorage.removeItem(STORAGE_KEY);
};