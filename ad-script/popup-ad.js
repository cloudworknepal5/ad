/**
 * AdNP Multi-function Responsive Pop-up Script
 * फीचर्स: चक्कर एनिमेसन, अटो-क्लोज (५ सेकेन्ड), रेस्पोन्सिभ साइज, स्मार्ट लिङ्किङ
 */
(function() {
    // CSS Injector: एक पटक मात्र स्टाइल लोड हुने गरी
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
            .adnp-close {
                position: absolute; top: -15px; right: -15px;
                background: #ff0000; color: #fff; border: 2px solid #fff;
                border-radius: 50%; width: 32px; height: 32px;
                cursor: pointer; font-weight: bold; font-size: 20px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
        `;
        const style = document.createElement("style");
        style.id = 'adnp-popup-style';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // मुख्य रेन्डर फङ्सन
    window.renderAdNP = function(cfg) {
        const id = 'ad_' + Math.random().toString(36).substr(2, 9);
        const overlay = document.createElement('div');
        overlay.className = 'adnp-overlay';
        overlay.id = id;
        overlay.innerHTML = `
            <div class="adnp-box">
                <button class="adnp-close" onclick="document.getElementById('${id}').remove()">×</button>
                <div id="cnt_${id}" style="text-align:center; padding:15px; font-family:sans-serif;">लोड हुँदैछ...</div>
            </div>
        `;
        document.body.appendChild(overlay);

        // ५ सेकेन्डपछि अटो-क्लोज
        setTimeout(() => {
            const el = document.getElementById(id);
            if(el) el.remove();
        }, 5000);

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
                    const box = document.getElementById('cnt_' + id);
                    box.style.padding = "0";
                    box.innerHTML = `<a href="${link}" target="_blank"><img src="${src}"></a>`;
                }
            }
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
