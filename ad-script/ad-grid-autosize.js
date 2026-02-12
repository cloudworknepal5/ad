(function() {
    // १. कन्फिगरेसन र साइज सेटिङ
    const config = window.AdGridConfig || {};
    const imgW = config.width || 1111; // डिफल्ट ११११px
    const imgH = config.height || 600;  // डिफल्ट ६००px
    const globalLink = config.link || '';

    const style = document.createElement('style');
    style.innerHTML = `
        /* कन्टेनरलाई बाहिर जान नदिन र स्क्रोल गर्न मिल्ने बनाउन */
        .ad-wrapper { 
            width: 100%; 
            margin: 20px auto; 
            font-family: sans-serif;
            overflow-x: auto; /* मोबाइलमा साइज ठूलो भए स्क्रोल हुने */
            -webkit-overflow-scrolling: touch;
        }
        .ad-grid-auto { 
            display: flex; 
            flex-direction: column; 
            gap: 20px; 
            align-items: center;
            padding: 10px;
        }
        .ad-item { 
            /* HTML मा तोकिएको फिक्स्ड साइज */
            width: ${imgW}px; 
            height: ${imgH}px;
            flex-shrink: 0; /* मोबाइलमा नखुम्चिने (Fixed) */
            border: 1px solid #ddd; 
            border-radius: 8px; 
            overflow: hidden; 
            background: #fff; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .ad-item img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; /* तोकिएको बक्समा फोटो फिट गर्ने */
            display: block; 
            cursor: pointer; 
        }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('ad-grid-auto');
    if (!mainContainer) return;

    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-auto">Loading fixed size gallery...</div>`;

    const getSizedUrl = (url) => {
        if(!url) return "";
        let cleanUrl = url.replace(/https?:\/\//, "");
        // प्रोक्सीमा पनि फिक्स्ड विड्थ र हाइट पठाउने
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${imgW}&h=${imgH}&fit=cover`;
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
