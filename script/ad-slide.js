(function() {
    // कन्फिगरेसन र ग्लोबल स्टेट
    let autoPlayIntervals = {}; 

    // १. उचाई मिलाउने प्रकार्य (Layout Function)
    const adjustHeight = (containerId) => {
        const wrapper = document.getElementById(containerId);
        const activeImg = wrapper.querySelector('.slide-item[style*="opacity: 1"] img');
        if (activeImg && activeImg.complete) {
            wrapper.style.height = activeImg.offsetHeight + 'px';
        }
    };

    // २. स्लाइड परिवर्तन गर्ने प्रकार्य (Navigation Function)
    window.moveSlide = (wrapperId, step) => {
        const wrapper = document.getElementById(wrapperId);
        const slides = wrapper.querySelectorAll('.slide-item');
        if (!slides.length) return;

        let current = parseInt(wrapper.getAttribute('data-current')) || 0;
        slides[current].style.opacity = 0;
        current = (current + step + slides.length) % slides.length;
        slides[current].style.opacity = 1;
        wrapper.setAttribute('data-current', current);
        
        setTimeout(() => adjustHeight(wrapperId), 100);
    };

    // ३. अटो-प्ले नियन्त्रण प्रकार्य (Control Function)
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

    // ४. मुख्य रेन्डर प्रकार्य (Rendering Function)
    window.renderSlider = function(cfg) {
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
                    <div class="slide-item" style="position:absolute; top:0; left:0; width:100%; transition:opacity 0.6s ease; opacity:${op};">
                        <a href="${link}" target="_blank">
                            <img src="${src}" style="width:100%; display:block; height:auto;" onload="if(${index}===0) moveSlide('${wrapperId}', 0)">
                        </a>
                    </div>`;
            });
            
            html += `</div>`; 

            // नेभिगेसन बटनहरू
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

        // डेटा लोड गर्ने (Feed URL यहाँ सिधै हाल्न सकिन्छ)
        const s = document.createElement('script');
        s.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();
