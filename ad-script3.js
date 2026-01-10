/* NeelamB Ultimate Ad-Engine v3 - Fixed & Final */
(function() {
    const config = {
        type: 'youtube', // 'youtube', 'image', 'video', 'html'
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // यहाँ आफ्नो लिङ्क राख्नुहोस्
        target: 'https://ad.neelamb.com',
        waitTime: 7, 
        id: 'nl_final_v3'
    };

    // १. युट्युब API लोड गर्ने ग्यारेन्टी
    if (!window.YT) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const getID = (url) => {
        const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (m && m[2].length === 11) ? m[2] : null;
    };

    const runEngine = () => {
        if (document.getElementById('nl-v3-overlay')) return;

        // २. CSS डिजाइन इन्जेक्सन
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v3-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 9999999; display: flex; justify-content: center; align-items: center; cursor: default; }
            #nl-v3-box { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; }
            #nl-v3-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 6px 15px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 13px; }
            #nl-v3-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-v3-overlay';
        
        let mediaHtml = '';
        if (config.type === 'youtube') {
            mediaHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="nl-v3-player"></div></div>`;
        } else if (config.type === 'image') {
            mediaHtml = `<a href="${config.target}" target="_blank"><img src="${config.source}" style="width:100%; display:block;"></a>`;
        } else if (config.type === 'video') {
            mediaHtml = `<video id="nl-v3-vid" style="width:100%; display:block;" autoplay controls><source src="${config.source}" type="video/mp4"></video>`;
        }

        overlay.innerHTML = `<div id="nl-v3-box"><div id="nl-v3-tm">Skip: <span id="nl-v3-s">${config.waitTime}</span>s</div><button id="nl-v3-cl" onclick="document.getElementById('nl-v3-overlay').remove()">CLOSE ✖</button>${mediaHtml}</div>`;
        document.body.appendChild(overlay);

        // ३. प्लेयर लजिक (Auto-play & Auto-close)
        if (config.type === 'youtube' && window.YT) {
            new YT.Player('nl-v3-player', {
                videoId: getID(config.source),
                playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1 },
                events: {
                    'onReady': (e) => e.target.playVideo(),
                    'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); }
                }
            });
        } else if (config.type === 'video') {
            const v = document.getElementById('nl-v3-vid');
            v.onended = () => overlay.remove();
        }

        // ४. टाइमर लजिक
        let sec = config.waitTime;
        const timer = setInterval(() => {
            sec--;
            if(document.getElementById('nl-v3-s')) document.getElementById('nl-v3-s').innerText = sec;
            if (sec <= 0) {
                clearInterval(timer);
                document.getElementById('nl-v3-tm').style.display = 'none';
                document.getElementById('nl-v3-cl').style.display = 'block';
            }
        }, 1000);
    };

    // ५. अटो-प्ले ग्यारेन्टी: पेजमा जहाँ क्लिक गरे पनि विज्ञापन खुल्छ
    ['click', 'touchstart'].forEach(e => 
        document.addEventListener(e, runEngine, { once: true })
    );

})();
