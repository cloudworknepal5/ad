/* * Name: NeelamB HTML5 Smart-Engine v3.6 (Cloud Edition)
 * Filename: html5-ad2.js
 * Features: Multi-function, Auto-Close, Unmuted, Cloud Logs
 */


const adConfig = {
    type: 'image',
    source: 'https://ad.neelamb.com/300x300%20copy.png',
    target: 'https://ad.neelamb.com',
    waitTime: 7,
    // नयाँ थपिएको: इमेजको साइज (पिक्सेलमा)
    imgWidth: '300px', 
    imgHeight: '300px'
        // तपाईँको Google Web App URL
        cloudURL: 'https://script.google.com/macros/s/AKfycbwB_iRaRUPTLAyW1rND4kyaVxmkfW1KIB2CucqMqzZ4PKmOscxFEby3OPHeCTuLiClx/exec'
    };

    // १. युट्युब API लोड गर्ने
    if (adConfig.type === 'youtube' && !window.YT) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    // २. क्लाउडमा डेटा पठाउने फङ्सन (Views/Clicks)
    const logToCloud = (action) => {
        fetch(adConfig.cloudURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ type: action, source: adConfig.source })
        });
    };

    const getYTID = (url) => {
        let m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return (m) ? m[1] : null;
    };

    const showAd = () => {
        if (document.getElementById('nl-ad2-ov')) return;

        // ३. CSS डिजाइन
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-ad2-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-ad2-bx { width: 95%; max-width: 720px; background: #000; border-radius: 15px; overflow: hidden; position: relative; border: 1px solid #444; }
            #nl-ad2-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 6px 15px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 13px; }
            #nl-ad2-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-ad2-ov';
        
        let content = '';
        if(adConfig.type === 'youtube') {
            content = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="nl-player-v3"></div></div>`;
        } else if(adConfig.type === 'image') {
            content = `<a href="${adConfig.target}" target="_blank" onclick="window.nlLogClick()"><img src="${adConfig.source}" style="width:100%; display:block;"></a>`;
        }

        overlay.innerHTML = `<div id="nl-ad2-bx"><div id="nl-ad2-tm">Wait: <span id="nl-sec">7</span>s</div><button id="nl-ad2-cl" onclick="document.getElementById('nl-ad2-ov').remove()">CLOSE ✖</button>${content}</div>`;
        document.body.appendChild(overlay);
        
        logToCloud('VIEW'); // क्लाउडमा रेकर्ड पठाउने

        // ४. अटो-प्ले र अटो-क्लोज लजिक
        if (adConfig.type === 'youtube') {
            new YT.Player('nl-player-v3', {
                videoId: getYTID(adConfig.source),
                playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1 },
                events: { 'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); } }
            });
        }

        // ५. स्किप टाइमर
        let timeLeft = adConfig.waitTime;
        const timer = setInterval(() => {
            timeLeft--;
            if(document.getElementById('nl-sec')) document.getElementById('nl-sec').innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('nl-ad2-tm').style.display = 'none';
                document.getElementById('nl-ad2-cl').style.display = 'block';
            }
        }, 1000);
    };

    window.nlLogClick = () => logToCloud('CLICK');
    
    // ६. स्मार्ट ट्रिगर: प्रयोगकर्ताले कतै छुने बित्तिकै अटो-प्ले सुरु हुन्छ
    ['mousedown', 'touchstart'].forEach(evt => document.addEventListener(evt, showAd, { once: true }));

})();
