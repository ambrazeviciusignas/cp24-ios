/* containerpreis24 native-app integration
 * Loaded only when Capacitor environment present.
 * Exposes window.CP24_NATIVE = true to web app for native-aware UI tweaks.
 */
(function() {
  if (typeof window === 'undefined') return;
  if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;

  window.CP24_NATIVE = true;
  document.documentElement.classList.add('native-app', 'ios-app');

  // Status bar / safe areas
  if (window.Capacitor.Plugins.StatusBar) {
    window.Capacitor.Plugins.StatusBar.setStyle({ style: 'DARK' }).catch(() => {});
  }

  // Hide PWA-only / web-only elements
  const style = document.createElement('style');
  style.textContent = `
    html.native-app .pwa-install-banner,
    html.native-app .web-only,
    html.native-app a[href^="https://apps.apple.com"],
    html.native-app a[href^="https://play.google.com"] { display: none !important; }
    html.ios-app body { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); }
  `;
  document.head.appendChild(style);

  console.log('[CP24] Native bridge initialized');
})();
