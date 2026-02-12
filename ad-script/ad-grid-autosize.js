(function() {
    // १. कन्फिगरेसन र साइज सेटिङ
    const config = window.AdGridConfig || {};
    const imgW = config.width || 970;  // तपाईंको उदाहरण अनुसार ९७०
    const imgH = config.height || 200; // तपाईंको उदाहरण अनुसार २००
    const globalLink = config.link || '';

    const style = document.createElement('style');
    style.innerHTML = `
        .ad-wrapper { 
            width: 100%; 
            max-width: ${imgW}px; /* डेस्कटपमा तोकिएको साइज भन्दा ठूलो नहुने */
            margin: 20px auto; 
            font-family: sans-serif;
        }
        .ad-grid-auto { 
            display: flex; 
            flex-direction: column; 
            gap: 20px; 
            width: 100%;
        }
        .ad-item { 
            width: 100%; /* मोबाइलमा स्क्रिन अनुसार घट्ने */
            aspect-ratio: ${imgW} / ${imgH}; /* तोकिएको अनुपात कायम राख्ने */
            border: 1px solid #ddd; 
            border-radius: 4px; 
            overflow: hidden; 
            background: #fff; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
        }
        .ad-item img { 
            width: 100%; 
            height: 100%; 
            object-fit: fill; /* पूरा इमेज देखाउन (Stretch/Shrink to fit) */
            display: block; 
            cursor: pointer; 
        }
        
        /* मोबाइलका लागि विशेष सुधार */
        @media (max-width: 768px) {
            .ad-wrapper { padding: 0 10px; box-sizing: border-box; }
        }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('ad-grid-auto');
    if (!mainContainer) return;

    mainContainer.className = 'ad-wrapper';
    mainContainer.innerHTML = `<div id="ad-portal" class="ad-grid-auto">Loading responsive ad...</div>`;

    const getSizedUrl = (url) => {
        if(!url) return "";
        let cleanUrl = url.replace(/https?:\/\//, "");
        // प्रोक्सीमा हामी ओरिजिनल साइज नै पठाउँछौं, CSS ले यसलाई मोबाइलमा खुम्च्याउँछ
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${imgW}&h=${imgH}&fit=fill`;
    };

    window.sbProcessAds = function(json) {
        const portal = document.getElementById('ad-portal');
        if (!json.feed || !json.feed.entry) {
            portal.innerHTML = "No images found.";
            return;
        }

        const entries = json.feed.entry;
        const targetSlug = (config.postId || "blog-post_54").toLowerCase();

        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
            return link.includes(targetSlug);
        });

        if (!targetPost) {
            portal.innerHTML = "Post not found.";
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
