/**
 * ===== IL CASTELLO MALEDETTO - MAIN.JS =====
 * Funzioni globali e utilities condivise
 */

// Configurazione globale del gioco
const GameConfig = {
    VERSION: '1.0.0',
    DEBUG: false,
    PATHS: {
        ASSETS: './assets/',
        IMAGES: './assets/images/',
        AUDIO: './assets/audio/',
        VIDEO: './assets/video/',
        PAGES: './pages/'
    },
    AUDIO: {
        MASTER_VOLUME: 0.7,
        EFFECTS_VOLUME: 0.8,
        MUSIC_VOLUME: 0.6
    },
    TYPEWRITER: {
        SPEED: 30, // ms per carattere
        SKIP_SPEED: 5 // ms per carattere quando si accelera
    }
};

// Classe per gestire l'audio globalmente
class AudioManager {
    constructor() {
        this.audioElements = new Map();
        this.isMuted = false;
        this.volumes = {};
    }

    registerAudio(id, element) {
        this.audioElements.set(id, element);
        this.volumes[id] = element.volume;
    }

    play(id, loop = false) {
        const audio = this.audioElements.get(id);
        if (audio && !this.isMuted) {
            audio.loop = loop;
            audio.volume = this.volumes[id] * GameConfig.AUDIO.MASTER_VOLUME;
            audio.play().catch(e => {
                if (GameConfig.DEBUG) console.warn(`Audio play failed for ${id}:`, e);
            });
        }
    }

    pause(id) {
        const audio = this.audioElements.get(id);
        if (audio) {
            audio.pause();
        }
    }

    stop(id) {
        const audio = this.audioElements.get(id);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    setVolume(id, volume) {
        const audio = this.audioElements.get(id);
        if (audio) {
            this.volumes[id] = volume;
            audio.volume = volume * GameConfig.AUDIO.MASTER_VOLUME;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audioElements.forEach((audio, id) => {
            audio.volume = this.isMuted ? 0 : this.volumes[id] * GameConfig.AUDIO.MASTER_VOLUME;
        });
        return this.isMuted;
    }
}

// Classe per effetto typewriter
class TypeWriter {
    constructor(element, speed = GameConfig.TYPEWRITER.SPEED) {
        this.element = element;
        this.speed = speed;
        this.isTyping = false;
        this.interval = null;
        this.currentCallback = null;
    }

    type(text, callback = null) {
        if (this.isTyping) {
            this.skip();
            return;
        }

        this.element.textContent = '';
        this.isTyping = true;
        this.currentCallback = callback;
        let index = 0;

        this.interval = setInterval(() => {
            if (index < text.length) {
                this.element.textContent += text.charAt(index);
                index++;
            } else {
                this.complete();
            }
        }, this.speed);
    }

    skip() {
        if (!this.isTyping) return;

        clearInterval(this.interval);
        // Mostra il testo completo immediatamente
        const fullText = this.element.textContent +
            this.element.getAttribute('data-full-text')?.substring(this.element.textContent.length) || '';
        this.element.textContent = fullText;
        this.complete();
    }

    complete() {
        this.isTyping = false;
        clearInterval(this.interval);
        if (this.currentCallback) {
            this.currentCallback();
            this.currentCallback = null;
        }
    }

    isActive() {
        return this.isTyping;
    }
}

// Utilities per la navigazione
const Navigation = {
    goToPage(pageName) {
        window.location.href = `${GameConfig.PATHS.PAGES}${pageName}.html`;
    },

    goHome() {
        window.location.href = '../index.html';
    },

    reload() {
        window.location.reload();
    },

    // Preload delle immagini per evitare ritardi
    preloadImages(imageUrls) {
        return Promise.all(
            imageUrls.map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = url;
                });
            })
        );
    }
};

// Utilities per effetti visivi
const Effects = {
    fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.display = 'block';

        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = progress.toString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    fadeOut(element, duration = 500) {
        const startTime = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = (startOpacity * (1 - progress)).toString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
    },

    shake(element, intensity = 5, duration = 500) {
        const startTime = performance.now();
        const originalTransform = element.style.transform;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const x = (Math.random() - 0.5) * intensity * (1 - progress);
                const y = (Math.random() - 0.5) * intensity * (1 - progress);
                element.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
                requestAnimationFrame(animate);
            } else {
                element.style.transform = originalTransform;
            }
        };

        requestAnimationFrame(animate);
    }
};

// Utilities per dispositivi mobili
const Mobile = {
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },

    enableTouchOptimizations() {
        if (this.isMobile()) {
            document.addEventListener('touchstart', function() {}, { passive: true });

            // Previeni il doppio tap zoom
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }
};

// Gestione degli errori globale
const ErrorHandler = {
    logError(error, context = '') {
        if (GameConfig.DEBUG) {
            console.error(`[${context}] Error:`, error);
        }

        // In produzione, qui potresti inviare l'errore a un servizio di logging
    },

    handleAudioError(audioElement, audioId) {
        audioElement.addEventListener('error', (e) => {
            this.logError(e, `Audio ${audioId}`);
        });
    }
};

// Inizializzazione globale
document.addEventListener('DOMContentLoaded', () => {
    // Ottimizzazioni mobile
    Mobile.enableTouchOptimizations();

    // Gestione audio per mobile (richiede interazione utente)
    if (Mobile.isMobile()) {
        const enableAudio = () => {
            // Crea un audio context dummy per sbloccare l'audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.resume();

            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('click', enableAudio);
        };

        document.addEventListener('touchstart', enableAudio);
        document.addEventListener('click', enableAudio);
    }

    if (GameConfig.DEBUG) {
        console.log('🏰 Il Castello Maledetto - Inizializzato');
        console.log('Version:', GameConfig.VERSION);
        console.log('Mobile:', Mobile.isMobile());
    }
});

// Istanza globale dell'AudioManager
window.audioManager = new AudioManager();

// Esporta le utilities globalmente
window.GameConfig = GameConfig;
window.Navigation = Navigation;
window.Effects = Effects;
window.Mobile = Mobile;
window.TypeWriter = TypeWriter;
window.ErrorHandler = ErrorHandler;