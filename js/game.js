/**
 * ===== IL CASTELLO MALEDETTO - GAME.JS =====
 * Logica del gioco principale - Enigma delle Statue
 */

class CastleGame {
    constructor() {
        this.currentState = 'intro';
        this.dialogueIndex = 0;
        this.typeWriter = null;
        this.gameData = this.initializeGameData();

        this.initializeElements();
        this.setupAudio();
        this.startGame();
    }

    initializeElements() {
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

        // Inizializza TypeWriter
        this.typeWriter = new TypeWriter(this.elements.dialogueText);

        // Setup event listeners
        this.setupEventListeners();
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

        // Pulsanti principali
        this.elements.askBtn.addEventListener('click', () => this.showQuestionOptions());
        this.elements.chooseBtn.addEventListener('click', () => this.chooseMode());

        // Pulsanti domande
        this.elements.qDoor.addEventListener('click', () => this.askAboutDoor());
        this.elements.qStatue.addEventListener('click', () => this.askAboutStatue());

        // Aree cliccabili
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
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.options.style.display = 'block';
        this.currentState = 'gameplay';
    }

    showQuestionOptions() {
        this.elements.options.style.display = 'none';
        this.elements.questionOptions.style.display = 'block';
    }

    askAboutDoor() {
        this.elements.questionOptions.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Seleziona statua', () => {
            this.showClickAreas();
            this.currentState = 'selecting-statue-door';
        });
    }

    askAboutStatue() {
        this.elements.questionOptions.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Seleziona statua', () => {
            this.showClickAreas();
            this.currentState = 'selecting-statue-nature';
        });
    }

    chooseMode() {
        this.elements.options.style.display = 'none';
        this.elements.speakerImg.src = '';
        this.elements.dialogueBox.style.visibility = 'visible';

        this.typeWriter.type('Seleziona porta', () => {
            this.showClickAreas();
            this.currentState = 'choosing-door';
        });
    }

    showClickAreas() {
        this.elements.leftArea.style.display = 'block';
        this.elements.rightArea.style.display = 'block';
    }

    hideClickAreas() {
        this.elements.leftArea.style.display = 'none';
        this.elements.rightArea.style.display = 'none';
    }

    handleAreaClick(side) {
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

        const question = "Statua rispondi solo sì o no. L'altra statua mi direbbe che la tua porta è quella giusta?";

        this.typeWriter.type(question, () => {
            // Imposta il click listener per la risposta
            this.elements.dialogueBox.onclick = () => {
                const answer = this.gameData.statueResponses[side].doorQuestion;
                this.typeWriter.type(answer, () => {
                    this.elements.dialogueBox.onclick = null;
                    this.resetToMainOptions();
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
                this.resetToMainOptions();
            };
        });
    }

    resetToMainOptions() {
        this.elements.dialogueBox.style.visibility = 'hidden';
        this.elements.questionOptions.style.display = 'none';
        this.elements.options.style.display = 'block';
        this.currentState = 'gameplay';
    }

    openDoor(side) {
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

// Funzioni globali per la navigazione
function restartGame() {
    window.location.reload();
}

function goHome() {
    window.location.href = '../index.html';
}

// Inizializza il gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    new CastleGame();
});