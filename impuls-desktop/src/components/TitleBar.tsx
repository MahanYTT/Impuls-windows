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
    <header className="telegram-titlebar">
      {/* Drag & Brand Info */}
      <div className="telegram-titlebar-drag">
        <ImpulsLogo size={18} />
        <span className="telegram-titlebar-title">Impuls Desktop</span>
        <div className="telegram-titlebar-badge" title="Connected to Private Telegram MTProto Server">
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isOnline ? 'var(--status-online)' : 'var(--status-offline)',
              boxShadow: isOnline ? '0 0 8px rgba(35, 165, 90, 0.8)' : 'none',
            }}
          />
          <span>{serverHost}</span>
        </div>
      </div>

      {/* Telegram-style Window Controls */}
      <div className="telegram-titlebar-controls">
        <button
          onClick={handleMinimize}
          className="telegram-titlebar-btn"
          title="Minimize"
          aria-label="Minimize"
        >
          <Minus size={13} strokeWidth={2} />
        </button>

        <button
          onClick={handleMaximize}
          className="telegram-titlebar-btn"
          title={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? (
            <Copy size={11} strokeWidth={2} style={{ transform: 'rotate(90deg)' }} />
          ) : (
            <Square size={11} strokeWidth={2} />
          )}
        </button>

        <button
          onClick={handleClose}
          className="telegram-titlebar-btn close"
          title="Close"
          aria-label="Close"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
};
