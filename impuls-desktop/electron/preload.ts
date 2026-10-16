import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizedChange: (callback: (isMax: boolean) => void) => {
    const handler = (_: any, isMax: boolean) => callback(isMax);
    ipcRenderer.on('window-maximized-change', handler);
    return () => ipcRenderer.removeListener('window-maximized-change', handler);
  },
  sendNotification: (title: string, body: string) => ipcRenderer.send('notify', { title, body })
});

