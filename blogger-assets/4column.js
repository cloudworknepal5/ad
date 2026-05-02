/**
 * File: mag-balanced-newspaper.js
 * Features: 4-Column Balanced Layout, Headline 70px, Text-Splitting Fix
 */
(function() {
    // १. CSS र फन्ट इन्जेक्सन
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;900&display=swap');
        
        .mag-fixed-wrapper {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            font-family: 'Mukta', sans-serif;
            color: #000;
        }

        .mag-top-label-wrap { text-align: center; margin-bottom: 15px; }
        .mag-top-label {
            background: #000; color: #fff;
            padding: 5px 20px; font-size: 14px;
            font-weight: 700; border-radius: 50px;
            display: inline-block; text-transform: uppercase;
        }

        .mag-final-title {
            text-align: center;
            font-size: clamp(32px, 8vw, 70px);
            font-weight: 900;
            line-height: 1.1;
            margin: 0 0 30px 0;
            letter-spacing: -1px;
        }
        .mag-final-title a { color: #000; text-decoration: none; transition: 0.3s; }
        .mag-final-title a:hover { color: #bc1d22; }

        /* ४ कोलम ग्रिड सेटअप */
        .mag-grid-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 25px;
            text-align: justify;
            line-height: 1.6;
            font-size: 18px;
        }

        .mag-col { border-right: 1px solid #ddd; padding-right: 15px; }
        .mag-col:last-child { border-right: none; padding-right: 0; }

        .mag-img-box {
            grid-column: span 2; /* इमेजलाई २ कोलम बराबरको ठाउँ दिने */
            margin-bottom: 10px;
        }
        .mag-img-box img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border: 1px solid #000;
            padding: 3px;
        }

        .mag-bold-start {
            font-weight: 900;
            font-size: 22px;
            color: #bc1d22;
        }

        @media (max-width: 900px) {
            .mag-grid-container { grid-template-columns: repeat(2, 1fr); }
            .mag-img-box { grid-column: span 2; }
            .mag-col:nth-child(2n) { border-right: none; }
        }
        
        @media (max-width: 600px) {
            .mag-grid-container { grid-template-columns: 1fr; }
            .mag-img-box { grid-column: span 1; }
            .mag-col { border-right: none; padding-right: 0; }
        }
    `;
    document.head.appendChild(style);

    // २. सहयोगी फङ्सनहरू
    const utils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            return (tmp.textContent || tmp.innerText || "").trim().replace(/\s+/g, ' ');
        },
        fixImg: (thumb) => thumb ? thumb.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600'
    };

    // ३. मुख्य रेन्डर फङ्सन
    window.renderBalancedLayout = function(label, targetId) {
        var feedUrl = "/feeds/posts/default/-/" + encodeURIComponent(label) + "?alt=json&max-results=1";

        fetch(feedUrl)
        .then(res => res.json())
        .then(data => {
            var entry = data.feed.entry ? data.feed.entry[0] : null;
            if (!entry) return;

            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumb = entry.media$thumbnail ? utils.fixImg(entry.media$thumbnail) : '';
            var cleanSnippet = utils.toText(entry.content ? entry.content.$t : entry.summary.$t);

            var words = cleanSnippet.split(' ');
            var firstTwo = words.slice(0, 2).join(' ');
            
            // कोलमहरूमा डेटा बाँड्ने (बराबर देखाउन)
            var c1 = words.slice(2, 80).join(' ');
            var c2 = words.slice(80, 160).join(' ');
            var c3 = words.slice(160, 240).join(' ');
            var c4 = words.slice(240, 350).join(' ');

            var html = `
                <div class="mag-fixed-wrapper">
                    <div class="mag-top-label-wrap">
                        <span class="mag-top-label">${label}</span>
                    </div>
                    <h1 class="mag-final-title"><a href="${link}">${title}</a></h1>
                    
                    <div class="mag-grid-container">
                        ${thumb ? `
                        <div class="mag-img-box">
                            <a href="${link}"><img src="${thumb}"/></a>
                        </div>` : ''}

                        <div class="mag-col"><span class="mag-bold-start">${firstTwo}</span> — ${c1}...</div>
                        <div class="mag-col">${c2}...</div>
                        <div class="mag-col">${c3}...</div>
                        <div class="mag-col">${c4}...</div>
                    </div>

                    <div style="text-align:right; margin-top:20px; border-top:1px solid #eee; pt-10px;">
                        <a href="${link}" style="color:#bc1d22; font-weight:900; font-size:18px; text-decoration:none;">पूरा पढ्नुहोस् »</a>
                    </div>
                </div>`;
            
            document.getElementById(targetId).innerHTML = html;
        })
        .catch(e => console.error("Error:", e));
    };

    // फङ्सन कल
    window.renderBalancedLayout('Article', 'mag-article-balanced');
})();
