const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'OPERATOR', 'GUEST'], default: 'GUEST' },
  
  // Biometric Security Data
  pairedDeviceId: { type: String }, // User ke phone ka unique ID
  biometricPublicKey: { type: String }, // Fingerprint verify karne ke liye key
  
  accountStatus: { type: String, enum: ['ACTIVE', 'LOCKED', 'SUSPENDED'], default: 'ACTIVE' },
  lastNeuralSync: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);