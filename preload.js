// Es el puente entre el main y el renderer 
const { contextBridge, ipcRenderer } = require('electron/renderer')

// exposeInMainWorld Se crea el objeto con el que se va a comunicar el renderer con el main
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
})



contextBridge.exposeInMainWorld('dataManager', {
    load: (filename) => ipcRenderer.invoke('get-data', filename),
    save: (filename, data) => ipcRenderer.invoke('save-data', filename, data)
})