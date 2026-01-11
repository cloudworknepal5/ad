/**
 * Name: NeelamB HTML5 Smart-Engine v3.8 (Geo-Tracking)
 * File: html5-ad3.js
 * Features: YouTube, Auto-Play, Auto-Close, Country/City/IP Tracking
 */

(function() {
    const adConfig = {
        type: 'youtube', 
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', 
        target: 'https://ad.neelamb.com', 
        waitTime: 7, 
        cloudURL: 'https://script.google.com/macros/s/AKfycbz2G-aAbP8X5oHtu1fFWqMCMPB6x6Rw5dSvXAn9aOje22FQJyST5wPwNK8D0za6xOE8/exec'
    };

    // १. युट्युब API लोड
    if (adConfig.type === 'youtube' && !window.YT) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    // २. Geo-Location र IP तान्ने फङ्सन
    const logToCloud = async (action) => {
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            const geoData = await geoRes.json();

            const dataToSend = {
                type: action,
                source: adConfig.source,
                ip: geoData.ip,
                country: geoData.country_name,
                city: geoData.city,
                timestamp: new Date().toISOString()
            };

            fetch(adConfig.cloudURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(dataToSend)
            });
        } catch (e) {
            console.log("Geo-Tracking Error, sending basic data.");
            // यदि API फेल भयो भने आधारभूत डेटा पठाउने
            fetch(adConfig.cloudURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ type: action, source: adConfig.source })
            });
        }
    };

    const getYTID = (url) => {
        let m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return (m) ? m[1] : null;
    };

    const runAd = () => {
        if (document.getElementById('nl-v3-ov')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v3-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-v3-bx { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; }
            #nl-v3-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 12px; }
            #nl-v3-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-v3-ov';
        
        let media = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="nl-player-v3"></div></div>`;
        overlay.innerHTML = `<div id="nl-v3-bx"><div id="nl-v3-tm">Skip: <span id="nl-sec">${adConfig.waitTime}</span>s</div><button id="nl-v3-cl" onclick="document.getElementById('nl-v3-ov').remove()">CLOSE ✖</button>${media}</div>`;
        document.body.appendChild(overlay);
        
        logToCloud('VIEW'); // Views विथ Geo-Location

        new YT.Player('nl-player-v3', {
            videoId: getYTID(adConfig.source),
            playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1 },
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

    ['click', 'touchstart'].forEach(evt => document.addEventListener(evt, runAd, { once: true }));
})();
