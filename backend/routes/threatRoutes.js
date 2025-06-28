const express = require('express');
const Threat = require('../models/Threat');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/report', auth, async (req, res) => {
  try {
    const threat = new Threat(req.body);
    await threat.save();
    res.json(threat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const threats = await Threat.find().populate('assetId');
    res.json(threats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
