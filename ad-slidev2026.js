(function() {
    // १. अटोप्ले इन्टरभल म्यानेजमेन्ट
    let autoPlayIntervals = {}; 

    // २. हाइट मिलाउने फंक्सन
    const adjustHeight = (containerId) => {
        const wrapper = document.getElementById(containerId);
        if (!wrapper) return;
        const activeImg = wrapper.querySelector('.adnp-slide[style*="opacity: 1"] img');
        if (activeImg && activeImg.complete) {
            wrapper.style.height = activeImg.offsetHeight + 'px';
        }
    };

    window.moveSlide = (wrapperId, step) => {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) return;
        const slides = wrapper.querySelectorAll('.adnp-slide');
        if (!slides.length) return;

        let current = parseInt(wrapper.getAttribute('data-current')) || 0;
        slides[current].style.opacity = 0;
        current = (current + step + slides.length) % slides.length;
        slides[current].style.opacity = 1;
        wrapper.setAttribute('data-current', current);
        
        setTimeout(() => adjustHeight(wrapperId), 100);
    };

    window.toggleAutoPlay = (wrapperId, btn) => {
        if (autoPlayIntervals[wrapperId]) {
            clearInterval(autoPlayIntervals[wrapperId]);
            autoPlayIntervals[wrapperId] = null;
            btn.innerHTML = '&#9658; Play'; 
            btn.style.background = '#e1f5fe';
        } else {
            autoPlayIntervals[wrapperId] = setInterval(() => moveSlide(wrapperId, 1), 5000);
            btn.innerHTML = '&#10074;&#10074; Pause'; 
            btn.style.background = '#eee';
        }
    };

    window.renderAdGrid = function(cfg) {
        if (!cfg || !cfg.containerId || !cfg.pageId) return;

        const container = document.getElementById(cfg.containerId);
        if (!container) return;

        // युनिक कलब्याक नेम कन्फ्लिक्ट नहुने गरी बनाइएको
        const safeId = cfg.containerId.replace(/[^a-zA-Z0-9_]/g, '_');
        const cb = 'cb_' + safeId + '_' + Math.random().toString(36).substring(2, 7);

        window[cb] = function(json) {
            try {
                if (!json.feed || !json.feed.entry) {
                    console.warn("Ad feed or entries not found.");
                    return;
                }

                const entries = Array.isArray(json.feed.entry) ? json.feed.entry : [json.feed.entry];
                const targetPageId = cfg.pageId.toLowerCase();

                // पोस्ट वा पेजको लिंक म्याच गर्ने
                const entry = entries.find(e => {
                    if (!e.link) return false;
                    return e.link.some(l => l.rel === 'alternate' && l.href.toLowerCase().includes(targetPageId));
                });

                if (!entry || !entry.content || !entry.content.$t) {
                    console.warn("Ad content not found for pageId:", targetPageId);
                    return;
                }

                const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
                const imgs = Array.from(doc.querySelectorAll('img'));
                
                if (imgs.length === 0) {
                    console.warn("No images found inside the ad entry for pageId:", targetPageId);
                    return;
                }

                const wrapperId = `wrapper-${safeId}`;
                
                let html = `<div style="width:${cfg.width || '100%'}px; max-width:100%; margin:auto; font-family:sans-serif;">`;
                html += `<div id="${wrapperId}" data-current="0" style="position:relative; width:100%; height:${cfg.height || 250}px; transition: height 0.5s ease; overflow:hidden; background:#f0f0f0; border-radius:8px;">`;

                imgs.forEach((img, index) => {
                    let src = img.src
                        .replace(/\/s[0-9]+(-c)?\//, '/s1600/')
                        .replace(/\/w[0-9]+-h[0-9]+(-[a-z]+)?\//, '/s1600/');
                    
                    let link = (img.alt && img.alt.startsWith('http')) ? img.alt : (cfg.link || '#');
                    const op = index === 0 ? '1' : '0';
                    
                    html += `
                        <div class="adnp-slide" style="position:absolute; top:0; left:0; width:100%; transition:opacity 0.6s ease; opacity:${op};">
                            <a href="${link}" target="_blank" rel="noopener noreferrer">
                                <img src="${src}" style="width:100%; display:block; height:auto;" onload="if(${index}===0) moveSlide('${wrapperId}', 0)">
                            </a>
                        </div>`;
                });
                
                html += `</div>`; 

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
            } catch (err) {
                console.error("Ad Engine Error:", err);
            } finally {
                if (window[cb]) {
                    delete window[cb];
                }
            }
        };

        const s = document.createElement('script');
        // Pages को साटो Posts फिड प्रयोग गरिएको र max-results=999 राखिएको छ
        s.src = `https://adnp.neelamb.com/feeds/posts/default?alt=json-in-script&max-results=999&callback=${cb}`;
        s.async = true;
        s.onerror = function() {
            console.error("Failed to load ad feed from server.");
        };
        document.body.appendChild(s);
    };
})();
