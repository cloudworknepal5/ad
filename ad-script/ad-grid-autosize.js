(function() {
    // 1. Get Configuration
    const config = window.AdGridConfig || {};
    const imgW = config.width || 1111;
    const imgH = config.height || 1360;
    const globalLink = config.link || '';

    const style = document.createElement('style');
    style.innerHTML = `
        /* Main wrapper setup */
        .ad-wrapper { 
            width: 100%; 
            margin: 20px auto; 
            font-family: sans-serif;
            text-align: center;
            /* This allows the large image to be scrollable on small mobile screens */
            overflow-x: auto; 
            display: block;
            -webkit-overflow-scrolling: touch;
        }
        
        .ad-grid-auto { 
            display: inline-flex; /* Changed to inline-flex to respect child width */
            flex-direction: column; 
            gap: 20px; 
            padding: 10px;
            min-width: ${imgW}px; /* Forces the grid to stay at your fixed width */
        }

        .ad-item { 
            width: ${imgW}px; 
            height: ${imgH}px;
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            background: #fff; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            flex-shrink: 0;
        }

        .ad-item img { 
            width: 100% !important; 
            height: 100% !important; 
            object-fit: cover; 
            display: block; 
            cursor: pointer;
        }

        /* Custom Scrollbar for better UX on mobile */
        .ad-wrapper::-webkit-scrollbar { height: 6px; }
        .ad-wrapper::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('ad-grid-auto');
    if (!mainContainer) return;

    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-auto">Loading mobile optimized view...</div>`;

    const getSizedUrl = (url) => {
        if(!url) return "";
        let cleanUrl = url.replace(/https?:\/\//, "");
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${imgW}&h=${imgH}&fit=cover`;
    };

    window.sbProcessAds = function(json) {
        const portal = document.getElementById('ad-portal');
        if (!json.feed || !json.feed.entry) {
            portal.innerHTML = "Feed Error.";
            return;
        }

        const entries = json.feed.entry;
        const targetSlug = (config.postId || "blog-post_54").toLowerCase();

        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
            return link.includes(targetSlug);
        });

        if (!targetPost) {
            portal.innerHTML = "Post Not Found.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = targetPost.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        let gridHtml = '';
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            let altVal = imgs[i].alt || '';
            let customUrl = altVal.startsWith('http') ? altVal : (globalLink || src);
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');

            gridHtml += `
                <div class="ad-item">
                    <a href="${customUrl}" target="_blank">
                        <img src="${getSizedUrl(highRes)}" loading="lazy" alt="${altVal}">
                    </a>
                </div>`;
        }
        portal.innerHTML = gridHtml || "No images found.";
    };

    const sbSync = () => {
        let domain = config.blogUrl || window.location.hostname;
        domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const s = document.createElement('script');
        s.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=sbProcessAds&max-results=50`;
        document.body.appendChild(s);
    };

    sbSync();
})();
