(function() {
    // 1. CSS Styles (Optimized for 1111x1360 display)
    const style = document.createElement('style');
    style.innerHTML = `
        .ad-wrapper { 
            max-width: 1200px; 
            margin: 20px auto; 
            font-family: 'Segoe UI', sans-serif; 
        }
        .ad-grid-4-column { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .ad-item { 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
            transition: 0.3s ease; 
            background: #fff; 
        }
        .ad-item:hover { 
            transform: scale(1.02); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.15); 
        }
        
        /* Fixed Aspect Ratio for 1111x1360 */
        .ad-item img { 
            width: 100%; 
            height: auto; 
            aspect-ratio: 1111 / 1360; 
            object-fit: cover; 
            display: block; 
            cursor: zoom-in; 
            background: #f0f0f0;
        }
        
        /* Responsive Breakpoints */
        @media (max-width: 1024px) { .ad-grid-4-column { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .ad-grid-4-column { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .ad-grid-4-column { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);

    // Target the new container name
    const mainContainer = document.getElementById('ad-grid-4-column');
    if (!mainContainer) return;

    // Set up the internal structure
    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-4-column">Loading items...</div>`;

    // Multi-function: Proxy & Sizing Helper
    const getSizedProxy = (url) => {
        if(!url) return "";
        const cleanUrl = url.replace(/https?:\/\//, "");
        // Resizing to 1111x1360 for consistent grid performance
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=1111&h=1360&fit=cover`;
    };

    // Multi-function: Data Processor for blog-post_54.html
    window.sbProcessAds = function(json) {
        const entries = json.feed.entry || [];
        const targetSlug = "crimenews"; 
        
        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href;
            return link.includes(targetSlug);
        });

        const portal = document.getElementById('ad-portal');

        if (!targetPost || !targetPost.content) {
            portal.innerHTML = "Content source not found.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = targetPost.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        if (imgs.length === 0) {
            portal.innerHTML = "No images found in post.";
            return;
        }

        let gridHtml = '';
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            // High-resolution source
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
            
            gridHtml += `
                <div class="ad-item">
                    <a href="${highRes}" target="_blank" title="View Full Image">
                        <img src="${getSizedProxy(highRes)}" loading="lazy" alt="Ad Image">
                    </a>
                </div>`;
        }
        
        portal.innerHTML = gridHtml; 
    };

    // API Execution
    const sbSync = () => {
        const s = document.createElement('script');
        s.src = `https://adsneelamb.blogspot.com/feeds/posts/default?alt=json-in-script&callback=sbProcessAds&max-results=150`;
        document.body.appendChild(s);
    };

    sbSync();
})();
