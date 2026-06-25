/**
 * Blogger Toolbox - Post View Counter Only
 * Features: Firebase View Counter with Nepali Number System
 */
const PostViewCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // Converts digits to Nepali numerals
    toNep: function(n) {
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // Updates and renders the Firebase view counter
    initCounter: async function() {
        const el = document.getElementById("visitor-count");
        if (!el) return;
        const pId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
        
        try {
            const url = `${this.config.databaseURL}/views/${pId}.json`;
            let res = await fetch(url);
            let count = await res.json() || 0;

            if (!sessionStorage.getItem("v_" + pId)) {
                count++;
                await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
                sessionStorage.setItem("v_" + pId, "true");
            }
            
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:5px;fill:#ce1212;vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            el.innerHTML = `${eyeIcon} <span style="color:#ce1212;font-weight:bold;">${this.toNep(count)}</span>`;
        } catch (e) { 
            console.warn("Counter sync failed."); 
        }
    }
};

// Initialize on page load
window.addEventListener('load', () => PostViewCounter.initCounter());
