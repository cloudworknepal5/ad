/* NeelamB HTML5 Smart-Engine v3.5 + Cloud Analytics */
(function() {
    const config = {
        type: 'youtube',
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        target: 'https://ad.neelamb.com',
        waitTime: 7,
        // यहाँ आफ्नो Google Web App URL पेस्ट गर्नुहोस्
        cloudURL: 'https://script.google.com/macros/s/AKfycbxt4bPx1dXsOiTRzjdrTi_XmPbgD7WBLvnVYxhkj_nfl4QweU2VDY12obVidjB20ju4/exec'
    };

    // डेटा क्लाउडमा पठाउने फङ्सन
    const sendToCloud = (actionType) => {
        fetch(config.cloudURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ type: actionType, source: config.source })
        });
    };

    const initAd = () => {
        if (document.getElementById('nl-overlay')) return;

        const style = document.createElement('style');
        style.innerHTML = `
            #nl-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999999; display:flex; justify-content:center; align-items:center; }
            #nl-box { width:95%; max-width:700px; background:#000; border-radius:12px; overflow:hidden; position:relative; }
            #nl-tm { position:absolute; top:10px; right:10px; background:#fff; color:#000; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:12px; z-index:100; }
            #nl-cl { display:none; position:absolute; top:10px; right:10px; background:#ff4757; color:#fff; border:none; padding:8px 20px; border-radius:5px; cursor:pointer; z-index:101; font-weight:bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-overlay';
        
        let media = '';
        if(config.type === 'youtube') {
            const id = config.source.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)[1];
            media = `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=0" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay"></iframe></div>`;
        }

        overlay.innerHTML = `<div id="nl-box"><div id="nl-tm">Wait: <span id="nl-s">${config.waitTime}</span>s</div><button id="nl-cl" onclick="document.getElementById('nl-overlay').remove()">CLOSE ✖</button>${media}</div>`;
        document.body.appendChild(overlay);
        
        sendToCloud('VIEW'); // क्लाउडमा भ्यु रेकर्ड भयो

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

    window.nlClick = () => sendToCloud('CLICK');
    ['click', 'touchstart'].forEach(e => document.addEventListener(e, initAd, { once: true }));
})();
