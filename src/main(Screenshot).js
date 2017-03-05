const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = electron;

const path = require('path');
const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 20;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 900,
    resizeable: false,
    frame: false
  });

  mainWindow.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/capture.html`);

  mainWindow.on('close', _ => {
    mainWindow = null;
  });

  //globalShortcut.register('Ctrl+Alt+Cmd+D', _ => {
  globalShortcut.register('Ctrl+Alt+d', _ => {
    console.log('Got shortcut');
    mainWindow.webContents.send('capture', app.getPath('pictures'));
  });
});
