(function() {
    // 1. CSS (Spacing, Logo, र Dark Mode का लागि)
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-header-v2 { all: initial; font-family: 'Mukta', sans-serif; display: block; background: #fff; width: 100%; }
        #neelamb-header-v2 * { box-sizing: border-box; margin: 0; padding: 0; text-decoration: none; list-style: none !important; }
        
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        
        /* Top Bar */
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 6px 0; font-size: 14px; width: 100%; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; position: relative; }
        
        /* Branding Section */
        .h2-branding { padding: 10px 0; background: #fff; border-bottom: 1px solid #eee; width: 100%; min-height: 80px; display: flex; align-items: center; }
        .h2-brand-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative; }
        
        /* Center Logo Styling */
        .h2-logo { position: absolute; left: 50%; transform: translateX(-50%); text-align: center; display: flex; justify-content: center; align-items: center; min-width: 180px; }
        .h2-logo img { max-height: 60px; width: auto; object-fit: contain; display: block; }
        .h2-logo h1 { font-size: 26px; font-weight: 800; color: var(--rp-red); margin: 0; }

        /* Icon Buttons */
        .h2-icon-btn { font-size: 24px; color: #333; cursor: pointer; background: none; border: none; padding: 8px; z-index: 10; display: flex; align-items: center; }
        .h2-icon-btn:hover { color: var(--rp-red); }

        /* Navigation Menu (Labels) */
        .h2-nav-bar { background: #fff; border-bottom: 3px solid var(--rp-red); width: 100%; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .h2-main-menu { 
            display: flex; 
            flex-wrap: nowrap; 
            overflow-x: auto; 
            gap: 20px; /* लेबलहरु बीचको दूरी */
            padding: 0 10px; 
            margin: 0; 
            scrollbar-width: none; 
            justify-content: center; 
        }
        .h2-main-menu::-webkit-scrollbar { display: none; }
        .h2-main-menu li a { 
            display: block; 
            padding: 12px 5px; 
            color: #1a1a1a; 
            font-weight: 700; 
            font-size: 17px; 
            white-space: nowrap; 
            transition: 0.3s ease;
        }
        .h2-main-menu li a:hover { color: var(--rp-red); }

        /* Dark Mode Support */
        .dark #neelamb-header-v2, .dark #neelamb-header-v2 .h2-branding, .dark #neelamb-header-v2 .h2-nav-bar { background: #161e2e !important; border-color: #374151; }
        .dark #neelamb-header-v2 .h2-logo h1, .dark #neelamb-header-v2 .h2-main-menu li a, .dark #neelamb-header-v2 .h2-icon-btn { color: #f1f5f9 !important; }
        .dark #neelamb-header-v2 .h2-main-menu li a:hover { color: #60a5fa; }

        @media (max-width: 768px) {
            .h2-main-menu { justify-content: flex-start; gap: 15px; }
            .h2-logo img { max-height: 50px; }
            .h2-logo h1 { font-size: 20px; }
        }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure (Layout)
    const headerHTML = `
        <header class="h2-wrapper">
            <div class="h2-top-mini">
                <div class="h2-container">
                    <div id="h2-nepali-date">...</div>
                    <div style="font-weight:600; cursor:pointer;">युनिकोड | रेडियो</div>
                </div>
            </div>
            <div class="h2-branding">
                <div class="h2-container">
                    <div class="h2-brand-flex">
                        <button class="h2-icon-btn" id="h2-menu-trigger">&#9776;</button>
                        
                        <div id="auto-logo" class="h2-logo">
                             <span style="font-size:12px; color:#999;">Loading...</span>
                        </div>
                        
                        <button class="h2-icon-btn" id="h2-search-trigger">&#128269;</button>
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
            
            // Search Prompt Function
            document.getElementById('h2-search-trigger').onclick = () => {
                const query = prompt("के खोज्न चाहनुहुन्छ?");
                if (query) window.location.href = "/search?q=" + encodeURIComponent(query);
            };

            // JSON Feed Fetching
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

        // 1. Logo Logic: ब्लगरको अपलोड गरिएको इमेज खोज्ने
        // ब्लगरमा अपलोड भएको लोगो प्राय: 'Header1' विजेटमा हुन्छ। 
        // यो स्क्रिप्टले ब्लगमा रहेको पहिलो लोगो इमेज तान्ने प्रयास गर्छ।
        const existingLogo = document.querySelector('.Header img, #header-inner img, .header-logo img');
        
        if (existingLogo && existingLogo.src) {
            logoContainer.innerHTML = `<a href="/"><img src="${existingLogo.src}" alt="${blogTitle}"/></a>`;
        } else {
            // यदि इमेज भेटिएन भने टेक्स्ट लोगो देखाउने
            logoContainer.innerHTML = `<a href="/"><h1>${blogTitle}</h1></a>`;
        }

        // 2. Labels Logic: Spacing मिलाएर राख्ने
        const labels = data.feed.category || [];
        labels.slice(0, 12).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // 3. Nepali Date Logic
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('ne-NP', dateOptions);
        document.getElementById('h2-nepali-date').innerHTML = today;
    };

    initHeader();
})();
