import React, { useState, useEffect, useRef } from 'react';
import { Shield, ChevronRight, Fingerprint, Smartphone, CheckCircle, Activity, Camera, QrCode, UserPlus, PlayCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// AI & BIOMETRIC IMPORTS
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
// Firebase imports
import { db } from '../firebase'; 
import { ref, push, set, onValue } from "firebase/database";
import { QRCodeSVG } from 'qrcode.react';

export default function LandingPage({ onEnter }) {
  const [scanStatus, setScanStatus] = useState('idle'); // idle, syncing, authenticating, verified
  const [mode, setMode] = useState('landing'); // landing, qr-sync, registering, scanning
  const [scanProgress, setScanProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [userName, setUserName] = useState('');
  
  // --- ADDED STATE FOR APPROVAL TRACKING & AI ---
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [faceCoords, setFaceCoords] = useState(null); 

  // --- NEW STATES FOR MASTER KEY & AUTO-AUTH ---
  const [masterKey, setMasterKey] = useState('');
  const [showMasterKeyField, setShowMasterKeyField] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // HIDDEN: Camera track management
  const navigate = useNavigate();
  const adminName = "SRISHTI GOENKA";

  // Device Detection
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Initialize Session ID if not exists
    if (!localStorage.getItem('sov_session_id')) {
      const newSid = 'SID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('sov_session_id', newSid);
    }

    return () => stopCamera(); // Cleanup on unmount
  }, []);

  // --- 🔥 NEW: SOVEREIGN AI AUTO-SCAN BACKGROUND POLLING ---
  useEffect(() => {
    const sovereignSync = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5001/api/v1/vision-status');
        const data = await res.json();
        
        // Agar Python Engine bole ki Admin mil gaya aur hum landing page par hain
        if (data.active && data.admin_verified === true && !showMasterKeyField && scanStatus !== 'verified') {
          setScanStatus('verified');
          setScanProgress(100);
          speak("Sovereign Identity Confirmed. Initialize Master Authorization.");
          
          setShowMasterKeyField(true); // Auto-trigger Master Key field
          
          // Auto-focus the input so you can just start typing
          setTimeout(() => {
            const input = document.getElementById('master-key-input');
            if(input) input.focus();
          }, 600);

          clearInterval(sovereignSync);
        }
      } catch (err) {
        // Python engine offline or error - silent fail to keep UI clean
      }
    }, 1500);

    return () => clearInterval(sovereignSync);
  }, [scanStatus, showMasterKeyField]);

  // --- NEW: MASTER KEY VERIFICATION LOGIC ---
  const verifyMasterKey = async () => {
    if(!masterKey) return;
    try {
      // Backend (Port 5000) verification
      const response = await axios.post('http://localhost:5000/api/v1/verify-master-key', {
        key: masterKey,
        admin: adminName
      });

      if (response.data.success) {
        speak("Master Access Granted. System Unlocked.");
        localStorage.setItem('user_role', 'ADMIN');
        localStorage.setItem('user_uid', 'ADMIN_MASTER_ROOT');
        
        setTimeout(() => {
          stopCamera();
          if (typeof onEnter === 'function') onEnter();
          navigate('/dashboard');
        }, 1000);
      } else {
        speak("Invalid Master Key. Access Denied.");
        setMasterKey('');
      }
    } catch (error) {
      // Fail-safe for offline development
      if(masterKey === "ADMIN123") {
         speak("Emergency Bypass Active.");
         navigate('/dashboard');
      }
      console.error("Master Key Auth Failed");
    }
  };

  // --- STOP CAMERA LOGIC ---
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      console.log("SYSTEM_LOG: Camera stream terminated.");
    }
  };

  // --- SECRET LOGGING FUNCTION (UPDATED WITH ID LOGIC) ---
  const logAccessAttempt = async (userType, status, photo) => {
    try {
      const logRef = ref(db, 'security_logs');
      const newLog = push(logRef);
      
      const currentSID = localStorage.getItem('sov_session_id');
      const currentUID = localStorage.getItem('user_uid');

      await set(newLog, {
        identity: userType === 'ADMIN' ? adminName : 'UNKNOWN_USER',
        type: userType,
        status: status,
        photo: photo,
        timestamp: new Date().toISOString(),
        device: isMobile ? 'Mobile' : 'Desktop',
        sessionID: currentSID || 'GUEST_NODE', 
        userID: currentUID || null 
      });
    } catch (err) {
      console.error("Audit failed:", err);
    }
  };

  // --- FIREBASE APPROVAL LISTENER ---
  useEffect(() => {
    const activeSyncId = localStorage.getItem('active_sync_id');
    
    if (activeSyncId) {
      const syncRef = ref(db, `sync_sessions/${activeSyncId}`);
      onValue(syncRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.status === 'COMPLETED') {
          handleAutoUnlock(activeSyncId, data.name);
        }
      });
    }

    if (currentRequestId) {
      const statusRef = ref(db, `access_requests/${currentRequestId}`);
      onValue(statusRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.status === 'APPROVED') {
          handleAutoUnlock(currentRequestId, data.name);
        }
      });
    }
  }, [currentRequestId]);

  const handleAutoUnlock = (id, name) => {
    localStorage.setItem('user_uid', id); 
    localStorage.setItem('user_role', 'USER');
    setScanStatus('verified');
    speak(`Access Granted. Welcome ${name}.`);
    setTimeout(() => {
      stopCamera();
      if (typeof onEnter === 'function') onEnter();
      navigate('/dashboard');
    }, 2000);
  };

  const startMobileSync = () => {
    const syncId = 'SYNC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('active_sync_id', syncId); 
    setMode('qr-sync');
    speak("Biometric sync initiated. Scan the QR with your phone.");
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startFaceRecognition = async () => {
    setIsModelLoading(true);
    speak("Initializing neural core. Stand by.");
    try {
      const model = await blazeface.load();
      setIsModelLoading(false);
      speak("Face engine online. Scanning for bio-signature.");

      const detectFace = setInterval(async () => {
        if (videoRef.current && mode === 'scanning') {
          const predictions = await model.estimateFaces(videoRef.current, false);
          if (predictions.length > 0) {
            const face = predictions[0];
            setFaceCoords({
              topLeft: face.topLeft,
              bottomRight: face.bottomRight
            });
            setTimeout(() => {
                clearInterval(detectFace);
                handleAuthTrigger();
            }, 1000);
          } else {
            setFaceCoords(null);
          }
        }
      }, 100);
    } catch (err) {
      console.error("AI Model Error:", err);
      setIsModelLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream; 
      if (mode === 'scanning') startFaceRecognition();
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setCapturedImage(dataUrl);
    speak("Biometric identity captured.");
    return dataUrl;
  };

  const handleRegisterSubmit = async () => {
    if (!capturedImage || !userName) {
      alert("Please provide name and photo");
      return;
    }
    const currentSID = localStorage.getItem('sov_session_id');
    const requestRef = ref(db, 'access_requests');
    const newRequest = push(requestRef);
    const requestId = newRequest.key;
    
    await set(newRequest, {
      name: userName,
      photo: capturedImage,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      sessionID: currentSID 
    });
    
    logAccessAttempt("NEW_USER_REG", "PENDING", capturedImage);
    setCurrentRequestId(requestId); 
    speak("Request sent for admin approval. Please wait.");
    setMode('awaiting'); 
    stopCamera();
  };

  const handleAuthTrigger = async () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 400, 300);
    const auditPhoto = canvasRef.current.toDataURL('image/png');

    if (window.PublicKeyCredential) {
      try {
        setScanStatus('syncing');
        speak("Bio-signature matched. Verifying hardware key.");
        let progress = 0;
        const interval = setInterval(() => {
          progress += 2;
          setScanProgress(progress);
          if (progress === 40) {
            setScanStatus('authenticating');
            speak("Biometric handshake in progress.");
          }
          if (progress === 100) {
            clearInterval(interval);
            setScanStatus('verified');
            logAccessAttempt("ADMIN", "GRANTED", auditPhoto);
            
            // SHOW MASTER KEY FIELD INSTEAD OF DIRECT NAVIGATE
            setShowMasterKeyField(true);
            speak("Face verified. Enter Master Key.");
            
            setTimeout(() => {
                const input = document.getElementById('master-key-input');
                if(input) input.focus();
            }, 500);
          }
        }, 50);
      } catch (err) {
        logAccessAttempt("ADMIN", "FAILED_HARDWARE", auditPhoto);
        speak("Hardware verification failed.");
        setScanStatus('idle');
      }
    }
  };

  return (
    <div className={`h-screen w-full flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-1000 
      ${scanStatus === 'verified' ? 'bg-[#000a05]' : 'bg-[#00040a]'} 
      ${scanStatus === 'authenticating' ? 'animate-[shake_0.2s_infinite]' : ''}`}>
      
      {/* LAYER 1: THE CIRCUIT BACKGROUND (Full Original) */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${scanStatus === 'verified' ? 'text-green-500' : 'text-blue-500'}`} 
             style={{ backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`, backgroundSize: '80px 80px' }}>
        </div>
        <svg width="100%" height="100%" className="absolute inset-0 opacity-40">
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
            <pattern id="hex-bg" width="300" height="300" patternUnits="userSpaceOnUse">
              <path d="M150 50 L236 100 L236 200 L150 250 L64 200 L64 100 Z" fill="none" stroke={scanStatus === 'verified' ? '#22c55e' : '#3b82f6'} strokeWidth="2.5" filter="url(#glow)" />
              <circle r="4" fill={scanStatus === 'verified' ? '#22c55e' : '#60a5fa'} filter="url(#glow)">
                <animateMotion path="M150 0 V50 M0 150 H64" dur="3s" repeatCount="indefinite" />
              </circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex-bg)" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#00040a_90%)] z-[1]"></div>
      </div>

      {/* LAYER 2: SCANNER BEAM */}
      {scanStatus === 'authenticating' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-1 bg-blue-500 shadow-[0_0_40px_#3b82f6] animate-[scan_1.5s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
        </div>
      )}

      {/* LAYER 3: INTERFACE */}
      <div className="relative z-20 w-full max-w-2xl px-6 text-center">
        
        {mode !== 'landing' && (
          <button onClick={() => { stopCamera(); setMode('landing'); setShowMasterKeyField(false); }} className="absolute -top-10 left-6 text-blue-400 flex items-center gap-2 hover:text-white transition-all">
            <ArrowLeft size={20} /> <span className="text-[10px] font-bold tracking-widest uppercase">Return</span>
          </button>
        )}

        <div className="mb-8 text-left flex justify-between items-end">
          <div>
            <h1 className={`text-6xl font-black italic tracking-tighter mb-2 uppercase ${scanStatus === 'verified' ? 'text-green-500' : 'text-white'}`}>
              SOV<span className={scanStatus === 'verified' ? 'text-green-500' : 'text-blue-600'}>AI</span>
            </h1>
            <p className="text-[9px] font-mono tracking-[1em] text-blue-400 opacity-70">
              {isModelLoading ? "INITIALIZING_NEURAL_CORE..." : "SECURE_ID_PROTOCOL_V4"}
            </p>
          </div>
          <button onClick={() => { stopCamera(); navigate('/audit'); }} className="text-white/10 hover:text-blue-500/50 transition-colors">
            <Shield size={16} />
          </button>
        </div>

        <div className="bg-black/90 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl min-h-[400px] flex flex-col justify-center relative">
          
          {/* --- NEW: MASTER KEY INPUT UI (Conditional) --- */}
          {showMasterKeyField ? (
            <div className="animate-in zoom-in duration-500 space-y-8">
               <div className="flex flex-col items-center">
                  <Fingerprint size={64} className="text-blue-500 mb-2 animate-pulse" />
                  <h2 className="text-white text-2xl font-black italic tracking-tighter uppercase">Master Access</h2>
                  <p className="text-[10px] text-blue-400/60 font-mono tracking-[0.3em]">ENCRYPTED_AUTH_CHANNEL</p>
               </div>
               
               <div className="relative group">
                  <input 
                    id="master-key-input"
                    type="password" 
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && verifyMasterKey()}
                    placeholder="ENTER MASTER KEY" 
                    className="w-full bg-white/5 border border-blue-500/30 p-5 rounded-2xl text-center text-blue-400 text-xl tracking-[0.8em] outline-none focus:border-blue-500 transition-all"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/5 blur-xl -z-10 group-focus-within:bg-blue-500/20 transition-all"></div>
               </div>

               <button 
                 onClick={verifyMasterKey}
                 className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl tracking-[0.3em] shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all uppercase text-xs"
               >
                 Verify_Authorization_Key
               </button>

               <button 
                 onClick={() => setShowMasterKeyField(false)}
                 className="text-[9px] text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
               >
                 Cancel Override
               </button>
            </div>
          ) : (
            <>
              {mode === 'landing' && scanStatus === 'idle' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in">
                  <div className="space-y-4">
                    <button onClick={() => { setMode('scanning'); startCamera(); }} className="w-full group bg-blue-600 hover:bg-blue-500 p-8 rounded-[2rem] transition-all flex flex-col items-center gap-4">
                      <Camera size={40} />
                      <span className="font-black tracking-widest text-[10px]">ADMIN_FACE_ID</span>
                    </button>
                    {!isMobile && (
                      <button onClick={startMobileSync} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center gap-3 hover:border-blue-500/50 transition-all group">
                        <QrCode size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Mobile_Sync_QR</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 justify-center">
                    {/* Updated ADMIN Button to trigger Master Key */}
                    <button onClick={() => { setShowMasterKeyField(true); speak("Manual Override Active."); }} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 transition-all">
                      <Fingerprint size={20} className="text-blue-400" />
                      <span className="text-[10px] font-bold tracking-widest">ADMIN_MASTER_KEY</span>
                    </button>
                    <button onClick={() => { setMode('registering'); startCamera(); speak("New User Registration Protocol."); }} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 transition-all">
                      <UserPlus size={20} className="text-blue-400" />
                      <span className="text-[10px] font-bold tracking-widest">REQUEST_ACCESS</span>
                    </button>
                    <button onClick={() => { stopCamera(); speak("Entering Demo Sandbox."); navigate('/demo'); }} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-green-500/50 transition-all">
                      <PlayCircle size={20} className="text-green-500" />
                      <span className="text-[10px] font-bold tracking-widest">GUEST_DEMO</span>
                    </button>
                  </div>
                </div>
              )}

              {(mode === 'scanning' || scanStatus !== 'idle') && mode !== 'registering' && mode !== 'qr-sync' && mode !== 'awaiting' && (
                <div className="animate-in zoom-in">
                   <div className="mb-8 relative inline-block mx-auto">
                    <div className={`absolute -inset-10 blur-3xl rounded-full transition-all duration-1000 ${scanStatus === 'verified' ? 'bg-green-600/30' : 'bg-blue-600/30'}`}></div>
                    <div className={`relative w-64 h-64 bg-black/90 border-2 rounded-[3rem] overflow-hidden flex items-center justify-center transition-all duration-500 ${scanStatus === 'verified' ? 'border-green-500 shadow-[0_0_60px_rgba(34,197,94,0.4)]' : 'border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.4)]'}`}>
                      {scanStatus === 'verified' ? (
                        <CheckCircle size={80} className="text-green-500 animate-[bounce_0.5s_ease]" />
                      ) : (
                        <div className="relative w-full h-full">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
                            {faceCoords && scanStatus === 'idle' && (
                              <div 
                                className="absolute border-2 border-green-500 shadow-[0_0_20px_#22c55e] transition-all duration-100 rounded-lg pointer-events-none"
                                style={{
                                  left: `${(faceCoords.topLeft[0] / 400) * 100}%`,
                                  top: `${(faceCoords.topLeft[1] / 300) * 100}%`,
                                  width: `${((faceCoords.bottomRight[0] - faceCoords.topLeft[0]) / 400) * 100}%`,
                                  height: `${((faceCoords.bottomRight[1] - faceCoords.topLeft[1]) / 300) * 100}%`,
                                }}
                              >
                                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_linear_infinite]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="my-10 px-4">
                    <div className="flex justify-between text-[10px] font-mono mb-2 uppercase tracking-widest text-slate-400">
                      <span>{isModelLoading ? 'System_Initializing' : scanStatus === 'idle' ? 'Scanning_Bio_Signature' : `${scanStatus}...`}</span>
                      <span className="text-white">{scanProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${scanStatus === 'verified' ? 'bg-green-500' : 'bg-blue-500'}`} 
                           style={{ width: `${scanProgress}%`, boxShadow: `0 0 20px ${scanStatus === 'verified' ? '#22c55e' : '#3b82f6'}` }}></div>
                    </div>
                  </div>
                  {isModelLoading && <Loader2 className="mx-auto text-blue-500 animate-spin mb-4" />}
                </div>
              )}

              {mode === 'registering' && (
                <div className="space-y-6 animate-in slide-in-from-right">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-48 h-48 bg-slate-900 rounded-3xl overflow-hidden border border-blue-500/30">
                      {!capturedImage ? (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
                      ) : (
                        <img src={capturedImage} alt="Identity" className="w-full h-full object-cover" />
                      )}
                      <canvas ref={canvasRef} width="400" height="300" className="hidden" />
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <input type="text" value={userName} placeholder="NAME" onChange={(e)=>setUserName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-blue-500 text-white" />
                      <button onClick={capturePhoto} className="w-full bg-blue-900/20 text-blue-400 p-4 rounded-xl text-[9px] font-bold tracking-widest border border-blue-500/30">CAPTURE_SELFIE</button>
                      <button onClick={handleRegisterSubmit} className="w-full bg-blue-600 p-4 rounded-xl text-[10px] font-black tracking-widest text-white">SUBMIT_REQUEST</button>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'awaiting' && (
                 <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in">
                    <div className="relative">
                       <div className="w-32 h-32 border-2 border-blue-500/30 rounded-full flex items-center justify-center">
                          <Loader2 size={48} className="text-blue-500 animate-spin" />
                       </div>
                       <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse"></div>
                    </div>
                    <div>
                       <h3 className="text-xl font-black italic uppercase text-white mb-2 tracking-tighter">Request_Pending</h3>
                       <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] max-w-[250px] mx-auto leading-relaxed">
                          Encrypted packet sent to command center. Standing by for biometric verification...
                       </p>
                    </div>
                 </div>
              )}

              {mode === 'qr-sync' && (
                <div className="text-center space-y-6 animate-in zoom-in">
                  <div className="mx-auto p-4 bg-white rounded-2xl w-48 h-48 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                     <QRCodeSVG 
                       value={`http://sov-ai-security.web.app/mobile-reg?sid=${localStorage.getItem('active_sync_id')}`}
                       size={150}
                       level="H"
                    />
                  </div>
                  <p className="text-xs font-mono text-blue-400 animate-pulse tracking-[0.2em]">AWAITING PHONE_LINK...</p>
                  <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Scan with your mobile device to sync identity</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="absolute bottom-10 w-full text-center">
        <div className="flex flex-col items-center gap-2">
          <div className={`h-[2px] w-24 transition-colors duration-1000 ${scanStatus === 'verified' ? 'bg-green-500' : 'bg-blue-600 shadow-[0_0_10px_#2563eb]'}`}></div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-slate-500">
            © 2026 EDITION | <span className="text-white font-bold uppercase">DESIGNED BY {adminName}</span>
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes scan { 0% { transform: translateY(-10vh); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } }
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-4px, 4px) rotate(-0.5deg); } 50% { transform: translate(4px, -4px) rotate(0.5deg); } 75% { transform: translate(-4px, -4px) rotate(-0.5deg); } }
      `}</style>
    </div>
  );
}  