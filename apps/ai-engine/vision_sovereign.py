"""
SHIELDAI SOVEREIGN v3.2 - UNIFIED AI VISION CORE (Python 3.13 Stable)
Features: YOLOv8, Gaze tracking, SOS, Admin Auth, Privacy Blur, & Connection Safety.
[STRICT DIRECTIVE]: NO LOGIC REMOVED. ALL v2.0 TIMERS & CSV LOGGING MAINTAINED.
"""

import os
import sys
import numpy as np

# --- CRITICAL: COMPATIBILITY BRIDGE (For Python 3.13 & NumPy 2.x) ---
if np.__version__.startswith('2.'):
    os.environ["OPENCV_FOR_THREADS_NUMPY_2"] = "1"

import cv2
from ultralytics import YOLO
import requests
import time
import logging
import csv 
import ctypes 
import base64 
from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread

# --- SYSTEM CONFIGURATION (v2.0 Integrity) ---
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')
logger = logging.getLogger("Sovereign_AI")

MODEL_PATH = 'yolov8n.pt'
API_BASE = 'http://localhost:5001/api/v1' 
GATEWAY_API = 'http://localhost:5000/api/v1' 
ALERT_THRESHOLD = 5.0  
GAZE_THRESHOLD = 3.0     
SOS_HOLD_TIME = 2.0      
FRAME_WIDTH = 640
FRAME_HEIGHT = 480
LOG_FILE = "sovereign_breach_report.csv" 
SNAPSHOT_DIR = "breach_snapshots"
ADMIN_PHOTO = "admin_auth/me.jpg"

# --- FLASK BACKGROUND SERVER ---
app = Flask(__name__)
CORS(app)
is_admin_verified = False

@app.route('/api/v1/vision-status', methods=['GET'])
def get_status():
    # Dashboard checks this to see if it should auto-login
    return jsonify({"active": True, "admin_verified": is_admin_verified})

# --- ENGINE INITIALIZATION ---
try:
    model = YOLO(MODEL_PATH)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Safe LBPH Init
    try:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        admin_trained = False
        logger.info("CORE_ENGINE: Face Recognition module active")
    except AttributeError:
        logger.error("CV2_CONTRIB_ERROR: LBPH module missing. Admin recognition disabled.")
        recognizer = None

    if not os.path.exists(SNAPSHOT_DIR): os.makedirs(SNAPSHOT_DIR)
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Timestamp", "Alert_Type", "Item_Description", "Severity", "Runtime_Sec", "Evidence_Path"])
            
    # Train Admin Identity
    if recognizer and os.path.exists(ADMIN_PHOTO):
        img = cv2.imread(ADMIN_PHOTO, cv2.IMREAD_GRAYSCALE)
        if img is not None:
            faces = face_cascade.detectMultiScale(img, 1.3, 5)
            if len(faces) > 0:
                for (x, y, w, h) in faces:
                    recognizer.train([img[y:y+h, x:x+w]], np.array([1]))
                admin_trained = True
                logger.info("CORE_ENGINE: Admin Identity Trained Successfully")
        else:
            logger.warning(f"CORE_ENGINE: Could not read photo at {ADMIN_PHOTO}")

except Exception as e:
    logger.error(f"FATAL_INIT_ERROR: {str(e)}")
    exit()

# State Management
last_alert_time = 0
gaze_timer_start = None
sos_timer_start = None
system_boot_time = time.time()
last_frame_captured = None 
fps = 0
prev_frame_time = 0

# --- CORE LOGIC FUNCTIONS ---

def dispatch_alert(alert_type, item_desc, severity_level):
    global last_alert_time, last_frame_captured
    current_time = time.time()
    
    if current_time - last_alert_time > ALERT_THRESHOLD:
        runtime = round(current_time - system_boot_time, 2)
        timestamp_str = time.strftime('%Y%m%d_%H%M%S')
        readable_ts = time.strftime('%Y-%m-%d %H:%M:%S')
        
        evidence_path = "N/A"
        evidence_b64 = "N/A" 
        
        if severity_level in ["HIGH", "CRITICAL", "URGENT"] and last_frame_captured is not None:
            filename = f"breach_{alert_type}_{timestamp_str}.jpg"
            evidence_path = os.path.join(SNAPSHOT_DIR, filename)
            cv2.imwrite(evidence_path, last_frame_captured)
            
            try:
                _, buffer = cv2.imencode('.jpg', last_frame_captured)
                evidence_b64 = base64.b64encode(buffer).decode('utf-8')
            except: pass

        # CSV Logging (v2.0 Integrity)
        try:
            with open(LOG_FILE, 'a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([readable_ts, alert_type, item_desc, severity_level, runtime, evidence_path])
        except Exception as e: logger.warning(f"LOG_WRITE_FAILURE: {str(e)}")

        # System Lock (v2.0 Integrity)
        if alert_type == "EXFILTRATION_RISK" or severity_level == "CRITICAL":
            logger.critical("FORCED_PREVENTION: Unauthorized Hardware Detected. Locking Workstation.")
            try: requests.post(f"{GATEWAY_API}/sys-lock", json={"status": "LOCKED", "evidence": evidence_b64}, timeout=0.5)
            except: pass
            ctypes.windll.user32.LockWorkStation()

        # Alert Dispatch with Safety Net
        payload = {
            "type": alert_type, "item": item_desc, "severity": severity_level,
            "engine_runtime": runtime, "trace_signature": "QS_WATERMARK_SYNCED", "evidence_frame": evidence_b64 
        }
        try:
            requests.post(f"{GATEWAY_API}/alert", json=payload, timeout=0.8)
            last_alert_time = current_time
            logger.info(f"SIGNAL_DISPATCHED: {alert_type} | {severity_level}")
        except: pass

def process_frame(frame):
    global last_frame_captured, is_admin_verified
    h, w, _ = frame.shape
    last_frame_captured = frame.copy()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 1. Admin Auth Logic
    is_admin_verified = False
    if admin_trained and recognizer:
        faces = face_cascade.detectMultiScale(gray, 1.2, 5)
        for (x, y, w_f, h_f) in faces:
            label, conf = recognizer.predict(gray[y:y+h_f, x:x+w_f])
            if label == 1 and conf < 75:
                is_admin_verified = True
                cv2.rectangle(frame, (x, y), (x+w_f, y+h_f), (0, 255, 0), 2)
                cv2.putText(frame, "ADMIN VERIFIED", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # 2. YOLO & v2.0 Logic (Blur, SOS, Gaze)
    results = model(frame, stream=True, verbose=False)
    detected_person = False
    focal_gaze = False
    sos_signal = False
    active_objects = 0
    
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf_score = float(box.conf[0])
            coords = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, coords)
            
            if cls_id == 0 and conf_score > 0.45:
                detected_person = True
                active_objects += 1
                centroid_x = (x1 + x2) / 2
                
                if (w * 0.3) < centroid_x < (w * 0.7): focal_gaze = True
                if y1 < (h * 0.1): sos_signal = True
                
                # Gaussian Blur (v2.0 Integrity)
                face_zone = frame[y1:y2, x1:x2]
                if face_zone.size > 0:
                    frame[y1:y2, x1:x2] = cv2.GaussianBlur(face_zone, (99, 99), 30)

            elif cls_id == 67 and conf_score > 0.35:
                active_objects += 1
                box_area_ratio = ((x2-x1)*(y2-y1)) / (w*h)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 4)
                
                if box_area_ratio > 0.10:
                    dispatch_alert("EXFILTRATION_RISK", "Direct phone capture attempt", "CRITICAL")
                else:
                    dispatch_alert("HARDWARE_BREACH", "Unauthorized recording device", "HIGH")

    return frame, detected_person, focal_gaze, sos_signal, active_objects

# --- MAIN ENGINE LOOP ---
def run_engine():
    global fps, prev_frame_time, gaze_timer_start, sos_timer_start, is_admin_verified
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
    
    Thread(target=lambda: app.run(port=5001, debug=False, use_reloader=False), daemon=True).start()
    logger.info("SYSTEM_STATUS: Operational - Neural Stream Monitoring Active")

    while True:
        ret, frame = cap.read()
        if not ret: break

        new_frame_time = time.time()
        fps = 1 / (new_frame_time - prev_frame_time) if prev_frame_time != 0 else 0
        prev_frame_time = new_frame_time

        processed_img, p_found, is_gazing, is_sos, count = process_frame(frame)

        # Dashboard Stream & Safety Net (Prevents Lag if Dashboard is Off)
        try:
            # Heartbeat
            requests.post(f"{GATEWAY_API}/heartbeat", json={"engine": "ACTIVE", "fps": round(fps, 2)}, timeout=0.05)
            
            # Frame Stream with Admin Verification Status
            _, buffer = cv2.imencode('.jpg', processed_img, [cv2.IMWRITE_JPEG_QUALITY, 50])
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            requests.post(f"{GATEWAY_API}/stream", json={
                "image": frame_b64, 
                "is_admin": is_admin_verified,
                "person_count": count
            }, timeout=0.05)
        except:
            pass # Silent ignore if port 5000 is down

        # Timers Logic
        if p_found and not is_gazing:
            if gaze_timer_start is None: gaze_timer_start = time.time()
            elif time.time() - gaze_timer_start > GAZE_THRESHOLD:
                dispatch_alert("ATTENTION_LAPSE", "Monitor focus lost", "MEDIUM")
        else: gaze_timer_start = None

        if is_sos:
            if sos_timer_start is None: sos_timer_start = time.time()
            elif time.time() - sos_timer_start > SOS_HOLD_TIME:
                dispatch_alert("PERSONNEL_DISTRESS", "Confirmed SOS gesture", "URGENT")
        else: sos_timer_start = None

        if count > 1:
            dispatch_alert("VISUAL_BREACH", f"PROXIMITY_ALERT: {count} persons", "HIGH")

        # UI Overlay
        status_color = (0, 255, 0) if is_admin_verified else (0, 255, 255)
        cv2.putText(processed_img, f"SHIELD_AI | SOVEREIGN: {'PROTECTED' if is_admin_verified else 'SCANNING'}", 
                    (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)

        cv2.imshow("Sovereign_Visual_Engine_v3.2", processed_img)
        if cv2.waitKey(1) & 0xFF == ord('q'): break
        time.sleep(0.01) # Reduced sleep for better responsiveness

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_engine()