/**
 * NeelamB Ad-Engine v5.1 (Final Location Fix)
 */
(function() {
    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';

    // IP र Location प्राप्त गर्ने बलियो विधि
    const getGeo = async () => {
        try {
            // Option 1: Fast & HTTPS Friendly
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            return { 
                ip: d.ipAddress || "Private", 
                co: d.countryName || "Unknown", 
                ct: d.cityName || "Unknown" 
            };
        } catch (e) {
            try {
                // Option 2: Fallback
                const res = await fetch('https://ipapi.co/json/');
                const d = await res.json();
                return { ip: d.ip, co: d.country_name, ct: d.city };
            } catch (err) {
                return { ip: "Hidden", co: "Global", ct: "Private" };
            }
        }
    };

    window.trackAd = async (type, info) => {
        const geo = await getGeo();
        const payload = {
            timestamp: new Date().toISOString(),
            event: type,
            adId: info.id,
            imageUrl: info.src,
            targetUrl: info.link,
            ip: geo.ip,
            country: geo.co,
            city: geo.ct,
            platform: navigator.platform
        };
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    window.renderAdGrid = function(cfg) {
        const container = document.getElementById(cfg.containerId);
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;
            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            let html = `<div style="display:flex; flex-direction:column; gap:10px;">`;
            imgs.forEach(img => {
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                trackAd('VIEW', { id: cfg.pageId, src: src, link: link });
                html += `<div style="position:relative; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
                    <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${cfg.pageId}', src:'${src}', link:'${link}'})">
                        <img src="${src}" style="width:100%; display:block;">
                    </a>
                </div>`;
            });
            container.innerHTML = html + `</div>`;
        };
        const s = document.createElement('script');
        s.src = `https://www.birgunj.eu.org/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();