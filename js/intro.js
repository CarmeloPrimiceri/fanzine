/**
 * ===== IL CASTELLO MALEDETTO - INTRO.JS =====
 * Script per la sequenza introduttiva
 */

class IntroSequence {
    constructor() {
        this.currentLine = 0;
        this.typeWriter = null;
        this.isSequenceComplete = false;

        this.elements = {
            sceneImage: document.getElementById('scene-image'),
            dialogueBox: document.getElementById('dialogue'),
            dialogueWrapper: document.getElementById('dialogueWrapper'),
            devil: document.getElementById('devil'),
            titleVideo: document.getElementById('title-video'),
            continueBtn: document.getElementById('continue-btn')
        };

        this.dialogueLines = [
            "Sicuro di volerti addentrare\nin un posto simile?",
            "Beh, peggio per te\nmio caro avventuriero."
        ];

        this.initializeAudio();
        this.initializeTypeWriter();
        this.startSequence();
        this.setupEventListeners();
    }

    initializeAudio() {
        // Registra gli elementi audio
        const torchAudio = document.getElementById('torch-audio');
        const music = document.getElementById('music');

        if (torchAudio) {
            window.audioManager.registerAudio('torch', torchAudio);
            window.audioManager.setVolume('torch', GameConfig.AUDIO.EFFECTS_VOLUME);
        }

        if (music) {
            window.audioManager.registerAudio('intro-music', music);
            window.audioManager.setVolume('intro-music', GameConfig.AUDIO.MUSIC_VOLUME);
        }
    }

    initializeTypeWriter() {
        if (this.elements.dialogueBox) {
            this.typeWriter = new TypeWriter(
                this.elements.dialogueBox,
                GameConfig.TYPEWRITER.SPEED
            );
        }
    }

    setupEventListeners() {
        // Click per avanzare nei dialoghi
        document.addEventListener('click', (e) => {
            // Non reagire ai click sui pulsanti
            if (e.target.tagName === 'BUTTON') return;

            this.handleClick();
        });

        // Touch events per mobile
        document.addEventListener('touchend', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            this.handleClick();
        });

        // Pulsante continua
        if (this.elements.continueBtn) {
            this.elements.continueBtn.addEventListener('click', () => {
                this.navigateToGame();
            });
        }

        // Eventi del video
        if (this.elements.titleVideo) {
            this.elements.titleVideo.addEventListener('ended', () => {
                this.showContinueButton();
            });

            this.elements.titleVideo.addEventListener('loadeddata', () => {
                this.elements.titleVideo.classList.add('playing');
            });
        }
    }

    startSequence() {
        // Avvia l'effetto di messa a fuoco dell'immagine
        setTimeout(() => {
            if (this.elements.sceneImage) {
                this.elements.sceneImage.classList.add('focused');
            }

            // Dopo la messa a fuoco, inizia il dialogo
            setTimeout(() => {
                this.showDialogue();
            }, 3000);
        }, 500);
    }

    showDialogue() {
        if (!this.elements.dialogueWrapper || !this.elements.devil) return;

        // Mostra la pergamena e il diavolo
        Effects.fadeIn(this.elements.dialogueWrapper);
        Effects.fadeIn(this.elements.devil);

        // Aggiungi classe per animazione del diavolo
        this.elements.devil.classList.add('devil-animated');

        // Inizia il primo dialogo
        this.typeLine(this.dialogueLines[this.currentLine]);
    }

    typeLine(line) {
        if (this.typeWriter) {
            // Salva il testo completo per lo skip
            this.elements.dialogueBox.setAttribute('data-full-text', line);
            this.typeWriter.type(line);
        }
    }

    handleClick() {
        if (!this.isSequenceComplete) {
            if (this.elements.dialogueWrapper &&
                this.elements.dialogueWrapper.style.opacity === '1') {

                if (this.typeWriter && this.typeWriter.isActive()) {
                    // Accelera il typing
                    this.typeWriter.skip();
                } else {
                    // Avanza al prossimo dialogo
                    this.nextDialogue();
                }
            }
        }
    }

    nextDialogue() {
        this.currentLine++;

        if (this.currentLine < this.dialogueLines.length) {
            // Prossima linea
            this.typeLine(this.dialogueLines[this.currentLine]);
        } else {
            // Fine dialoghi, nascondi tutto e mostra il titolo
            this.endDialogueSequence();
        }
    }

    endDialogueSequence() {
        this.isSequenceComplete = true;

        // Nascondi dialogo e diavolo
        Effects.fadeOut(this.elements.dialogueWrapper);
        Effects.fadeOut(this.elements.devil);

        // Avvia la musica
        window.audioManager.play('intro-music', true);

        // Mostra il video titolo dopo un breve delay
        setTimeout(() => {
            this.showTitle();
        }, 1000);
    }

    showTitle() {
        if (this.elements.titleVideo) {
            this.elements.titleVideo.style.display = 'block';

            // Prova a riprodurre il video
            const playPromise = this.elements.titleVideo.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    if (GameConfig.DEBUG) {
                        console.warn('Autoplay video fallito:', error);
                    }
                    // Se l'autoplay fallisce, mostra comunque il pulsante
                    this.showContinueButton();
                });
            }
        } else {
            // Se non c'è video, mostra direttamente il pulsante
            this.showContinueButton();
        }
    }

    showContinueButton() {
        if (this.elements.continueBtn) {
            this.elements.continueBtn.classList.remove('hidden');
            Effects.fadeIn(this.elements.continueBtn);
        }
    }

    navigateToGame() {
        // Effetto di transizione
        const overlay = document.createElement('div');
        overlay.className = 'fade-overlay';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);

        Effects.fadeIn(overlay, 500);

        setTimeout(() => {
            Navigation.goToPage('game');
        }, 500);
    }

    // Metodi pubblici per controllo esterno
    skipToGame() {
        this.navigateToGame();
    }

    toggleMute() {
        return window.audioManager.toggleMute();
    }
}

// Inizializza la sequenza introduttiva
document.addEventListener('DOMContentLoaded', () => {
    window.introSequence = new IntroSequence();

    if (GameConfig.DEBUG) {
        console.log('🎭 Sequenza introduttiva inizializzata');
    }
});

// Funzioni globali per la navigazione (chiamate dai pulsanti HTML)
function startGame() {
    if (window.introSequence) {
        window.introSequence.skipToGame();
    } else {
        Navigation.goToPage('game');
    }
}

function goToMenu() {
    Navigation.goHome();
}