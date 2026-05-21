/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'de.containerpreis24.app',
  appName: 'containerpreis24',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'containerpreis24.de',
    allowNavigation: [
      'containerpreis24.de',
      '*.containerpreis24.de',
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
      launchShowDuration: 1500,
      launchAutoHide: true,
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
