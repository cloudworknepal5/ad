/**
 * NeelamB Ultimate Ad-Engine v3
 * Developed for: ad.neelamb.com
 * Function: Multi-format (YouTube, Video, Image, HTML)
 * Features: Auto-Play, Auto-Close, Sound-On, Analytics
 */

(function() {
    // --- कन्फिगरेसन: यहाँ मात्र परिवर्तन गर्नुहोस् ---
    const adConfig = {
        type: 'youtube', // विकल्प: 'youtube', 'image', 'video', 'html'
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // फाइल वा युट्युब लिंक
        target: 'https://ad.neelamb.com', // विज्ञापन क्लिक गर्दा जाने वेबसाइट
        waitTime: 7, // स्किप बटन आउने समय (सेकेन्ड)
        id: 'nl_engine_v3'
    };

    // १. यूट्यूब API र ID डिटेक्सन
    if (adConfig.type === 'youtube' && !window.YT) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    const getYTID = (url) => {
        let match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // २. एनालिटिक्स डेटा (LocalStorage)
    let stats = JSON.parse(localStorage.getItem(adConfig.id)) || { v: 0, c: 0 };
    const trackClick = () => {
        stats.c++;
        localStorage.setItem(adConfig.id, JSON.stringify(stats));
    };

    // ३. विज्ञापन इन्जिन सुरु गर्ने मुख्य फङ्सन
    const launchAd = () => {
        if (document.getElementById('nl-v3-overlay')) return;

        // UI डिजाइन (CSS)
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v3-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-v3-box { width: 95%; max-width: 750px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
            #nl-v3-timer { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 6px 15px; border-radius: 25px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 13px; }
            #nl-v3-close { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
            #nl-v3-footer { background: #111; padding: 8px 15px; color: #666; font-size: 11px; display: flex; justify-content: space-between; border-top: 1px solid #222; font-family: sans-serif; }
            .nl-v3-res { width: 100%; display: block; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-v3-overlay';
        
        let mediaHtml = '';

        // Multi-function Logic: फाइल अनुसारको प्लेयर छान्ने
        if (adConfig.type === 'youtube') {
            mediaHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="nl-v3-player"></div></div>`;
        } else if (adConfig.type === 'image') {
            mediaHtml = `<a href="${adConfig.target}" target="_blank" onclick="window.nlV3Click()"><img src="${adConfig.source}" class="nl-v3-res"></a>`;
        } else if (adConfig.type === 'video') {
            mediaHtml = `<video id="nl-v3-mp4" class="nl-v3-res" autoplay muted controls onplay="window.nlV3Click()"><source src="${adConfig.source}" type="video/mp4"></video>`;
        } else if (adConfig.type === 'html') {
            mediaHtml = `<iframe src="${adConfig.source}" style="width:100%; height:450px; border:none;"></iframe>`;
        }

        overlay.innerHTML = `
            <div id="nl-v3-box">
                <div id="nl-v3-timer">Wait: <span id="nl-v3-sec">${adConfig.waitTime}</span>s</div>
                <button id="nl-v3-close" onclick="document.getElementById('nl-v3-overlay').remove()">CLOSE ✖</button>
                ${mediaHtml}
                <div id="nl-v3-footer">
                    <span>Engine v3.0 | NeelamB</span>
                    <span>Views: ${++stats.v} | Clicks: ${stats.c}</span>
                </div>
            </div>`;
        
        document.body.appendChild(overlay);
        localStorage.setItem(adConfig.id, JSON.stringify(stats));

        // Auto-Play र Auto-Close नियन्त्रण
        if (adConfig.type === 'youtube') {
            new YT.Player('nl-v3-player', {
                videoId: getYTID(adConfig.source),
                playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1 },
                events: { 'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); } }
            });
        } else if (adConfig.type === 'video') {
            const v = document.getElementById('nl-v3-mp4');
            v.muted = false; // साउन्ड अन गर्ने
            v.onended = () => overlay.remove();
        }

        // टाइमर चलाउने
        let sec = adConfig.waitTime;
        const countdown = setInterval(() => {
            sec--;
            if(document.getElementById('nl-v3-sec')) document.getElementById('nl-v3-sec').innerText = sec;
            if (sec <= 0) {
                clearInterval(countdown);
                document.getElementById('nl-v3-timer').style.display = 'none';
                document.getElementById('nl-v3-close').style.display = 'block';
            }
        }, 1000);
    };

    // ब्राउजरको Autoplay नियम अनुसार: कतै टच गर्ने बित्तिकै विज्ञापन खुल्छ
    window.nlV3Click = trackClick;
    ['mousedown', 'touchstart'].forEach(e => document.addEventListener(e, launchAd, { once: true }));
})();
