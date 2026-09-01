/**
 * ekrantikhabar - Universal PWA Manager (v2.1)
 * Works on Blogger, WordPress, and Custom Sites.
 * Functions: Dynamic Manifest, Advanced Service Worker, Offline Support, Auto-Install Prompt, and Multi-Function Utility.
 */

const PWA_MANAGER = {
    deferredPrompt: null,
    settings: {
        name: "ekrantikhabar",
        shortName: "ekrantikhabar",
        themeColor: "#2196f3",
        icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWYufuFo9ALTN3K5dBEVxYlnJe38i8JxLmYJ4G_cgFABRewavM8Lz-s4vxycWffA7i1FDc4chzrK01oGuDb4wKNUSEG2HMn37FU9dk4ecIvVFVPzP1bTsInh6kbf1sFXcZnwVdX5MewxoeZaNZYZqWjpW8Xygt-d_rLg_hI8us2YEKtMXINYziVUSOrbA/s320/ekrantikhabar%20logo%20and%20banner%20512.png"
    },

    init: function() {
        this.injectManifest();
        this.registerAdvancedSW();
        this.initInstallUI();
    },

    // Function 1: Multi-platform Manifest Injection
    injectManifest: function() {
        const manifest = {
            "name": this.settings.name,
            "short_name": this.settings.shortName,
            "start_url": window.location.origin,
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": this.settings.themeColor,
            "icons": [{
                "src": this.settings.icon,
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any maskable"
            }]
        };
        const blob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = URL.createObjectURL(blob);
        document.head.appendChild(link);

        // Apple Support
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = this.settings.icon;
        document.head.appendChild(appleIcon);
    },

    // Function 2: Advanced Service Worker Registration using Blob URL
    registerAdvancedSW: function() {
        if ('serviceWorker' in navigator) {
            const swCode = `
                const CACHE_NAME = 'birgunj-v2';
                const OFFLINE_URL = '/'; 
                self.addEventListener('install', (event) => {
                    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)));
                });
                self.addEventListener('fetch', (event) => {
                    if (event.request.mode === 'navigate') {
                        event.respondWith(
                            fetch(event.request).catch(() => caches.match(OFFLINE_URL))
                        );
                    }
                });
            `;
            const blob = new Blob([swCode], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(blob);

            navigator.serviceWorker.register(swUrl).then(() => {
                console.log("PWA: Service Worker Active with Offline Support");
            }).catch((err) => {
                console.error("SW registration failed: ", err);
            });
        }
    },

    // Function 3: Professional Install Prompt UI
    initInstallUI: function() {
        const bannerHTML = `
            <div id="pware-banner" style="display:none; position:fixed; bottom:20px; left:15px; right:15px; background:#fff; padding:15px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.2); z-index:999999; align-items:center; font-family:sans-serif; border:1px solid #eee;">
                <img src="${this.settings.icon}" style="width:48px; height:48px; border-radius:10px; margin-right:12px;" />
                <div style="flex-grow:1;">
                    <div style="font-weight:bold; font-size:15px; color:#333;">${this.settings.name}</div>
                    <div style="font-size:12px; color:#666;">Install app for faster access</div>
                </div>
                <button id="pwa-install-btn" style="background:#2196f3; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer;">Install</button>
                <button id="pwa-close-btn" style="background:none; border:none; font-size:22px; color:#ccc; cursor:pointer; margin-left:10px;">&times;</button>
            </div>`;
        
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        const banner = document.getElementById('pware-banner') || document.getElementById('pwa-banner');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (!localStorage.getItem('pwa_dismissed')) {
                setTimeout(() => { banner.style.display = 'flex'; }, 3000);
            }
        });

        document.getElementById('pwa-install-btn').addEventListener('click', async () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                if (outcome === 'accepted') banner.style.display = 'none';
                this.deferredPrompt = null;
            }
        });

        document.getElementById('pwa-close-btn').addEventListener('click', () => {
            banner.style.display = 'none';
            localStorage.setItem('pwa_dismissed', 'true');
        });
    },

    // Multi-function utility extension
    multiFunction: {
        checkStatus: function() {
            return {
                serviceWorkerSupported: 'serviceWorker' in navigator,
                manifestInjected: !!document.querySelector('link[rel="manifest"]'),
                isDismissed: !!localStorage.getItem('pwa_dismissed')
            };
        },
        resetPreferences: function() {
            localStorage.removeItem('pwa_dismissed');
            console.log("PWA preferences reset.");
        }
    }
};

// Initialize the Manager
PWA_MANAGER.init();
