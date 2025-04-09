const {app, BrowserWindow, Menu, nativeTheme, ipcMain} = require('electron');
const path = require('path');

//GLOBALS & GLOBAL SETTINGS
let mainWin, windowHeight;
nativeTheme.themeSource = 'dark';

//Windows
const startMainWindow = () =>{
     mainWin = new BrowserWindow({
            titleBarStyle: 'hidden',
            titleBarOverlay: {
              color: '#242424',
              symbolColor: '#ffffff8c',
              height: 30
            },
            webPreferences:{    
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.mjs')
        }
    });
    
let mainMenu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(mainMenu);
 setTimeout(()=>{
    mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
 },7800);

openDevTools(mainWin)
 mainWin.loadFile('./renderer files/index.html')
};

let plotWin = null, isPlotWinOpen = false;
const startPlotWindow = () =>{
    if (plotWin && !plotWin.isDestroyed()) {
        plotWin.focus();
        isPlotWinOpen = true;
        return;
    }
    
    plotWin= new BrowserWindow({
        width: 1000,
        height: 800,
        show:false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, 'plotPreload.mjs'),
        }
    });
    
    
openDevTools(plotWin);
const menu = Menu.buildFromTemplate(plotMenu);
plotWin.setMenu(menu);
plotWin.loadFile('./renderer files/plot.html');
plotWin.on('close',()=>{isPlotWinOpen = false});
// plotWin.once('ready-to-show',() =>{plotWin.showInactive()})
isPlotWinOpen = true;
}

//IPC
ipcMain.on('quit', ()=> app.quit());
ipcMain.on('setupPlotWin', ()=>  startPlotWindow());
ipcMain.on('plot', (ev,dataPoints)=>{
plotWin.webContents.send('plot', dataPoints);
});
ipcMain.on('progress', (ev,progress)=>{
mainWin.webContents.send('progress', progress);
});
ipcMain.on('show-plot-win', ()=> plotWin.show())
ipcMain.handle('isPlotWinOpen', ()=> isPlotWinOpen);


//Menu Customization
const plotMenu = [
   {
    label: '&Help',
    submenu: [{
        label: 'Plot info',
        accelerator: 'Ctrl+H',
        click: () => {}
    }]
   }
];

const menu = [
    {
        label: '&About',
        submenu: [{
            label: 'About Winresist V2',
            accelerator: 'Ctrl+B',
            click: () => {}
        }]
    },
    {
        label:'&Help',
        submenu:[
        {
            label: 'Wenner Array',
        },
        {
            label: 'Schlumberger Array',
        },
        {
            label: 'Dipole Array',
        },
    ]
    },

    {
        label: '&Quit',
        submenu:[
            {
                label:'Quit app',
                accelerator:'Ctrl+W',
                click: ()=> app.quit()
            }
        ]
    },

    {
        label: 'DevTools',
        accelerator:'Ctrl+D',
        click: ()=> openDevTools(mainWin),
    }
]

const openDevTools = (window) =>{
   window.webContents.openDevTools()
}


app.whenReady().then(()=>{ 
    startMainWindow()
})