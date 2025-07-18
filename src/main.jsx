// src/main.js
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';
import './i18n';
import { AuthProvider } from './context/AuthContext.jsx';

// ✅ Register FCM Service Worker BEFORE app loads
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then(() => console.log("SW registered"))
//     .catch(console.error);
// }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
}





// ✅ Initialize AOS and render App
const AppInitializer = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return <App />;
};

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <AppInitializer />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error('❌ No root element found in index.html');
}
