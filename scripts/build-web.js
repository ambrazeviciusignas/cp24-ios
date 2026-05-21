// Holt die Live-Web-Shell von containerpreis24.de und packt sie in www/
const fs = require('fs');
const path = require('path');
const https = require('https');

const WWW = path.join(__dirname, '..', 'www');
fs.mkdirSync(WWW, { recursive: true });

const indexUrl = 'https://containerpreis24.de/';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  console.log('[build-web] fetching', indexUrl);
  const html = await fetch(indexUrl);
  // App-Shell: zeige initial Lade-Screen mit Container-Logo, dann Redirect zu Live-Site
  const shell = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>containerpreis24</title>
<link rel="apple-touch-icon" href="cp24-icon.png">
<style>
  html,body{margin:0;padding:0;background:#0EA5E9;font-family:-apple-system,system-ui,sans-serif;color:white;height:100%;overflow:hidden}
  .splash{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:40px}
  .splash h1{font-size:32px;margin:24px 0 8px;font-weight:800;letter-spacing:-1px}
  .splash p{font-size:16px;opacity:0.85;margin:0}
  .loader{width:48px;height:48px;border:4px solid rgba(255,255,255,0.3);border-top-color:#F97316;border-radius:50%;animation:spin 0.8s linear infinite;margin-top:32px}
  @keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>
<div class="splash">
  <h1>containerpreis24</h1>
  <p>Container Preise vergleichen</p>
  <div class="loader"></div>
</div>
<script>
  // Capacitor sync done — jump to live web app
  setTimeout(() => { window.location.replace('https://containerpreis24.de/?ios=1'); }, 800);
</script>
</body>
</html>`;
  fs.writeFileSync(path.join(WWW, 'index.html'), shell);
  console.log('[build-web] OK — www/index.html written');
})().catch(e => { console.error(e); process.exit(1); });
