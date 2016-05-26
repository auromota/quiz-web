const {app} = require('electron');
const {BrowserWindow} = require('electron');

let win = null;

app.on('window-all-closed', function() {
    // if platform is Mac, ensure that only cmd + Q will quit
    if(process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {
    win = new BrowserWindow({width: 800, height: 600, show: false, fullscreen: true});
    win.setMenu(null);
    win.loadURL('file://' + __dirname + '/index.html');
    win.show();
    win.on('closed', function() {
        mainWindow = null;
    });
});
