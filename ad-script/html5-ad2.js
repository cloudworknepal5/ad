/* NeelamB HTML5 Smart-Engine v3.5 - Multi-function & Cloud */
(function() {
    const config = {
        type: 'youtube', // 'youtube', 'image', 'video'
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        target: 'https://ad.neelamb.com',
        waitTime: 7,
        // तपाईँको Google Web App URL
        cloudURL: 'https://script.google.com/macros/s/AKfycbyHu4aAJiXt-eDqZvoBWmR4AP2l5svmVtpj5hDmzwWVzaGKkpmOQgRs2rzclp89_h5M/exec'
    };

    if (config.type === 'youtube' && !window.YT) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
    }

    const sendToCloud = (action) => {
        fetch(config.cloudURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ type: action, source: config.source })
        });
    };

    const initAd = () => {
        if (document.getElementById('nl-v3-ov')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v3-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2147483647; display: flex; justify-content: center; align-items: center; }
            #nl-v3-bx { width: 95%; max-width: 720px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid #333; }
            #nl-v3-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 12px; }
            #nl-v3-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-v3-ov';
        
        let media = '';
        if(config.type === 'youtube') {
            const id = config.source.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
            media = `<div style="position:relative;padding-bottom:56.25%;height:0;"><div id="nl-player"></div></div>`;
        } else if(config.type === 'image') {
            media = `<a href="${config.target}" target="_blank" onclick="sendToCloud('CLICK')"><img src="${config.source}" style="width:100%;display:block;"></a>`;
        }

        overlay.innerHTML = `<div id="nl-v3-bx"><div id="nl-v3-tm">Skip: <span id="nl-s">${config.waitTime}</span>s</div><button id="nl-v3-cl" onclick="document.getElementById('nl-v3-ov').remove()">CLOSE ✖</button>${media}</div>`;
        document.body.appendChild(overlay);
        
        sendToCloud('VIEW'); 

        if (config.type === 'youtube') {
            window.onYouTubeIframeAPIReady = () => {
                new YT.Player('nl-player', {
                    videoId: config.source.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)[1],
                    playerVars: { 'autoplay': 1, 'mute': 0 },
                    events: { 'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) overlay.remove(); } }
                });
            };
        }

        let sec = config.waitTime;
        const timer = setInterval(() => {
            sec--;
            if(document.getElementById('nl-s')) document.getElementById('nl-s').innerText = sec;
            if(sec <= 0) {
                clearInterval(timer);
                document.getElementById('nl-v3-tm').style.display = 'none';
                document.getElementById('nl-v3-cl').style.display = 'block';
            }
        }, 1000);
    };

    ['click', 'touchstart'].forEach(e => document.addEventListener(e, initAd, { once: true }));
})();
