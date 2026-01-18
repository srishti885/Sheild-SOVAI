import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, Loader2, Shield } from 'lucide-react';
import { db } from '../firebase';
import { ref, set } from "firebase/database";

export default function MobileRegistration() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, capturing, sending, done
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // URL se Sync ID nikalna
  const queryParams = new URLSearchParams(window.location.search);
  const syncId = queryParams.get('sid');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied. Please enable camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    setPhoto(canvasRef.current.toDataURL('image/png'));
    setStatus('captured');
  };

  const handleSubmit = async () => {
    if (!name || !photo || !syncId) {
      alert("Please enter name and take a photo.");
      return;
    }

    setStatus('sending');
    try {
      // Firebase mein sync_sessions wale node par data bhej rahe hain
      const syncRef = ref(db, `sync_sessions/${syncId}`);
      await set(syncRef, {
        name: name,
        photo: photo,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      });
      setStatus('done');
    } catch (err) {
      alert("Sync failed. Try again.");
      setStatus('captured');
    }
  };

  if (status === 'done') {
    return (
      <div className="h-screen bg-[#00040a] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle size={80} className="text-green-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-white italic">SYNC_COMPLETE</h2>
        <p className="text-slate-400 text-sm mt-2">Check your desktop screen to continue.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00040a] text-white p-6 font-sans">
      <div className="max-w-md mx-auto space-y-8 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-500 uppercase">
            SOV<span className="text-white">AI</span> MOBILE
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-slate-500 mt-2">
            BIOMETRIC_HANDSHAKE_NODE
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
          <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border border-blue-500/30 mb-6">
            {!photo ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={photo} alt="Capture" className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} width="400" height="300" className="hidden" />
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="ENTER FULL NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-blue-500"
            />
            
            {!photo ? (
              <button onClick={capturePhoto} className="w-full bg-blue-600 p-4 rounded-xl font-black tracking-widest text-[10px] flex items-center justify-center gap-2">
                <Camera size={16} /> CAPTURE_IDENTITY
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setPhoto(null)} className="flex-1 bg-white/10 p-4 rounded-xl font-bold text-[10px]">RETAKE</button>
                <button onClick={handleSubmit} disabled={status === 'sending'} className="flex-[2] bg-green-600 p-4 rounded-xl font-black tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {status === 'sending' ? <Loader2 className="animate-spin" /> : 'SYNC_TO_DESKTOP'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-[8px] font-mono text-slate-600 tracking-widest">
           ENCRYPTED_TUNNEL: {syncId || 'NO_ID_FOUND'}
        </div>
      </div>
    </div>
  );
}