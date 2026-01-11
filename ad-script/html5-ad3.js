/**
 * Name: NeelamB HTML5 Smart-Engine v3.8 (Fixed Size)
 * Features: Multi-function tracking, Full-frame Fix, YouTube API
 */

(function() {
    // १. कन्फिगरेसन (Config Function)
    const getConfig = () => ({
        type: 'image', 
        source: 'https://ad.neelamb.com/300x300%20copy.png', 
        target: 'https://ad.neelamb.com', 
        waitTime: 7, 
        cloudURL: 'https://script.google.com/macros/s/AKfycbz2G-aAbP8X5oHtu1fFWqMCMPB6x6Rw5dSvXAn9aOje22FQJyST5wPwNK8D0za6xOE8/exec'
    });

    const adConfig = getConfig();

    // २. युट्युब API लोड गर्ने फङ्सन
    const initYTAPI = () => {
        if (!window.YT) {
            let tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    };

    // ३. Geo-Tracking र डेटा लगिङ (Multi-function tracking)
    const logToCloud = async (action) => {
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            const geoData = await geoRes.json();
            const payload = {
                type: action,
                source: adConfig.source,
                ip: geoData.ip,
                country: geoData.country_name,
                city: geoData.city,
                timestamp: new Date().toISOString()
            };
            fetch(adConfig.cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        } catch (e) {
            fetch(adConfig.cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ type: action, source: adConfig.source }) });
        }
    };

    const getYTID = (url) => {
        let m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return (m) ? m[1] : null;
    };

    // ४. विज्ञापन देखाउने मुख्य फङ्सन (UI & Player Logic)
    const displayAd = () => {
        if (document.getElementById('nl-v3-ov')) return;

        // CSS सुधार: भिडियो काटिने समस्या हटाउन absolute positioning प्रयोग गरिएको छ
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v3-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-v3-bx { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; }
            .video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
            #nl-player-v3 { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
            #nl-v3-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; z-index: 100; font-size: 12px; }
            #nl-v3-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-v3-ov';
        overlay.innerHTML = `
            <div id="nl-v3-bx">
                <div id="nl-v3-tm">Skip in: <span id="nl-sec">${adConfig.waitTime}</span>s</div>
                <button id="nl-v3-cl" onclick="document.getElementById('nl-v3-ov').remove()">CLOSE ✖</button>
                <div class="video-wrapper"><div id="nl-player-v3"></div></div>
            </div>`;
        document.body.appendChild(overlay);
        
        logToCloud('VIEW');

        new YT.Player('nl-player-v3', {
            videoId: getYTID(adConfig.source),
            playerVars: { 'autoplay': 1, 'controls': 1, 'rel': 0 },
            events: { 'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); } }
        });

        let timeLeft = adConfig.waitTime;
        const timer = setInterval(() => {
            timeLeft--;
            if(document.getElementById('nl-sec')) document.getElementById('nl-sec').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('nl-v3-tm').style.display = 'none';
                document.getElementById('nl-v3-cl').style.display = 'block';
            }
        }, 1000);
    };

    // ५. इनिसियलाइजेसन (Multi-event handling)
    initYTAPI();
    ['click', 'touchstart'].forEach(evt => document.addEventListener(evt, displayAd, { once: true }));
})();
