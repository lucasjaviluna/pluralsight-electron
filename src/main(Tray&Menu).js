const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const path = require('path');
const countdown = require('./countdown');
const windows = [];

app.on('ready', () => {
  //Tray
  const tray = new Tray(path.join('src', 'tray.png'));

  //contectual menu
  const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Wow',
        click: _ => console.log('Wow clicked!')
      },
      {
        label: 'Awesome',
        click: _ => console.log('Awesome clicked!')
      },
      {
        label: 'Exit',
        click: _ => app.quit()
      }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Electron Rules!');

  //Menu
  const name = electron.app.getName();
  const template = [
    {
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          click: _ => {
            console.log('clicked about!');
          },
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click: _ => {
            app.quit();
          },
          accelerator: 'Cmd+Q'
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  //[1, 2, 3]
  [1].forEach(_ => {
    let win = new BrowserWindow({
      height: 600,
      width: 650
    });

    win.loadURL(`file://${__dirname}/countdown.html`);

    win.on('close', () => {
      console.log('closed!');
      mainWindow = null;
    });

    windows.push(win);
  });
});

ipc.on('countdown-start', () => {
  countdown(count => {
    windows.forEach(win => {
      win.webContents.send('countdown', count);
    });
  });
});
