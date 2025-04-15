import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import CustomerProvider from './Context/CustomerProvider.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AuthProvider from './Context/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
      <App />
      </CustomerProvider>
      </AuthProvider>
  </StrictMode>,
)
