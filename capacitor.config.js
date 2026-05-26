/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'de.containerpreis24.app',
  appName: 'containerpreis24',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    // DIRECT REMOTE LOAD - proven solution for iPad black-screen
    // Removed ?ios=1 query because iPadOS 26.5 WKWebView may treat
    // it as a different origin from `hostname` setting (cookie isolation).
    url: 'https://containerpreis24.de/',
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'containerpreis24.de',
    allowNavigation: [
      'containerpreis24.de',
      '*.containerpreis24.de',
      'www.containerpreis24.de',
      'api.containerpreis24.de',
      'js.stripe.com',
      'hooks.stripe.com',
      'checkout.stripe.com'
    ],
    cleartext: false
  },
  ios: {
    contentInset: 'always',
    scheme: 'CP24',
    backgroundColor: '#0EA5E9',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: false
  },
  plugins: {
    SplashScreen: {
      // KEY FIX: Don't auto-hide. Keep splash visible until WebView truly ready.
      // The cp24-native.js bridge on the live site calls SplashScreen.hide()
      // after window.load - this prevents the "splash gone, webview empty = black" race.
      launchShowDuration: 6000,
      launchAutoHide: false,
      backgroundColor: '#0EA5E9',
      iosSpinnerStyle: 'large',
      spinnerColor: '#F97316',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#0EA5E9',
      overlaysWebView: false
    }
  }
};
module.exports = config;
