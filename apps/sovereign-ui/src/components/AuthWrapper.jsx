import React, { useState } from 'react';
import App from '../App'; // Aapka original file
import NeuralAuth from './auth/NeuralAuth'; // Naya QR Page

export default function AuthWrapper() {
  const [stage, setStage] = useState('LANDING'); // STAGES: LANDING, QR_AUTH, DASHBOARD

  // Jab Landing page par button click ho
  const handleLandingFinished = () => {
    setStage('QR_AUTH');
  };

  // Jab QR/Biometric scan success ho jaye
  const handleAuthSuccess = () => {
    setStage('DASHBOARD');
  };

  if (stage === 'LANDING') {
    // Aapka original LandingPage bina kisi badlav ke
    // Hum sirf stage change handle kar rahe hain
    return <App forcedStage="LANDING" onStepComplete={handleLandingFinished} />;
  }

  if (stage === 'QR_AUTH') {
    return <NeuralAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (stage === 'DASHBOARD') {
    // Direct Dashboard view
    return <App forcedAuthorized={true} />;
  }

  return null;
}