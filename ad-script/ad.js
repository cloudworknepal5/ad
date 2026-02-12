(function() {
    const styleId = 'ad-grid-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .ad-wrapper { width: 100%; margin: 20px auto; font-family: sans-serif; }
            .ad-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; }
            .ad-item { 
                width: 100%; 
                border: 1px solid #ddd; 
                border-radius: 4px; 
                overflow: hidden; 
                background: #fff; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .ad-item img { width: 100%; height: 100%; object-fit: fill; display: block; cursor: pointer; }
        `;
        document.head.appendChild(style);
    }

    // मुख्य फङ्सन जसले प्रत्येक विज्ञापनलाई छुट्टाछुट्टै ह्यान्डल गर्छ
    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        const imgW = config.width || 970;
        const imgH = config.height || 200;
        const globalLink = config.link || '';
        const postId = (config.postId || "blog-post_54").toLowerCase();

        mainContainer.innerHTML = `<div class="ad-grid-container" id="portal-${targetId}" style="max-width:${imgW}px; margin:auto;">Loading...</div>`;

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
