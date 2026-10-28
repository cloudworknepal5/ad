(function() {
    // Multi-function 1: Ad UI Wrapper (UI र सजावटको लागि)
    const wrapAd = (src, link) => {
        return `
            <div style="position:relative; margin-bottom:12px; line-height:0;">
                <a href="${link}" target="_blank" rel="noopener noreferrer">
                    <img src="${src}" style="width:100%; height:auto; border-radius:8px; border:1px solid #eee; display:block;" alt="Advertisement">
                </a>
            </div>`;
    };

    // Multi-function 2: Ad Display Logic (तस्बिर र लिंक व्यवस्थापन)
    const displayAds = (container, imgs, defaultLink) => {
        let html = `<div style="display:flex; flex-direction:column; width:100%;">`;
        imgs.forEach(img => {
            // High quality image source handler for Blogger images
            let src = img.src
                .replace(/\/s[0-9]+(-c)?\//, '/s1600/')
                .replace(/\/w[0-9]+-h[0-9]+(-[a-z]+)?\//, '/s1600/');
            
            // Alt tag मा http लिंक छ भने सोही प्रयोग गर्ने, नत्र डिफल्ट लिंक
            let link = (img.alt && img.alt.startsWith('http')) ? img.alt : (defaultLink || '#');
            html += wrapAd(src, link);
        });
        container.innerHTML = html + `</div>`;
    };

    // Multi-function 3: Main Renderer (फिडबाट डाटा तान्ने र प्रदर्शन गर्ने)
    window.renderAdGrid = function(cfg) {
        if (!cfg || !cfg.containerId || !cfg.pageId) return;

        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        // मल्टिपल कल गर्दा कन्फ्लिक्ट नहोस् भनेर युनिक क्याब्याक नेम बनाइएको
        const safeId = cfg.containerId.replace(/[^a-zA-Z0-9_]/g, '_');
        const cb = 'cb_' + safeId + '_' + Math.random().toString(36).substring(2, 7);

        window[cb] = function(json) {
            try {
                if (!json.feed || !json.feed.entry) return;

                const entries = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
                const targetPageId = cfg.pageId.toLowerCase();

                // पोस्ट वा पेजको लिंकमा pageId म्याच गराउने
                const entry = entries.find(e => {
                    if (!e.link) return false;
                    return e.link.some(l => l.rel === 'alternate' && l.href.toLowerCase().includes(targetPageId));
                });

                if (!entry || !entry.content || !entry.content.$t) return;

                const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
                const imgs = Array.from(doc.querySelectorAll('img'));

                if (imgs.length > 0) {
                    displayAds(container, imgs, cfg.link);
                }
            } catch (err) {
                console.error("Ad Engine Error:", err);
            } finally {
                // मेमरी क्लिनअपको लागि स्क्रिप्ट ट्याग र ग्लोबल कलर हटाउने
                if (window[cb]) {
                    delete window[cb];
                }
            }
        };

        const s = document.createElement('script');
        // माग बमोजिम max-results=999 राखिएको छ
        s.src = `https://www.newskhojtalash.com/feeds/posts/default?alt=json-in-script&max-results=999&callback=${cb}`;
        s.async = true;
        s.onerror = function() {
            console.error("Failed to load ad feed.");
        };
        document.body.appendChild(s);
    };
})();
