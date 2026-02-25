(function() {
    /**
     * १. कन्फिगरेसन र मल्टि-फङ्सन लजिक
     */
    const container = document.querySelector('[data-label]'); 
    if (!container) return;

    const SETTINGS = {
        id: container.id || 'newspaper-layout-dynamic',
        label: container.getAttribute('data-label') || 'Article',
        margin: container.getAttribute('data-margin') || '50px',
        imgHeight: container.getAttribute('data-img-height') || '270px'
    };

    // २. CSS इन्जेक्सन
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800;900&display=swap');
        
        .news-paper-box { 
            max-width: 1200px; 
            margin: ${SETTINGS.margin} auto 20px auto; 
            padding: 10px 20px 20px 20px; 
            background: #fff; 
            border: 1px solid #ddd; 
            font-family: 'Mukta', sans-serif; 
            color: #000; 
            overflow: hidden;
        }

        /* लिङ्क स्टाइल सुधार */
        .news-link { text-decoration: none; color: inherit; display: block; }
        .news-link:hover .news-headline { color: #ce0000; }

        .news-headline { 
            font-weight: 900; font-size: 70px; text-align: center; 
            border-bottom: 2px solid #000; margin: 0 0 15px 0; 
            padding: 0 0 2px 0; line-height: 1.0; letter-spacing: -1px; 
            transition: color 0.3s;
        }

        .columns-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .column-part { font-size: 16px; line-height: 1.5em; overflow: hidden; text-align: justify; }
        
        .col-1 { height: calc(1.5em * 14); border-right: 1px solid #eee; padding-right: 10px; }
        .col-4 { height: calc(1.5em * 13); }
        .col-mid-text { height: calc(1.5em * 2); margin-top: 10px; }
        
        .top-image-container { 
            grid-column: 2 / 4; 
            height: ${SETTINGS.imgHeight}; 
            overflow: hidden; 
            border: 1px solid #eee; 
            margin-bottom: 5px;
            transition: opacity 0.3s;
        }
        .top-image-container:hover { opacity: 0.9; }
        .top-image-container img { width: 100%; height: 100%; object-fit: cover; }
        
        .read-more-btn { 
            display: block; height: 1.5em; line-height: 1.5em; 
            color: #ce0000; text-decoration: none; font-weight: 800; 
            border-top: 1px dashed #ccc; text-align: right; 
        }
        
        @media (max-width: 800px) {
            .news-paper-box { margin-top: 20px; padding: 15px; border: none; }
            .news-headline { font-size: 32px; line-height: 1.2; text-align: left; border: none; margin-bottom: 10px; }
            .columns-container { display: flex; flex-direction: column; }
            .col-1, .mid-text-wrap { display: none !important; }
            .mobile-media-group { order: 2; width: 100% !important; margin-bottom: 10px; }
            .top-image-container { width: 100%; height: 210px; border-radius: 5px; }
            .col-4-wrap { order: 3; display: flex; flex-direction: column; }
            .mobile-snippet { 
                display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
                overflow: hidden; font-size: 17px; margin-bottom: 8px; line-height: 1.5em;
            }
            .desktop-only-col4 { display: none; }
            .read-more-btn { text-align: left; border: none; font-size: 17px; color: #0056b3; margin-top: 5px; }
        }
        
        @media (min-width: 801px) { .mobile-snippet { display: none; } }
    `;
    document.head.appendChild(style);

    /**
     * ३. सहयोगी फङ्सनहरू (Multi-function Helper)
     */
    const newsUtils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            return (tmp.textContent || tmp.innerText || "").replace(/^\w+, \d+ \w+\s।\s*/, "").trim();
        },
        fixImg: (thumb) => thumb ? thumb.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600',
        limit: (str, s, e) => str.substring(s, e),
        // नयाँ फङ्सन: एलीमेन्टलाई लिङ्कले बेर्ने
        wrapLink: (content, url) => `<a href="${url}" class="news-link">${content}</a>`
    };

    /**
     * ४. डाटा प्रोसेसिङ र रेन्डरिंग
     */
    window.renderLayout = function(json) {
        if (!json.feed.entry) {
            document.getElementById(SETTINGS.id).innerHTML = 'यो लेबलमा समाचार फेला परेन।';
            return;
        }
        
        const entry = json.feed.entry[0];
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = newsUtils.fixImg(entry.media$thumbnail);
        const fullContent = newsUtils.toText(entry.content ? entry.content.$t : entry.summary.$t);

        // शीर्षक र फोटोलाई लिङ्क भित्र राखिएको छ
        const linkedTitle = newsUtils.wrapLink(`<h1 class="news-headline">${title}</h1>`, link);
        const linkedImage = newsUtils.wrapLink(`<div class="top-image-container"><img src="${imgUrl}" alt="Featured News"></div>`, link);

        document.getElementById(SETTINGS.id).innerHTML = `
            <div class="news-paper-box">
                ${linkedTitle}
                <div class="columns-container">
                    
                    <div class="column-part col-1">${newsUtils.limit(fullContent, 0, 600)}</div>
                    
                    <div style="grid-column: span 2;" class="mobile-media-group">
                        ${linkedImage}
                        <div class="mid-text-wrap" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="column-part col-mid-text">${newsUtils.limit(fullContent, 600, 680)}</div>
                            <div class="column-part col-mid-text">${newsUtils.limit(fullContent, 680, 760)}</div>
                        </div>
                    </div>
                    
                    <div class="col-4-wrap">
                        <div class="mobile-snippet">${newsUtils.limit(fullContent, 0, 350)}...</div>
                        <div class="column-part col-4 desktop-only-col4">${newsUtils.limit(fullContent, 760, 1400)}...</div>
                        <a href="${link}" class="read-more-btn">थप पढ्नुहोस् ➔</a>
                    </div>
                    
                </div>
            </div>`;
    };

    // ५. फिड लिङ्क कल
    const scriptTag = document.createElement('script');
    scriptTag.src = `https://birgunj.eu.org/feeds/posts/default/-/${SETTINGS.label}?alt=json-in-script&callback=renderLayout&max-results=1`;
    document.body.appendChild(scriptTag);

})();
