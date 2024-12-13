const admin = require('firebase-admin');

const serviceAccount = require('./firebasekey/todobackend-f3a80-firebase-adminsdk-ok5it-27445c466c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://todobackend-f3a80.firebaseio.com',
});



module.exports = admin; 
