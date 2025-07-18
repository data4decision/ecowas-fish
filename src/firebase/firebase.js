// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ✅ Import storage

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApvEwO3jDaBxO1kRuRcotdZdmalpPNK6A",
  authDomain: "ecowas-fisheries.firebaseapp.com",
  projectId: "ecowas-fisheries",
  storageBucket: "ecowas-fisheries.appspot.com",
  messagingSenderId: "939774661663",
  appId: "1:939774661663:web:15e5f085df0dbf8965712a",
  measurementId: "G-PFFB4GKE8W"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export storage

const messaging = getMessaging(app);

// ✅ FCM Permission & Foreground Listener
export const initMessaging = async (onReceive) => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, {
      vapidKey: "BANzLQZTvsath-AQDPOSDCHYHtfZoxADuAL_uksk6tT57iIBl6JXVJVPLQ2N1Z6rD5hg9kl4nigqQFZ3TZYZ3yk"
    });
    console.log("FCM Token:", token);
    onReceive(token);
  } catch (err) {
    console.error("FCM init error", err);
  }

  onMessage(messaging, (payload) => {
    console.log("Foreground message", payload);
    alert(`${payload.notification.title}: ${payload.notification.body}`);
  });
};

export { messaging };
