import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { registerSW } from 'virtual:pwa-register';
import GlobalAssetGuard from './components/globalAssetGuard';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalAssetGuard />
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
