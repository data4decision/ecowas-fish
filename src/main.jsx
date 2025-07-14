import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import './i18n';
import {AuthProvider} from "./context/AuthContext.jsx"



// ✅ Setup AOS inside a wrapper component
const AppInitializer = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return <App />;
};

// ✅ Final render including AuthProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider/>
        <AppInitializer />
      <AuthProvider/>
    </BrowserRouter>
  </StrictMode>
);
