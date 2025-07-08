const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // this must match the name you saved

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
