/**
 * ===== IL CASTELLO MALEDETTO - GAME.JS REFACTORED =====
 * Logica del gioco principale - Enigma delle Statue
 * VERSIONE OTTIMIZZATA E PULITA CON MUSICA DI SOTTOFONDO
 */

class CastleGame {
    constructor() {
        console.log('🎮 Inizializzazione CastleGame...');

        // Stati del gioco
        this.currentState = 'intro';
        this.dialogueIndex = 0;
        this.typeWriter = null;
        this.gameData = this.initializeGameData();
        this.isInitialized = false;

        // Inizializzazione step by step
        this.initializeElements();
        this.setupAudio();
        this.startGame();

        console.log('✅ CastleGame inizializzato correttamente');
    }

    initializeElements() {
        console.log('🔧 Inizializzazione elementi DOM...');

        // Elementi DOM principali
        this.elements = {
            background: document.getElementById('background'),
            fadeOverlay: document.getElementById('fade-overlay'),
            dialogueWrapper: document.getElementById('dialogue-wrapper'),
            dialogueBox: document.getElementById('dialogue-box'),
            dialogueText: document.getElementById('dialogue-text'),
            speakerImg: document.getElementById('speaker-img'),
            options: document.getElementById('options'),
            questionOptions: document.getElementById('question-options'),
            leftArea: document.getElementById('left-area'),
            rightArea: document.getElementById('right-area'),
            askBtn: document.getElementById('ask-btn'),
            chooseBtn: document.getElementById('choose-btn'),
            qDoor: document.getElementById('q-door'),
            qStatue: document.getElementById('q-statue')
        };

        // Verifica elementi esistenti
        const missingElements = Object.keys(this.elements).filter(key => !this.elements[key]);
        if (missingElements.length > 0) {
            console.error(`❌ Elementi mancanti: ${missingElements.join(', ')}`);
            return false;
        }

        console.log('✅ Tutti gli elementi DOM trovati');

        // Inizializza TypeWriter
        this.typeWriter = new TypeWriter(this.elements.dialogueText);

        // Setup event listeners iniziali (solo per l'intro)
        this.setupIntroListeners();

        return true;
    }

    initializeGameData() {
        return {
            introSequence: [
                {
                    img: 'testa_diavolo.png',
                    text: "L'unico modo per entrare è attraversare una di queste porte, una conduce ad un tesoro mentre l'altra a morte certa."
                },
                {
                    img: 'faccia_statua_destra.png',
                    text: "Potrai chiedere solo ad una di noi statue qual è la porta giusta."
                },
                {
                    img: 'faccia_statua_sinistra.png',
                    text: "Questa è l'unica regola."
                },
                {
                    img: 'testa_diavolo.png',
                    text: "Attento però, una di loro mente sempre."
                }
            ],
            statueResponses: {
                left: {
                    doorQuestion: 'sì',
                    isStatue: '...'
                },
                right: {
                    doorQuestion: 'no',
                    isStatue: '...'
                }
            },
            correctDoor: 'left'
        };
    }

    setupAudio() {
        const audioElements = [
            { id: 'footsteps', element: document.getElementById('footsteps') },
            { id: 'torch', element: document.getElementById('torch') },
            { id: 'wind', element: document.getElementById('wind') },
            { id: 'bgmusic', element: document.getElementById('bgmusic') }
        ];

        audioElements.forEach(({ id, element }) => {
            if (element) {
                window.audioManager.registerAudio(id, element);
                ErrorHandler.handleAudioError(element, id);
            }
        });

        // Applica bilanciamento volumi
        this.adjustAudioLevels();
    }

    adjustAudioLevels() {
        // Imposta volumi relativi per bilanciare i suoni
        const bgMusic = document.getElementById('bgmusic');
        const torch = document.getElementById('torch');
        const footsteps = document.getElementById('footsteps');
        const wind = document.getElementById('wind');

        if (bgMusic) bgMusic.volume = 0.3;      // Musica più bassa
        if (torch) torch.volume = 0.4;         // Fiamma moderata
        if (footsteps) footsteps.volume = 0.6; // Passi udibili
        if (wind) wind.volume = 0.5;           // Vento moderato
    }

    setupIntroListeners() {
        // Listener per fine animazione intro
        this.elements.background.addEventListener('animationend', () => {
            window.audioManager.pause('footsteps');
            this.showIntroDialogue(0);
        });

        // Click per avanzare dialoghi intro
        this.elements.dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });
    }

    setupGameplayListeners() {
        console.log('🎮 Setup gameplay listeners...');

        // Rimuovi tutti i listener esistenti dai pulsanti
        this.cleanupButtonListeners();

        // Setup pulsanti principali
        this.elements.askBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🗨️ Pulsante Chiedi cliccato');
            this.showQuestionOptions();
        });

        this.elements.chooseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚪 Pulsante Scegli cliccato');
            this.chooseMode();
        });

        // Setup pulsanti domande
        this.elements.qDoor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('❓ Domanda porta cliccata');
            this.askAboutDoor();
        });

        this.elements.qStatue.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🗿 Domanda statua cliccata');
            this.askAboutStatue();
        });

        // Setup aree cliccabili
        this.elements.leftArea.addEventListener('click', () => this.handleAreaClick('left'));
        this.elements.rightArea.addEventListener('click', () => this.handleAreaClick('right'));

        console.log('✅ Gameplay listeners configurati');
    }

    cleanupButtonListeners() {
        // Clona i pulsanti per rimuovere tutti i listener
        const buttonsToClean = ['askBtn', 'chooseBtn', 'qDoor', 'qStatue'];

        buttonsToClean.forEach(btnKey => {
            const oldBtn = this.elements[btnKey];
            if (oldBtn && oldBtn.parentNode) {
                const newBtn = oldBtn.cloneNode(true);
                oldBtn.parentNode.replaceChild(newBtn, oldBtn);
                this.elements[btnKey] = newBtn;
            }
        });
    }

    startGame() {
        // Inizia con l'animazione di background
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/statue_accese.png') center center no-repeat";
        this.elements.background.style.backgroundSize = "contain";

        // Avvia effetti sonori
        window.audioManager.play('footsteps');
        window.audioManager.play('torch', true);

        // Avvia la musica di sottofondo
        window.audioManager.play('bgmusic', true);
    }

    showIntroDialogue(index) {
        if (index >= this.gameData.introSequence.length) {
            this.endIntroSequence();
            return;
        }

        const dialogue = this.gameData.introSequence[index];
        this.elements.speakerImg.src = `../assets/images/characters/${dialogue.img}`;
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type(dialogue.text);
        this.dialogueIndex = index;
    }

    handleDialogueClick() {
        if (this.typeWriter.isActive()) {
            this.typeWriter.skip();
            return;
        }

        if (this.currentState === 'intro') {
            this.dialogueIndex++;
            if (this.dialogueIndex < this.gameData.introSequence.length) {
                this.showIntroDialogue(this.dialogueIndex);
            } else {
                this.endIntroSequence();
            }
        }
    }

    endIntroSequence() {
        console.log('🎬 Fine intro, attivazione gameplay...');

        // Nasconde il dialogo
        this.elements.dialogueBox.style.visibility = 'hidden';

        // Mostra i pulsanti principali
        this.elements.options.style.display = 'flex';
        this.elements.options.style.visibility = 'visible';

        // Assicura che i pulsanti delle domande siano nascosti
        this.elements.questionOptions.style.display = 'none';
        this.elements.questionOptions.style.visibility = 'hidden';

        // Assicura che la musica stia suonando
        const bgMusic = document.getElementById('bgmusic');
        if (bgMusic && bgMusic.paused) {
            window.audioManager.play('bgmusic', true);
        }

        // Cambia stato e setup listeners
        this.currentState = 'gameplay';
        this.setupGameplayListeners();
        this.isInitialized = true;

        console.log('✅ Gameplay attivo, pulsanti pronti');
    }

    showQuestionOptions() {
        console.log('🗨️ Mostrando opzioni domande...');

        // Verifica stato
        if (this.currentState !== 'gameplay') {
            console.warn('⚠️ Stato non valido per mostrare domande:', this.currentState);
            return;
        }

        // Nasconde opzioni principali
        this.elements.options.style.display = 'none';
        this.elements.options.style.visibility = 'hidden';

        // Mostra opzioni domande
        this.elements.questionOptions.style.display = 'flex';
        this.elements.questionOptions.style.visibility = 'visible';
        this.elements.questionOptions.style.opacity = '1';

        console.log('✅ Opzioni domande mostrate');
    }

    askAboutDoor() {
        console.log('❓ Avvio domanda sulla porta...');
        this.currentState = 'selecting-statue-door';
        this.hideAllOptions();
        this.showDialogueAndPrompt('Clicca SINISTRA o DESTRA per scegliere la statua');
    }

    askAboutStatue() {
        console.log('🗿 Avvio domanda sulla natura...');
        this.currentState = 'selecting-statue-nature';
        this.hideAllOptions();
        this.showDialogueAndPrompt('Clicca SINISTRA o DESTRA per scegliere la statua');
    }

    chooseMode() {
        console.log('🚪 Avvio modalità scelta porte...');
        this.currentState = 'choosing-door';
        this.hideAllOptions();
        this.showDialogueAndPrompt('Clicca SINISTRA o DESTRA per scegliere la porta');
    }

    showDialogueAndPrompt(text) {
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type(text, () => {
            this.showClickAreas();
        });
    }

    hideAllOptions() {
        this.elements.options.style.display = 'none';
        this.elements.questionOptions.style.display = 'none';
        this.elements.options.style.visibility = 'hidden';
        this.elements.questionOptions.style.visibility = 'hidden';
    }

    showClickAreas() {
        this.elements.leftArea.style.display = 'block';
        this.elements.rightArea.style.display = 'block';
        this.elements.leftArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        this.elements.rightArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }

    hideClickAreas() {
        this.elements.leftArea.style.display = 'none';
        this.elements.rightArea.style.display = 'none';
    }

    handleAreaClick(side) {
        console.log(`Cliccato area ${side} nello stato ${this.currentState}`);
        this.hideClickAreas();

        switch (this.currentState) {
            case 'selecting-statue-door':
                this.askStatueAboutDoor(side);
                break;
            case 'selecting-statue-nature':
                this.askStatueAboutNature(side);
                break;
            case 'choosing-door':
                this.openDoor(side);
                break;
            default:
                console.warn('⚠️ Click area in stato non valido:', this.currentState);
        }
    }

    askStatueAboutDoor(side) {
        const imgName = side === 'left' ? 'faccia_statua_sinistra.png' : 'faccia_statua_destra.png';
        this.elements.speakerImg.src = `../assets/images/characters/${imgName}`;

        const question = "L'altra statua mi direbbe che la tua porta è quella giusta?";

        this.typeWriter.type(question, () => {
            // Setup click per risposta
            const handleResponse = () => {
                const answer = this.gameData.statueResponses[side].doorQuestion;
                this.typeWriter.type(answer, () => {
                    this.elements.dialogueBox.removeEventListener('click', handleResponse);
                    setTimeout(() => this.resetToMainOptions(), 1500);
                });
            };

            this.elements.dialogueBox.addEventListener('click', handleResponse);
        });
    }

    askStatueAboutNature(side) {
        const imgName = side === 'left' ? 'faccia_statua_sinistra.png' : 'faccia_statua_destra.png';
        this.elements.speakerImg.src = `../assets/images/characters/${imgName}`;

        this.typeWriter.type('...', () => {
            const handleResponse = () => {
                this.elements.dialogueBox.removeEventListener('click', handleResponse);
                setTimeout(() => this.resetToMainOptions(), 1000);
            };

            this.elements.dialogueBox.addEventListener('click', handleResponse);
        });
    }

    resetToMainOptions() {
        console.log('🔄 Reset alle opzioni principali');

        // Pulisce l'interfaccia
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.speakerImg.src = '';
        this.hideAllOptions();

        // Mostra opzioni principali
        this.elements.options.style.display = 'flex';
        this.elements.options.style.visibility = 'visible';

        // Reset stato
        this.currentState = 'gameplay';
    }

    openDoor(side) {
        console.log(`🚪 Aprendo porta ${side}`);
        this.currentState = 'door-opening';

        // Stop audio
        window.audioManager.pause('torch');
        window.audioManager.pause('bgmusic');

        // Avvia il vento dopo un breve delay
        setTimeout(() => {
            window.audioManager.play('wind');
        }, 500);

        // Fade to black
        this.elements.fadeOverlay.style.opacity = '1';
        this.hideAllOptions();
        this.elements.dialogueBox.style.visibility = 'hidden';

        setTimeout(() => {
            this.elements.fadeOverlay.style.opacity = '0';

            if (side === this.gameData.correctDoor) {
                this.handleVictory();
            } else {
                this.handleDefeat();
            }
        }, 2000);
    }

    handleVictory() {
        // Cambia sfondo
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/corridoio_.png') center/contain no-repeat";

        // Mostra dialogo vittoria
        this.elements.speakerImg.src = '../assets/images/characters/testa_diavolo.png';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type("Hai scelto la porta giusta! Vai a prendere il tesoro nell'altra pagina.", () => {
            setTimeout(() => this.showVictoryOptions(), 2000);
        });
    }

    handleDefeat() {
        // Cambia sfondo
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/morte.png') center/contain no-repeat";

        // Video di morte
        this.createDeathVideo();

        // Opzioni game over
        setTimeout(() => this.showGameOverOptions(), 3000);
    }

    createDeathVideo() {
        const video = document.createElement('video');
        video.id = 'death-overlay';
        video.src = '../assets/video/animazione.mp4';
        video.autoplay = true;
        video.loop = false;
        video.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            z-index: 30;
        `;

        document.getElementById('scene').appendChild(video);
    }

    showVictoryOptions() {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-options';
        victoryDiv.innerHTML = `
            <button class="btn" onclick="window.location.href='victory.html'">
                🏆 Vai al Tesoro
            </button>
            <button class="btn" onclick="restartGame()">
                🔄 Gioca Ancora
            </button>
            <button class="btn" onclick="window.location.href='../index.html'">
                🏠 Menu Principale
            </button>
        `;

        // Posizionamento migliorato per evitare sovrapposizioni
        victoryDiv.style.cssText = `
            position: fixed;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 150;
            background: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #ffd700;
        `;

        document.getElementById('scene').appendChild(victoryDiv);
    }

    showGameOverOptions() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'gameover-options';
        gameOverDiv.innerHTML = `
            <div style="text-align: center; color: white; margin-bottom: 20px;">
                <h2>💀 Game Over 💀</h2>
                <p>Hai scelto la porta sbagliata...</p>
            </div>
            <button class="btn" onclick="restartGame()">
                🔄 Riprova
            </button>
            <button class="btn" onclick="window.location.href='../index.html'">
                🏠 Menu Principale
            </button>
        `;

        gameOverDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 150;
            padding: 25px;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 15px;
            border: 2px solid #ff4444;
        `;

        document.getElementById('scene').appendChild(gameOverDiv);
    }

    // Metodo opzionale per controllare la musica
    toggleBackgroundMusic() {
        const bgMusic = document.getElementById('bgmusic');
        if (bgMusic && !bgMusic.paused) {
            window.audioManager.pause('bgmusic');
        } else {
            window.audioManager.play('bgmusic', true);
        }
    }
}

// Funzioni globali
function restartGame() {
    window.location.reload();
}

function goHome() {
    window.location.href = '../index.html';
}

// Inizializzazione robusta
function initializeCastleGame() {
    console.log('🚀 Inizializzazione CastleGame...');

    if (!window.castleGame) {
        try {
            window.castleGame = new CastleGame();
            console.log('✅ CastleGame inizializzato con successo!');
        } catch (error) {
            console.error('❌ Errore durante inizializzazione:', error);
        }
    }
}

// Avvio sicuro
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCastleGame);
} else {
    initializeCastleGame();
}