import { app, BrowserWindow, ipcMain, Notification, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function log(msg: string) {
  try {
    const logPath = path.join(app.getPath('userData'), 'impuls_startup.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

function createWindow() {
  log('Creating main window...');
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 840,
    minHeight: 600,
    backgroundColor: '#050508',
    frame: false,
    titleBarStyle: 'hidden',
    title: 'Impuls',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-maximized-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-maximized-change', false);
  });

  const indexPath = path.join(__dirname, '../dist/index.html');
  log(`Resolved indexPath: ${indexPath}`);

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(indexPath).catch(err => {
      log(`Error loading file: ${err.message}`);
      dialog.showErrorBox('Impuls Startup Error', `Failed to load interface: ${err.message}`);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.stack || error.message}`);
  dialog.showErrorBox('Impuls Error', error.message);
});

app.whenReady().then(() => {
  log('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() ?? false;
});

ipcMain.on('notify', (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

