(function() {
    // 1. CSS Fixes (Ratopati Center Logo Style)
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; width: 100%; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        /* Top Bar */
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 6px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; position: relative; }
        
        /* Branding Section - Ratopati Style */
        .h2-branding { padding: 10px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; }
        .h2-brand-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; }
        
        /* Center Logo */
        .h2-logo { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }
        .h2-logo h1 { font-size: 26px; font-weight: 800; color: var(--rp-red); margin: 0; white-space: nowrap; }
        .h2-logo img { max-height: 55px; display: block; margin: 0 auto; }

        /* Icons */
        .h2-icon-btn { font-size: 22px; color: #333; cursor: pointer; background: none; border: none; padding: 5px; display: flex; align-items: center; transition: 0.2s; }
        .h2-icon-btn:hover { color: var(--rp-red); }

        /* Nav Bar */
        .h2-nav-bar { background: #fff; border-bottom: 3px solid var(--rp-red); width: 100%; overflow: hidden; }
        .h2-main-menu { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 2px; padding: 0; margin: 0; scrollbar-width: none; justify-content: center; }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        .h2-main-menu li a { display: block; padding: 12px 15px; color: #1a1a1a; font-weight: 700; font-size: 17px; white-space: nowrap; transition: 0.2s; }
        .h2-main-menu li a:hover { color: var(--rp-red); background: #f9f9f9; }

        /* Dark Mode Support */
        html.dark #neelamb-header-v2, body.dark #neelamb-header-v2 { background: #161e2e !important; }
        .dark #neelamb-header-v2 .h2-branding, .dark #neelamb-header-v2 .h2-nav-bar { background: #161e2e !important; border-color: #374151; }
        .dark #neelamb-header-v2 .h2-logo h1, .dark #neelamb-header-v2 .h2-main-menu li a, .dark #neelamb-header-v2 .h2-icon-btn { color: #f1f5f9 !important; }
        .dark #neelamb-header-v2 .h2-main-menu li a:hover { background: #1f2937; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .h2-branding { border-bottom: none; }
            .h2-main-menu { justify-content: flex-start; }
            .h2-logo h1 { font-size: 22px; }
            .h2-logo img { max-height: 45px; }
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
                    <div class="h2-brand-flex">
                        <button class="h2-icon-btn" id="h2-menu-trigger" aria-label="Menu">
                            <span style="font-size:26px;">&#9776;</span>
                        </button>

                        <div id="auto-logo" class="h2-logo"></div>

                        <button class="h2-icon-btn" id="h2-search-trigger" aria-label="Search">
                            <span style="font-size:20px;">&#128269;</span>
                        </button>
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
            
            // Search Functionality
            document.getElementById('h2-search-trigger').onclick = function() {
                const q = prompt("के खोज्न चाहनुहुन्छ?");
                if (q) window.location.href = "/search?q=" + encodeURIComponent(q);
            };

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
        
        // Auto Logo (If no image, shows Text)
        logoContainer.innerHTML = `<a href="/"><h1 id="blog-title-text">${blogTitle}</h1></a>`;

        // Auto Menu Items (Labels)
        const labels = data.feed.category || [];
        labels.slice(0, 10).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // Nepali Date using Multi-function approach
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    initHeader();
})();
