(function() {
    // १. CSS Injector: विज्ञापन स्टाइल र "A" आइकनको डिजाइन
    if (!document.getElementById('adnp-popup-style')) {
        const css = `
            .adnp-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); display: flex;
                justify-content: center; align-items: center; z-index: 1000000;
                backdrop-filter: blur(5px);
            }
            .adnp-box {
                position: relative; background: #fff; padding: 5px;
                border-radius: 12px; box-shadow: 0 25px 60px rgba(0,0,0,0.8);
                animation: adnpSpinIn 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                max-width: 90%;
            }
            @media screen and (min-width: 769px) { .adnp-box { width: 550px; } }
            @media screen and (max-width: 768px) { .adnp-box { width: 320px; } }
            
            @keyframes adnpSpinIn {
                0% { transform: scale(0) rotate(-1080deg); opacity: 0; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            .adnp-box img { width: 100%; height: auto; display: block; border-radius: 8px; }

            /* माथि दायाँपटीको क्लोज बटन (X) */
            .adnp-close {
                position: absolute; top: -15px; right: -15px;
                background: #ff0000; color: #fff; border: 2px solid #fff;
                border-radius: 50%; width: 30px; height: 30px;
                cursor: pointer; font-weight: bold; font-size: 18px;
                display: flex; align-items: center; justify-content: center;
                z-index: 11;
            }

            /* तल दायाँपटीको "A" आइकन (Ad Label) */
            .adnp-a-icon {
                position: absolute; bottom: -15px; right: -15px;
                background: #000; color: #fff; border: 2px solid #fff;
                border-radius: 50%; width: 30px; height: 30px;
                text-decoration: none; font-weight: bold; font-size: 16px;
                display: flex; align-items: center; justify-content: center;
                z-index: 11; font-family: sans-serif;
            }
        `;
        const style = document.createElement("style");
        style.id = 'adnp-popup-style';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';
    const adnpLink = 'https://adnp.neelamb.com';

    // २. Tracking Multi-function
    const trackEvent = async (type, info) => {
        try {
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            const payload = {
                event: type, adId: info.id, imageUrl: info.src, targetUrl: info.link,
                ip: d.ipAddress, country: d.countryName, city: d.cityName, platform: navigator.platform
            };
            fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        } catch (e) { }
    };

    // ३. मुख्य रेन्डर फङ्सन
    window.renderAdNP = function(cfg) {
        const id = 'ad_' + Math.random().toString(36).substr(2, 9);
        const overlay = document.createElement('div');
        overlay.className = 'adnp-overlay';
        overlay.id = id;
        overlay.innerHTML = `
            <div class="adnp-box">
                <button class="adnp-close" onclick="document.getElementById('${id}').remove()">×</button>
                <div id="cnt_${id}" style="text-align:center; padding:15px; font-family:sans-serif;">लोड हुँदैछ...</div>
                <a href="${adnpLink}" target="_blank" class="adnp-a-icon">A</a>
            </div>
        `;
        document.body.appendChild(overlay);

        // १० सेकेन्डपछि अटो-क्लोज
        setTimeout(() => {
            const el = document.getElementById(id);
            if(el) el.remove();
        }, 10000);

        const cb = 'cb_' + id;
        window[cb] = function(json) {
            if(!json.feed || !json.feed.entry) return;
            const entry = json.feed.entry.find(e => e.link.some(l => l.href.toLowerCase().includes(cfg.pageId.toLowerCase())));
            if (entry) {
                const tmp = document.createElement('div');
                tmp.innerHTML = entry.content.$t;
                const img = tmp.querySelector('img');
                if (img) {
                    let src = img.src.replace(/s\d+(-c)?/, 's1600');
                    let link = cfg.link || (img.parentElement.tagName === 'A' ? img.parentElement.href : src);
                    
                    trackEvent('VIEW', { id: cfg.pageId, src: src, link: link });

                    const box = document.getElementById('cnt_' + id);
                    box.style.padding = "0";
                    box.innerHTML = `
                        <a href="${link}" target="_blank" onclick="trackEvent('CLICK', {id:'${cfg.pageId}', src:'${src}', link:'${link}'})">
                            <img src="${src}">
                        </a>`;
                }
            }
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
