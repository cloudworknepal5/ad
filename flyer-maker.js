/**
 * All-in-One Flyer Maker Embed Script
 * Functionality: CSS Injection, WordPress API Fetch, Mobile Scaling, PNG Export
 */

(function() {
    let posts = [];
    let currentIdx = 0;
    let config = {
        domain: "nepaltopkhabar.com",
        siteName: "NepalTopKhabar",
        logo: "https://nepaltopkhabar.com/wp-content/uploads/2025/09/logo11-copy-300x84.png",
        youtube: "https://youtube.com",
        whatsapp: ""
    };

    // १. Multi-Function: CSS Injector
    function injectStyles() {
        if (document.getElementById('flyer-maker-styles')) return;
        const style = document.createElement('style');
        style.id = 'flyer-maker-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@700;800&display=swap');
            :root { --ntk-red: #ed1c24; --ntk-blue: #002e5b; }
            .flyer-embed-container { width: 100%; display: flex; flex-direction: column; align-items: center; font-family: 'Mukta', sans-serif; }
            #flyer-canvas-wrapper { transform-origin: top center; transition: 0.3s; margin: 20px 0; }
            .flyer-card { 
                width: 1200px; height: 630px; border: 15px solid var(--ntk-red); 
                background: #fff; box-sizing: border-box; position: relative;
                display: flex; flex-direction: column; overflow: hidden;
            }
            .flyer-logo { position: absolute; top: 30px; right: 25px; width: 160px; height: 60px; object-fit: contain; z-index: 100; }
            .flyer-img-frame { position: relative; width: 100%; height: 430px; background: #000; overflow: hidden; }
            .flyer-img-frame img { width: 100%; height: 100%; object-fit: cover; }
            .flyer-overlay { position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 2px solid rgba(237,28,36,0.4); z-index: 10; pointer-events: none; }
            .flyer-domain-tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--ntk-red); color: #fff; padding: 3px 35px; font-size: 16px; font-weight: 700; border-radius: 3px; }
            .flyer-socials { position: absolute; bottom: 10px; left: 20px; display: flex; gap: 10px; z-index: 110; }
            .flyer-icon { width: 40px; height: 40px; background: #fff; border-radius: 50%; border: 1.5px solid var(--ntk-red); display: flex; align-items: center; justify-content: center; color: var(--ntk-red); cursor: pointer; text-decoration: none; }
            .flyer-headline { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 10px 40px; font-size: 52px; font-weight: 800; color: var(--ntk-red); line-height: 1.1; text-align: center; }
            .flyer-footer { background: var(--ntk-blue); color: #fff; padding: 5px 60px; font-weight: 800; font-size: 22px; border-radius: 5px 5px 0 0; width: fit-content; margin: 0 auto; }
            .flyer-controls { display: flex; gap: 10px; margin-bottom: 20px; }
            .flyer-btn { padding: 12px 25px; background: var(--ntk-red); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-family: inherit; }
            .flyer-btn:disabled { background: #ccc; }
        `;
        document.head.appendChild(style);
    }

    // २. Multi-Function: Data Fetcher
    async function fetchData() {
        try {
            const res = await fetch(`https://${config.domain}/wp-json/wp/v2/posts?_embed&per_page=10`);
            posts = await res.json();
            renderCard();
        } catch (e) { console.error("Flyer Maker: Error loading data"); }
    }

    // ३. Multi-Function: UI Renderer
    function renderCard() {
        const wrapper = document.getElementById('flyer-canvas-wrapper');
        const p = posts[currentIdx];
        if(!p) return;

        const featuredImg = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";
        const safeImg = `https://images.weserv.nl/?url=${encodeURIComponent(featuredImg.replace(/https?:\/\//, ""))}`;
        const safeLogo = `https://images.weserv.nl/?url=${encodeURIComponent(config.logo.replace(/https?:\/\//, ""))}`;

        wrapper.innerHTML = `
            <div class="flyer-card">
                <img src="${safeLogo}" class="flyer-logo">
                <div class="flyer-img-frame">
                    <img src="${safeImg}">
                    <div class="flyer-overlay"><div class="flyer-domain-tag">${config.domain}</div></div>
                    <div class="flyer-socials">
                        <a href="${config.youtube}" target="_blank" class="flyer-icon">YT</a>
                        <div class="flyer-icon" onclick="window.shareWA('${p.title.rendered}')">WA</div>
                    </div>
                </div>
                <div class="flyer-headline">${p.title.rendered}</div>
                <div class="flyer-footer">थप विवरणका लागि ${config.siteName} हेर्नुहोला</div>
            </div>
        `;
        autoScale();
    }

    // ४. Multi-Function: Scaling Logic
    function autoScale() {
        const el = document.getElementById('flyer-canvas-wrapper');
        const width = window.innerWidth - 40;
        if(width < 1200) {
            const s = width / 1200;
            el.style.transform = `scale(${s})`;
            el.style.marginBottom = `-${630 * (1 - s)}px`;
        } else {
            el.style.transform = `scale(1)`;
            el.style.marginBottom = `0px`;
        }
    }

    // ५. Multi-Function: Global Actions
    window.shareWA = function(title) {
        const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("*"+title+"*\nविवरण: "+config.domain)}`;
        window.open(url, '_blank');
    };

    window.downloadFlyer = function() {
        const target = document.querySelector('.flyer-card');
        html2canvas(target, { useCORS: true, scale: 2 }).then(canvas => {
            const a = document.createElement('a');
            a.download = `news-${Date.now()}.png`;
            a.href = canvas.toDataURL();
            a.click();
        });
    };

    window.moveFlyer = (n) => {
        currentIdx = (currentIdx + n + posts.length) % posts.length;
        renderCard();
    };

    // ६. Multi-Function: Initializer
    window.initFlyerMaker = function(elementId, userConfig) {
        config = { ...config, ...userConfig };
        injectStyles();
        const root = document.getElementById(elementId);
        root.innerHTML = `
            <div class="flyer-embed-container">
                <div id="flyer-canvas-wrapper">लोड हुँदैछ...</div>
                <div class="flyer-controls">
                    <button class="flyer-btn" onclick="moveFlyer(-1)">अघिल्लो</button>
                    <button class="flyer-btn" onclick="downloadFlyer()">डाउनलोड PNG</button>
                    <button class="flyer-btn" onclick="moveFlyer(1)">अर्को</button>
                </div>
            </div>
        `;
        fetchData();
        window.addEventListener('resize', autoScale);
    };
})();
