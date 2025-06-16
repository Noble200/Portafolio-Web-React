import React, { useState, useEffect } from 'react';
import App from './App'; // Versión Desktop
import AppMobile from './AppMobile'; // Versión Mobile

const DeviceDetector = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;
      
      // Detectar móviles por User Agent
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'mobile', 'opera mini'
      ];
      
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      // Detectar por tamaño de pantalla (breakpoint: 768px)
      const isMobileScreen = screenWidth <= 768;
      
      // Detectar por características táctiles
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Lógica de detección combinada
      const mobileDetected = isMobileUA || (isMobileScreen && isTouchDevice);
      
      setIsMobile(mobileDetected);
      
      // Debug info en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Device Detection:', {
          detected: mobileDetected ? 'MOBILE' : 'DESKTOP',
          userAgent,
          screenWidth,
          isMobileUA,
          isMobileScreen,
          isTouchDevice
        });
      }
      
      setIsLoading(false);
    };

    // Detectar al cargar
    detectDevice();
    
    // Re-detectar al cambiar tamaño de ventana
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Pantalla de carga mientras detecta
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0b1e] to-[#1a1b2e] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-[#8b5fbf] to-[#6366f1] bg-clip-text text-transparent mb-4">
            Ekizr
          </div>
          <div className="w-8 h-8 border-4 border-[#8b5fbf]/30 border-t-[#8b5fbf] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Detecting device...</p>
        </div>
      </div>
    );
  }

  // Renderizar componente según dispositivo
  return (
    <div>
      {/* Indicador de versión en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 right-0 z-[9999] bg-[#8b5fbf] text-white px-3 py-1 text-xs font-bold">
          {isMobile ? '📱 MOBILE' : '🖥️ DESKTOP'}
        </div>
      )}
      
      {/* Renderizar componente correspondiente */}
      {isMobile ? <AppMobile /> : <App />}
    </div>
  );
};

export default DeviceDetector;