const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    userId: { type: String, default: "Anonymous" },
    originalLength: Number,
    cleanLength: Number,
    threatsDetected: [String], // ["EMAIL", "PHONE", etc.]
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);