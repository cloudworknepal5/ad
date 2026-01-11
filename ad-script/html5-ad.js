/* NeelamB HTML5 Smart-Engine v3 + Analytics */
(function() {
    const config = {
        type: 'youtube', // 'image', 'video', 'youtube'
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        target: 'https://ad.neelamb.com',
        waitTime: 7,
        id: 'nl_smart_stats'
    };

    // Analytics रेकर्ड गर्ने फङ्सन
    const updateStats = (type) => {
        let stats = JSON.parse(localStorage.getItem(config.id)) || { views: 0, clicks: 0, lastAd: "" };
        if(type === 'v') stats.views++;
        if(type === 'c') stats.clicks++;
        stats.lastAd = config.source;
        localStorage.setItem(config.id, JSON.stringify(stats));
    };

    const initAd = () => {
        if (document.getElementById('nl-overlay')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999999; display: flex; justify-content: center; align-items: center; }
            #nl-box { width: 95%; max-width: 700px; background: #000; border-radius: 10px; overflow: hidden; position: relative; border: 1px solid #444; }
            #nl-tm { position: absolute; top: 10px; right: 10px; background: #fff; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-family: sans-serif; z-index: 100; font-size: 12px; }
            #nl-cl { display: none; position: absolute; top: 10px; right: 10px; background: #ff4757; color: #fff; border: none; padding: 6px 15px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-overlay';
        
        let media = '';
        if(config.type === 'youtube') {
            const id = config.source.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
            media = `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe id="yt-v3" src="https://www.youtube.com/embed/${id}?autoplay=1&mute=0&enablejsapi=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay"></iframe></div>`;
        } else if(config.type === 'image') {
            media = `<a href="${config.target}" target="_blank" onclick="window.nlTrack()"><img src="${config.source}" style="width:100%;display:block;"></a>`;
        }

        overlay.innerHTML = `<div id="nl-box"><div id="nl-tm">Skip: <span id="nl-s">${config.waitTime}</span>s</div><button id="nl-cl" onclick="document.getElementById('nl-overlay').remove()">CLOSE ✖</button>${media}</div>`;
        document.body.appendChild(overlay);
        
        updateStats('v'); // View रेकर्ड भयो

        let sec = config.waitTime;
        const timer = setInterval(() => {
            sec--;
            if(document.getElementById('nl-s')) document.getElementById('nl-s').innerText = sec;
            if(sec <= 0) {
                clearInterval(timer);
                document.getElementById('nl-tm').style.display = 'none';
                document.getElementById('nl-cl').style.display = 'block';
            }
        }, 1000);
    };

    window.nlTrack = () => updateStats('c'); // Click रेकर्ड भयो
    ['click', 'touchstart'].forEach(e => document.addEventListener(e, initAd, { once: true }));
})();
