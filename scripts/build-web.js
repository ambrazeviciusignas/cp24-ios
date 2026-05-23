// containerpreis24 Web-Bundle (Fallback-HTML)
// Da server.url jetzt direkt auf https://containerpreis24.de zeigt,
// wird www/index.html nur als Failover bei Network-Errors verwendet.
const fs = require('fs');
const path = require('path');

const WWW = path.join(__dirname, '..', 'www');
fs.mkdirSync(WWW, { recursive: true });

const fallback = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta http-equiv="refresh" content="0; url=https://containerpreis24.de/?ios=1">
<title>containerpreis24</title>
<style>
  html,body{margin:0;padding:0;background:#0EA5E9;color:#fff;font-family:-apple-system,system-ui,sans-serif;height:100%;display:flex;align-items:center;justify-content:center;text-align:center}
  .c{padding:40px}
  h1{font-size:32px;margin:0 0 8px;font-weight:800;letter-spacing:-1px}
  p{font-size:16px;opacity:.85;margin:0 0 24px}
  .l{width:48px;height:48px;border:4px solid rgba(255,255,255,.3);border-top-color:#F97316;border-radius:50%;animation:s .8s linear infinite;margin:0 auto}
  @keyframes s{to{transform:rotate(360deg)}}
  a{color:#fff;text-decoration:underline}
</style>
</head>
<body>
<div class="c">
  <h1>containerpreis24</h1>
  <p>Container Preise vergleichen</p>
  <div class="l"></div>
  <p style="margin-top:32px;font-size:13px">
    Falls die App nicht lädt: <br>
    <a href="https://containerpreis24.de/?ios=1">containerpreis24.de</a>
  </p>
</div>
<script>
  // Triple-failsafe: meta refresh + JS replace + manual click
  setTimeout(function(){
    try { window.location.replace('https://containerpreis24.de/?ios=1'); }
    catch(e){ window.location.href = 'https://containerpreis24.de/?ios=1'; }
  }, 100);
</script>
</body>
</html>`;
fs.writeFileSync(path.join(WWW, 'index.html'), fallback);
console.log('[build-web] OK — www/index.html fallback written (server.url handles primary load)');
