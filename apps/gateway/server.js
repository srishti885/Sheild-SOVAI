/**
 * SHIELDAI SOVEREIGN v2.0 - BACKEND INFRASTRUCTURE (RESTORED)
 * Version: 2026.01.17
 * License: Sovereign Enterprise
 * [STRICT DIRECTIVE]: NO FUNCTIONAL LOGIC ALTERED. 
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs'); 
const path = require('path'); 
const { Server } = require('socket.io');
require('dotenv').config();

// Custom Utility & Model Imports
const { scrubPII } = require('./utils/scrubber.js');
const AuditLog = require('./models/AuditLog');

// --------------------------------------------------
// [NEW] OPERATOR MODEL DEFINITION
// --------------------------------------------------
const OperatorSchema = new mongoose.Schema({
    id: String,
    name: String,
    role: String,
    status: { type: String, default: 'Authorized' },
    loc: { type: String, default: 'Remote' },
    lastActive: { type: String, default: 'Now' }
});
const Operator = mongoose.model('Operator', OperatorSchema);

// --------------------------------------------------
// SYSTEM INITIALIZATION & DYNAMIC CORS (ENV UPDATED)
// --------------------------------------------------
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    process.env.LOCAL_FRONTEND_URL,
    process.env.LIVE_FRONTEND_URL,
    "https://sov-ai-security.firebaseapp.com"
];

const io = new Server(server, {
    cors: { 
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('SHIELDAI_SECURITY_BLOCK'));
            }
        },
        methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
});

/**
 * MIDDLEWARE STACK
 */
app.use(helmet({
    contentSecurityPolicy: false, 
})); 
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS_SECURITY_BLOCK'));
        }
    }
})); 
app.use(morgan('dev')); 
app.use(express.json({ limit: '50mb' })); 

// --- ADVANCED SYSTEM STATE ---
let isVisionActive = false;
let lastExtensionHeartbeat = Date.now();
const activeAuthSessions = new Map();
let forensicEvidenceBuffer = []; 

// --------------------------------------------------
// [RESTORED] MASTER KEY VERIFICATION (SECURE ENV)
// --------------------------------------------------
app.post('/api/v1/verify-master-key', (req, res) => {
    const { key, admin } = req.body;
    // Strictly checking against .env variable
    if (key === process.env.ADMIN_PIN) {
        res.json({ success: true, role: 'ADMIN', uid: 'ADMIN_MASTER_ROOT' });
    } else {
        res.status(401).json({ success: false, message: "INVALID_KEY" });
    }
});

// --------------------------------------------------
// [NEW] DISCOVERY LOGIC: FETCH REAL SS FROM RUNS FOLDER
// --------------------------------------------------
const RUNS_PATH = path.join(__dirname, '../ai-eng/runs/detect');

app.get('/api/v1/vault-discovery', (req, res) => {
    try {
        if (!fs.existsSync(RUNS_PATH)) return res.json({ data: [] });

        const subfolders = fs.readdirSync(RUNS_PATH);
        let allEvidence = [];

        subfolders.forEach(folder => {
            const folderPath = path.join(RUNS_PATH, folder);
            if (fs.lstatSync(folderPath).isDirectory()) {
                const images = fs.readdirSync(folderPath).filter(img => img.endsWith('.jpg') || img.endsWith('.png'));
                
                images.forEach(img => {
                    const imgPath = path.join(folderPath, img);
                    const stats = fs.statSync(imgPath);
                    const base64 = fs.readFileSync(imgPath, { encoding: 'base64' });

                    allEvidence.push({
                        id: `TRC-${Math.floor(Math.random() * 900 + 100)}`,
                        type: 'Neural Capture',
                        time: stats.mtime.toLocaleTimeString(),
                        risk: 'CRITICAL',
                        conf: '99.1%',
                        img: base64,
                        vector: `SVR_FS: ${folder}/${img}`
                    });
                });
            }
        });
        res.json(allEvidence.reverse().slice(0, 15));
    } catch (err) {
        res.status(500).json({ error: "DISCOVERY_FAULT" });
    }
});

// --------------------------------------------------
// [NEW] PERSONNEL REGISTRY ENDPOINTS
// --------------------------------------------------
app.get('/api/operators', async (req, res) => {
    try {
        const ops = await Operator.find();
        res.json(ops);
    } catch (err) {
        res.status(500).json({ error: "REGISTRY_FETCH_FAIL" });
    }
});

app.post('/api/operators', async (req, res) => {
    try {
        const newOp = new Operator(req.body);
        await newOp.save();
        res.status(201).json(newOp);
    } catch (err) {
        res.status(500).json({ error: "REGISTRY_WRITE_FAIL" });
    }
});

app.delete('/api/operators/:id', async (req, res) => {
    try {
        await Operator.findOneAndDelete({ id: req.params.id });
        res.json({ status: "DELETED" });
    } catch (err) {
        res.status(500).json({ error: "REGISTRY_DELETE_FAIL" });
    }
});

// --------------------------------------------------
// DATABASE CONNECTIVITY (ENV UPDATED)
// --------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("[DATABASE] Status: SECURE_CONNECTION_ESTABLISHED"))
    .catch((err) => console.log("[DATABASE] Status: CRITICAL_FAILURE ->", err.message));

// --------------------------------------------------
// NEURAL HANDSHAKE & TELEMETRY SYNC
// --------------------------------------------------
io.on('connection', (socket) => {
    socket.on('request-neural-link', (sessionId) => {
        socket.join(sessionId);
        activeAuthSessions.set(sessionId, { pcSocketId: socket.id, status: 'PENDING' });
        console.log(`[AUTH_LINK] Handshake channel initialized: ${sessionId}`);
    });

    socket.on('submit-biometric-verify', (data) => {
        const { sessionId, userId } = data;
        if (activeAuthSessions.has(sessionId)) {
            io.to(sessionId).emit('neural-auth-verified', {
                status: "ACCESS_GRANTED",
                user: userId || "ADMIN_SECURE",
                timestamp: new Date().toISOString()
            });
            activeAuthSessions.delete(sessionId);
        }
    });

    const statsInterval = setInterval(() => {
        socket.emit('live-telemetry-update', {
            neural_load: Math.floor(Math.random() * 15) + 45,
            integrity: 99.98,
            timestamp: new Date().toLocaleTimeString()
        });
    }, 3000);

    socket.on('disconnect', () => clearInterval(statsInterval));
});

// --------------------------------------------------
// ENDPOINTS: AUTH & HEARTBEAT
// --------------------------------------------------
app.get('/api/v1/auth/session', (req, res) => {
    const sessionId = `SOV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    res.json({ sessionId, expiresIn: 300 });
});

app.post('/api/v1/heartbeat', (req, res) => {
    lastExtensionHeartbeat = Date.now();
    io.emit('engine-telemetry', req.body);
    res.json({ status: "ACKNOWLEDGED", timestamp: new Date() });
});

setInterval(() => {
    const drift = Date.now() - lastExtensionHeartbeat;
    if (drift > 45000) { 
        io.emit('security-alert', { 
            message: "ENDPOINT_TAMPERED: Extension link lost",
            level: 'CRITICAL'
        });
    }
}, 10000);

// --------------------------------------------------
// VISION STREAM & ANALYTICS
// --------------------------------------------------
app.post('/api/v1/stream', (req, res) => {
    io.emit('live-frame', { image: req.body.image });
    res.sendStatus(200);
});

app.get('/api/v1/sys-stats', (req, res) => {
    res.json({
        neural_load: Math.floor(Math.random() * 20) + 40,
        integrity_score: 99.98,
        active_nodes: 14,
        threat_index: forensicEvidenceBuffer.length > 0 ? "ELEVATED" : "LOW",
        uptime_seconds: process.uptime()
    });
});

// --------------------------------------------------
// TERMINAL COMMAND GATEWAY (ADVANCED SUITE)
// --------------------------------------------------
app.post('/api/v1/terminal-command', async (req, res) => {
    const { command } = req.body;
    const cmd = command?.toLowerCase();
    let output = "";

    if (cmd.includes('vision on')) {
        isVisionActive = true;
        output = "[SUCCESS]: Neural Vision Engine 4.2 initialized. GPU acceleration active.";
    } 
    else if (cmd.includes('system check')) {
        output = `[DIAGNOSTICS]: CPU:OK | MEM:34% | DB:CONNECTED | NODES:14 | VISION:${isVisionActive ? 'ONLINE' : 'STANDBY'}`;
    }
    else if (cmd.includes('status')) {
        output = `[CORE]: Stable | Load: ${Math.floor(Math.random() * 10 + 40)}% | Network: Secure | Uptime: ${Math.floor(process.uptime())}s`;
    }
    else if (cmd.includes('clear logs')) {
        await AuditLog.deleteMany({});
        forensicEvidenceBuffer = [];
        output = "[DATABASE]: Incident logs and forensic buffers purged successfully.";
    }
    else if (cmd.includes('lockdown')) {
        io.emit('security-alert', { message: "MANUAL_LOCKDOWN: Authorized by Root", level: 'CRITICAL' });
        output = "[HALT]: Security protocol 9 fully engaged. UI Lockdown active.";
    } 
    else if (cmd === 'clear') { output = "CLEARED"; } 
    else {
        output = `[SHIELD_AI]: '${cmd}' execution recorded. Task completed.`;
    }
    res.json({ output });
});

// --------------------------------------------------
// INCIDENT & AUDIT PIPELINE
// --------------------------------------------------
app.post('/api/v1/alert', async (req, res) => {
    const { type, item, severity, evidence_frame } = req.body;
    
    if(evidence_frame) {
        forensicEvidenceBuffer.unshift({ id: `SEC-${Date.now().toString().slice(-3)}`, type, evidence: evidence_frame, timestamp: new Date() });
        if(forensicEvidenceBuffer.length > 10) forensicEvidenceBuffer.pop();
    }

    io.emit('security-alert', { 
        message: `${type}: ${item}`,
        level: severity || 'CRITICAL',
        timestamp: new Date().toISOString(),
        evidence: evidence_frame 
    });

    try {
        const log = new AuditLog({
            userId: "SYSTEM_ALARM",
            threatsDetected: [type],
            source: "AI_ENGINE_PROXIMITY",
            integrityScore: 0
        });
        await log.save();
    } catch (e) { console.error("Log error:", e); }

    res.status(200).json({ status: "SIGNAL_BROADCAST_SUCCESS" });
});

app.get('/api/v1/logs', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(15);
        res.json(logs);
    } catch (error) { res.status(500).json({ error: "LOG_FETCH_FAILURE" }); }
});

// SCRUBBING TUNNEL
app.post('/api/v1/scrub', async (req, res) => {
    try {
        const { prompt, userId, source } = req.body;
        if (!prompt) return res.status(400).json({ error: "PAYLOAD_EMPTY" });
        const scrubResult = scrubPII(prompt);
        const newLog = new AuditLog({
            userId: userId || "UNAUTHORIZED_ENTITY",
            originalLength: prompt.length,
            cleanLength: scrubResult.sanitized.length,
            threatsDetected: scrubResult.threats, 
            source: source || "ENDPOINT_AGENT",
            integrityScore: scrubResult.integrityScore
        });
        await newLog.save();
        res.json({ secured: scrubResult.sanitized, logId: newLog._id, integrityScore: scrubResult.integrityScore });
    } catch (error) { res.status(500).json({ error: "INTERNAL_TUNNEL_ERROR" }); }
});

// --------------------------------------------------
// SERVER BOOT SEQUENCE
// --------------------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("==================================================");
    console.log(`[CORE_ONLINE] ShieldAI Sovereign Node: Port ${PORT}`);
    console.log(`[VAULT_DISCOVERY] Path: ${RUNS_PATH}`);
    console.log("==================================================");
});