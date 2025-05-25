# 🏰 Il Castello Maledetto

Un'avventura interattiva medievale che combina storytelling, enigmi logici e realtà aumentata.

![Status](https://img.shields.io/badge/Status-Completo-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Platform](https://img.shields.io/badge/Platform-Web-orange)
![AR](https://img.shields.io/badge/AR-A--Frame-purple)

## 📖 Descrizione

**Il Castello Maledetto** è un gioco web interattivo che narra la storia di un coraggioso cavaliere che deve affrontare un enigma mortale per ottenere un tesoro nascosto. Il gioco include:

- 🎭 **Sequenza cinematica introduttiva** con dialoghi animati
- 🧩 **Enigma logico delle statue** (problema classico delle guardie)
- 🎮 **Interfaccia touch-friendly** per dispositivi mobili
- 📱 **Esperienza AR** con marker QR code
- 🏆 **Sistema di statistiche** e enigmi bonus

## 🎮 Come Giocare

### Controlli Base
- **Click/Touch**: Avanza nei dialoghi e interagisce con gli elementi
- **Aree schermo**: Divise in zone cliccabili per selezione statue/porte
- **Pulsanti**: Navigazione tra le diverse modalità di gioco

### Il Gioco
1. **Introduzione**: Segui la storia del cavaliere
2. **Enigma**: Due statue guardie, una mente sempre, l'altra dice sempre la verità
3. **Scelta**: Puoi fare UNA sola domanda a UNA sola statua
4. **Soluzione**: Scegli la porta giusta per vincere il tesoro

### Esperienza AR
- Punta la fotocamera verso i marker QR
- Interagisci con personaggi 3D
- Vivi un'avventura immersiva in realtà aumentata

## 🛠️ Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura semantica e accessibile
- **CSS3**: Animazioni, transizioni, responsive design
- **JavaScript (ES6+)**: Logica di gioco modulare e orientata agli oggetti

### Audio/Video
- **Audio HTML5**: Effetti sonori e musica di sottofondo
- **Video HTML5**: Sequenze cinematiche integrate

### Realtà Aumentata
- **A-Frame**: Framework per WebXR
- **AR.js**: Libreria per marker-based AR
- **Marker Detection**: QR code personalizzati

### Compatibilità
- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: iOS Safari, Android Chrome
- ✅ **AR**: Dispositivi con fotocamera e accelerometro

## 📁 Struttura del Progetto

```
il-castello-maledetto/
├── 📄 index.html                 # Landing page principale
├── 📁 pages/                     # Pagine del gioco
│   ├── intro.html               # Sequenza introduttiva
│   ├── game.html                # Gioco principale
│   └── victory.html             # Schermata vittoria
├── 📁 css/                      # Fogli di stile
│   ├── main.css                 # Stili globali
│   ├── intro.css                # Stili introduzione
│   ├── game.css                 # Stili gioco
│   ├── menu.css                 # Stili menu
│   └── victory.css              # Stili vittoria
├── 📁 js/                       # Script JavaScript
│   ├── main.js                  # Funzioni globali
│   ├── intro.js                 # Logica introduzione
│   ├── game.js                  # Logica gioco
│   ├── menu.js                  # Logica menu
│   └── victory.js               # Logica vittoria
├── 📁 assets/                   # Risorse multimediali
│   ├── 📁 images/
│   │   ├── backgrounds/         # Sfondi e scenari
│   │   ├── characters/          # Personaggi e volti
│   │   ├── ui/                  # Elementi interfaccia
│   │   └── icons/               # Icone e favicon
│   ├── 📁 audio/
│   │   ├── effects/             # Effetti sonori
│   │   └── music/               # Musiche di sottofondo
│   ├── 📁 video/                # Video e animazioni
│   └── 📁 fonts/                # Font personalizzati
├── 📁 ar-prototype/             # Esperienza AR
│   └── ar-experience.html       # Prototipo AR con A-Frame
└── 📁 docs/                     # Documentazione
    ├── GAMEPLAY.md              # Guida al gioco
    └── CONTRIBUTING.md          # Guida sviluppatori
```

## 🚀 Installazione e Setup

### Prerequisiti
- **Browser moderno** con supporto ES6+
- **Server web locale** (per sviluppo)
- **Fotocamera** (per esperienza AR)

### Setup Rapido

1. **Clone o scarica il progetto**
   ```bash
   git clone https://github.com/[tuo-username]/il-castello-maledetto.git
   cd il-castello-maledetto
   ```

2. **Organizza i file multimediali**
    - Sposta i tuoi file nelle cartelle `assets/` corrispondenti
    - Verifica che i nomi dei file corrispondano a quelli nel codice

3. **Avvia un server locale**
   ```bash
   # Opzione 1: Python (se installato)
   python -m http.server 8000
   
   # Opzione 2: Node.js (se installato)
   npx http-server
   
   # Opzione 3: Live Server (VS Code)
   # Installa l'estensione e fai click destro > "Open with Live Server"
   ```

4. **Apri nel browser**
    - Vai su `http://localhost:8000`
    - Per AR: usa un dispositivo mobile con HTTPS

### Setup per IntelliJ IDEA

1. **Apri il progetto**
    - File → Open → Seleziona la cartella del progetto
    - Conferma "Trust Project"

2. **Configura il server di sviluppo**
    - Vai su Settings → Build → Deployment → Configuration
    - Aggiungi nuovo server locale
    - Imposta la porta (es. 8080)

3. **Abilita Live Reload**
    - Installa il plugin "Live Edit" se necessario
    - Configura auto-reload per CSS/JS

## 🎯 Gameplay e Soluzione

### L'Enigma delle Statue

Il gioco presenta il classico **problema delle guardie**:

**Situazione:**
- Due porte: una conduce al tesoro, l'altra alla morte
- Due statue guardie: una dice sempre la verità, l'altra mente sempre
- Puoi fare UNA sola domanda a UNA sola statua

**Soluzione:**
Chiedi a qualsiasi statua: *"L'altra statua mi direbbe che la porta di sinistra è quella giusta?"*

- Se la statua dice **SÌ** → scegli la porta di **DESTRA**
- Se la statua dice **NO** → scegli la porta di **SINISTRA**

**Spiegazione:**
- Se chiedi alla statua veritiera, ti dirà cosa risponderebbe la bugiarda (quindi il contrario della verità)
- Se chiedi alla statua bugiarda, mentirà su cosa direbbe la veritiera (quindi ancora il contrario della verità)
- In entrambi i casi, la risposta ti indica la porta sbagliata!

## 🔧 Configurazione e Personalizzazione

### Modificare il Gameplay

**File:** `js/game.js`
```javascript
// Cambia la porta corretta
gameData: {
    correctDoor: 'left' // o 'right'
}

// Modifica i dialoghi
introSequence: [
    { img: 'personaggio.png', text: "Il tuo dialogo qui..." }
]
```

**File:** `js/main.js`
```javascript
// Velocità typewriter
TYPEWRITER: {
    SPEED: 30, // millisecondi per carattere
    SKIP_SPEED: 5
}

// Volumi audio
AUDIO: {
    MASTER_VOLUME: 0.7,
    EFFECTS_VOLUME: 0.8,
    MUSIC_VOLUME: 0.6
}
```

### Aggiungere Nuovi Asset

1. **Immagini:** Aggiungi in `assets/images/[categoria]/`
2. **Audio:** Aggiungi in `assets/audio/[tipo]/`
3. **Aggiorna i riferimenti** nei file CSS/JS corrispondenti

### Personalizzare l'AR

**File:** `ar-prototype/ar-experience.html`
```javascript
// Modifica i modelli 3D
const characterData = {
    "marker1": {
        modelUrl: "https://il-tuo-server.com/modello.glb",
        position: "0 0 0",
        scale: "0.5 0.5 0.5"
    }
};
```

## 📱 Esperienza AR

### Requisiti
- **Dispositivi:** Smartphone/tablet con fotocamera
- **Browser:** Chrome, Safari (con HTTPS)
- **Marker:** QR code stampati (Hiro, Kanji, o personalizzati)

### Come Funziona
1. Apri l'esperienza AR dal menu principale
2. Concedi i permessi alla fotocamera
3. Punta verso un marker QR
4. Interagisci con i personaggi 3D che appaiono

### Marker Supportati
- **Hiro:** Marker quadrato nero con bordo
- **Kanji:** Carattere giapponese stilizzato
- **Personalizzati:** Crea i tuoi marker su [AR.js Marker Training](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)

## 🎨 Personalizzazione Visiva

### Temi e Colori

**File:** `css/main.css`
```css
:root {
    --primary-bg: #000;           /* Sfondo principale */
    --text-dark: #080808;         /* Testo scuro */
    --text-light: #fff;           /* Testo chiaro */
    /* Modifica questi valori per cambiare il tema */
}
```

### Font Personalizzati

1. Aggiungi il font in `assets/fonts/`
2. Aggiorna il CSS:
```css
@font-face {
    font-family: 'NuovoFont';
    src: url('../assets/fonts/nuovo-font.ttf') format('truetype');
}
```

### Effetti e Animazioni

**Disabilita animazioni** (per performance):
```css
* {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
}
```

## 📊 Analytics e Tracking

Il gioco include un sistema di statistiche locale:

```javascript
// Dati salvati nel localStorage
- gameStartTime: Timestamp inizio partita
- questionsAsked: Numero domande poste
- castleVictories: Storico delle vittorie
- bonusRiddleCompleted: Enigma bonus completato
```

### Aggiungere Analytics Esterni

**Google Analytics:**
```html
<!-- Aggiungi in <head> di tutte le pagine -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 Debug e Troubleshooting

### Modalità Debug

Attiva il debug in `js/main.js`:
```javascript
const GameConfig = {
    DEBUG: true, // Attiva console logs dettagliati
    // ...
};
```

### Problemi Comuni

**Audio non funziona su mobile:**
- Soluzione: Il primo click/touch abilita l'audio (già implementato)

**AR non si avvia:**
- Verifica HTTPS (richiesto per fotocamera)
- Controlla permessi browser
- Testa su dispositivo fisico (non emulatore)

**Immagini non si caricano:**
- Verifica percorsi file in CSS/JS
- Controlla case-sensitivity dei nomi file
- Usa strumenti sviluppatore per errori 404

**Performance su mobile:**
- Ottimizza immagini (WebP consigliato)
- Riduci qualità video
- Disabilita alcune animazioni

### Console Commands (Debug)

```javascript
// Testa audio
window.audioManager.play('torch');

// Salta all'enigma
Navigation.goToPage('game');

// Reset statistiche
localStorage.clear();

// Controlla stato gioco
console.log(window.gameState);
```

## 🤝 Contribuire

### Guidelines

1. **Fork** il repository
2. **Crea un branch** per la tua feature: `git checkout -b nuova-feature`
3. **Committa** le modifiche: `git commit -m 'Aggiunge nuova feature'`
4. **Push** al branch: `git push origin nuova-feature`
5. **Apri una Pull Request**

### Idee per Contributi

- 🎮 **Nuovi enigmi** e storie
- 🌍 **Traduzioni** in altre lingue
- 📱 **Ottimizzazioni mobile** avanzate
- 🎨 **Nuovi temi** visivi
- 🔊 **Effetti audio** aggiuntivi
- 🏗️ **Architettura modulare** migliorata

## 📄 Licenza

Questo progetto è rilasciato sotto [Licenza MIT](LICENSE).

**Puoi:**
- ✅ Usare il codice per progetti personali/commerciali
- ✅ Modificare e distribuire
- ✅ Vendere applicazioni basate su questo codice

**Devi:**
- 📝 Mantenere il copyright notice
- 📝 Includere la licenza MIT

**Asset multimediali:**
- Font, immagini, audio possono avere licenze diverse
- Verifica i diritti prima dell'uso commerciale

## 👨‍💻 Autore

**[Il Tuo Nome]**
- 🌐 Website: [il-tuo-sito.com]
- 📧 Email: [tua-email@esempio.com]
- 🐙 GitHub: [@tuo-username]

## 🙏 Ringraziamenti

- **A-Frame & AR.js** - Framework AR
- **Font Alagard** - Typography medievale
- **Community MDN** - Documentazione web
- **Stack Overflow** - Supporto sviluppo

## 📈 Roadmap

### v1.1 (Prossimo)
- [ ] Sistema di salvataggio partite
- [ ] Nuovi enigmi bonus
- [ ] Modalità difficoltà multiple
- [ ] Integrazione social sharing

### v2.0 (Futuro)
- [ ] Multiplayer locale
- [ ] Editor livelli
- [ ] VR support (WebXR)
- [ ] Progressive Web App (PWA)

---

⭐ **Se ti piace il progetto, lascia una stella su GitHub!**

🐛 **Hai trovato un bug?** [Apri una issue](https://github.com/[tuo-username]/il-castello-maledetto/issues)

💡 **Hai un'idea?** [Inizia una discussione](https://github.com/[tuo-username]/il-castello-maledetto/discussions)