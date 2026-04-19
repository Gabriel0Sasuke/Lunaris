/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../api/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const verificarUsuario = async () => {
    try {
      const resposta = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
      if (resposta.ok) {
        const data = await resposta.json();
        setUsuario(data.user);
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      verificarUsuario();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, verificarUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
