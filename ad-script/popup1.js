(function() {
    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';
    const adnpLink = 'https://adnp.neelamb.com';

    // Multi-function 1: Geo Location Fetcher
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

    // Multi-function 3: Popup Rendering (30px Close Button & Bottom-Right A)
    const showPopupAd = (src, link, pageId) => {
        const overlay = document.createElement('div');
        overlay.id = 'adnp-popup-overlay';
        overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; display:flex; align-items:center; justify-content:center; padding:20px;";

        const adWrapper = document.createElement('div');
        adWrapper.style = "position:relative; width:100%; max-width:380px; animation: spinIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; line-height:0;";

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spinIn {
                from { transform: scale(0) rotate(0deg); opacity: 0; }
                to { transform: scale(1) rotate(720deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        adWrapper.innerHTML = `
            <div onclick="document.getElementById('adnp-popup-overlay').remove()" style="position:absolute; top:-15px; right:-15px; background:#fff; color:#000; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; cursor:pointer; font-family:sans-serif; z-index:1002; box-shadow:0 4px 10px rgba(0,0,0,0.5); font-weight:bold; border:1px solid #000; line-height:1;">&times;</div>

            <a href="${adnpLink}" target="_blank" style="position:absolute; bottom:-7px; right:-7px; background:#000; color:#fff; width:13px; height:13px; border-radius:50%; font-size:9px; display:flex; align-items:center; justify-content:center; font-family:sans-serif; text-decoration:none; z-index:1001; border:1px solid #fff; line-height:1; font-weight:bold;">A</a>
            
            <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${pageId}', src:'${src}', link:'${link}'})" style="display:block;">
                <img src="${src}" style="width:100%; max-height:75vh; object-fit:contain; border-radius:10px; display:block; box-shadow:0 10px 40px rgba(0,0,0,0.7);">
            </a>
        `;

        overlay.appendChild(adWrapper);
        document.body.appendChild(overlay);

        // १० सेकेन्डपछि स्वतः बन्द
        setTimeout(() => {
            const el = document.getElementById('adnp-popup-overlay');
            if(el) {
                el.style.transition = "opacity 0.6s";
                el.style.opacity = "0";
                setTimeout(() => el.remove(), 600);
            }
        }, 10000);

        trackAd('VIEW', { id: pageId, src: src, link: link });
    };

    // Multi-function 4: Main Loader
    window.renderAdGrid = function(cfg) {
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const img = doc.querySelector('img');
            
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
