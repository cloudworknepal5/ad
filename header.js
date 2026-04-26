/* * Professional Header v2.1 - Fixed for Post Pages
 * Features: Scoped CSS, Dynamic Feed, Auto-Logo & Labels
 */

(function() {
    // 1. Inject Scoped CSS (पोष्ट पेजमा ओभरराइड हुन नदिन)
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        .h2-wrapper { width: 100%; border-bottom: 3px solid var(--rp-red); background: #fff; position: relative; z-index: 9999; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; }
        
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 5px 0; font-size: 13px; width: 100%; }
        .h2-branding { padding: 15px 0; border-bottom: 1px solid #eee; background: #fff; width: 100%; }
        
        .h2-logo img { max-height: 60px; display: block; filter: none !important; }
        .h2-brand-left { display: flex; align-items: center; gap: 15px; }
        .h2-menu-icon { font-size: 24px; cursor: pointer; color: #333; }
        
        .h2-nav-bar { background: #fff; width: 100%; display: block; }
        .h2-main-menu { list-style: none !important; display: flex; flex-wrap: wrap; margin: 0; padding: 0; }
        .h2-main-menu li { list-style: none !important; }
        .h2-main-menu li a { display: block; padding: 12px 15px; color: #333; text-decoration: none; font-weight: 700; font-size: 17px; }
        
        /* Mobile View Fixes */
        @media (max-width: 768px) {
            .h2-branding { background: var(--rp-red); }
            .h2-logo h1 { color: #fff !important; }
            .h2-logo img { filter: brightness(0) invert(1) !important; }
            .h2-menu-icon { color: #fff; }
            .h2-main-menu { display: none; }
            .h2-main-menu.active { display: flex; flex-direction: column; width: 100%; background: #fff; }
            .h2-main-menu.active li a { color: #333; border-bottom: 1px solid #eee; }
        }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure
    const headerHTML = `
        <header class="h2-wrapper">
            <div class="h2-top-mini">
                <div class="h2-container">
                    <div id="h2-nepali-date">मिति लोड हुँदै...</div>
                    <div style="display:flex; gap:10px;">युनिकोड | रेडियो</div>
                </div>
            </div>
            <div class="h2-branding">
                <div class="h2-container">
                    <div class="h2-brand-left">
                        <span id="menuToggle" class="h2-menu-icon">&#9776;</span>
                        <div id="auto-logo" class="h2-logo">लोड हुँदै...</div>
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

    // 3. Render and Fetch Data
    function initHeader() {
        const container = document.getElementById('neelamb-header-v2');
        if (container) {
            container.innerHTML = headerHTML;
            
            // पोष्ट पेजमा पनि काम गर्ने गरी पूर्ण URL प्रयोग गरिएको
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
        
        // १. लोगो सेट गर्ने (यदि इमेज छ भने इमेज, नत्र टाइटल)
        const blogIcon = data.feed.icon ? data.feed.icon.$t : '';
        if (blogIcon) {
            logoContainer.innerHTML = `<a href="/"><img src="${blogIcon}" alt="${blogTitle}"/></a>`;
        } else {
            logoContainer.innerHTML = `<a href="/" style="text-decoration:none; color:inherit;"><h1 style="font-size:24px; font-weight:800; margin:0;">${blogTitle}</h1></a>`;
        }

        // २. लेबलहरू मेनुमा थप्ने
        const labels = data.feed.category || [];
        labels.slice(0, 10).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // ३. मोबाइल मेनु टोगल
        document.getElementById('menuToggle').onclick = function() {
            menuContainer.classList.toggle('active');
        };

        // ४. मिति अपडेट
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
