

import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';

const VAPID_KEY = 'BANzLQZTvsath-AQDPOSDCHYHtfZoxADuAL_uksk6tT57iIBl6JXVJVPLQ2N1Z6rD5hg9kl4nigqQFZ3TZYZ3yk'; // Replace with your actual public VAPID key

export const useFCMToken = () => {
  useEffect(() => {
    if (!messaging || !VAPID_KEY) return;

    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { vapidKey: VAPID_KEY })
            .then((currentToken) => {
              if (currentToken) {
                console.log('✅ FCM Token:', currentToken);
                // You can send this token to Firestore or your backend here
              } else {
                console.warn('⚠️ No registration token available. Request permission to generate one.');
              }
            })
            .catch((err) => {
              console.error('❌ Error getting FCM token:', err);
            });
        }
      });

    // Handle foreground notifications
    onMessage(messaging, (payload) => {
      console.log('🔔 Foreground message received:', payload);
      alert(`📣 ${payload.notification.title}: ${payload.notification.body}`);
    });
  }, []);
};
