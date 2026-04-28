(function() {
    // 1. CSS - Updated with Dark Mode Button & Layout Fixes
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; width: 100%; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; outline: none !important; -webkit-tap-highlight-color: transparent; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 10px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; position: relative; }
        
        .h2-branding { padding: 15px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; min-height: 100px; display: flex; align-items: center; }
        .h2-brand-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; }
        
        .h2-logo { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; z-index: 5; }
        .h2-logo img { max-height: 75px; width: auto; object-fit: contain; display: block; margin: 0 auto; }
        .h2-logo h1 { font-size: 32px; font-weight: 800; color: var(--rp-red); margin: 0; line-height:1; }

        /* Icon Controls Flex */
        .h2-controls { display: flex; align-items: center; gap: 5px; z-index: 10; }
        .h2-icon-btn { font-size: 24px; color: #333; cursor: pointer; background: none; border: none; padding: 10px; display: flex; align-items: center; transition: 0.2s; }
        .h2-icon-btn:hover { color: var(--rp-red); }

        .h2-nav-bar { background: #fff; border-bottom: 4px solid var(--rp-red); width: 100%; display: flex; justify-content: center; }
        .h2-main-menu { 
            display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 5px; padding: 0 20px; margin: 0; 
            scrollbar-width: none; justify-content: center; width: 100%; max-width: 1240px;
        }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        .h2-main-menu li a { 
            display: block; padding: 15px 20px; color: #1a1a1a; font-weight: 800; font-size: 18px; 
            white-space: nowrap; transition: 0.3s;
        }
        .h2-main-menu li a:hover { color: var(--rp-red); background: transparent !important; }

        /* Dark Mode Styling */
        .dark #neelamb-header-v2, 
        .dark #neelamb-header-v2 .h2-branding, 
        .dark #neelamb-header-v2 .h2-nav-bar { background: #161e2e !important; border-color: #374151 !important; }
        .dark #neelamb-header-v2 .h2-logo h1, 
        .dark #neelamb-header-v2 .h2-main-menu li a, 
        .dark #neelamb-header-v2 .h2-icon-btn { color: #f1f5f9 !important; }

        @media (max-width: 768px) {
            .h2-container { padding: 0 15px; }
            .h2-main-menu { justify-content: flex-start; }
            .h2-logo img { max-height: 50px; }
            .h2-logo h1 { font-size: 24px; }
        }
    `;
    document.head.appendChild(style);

    const headerHTML = `
        <header id="neelamb-header-v2">
            <div class="h2-top-mini">
                <div class="h2-container">
                    <div id="h2-nepali-date">...</div>
                    <div style="font-weight:600;">युनिकोड | रेडियो</div>
                </div>
            </div>
            <div class="h2-branding">
                <div class="h2-container">
                    <div class="h2-brand-flex">
                        <button class="h2-icon-btn" id="h2-menu-trigger" title="Menu">&#9776;</button>
                        <div id="auto-logo" class="h2-logo"></div>
                        <div class="h2-controls">
                            <button class="h2-icon-btn" id="h2-dark-toggle" title="Theme Mode">
                                <span id="theme-icon">&#9789;</span>
                            </button>
                            <button class="h2-icon-btn" id="h2-search-trigger" title="Search">&#128269;</button>
                        </div>
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
        const container = document.getElementById('neelamb-header-v2-container');
        if (container) {
            container.innerHTML = headerHTML;
            setupControls();
            
            // Blogger JSON Feed for Menu & Logo
            const script = document.createElement('script');
            script.src = '/feeds/posts/summary?alt=json-in-script&callback=getBloggerHeaderData';
            document.body.appendChild(script);
        }
    }

    function setupControls() {
        // Search Trigger
        document.getElementById('h2-search-trigger').onclick = () => {
            const q = prompt("के खोज्न चाहनुहुन्छ?");
            if (q) window.location.href = "/search?q=" + encodeURIComponent(q);
        };

        // Dark Mode Logic
        const darkBtn = document.getElementById('h2-dark-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const html = document.documentElement;

        const updateThemeUI = (isDark) => {
            themeIcon.innerHTML = isDark ? '&#9728;' : '&#9789;'; // Sun or Moon
        };

        // Initial check
        if (localStorage.theme === 'dark' || html.classList.contains('dark')) {
            updateThemeUI(true);
        }

        darkBtn.onclick = () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            updateThemeUI(isDark);
        };
    }

    window.getBloggerHeaderData = function(data) {
        const menuContainer = document.getElementById('auto-menu');
        const logoContainer = document.getElementById('auto-logo');
        const blogTitle = data.feed.title.$t;
        
        // 1. Logo Discovery Logic
        // ब्लगरको लुकेको हेडरबाट इमेज तान्ने प्रयास
        const hiddenImg = document.querySelector('.Header img, #header-inner img, [data-widget-type="Header"] img');
        
        if (hiddenImg && hiddenImg.src && hiddenImg.src !== "") {
            logoContainer.innerHTML = `<a href="/"><img src="${hiddenImg.src}" alt="${blogTitle}"/></a>`;
        } else {
            logoContainer.innerHTML = `<a href="/"><h1>${blogTitle}</h1></a>`;
        }

        // 2. Menu Labels Logic
        const labels = data.feed.category || [];
        labels.slice(0, 10).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // 3. Date Logic
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
