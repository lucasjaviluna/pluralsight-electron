const electron = require('electron');
const { app, clipboard, Menu, Tray, BrowserWindow, globalShortcut } = electron;

const path = require('path');
const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 20;

function addToStack(item, stack) {
  return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack);
}

function checkClipboardForChange(clipboard, onChange) {
  let cache = clipboard.readText();
  let latest;
  setInterval(function () {
    latest = clipboard.readText();
    if (latest !== cache) {
      cache = latest;
      onChange(cache);
    }
  }, 1000);
}

function formatItem(item) {
  return item &&
         item.length > ITEM_MAX_LENGTH ? item.substr(0, ITEM_MAX_LENGTH) + '...'
         : item;
}

function formatMenuTemplateForStack(clipboard, stack) {
  return stack.map((item, i) => {
    return {
      label: `Copy: ${formatItem(item)}`,
      click: _ => clipboard.writeText(item),
      accelerator: `Cmd+Alt+${i + 1}`
    };
  });
}

function registerShortcuts(globalShortcut, clipboard, stack) {
  globalShortcut.unregisterAll();
  for (let i = 0; i < STACK_SIZE; i++) {
    globalShortcut.register(`Cmd+Alt+${i + 1}`, _ => {
      clipboard.writeText(stack[i]);
    });
  }
}

app.on('ready', () => {
  let stack = [];

  //Tray
  const tray = new Tray(path.join('src', 'tray.png'));

  //contextual menu
  const contextMenu = Menu.buildFromTemplate([
      {
        label: '<Empty>',
        enabled: false,
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

  checkClipboardForChange(clipboard, text => {
    stack = addToStack(text, stack);
    tray.setContextMenu(Menu.buildFromTemplate(formatMenuTemplateForStack(clipboard, stack)));
    registerShortcuts(globalShortcut, clipboard, stack);
    //console.log("stack ", stack);
  });
});

app.on('will-quit', _ => {
  globalShortcut.unregisterAll();
});
