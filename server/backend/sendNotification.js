// backend/sendNotification.js
const admin = require('firebase-admin');
const path = require('path');

// ✅ Load the service account key
const serviceAccount = require(path.resolve(__dirname, './firebase/serviceAccountKey.json'));

// ✅ Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Function to send push notification
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

// 🔁 Example usage
const testToken = 'YOUR_FCM_DEVICE_TOKEN_HERE';
sendNotification(testToken, 'Hello', 'This is a test push notification');
