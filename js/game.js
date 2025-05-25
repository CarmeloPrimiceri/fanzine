/**
 * ===== IL CASTELLO MALEDETTO - GAME.JS =====
 * Logica del gioco principale - Enigma delle Statue
 * VERSIONE CON DEBUG ESTESO
 */

class CastleGame {
    constructor() {
        console.log('🎮 Constructor CastleGame started');
        this.currentState = 'intro';
        this.dialogueIndex = 0;
        this.typeWriter = null;
        this.gameData = this.initializeGameData();

        this.initializeElements();
        this.setupAudio();
        this.startGame();
        this.setupGameplayHandlers();

        // DEBUG: Aggiungi listener globale per testare i click
        document.addEventListener('click', (e) => {
            console.log('🔍 Click globale su:', e.target.id, e.target.className, e.target);

            // Debug specifico per i pulsanti
            if (e.target.id === 'ask-btn') {
                console.log('🚨 CLICK RILEVATO SU ASK-BTN');
                console.log('Current state:', this.currentState);
                console.log('Event prevented?', e.defaultPrevented);
            }
        });

        console.log('🎮 Constructor CastleGame completed');
    }

    initializeElements() {
        console.log('🔧 Initializing elements...');

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

        // Verifica che tutti gli elementi esistano
        Object.keys(this.elements).forEach(key => {
            if (!this.elements[key]) {
                console.error(`❌ Element ${key} not found!`);
            } else {
                console.log(`✅ Element ${key} found`);
            }
        });

        // Inizializza TypeWriter
        this.typeWriter = new TypeWriter(this.elements.dialogueText);

        // Setup event listeners
        this.setupEventListeners();

        console.log('✅ Elements initialized');
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
            correctDoor: 'left' // La porta sinistra è quella corretta
        };
    }

    setupAudio() {
        // Registra tutti gli elementi audio
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
    }

    setupEventListeners() {
        // Eventi per l'animazione di ingresso
        this.elements.background.addEventListener('animationend', () => {
            window.audioManager.pause('footsteps');
            this.showIntroDialogue(0);
        });

        // Click sul dialogo per avanzare
        this.elements.dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });
    }

    setupGameplayHandlers() {
        console.log('🔧 Setting up gameplay handlers...');

        // Metodo alternativo: invece di usare CSS inline, forza direttamente
        this.forceButtonStyles();

        // Setup immediato dei button handlers
        this.setupButtonHandlers();
        this.setupClickAreas();

        console.log('✅ Gameplay handlers setup complete');
    }

    forceButtonStyles() {
        console.log('🎨 Forcing button styles...');

        // Force styles per containers
        if (this.elements.options) {
            this.elements.options.style.setProperty('pointer-events', 'auto', 'important');
            this.elements.options.style.setProperty('z-index', '120', 'important');
            this.elements.options.style.setProperty('position', 'fixed', 'important');
        }

        if (this.elements.questionOptions) {
            this.elements.questionOptions.style.setProperty('pointer-events', 'auto', 'important');
            this.elements.questionOptions.style.setProperty('z-index', '120', 'important');
            this.elements.questionOptions.style.setProperty('position', 'fixed', 'important');
        }

        // Force styles per buttons
        [this.elements.askBtn, this.elements.chooseBtn, this.elements.qDoor, this.elements.qStatue].forEach((btn, index) => {
            if (btn) {
                btn.style.setProperty('pointer-events', 'auto', 'important');
                btn.style.setProperty('z-index', '125', 'important');
                btn.style.setProperty('position', 'relative', 'important');
                btn.style.setProperty('display', 'block', 'important');
                console.log(`✅ Button ${index} styles forced`);
            }
        });
    }

    setupButtonHandlers() {
        console.log('🔧 Setting up button handlers...');

        // Rimuovi tutti gli event listener esistenti
        if (this.elements.askBtn) {
            // Clona per rimuovere listeners
            const newAskBtn = this.elements.askBtn.cloneNode(true);
            this.elements.askBtn.parentNode.replaceChild(newAskBtn, this.elements.askBtn);
            this.elements.askBtn = newAskBtn;

            // Test con diversi tipi di event listener
            this.elements.askBtn.onclick = (e) => {
                console.log('🔥 ONCLICK su pulsante Chiedi!');
                e.preventDefault();
                e.stopPropagation();
                this.showQuestionOptions();
            };

            this.elements.askBtn.addEventListener('click', (e) => {
                console.log('🔥 ADDEVENTLISTENER CLICK su pulsante Chiedi!');
                e.preventDefault();
                e.stopPropagation();
                this.showQuestionOptions();
            }, true); // UseCapture = true

            console.log('✅ Ask button handler set');
        }

        if (this.elements.chooseBtn) {
            const newChooseBtn = this.elements.chooseBtn.cloneNode(true);
            this.elements.chooseBtn.parentNode.replaceChild(newChooseBtn, this.elements.chooseBtn);
            this.elements.chooseBtn = newChooseBtn;

            this.elements.chooseBtn.onclick = (e) => {
                console.log('🔥 CLICK su pulsante Scegli!');
                e.preventDefault();
                e.stopPropagation();
                this.chooseMode();
            };

            console.log('✅ Choose button handler set');
        }

        // Setup pulsanti domande
        if (this.elements.qDoor) {
            const newQDoor = this.elements.qDoor.cloneNode(true);
            this.elements.qDoor.parentNode.replaceChild(newQDoor, this.elements.qDoor);
            this.elements.qDoor = newQDoor;

            this.elements.qDoor.onclick = (e) => {
                console.log('🔥 CLICK su domanda porta!');
                e.preventDefault();
                e.stopPropagation();
                this.askAboutDoor();
            };
        }

        if (this.elements.qStatue) {
            const newQStatue = this.elements.qStatue.cloneNode(true);
            this.elements.qStatue.parentNode.replaceChild(newQStatue, this.elements.qStatue);
            this.elements.qStatue = newQStatue;

            this.elements.qStatue.onclick = (e) => {
                console.log('🔥 CLICK su domanda statua!');
                e.preventDefault();
                e.stopPropagation();
                this.askAboutStatue();
            };
        }

        // Test immediato per verificare che i pulsanti siano cliccabili
        setTimeout(() => {
            console.log('🧪 Testing button clickability...');
            if (this.elements.askBtn) {
                console.log('Ask button onclick:', !!this.elements.askBtn.onclick);
                console.log('Ask button style pointer-events:', this.elements.askBtn.style.pointerEvents);
            }
        }, 1000);
    }

    setupClickAreas() {
        // Setup aree cliccabili
        this.elements.leftArea.addEventListener('click', () => this.handleAreaClick('left'));
        this.elements.rightArea.addEventListener('click', () => this.handleAreaClick('right'));
    }

    startGame() {
        // Inizia il gioco con l'animazione di background
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/statue_accese.png') center center no-repeat";
        this.elements.background.style.backgroundSize = "contain";

        // Avvia gli effetti sonori
        window.audioManager.play('footsteps');
        window.audioManager.play('torch', true);
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
        console.log('🎬 Ending intro sequence...');
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.options.style.display = 'flex';
        this.currentState = 'gameplay';
        console.log('🎮 Gameplay state activated - buttons should be clickable now');

        // Test immediato dei pulsanti dopo l'intro
        setTimeout(() => {
            console.log('🧪 Post-intro button test...');
            if (this.elements.askBtn) {
                console.log('Ask button visible:', this.elements.askBtn.style.display !== 'none');
                console.log('Ask button parent visible:', this.elements.options.style.display);
            }
        }, 500);
    }

    showQuestionOptions() {
        console.log('🗨️ showQuestionOptions() CHIAMATO!');

        try {
            // Debug: verifica stato elementi
            console.log('Options display before:', this.elements.options.style.display);
            console.log('Question options display before:', this.elements.questionOptions.style.display);

            // Nascondi options principali
            this.elements.options.style.display = 'none';
            this.elements.options.style.visibility = 'hidden';

            // Mostra question options
            this.elements.questionOptions.style.display = 'flex';
            this.elements.questionOptions.style.visibility = 'visible';
            this.elements.questionOptions.style.opacity = '1';

            // Forza pointer events sui pulsanti delle domande
            if (this.elements.qDoor) {
                this.elements.qDoor.style.pointerEvents = 'auto';
            }
            if (this.elements.qStatue) {
                this.elements.qStatue.style.pointerEvents = 'auto';
            }

            console.log('🗨️ Question options display after:', this.elements.questionOptions.style.display);
            console.log('✅ showQuestionOptions() completato con successo');

        } catch (error) {
            console.error('❌ Errore in showQuestionOptions():', error);
        }
    }

    askAboutDoor() {
        console.log('❓ Domanda sulla porta');
        this.elements.questionOptions.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Clicca SINISTRA o DESTRA per scegliere la statua', () => {
            this.showClickAreas();
            this.currentState = 'selecting-statue-door';
        });
    }

    askAboutStatue() {
        console.log('🗿 Domanda sulla natura della statua');
        this.elements.questionOptions.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Clicca SINISTRA o DESTRA per scegliere la statua', () => {
            this.showClickAreas();
            this.currentState = 'selecting-statue-nature';
        });
    }

    chooseMode() {
        console.log('🚪 Modalità scelta porte');
        this.elements.options.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Clicca SINISTRA o DESTRA per scegliere la porta', () => {
            this.showClickAreas();
            this.currentState = 'choosing-door';
        });
    }

    showClickAreas() {
        this.elements.leftArea.style.display = 'block';
        this.elements.rightArea.style.display = 'block';

        // Aggiungi indicatori visivi
        this.elements.leftArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        this.elements.rightArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }

    hideClickAreas() {
        this.elements.leftArea.style.display = 'none';
        this.elements.rightArea.style.display = 'none';
    }

    handleAreaClick(side) {
        console.log(`Cliccato ${side}`);
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
        }
    }

    askStatueAboutDoor(side) {
        const imgName = side === 'left' ?
            'faccia_statua_sinistra.png' :
            'faccia_statua_destra.png';

        this.elements.speakerImg.src = `../assets/images/characters/${imgName}`;

        const question = "L'altra statua mi direbbe che la tua porta è quella giusta?";

        this.typeWriter.type(question, () => {
            // Imposta il click listener per la risposta
            this.elements.dialogueBox.onclick = () => {
                const answer = this.gameData.statueResponses[side].doorQuestion;
                this.typeWriter.type(answer, () => {
                    this.elements.dialogueBox.onclick = null;
                    setTimeout(() => {
                        this.resetToMainOptions();
                    }, 1500);
                });
            };
        });
    }

    askStatueAboutNature(side) {
        const imgName = side === 'left' ?
            'faccia_statua_sinistra.png' :
            'faccia_statua_destra.png';

        this.elements.speakerImg.src = `../assets/images/characters/${imgName}`;

        this.typeWriter.type('...', () => {
            this.elements.dialogueBox.onclick = () => {
                this.elements.dialogueBox.onclick = null;
                setTimeout(() => {
                    this.resetToMainOptions();
                }, 1000);
            };
        });
    }

    resetToMainOptions() {
        console.log('🔄 Resetting to main options');
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.questionOptions.style.display = 'none';
        this.elements.options.style.display = 'flex';
        this.elements.speakerImg.src = '';
        this.currentState = 'gameplay';
    }

    openDoor(side) {
        console.log(`🚪 Aprendo porta ${side}`);
        // Avvia la sequenza di apertura porta
        this.currentState = 'door-opening';

        // Ferma la torcia e avvia il vento
        window.audioManager.pause('torch');
        window.audioManager.play('wind');

        // Fade to black
        this.elements.fadeOverlay.style.opacity = '1';
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.options.style.display = 'none';
        this.elements.questionOptions.style.display = 'none';

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
        // Cambia lo sfondo al corridoio del tesoro
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/corridoio_.png') center/contain no-repeat";

        this.elements.speakerImg.src = '../assets/images/characters/testa_diavolo.png';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type("Hai scelto la porta giusta! Vai a prendere il tesoro nell'altra pagina.", () => {
            // Mostra pulsante per andare alla pagina della vittoria
            setTimeout(() => {
                this.showVictoryOptions();
            }, 2000);
        });
    }

    handleDefeat() {
        // Cambia lo sfondo alla morte
        this.elements.background.style.background =
            "url('../assets/images/backgrounds/morte.png') center/contain no-repeat";

        // Crea e mostra il video di morte
        this.createDeathVideo();

        // Mostra opzioni di game over dopo il video
        setTimeout(() => {
            this.showGameOverOptions();
        }, 3000);
    }

    createDeathVideo() {
        const video = document.createElement('video');
        video.id = 'death-overlay';
        video.src = '../assets/video/animazione.mp4';
        video.autoplay = true;
        video.loop = false;
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.zIndex = '30';

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

        victoryDiv.style.position = 'absolute';
        victoryDiv.style.bottom = '10%';
        victoryDiv.style.left = '50%';
        victoryDiv.style.transform = 'translateX(-50%)';
        victoryDiv.style.display = 'flex';
        victoryDiv.style.flexDirection = 'column';
        victoryDiv.style.gap = '10px';
        victoryDiv.style.zIndex = '15';

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

        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '50%';
        gameOverDiv.style.left = '50%';
        gameOverDiv.style.transform = 'translate(-50%, -50%)';
        gameOverDiv.style.display = 'flex';
        gameOverDiv.style.flexDirection = 'column';
        gameOverDiv.style.gap = '10px';
        gameOverDiv.style.zIndex = '40';
        gameOverDiv.style.padding = '20px';
        gameOverDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        gameOverDiv.style.borderRadius = '10px';

        document.getElementById('scene').appendChild(gameOverDiv);
    }
}

// FUNZIONE DI TEST MANUALE
function testAskButton() {
    console.log('🧪 Test manuale del pulsante Chiedi');
    if (window.castleGame && window.castleGame.showQuestionOptions) {
        window.castleGame.showQuestionOptions();
    } else {
        console.error('❌ CastleGame non trovato o metodo non disponibile');
    }
}

// Funzioni globali per la navigazione
function restartGame() {
    window.location.reload();
}

function goHome() {
    window.location.href = '../index.html';
}

// Inizializzazione robusta del gioco
function initializeCastleGame() {
    console.log('🚀 Inizializzazione CastleGame...');
    if (!window.castleGame) {
        window.castleGame = new CastleGame();
        console.log('🎮 CastleGame inizializzato!');

        // Rendi disponibile la funzione di test
        window.testAskButton = testAskButton;
        console.log('🧪 Funzione di test disponibile: testAskButton()');
    }
}

// Prova inizializzazione immediata o su DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCastleGame);
} else {
    // DOM già caricato, inizializza subito
    initializeCastleGame();
}