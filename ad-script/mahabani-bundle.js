/**
 * Mahabani All-in-One Bundle (CSS + JS)
 * Supports Multi-instance & Multi-site
 */
(function() {
    // १. सिएसएस इन्जेक्सन (Inject CSS into Head)
    const injectStyles = () => {
        const css = `
            .mahabani-card {
                width: 100%; max-width: 300px; height: auto; min-height: 120px;
                background: linear-gradient(145deg, #2c3e50, #000000);
                border-radius: 12px; padding: 20px; color: white;
                font-family: 'Mukta', sans-serif; margin: 15px auto; text-align: center;
                box-shadow: 0 8px 20px rgba(0,0,0,0.3); box-sizing: border-box;
            }
            .mahabani-header {
                font-size: 26px; font-weight: 700; color: #ffcc00; margin: 0;
                padding-bottom: 8px; border-bottom: 1px solid rgba(255, 215, 0, 0.3);
            }
            .mahabani-content { padding-top: 15px; text-align: center; }
            .mahabani-text-target { font-size: 19px; line-height: 1.6; font-weight: 400; }
            .mb-cursor { color: #ffcc00; font-weight: bold; animation: mbBlink 0.8s infinite; }
            @keyframes mbBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);

        // मुक्ता फन्ट लोड गर्ने
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap';
        fontLink.rel = 'stylesheet';
        head.appendChild(fontLink);
    };

    // २. मुख्य एप्लिकेशन मोड्युल
    const MahabaniMaster = {
        config: {
            feedUrl: "https://nepalimahabani.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=25&callback=MahabaniMaster.initData",
            typeSpeed: 70,
            backSpeed: 35,
            pause: 2500
        },
        allQuotes: [],

        init: function() {
            injectStyles();
            const script = document.createElement('script');
            script.src = this.config.feedUrl;
            document.body.appendChild(script);
        },

        initData: function(data) {
            if (data.feed && data.feed.entry) {
                this.allQuotes = data.feed.entry.map(e => e.title.$t);
                const targets = document.querySelectorAll('.mahabani-text-target');
                targets.forEach((el, i) => this.startInstance(el, i));
            }
        },

        startInstance: function(el, id) {
            const state = {
                el: el,
                mIdx: id % this.allQuotes.length,
                charIdx: 0,
                isDeleting: false
            };
            this.animate(state);
        },

        animate: function(state) {
            const quote = this.allQuotes[state.mIdx];
            let speed = state.isDeleting ? this.config.backSpeed : this.config.typeSpeed;

            if (!state.isDeleting && state.charIdx < quote.length) {
                state.charIdx++;
            } else if (state.isDeleting && state.charIdx > 0) {
                state.charIdx--;
            } else {
                state.isDeleting = !state.isDeleting;
                if (!state.isDeleting) state.mIdx = (state.mIdx + 1) % this.allQuotes.length;
                speed = state.isDeleting ? this.config.pause : 500;
            }

            state.el.textContent = quote.substring(0, state.charIdx);
            setTimeout(() => this.animate(state), speed);
        }
    };

    window.MahabaniMaster = MahabaniMaster;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MahabaniMaster.init());
    } else {
        MahabaniMaster.init();
    }
})();
