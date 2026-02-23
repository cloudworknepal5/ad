(function() {
    // १. कन्टेनर आफैँ सिर्जना गर्ने (जहाँ स्क्रिप्ट राखिन्छ त्यहीँ समाचार देखिन्छ)
    const currentScript = document.currentScript;
    const container = document.createElement('div');
    container.id = 'newspaper-layout-dynamic';
    container.innerHTML = '<p style="text-align:center;">समाचार लोड हुँदैछ...</p>';
    currentScript.parentNode.insertBefore(container, currentScript);

    // २. CSS इन्जेक्सन (Multi-function design)
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800;900&display=swap');
        .news-paper-box { max-width: 1200px; margin: 10px auto; padding: 10px 20px 20px 20px; background: #fff; border: 1px solid #ddd; font-family: 'Mukta', sans-serif; color: #000; }
        .news-headline { font-weight: 900; font-size: 70px; text-align: center; border-bottom: 2px solid #000; margin: 0 0 15px 0; padding: 0 0 2px 0; line-height: 1.0; letter-spacing: -1px; }
        .columns-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .column-part { font-size: 16px; line-height: 1.5em; overflow: hidden; text-align: justify; }
        .col-1 { height: calc(1.5em * 14); border-right: 1px solid #eee; padding-right: 10px; }
        .col-4 { height: calc(1.5em * 13); }
        .col-mid-text { height: calc(1.5em * 2); margin-top: 10px; }
        .top-image-container { grid-column: 2 / 4; height: calc(1.5em * 11.5); overflow: hidden; border: 1px solid #eee; margin-bottom: 5px; }
        .top-image-container img { width: 100%; height: 100%; object-fit: cover; }
        .read-more-btn { display: block; height: 1.5em; line-height: 1.5em; color: #ce0000; text-decoration: none; font-weight: 800; border-top: 1px dashed #ccc; text-align: right; }
        
        @media (max-width: 800px) {
            .news-paper-box { padding: 10px; margin: 5px; }
            .news-headline { font-size: 42px; line-height: 1.1; margin-bottom: 10px; }
            .columns-container { grid-template-columns: 1fr; gap: 15px; }
            .column-part { height: auto !important; border: none !important; padding: 0 !important; font-size: 17px; }
            .top-image-container { grid-column: span 1; height: 250px; order: -1; }
            .read-more-btn { text-align: center; background: #f9f9f9; margin-top: 10px; padding: 5px; }
            .mid-text-wrap { grid-template-columns: 1fr !important; }
        }
    `;
    document.head.appendChild(style);

    // ३. डाटा प्रोसेसिङ फङ्सन
    window.loadResponsiveLayout = function(json) {
        if (!json.feed.entry) return;
        let entry = json.feed.entry[0];
        let title = entry.title.$t;
        let link = entry.link.find(l => l.rel === 'alternate').href;
        let imgUrl = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600';
        
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = entry.content ? entry.content.$t : entry.summary.$t;
        let fullText = (tempDiv.textContent || tempDiv.innerText || "").replace(/^\w+, \d+ \w+\s।\s*/, "").trim();

        let col1Text = fullText.substring(0, 600);
        let col2Text = fullText.substring(600, 680); 
        let col3Text = fullText.substring(680, 760); 
        let col4Text = fullText.substring(760, 1300);

        document.getElementById('newspaper-layout-dynamic').innerHTML = `
            <div class="news-paper-box">
                <h1 class="news-headline">${title}</h1>
                <div class="columns-container">
                    <div class="column-part col-1">${col1Text}</div>
                    <div style="grid-column: span 2;" class="mobile-media-group">
                        <div class="top-image-container"><img src="${imgUrl}" alt="News Image"></div>
                        <div class="mid-text-wrap" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="column-part col-mid-text">${col2Text}</div>
                            <div class="column-part col-mid-text">${col3Text}</div>
                        </div>
                    </div>
                    <div>
                        <div class="column-part col-4">${col4Text}...</div>
                        <a href="${link}" class="read-more-btn">थप पढ्नुहोस् ➔</a>
                    </div>
                </div>
            </div>
        `;
    };

    // ४. फिड कल गर्ने (Blogger Feed API)
    const script = document.createElement('script');
    script.src = "https://birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=loadResponsiveLayout&max-results=1";
    document.body.appendChild(script);
})();
