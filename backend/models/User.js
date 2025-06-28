const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  name: String,
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'auditor'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
