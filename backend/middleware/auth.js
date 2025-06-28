const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const serviceAccount = require('../config/firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
    const jwtToken = jwt.sign({ uid: decodedFirebaseToken.uid }, process.env.JWT_SECRET, { expiresIn: '2h' });
    req.user = decodedFirebaseToken;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};
