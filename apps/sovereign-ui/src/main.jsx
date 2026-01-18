import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Ye line add karein
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Poori App ko BrowserRouter ke andar wrap kar dein */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);