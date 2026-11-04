const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("node:path");

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let win = null;

  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  function createWindow() {
    win = new BrowserWindow({
      width: 1280,
      height: 800,
      minWidth: 380,
      minHeight: 600,
      backgroundColor: "#fdf8e8",
      title: "رحلة الإيمان",
      icon: path.join(__dirname, "..", "resources", "icon.png"),
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        devTools: !app.isPackaged,
      },
    });

    Menu.setApplicationMenu(null);
    win.on("page-title-updated", (e) => e.preventDefault());
    win.loadFile(path.join(__dirname, "..", "dist-app", "index.html"));

    // External links open in the default browser; the app itself never navigates away.
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:\/\//.test(url)) shell.openExternal(url);
      return { action: "deny" };
    });
    win.webContents.on("will-navigate", (e, url) => {
      if (!url.startsWith("file://")) e.preventDefault();
    });
    win.on("closed", () => { win = null; });
  }

  app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
