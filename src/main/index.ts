import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'

class Main {
  private mainWindow?: BrowserWindow

  public init() {
    app.on('ready', this.createWindow)
    app.on('activate', this.onActivate)
    app.on('window-all-closed', this.onWindowAllClosed)
  }

  private onWindowAllClosed = () => {
    // when developing the app, it is better to close the
    // app as all the windows are closed
    if (isDev || process.platform !== 'darwin') {
      app.quit()
    }
  }

  private onActivate = () => {
    if (!this.mainWindow) {
      this.createWindow()
    }
  }

  private createWindow = () => {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    })

    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000')
    } else {
      this.mainWindow.loadFile('build/renderer/index.html')
    }

    this.mainWindow.once('ready-to-show', () => {
      if (this.mainWindow) {
        this.mainWindow.show()
      }
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = undefined
    })
  }
}

new Main().init()
