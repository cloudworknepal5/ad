(function() {
    // 1. CSS Styles (Grid & Fixed Dimensions)
    const style = document.createElement('style');
    style.innerHTML = `
        .post-grid-wrapper { 
            max-width: 1200px; 
            margin: 20px auto; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        }
        .cartoon-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .grid-item { 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
            transition: 0.3s ease; 
            background: #fff; 
        }
        .grid-item:hover { 
            transform: scale(1.02); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.15); 
        }
        
        /* Forces the 1111x1360 aspect ratio */
        .grid-item img { 
            width: 100%; 
            height: auto; 
            aspect-ratio: 1111 / 1360; 
            object-fit: cover; /* Use 'contain' if you don't want any cropping */
            display: block; 
            cursor: zoom-in; 
            background: #eee;
        }
        
        /* Responsive Layout */
        @media (max-width: 1024px) { .cartoon-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .cartoon-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { 
            .cartoon-grid { grid-template-columns: 1fr; } 
        }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('cartoon-grid-container');
    if (!mainContainer) return;

    // UI Structure
    mainContainer.innerHTML = `
        <div class="post-grid-wrapper">
            <div id="grid-portal" class="cartoon-grid">Fetching gallery...</div>
        </div>
    `;

    const getProxy = (url) => url ? "https://images.weserv.nl/?url=" + encodeURIComponent(url.replace(/https?:\/\//, "")) : "";

    // Multi-function: Fetch and display ALL images with specific dimensions
    window.sbDisplayFixedGallery = function(json) {
        const entries = json.feed.entry || [];
        const targetSlug = "crimenews.html"; 
        
        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href;
            return link.includes(targetSlug);
        });

        const portal = document.getElementById('grid-portal');

        if (!targetPost || !targetPost.content) {
            portal.innerHTML = "Post not found or has no images.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = targetPost.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        if (imgs.length === 0) {
            portal.innerHTML = "No images detected in content.";
            return;
        }

        let gridHtml = '';
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            // Get High Resolution Link
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
            
            // We apply 1111x1360 resizing via the proxy for faster loading and consistency
            const sizedPhoto = `https://images.weserv.nl/?url=${encodeURIComponent(highRes.replace(/https?:\/\//, ""))}&w=1111&h=1360&fit=cover`;

            gridHtml += `
                <div class="grid-item">
                    <a href="${highRes}" target="_blank" title="View Original Size">
                        <img src="${sizedPhoto}" loading="lazy" alt="Gallery Item">
                    </a>
                </div>`;
        }
        
        portal.innerHTML = gridHtml; 
    };

    // Initialize API Sync
    const sbSync = () => {
        const s = document.createElement('script');
        s.src = `https://adsneelamb.blogspot.com/feeds/posts/default?alt=json-in-script&callback=sbDisplayFixedGallery&max-results=150`;
        document.body.appendChild(s);
    };

    sbSync();
})();
