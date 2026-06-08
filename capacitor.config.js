/** @type {import('@capacitor/cli').CapacitorConfig} */
//
// FIX 2026-06-08 (Apple 2.1a black screen auf iPad + 4.2 Web-Wrapper):
// KEIN server.url mehr. Die App bootet aus dem lokal gebundelten www/index.html
// (scripts/build-web.js erzeugt eine eigenstaendige App-Shell). Inhalte/Preise
// werden per fetch von https://containerpreis24.de/api nachgeladen (CORS erlaubt
// https://localhost + capacitor://localhost). Ein lokaler First-Paint kann nie
// schwarz sein — das war die Ursache der iPadOS-26.5-WKWebView-Reject-Schleife.
const config = {
  appId: 'de.containerpreis24.app',
  appName: 'containerpreis24',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    // KEIN iosScheme:'https' — 'https' ist reserviert, WKWebView laedt es aus dem Netz
    //   statt aus dem lokalen Bundle => schwarzer Screen. Default-Schema 'capacitor'
    //   (capacitor://localhost) wird vom lokalen URLSchemeHandler bedient = lokaler Inhalt.
    // KEIN url:, KEIN hostname: — sonst rendert WKWebView die Remote-Seite.
    allowNavigation: [
      'containerpreis24.de',
      '*.containerpreis24.de',
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
    // Native HTTP: fetch() zur API geht ueber natives Networking -> KEINE WKWebView-CORS-
    // Beschraenkung, kein Backend-CORS-Eintrag noetig. App-Origin bleibt lokal (https://localhost).
    CapacitorHttp: { enabled: true },
    SplashScreen: {
      // Splash verschwindet GARANTIERT (auto-hide + kurze Dauer). Die lokale Shell
      // ruft zusaetzlich SplashScreen.hide() direkt nach erstem Paint auf.
      launchShowDuration: 1200,
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
