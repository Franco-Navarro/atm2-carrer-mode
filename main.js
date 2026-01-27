// Es el punto de entrada de la aplicacion
// Es donde se llevan a cabo los procesos del servidor (Node.js)
const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs/promises')

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  window.loadFile('index.html')
}

Menu.setApplicationMenu(null)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('get-data', async (event, filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
})

ipcMain.handle('save-data', async (event, filename, content) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    return { success: true };
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return { success: false, error: error.message };
  }
})