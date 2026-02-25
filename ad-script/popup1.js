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

    // Multi-function 3: Ad Label Component (गोलो 'A' कुनामा)
    const getAdLabelHTML = () => {
        return `<a href="${adnpLink}" target="_blank" style="position:absolute; top:-10px; right:-10px; background:#000; color:#fff; width:20px; height:20px; border-radius:50%; font-size:12px; display:flex; align-items:center; justify-content:center; font-family:sans-serif; text-decoration:none; z-index:10001; border:2px solid #fff;">A</a>`;
    };

    // Multi-function 4: Popup Renderer (चक्कर र १० सेकेन्ड पछि स्वतः बन्द)
    const showPopupAd = (src, link, pageId) => {
        const overlay = document.createElement('div');
        overlay.id = 'adnp-popup-overlay';
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999; display:flex; align-items:center; justify-content:center; perspective:1000px;";

        const adWrapper = document.createElement('div');
        adWrapper.style = "position:relative; width:300px; max-width:85%; animation: spinIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;";

        // Style for Animation
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spinIn {
                from { transform: scale(0) rotate(0deg); opacity: 0; }
                to { transform: scale(1) rotate(720deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        adWrapper.innerHTML = `
            ${getAdLabelHTML()}
            <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${pageId}', src:'${src}', link:'${link}'})">
                <img src="${src}" style="width:100%; border-radius:12px; display:block; box-shadow:0 0 20px rgba(255,255,255,0.2);">
            </a>
            <button onclick="this.closest('#adnp-popup-overlay').remove()" style="position:absolute; bottom:-35px; right:0; background:#fff; color:#000; border:none; padding:4px 12px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:bold; font-family:sans-serif;">Close</button>
        `;

        overlay.appendChild(adWrapper);
        document.body.appendChild(overlay);

        // १० सेकेन्डपछि स्वतः बन्द हुने
        setTimeout(() => {
            if(document.getElementById('adnp-popup-overlay')) {
                overlay.style.transition = "opacity 0.5s";
                overlay.style.opacity = "0";
                setTimeout(() => overlay.remove(), 500);
            }
        }, 10000);

        trackAd('VIEW', { id: pageId, src: src, link: link });
    };

    // Main Renderer Function
    window.renderAdGrid = function(cfg) {
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const img = doc.querySelector('img'); // एउटा मात्र फोटो लिने
            
            if (img) {
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = (img.alt && img.alt.startsWith('http')) ? img.alt : cfg.link;
                
                showPopupAd(src, link, cfg.pageId);
            }
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
