import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  rememberDevice: boolean;
  setRememberDevice: (remember: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
  rememberDevice: false,
  setRememberDevice: () => {},
});

export const useAuth = () => useContext(AuthContext);

function getApiUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  return `${window.location.origin}/groceries/api`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('accessToken');
      const shouldRemember = localStorage.getItem('rememberDevice') !== 'false';
      
      if (stored && shouldRemember) {
        // Validate token by making a test API call
        validateToken(stored).then(isValid => {
          if (isValid) {
            setToken(stored);
          } else {
            // Token is expired/invalid, remove it
            localStorage.removeItem('accessToken');
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
      setRememberDevice(shouldRemember);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${getApiUrl()}/features`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const login = async (pin: string) => {
    setError(null);
    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      setToken(data.accessToken);

      if (typeof window !== 'undefined') {
        if (rememberDevice) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        localStorage.setItem('rememberDevice', rememberDevice.toString());
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setError(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        isAuthenticated: !!token, 
        isLoading,
        login, 
        logout, 
        error,
        rememberDevice,
        setRememberDevice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};