import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DeviceDetector from './DeviceDetector'; // Detector que carga App.js o AppMobile.js
import reportWebVitals from './reportWebVitals';

// CSS adicional para asegurar responsive
const responsiveStyles = `
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  /* Prevenir zoom en iOS */
  input, textarea, select {
    font-size: 16px !important;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Ocultar scrollbar horizontal */
  body::-webkit-scrollbar-x {
    display: none;
  }
`;

// Inyectar estilos responsive
const styleElement = document.createElement('style');
styleElement.textContent = responsiveStyles;
document.head.appendChild(styleElement);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DeviceDetector />
  </React.StrictMode>
);

// Medición de performance
reportWebVitals();