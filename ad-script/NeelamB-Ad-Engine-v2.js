/* NeelamB Multi-Engine v2.5 - Final Production Script */
(function() {
    const config = {
        type: 'youtube', 
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // आफ्नो युट्युब लिङ्क यहाँ राख्नुहोस्
        target: 'https://ad.neelamb.com', 
        waitTime: 7, 
        id: 'nl_final_v25'
    };

    // १. यूट्यूब API लोड गर्ने
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const getYTID = (url) => {
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const initAd = () => {
        // यदि विज्ञापन पहिले नै खुलिरहेको छ भने नखोल्ने
        if (document.getElementById('nl-ov')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2147483647; display: flex; justify-content: center; align-items: center; cursor: default; }
            #nl-bx { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 0 40px rgba(0,0,0,0.8); }
            #nl-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 6px 15px; border-radius: 30px; font-weight: bold; font-size: 13px; z-index: 100; font-family: sans-serif; }
            #nl-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; font-family: sans-serif; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-ov';
        
        const vidID = getYTID(config.source);
        overlay.innerHTML = `
            <div id="nl-bx">
                <div id="nl-tm">Skip in: <span id="nl-s">${config.waitTime}</span>s</div>
                <button id="nl-cl" onclick="document.getElementById('nl-ov').remove()">CLOSE ✖</button>
                <div id="nl-cnt">
                    <div style="position:relative;padding-bottom:56.25%;height:0;">
                        <div id="nl-player-frame"></div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);

        // २. प्लेयर सेटिङ (Auto-play र Sound On)
        new YT.Player('nl-player-frame', {
            height: '100%',
            width: '100%',
            videoId: vidID,
            playerVars: { 
                'autoplay': 1, 
                'mute': 0, 
                'controls': 1, 
                'modestbranding': 1, 
                'rel': 0 
            },
            events: {
                'onReady': function(event) {
                    event.target.playVideo(); // अटो-प्ले कमान्ड
                },
                'onStateChange': function(event) {
                    // ३. Auto-Close: भिडियो सकिएपछि बन्द गर्ने
                    if (event.data === YT.PlayerState.ENDED) {
                        document.getElementById('nl-ov').remove();
                    }
                }
            }
        });

        // ४. स्किप टाइमर
        let timeLeft = config.waitTime;
        const timer = setInterval(() => {
            timeLeft--;
            const s = document.getElementById('nl-s');
            if(s) s.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                if(document.getElementById('nl-tm')) document.getElementById('nl-tm').style.display = 'none';
                if(document.getElementById('nl-cl')) document.getElementById('nl-cl').style.display = 'block';
            }
