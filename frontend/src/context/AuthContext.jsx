import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && (parsed.email || parsed._id) ? parsed : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Re-sync user from localStorage when tab gains focus (fixes state getting out of sync after login/signup)
  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const login = (token, userData) => {
    if (!token || !userData || typeof userData !== 'object') return;
    const u = { _id: userData._id, name: userData.name, email: userData.email, role: userData.role, bio: userData.bio, skills: userData.skills, profilePhoto: userData.profilePhoto, resume: userData.resume };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (data) => {
    const next = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
