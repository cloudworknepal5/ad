/* * NeelamB HTML5 Multi-Ad Engine v3.0
 * Supported Formats: HTML5, Image, Video, YouTube
 */

(function() {
    const adConfig = {
        type: 'youtube', // विकल्पहरू: 'image', 'video', 'youtube', 'html5'
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // विज्ञापनको लिंक
        target: 'https://ad.neelamb.com', // क्लिक गर्दा जाने साइट
        waitTime: 7, // स्किप टाइमर (सेकेन्ड)
        id: 'nl_html5_v3'
    };

    // YouTube API Load
    if (adConfig.type === 'youtube' && !window.YT) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    const getYTID = (url) => {
        let m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (m && m[2].length === 11) ? m[2] : null;
    };

    const startAdEngine = () => {
        if (document.getElementById('html5-ad-overlay')) return;

        // CSS Design for Premium Look
        const style = document.createElement('style');
        style.innerHTML = `
            #html5-ad-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999999; display: flex; justify-content: center; align-items: center; font-family: sans-serif; }
            #ad-wrapper { width: 95%; max-width: 720px; background: #000; border-radius: 10px; overflow: hidden; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            #ad-timer { position: absolute; top: 10px; right: 10px; background: #fff; color: #000; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; z-index: 10; }
            #ad-close { display: none; position: absolute; top: 10px; right: 10px; background: #ff4757; color: #fff; border: none; padding: 6px 15px; border-radius: 4px; cursor: pointer; z-index: 11; font-weight: bold; }
            .ad-media { width: 100%; height: auto; display: block; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'html5-ad-overlay';

        let adContent = '';

        // Multi-function Logic
        switch(adConfig.type) {
            case 'image':
                adContent = `<a href="${adConfig.target}" target="_blank"><img src="${adConfig.source}" class="ad-media"></a>`;
                break;
            case 'video':
                adContent = `<video id="html5-video" class="ad-media" autoplay muted controls><source src="${adConfig.source}" type="video/mp4"></video>`;
                break;
            case 'youtube':
                adContent = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="yt-player-v3"></div></div>`;
                break;
            case 'html5':
                adContent = `<iframe src="${adConfig.source}" style="width:100%; height:400px; border:none;"></iframe>`;
                break;
        }

        overlay.innerHTML = `
            <div id="ad-wrapper">
                <div id="ad-timer">Skip in: <span id="sec-left">${adConfig.waitTime}</span>s</div>
                <button id="ad-close" onclick="document.getElementById('html5-ad-overlay').remove()">CLOSE ✖</button>
                ${adContent}
            </div>`;
        
        document.body.appendChild(overlay);

        // Auto-Play & Auto-Close Functions
        if (adConfig.type === 'youtube') {
            new YT.Player('yt-player-v3', {
                videoId: getYTID(adConfig.source),
                playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1 },
                events: { 'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); } }
            });
        } else if (adConfig.type === 'video') {
            let v = document.getElementById('html5-video');
            v.muted = false; // आवाज खोल्ने
            v.onended = () => overlay.remove(); // भिडियो सकिएपछि आफै बन्द हुने
        }

        // Timer Logic
        let timeLeft = adConfig.waitTime;
        const countdown = setInterval(() => {
            timeLeft--;
            if(document.getElementById('sec-left')) document.getElementById('sec-left').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                document.getElementById('ad-timer').style.display = 'none';
                document.getElementById('ad-close').style.display = 'block';
            }
        }, 1000);
    };

    // User Interaction Trigger (ब्राउजरको नियम अनुसार अटो-प्लेको लागि)
    ['click', 'touchstart'].forEach(evt => document.addEventListener(evt, startAdEngine, { once: true }));

})();
