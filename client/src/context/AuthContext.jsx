import { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const verificarUsuario = async () => {
    let resultado = null;
    try {
      const resposta = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
      if (resposta.ok) {
        const data = await resposta.json();
        setUsuario(data.user);
        resultado = data.user;
      } else {
        const data = await resposta.json();
        console.error('Erro na verificação:', data.message);
        setUsuario(null);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setUsuario(null);
    } finally {
      console.log("Verificação de usuário concluída.", resultado);
      setLoading(false);
    }
  };

  useEffect(() => {
    verificarUsuario();
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
