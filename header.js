(function() {
    // 1. CSS Fixes (Spacing र Dark Mode का लागि)
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        /* Top Bar */
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 8px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; }
        
        /* Branding */
        .h2-branding { padding: 15px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; }
        .h2-logo h1 { font-size: 28px; font-weight: 800; color: #333; margin: 0; }
        .h2-logo img { max-height: 60px; display: block; }

        /* Menu Spacing Fix (टाँसिएको हटाउन) */
        .h2-nav-bar { background: #fff; border-bottom: 3px solid var(--rp-red); width: 100%; }
        .h2-main-menu { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 5px; padding: 0; margin: 0; scrollbar-width: none; }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        .h2-main-menu li { display: inline-block !important; margin: 0 !important; padding: 0 !important; }
        .h2-main-menu li a { 
            display: block; 
            padding: 12px 18px !important; 
            color: #1a1a1a; 
            font-weight: 700; 
            font-size: 17px; 
            white-space: nowrap; 
            transition: 0.2s;
        }
        .h2-main-menu li a:hover { color: var(--rp-red); background: #f9f9f9; }

        /* Dark Mode Overrides (तपाईंको साइटको .dark class सँग मिल्ने गरी) */
        html.dark #neelamb-header-v2, 
        .dark-mode #neelamb-header-v2,
        body.dark #neelamb-header-v2 { background: #161e2e !important; }

        .dark #neelamb-header-v2 .h2-branding,
        .dark #neelamb-header-v2 .h2-nav-bar { background: #161e2e !important; border-color: #374151; }

        .dark #neelamb-header-v2 .h2-logo h1,
        .dark #neelamb-header-v2 .h2-main-menu li a,
        .dark #neelamb-header-v2 .h2-menu-icon { color: #f1f5f9 !important; }
        
        .dark #neelamb-header-v2 .h2-main-menu li a:hover { background: #1f2937; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .h2-branding { background: var(--rp-red); }
            .h2-logo h1 { color: #fff !important; }
            .h2-menu-icon { color: #fff; font-size: 24px; cursor: pointer; }
        }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure
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
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span class="h2-menu-icon">&#9776;</span>
                        <div id="auto-logo" class="h2-logo"></div>
                    </div>
                </div>
            </div>
            <nav class="h2-nav-bar">
                <div class="h2-container">
                    <ul class="h2-main-menu" id="auto-menu">
                        <li><a href="/">गृहपृष्ठ</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    `;

    function initHeader() {
        const container = document.getElementById('neelamb-header-v2');
        if (container) {
            container.innerHTML = headerHTML;
            const feedUrl = window.location.origin + '/feeds/posts/summary?alt=json-in-script&callback=getBloggerHeaderData';
            const script = document.createElement('script');
            script.src = feedUrl;
            document.body.appendChild(script);
        }
    }

    window.getBloggerHeaderData = function(data) {
        const menuContainer = document.getElementById('auto-menu');
        const logoContainer = document.getElementById('auto-logo');
        const blogTitle = data.feed.title.$t;
        
        // Auto Logo
        logoContainer.innerHTML = `<a href="/"><h1 id="blog-title-text">${blogTitle}</h1></a>`;

        // Auto Labels (Spacing मिलाउन padding थपिएको छ)
        const labels = data.feed.category || [];
        labels.slice(0, 12).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // Nepali Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    initHeader();
})();
