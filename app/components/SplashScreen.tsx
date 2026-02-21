'use client';

import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <div className="text-6xl text-white">
              ♠
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">♥</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Pacifico, serif' }}>
            Spades Game
          </h1>
          <p className="text-blue-100 text-lg">
            4-Player Card Game
          </p>
        </div>
        
        <div className="w-64 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm mt-2">
            Loading... {progress}%
          </p>
        </div>
        
        <div className="flex justify-center space-x-4 text-white/60">
          <div className="flex items-center space-x-2">
            <i className="ri-user-line text-lg"></i>
            <span className="text-sm">4 Players</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-trophy-line text-lg"></i>
            <span className="text-sm">Win 7 Tricks</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs">
        Tap to play after loading
      </div>
    </div>
  );
}