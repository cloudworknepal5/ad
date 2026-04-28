(function() {
    // 1. CSS - Dark Mode र Layout Fixes
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-wrap { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; width: 100%; position: relative; z-index: 9999; }
        #neelamb-header-wrap * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; outline: none !important; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 10px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        
        .h2-branding { padding: 15px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; }
        .h2-brand-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; height: 80px; }
        
        .h2-logo { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; }
        .h2-logo img { max-height: 75px; width: auto; display: block; }
        .h2-logo h1 { font-size: 32px; font-weight: 800; color: var(--rp-red); margin: 0; }

        .h2-controls { display: flex; align-items: center; gap: 10px; }
        .h2-icon-btn { font-size: 24px; color: #333; cursor: pointer; background: none; border: none; padding: 8px; transition: 0.2s; }

        .h2-nav-bar { background: #fff; border-bottom: 4px solid var(--rp-red); width: 100%; }
        .h2-main-menu { display: flex; overflow-x: auto; gap: 10px; padding: 0 10px; scrollbar-width: none; justify-content: center; }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        .h2-main-menu li a { display: block; padding: 15px 18px; color: #1a1a1a; font-weight: 800; font-size: 18px; white-space: nowrap; }
        
        /* Dark Mode */
        .dark #neelamb-header-wrap, .dark .h2-branding, .dark .h2-nav-bar { background: #161e2e !important; border-color: #374151 !important; }
        .dark .h2-logo h1, .dark .h2-main-menu li a, .dark .h2-icon-btn { color: #f1f5f9 !important; }

        @media (max-width: 768px) {
            .h2-logo img { max-height: 50px; }
            .h2-main-menu { justify-content: flex-start; }
        }
    `;
    document.head.appendChild(style);

    const headerHTML = `
        <div id="neelamb-header-wrap">
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
                        <div class="h2-controls">
                            <button class="h2-icon-btn" id="h2-dark-toggle"><span id="theme-icon">&#9789;</span></button>
                            <button class="h2-icon-btn" id="h2-search-trigger">&#128269;</button>
                        </div>
                    </div>
                </div>
            </div>
            <nav class="h2-nav-bar">
                <ul class="h2-main-menu" id="auto-menu">
                    <li><a href="/">गृहपृष्ठ</a></li>
                </ul>
            </nav>
        </div>
    `;

    function renderHeader() {
        // कुनै पनि कन्टेनर नभेटिएमा body को सुरुमा थप्ने (Force Render)
        let container = document.getElementById('neelamb-header-v2-container') || document.querySelector('header') || document.body;
        
        if (container === document.body) {
            const div = document.createElement('div');
            div.id = 'neelamb-header-v2-container';
            document.body.prepend(div);
            container = div;
        }

        container.innerHTML = headerHTML;
        
        // Setup Logic
        document.getElementById('h2-search-trigger').onclick = () => {
            const q = prompt("के खोज्न चाहनुहुन्छ?");
            if (q) window.location.href = "/search?q=" + encodeURIComponent(q);
        };

        const darkBtn = document.getElementById('h2-dark-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        darkBtn.onclick = () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            themeIcon.innerHTML = isDark ? '&#9728;' : '&#9789;';
        };

        // Fetch Data
        const script = document.createElement('script');
        script.src = '/feeds/posts/summary?alt=json-in-script&callback=getBloggerHeaderData';
        document.body.appendChild(script);
    }

    window.getBloggerHeaderData = function(data) {
        const menuContainer = document.getElementById('auto-menu');
        const logoContainer = document.getElementById('auto-logo');
        const blogTitle = data.feed.title.$t;

        // Logo Detection
        const hiddenImg = document.querySelector('.Header img, #header-inner img, .header-logo img');
        if (hiddenImg && hiddenImg.src) {
            logoContainer.innerHTML = `<a href="/"><img src="${hiddenImg.src}" alt="${blogTitle}"/></a>`;
        } else {
            logoContainer.innerHTML = `<a href="/"><h1>${blogTitle}</h1></a>`;
        }

        // Labels
        const labels = data.feed.category || [];
        labels.slice(0, 10).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderHeader);
    } else {
        renderHeader();
    }
})();
