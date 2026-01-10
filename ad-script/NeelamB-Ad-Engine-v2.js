/* NeelamB Multi-Engine v2 - Sound Enabled & Auto-play */
(function() {
    const config = {
        type: 'youtube', 
        source: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // यहाँ आफ्नो युट्युब लिंक राख्नुहोस्
        target: 'https://ad.neelamb.com', 
        waitTime: 7, 
        id: 'nl_sound_v2'
    };

    const getYTID = (url) => {
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const initAd = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-ov { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 2147483647; display: flex; justify-content: center; align-items: center; visibility: hidden; }
            #nl-bx { width: 95%; max-width: 720px; background: #000; border-radius: 15px; overflow: hidden; position: relative; box-shadow: 0 0 30px rgba(255,255,255,0.1); }
            #nl-tm { position: absolute; top: 15px; right: 15px; background: #fff; color: #000; padding: 6px 18px; border-radius: 25px; font-weight: bold; font-size: 14px; z-index: 100; }
            #nl-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 8px 22px; border-radius: 5px; cursor: pointer; z-index: 101; font-weight: bold; }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nl-ov';
        
        const vidID = getYTID(config.source);
        // mute=0 ले आवाज अन गर्छ
        const mediaHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;">
            <iframe id="nl-player" src="https://www.youtube.com/embed/${vidID}?autoplay=1&mute=0&controls=1&enablejsapi=1" 
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" 
            allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>`;

        overlay.innerHTML = `<div id="nl-bx"><div id="nl-tm">Skip: <span id="nl-s">${config.waitTime}</span>s</div><button id="nl-cl" onclick="document.getElementById('nl-ov').remove()">CLOSE ✖</button><div id="nl-cnt">${mediaHtml}</div></div>`;
        document.body.appendChild(overlay);
        overlay.style.visibility = 'visible';

        let timeLeft = config.waitTime;
        const timer = setInterval(() => {
            timeLeft--;
            const s = document.getElementById('nl-s');
            if(s) s.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById('nl-tm').style.display = 'none';
                document.getElementById('nl-cl').style.display = 'block';
            }
        }, 1000);
    };

    // ब्राउजरको 'Autoplay Policy' ह्यान्डल गर्न
    window.addEventListener('click', function() {
        if (!document.getElementById('nl-ov')) {
            initAd();
        }
    }, { once: true });

    // यदि ब्राउजरले सिधै अनुमति दियो भने
    window.addEventListener('load', () => {
        setTimeout(initAd, 2000);
    });

})();
