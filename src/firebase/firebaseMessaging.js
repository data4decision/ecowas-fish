import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseApp } from './firebaseConfig';

// Initialize messaging
const messaging = getMessaging(firebaseApp);

// Request permission and get token
export const requestFCMToken = async (vapidKey) => {
  try {
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};

// Foreground message handler
export const onForegroundMessage = (callback) => {
  onMessage(messaging, payload => {
    console.log("FCM Foreground Message:", payload);
    callback(payload);
  });
};

export { messaging };
