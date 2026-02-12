(function() {
    // 1. CSS Styles (Optimized for 1111x1360 with Dynamic Grid)
    const style = document.createElement('style');
    style.innerHTML = `
        .ad-wrapper { 
            max-width: 1200px; 
            margin: 20px auto; 
            font-family: 'Segoe UI', Tahoma, sans-serif; 
        }
        .ad-grid-auto { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .ad-item { 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.08); 
            transition: 0.3s ease; 
            background: #fff; 
        }
        .ad-item:hover { 
            transform: scale(1.02); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.15); 
        }
        .ad-item img { 
            width: 100%; 
            height: auto; 
            aspect-ratio: 1111 / 1360; 
            object-fit: cover; 
            display: block; 
            cursor: zoom-in; 
            background: #f4f4f4;
        }
        
        /* Responsive Settings */
        @media (max-width: 1024px) { .ad-grid-auto { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .ad-grid-auto { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .ad-grid-auto { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);

    // Target the new ID: ad-grid-auto
    const mainContainer = document.getElementById('ad-grid-auto');
    if (!mainContainer) return;

    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-auto">Loading...</div>`;

    // Multi-function 1: Image Sizing Proxy
    const getSizedProxy = (url) => {
        if(!url) return "";
        return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/https?:\/\//, ""))}&w=1111&h=1360&fit=cover`;
    };

    // Multi-function 2: Data Processor
    window.sbProcessAds = function(json) {
        const portal = document.getElementById('ad-portal');
        let entry = json.entry; // If single post ID is used
        
        // If post slug/query is used, find the specific post
        if (!entry && json.feed && json.feed.entry) {
            const config = window.AdGridConfig || {};
            entry = json.feed.entry.find(e => {
                const link = e.link.find(l => l.rel === 'alternate').href;
                return link.includes(config.postId);
            });
        }

        if (!entry || !entry.content) {
            portal.innerHTML = "Error: Content source not found.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = entry.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        let gridHtml = '';
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
            
            gridHtml += `
                <div class="ad-item">
                    <a href="${highRes}" target="_blank">
                        <img src="${getSizedProxy(highRes)}" loading="lazy" alt="Gallery Item">
                    </a>
                </div>`;
        }
        portal.innerHTML = gridHtml || "No images found."; 
    };

    // Multi-function 3: Dynamic Sync based on External Config
    const sbSync = () => {
        const config = window.AdGridConfig || {};
        const blogUrl = config.blogUrl || "www.mukeshbasnet.com.np";
        const postId = config.postId || "blog-post_54.html";

        const s = document.createElement('script');
        // Logic to check if postId is a numeric ID or a slug
        if (!isNaN(postId) && postId.length > 5) {
            s.src = `https://${blogUrl}/feeds/posts/default/${postId}?alt=json-in-script&callback=sbProcessAds`;
        } else {
            s.src = `https://${blogUrl}/feeds/posts/default?alt=json-in-script&callback=sbProcessAds&max-results=150`;
        }
        document.body.appendChild(s);
    };

    sbSync();
})();
