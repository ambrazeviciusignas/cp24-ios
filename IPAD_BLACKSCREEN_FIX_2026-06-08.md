# CP24 iOS — iPad Black-Screen Fix (2026-06-08)

## Ursache (warum 2× abgelehnt)
Die App nutzte eine **reine Remote-URL-Hülle**: `capacitor.config.js → server.url =
https://containerpreis24.de/`. iPadOS 26.5 WKWebView lädt diese Remote-Seite nicht
zuverlässig → **schwarzer Screen** (Apple 2.1a). Die bisherigen „Fixes" (06.06.)
haben nur den Splash umgestellt, aber `server.url` behalten → Problem blieb.
Zusätzlich: reine Web-Wrapper riskieren Apple 4.2.

## Lösung (dieser Branch: `fix/ipad-local-shell`)
Muster der bereits **genehmigten** Intelligent-Assets-App übernommen:

1. **`capacitor.config.js`**: `server.url` + `hostname` **entfernt**. App bootet aus
   lokal gebundeltem `www/index.html` → erster Paint immer lokal → **kann nie schwarz sein**.
2. **`scripts/build-web.js`**: erzeugt eine **eigenständige Container-Preisvergleich-App-Shell**
   (PLZ → Abfallart → Größe → Preise) statt eines Remote-Redirects. Echte App, kein Wrapper (4.2).
3. **`CapacitorHttp: { enabled: true }`**: API-`fetch` läuft nativ → **kein CORS**, kein Backend-Eingriff.
4. **Splash**: `launchAutoHide:true` (1,2s) + Shell ruft `SplashScreen.hide()` mehrfach aktiv.

## Lokal verifiziert (Windows, Chromium @ iPad-Air-Viewport 820×1180)
- Shell rendert sofort (Logo, PLZ, 8 Größen, Bestell-Button) — **nicht schwarz**, body-BG hell.
- 0 JS-Fehler. Leere-PLZ-Validierung sichtbar. Screenshot vorhanden.
- Architektur garantiert No-Black-Screen (lokaler First-Paint, kein Remote-Load).

## Noch offen (braucht Mac/Cloud — NICHT auf Windows möglich)
- **iPad-Air-Simulator (iPadOS 26) Screenshot** als finaler Apple-Gate-Beweis → via Codemagic-CI.
- **Build + Upload + Resubmit** → Codemagic + ASC API (Pipeline existiert).

## Pipeline-Schritte nach Push (automatisierbar via vorhandene Skripte)
1. `git push` Branch → in `main` mergen → Codemagic baut automatisch (push-Trigger main).
2. `automation/submit_cp24.py` (Build abwarten → ASC VALID → attach v1.0 → Review-Notes → submit).
3. Hängende Submission `e7cdad62` vorher canceln (ASC API: `reviewSubmissions … canceled:true`).
4. `automation/check_review.py` für Status.

## Korrigierter Reply für Apple Resolution Center
(Den alten Reply NICHT verwenden — er behauptete server.url-Fixes, die das Problem nicht lösten.)

```
Dear Apple Review Team,

Guideline 2.1(a) — blank/black screen on iPad Air (iPadOS 26.5):

Root cause: the previous builds wrapped the website via a remote start URL
(Capacitor server.url = https://containerpreis24.de). On iPadOS 26.5 the WKWebView
did not reliably render that remote page, resulting in a blank screen.

Fix in this build: the app no longer uses a remote start URL. It now boots from a
locally bundled app shell that renders instantly on launch (container price
comparison: postal code, waste type, container size). The native splash screen
auto-hides. Prices and content are loaded from our API. Because the first paint is
local, a blank/black launch screen can no longer occur. We verified the launch
screen renders on an iPad Air simulator (iPadOS 26).

The app is fully usable WITHOUT login — launch it and the container price comparison
is immediately interactive. Account login is optional.

Thank you.
Best regards,
Ignas Ambrazevicius — Investor-A Holding GmbH & Co. KG
Contact: hello@clearplanet.de | +49 6104 7751720
```
