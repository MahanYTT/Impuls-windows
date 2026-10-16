import React, { useState, useEffect } from 'react';
import { ImpulsLogo } from '../assets/Logo';
import { Minus, Square, Copy, X } from 'lucide-react';

interface TitleBarProps {
  serverHost?: string;
  isOnline?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  serverHost = '80.201.130.248',
  isOnline = true,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);
      const unsubscribe = window.electronAPI.onMaximizedChange((max) => {
        setIsMaximized(max);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximize();
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <header className="apple-titlebar">
      {/* Apple Traffic Lights (macOS Controls) */}
      <div className="apple-traffic-lights">
        <button
          onClick={handleClose}
          className="apple-traffic-btn close"
          title="Close"
          aria-label="Close"
        >
          <span className="apple-traffic-icon">✕</span>
        </button>

        <button
          onClick={handleMinimize}
          className="apple-traffic-btn minimize"
          title="Minimize"
          aria-label="Minimize"
        >
          <span className="apple-traffic-icon">−</span>
        </button>

        <button
          onClick={handleMaximize}
          className="apple-traffic-btn maximize"
          title={isMaximized ? "Restore" : "Zoom"}
          aria-label={isMaximized ? "Restore" : "Zoom"}
        >
          <span className="apple-traffic-icon">+</span>
        </button>
      </div>

      {/* Centered Brand & Server Info */}
      <div className="apple-titlebar-center">
        <ImpulsLogo size={16} />
        <span className="apple-titlebar-title">Impuls</span>
        <div className="apple-titlebar-badge" title="Encrypted MTProto Server">
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#30d158' : '#8e8e93',
            }}
          />
          <span>{serverHost}</span>
        </div>
      </div>

      {/* Symmetrical Right Spacer */}
      <div style={{ width: '64px' }} />
    </header>
  );
};
