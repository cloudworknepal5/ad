(function() {
    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';
    const adnpLink = 'https://adnp.neelamb.com';

    // Multi-function 1: Location Fetcher
    const getGeo = async () => {
        try {
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            return { ip: d.ipAddress, co: d.countryName, ct: d.cityName };
        } catch (e) {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const d = await res.json();
                return { ip: d.ip, co: d.country_name, ct: d.city };
            } catch (err) {
                return { ip: "Private", co: "Global", ct: "Unknown" };
            }
        }
    };

    // Multi-function 2: Tracking Logic
    window.trackAd = async (type, info) => {
        const geo = await getGeo();
        const payload = {
            event: type, adId: info.id, imageUrl: info.src, targetUrl: info.link,
            ip: geo.ip, country: geo.co, city: geo.ct, platform: navigator.platform
        };
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    // Multi-function 3: Ad Label Component (AdNP with Link)
    const getAdLabelHTML = () => {
        return `<a href="${adnpLink}" target="_blank" style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.8); color:#fff; font-size:10px; padding:2px 6px; border-radius:3px; font-family:sans-serif; text-decoration:none; z-index:100; line-height:1.2;">
                    A
                </a>`;
    };

    // Multi-function 4: Ad Container Wrapper
    const wrapAd = (src, link, pageId) => {
        return `
            <div style="position:relative; margin-bottom:12px; line-height:0;">
                ${getAdLabelHTML()}
                <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${pageId}', src:'${src}', link:'${link}'})">
                    <img src="${src}" style="width:100%; border-radius:8px; border:1px solid #eee; display:block;">
                </a>
            </div>`;
    };

    // Main Renderer Function
    window.renderAdGrid = function(cfg) {
        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            
            let html = `<div style="display:flex; flex-direction:column; width:100%;">`;
            imgs.forEach(img => {
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                
                trackAd('VIEW', { id: cfg.pageId, src: src, link: link });
                html += wrapAd(src, link, cfg.pageId);
            });
            
            container.innerHTML = html + `</div>`;
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
