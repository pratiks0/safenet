// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// Helpers for localStorage-based user management
const getStoredUsers = () => JSON.parse(localStorage.getItem('users')) || [];
const storeUser = (newUser) => {
  const users = getStoredUsers();
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  const signUp = (username, password) => {
    const users = getStoredUsers();
    if (users.find(u => u.username === username)) {
      throw new Error("User already exists");
    }
    const newUser = { username, password };
    storeUser(newUser);
    setUser({ username });
    localStorage.setItem('user', JSON.stringify({ username }));
  };

  const signIn = (username, password) => {
    const users = getStoredUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    setUser({ username });
    localStorage.setItem('user', JSON.stringify({ username }));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
