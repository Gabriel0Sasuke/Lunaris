import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GlobalAssetGuard() {
  useEffect(() => {
    const applyNoDrag = () => {
      document.querySelectorAll('img, svg').forEach((element) => {
        element.setAttribute('draggable', 'false');
      });
    };

    const handleContextMenu = (event) => {
      if (event.target.closest('img, svg, .no-context-menu, [data-no-context-menu="true"]')) {
        event.preventDefault();
      }
    };

    const handleDragStart = (event) => {
      if (event.target.closest('img, svg, .no-drag, [data-no-drag="true"]')) {
        event.preventDefault();
      }
    };

    applyNoDrag();

    const observer = new MutationObserver(() => {
      applyNoDrag();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      observer.disconnect();
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}

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
