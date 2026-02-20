(function() {
    // 1. CSS: Rounded Buttons & Sticky Design
    const style = document.createElement('style');
    style.innerHTML = `
        #rp-blogger-widget {
            width: 100%;
            max-width: 330px;
            background: #fff;
            font-family: 'Kalimati', Arial, sans-serif;
            position: sticky;
            top: 20px;
            margin-bottom: 20px;
        }
        .rp-btn-group {
            display: flex;
            gap: 10px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f1f1f1;
            margin-bottom: 10px;
        }
        .rp-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            background: #e0e0e0;
            color: #333;
            transition: all 0.3s ease;
        }
        .rp-btn.active {
            background: #bc1d22;
            color: #fff;
        }
        .rp-btn svg { width: 16px; height: 16px; fill: currentColor; }
        .rp-feed-container { max-height: 450px; overflow-y: auto; }
        .rp-feed-list { display: none; list-style: none; padding: 0; margin: 0; }
        .rp-feed-list.active { display: block; }
        .rp-post-item {
            padding: 12px 0;
            border-bottom: 1px solid #f1f1f1;
            animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .rp-post-item a {
            text-decoration: none;
            color: #222;
            font-size: 15px;
            line-height: 1.4;
            display: block;
            font-weight: 500;
        }
        .rp-post-item a:hover { color: #bc1d22; }
        .rp-post-item .date { font-size: 11px; color: #888; margin-top: 5px; }
        .rp-feed-container::-webkit-scrollbar { width: 4px; }
        .rp-feed-container::-webkit-scrollbar-thumb { background: #bc1d22; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure
    const widgetHTML = `
        <div id="rp-blogger-widget">
            <div class="rp-btn-group">
                <button class="rp-btn active" onclick="toggleRP(event, 'rp-latest')">
                    <svg viewBox="0 0 24 24"><path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.41-1.09-2.12-1.72C13.1 7.33 12.5 5.73 13 4c-2 1.35-3.5 4-3 6.67.1.52.28 1.03.5 1.51.26.5-.06 1.14-.64 1.1-.82-.07-1.55-.46-2.1-1.07-1.1-1.21-1.28-3.07-.44-4.59-1.93 1.25-2.8 3.6-2.32 5.82.48 2.22 2.1 4 4.07 4.8 1.76.71 3.74.52 5.23-.52 1.9-1.33 2.58-3.8 1.36-5.82z"/></svg>
                    ताजा
                </button>
                <button class="rp-btn" onclick="toggleRP(event, 'rp-popular')">
                    <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                    लोकप्रिय
                </button>
            </div>
            <div class="rp-feed-container">
                <ul id="rp-latest" class="rp-feed-list active"><li>लोडिङ...</li></ul>
                <ul id="rp-popular" class="rp-feed-list"><li>लोडिङ...</li></ul>
            </div>
        </div>
    `;

    // 3. Functions: Tab Switch & Fetch Feed
    window.toggleRP = function(e, id) {
        document.querySelectorAll('.rp-feed-list').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.rp-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        e.currentTarget.classList.add('active');
    };

    function fetchBloggerData(type, targetId) {
        // Blogger RSS/JSON Feed URL
        const maxResults = 6;
        let feedUrl = `/feeds/posts/default?alt=json-in-script&max-results=${maxResults}&callback=parse${targetId}`;
        
        // Popular posts usually handled by 'orderby=published' or 'orderby=updated' 
        // Blogger doesn't have a direct 'popular' JSON feed without a specific gadget, 
        // so we use 'updated' for variety or you can use a specific Label.
        if(type === 'popular') {
            feedUrl = `/feeds/posts/default?orderby=updated&alt=json-in-script&max-results=${maxResults}&callback=parse${targetId}`;
        }

        const script = document.createElement('script');
        script.src = feedUrl;
        document.body.appendChild(script);

        window['parse' + targetId] = function(data) {
            let html = "";
            const entries = data.feed.entry || [];
            entries.forEach(entry => {
                let title = entry.title.$t;
                let link = entry.link.find(l => l.rel === 'alternate').href;
                let pubDate = new Date(entry.published.$t).toLocaleDateString('ne-NP');
                html += `<li class="rp-post-item">
                            <a href="${link}">${title}</a>
                            <span class="date">${pubDate}</span>
                         </li>`;
            });
            document.getElementById(targetId).innerHTML = html || "कुनै पोष्ट भेटिएन।";
        };
    }

    document.addEventListener("DOMContentLoaded", function() {
        const mount = document.getElementById('rp-main-mount');
        if (mount) {
            mount.innerHTML = widgetHTML;
            fetchBloggerData('latest', 'rp-latest');
            fetchBloggerData('popular', 'rp-popular');
        }
    });
})();
