(function() {
    /**
     * १. HTML बाट कन्फिगरेसन तान्ने (Multi-function Logic)
     * यसले 'my-news-container' आईडी भएको डिआइभी खोज्छ र त्यहाँका डाटा तान्छ।
     */
    const targetDiv = document.querySelector('[data-label]'); 
    if (!targetDiv) return; // यदि डिआइभी भेटिएन भने रोकिन्छ

    const CONFIG = {
        id: targetDiv.id || 'newspaper-layout-dynamic',
        label: targetDiv.getAttribute('data-label') || 'Article',
        margin: targetDiv.getAttribute('data-margin') || '50px',
        imgHeight: targetDiv.getAttribute('data-img-height') || '290px'
    };

    // २. CSS इन्जेक्सन
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800;900&display=swap');
        .news-paper-box { 
            max-width: 1200px; 
            margin: ${CONFIG.margin} auto 20px auto; 
            padding: 10px 20px 20px 20px; 
            background: #fff; 
            border: 1px solid #ddd; 
            font-family: 'Mukta', sans-serif; 
            color: #000; 
        }
        .news-headline { font-weight: 900; font-size: 70px; text-align: center; border-bottom: 2px solid #000; margin: 0 0 15px 0; padding: 0 0 2px 0; line-height: 1.0; letter-spacing: -1px; }
        .columns-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .column-part { font-size: 16px; line-height: 1.5em; overflow: hidden; text-align: justify; }
        .col-1 { height: calc(1.5em * 14.5); border-right: 1px solid #eee; padding-right: 10px; }
        .col-4 { height: calc(1.5em * 14.5); }
        .col-mid-text { height: calc(1.5em * 2); margin-top: 10px; }
        
        .top-image-container { grid-column: 2 / 4; height: ${CONFIG.imgHeight}; overflow: hidden; border: 1px solid #eee; margin-bottom: 5px; }
        .top-image-container img { width: 100%; height: 100%; object-fit: cover; }
        
        .read-more-btn { display: block; height: 1.5em; line-height: 1.5em; color: #ce0000; text-decoration: none; font-weight: 800; border-top: 1px dashed #ccc; text-align: right; }
        
        @media (max-width: 800px) {
            .news-paper-box { margin-top: 20px; padding: 15px; border: none; }
            .news-headline { font-size: 32px; line-height: 1.2; text-align: left; border: none; margin-bottom: 10px; order: 1; }
            .columns-container { display: flex; flex-direction: column; }
            .col-1, .mid-text-wrap { display: none !important; }
            .mobile-media-group { order: 2; width: 100% !important; margin-bottom: 10px; }
            .top-image-container { width: 100%; height: 220px; border-radius: 5px; }
            .col-4-wrap { order: 3; display: flex; flex-direction: column; }
            .column-part.col-4 { 
                height: auto !important; 
                display: -webkit-box;
                -webkit-line-clamp: 4; 
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 17px;
                margin-bottom: 8px;
            }
            .read-more-btn { text-align: left; border: none; font-size: 17px; color: #0056b3; }
        }
    `;
    document.head.appendChild(style);

    // ३. Multi-function Utility Helpers
    const utils = {
        clean: (h) => {
            let d = document.createElement("div");
            d.innerHTML = h;
            return (d.textContent || d.innerText || "").replace(/^\w+, \d+ \w+\s।\s*/, "").trim();
        },
        img: (t) => t ? t.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600',
        cut: (txt, s, e) => txt.substring(s, e)
    };

    // ४. डाटा रेन्डर फङ्सन
    window.renderLayout = function(json) {
        if (!json.feed.entry) {
            document.getElementById(CONFIG.id).innerHTML = 'लेख फेला परेन।';
            return;
        }
        
        const entry = json.feed.entry[0];
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = utils.img(entry.media$thumbnail);
        const fullText = utils.clean(entry.content ? entry.content.$t : entry.summary.$t);

        document.getElementById(CONFIG.id).innerHTML = `
            <div class="news-paper-box">
                <h1 class="news-headline">${title}</h1>
                <div class="columns-container">
                    <div class="column-part col-1">${utils.cut(fullText, 0, 600)}</div>
                    <div style="grid-column: span 2;" class="mobile-media-group">
                        <div class="top-image-container"><img src="${imgUrl}" alt="News"></div>
                        <div class="mid-text-wrap" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="column-part col-mid-text">${utils.cut(fullText, 600, 680)}</div>
                            <div class="column-part col-mid-text">${utils.cut(fullText, 680, 760)}</div>
                        </div>
                    </div>
                    <div class="col-4-wrap">
                        <div class="column-part col-4">${utils.cut(fullText, 760, 1500)}...</div>
                        <a href="${link}" class="read-more-btn">थप पढ्नुहोस् ➔</a>
                    </div>
                </div>
            </div>`;
    };

    // ५. फिड कल (HTML बाट आएको लेबल प्रयोग गरेर)
    const script = document.createElement('script');
    script.src = `/feeds/posts/default/-/${CONFIG.label}?alt=json-in-script&callback=renderLayout&max-results=1`;
    document.body.appendChild(script);
})();
