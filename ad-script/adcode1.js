/**
 * Name: NeelamB HTML5 Ad-Engine v4.6 (City + Country Tracking)
 * Features: City Tracking, Country Tracking, Anti-Hide Ads, Multi-function
 */

(function() {
    const styleId = 'ad-grid-style-final-v2';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .ad-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; position: relative; }
            .ad-item { 
                width: 100%; border: 1px solid #ddd; border-radius: 8px; 
                overflow: hidden; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                position: relative;
            }
            .ad-item img { width: 100%; height: 100%; object-fit: fill; display: block; cursor: pointer; }
            .ad-badge {
                position: absolute; bottom: 0; right: 0;
                background: rgba(255, 255, 255, 0.85); color: #333;
                font-size: 10px; padding: 3px 8px; text-decoration: none;
                border-top-left-radius: 6px; z-index: 10; font-weight: bold;
                border-left: 1px solid #ddd; border-top: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }

    // १. शहर र देश पत्ता लगाउने फङ्सन (Improved Geo-Location)
    const getGeoData = async () => {
        try {
            // यो सेवाले City, Country र IP तीनै थोक दिन्छ
            const res = await fetch('http://ip-api.com/json/?fields=status,country,city,query');
            const data = await res.json();
            
            if (data.status === 'success') {
                return { 
                    ip: data.query, 
                    country: data.country, 
                    city: data.city 
                };
            }
        } catch (e) {
            // यदि HTTP ब्लक भयो भने अर्को विकल्प (ipwho.is)
            try {
                const res2 = await fetch('https://ipwho.is/');
                const data2 = await res2.json();
                return { ip: data2.ip, country: data2.country, city: data2.city };
            } catch (e2) {}
        }
        return { ip: "Unknown", country: "Unknown", city: "Unknown" };
    };

    // २. क्लाउड लगिङ (Multi-function Tracking)
    const trackAdAction = async (actionType, adInfo) => {
        const cloudURL = 'https://script.google.com/macros/s/AKfycbz2G-aAbP8X5oHtu1fFWqMCMPB6x6Rw5dSvXAn9aOje22FQJyST5wPwNK8D0za6xOE8/exec';
        const geo = await getGeoData();

        const payload = {
            event: actionType,
            adId: adInfo.id,
            imageUrl: adInfo.src,
            targetUrl: adInfo.link,
            ip: geo.ip,
            country: geo.country,
            city: geo.city, // अब शहरको नाम पनि जान्छ
            platform: navigator.platform,
            timestamp: new Date().toISOString()
        };

        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    // ३. मुख्य विज्ञापन इन्जिन
    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        mainContainer.style.display = 'none';

        const imgW = config.width || 970;
        const imgH = config.height || 200;
        const globalLink = config.link || '';
        const identifier = (config.postId || config.pageId || "").toLowerCase();
        const feedType = config.isPage ? 'pages' : 'posts';
        const callbackName = 'callback_' + targetId.replace(/-/g, '_');

        window[callbackName] = function(json) {
            if (!json.feed || !json.feed.entry) return;

            const targetEntry = json.feed.entry.find(e => {
                const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
                return link.includes(identifier);
            });

            if (!targetEntry) return;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = targetEntry.content.$t;
            const imgs = tempDiv.getElementsByTagName('img');

            if (imgs.length === 0) return;

            mainContainer.style.display = 'block';
            let gridHtml = `<div class="ad-grid-container" id="portal-${targetId}" style="max-width:${imgW}px; margin:auto;">`;
            
            for (let i = 0; i < imgs.length; i++) {
                let src = imgs[i].src;
                let altVal = imgs[i].alt || '';
                let customUrl = altVal.startsWith('http') ? altVal : (globalLink || src);
                let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
                let proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(highRes.replace(/https?:\/\//, ""))}&w=${imgW}&h=${imgH}&fit=fill`;

                trackAdAction('VIEW', { id: identifier, src: highRes, link: customUrl });

                gridHtml += `
                    <div class="ad-item" style="aspect-ratio: ${imgW}/${imgH};">
                        <a href="${customUrl}" target="_blank" class="nl-ad-link" data-src="${highRes}" data-link="${customUrl}">
                            <img src="${proxyUrl}" loading="lazy" alt="Promotion">
                        </a>
                        <a href="https://neelamb.com" target="_blank" class="ad-badge">adnp</a>
                    </div>`;
            }
            gridHtml += `</div>`;
            mainContainer.innerHTML = gridHtml;

            mainContainer.querySelectorAll('.nl-ad-link').forEach(link => {
                link.addEventListener('click', function() {
                    trackAdAction('CLICK', { 
                        id: identifier, 
                        src: this.getAttribute('data-src'), 
                        link: this.getAttribute('data-link') 
                    });
                });
            });
        };

        const s = document.createElement('script');
        s.src = `https://www.birgunj.eu.org/feeds/${feedType}/default?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(s);
    };
})();
