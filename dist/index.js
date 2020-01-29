"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

var _electron = require("electron");

let windowFocusedCallback = null;
let windowCreatedCallback = null;
let isFocused = false;

function centerWindow(backWindow, frontWindow) {
  const backBounds = backWindow.getBounds();
  const backCenterX = backBounds.x + Math.round(backBounds.width / 2);
  const backCenterY = backBounds.y + Math.round(backBounds.height / 2);
  const frontBounds = frontWindow.getBounds();
  const frontX = backCenterX - Math.round(frontBounds.width / 2);
  const frontY = backCenterY - Math.round(frontBounds.height / 2);
  frontWindow.setBounds({ ...frontBounds,
    x: frontX,
    y: frontY
  });
}

function onWindowFocused(win) {
  isFocused = win === inkdrop.window;
}

function onWindowCreated(win) {
  if (isFocused) {
    centerWindow(inkdrop.window, win);
  }
}

function activate() {
  windowFocusedCallback = (_, win) => onWindowFocused(win);

  windowCreatedCallback = (_, win) => onWindowCreated(win);

  _electron.remote.app.on('browser-window-focus', windowFocusedCallback);

  _electron.remote.app.on('browser-window-created', windowCreatedCallback);

  isFocused = inkdrop.window.isFocused();
}

function deactivate() {
  if (windowFocusedCallback !== null) {
    _electron.remote.app.off('browser-window-focus', windowFocusedCallback);

    windowFocusedCallback = null;
  }

  if (windowCreatedCallback !== null) {
    _electron.remote.app.off('browser-window-created', windowCreatedCallback);

    windowCreatedCallback = null;
  }
}
//# sourceMappingURL=index.js.map