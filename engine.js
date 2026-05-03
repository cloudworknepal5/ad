(function() {
    // Multi-function 1: Ad UI Wrapper (UI र सजावटको लागि)
    const wrapAd = (src, link) => {
        return `
            <div style="position:relative; margin-bottom:12px; line-height:0;">
                <a href="${link}" target="_blank">
                    <img src="${src}" style="width:100%; border-radius:8px; border:1px solid #eee; display:block;">
                </a>
            </div>`;
    };

    // Multi-function 2: Ad Display Logic (तस्बिर र लिंक व्यवस्थापन)
    const displayAds = (container, imgs, defaultLink) => {
        let html = `<div style="display:flex; flex-direction:column; width:100%;">`;
        imgs.forEach(img => {
            // High quality image source (s1600)
            let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
            // Alt tag मा लिंक छ भने सोही प्रयोग गर्ने, नत्र डिफल्ट लिंक
            let link = img.alt && img.alt.startsWith('http') ? img.alt : defaultLink;
            html += wrapAd(src, link);
        });
        container.innerHTML = html + `</div>`;
    };

    // Multi-function 3: Main Renderer (फिडबाट डाटा तान्ने र प्रदर्शन गर्ने)
    window.renderAdGrid = function(cfg) {
        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => 
                e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase())
            );
            
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            
            displayAds(container, imgs, cfg.link);
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
