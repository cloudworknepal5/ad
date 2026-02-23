/**
 * Birgunj News Pure JS Script
 * No HTML needed in Blogger, just one <script> tag.
 */

(function() {
    // १. समाचार देखाउने ठाउँ (Container) आफैं बनाउने
    const currentScript = document.currentScript;
    const containerId = 'newspaper-layout-auto';
    const container = document.createElement('div');
    container.id = containerId;
    container.innerHTML = 'समाचार लोड हुँदैछ...';
    currentScript.parentNode.insertBefore(container, currentScript);

    // २. CSS Injection
    const css = `
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
        #mobile-snippet-view { display: none; }
        @media (max-width: 800px) {
            .news-headline { font-size: 42px; line-height: 1.1; }
            .columns-container { display: flex; flex-direction: column; }
            .mobile-media-group { order: 1; width: 100%; }
            .top-image-container { height: auto; max-height: 300px; grid-column: span 1; }
            .column-part { display: none; }
            #mobile-snippet-view { display: block !important; order: 2; font-size: 18px; line-height: 1.6; height: auto !important; margin-bottom: 15px; }
            .read-more-btn { order: 3; text-align: center; border: 1px solid #ce0000; padding: 5px; margin-top: 10px; }
            .mid-text-wrap { display: none !important; }
        }
    `;
    const styleHead = document.createElement('style');
    styleHead.appendChild(document.createTextNode(css));
    document.head.appendChild(styleHead);

    // ३. डाटा रेन्डर गर्ने फङ्सन
    window.renderBirgunjNews = function(json) {
        if (!json.feed.entry) return;
        const entry = json.feed.entry[0];
        const title = entry.title.$t;
        const link = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/600x400';
        
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = entry.content ? entry.content.$t : entry.summary.$t;
        let fullText = (tempDiv.textContent || tempDiv.innerText || "").replace(/^\w+, \d+ \w+\s।\s*/, "").trim();

        let mobileSnippet = fullText.split(/\s+/).slice(0, 150).join(" ");
        let col1 = fullText.substring(0, 600);
        let col2 = fullText.substring(600, 680);
        let col3 = fullText.substring(680, 760);
        let col4 = fullText.substring(760, 1300);

        document.getElementById(containerId).innerHTML = `
        <div class="news-paper-box">
            <h1 class="news-headline">${title}</h1>
            <div class="columns-container">
                <div id="mobile-snippet-view" class="column-part">${mobileSnippet}...</div>
                <div class="column-part col-1">${col1}</div>
                <div class="mobile-media-group" style="grid-column: span 2;">
                    <div class="top-image-container"><img src="${imgUrl}"></div>
                    <div class="mid-text-wrap" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="column-part col-mid-text">${col2}</div>
                        <div class="column-part col-mid-text">${col3}</div>
                    </div>
                </div>
                <div>
                    <div class="column-part col-4">${col4}...</div>
                    <a href="${link}" class="read-more-btn">थप पढ्नुहोस् ➔</a>
                </div>
            </div>
        </div>`;
    };

    // ४. फिड कल गर्ने (Multi-function script)
    const script = document.createElement('script');
    script.src = "https://birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=renderBirgunjNews&max-results=1";
    document.body.appendChild(script);
})();
