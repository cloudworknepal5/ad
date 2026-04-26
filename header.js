(function() {
    // 1. CSS - Spacing, Icon Distance, र Dark Mode Fixes
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; width: 100%; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; outline: none !important; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        /* Top Bar */
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 10px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 35px; display: flex; justify-content: space-between; align-items: center; position: relative; }
        
        /* Branding Section - आइकनहरू टाढा बनाइएको */
        .h2-branding { padding: 18px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; min-height: 100px; display: flex; align-items: center; }
        .h2-brand-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; gap: 40px; }
        
        /* Logo Center Fix */
        .h2-logo { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; z-index: 5; }
        .h2-logo img { max-height: 75px; width: auto; object-fit: contain; display: block; margin: 0 auto; }
        .h2-logo h1 { font-size: 32px; font-weight: 800; color: var(--rp-red); margin: 0; }

        /* Icon Buttons - दूरी र साइज सुधार */
        .h2-icon-btn { font-size: 30px; color: #333; cursor: pointer; background: none; border: none; padding: 15px; z-index: 10; display: flex; align-items: center; transition: 0.2s; }
        .h2-icon-btn:hover { color: var(--rp-red); }

        /* Navigation Menu - Label Padding र Spacing */
        .h2-nav-bar { background: #fff; border-bottom: 4px solid var(--rp-red); width: 100%; display: flex; justify-content: center; }
        .h2-main-menu { 
            display: flex; 
            flex-wrap: nowrap; 
            overflow-x: auto; 
            gap: 5px; 
            padding: 0; 
            margin: 0; 
            scrollbar-width: none; 
            justify-content: center; 
            width: 100%;
            max-width: 1240px;
        }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        
        .h2-main-menu li { display: flex; align-items: center; }
        .h2-main-menu li a { 
            display: block; 
            padding: 20px 40px; 
            color: #1a1a1a; 
            font-weight: 800; 
            font-size: 20px; 
            white-space: nowrap; 
            transition: all 0.3s ease;
            text-align: center;
            border-bottom: 4px solid transparent;
        }
        
        /* Hover Effect - सेतो बाकस हटाइएको */
        .h2-main-menu li a:hover { color: var(--rp-red); background: transparent; border-bottom-color: var(--rp-red); }

        /* Dark Mode Fixes - सेतो बाकस पूर्ण रूपमा हटाइएको */
        .dark #neelamb-header-v2, 
        .dark #neelamb-header-v2 .h2-branding, 
        .dark #neelamb-header-v2 .h2-nav-bar { background: #161e2e !important; border-color: #374151; }
        
        .dark #neelamb-header-v2 .h2-logo h1, 
        .dark #neelamb-header-v2 .h2-main-menu li a, 
        .dark #neelamb-header-v2 .h2-icon-btn { color: #f1f5f9 !important; }
        
        .dark #neelamb-header-v2 .h2-main-menu li a:hover { 
            background: transparent !important; 
            color: var(--rp-red) !important; 
            border-bottom-color: var(--rp-red); 
        }
        .dark #neelamb-header-v2 .h2-main-menu li a:focus,
        .dark #neelamb-header-v2 .h2-main-menu li a:active { background: transparent !important; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .h2-container { padding: 0 20px; }
            .h2-main-menu { justify-content: flex-start; }
            .h2-main-menu li a { padding: 15px 25px; font-size: 17px; }
            .h2-logo img { max-height: 60px; }
            .h2-brand-flex { gap: 15px; }
            .h2-icon-btn { font-size: 26px; padding: 10px; }
        }
    `;
    document.head.appendChild(style);

    const headerHTML = `
        <header class="h2-wrapper">
            <div class="h2-top-mini">
                <div class="h2-container">
                    <div id="h2-nepali-date">...</div>
                    <div style="font-weight:600;">युनिकोड | रेडियो</div>
                </div>
            </div>
            <div class="h2-branding">
                <div class="h2-container">
                    <div class="h2-brand-flex">
                        <button class="h2-icon-btn" id="h2-menu-trigger">&#9776;</button>
                        <div id="auto-logo" class="h2-logo"></div>
                        <button class="h2-icon-btn" id="h2-search-trigger">&#128269;</button>
                    </div>
                </div>
            </div>
            <nav class="h2-nav-bar">
                <ul class="h2-main-menu" id="auto-menu">
                    <li><a href="/">गृहपृष्ठ</a></li>
                </ul>
            </nav>
        </header>
    `;

    function initHeader() {
        const container = document.getElementById('neelamb-header-v2');
        if (container) {
            container.innerHTML = headerHTML;
            document.getElementById('h2-search-trigger').onclick = () => {
                const q = prompt("के खोज्न चाहनुहुन्छ?");
                if (q) window.location.href = "/search?q=" + encodeURIComponent(q);
            };
            const feedUrl = '/feeds/posts/summary?alt=json-in-script&callback=getBloggerHeaderData';
            const script = document.createElement('script');
            script.src = feedUrl;
            document.body.appendChild(script);
        }
    }

    window.getBloggerHeaderData = function(data) {
        const menuContainer = document.getElementById('auto-menu');
        const logoContainer = document.getElementById('auto-logo');
        const blogTitle = data.feed.title.$t;
        const existingLogo = document.querySelector('.Header img, #header-inner img, .header-logo img');
        if (existingLogo && existingLogo.src) {
            logoContainer.innerHTML = `<a href="/"><img src="${existingLogo.src}" alt="${blogTitle}"/></a>`;
        } else {
            logoContainer.innerHTML = `<a href="/"><h1>${blogTitle}</h1></a>`;
        }
        const labels = data.feed.category || [];
        labels.slice(0, 10).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    initHeader();
})();
