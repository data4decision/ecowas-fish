const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // ✅ Correct way

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
    console.log('✅ Message sent:', response);
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
}

// Test it with a real FCM token
const testToken = 'YOUR_CLIENT_OR_ADMIN_FCM_TOKEN';
sendNotification(testToken, 'Test Title', 'This is a test notification!');
