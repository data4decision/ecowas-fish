const admin = require('firebase-admin');
const path = require('path');

// ✅ Correct usage of __dirname
const serviceAccount = require(path.resolve(__dirname, './firebase/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(token, title, body) {
  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent successfully:', response);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}
