# EL-POCCO-LOCCO — CLAUDE.md

## Projektübersicht
Browser-basiertes 2D Side-Scrolling-Jump'n'Run ("El Pollo Loco"). Vanilla JS, kein Framework, kein Bundler.
Canvas: 720×480px. Steuerung: ← → (bewegen), Space (springen), D (Flasche werfen).

## Tech-Stack
- Vanilla JavaScript (ES6 Klassen)
- HTML5 Canvas API
- CSS (keine Präprozessoren)
- Kein Build-Tool — alle Scripts werden manuell per `<script>` in `index.html` geladen (Ladereihenfolge beachten!)

## Klassenarchitektur (Vererbungskette)
```
DrawableObject
  └─ MovableObject
       ├─ Character        (Spieler "Pepe")
       ├─ Chicken          (normaler Feind)
       ├─ Endboss          (Boss-Huhn)
       ├─ ThrowableObject  (Salsaflaschen)
       └─ Cloud
  └─ StatusBar             (Health-Bar)
  └─ StatusBarBottle       (Flaschen-Bar)
  └─ StatusBarCoin         (Münzen-Bar)
  └─ BackgroundObject      (statische BG-Tiles)
  └─ ParallaxLayer         (scrollende BG-Ebenen)
  └─ Coin                  (sammelbare Münzen)

Level     — Datencontainer (enemies, clouds, backgroundObjects, coins)
World     — Game Loop, Kollisionserkennung, Rendering
Keyboard  — Keyboard-State (boolean flags)
```

## Wichtige Dateien
| Datei | Rolle |
|---|---|
| `index.html` | Einstieg, Script-Ladereihenfolge |
| `js/game.js` | Initialisierung, Keyboard-Binding, `startGame()` |
| `classes/world.class.js` | Haupt-Game-Loop (`run()`, `draw()`), Kollisionen |
| `classes/character.class.js` | Pepe — Bewegung, Animationen, Hit-Logic |
| `classes/level.class.js` | Level-Datenstruktur |
| `levels/level1.js` | Level-1-Instanz (Enemies, Coins, Background-Tiles) |
| `classes/endboss.class.js` | Boss-Zustandsautomat (walk→alert→attack→hurt→dead) |
| `classes/coin.class.js` | Sammelbare Münzen (neu, noch untracked) |

## Spielmechaniken
- Parallax-Hintergrund: 4 Ebenen mit unterschiedlichen Scroll-Geschwindigkeiten (0.1 / 0.3 / 0.5 / 0.8)
- Kollisionserkennung: AABB in `isColliding()` (MovableObject)
- Münzsystem: Coins werden aus `level.coins[]` entfernt bei Kollision; StatusBarCoin zeigt Fortschritt in 20%-Schritten
- Flaschen: ThrowableObject mit Wurf-Physik; StatusBarBottle trackt Vorrat
- Healthbar: `character.energy` (0–100), bei 0 → Tod-Animation

## Asset-Struktur
```
img/
  2_character_pepe/    — Pepe: idle, long_idle, walk, jump, hurt, dead
  3_enemies_chicken/   — Chicken normal + small: walk, dead
  4_enemie_boss_chicken/ — Boss: walk, alert, attack, hurt, dead
  5_background/layers/ — Parallax-Ebenen (air, 1_first, 2_second, 3_third)
  6_salsa_bottle/      — Flaschen-Sprites + Splash
  7_statusbars/        — Status-Bar-Sprites (3_icons, 1_health...)
  1_editables/         — Quelldateien (AI), nicht im Spiel genutzt
```

## Konventionen
- Klassenname: `KebabCase.class.js` (z.B. `movable-object.class.js`)
- Neue Klassen müssen in `index.html` vor abhängigen Klassen gelistet werden
- `setInterval` für Game-Logic (100ms), `requestAnimationFrame` für Rendering
- Kein globaler State außer: `canvas`, `world`, `keyboard` (in `game.js`)
- `level_end_x = 3400` in `Level` bestimmt, wo das Level endet

## Aktueller Entwicklungsstand (Stand: 2026-05-28)
- Fertig: Parallax-BG, Character (Pepe), Chickens, Endboss, Health-Bar, Bottle-Bar, Coin-Bar, Coin-System, ThrowableObject
- In Arbeit / Modified: Coin-Klasse (neu), air.png-Anpassung, diverse Status-Bar-Fixes
- Ausstehend: Bottle-Wurf vollständig implementieren (Flasche entfernen nach Wurf), Endboss-Kollision mit Flasche, Win/Lose-Screen, Sound
