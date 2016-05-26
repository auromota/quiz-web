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
    win = new BrowserWindow({width: 500, height: 500, show: false});
    win.setMenu(null);
    win.loadURL('file://' + __dirname + '/index.html');
    win.maximize();
    win.show();
    win.on('closed', function() {
        mainWindow = null;
    });
});
