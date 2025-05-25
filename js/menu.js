/**
 * ===== IL CASTELLO MALEDETTO - MENU.JS =====
 * Script per il menu principale
 */

class MainMenu {
    constructor() {
        this.isCreditsOpen = false;

        this.elements = {
            menuBg: document.getElementById('menu-bg'),
            creditsModal: document.getElementById('credits-modal')
        };

        this.initializeMenu();
        this.setupEventListeners();
    }

    initializeMenu() {
        // Attiva l'immagine di background dopo un breve delay
        setTimeout(() => {
            if (this.elements.menuBg) {
                this.elements.menuBg.classList.add('active');
            }
        }, 1000);

        // Preload delle pagine critiche
        this.preloadCriticalAssets();
    }

    setupEventListeners() {
        // Gestione tasti di scelta rapida
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Gestione dell'uscita dai modal con ESC
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && this.isCreditsOpen) {
                this.hideCredits();
            }
        });

        // Click fuori dal modal per chiuderlo
        if (this.elements.creditsModal) {
            this.elements.creditsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.creditsModal) {
                    this.hideCredits();
                }
            });
        }
    }

    handleKeyPress(e) {
        // Scorciatoie da tastiera
        switch(e.key) {
            case '1':
                e.preventDefault();
                this.startGame();
                break;
            case '2':
                e.preventDefault();
                this.startAR();
                break;
            case '3':
                e.preventDefault();
                this.showCredits();
                break;
            case 'Enter':
                e.preventDefault();
                this.startGame();
                break;
        }
    }

    async preloadCriticalAssets() {
        const criticalImages = [
            './assets/images/backgrounds/statue_accese.png',
            './assets/images/characters/testa_diavolo.png',
            './assets/images/characters/faccia_statua_sinistra.png',
            './assets/images/characters/faccia_statua_destra.png'
        ];

        try {
            await Navigation.preloadImages(criticalImages);
            if (GameConfig.DEBUG) {
                console.log('✅ Asset critici precaricati');
            }
        } catch (error) {
            if (GameConfig.DEBUG) {
                console.warn('⚠️ Errore nel precaricamento:', error);
            }
        }
    }

    startGame() {
        this.navigateWithTransition(() => {
            Navigation.goToPage('intro');
        });
    }

    startAR() {
        this.navigateWithTransition(() => {
            window.location.href = './ar-prototype/ar-experience.html';
        });
    }

    showCredits() {
        if (this.elements.creditsModal) {
            this.elements.creditsModal.classList.remove('hidden');
            this.isCreditsOpen = true;

            // Focus trap per accessibilità
            this.trapFocus(this.elements.creditsModal);
        }
    }

    hideCredits() {
        if (this.elements.creditsModal) {
            this.elements.creditsModal.classList.add('hidden');
            this.isCreditsOpen = false;
        }
    }

    navigateWithTransition(callback) {
        // Crea overlay di transizione
        const overlay = document.createElement('div');
        overlay.className = 'fade-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = '#000';
        overlay.style.opacity = '0';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Naviga dopo la transizione
        setTimeout(() => {
            callback();
        }, 500);
    }

    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (firstElement) {
            firstElement.focus();
        }

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// Funzioni globali chiamate dai pulsanti HTML
function startGame() {
    if (window.mainMenu) {
        window.mainMenu.startGame();
    } else {
        Navigation.goToPage('intro');
    }
}

function startAR() {
    if (window.mainMenu) {
        window.mainMenu.startAR();
    } else {
        window.location.href = './ar-prototype/ar-experience.html';
    }
}

function showCredits() {
    if (window.mainMenu) {
        window.mainMenu.showCredits();
    }
}

function hideCredits() {
    if (window.mainMenu) {
        window.mainMenu.hideCredits();
    }
}

// Inizializza il menu principale
document.addEventListener('DOMContentLoaded', () => {
    window.mainMenu = new MainMenu();

    if (GameConfig.DEBUG) {
        console.log('🏠 Menu principale inizializzato');
        console.log('Scorciatoie: 1=Gioca, 2=AR, 3=Crediti, Enter=Gioca');
    }
});