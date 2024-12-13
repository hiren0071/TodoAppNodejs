const admin = require('firebase-admin');

const serviceAccount = require('./firebasekey/todobackend-f3a80-firebase-adminsdk-ok5it-980cc129dd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://todobackend-f3a80.firebaseio.com',
});



module.exports = admin; 


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://todobackend-f3a80.firebaseio.com',
});



module.exports = admin; 
