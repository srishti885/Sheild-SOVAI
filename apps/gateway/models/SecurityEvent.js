const mongoose = require('mongoose');

const SecurityEventSchema = new mongoose.Schema({
    eventType: { type: String, required: true }, // Visual_Threat, Screenshot_Attempt, PII_Leak
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
    details: { type: String }, // "Smartphone detected near screen"
    actionTaken: { type: String, default: 'BLOCK_UI' }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecurityEvent', SecurityEventSchema);