// containerpreis24 iOS — lokale App-Shell (FIX 2026-06-08)
//
// Erzeugt ein VOLLSTAENDIG lokal gebundeltes www/index.html. KEIN server.url,
// KEIN Remote-Redirect. Die App bootet aus diesem File (erster Paint immer lokal
// => kann nie schwarz sein), versteckt den Splash garantiert und laedt Preise per
// fetch von https://containerpreis24.de/api (CORS erlaubt https://localhost).
// Bestellung/rechtliche Seiten oeffnen im System-Browser (Capacitor Browser).
//
// Das ist KEIN Web-Wrapper (Apple 4.2): eine eigenstaendige native App-Shell mit
// API-getriebenem Inhalt — exakt das Muster der bereits genehmigten IA-App.

const fs = require('fs');
const path = require('path');

const WWW = path.join(__dirname, '..', 'www');
fs.mkdirSync(WWW, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#0EA5E9">
<title>containerpreis24</title>
<style>
  :root{--blue:#0EA5E9;--blue-d:#0284c7;--orange:#F97316;--ink:#0f172a;--mut:#64748b;--line:#e2e8f0;--bg:#f1f5f9}
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,system-ui,"Segoe UI",sans-serif;min-height:100%}
  body{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
  header{background:linear-gradient(135deg,var(--blue),var(--blue-d));color:#fff;padding:18px 18px 22px;text-align:center}
  header .logo{font-size:22px;font-weight:800;letter-spacing:-.5px}
  header .logo span{color:#fff}
  header p{margin:4px 0 0;font-size:13px;opacity:.9}
  main{max-width:560px;margin:0 auto;padding:16px}
  .card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:18px;box-shadow:0 4px 16px rgba(15,23,42,.05);margin-bottom:14px}
  label{display:block;font-size:12px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.4px;margin:0 0 6px}
  input,select{width:100%;padding:13px 14px;border:1px solid var(--line);border-radius:12px;font-size:16px;background:#f8fafc;outline:none;font-family:inherit}
  input:focus,select:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(14,165,233,.15)}
  .field{margin-bottom:14px}
  .sizes{display:flex;flex-wrap:wrap;gap:8px}
  .size{flex:1 0 calc(25% - 8px);min-width:64px;padding:11px 0;border:1px solid var(--line);border-radius:11px;background:#f8fafc;font-size:15px;font-weight:600;text-align:center;cursor:pointer}
  .size.active{background:var(--blue);color:#fff;border-color:var(--blue)}
  .btn{display:block;width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}
  .btn-primary{background:var(--orange);color:#fff}
  .btn-primary:active{opacity:.85}
  .err{color:#dc2626;font-size:13px;font-weight:600;margin:8px 0 0;display:none}
  .res-head{font-size:16px;font-weight:800;margin:6px 2px 12px}
  .offer{border:1px solid var(--line);border-radius:14px;padding:14px;margin-bottom:10px;background:#fff}
  .offer.best{border-color:var(--blue);box-shadow:0 0 0 2px rgba(14,165,233,.12)}
  .offer .top{display:flex;justify-content:space-between;align-items:flex-start}
  .offer .name{font-weight:700;font-size:15px}
  .offer .city{font-size:12px;color:var(--mut)}
  .offer .price{font-size:22px;font-weight:800;color:var(--blue-d)}
  .offer .price small{display:block;font-size:10px;color:var(--mut);font-weight:500;text-align:right}
  .offer .meta{font-size:12px;color:var(--mut);margin:6px 0 10px}
  .badge{display:inline-block;background:var(--orange);color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;margin-bottom:6px}
  .stars{color:var(--orange);font-size:13px}
  .order{display:block;width:100%;padding:11px;border:none;border-radius:10px;background:var(--blue);color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit}
  .note{text-align:center;font-size:12px;color:var(--mut);margin:14px 2px}
  .foot{text-align:center;font-size:12px;color:var(--mut);padding:8px 16px 24px}
  .foot a{color:var(--blue-d);text-decoration:none;margin:0 6px}
  .spin{width:34px;height:34px;border:3px solid var(--line);border-top-color:var(--orange);border-radius:50%;animation:sp .8s linear infinite;margin:18px auto}
  @keyframes sp{to{transform:rotate(360deg)}}
  .hidden{display:none}
</style>
</head>
<body>
<header>
  <div class="logo">container<span>preis24</span></div>
  <p>Container-Preise vergleichen — bis 40% sparen</p>
</header>
<main>
  <div class="card">
    <div class="field">
      <label for="plz">Postleitzahl</label>
      <input id="plz" type="text" inputmode="numeric" maxlength="5" placeholder="z.B. 63150" autocomplete="postal-code">
    </div>
    <div class="field">
      <label for="waste">Abfallart</label>
      <select id="waste">
        <option value="bauschutt">Bauschutt (rein)</option>
        <option value="baumisch">Baumischabfall</option>
        <option value="sperrmull">Sperrmüll</option>
        <option value="holz">Holz</option>
        <option value="grunschnitt">Grünschnitt</option>
        <option value="erdaushub">Erdaushub</option>
        <option value="gewerbe">Gewerbeabfall</option>
      </select>
    </div>
    <div class="field">
      <label>Containergröße</label>
      <div class="sizes" id="sizes"></div>
    </div>
    <button class="btn btn-primary" id="go">Preise vergleichen — kostenlos</button>
    <p class="err" id="err"></p>
  </div>
  <div id="results"></div>
  <p class="note">🌍 1 € jeder Bestellung geht an die ClearPlanet-Umweltinitiative</p>
</main>
<div class="foot">
  <a href="#" data-ext="/impressum.html">Impressum</a>·
  <a href="#" data-ext="/datenschutz.html">Datenschutz</a>·
  <a href="#" data-ext="/agb.html">AGB</a>
  <div style="margin-top:8px">Betreiber: Delt GmbH</div>
</div>

<script>
(function(){
  console.log('CP24_SHELL_READY: script start');
  document.addEventListener('DOMContentLoaded', function(){ console.log('CP24_SHELL_READY: DOMContentLoaded, body=' + (document.body? 'yes':'no')); });
  window.addEventListener('load', function(){ console.log('CP24_SHELL_READY: window.load, form=' + (document.getElementById('plz')? 'yes':'no')); });
  var API = 'https://containerpreis24.de';
  var SIZES = [3,5,7,10,15,20,30,40];
  var size = 7;

  // ---- Splash garantiert verstecken (mehrfach, fehlertolerant) ----
  function hideSplash(){
    try{
      var sp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen;
      if(sp && sp.hide) sp.hide().catch(function(){});
    }catch(e){}
  }
  hideSplash();
  document.addEventListener('DOMContentLoaded', hideSplash);
  window.addEventListener('load', hideSplash);
  setTimeout(hideSplash, 400);
  setTimeout(hideSplash, 1500);

  // ---- extern oeffnen (Capacitor Browser, sonst neuer Tab) ----
  function openExt(url){
    var full = url.indexOf('http') === 0 ? url : (API + url);
    try{
      var br = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
      if(br && br.open){ br.open({ url: full }); return; }
    }catch(e){}
    window.open(full, '_blank');
  }
  document.querySelectorAll('[data-ext]').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); openExt(a.getAttribute('data-ext')); });
  });

  // ---- Groessen-Buttons ----
  var sizesEl = document.getElementById('sizes');
  SIZES.forEach(function(s){
    var b = document.createElement('div');
    b.className = 'size' + (s===size?' active':'');
    b.textContent = s + ' m³';
    b.addEventListener('click', function(){
      size = s;
      sizesEl.querySelectorAll('.size').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
    });
    sizesEl.appendChild(b);
  });

  var plzEl = document.getElementById('plz');
  plzEl.addEventListener('input', function(){ this.value = this.value.replace(/[^0-9]/g,''); document.getElementById('err').style.display='none'; });

  var WN = {bauschutt:'Bauschutt',baumisch:'Baumischabfall',sperrmull:'Sperrmüll',holz:'Holz',grunschnitt:'Grünschnitt',erdaushub:'Erdaushub',gewerbe:'Gewerbeabfall'};

  function showErr(m){ var e=document.getElementById('err'); e.textContent=m; e.style.display='block'; }
  function stars(n){ n=Math.round(parseFloat(n)||0); return '★'.repeat(n)+'☆'.repeat(5-n); }

  function search(){
    var plz = plzEl.value.trim();
    if(!/^[0-9]{5}$/.test(plz)){ showErr('Bitte eine gültige 5-stellige PLZ eingeben.'); plzEl.focus(); return; }
    var waste = document.getElementById('waste').value;
    var res = document.getElementById('results');
    var btn = document.getElementById('go');
    btn.textContent = 'Suche läuft…'; btn.disabled = true;
    res.innerHTML = '<div class="spin"></div>';
    fetch(API + '/api/search?plz=' + plz + '&waste=' + encodeURIComponent(waste) + '&size=' + size)
      .then(function(r){ return r.json(); })
      .then(function(d){
        btn.textContent = 'Preise vergleichen — kostenlos'; btn.disabled = false;
        var list = (d && d.results) || [];
        if(!list.length){
          res.innerHTML = '<div class="card"><div class="res-head">Kein Entsorger für PLZ ' + plz + '</div>'
            + '<p style="font-size:14px;color:var(--mut);margin:0 0 12px">Fordere ein individuelles Angebot an — wir melden uns innerhalb 24h.</p>'
            + '<button class="order" id="anf">Angebot anfordern</button></div>';
          var a=document.getElementById('anf'); if(a) a.addEventListener('click', function(){ openExt('/?plz='+plz+'&waste='+waste+'&size='+size); });
          return;
        }
        var html = '<div class="res-head">' + list.length + ' Entsorger für PLZ ' + plz + ' · ' + (WN[waste]||waste) + ' ' + size + ' m³</div>';
        list.forEach(function(o,i){
          html += '<div class="offer' + (i===0?' best':'') + '">'
            + (i===0?'<span class="badge">BESTER PREIS</span>':'')
            + '<div class="top"><div><div class="name">' + (o.company_name||'Entsorger') + '</div>'
            + '<div class="city">' + (o.city||'') + '</div>'
            + '<div class="stars">' + stars(o.score) + ' <span style="color:var(--mut)">' + (parseFloat(o.score)||0).toFixed(1) + '</span></div></div>'
            + '<div class="price">' + Math.round(o.price) + ' €<small>Pauschalpreis</small></div></div>'
            + '<div class="meta">' + size + ' m³ · ' + (o.includes || '14 Tage, Lieferung, Abholung inkl.') + '</div>'
            + '<button class="order" data-i="' + i + '">Jetzt bestellen</button></div>';
        });
        res.innerHTML = html;
        res.querySelectorAll('.order').forEach(function(b){
          b.addEventListener('click', function(){ openExt('/?plz='+plz+'&waste='+waste+'&size='+size+'&order=1'); });
        });
        res.scrollIntoView({behavior:'smooth',block:'start'});
      })
      .catch(function(){
        btn.textContent = 'Preise vergleichen — kostenlos'; btn.disabled = false;
        res.innerHTML = '<div class="card"><div class="res-head">Keine Verbindung</div>'
          + '<p style="font-size:14px;color:var(--mut);margin:0 0 12px">Bitte Internetverbindung prüfen und erneut versuchen.</p>'
          + '<button class="order" id="rt">Erneut versuchen</button></div>';
        var rt=document.getElementById('rt'); if(rt) rt.addEventListener('click', search);
      });
  }
  document.getElementById('go').addEventListener('click', search);
})();
</script>
</body>
</html>`;

fs.writeFileSync(path.join(WWW, 'index.html'), html);
console.log('[build-web] OK — eigenstaendige App-Shell geschrieben (' + html.length + ' bytes, KEIN server.url)');
