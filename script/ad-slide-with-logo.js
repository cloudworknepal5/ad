(function() {
    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';
    const adnpLink = 'https://adnp.neelamb.com';
    let autoPlayIntervals = {}; // धेरै विज्ञापन भएमा व्यवस्थापन गर्न

    let cachedGeo = null;
    const getGeo = async () => {
        if (cachedGeo) return cachedGeo;
        try {
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            cachedGeo = { ip: d.ipAddress, co: d.countryName, ct: d.cityName };
        } catch (e) { cachedGeo = { ip: "Private", co: "Global", ct: "Unknown" }; }
        return cachedGeo;
    };

    window.trackAd = async (type, info) => {
        const geo = await getGeo();
        const payload = {
            event: type, adId: info.id, imageUrl: info.src, targetUrl: info.link,
            ip: geo.ip, country: geo.co, city: geo.ct, platform: navigator.platform
        };
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    const adjustHeight = (containerId) => {
        const wrapper = document.getElementById(containerId);
        const activeImg = wrapper.querySelector('.adnp-slide[style*="opacity: 1"] img');
        if (activeImg && activeImg.complete) {
            wrapper.style.height = activeImg.offsetHeight + 'px';
        }
    };

    window.moveSlide = (wrapperId, step) => {
        const wrapper = document.getElementById(wrapperId);
        const slides = wrapper.querySelectorAll('.adnp-slide');
        if (!slides.length) return;

        let current = parseInt(wrapper.getAttribute('data-current')) || 0;
        slides[current].style.opacity = 0;
        current = (current + step + slides.length) % slides.length;
        slides[current].style.opacity = 1;
        wrapper.setAttribute('data-current', current);
        
        setTimeout(() => adjustHeight(wrapperId), 100);
    };

    // Multi-function 5: Play/Pause Logic
    window.toggleAutoPlay = (wrapperId, btn) => {
        if (autoPlayIntervals[wrapperId]) {
            // Pause गर्ने
            clearInterval(autoPlayIntervals[wrapperId]);
            autoPlayIntervals[wrapperId] = null;
            btn.innerHTML = '&#9658; Play'; // Play icon
            btn.style.background = '#e1f5fe';
        } else {
            // Resume गर्ने
            autoPlayIntervals[wrapperId] = setInterval(() => moveSlide(wrapperId, 1), 5000);
            btn.innerHTML = '&#10074;&#10074; Pause'; // Pause icon
            btn.style.background = '#eee';
        }
    };

    window.renderAdGrid = function(cfg) {
        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');
        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            const wrapperId = `wrapper-${cfg.containerId}`;
            
            let html = `<div style="width:${cfg.width}px; max-width:100%; margin:auto; font-family:sans-serif;">`;
            html += `<div id="${wrapperId}" data-current="0" style="position:relative; width:100%; height:${cfg.height}px; transition: height 0.5s ease; overflow:hidden; background:#f0f0f0; border-radius:8px;">`;

            imgs.forEach((img, index) => {
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                const op = index === 0 ? '1' : '0';
                
                html += `
                    <div class="adnp-slide" style="position:absolute; top:0; left:0; width:100%; transition:opacity 0.6s ease; opacity:${op};">
                        <a href="${adnpLink}" target="_blank" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); color:#fff; font-size:10px; padding:2px 6px; border-radius:3px; z-index:10; text-decoration:none;">A</a>
                        <a href="${link}" target="_blank" onclick="trackAd('CLICK', {id:'${cfg.pageId}', src:'${src}', link:'${link}'})">
                            <img src="${src}" style="width:100%; display:block; height:auto;" onload="if(${index}===0) moveSlide('${wrapperId}', 0)">
                        </a>
                    </div>`;
                trackAd('VIEW', { id: cfg.pageId, src: src, link: link });
            });
            
            html += `</div>`; 

            // Navigation with Pause/Play Button
            if (imgs.length > 1) {
                const btnS = "background:#eee; border:1px solid #ccc; color:#333; padding:6px 12px; cursor:pointer; border-radius:4px; font-size:12px; font-weight:bold; flex:1; margin: 0 5px; transition: 0.3s;";
                html += `
                    <div style="display:flex; justify-content: space-between; margin-top:10px;">
                        <button onclick="moveSlide('${wrapperId}', -1)" style="${btnS}">&#10094; Prev</button>
                        <button onclick="toggleAutoPlay('${wrapperId}', this)" style="${btnS}">&#10074;&#10074; Pause</button>
                        <button onclick="moveSlide('${wrapperId}', 1)" style="${btnS}">Next &#10095;</button>
                    </div>`;
            }

            html += `</div>`;
            container.innerHTML = html;

            if (imgs.length > 1) {
                autoPlayIntervals[wrapperId] = setInterval(() => moveSlide(wrapperId, 1), 5000);
                window.addEventListener('resize', () => adjustHeight(wrapperId));
            }
        };

        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
