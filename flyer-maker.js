/**
 * News Card Tool - Integrated Version
 * All-in-one: CSS + JS
 */

(function() {
    let posts = [];
    let currentIdx = 0;
    let toolConfig = {
        domain: "nepaltopkhabar.com",
        siteName: "NepalTopKhabar",
        logo: "",
        youtube: "https://youtube.com",
        whatsapp: ""
    };

    /** Multi-Function 1: CSS Injection 
     * यसले पेज लोड हुँदा आफै CSS थप्छ
     **/
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root { --ntk-red: #ed1c24; --ntk-blue: #002e5b; }
            #ntk-widget-container { width: 100%; display: flex; flex-direction: column; align-items: center; overflow: hidden; }
            #gh-master-container { transform-origin: top center; transition: 0.3s; margin: 20px 0; }
            .gh-master-wrap { 
                width: 1200px; height: 630px; border: 15px solid var(--ntk-red); 
                background: #fff; box-sizing: border-box; position: relative;
                display: flex; flex-direction: column; overflow: hidden;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .gh-logo-watermark { position: absolute; top: 30px; right: 25px; width: 160px; height: 60px; object-fit: contain; z-index: 100; }
            .gh-img-frame { position: relative; width: 100%; height: 430px; background: #000; overflow: hidden; }
            .gh-img-frame img { width: 100%; height: 100%; object-fit: cover; }
            .gh-red-overlay { position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; border: 2px solid rgba(237,28,36,0.4); z-index: 10; }
            .gh-social-icons { position: absolute; bottom: 10px; left: 20px; display: flex; gap: 10px; z-index: 110; }
            .icon-box { width: 40px; height: 40px; background: #fff; border-radius: 50%; border: 1.5px solid var(--ntk-red); display: flex; align-items: center; justify-content: center; color: var(--ntk-red); cursor: pointer; }
            .gh-headline { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 10px 40px; font-size: 52px; font-weight: 800; color: var(--ntk-red); line-height: 1.1; text-align: center; font-family: 'Mukta', sans-serif; }
            .gh-footer-strip { background: var(--ntk-blue); color: #fff; padding: 5px 60px; font-weight: 800; font-size: 22px; border-radius: 5px 5px 0 0; margin: 0 auto; }
            .ntk-controls { display: flex; gap: 10px; margin-top: 10px; }
            .ntk-btn { padding: 12px 25px; background: var(--ntk-red); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }

    /** Multi-Function 2: Data Fetcher **/
    async function fetchNews() {
        try {
            const res = await fetch(`https://${toolConfig.domain}/wp-json/wp/v2/posts?_embed&per_page=10`);
            posts = await res.json();
            renderUI();
        } catch (e) { console.error("NTK Tool: Fetch Error"); }
    }

    /** Multi-Function 3: UI Renderer **/
    function renderUI() {
        const container = document.getElementById('gh-master-container');
        const p = posts[currentIdx];
        if(!p) return;

        const imgUrl = p._embedded['wp:featuredmedia'] ? p._embedded['wp:featuredmedia'][0].source_url : "";
        const safeImg = `https://images.weserv.nl/?url=${encodeURIComponent(imgUrl.replace(/https?:\/\//, ""))}`;
        const safeLogo = toolConfig.logo ? `https://images.weserv.nl/?url=${encodeURIComponent(toolConfig.logo.replace(/https?:\/\//, ""))}` : "";

        container.innerHTML = `
            <div class="gh-master-wrap">
                ${safeLogo ? `<img src="${safeLogo}" class="gh-logo-watermark">` : ''}
                <div class="gh-img-frame">
                    <img src="${safeImg}">
                    <div class="gh-red-overlay"></div>
                    <div class="gh-social-icons">
                        <div class="icon-box" onclick="window.open('${toolConfig.youtube}')">YT</div>
                        <div class="icon-box" onclick="window.downloadNTK()">DL</div>
                    </div>
                </div>
                <div class="gh-headline">${p.title.rendered}</div>
                <div class="gh-footer-strip">Visit ${toolConfig.siteName}</div>
            </div>
        `;
        adjustScale();
    }

    /** Multi-Function 4: Scaling & Download **/
    function adjustScale() {
        const wrap = document.getElementById('gh-master-container');
        const width = window.innerWidth - 40;
        if(width < 1200) {
            const s = width / 1200;
            wrap.style.transform = `scale(${s})`;
            wrap.style.marginBottom = `-${630 * (1 - s)}px`;
        }
    }

    window.downloadNTK = function() {
        const target = document.querySelector('.gh-master-wrap');
        html2canvas(target, { useCORS: true, scale: 2 }).then(canvas => {
            const a = document.createElement('a');
            a.download = `news-${Date.now()}.png`;
            a.href = canvas.toDataURL();
            a.click();
        });
    };

    window.moveNTK = (n) => {
        currentIdx = (currentIdx + n + posts.length) % posts.length;
        renderUI();
    };

    /** Multi-Function 5: Initializer **/
    window.initNewsTool = function(elementId, config) {
        toolConfig = { ...toolConfig, ...config };
        injectStyles();
        const el = document.getElementById(elementId);
        el.innerHTML = `
            <div id="ntk-widget-container">
                <div id="gh-master-container">लोड हुँदैछ...</div>
                <div class="ntk-controls">
                    <button class="ntk-btn" onclick="moveNTK(-1)">अघिल्लो</button>
                    <button class="ntk-btn" onclick="downloadNTK()">डाउनलोड</button>
                    <button class="ntk-btn" onclick="moveNTK(1)">अर्को</button>
                </div>
            </div>
        `;
        fetchNews();
    };

    window.addEventListener('resize', adjustScale);
})();
