(function() {
    const config = window.AdGridConfig || {};
    const imgW = config.width || null;
    const imgH = config.height || null;
    const globalLink = config.link || ''; // HTML बाट आउने साझा लिङ्क

    const style = document.createElement('style');
    style.innerHTML = `
        .ad-wrapper { max-width: 100%; margin: 20px auto; font-family: sans-serif; }
        .ad-grid-auto { display: flex; flex-direction: column; gap: 20px; align-items: center; }
        .ad-item { 
            width: ${imgW ? imgW + 'px' : '100%'}; 
            max-width: 100%;
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            background: #fff; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            transition: 0.3s ease;
        }
        .ad-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .ad-item img { 
            width: 100%; 
            height: ${imgH ? imgH + 'px' : 'auto'}; 
            object-fit: ${imgH ? 'cover' : 'contain'}; 
            display: block; 
            cursor: pointer; 
        }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('ad-grid-auto');
    if (!mainContainer) return;

    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-auto">Loading dynamic content...</div>`;

    const getSizedUrl = (url) => {
        if(!url) return "";
        let cleanUrl = url.replace(/https?:\/\//, "");
        let proxy = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
        if (imgW) proxy += `&w=${imgW}`;
        if (imgH) proxy += `&h=${imgH}&fit=cover`;
        return proxy;
    };

    window.sbProcessAds = function(json) {
        const portal = document.getElementById('ad-portal');
        if (!json.feed || !json.feed.entry) {
            portal.innerHTML = "No content found.";
            return;
        }

        const entries = json.feed.entry;
        const targetSlug = (config.postId || "blog-post_54").toLowerCase();

        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
            return link.includes(targetSlug);
        });

        if (!targetPost) {
            portal.innerHTML = "Target post not found.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = targetPost.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        let gridHtml = '';
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
            
            // Priority 1: Image Alt text (for unique links)
            // Priority 2: Global Link from HTML Config
            // Priority 3: Direct High-Res Image
            let altVal = imgs[i].alt || '';
            let customUrl = altVal.startsWith('http') ? altVal : (globalLink || highRes);

            gridHtml += `
                <div class="ad-item">
                    <a href="${customUrl}" target="_blank">
                        <img src="${getSizedUrl(highRes)}" loading="lazy" alt="${altVal}">
                    </a>
                </div>`;
        }
        portal.innerHTML = gridHtml || "No images detected.";
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
