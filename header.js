/* * Integrated Ratopati Style Header for Blogger
 * Author: Mukesh Basnet (Neelamb)
 * Features: Auto Logo, Auto Labels/Menu, Nepali Date, Dark Mode Support
 */

(function() {
    // 1. Inject CSS into Head
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;600;700;800&display=swap');
        :root { --rp-red: #e31e24; --rp-dark-red: #b31419; }
        .h2-wrapper { font-family: 'Mukta', sans-serif; width: 100%; border-bottom: 3px solid var(--rp-red); background: #fff; }
        .h2-container { max-width: 1240px; margin: 0 auto; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; }
        
        /* Top Mini Bar */
        .h2-top-mini { background: var(--rp-dark-red); color: #fff; padding: 5px 0; font-size: 13px; }
        
        /* Branding Section */
        .h2-branding { padding: 15px 0; border-bottom: 1px solid #eee; }
        .h2-logo img { max-height: 60px; display: block; }
        .h2-brand-left { display: flex; align-items: center; gap: 15px; }
        .h2-menu-icon { font-size: 24px; cursor: pointer; color: #333; }
        
        /* Navigation Menu */
        .h2-nav-bar { background: #fff; }
        .h2-main-menu { list-style: none; display: flex; flex-wrap: wrap; margin: 0; padding: 0; }
        .h2-main-menu li a { display: block; padding: 12px 15px; color: #333; text-decoration: none; font-weight: 700; font-size: 17px; text-transform: uppercase; }
        .h2-main-menu li a:hover { color: var(--rp-red); }
        
        /* Responsive */
        @media (max-width: 768px) {
            .h2-main-menu { display: none; }
            .h2-main-menu.active { display: flex; flex-direction: column; width: 100%; }
            .h2-branding { background: var(--rp-red); color: #fff; }
            .h2-logo img { filter: brightness(0) invert(1); }
            .h2-menu-icon { color: #fff; }
        }
        
        /* Dark Mode Support */
        .dark .h2-wrapper, .dark .h2-nav-bar { background: #161e2e !important; border-color: var(--rp-red); }
        .dark .h2-main-menu li a, .dark .h2-menu-icon { color: #f1f5f9 !important; }
    `;
    document.head.appendChild(style);

    // 2. Render HTML Structure
    const headerHTML = `
        <header class="h2-wrapper">
            <div class="h2-top-mini">
                <div class="h2-container">
                    <div id="h2-nepali-date">मिति लोड हुँदै...</div>
                    <div class="h2-top-links"> युनिकोड | खेलकुद </div>
                </div>
            </div>
            <div class="h2-branding">
                <div class="h2-container">
                    <div class="h2-brand-left">
                        <i class="fa-solid fa-bars h2-menu-icon" id="menuToggle"></i>
                        <div class="h2-logo" id="auto-logo"></div>
                    </div>
                    <div class="h2-brand-right">
                        <span class="h2-lang">EN</span>
                        <i class="fa-solid fa-magnifying-glass"></i>
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
    
    // Injecting the Header into a specific div or body start
    document.addEventListener("DOMContentLoaded", function() {
        const headerPlaceholder = document.getElementById('neelamb-header-v2');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // 3. Fetch Blogger Data (Logo and Labels)
        fetch('/feeds/posts/summary?alt=json-in-script&callback=getBloggerData');
    });

    // 4. Logic to Handle Data & Menu Toggle
    window.getBloggerData = function(data) {
        const menuContainer = document.getElementById('auto-menu');
        const logoContainer = document.getElementById('auto-logo');
        const blogTitle = data.feed.title.$t;
        const labels = data.feed.category || [];

        // Set Auto Logo (Use Blog Image or Title)
        logoContainer.innerHTML = `<a href="/" style="text-decoration:none; color:inherit;"><h1 style="font-size:24px; font-weight:800;">${blogTitle}</h1></a>`;

        // Set Auto Labels to Menu
        labels.slice(0, 8).forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/search/label/${encodeURIComponent(cat.term)}">${cat.term}</a>`;
            menuContainer.appendChild(li);
        });

        // Toggle Menu Mobile
        document.getElementById('menuToggle').onclick = function() {
            menuContainer.classList.toggle('active');
        };

        // Update Nepali Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('h2-nepali-date').innerHTML = new Date().toLocaleDateString('ne-NP', options);
    };
})();