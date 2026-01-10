/* NeelamB Multi-Engine v2.6 - Fix for Blogger & Auto-play */
(function() {
    const adConfig = {
        type: 'youtube', 
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // यहाँ आफ्नो लिङ्क राख्नुहोस्
        target: 'https://ad.neelamb.com', 
        waitTime: 7, 
        id: 'nl_fix_999'
    };

    // १. युट्युब API लोड गर्ने (सही तरिका)
    if (!window.YT) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const getID = (url) => {
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const runAdEngine = () => {
        if (document.getElementById('nl-ov')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-bx { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; }
            #nl-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; }
            #nl-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 7px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-ov';
        overlay.innerHTML = `
            <div id="nl-bx">
                <div id="nl-tm">Skip: <span id="nl-s">${adConfig.waitTime}</span>s</div>
                <button id="nl-cl" onclick="document.getElementById('nl-ov').remove()">CLOSE ✖</button>
                <div style="position:relative;padding-bottom:56.25%;height:0;">
                    <div id="nl-yt-player"></div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        // २. प्लेयर सेटिङ र अटो-क्लोज
        new YT.Player('nl-yt-player', {
            videoId: getID(adConfig.source),
            playerVars: { 'autoplay': 1, 'mute': 0, 'controls': 1, 'origin': window.location.origin },
            events: {
                'onReady': function(e) { e.target.playVideo(); },
                'onStateChange': function(e) {
                    if (e.data === YT.PlayerState.ENDED) { document.getElementById('nl-ov').remove(); }
                }
            }
        });

        // ३. टाइमर लजिक
        let sec = adConfig.waitTime;
        const countdown = setInterval(() => {
            sec--;
            if(document.getElementById('nl-s')) document.getElementById('nl-s').innerText = sec;
            if (sec <= 0) {
                clearInterval(countdown);
                if(document.getElementById('nl-tm')) document.getElementById('nl-tm').style.display = 'none';
                if(document.getElementById('nl-cl')) document.getElementById('nl-cl').style.display = 'block';
            }
        }, 1000);
    };

    // ४. अटो-प्ले ग्यारेन्टी: पेजमा जुनसुकै ठाउँमा पहिलो टच/क्लिक गर्दा विज्ञापन खुल्ने
    // यो मोबाइल र डेस्कटप दुवैमा काम गर्ने सबैभन्दा भरपर्दो तरिका हो।
    ['click', 'touchstart'].forEach(evt => 
        document.addEventListener(evt, runAdEngine, { once: true })
    );

})();
