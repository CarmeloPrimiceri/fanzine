/**
 * ===== IL CASTELLO MALEDETTO - VICTORY.JS =====
 * Script per la pagina della vittoria
 */

class VictoryScreen {
    constructor() {
        this.gameStartTime = this.getGameStartTime();
        this.completionTime = this.calculateCompletionTime();
        this.questionsAsked = this.getQuestionsAsked();
        this.bonusRiddleAnswer = 'cuore'; // Risposta all'enigma bonus

        this.elements = {
            completionTimeEl: document.getElementById('completion-time'),
            questionsAskedEl: document.getElementById('questions-asked'),
            bonusModal: document.getElementById('bonus-modal'),
            bonusAnswer: document.getElementById('bonus-answer'),
            bonusResult: document.getElementById('bonus-result')
        };

        this.initializeAudio();
        this.displayStats();
        this.setupEventListeners();
        this.startVictorySequence();
    }

    initializeAudio() {
        const victoryMusic = document.getElementById('victory-music');
        const treasureSound = document.getElementById('treasure-sound');

        if (victoryMusic) {
            window.audioManager.registerAudio('victory-music', victoryMusic);
            window.audioManager.setVolume('victory-music', GameConfig.AUDIO.MUSIC_VOLUME);
        }

        if (treasureSound) {
            window.audioManager.registerAudio('treasure-sound', treasureSound);
            window.audioManager.setVolume('treasure-sound', GameConfig.AUDIO.EFFECTS_VOLUME);
        }
    }

    setupEventListeners() {
        // Enter per inviare la risposta del bonus
        if (this.elements.bonusAnswer) {
            this.elements.bonusAnswer.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkBonusAnswer();
                }
            });
        }

        // Chiusura modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideBonusRiddle();
            }
        });

        // Click fuori dal modal per chiuderlo
        if (this.elements.bonusModal) {
            this.elements.bonusModal.addEventListener('click', (e) => {
                if (e.target === this.elements.bonusModal) {
                    this.hideBonusRiddle();
                }
            });
        }
    }

    getGameStartTime() {
        // Prova a recuperare l'ora di inizio dal localStorage o sessionStorage
        const startTime = localStorage.getItem('gameStartTime') ||
            sessionStorage.getItem('gameStartTime') ||
            Date.now();
        return parseInt(startTime);
    }

    calculateCompletionTime() {
        const endTime = Date.now();
        const totalTime = endTime - this.gameStartTime;

        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    getQuestionsAsked() {
        // Recupera il numero di domande poste durante il gioco
        return parseInt(localStorage.getItem('questionsAsked') || '0');
    }

    displayStats() {
        if (this.elements.completionTimeEl) {
            this.elements.completionTimeEl.textContent = this.completionTime;
        }

        if (this.elements.questionsAskedEl) {
            this.elements.questionsAskedEl.textContent = this.questionsAsked;
        }
    }

    startVictorySequence() {
        // Avvia la musica di vittoria
        setTimeout(() => {
            window.audioManager.play('victory-music', true);
        }, 500);

        // Suono del tesoro
        setTimeout(() => {
            window.audioManager.play('treasure-sound');
        }, 1000);

        // Salva la vittoria nei record locali
        this.saveVictoryRecord();
    }

    saveVictoryRecord() {
        const victories = JSON.parse(localStorage.getItem('castleVictories') || '[]');

        const newVictory = {
            date: new Date().toISOString(),
            completionTime: this.completionTime,
            questionsAsked: this.questionsAsked,
            timestamp: Date.now()
        };

        victories.push(newVictory);

        // Mantieni solo le ultime 10 vittorie
        if (victories.length > 10) {
            victories.splice(0, victories.length - 10);
        }

        localStorage.setItem('castleVictories', JSON.stringify(victories));
    }

    showBonusRiddle() {
        if (this.elements.bonusModal) {
            this.elements.bonusModal.classList.remove('hidden');

            // Focus sull'input della risposta
            setTimeout(() => {
                if (this.elements.bonusAnswer) {
                    this.elements.bonusAnswer.focus();
                }
            }, 100);
        }
    }

    hideBonusRiddle() {
        if (this.elements.bonusModal) {
            this.elements.bonusModal.classList.add('hidden');

            // Reset del form
            if (this.elements.bonusAnswer) {
                this.elements.bonusAnswer.value = '';
            }
            if (this.elements.bonusResult) {
                this.elements.bonusResult.classList.add('hidden');
                this.elements.bonusResult.className = 'bonus-result hidden';
            }
        }
    }

    checkBonusAnswer() {
        const userAnswer = this.elements.bonusAnswer?.value.toLowerCase().trim();

        if (!userAnswer) return;

        const isCorrect = userAnswer === this.bonusRiddleAnswer ||
            userAnswer === 'il cuore' ||
            userAnswer === 'un cuore';

        if (this.elements.bonusResult) {
            this.elements.bonusResult.classList.remove('hidden');

            if (isCorrect) {
                this.elements.bonusResult.className = 'bonus-result correct';
                this.elements.bonusResult.innerHTML = `
                    <h3>🎉 Corretto!</h3>
                    <p>La risposta è proprio il <strong>cuore</strong>!</p>
                    <p>Il cuore si rafforza quando è spezzato dalle difficoltà, 
                       diventa più utile quando è rovinato dall'esperienza, 
                       e più prezioso quando è dimenticato da chi non sa apprezzarlo.</p>
                    <p><em>Hai dimostrato di essere un vero maestro degli enigmi!</em></p>
                `;

                // Salva il completamento dell'enigma bonus
                localStorage.setItem('bonusRiddleCompleted', 'true');

                // Suono di successo (se disponibile)
                window.audioManager.play('treasure-sound');

            } else {
                this.elements.bonusResult.className = 'bonus-result incorrect';
                this.elements.bonusResult.innerHTML = `
                    <h3>🤔 Non proprio...</h3>
                    <p>Rifletti ancora: cosa diventa più forte quando è spezzato?</p>
                    <p><em>Suggerimento: è qualcosa che tutti hanno dentro di sé.</em></p>
                `;
            }
        }
    }

    shareVictory() {
        const shareText = `🏰 Ho completato "Il Castello Maledetto"!\n⏱️ Tempo: ${this.completionTime}\n❓ Domande: ${this.questionsAsked}\n🏆 Vittoria alla prima porta!`;

        // Prova a usare l'API Web Share se disponibile
        if (navigator.share) {
            navigator.share({
                title: 'Il Castello Maledetto - Vittoria!',
                text: shareText,
                url: window.location.origin
            }).catch(err => {
                if (GameConfig.DEBUG) {
                    console.log('Errore condivisione:', err);
                }
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        // Fallback: copia negli appunti
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showShareMessage('Testo copiato negli appunti!');
            }).catch(() => {
                this.showShareMessage('Impossibile copiare automaticamente');
            });
        } else {
            // Fallback estremo: mostra il testo in un alert
            alert(`Condividi la tua vittoria:\n\n${text}`);
        }
    }

    showShareMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 2000);
    }

    playAgain() {
        // Pulisci i dati della partita precedente
        localStorage.removeItem('gameStartTime');
        localStorage.removeItem('questionsAsked');
        sessionStorage.clear();

        // Transizione al gioco
        this.navigateWithTransition(() => {
            window.location.href = 'intro.html';
        });
    }

    goToMenu() {
        this.navigateWithTransition(() => {
            window.location.href = '../index.html';
        });
    }

    navigateWithTransition(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'fade-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        setTimeout(() => {
            callback();
        }, 500);
    }
}

// Funzioni globali chiamate dai pulsanti HTML
function showBonusRiddle() {
    if (window.victoryScreen) {
        window.victoryScreen.showBonusRiddle();
    }
}

function hideBonusRiddle() {
    if (window.victoryScreen) {
        window.victoryScreen.hideBonusRiddle();
    }
}

function checkBonusAnswer() {
    if (window.victoryScreen) {
        window.victoryScreen.checkBonusAnswer();
    }
}

function shareVictory() {
    if (window.victoryScreen) {
        window.victoryScreen.shareVictory();
    }
}

function playAgain() {
    if (window.victoryScreen) {
        window.victoryScreen.playAgain();
    }
}

function goToMenu() {
    if (window.victoryScreen) {
        window.victoryScreen.goToMenu();
    }
}

// Inizializza la schermata di vittoria
document.addEventListener('DOMContentLoaded', () => {
    window.victoryScreen = new VictoryScreen();

    if (GameConfig.DEBUG) {
        console.log('🏆 Schermata di vittoria inizializzata');
    }
});