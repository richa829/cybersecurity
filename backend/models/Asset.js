const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: String,
  type: String,
  owner: String,
  riskLevel: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
