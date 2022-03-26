'use babel';

import * as remote from '@electron/remote';

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

  frontWindow.setBounds({
    ...frontBounds,
    x: frontX,
    y: frontY,
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

export function activate() {
  windowFocusedCallback = (_, win) => onWindowFocused(win);
  windowCreatedCallback = (_, win) => onWindowCreated(win);

  remote.app.on('browser-window-focus', windowFocusedCallback);
  remote.app.on('browser-window-created', windowCreatedCallback);

  isFocused = inkdrop.window.isFocused();
}

export function deactivate() {
  if (windowFocusedCallback !== null) {
    remote.app.off('browser-window-focus', windowFocusedCallback);
    windowFocusedCallback = null;
  }

  if (windowCreatedCallback !== null) {
    remote.app.off('browser-window-created', windowCreatedCallback);
    windowCreatedCallback = null;
  }
}
