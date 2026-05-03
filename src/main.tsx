import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './components/AuthContext';

console.error("====== MAIN.TSX IS EXECUTING ======");

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
  console.error("====== MAIN.TSX RENDER CALLED ======");
} catch (e) {
  console.error("====== FATAL RENDER ERROR ======", e);
}
