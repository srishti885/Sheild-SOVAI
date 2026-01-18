import React, { useState } from 'react';
import App from './App'; // Aapka original App.jsx
import NeuralAuth from './components/auth/NeuralAuth'; // Naya QR Page

export default function SecurityGate() {
  const [isFullyVerified, setIsFullyVerified] = useState(false);

  // Jab QR scan success ho jaye tabhi asli App load hoga
  const handleFinalUnlock = () => {
    setIsFullyVerified(true);
  };

  if (!isFullyVerified) {
    // Pehle QR dikhayega, phir verification ke baad App.jsx trigger karega
    return <NeuralAuth onAuthSuccess={handleFinalUnlock} />;
  }

  // App.jsx yahan load hoga, pura dashboard functions ke sath
  return <App />;
}