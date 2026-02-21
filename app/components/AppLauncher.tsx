'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

export default function AppLauncher() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {showInstallButton && !isInstalled && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 flex items-center gap-3 max-w-xs">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <i className="ri-download-line text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Install App</p>
            <p className="text-xs text-gray-600">Add to home screen</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-blue-500 text-white px-3 py-1.5 !rounded-button text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Install
          </button>
        </div>
      )}
      
      {isInstalled && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-lg flex items-center gap-2">
          <i className="ri-check-line text-green-600 text-lg"></i>
          <span className="text-sm text-green-800 font-medium">App Installed</span>
        </div>
      )}
    </div>
  );
}