
'use client';

import { useState } from 'react';
import GameController from './components/GameController';
import SplashScreen from './components/SplashScreen';
import AppLauncher from './components/AppLauncher';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen relative">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {!showSplash && (
        <>
          <AppLauncher />
          <GameController />
        </>
      )}
    </div>
  );
}
