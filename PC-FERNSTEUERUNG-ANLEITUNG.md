# PC vom Handy steuern — Claude Code Remote Control + VS Code

**Ziel:** Du gibst Befehle vom Handy (Claude-App), die Sessions laufen komplett auf deinem PC
(mit Zugriff auf deine Dateien, dein VS Code, deine Projekte) und erledigen die Aufgaben.

**Wichtig vorab:** Eine Cloud-Session (wie die, in der diese Anleitung entstand) kann deinen PC
nicht von außen einrichten — die Einrichtung unten musst du **einmalig selbst am PC** machen.
Dauer: ca. 10–15 Minuten. Danach funktioniert alles dauerhaft vom Handy aus.

---

## Lösung 1 (EMPFOHLEN): Claude Code Remote Control — eingebaut, genau dein Anwendungsfall

Remote Control verbindet die Claude-App auf deinem Handy (oder claude.ai/code im Browser)
mit einer Claude-Code-Session, die **auf deinem PC läuft**. Nichts wandert in die Cloud —
Handy und Browser sind nur ein "Fenster" in die lokale Session. Dateisystem, Tools und
Projektkonfiguration deines PCs bleiben voll verfügbar.

### Voraussetzungen

| Was | Details |
|---|---|
| Claude Code | Version **2.1.51 oder neuer** auf dem PC (`claude --version` prüfen) |
| Abo | Pro, Max, Team oder Enterprise (**kein** API-Key — claude.ai-Login nötig) |
| Handy | Claude-App für [iOS](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) oder [Android](https://play.google.com/store/apps/details?id=com.anthropic.claude), mit demselben Konto angemeldet |

### Einmalige Einrichtung am PC

**Schritt 1 — Claude Code installieren** (falls noch nicht vorhanden):

```powershell
# Windows (PowerShell):
irm https://claude.ai/install.ps1 | iex
```

```bash
# macOS / Linux:
curl -fsSL https://claude.ai/install.sh | bash
```

**Schritt 2 — Anmelden** (claude.ai-Konto, nicht API-Key):

```bash
claude auth login
```

**Schritt 3 — Projektordner einmal öffnen** (Workspace-Trust-Dialog bestätigen):

```bash
cd C:\pfad\zu\deinem\projekt   # bzw. cd ~/projekt auf Mac
claude
```
Einmal den Trust-Dialog bestätigen, dann mit `/exit` beenden.

**Schritt 4 — Remote-Control-Server starten:**

```bash
claude remote-control
```

- Der Prozess bleibt im Terminal laufen und wartet auf Verbindungen vom Handy.
- **Leertaste drücken → QR-Code erscheint.** Mit der Handy-Kamera scannen → öffnet die Session direkt in der Claude-App.
- Alternativ in der Claude-App unten auf **„Code"** tippen → deine PC-Session erscheint in der Liste mit Computer-Symbol und grünem Punkt.

Nützliche Varianten:

```bash
claude remote-control --name "Mein PC"        # eigener Session-Name in der App
claude remote-control --spawn worktree        # jede neue Handy-Session bekommt eigenes Git-Worktree (keine Konflikte)
claude --remote-control                       # normale Terminal-Session, die ZUSÄTZLICH vom Handy steuerbar ist
```

In einer bereits laufenden Session: einfach `/remote-control` (oder `/rc`) eintippen.

### Push-Benachrichtigungen aufs Handy (empfohlen)

Damit du im Bett/unterwegs mitbekommst, wenn eine Aufgabe fertig ist oder Claude eine Entscheidung braucht:

1. Claude-App installiert und mit demselben Konto angemeldet
2. Benachrichtigungen in der App erlauben
3. Am PC in Claude Code `/config` ausführen und aktivieren:
   - **Push when Claude decides** (Aufgabe fertig o. Ä.)
   - **Push when actions required** (Berechtigungs-/Rückfragen)

Du kannst auch direkt im Prompt schreiben: *„benachrichtige mich, wenn die Tests durch sind"*.

### Dauerbetrieb — damit es auch nachts läuft

- **PC-Ruhezustand deaktivieren** (sonst bricht die Verbindung ab):
  - Windows: Einstellungen → System → Netzbetrieb → Ruhezustand „Nie" (bei Netzbetrieb)
  - macOS: Systemeinstellungen → Energie → Ruhezustand verhindern
- Das Terminal mit `claude remote-control` **offen lassen** — der Prozess muss laufen.
  Wenn der PC kurz offline geht, verbindet sich die Session automatisch neu
  (bei >10 Min. Netzausfall beendet sich der Prozess → einfach neu starten).
- Optional Autostart:
  - **Windows:** Aufgabenplanung → Neue Aufgabe „Bei Anmeldung" → Programm: `claude`, Argumente: `remote-control`, Starten in: dein Projektordner
  - **macOS:** Automator-App („Programm") mit `cd ~/projekt && claude remote-control`, dann unter Anmeldeobjekte eintragen

### Remote Control automatisch für jede Session

Am PC in Claude Code: `/config` → **Enable Remote Control for all sessions** → `true`.
(In der Claude-Desktop-App: Settings → Claude Code → Enable remote control by default.)
Dann ist jede Terminal-Session, die du startest, automatisch auch vom Handy erreichbar.

### Typische Fehler

| Meldung | Lösung |
|---|---|
| „Remote Control requires a claude.ai subscription" | `claude auth login` und **claude.ai** wählen; ggf. `ANTHROPIC_API_KEY`-Umgebungsvariable entfernen |
| „Remote Control is not yet enabled for your account" | `claude auth logout` dann `claude auth login`; `claude doctor` zeigt Details |
| Session taucht in der App nicht auf | In der App unten **Code**-Tab öffnen; gleiche Konto/Organisation wie am PC? |
| Keine Push-Nachrichten | Claude-App einmal öffnen (Push-Token), iOS-Fokusmodi prüfen, Android-Akkuoptimierung für Claude ausschalten |

---

## Lösung 2: Direkt aus VS Code heraus

Wenn du lieber in VS Code arbeitest: Die **Claude-Code-Erweiterung für VS Code** kann dieselbe
Fernsteuerung (benötigt Claude Code v2.1.79+):

1. VS Code öffnen, Claude-Code-Erweiterung installieren (Marketplace: „Claude Code")
2. Im Claude-Prompt-Feld `/remote-control` eintippen
3. Banner erscheint → **Open in browser** oder Session in der Claude-App im Code-Tab öffnen

VS Code muss dafür offen bleiben.

### Zusatz: komplettes VS Code im Handy-Browser (VS Code Remote Tunnels)

Falls du zusätzlich das **volle VS Code (Editor + Terminal)** vom Handy aus willst — nicht nur Claude:

```bash
# Am PC einmalig — Tunnel als Dienst installieren (läuft dann immer, auch nach Neustart):
code tunnel service install
```

Beim ersten Mal mit GitHub-Konto anmelden (Gerätecode-Anzeige folgen). Danach vom Handy-Browser:
**https://vscode.dev** → mit GitHub anmelden → dein PC erscheint als Remote-Ziel.
Du bekommst echtes VS Code mit Terminal auf deinem PC — dort kannst du auch `claude` starten.

---

## Lösung 3 (Alternative für Profis): Tailscale + SSH + tmux

Falls du eine reine Terminal-Lösung ohne Anthropic-Vermittlung willst:

1. **Tailscale** auf PC + Handy installieren (kostenlos, privates WireGuard-Netz, keine Portfreigaben)
2. SSH-Server am PC aktivieren (Windows: „OpenSSH Server"-Feature; macOS: „Entfernte Anmeldung")
3. Am PC Claude Code in **tmux** starten: `tmux new -s claude` → `claude`
4. Vom Handy per SSH-App (**Termius** auf iOS, **Termux** auf Android) über die Tailscale-IP verbinden → `tmux attach -t claude`

Vorteil: Session überlebt jede Verbindungstrennung, du hängst dich einfach wieder dran.
Nachteil: mehr Einrichtung, Tippen im Terminal auf dem Handy ist mühsamer als die Claude-App.

---

## Empfehlung / Morgenroutine (3 Schritte)

1. Am PC: Claude Code installieren/updaten und `claude auth login` (claude.ai-Konto)
2. Im Projektordner: `claude remote-control` starten, Leertaste → QR-Code mit Handy scannen
3. In der Claude-App `/config`-Pushes aktivieren, PC-Ruhezustand ausschalten — fertig

Ab dann: Handy raus → Claude-App → Code-Tab → deine PC-Session antippen → Aufgabe eintippen.
Alles läuft auf deinem PC, du siehst Fortschritt und Rückfragen live auf dem Handy.

---

## Quellen

- [Offizielle Doku: Remote Control](https://code.claude.com/docs/en/remote-control)
- [VS Code Remote Tunnels](https://code.visualstudio.com/docs/remote/tunnels)
- [Tailscale + tmux + Termius Ansatz (Beispiel-Guide)](https://sameerhalai.com/blog/access-your-desktop-claude-code-session-from-your-phone-using-tmux-tailscale/)
