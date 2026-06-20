/**
 * Blogger Toolbox - Only Visitor Counter Edition
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    initCounter: async function() {
        const el = document.getElementById("visitor-count");
        if (!el) return;
        
        // पोष्ट आईडी वा होमपेज पत्ता लगाउने
        const pId = document.body.className.match(/postid-(\d+)/) ? "post_" + document.body.className.match(/postid-(\d+)/)[1] : "home";
        
        try {
            const url = `${this.config.databaseURL}/views/${pId}.json`;
            let res = await fetch(url);
            let count = await res.json() || 0;
            
            // सेसनमा नभएको बेला (नयाँ हिट हुँदा) मात्र १ अंक बढाउने
            if (!sessionStorage.getItem("v_" + pId)) {
                count++;
                await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
                sessionStorage.setItem("v_" + pId, "true");
            }
            
            // आँखाको आइकन (Eye Icon) र नेपालीमा भ्युज संख्या राख्ने
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:5px;fill:currentColor;vertical-align:middle;" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            el.innerHTML = `${eyeIcon} <span style="font-weight:bold;">${this.toNep(count)}</span>`;
        } catch (e) { 
            console.warn("Counter error"); 
        }
    }
};

// पेज लोड हुँदा काउन्टर सुचारु गर्ने
window.addEventListener('load', () => {
    BloggerCounter.initCounter();
});