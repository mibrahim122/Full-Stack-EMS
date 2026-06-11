import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearStoredAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('employee');
  };

  const isValidStoredToken = (value) =>
    value && value !== 'undefined' && value !== 'null';

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedEmployee = localStorage.getItem('employee');

    if (isValidStoredToken(storedToken) && storedUser && storedUser !== 'undefined') {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedEmployee && storedEmployee !== 'undefined') {
          setEmployee(JSON.parse(storedEmployee));
        }
      } catch {
        clearStoredAuth();
      }
    } else if (storedToken || storedUser) {
      clearStoredAuth();
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password, 
        role: role.toUpperCase() 
      });
      
      const { token: newToken, user: userData, employee: employeeData } = response;

      if (!newToken || !userData) {
        throw new Error('Invalid login response from server');
      }

      // Persist to localStorage first so ProtectedRoute can read it immediately
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (employeeData) {
        localStorage.setItem('employee', JSON.stringify(employeeData));
      } else {
        localStorage.removeItem('employee');
      }

      // Store in state
      setToken(newToken);
      setUser(userData);
      setEmployee(employeeData || null);

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setEmployee(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('employee');

    // Redirect to login
    navigate('/login');
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployee(updatedEmployee);
    localStorage.setItem('employee', JSON.stringify(updatedEmployee));
  };

  const getActiveUser = () => {
    if (user) return user;
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') return JSON.parse(stored);
    } catch {
      return null;
    }
    return null;
  };

  const value = {
    user,
    employee,
    token,
    loading,
    login,
    logout,
    updateEmployee,
    isAuthenticated: isValidStoredToken(token) || isValidStoredToken(localStorage.getItem('token')),
    isAdmin: getActiveUser()?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
