
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyApvEwO3jDaBxO1kRuRcotdZdmalpPNK6A",,
  authDomain: "ecowas-fisheries.firebaseapp.com",
  projectId: "ecowas-fisheries",
  messagingSenderId: "939774661663",
  appId: "1:939774661663:web:15e5f085df0dbf8965712a",
  vapidKey: "BANzLQZTvsath-AQDPOSDCHYHtfZoxADuAL_uksk6tT57iIBl6JXVJVPLQ2N1Z6rD5hg9kl4nigqQFZ3TZYZ3yk"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {body: payload.notification.body},
    {icon: '/logo.png'}
    
  );
});
