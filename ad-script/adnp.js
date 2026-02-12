(function() {
    const styleId = 'ad-grid-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .ad-wrapper { width: 100%; margin: 20px auto; font-family: sans-serif; }
            .ad-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; position: relative; }
            .ad-item { 
                width: 100%; 
                border: 1px solid #ddd; 
                border-radius: 4px; 
                overflow: hidden; 
                background: #fff; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: relative; /* Badge राख्नका लागि आवश्यक */
            }
            .ad-item img { width: 100%; height: 100%; object-fit: fill; display: block; cursor: pointer; }
            
            /* adnp Badge Style */
            .ad-badge {
                position: absolute;
                bottom: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.8);
                color: #555;
                font-size: 10px;
                padding: 2px 6px;
                text-decoration: none;
                border-top-left-radius: 4px;
                z-index: 10;
                font-weight: bold;
                border-left: 1px solid #ddd;
                border-top: 1px solid #ddd;
                transition: 0.3s;
            }
            .ad-badge:hover {
                background: #fff;
                color: #000;
            }
        `;
        document.head.appendChild(style);
    }

    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        const imgW = config.width || 970;
        const imgH = config.height || 200;
        const globalLink = config.link || '';
        const postId = (config.postId || "blog-post_54").toLowerCase();

        mainContainer.innerHTML = `<div class="ad-grid-container" id="portal-${targetId}" style="max-width:${imgW}px; margin:auto;">Loading ad...</div>`;

        const callbackName = 'callback_' + targetId.replace(/-/g, '_');

        window[callbackName] = function(json) {
            const portal = document.getElementById('portal-' + targetId);
            if (!json.feed || !json.feed.entry) return;

            const targetPost = json.feed.entry.find(e => {
                const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
                return link.includes(postId);
            });

            if (!targetPost) { portal.innerHTML = "Post not found."; return; }

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = targetPost.content.$t;
            const imgs = tempDiv.getElementsByTagName('img');

            let gridHtml = '';
            for (let i = 0; i < imgs.length; i++) {
                let src = imgs[i].src;
                let altVal = imgs[i].alt || '';
                let customUrl = altVal.startsWith('http') ? altVal : (globalLink || src);
                let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
                let proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(highRes.replace(/https?:\/\//, ""))}&w=${imgW}&h=${imgH}&fit=fill`;

                gridHtml += `
                    <div class="ad-item" style="aspect-ratio: ${imgW}/${imgH};">
                        <a href="${customUrl}" target="_blank">
                            <img src="${proxyUrl}" loading="lazy">
                        </a>
                        <a href="https://ad.nnelamb.com" target="_blank" class="ad-badge">adnp</a>
                    </div>`;
            }
            portal.innerHTML = gridHtml;
        };

        let domain = (config.blogUrl || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/$/, '');
        const s = document.createElement('script');
        s.src = `https://${domain}/feeds/posts/default?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(s);
    };
})();
