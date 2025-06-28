const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  type: String,
  severity: String,
  description: String,
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }
}, { timestamps: true });

module.exports = mongoose.model('Threat', threatSchema);
