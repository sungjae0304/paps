import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // 0.5s fade out
    }, 2000); // 2s display
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500`}
      style={{ 
        background: 'linear-gradient(135deg, #0B1120 0%, #172554 100%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div className="flex flex-col items-center animate-slide-up">
        <Compass size={64} className="text-white mb-4 animate-pulse" />
        <h1 className="text-white text-3xl font-bold mb-8">D.A.T.A 탐험대</h1>
        
        <div className="text-white text-xs text-center opacity-80 mt-12 space-y-1">
          <p>소속학교: 서울고척초등학교</p>
          <p>제작자: 이성재</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
