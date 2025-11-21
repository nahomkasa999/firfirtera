'use client';

import WebApp from '@twa-dev/sdk';

export function initTelegram() {
  if (typeof window !== 'undefined') {
    WebApp.ready();
    WebApp.expand();
    
    // Set theme colors to match new color scheme
    WebApp.setHeaderColor('#f8f7f5');
    WebApp.setBackgroundColor('#f8f7f5');
  }
}

export function getUser() {
  if (typeof window !== 'undefined') {
    return WebApp.initDataUnsafe.user;
  }
  return null;
}

export function getInitData() {
  if (typeof window !== 'undefined') {
    return WebApp.initData;
  }
  return '';
}

export function closeApp() {
  if (typeof window !== 'undefined') {
    WebApp.close();
  }
}

export function showAlert(message: string) {
  if (typeof window !== 'undefined') {
    WebApp.showAlert(message);
  }
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      WebApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    } else {
      resolve(false);
    }
  });
}

