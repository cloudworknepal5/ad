/**
 * Rastriya Sahara Daily - Visitor Counter Only (Every Hit & Unique Post Fix)
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    // नम्बरलाई नेपालीमा बदल्ने फङ्सन
    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // भ्यु काउन्टर अपडेट गर्ने मुख्य फङ्सन
    initCounter: async function() {
        // ID वा Class दुवै सर्च गर्ने ताकि थिममा जे राखे पनि काम गरोस्
        const el = document.getElementById("visitor-count") || document.querySelector(".visitor-count");
        if (!el) return;
        
        // URL को आधारमा प्रत्येक पोष्टको छुट्टाछुट्टै र अद्वितिय (Unique) आईडी बनाउने
        const path = window.location.pathname;
        const pId = (path === "/" || path === "") ? "home" : "p_" + path.replace(/[\/\.#\$\[\]]/g, "_").replace(/^_+|_+$/g, "");
        
        try {
            const url = `${this.config.databaseURL}/views/${pId}.json`;
            
            // १. फायरबेसबाट पुरानो भ्युज काउन्ट तान्ने
            let res = await fetch(url);
            let count = await res.json() || 0;

            // २. प्रत्येक हिट/पेज रिफ्रेसमा १ अंक बढाउने
            count++;
            
            // ३. नयाँ काउन्ट डाटाबेसमा सेभ गर्ने
            await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
            
            // ४. रातो रङको आँखा आइकन र नेपाली संख्या स्क्रिनमा देखाउने
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:5px;fill:#ce1212;vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            el.innerHTML = `${eyeIcon} <span style="color:#ce1212;font-weight:bold;vertical-align:middle;">${this.toNep(count)}</span>`;
        } catch (e) { 
            console.warn("Counter sync failed."); 
        }
    }
};

// पेज लोड हुँदा काउन्टर सुरु गर्ने
window.addEventListener('load', () => {
    BloggerCounter.initCounter();
});
