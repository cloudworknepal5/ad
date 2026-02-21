(function() {
    // १. CSS Injector: मोबाइल र डेस्कटप दुवैको लागि स्टाइल
    const injectStyles = () => {
        const css = `
            #ad-3d-wrapper {
                position: fixed;
                right: 50px;
                top: 50%;
                width: 220px;
                height: 140px;
                perspective: 1000px;
                z-index: 9999;
            }
            .carousel-3d {
                width: 100%;
                height: 100%;
                position: absolute;
                transform-style: preserve-3d;
                animation: rotateCarousel 12s infinite linear;
            }
            @keyframes rotateCarousel {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
            }
            .ad-slice {
                position: absolute;
                width: 200px;
                height: 120px;
                left: 10px;
                top: 10px;
                border: 1px solid #ddd;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                background: white;
                border-radius: 6px;
                overflow: hidden;
                backface-visibility: visible;
            }
            .ad-slice img { 
                width: 200px; 
                height: 120px; 
                object-fit: cover; 
                display: block;
            }
            .close-btn {
                position: absolute;
                top: -25px;
                right: 0px;
                background: #ff4d4d;
                color: white;
                border: none;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                cursor: pointer;
                z-index: 10002;
                font-weight: bold;
                line-height: 1;
            }
            
            /* मोबाइलको लागि विशेष मिलावट (साइज अलि सानो र दायाँतिर च्यापिएको) */
            @media screen and (max-width: 768px) {
                #ad-3d-wrapper {
                    right: 30px; /* मोबाइलमा अलि छेउमा */
                    top: 60%;    /* मोबाइलमा अलि तल ताकि कन्टेन्ट नछेकियोस् */
                    transform: scale(0.8); /* साइज २०% सानो पारिएको */
                }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    };

    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';
    const adnpLink = 'https://adnp.neelamb.com';

    // २. Geo Tracking
    const getGeo = async () => {
        try {
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            return { ip: d.ipAddress, co: d.countryName, ct: d.cityName };
        } catch (e) { return { ip: "Private", co: "Global", ct: "Unknown" }; }
    };

    // ३. Tracking Multi-function
    window.trackAd = async (type, info) => {
        const geo = await getGeo();
        const payload = {
            event: type, adId: info.id, imageUrl: info.src, targetUrl: info.link,
            ip: geo.ip, country: geo.co, city: geo.ct, platform: navigator.platform
        };
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    // ४. 3D Slice Generation
    const getSliceHTML = (src, link, index, total, pageId) => {
        const angle = (360 / total) * index;
        const translateZ = total > 2 ? Math.round(100 / Math.tan(Math.PI / total)) : 110;

        return `
            <div class="ad-slice" style="transform: rotateY(${angle}deg) translateZ(${translateZ}px);">
                <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${pageId}', src:'${src}', link:'${link}'})">
                    <img src="${src}">
                </a>
            </div>`;
    };

    // ५. मुख्य रेन्डर फङ्सन
    window.renderAdNP3D = function(cfg) {
        injectStyles();
        
        const wrapper = document.createElement('div');
        wrapper.id = 'ad-3d-wrapper';
        wrapper.innerHTML = `
            <button class="close-btn" onclick="this.parentElement.remove()">×</button>
            <div id="${cfg.containerId}" class="carousel-3d"></div>
        `;
        document.body.appendChild(wrapper);

        const container = document.getElementById(cfg.containerId);
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');

        window[cb] = function(json) {
            if(!json.feed.entry) return;
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            const total = imgs.length;
            
            let html = '';
            imgs.forEach((img, index) => {
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                
                trackAd('VIEW', { id: cfg.pageId, src: src, link: link });
                html += getSliceHTML(src, link, index, total, cfg.pageId);
            });
            
            container.innerHTML = html;
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
