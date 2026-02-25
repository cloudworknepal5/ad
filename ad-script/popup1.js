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

    // Multi-function 3: Ad Label Component
    const getAdLabelHTML = () => {
        return `<a href="${adnpLink}" target="_blank" style="position:absolute; top:5px; right:5px; background:rgba(0,0,0,0.8); color:#fff; font-size:10px; padding:2px 6px; border-radius:3px; font-family:sans-serif; text-decoration:none; z-index:1001; line-height:1.2;">A</a>`;
    };

    // Multi-function 4: Popup Logic (नयाँ थपिएको: घुमेर आउने र १० सेकेन्डमा हराउने)
    const showPopupAd = (src, link, pageId) => {
        const overlay = document.createElement('div');
        overlay.id = 'ad-popup-overlay';
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; perspective:1000px;";

        const adContent = document.createElement('div');
        adContent.style = "position:relative; width:300px; max-width:90%; animation: spinIn 1s ease-out forwards; transform: scale(0) rotate(720deg);";
        
        // चक्कर प्रभावका लागि CSS Animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spinIn {
                from { transform: scale(0) rotate(0deg); opacity: 0; }
                to { transform: scale(1) rotate(720deg); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        adContent.innerHTML = `
            ${getAdLabelHTML()}
            <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${pageId}', src:'${src}', link:'${link}'})">
                <img src="${src}" style="width:100%; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5); display:block;">
            </a>
        `;

        overlay.appendChild(adContent);
        document.body.appendChild(overlay);

        // १० सेकेन्डपछि स्वतः बन्द हुने
        setTimeout(() => {
            overlay.style.animation = "fadeOut 0.5s forwards";
            setTimeout(() => overlay.remove(), 500);
        }, 10000);

        // Tracking the view
        trackAd('VIEW', { id: pageId, src: src, link: link });
    };

    // Multi-function 5: Ad Container Wrapper (Static Grid को लागि)
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
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgEl = doc.querySelector('img');
            if (!imgEl) return;

            let src = imgEl.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
            let link = imgEl.alt && imgEl.alt.startsWith('http') ? imgEl.alt : (cfg.link || src);
            
            // पप-अप देखाउने
            showPopupAd(src, link, cfg.pageId);

            // यदि ग्रिड कन्टेनर छ भने त्यहाँ पनि देखाउने (नत्र खाली छाड्ने)
            if (container) {
                container.innerHTML = wrapAd(src, link, cfg.pageId);
            }
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
