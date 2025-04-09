const {contextBridge,ipcRenderer} = require('electron');
const {gsap} = require('gsap');
 import {loadMainMenu, mainMenuEvents} from './renderer files/mainMenu.mjs';
 import {loadWS_Menu ,WS_MenuEvents} from './renderer files/W-S_Menu.mjs';
 import { loadE_WS_Menu } from './renderer files/E_W-S_Menu.mjs';
 import { loadExcelFile } from './renderer files/X_W-S_Menu.mjs';
//  import { getDataPoints } from './renderer files/plot.mjs';


contextBridge.exposeInMainWorld('winres',{
    quit: ()=> ipcRenderer.send('quit'),
    setupPlotWin: () => ipcRenderer.send('setupPlotWin'),
    isPlotWinOpen: ()=>  ipcRenderer.invoke('isPlotWinOpen'),
    plot: (dataPoints)=> ipcRenderer.send('plot',dataPoints),
    sayHello: () => console.log('Hello!'),
    dialogBox: (msg) =>{
        const dialog = document.querySelectorAll("dialog")[0];
        const closeButton = document.getElementById("close-dialog");

        dialog.style.transform = `translate(${(window.innerWidth/2) - 250}px, ${(window.innerHeight/2) - 100}px)`;
        dialog.querySelector('#msg').textContent = msg;
        closeButton.addEventListener("click", () => {
        dialog.close();
});

        dialog.showModal();
    }
});

contextBridge.exposeInMainWorld('gsapAnim',{
    to: (...args) => gsap.to(...args),
    from: (...args) => gsap.from(...args),
    fromTo: (...args) => gsap.fromTo(...args),
    set: (...args) => gsap.set(...args)
});

contextBridge.exposeInMainWorld('mainMenu', {
    load: loadMainMenu,
    attachEvents: mainMenuEvents
});

contextBridge.exposeInMainWorld('WS_Menu', {
    load: loadWS_Menu,
    attachEvents: WS_MenuEvents
})

contextBridge.exposeInMainWorld('E_WS_Menu', {
    load: loadE_WS_Menu
})

contextBridge.exposeInMainWorld('X_WS_Menu', {
    load: loadExcelFile
})

ipcRenderer.on('progress', (ev,progress)=>{
    const dialog = document.querySelectorAll("dialog")[1];
    const progressTracker =  dialog.querySelector('#progress-tracker')
    const rootElem = document.querySelector(':root');
    rootElem.style.setProperty('--progress-bar-width',`${progress}%`);
    progressTracker.textContent = `Inversion Progress:${progress}%`;
    if(progress === 100){
       setTimeout(()=>{
        dialog.close();
        progressTracker.textContent = `Inversion Progress:0%`;
        ipcRenderer.send('show-plot-win')
       },500)
    }
    // document.getElementById('progress-display').textContent = `Inversion Progress:${progress}%`
})

