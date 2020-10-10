import { app, BrowserWindow } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

class Main {
  private mainWindow?: BrowserWindow

  public init() {
    app.on('ready', this.createWindow)
    app.on('activate', this.onActivate)
    app.on('window-all-closed', this.onWindowAllClosed)
  }

  private onWindowAllClosed() {
    // when developing the app, it is better to close the
    // app as all the windows are closed
    if (isDev || process.platform !== 'darwin') {
      app.quit()
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow()
    }
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    })

    const startUrl = isDev
      ? 'http://localhost:3000'
      : `file://${path.resolve(__dirname, '../renderer/public/index.html')}`

    this.mainWindow.loadURL(startUrl)

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
