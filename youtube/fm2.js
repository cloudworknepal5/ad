/**
 * Birgunj EU FM - 3 Column Layout Player
 * YouTube (1st) | Zeno FM (2nd)
 * Updated: Play/Pause functionality for YouTube
 */
(function() {
    const YT_CONFIG = {
        apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
        channelId: 'UC09hwXZEtHcScFWebDsj7cA'
    };

    var playerHTML = `
    <div id="bj-container" style="width: 100%; max-width: 790px; height: 90px; margin: 10px auto; background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%); border-radius: 12px; box-shadow: 0 0 25px rgba(0,210,255,0.6); font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden; border: 2px solid #00d2ff; position: relative; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; color: #fff;">
        
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex; justify-content: space-around; align-items: flex-end; opacity: 0.1; pointer-events: none;">
            <div class="bj-bar" style="width:5px; background:#00d2ff; height: 10%; animation: bjWave 0.8s infinite alternate; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#ff0080; height: 10%; animation: bjWave 1.2s infinite alternate; animation-delay: 0.2s; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#00ff87; height: 10%; animation: bjWave 0.7s infinite alternate; animation-delay: 0.4s; animation-play-state: paused;"></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; width: 75px; line-height: 1;">
            <div style="color: #fff; font-size: 9px; font-weight: 900; text-shadow: 0 0 5px #00d2ff; margin-bottom: 2px;">BIRGUNJ</div>
            <div id="bj-logo" style="width: 38px; height: 38px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #00d2ff; overflow: hidden; animation: bjRotate 5s linear infinite; animation-play-state: paused;">
                <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiBnC4hcDiMC18QrERnMrE8HTsMkzJDQqBmgeGvMpw_MA8NcKTPX3jUdY-byqu7K7iXUR9uByo0VBeiYdx5UXPJQHoslvzt6z-EprS-I-bg-L-w9hC_n2AUfIXuq5Nr5R1jZF5txT9r3_g5zq6FE1O8KcpaTVzrrhTWEIFv2PsjwJTSuLyHWRcjtzKRLnI=s100" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div id="bj-status" style="color: #00ff87; font-size: 8px; font-weight: 900; margin-top: 2px;">EU FM</div>
        </div>

        <div style="flex: 1; margin: 0 10px; z-index: 5; display: flex; flex-direction: column; height: 80px; justify-content: center; gap: 3px; overflow: hidden;">
            <div style="background: rgba(0, 0, 0, 0.4); border-radius: 4px; padding: 2px 8px; border: 1px solid rgba(0,210,255,0.1);">
                <marquee scrollamount="3" onmouseover="this.stop();" onmouseout="this.start();" style="color: #00ff87; font-size: 11px; font-weight: bold; display: block;">
                    <span id="bj-ticker-content">ताजा हेडलाइन लोड हुँदैछ...</span>
                </marquee>
            </div>
            <div style="background: rgba(255, 234, 0, 0.05); border-radius: 4px; padding: 2px 8px; border: 1px dashed rgba(255, 234, 0, 0.3);">
                <marquee scrollamount="4" style="color: #ffea00; font-size: 10px; font-weight: bold; display: block;">
                    ✨ विज्ञापन: के तपाईं आफ्नो छुट्टै खाले मौलिक वेबसाइट, न्यूज पोर्टल बनाउन चाहनुहुन्छ? हामी बनाउँछौं भीडभन्दा अलग वेबसाइट । विस्तृत जानकारीको लागि: <a href="https://Neelamb.com" target="_blank" style="color:#ffea00; text-decoration:underline;">Neelamb.com</a>, मोबाइल: +977-9814272487 ✨
                </marquee>
            </div>
            <div id="yt-audio-info" style="background: rgba(255, 0, 0, 0.1); border-radius: 4px; padding: 2px 8px; border: 1px solid rgba(255,0,0,0.2); height: 18px; display: flex; align-items: center; overflow: hidden;">
                <div id="bj-yt-title-container" style="width: 100%;">
                    <marquee id="bj-main-marquee" scrollamount="2" style="color: #ff3d00; font-size: 10px; font-weight: bold; display: block;">
                        समाचार सुन्न रातो बटन र संगीत सुन्न नीलो बटन थिच्नुहोस्
                    </marquee>
                </div>
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 5; flex-shrink: 0;">
            <div style="display: flex; gap: 8px; align-items: center;">
                <button id="bj-yt-btn" title="YouTube News" style="width: 38px; height: 26px; border-radius: 6px; border: none; background: #ff0000; color: white; cursor: pointer; font-size: 14px; box-shadow: 0 0 10px rgba(255,0,0,0.5); display: flex; align-items: center; justify-content: center;">
                   <span id="yt-btn-icon">▶</span>
                </button>
                <button id="bj-fm-btn" title="Zeno FM" style="width: 30px; height: 30px; border-radius: 50%; border: none; background: #00d2ff; color: #000; cursor: pointer; font-size: 14px; box-shadow: 0 0 8px #00d2ff; display: flex; align-items: center; justify-content: center;">🎵</button>
            </div>
            <div id="vol-box" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;">
                <span style="font-size: 9px; color: white; margin-right: 4px;">🔊</span>
                <input type="range" id="bj-vol" min="0" max="1" step="0.1" value="1" style="width: 45px; cursor: pointer; accent-color: #00ff87; height: 3px;" />
            </div>
        </div>

        <audio id="bj-audio"></audio>
        <div id="yt-player-container"></div>

        <style>
            @keyframes bjRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes bjWave { 0% { height: 10%; } 100% { height: 90%; } }
            #bj-ticker-content a { color: #00ff87; text-decoration: none; font-weight: bold; }
            @media (max-width: 480px) {
                #bj-container { padding: 5px; }
                div[style*="width: 75px"] { width: 55px !important; }
            }
        </style>
    </div>
    `;

    document.write(playerHTML);

    // API loading for Pause/Play Support
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var ytPlayer;
    var audio = document.getElementById('bj-audio');
    var ytTitleBox = document.getElementById('bj-yt-title-container');
    var ytBtnIcon = document.getElementById('yt-btn-icon');
    var logo = document.getElementById('bj-logo');
    var bars = document.querySelectorAll('.bj-bar');
    var currentMode = '';
    var lastYtId = '';
    var lastYtTitle = '';
    var isYtPaused = false;

    window.onYouTubeIframeAPIReady = function() {
        // Player will be initialized when needed
    };

    window.ticker_headlines = function(json) {
        var html = "";
        if (json.feed.entry) {
            json.feed.entry.forEach(e => {
                var url = e.link.find(l => l.rel == 'alternate').href;
                html += "<span> &nbsp; • &nbsp; <a href='" + url + "'>" + e.title.$t + "</a></span>";
            });
            document.getElementById("bj-ticker-content").innerHTML = html;
        }
    };

    // Multi-function: Update Marquee
    function updateMarquee(text, speed = "2") {
        ytTitleBox.innerHTML = `<marquee scrollamount="${speed}" style="color: #ff3d00; font-size: 10px; font-weight: bold; display: block;">${text}</marquee>`;
    }

    // Multi-function: Control Visuals
    function toggleVisuals(play) {
        const state = play ? 'running' : 'paused';
        logo.style.animationPlayState = state;
        bars.forEach(b => b.style.animationPlayState = state);
    }

    // Multi-function: YouTube Logic
    async function controlYouTube() {
        if (currentMode === 'fm') { resetAll(); }

        if (ytPlayer && currentMode === 'yt') {
            const state = ytPlayer.getPlayerState();
            if (state === 1) { // Playing
                ytPlayer.pauseVideo();
                ytBtnIcon.innerText = "▶";
                toggleVisuals(false);
            } else {
                ytPlayer.playVideo();
                ytBtnIcon.innerText = "⏸";
                toggleVisuals(true);
            }
            return;
        }

        currentMode = 'yt';
        document.getElementById('bj-status').innerText = "EU FM";
        
        if (!lastYtId) {
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_CONFIG.apiKey}&channelId=${YT_CONFIG.channelId}&part=snippet,id&order=date&maxResults=1&type=video`);
                const data = await res.json();
                lastYtId = data.items[0].id.videoId;
                lastYtTitle = "बज्दैछ: " + data.items[0].snippet.title;
            } catch (e) {
                lastYtTitle = "भिडियो लोड गर्न सकिएन";
                lastYtId = 'dQw4w9WgXcQ'; 
            }
        }

        updateMarquee(lastYtTitle);
        ytBtnIcon.innerText = "⏸";
        toggleVisuals(true);

        if (!ytPlayer) {
            ytPlayer = new YT.Player('yt-player-container', {
                height: '1', width: '1', videoId: lastYtId,
                playerVars: { 'autoplay': 1, 'controls': 0 },
                events: { 'onReady': (e) => e.target.playVideo() }
            });
        } else {
            ytPlayer.loadVideoById(lastYtId);
        }
    }

    function toggleFM() {
        if (currentMode === 'fm') { resetAll(); return; }
        resetAll();
        currentMode = 'fm';
        document.getElementById('bj-status').innerText = "LIVE FM";
        audio.src = "https://stream-151.zeno.fm/tdfnrjbmb8gtv";
        audio.play();
        document.getElementById('bj-fm-btn').innerText = "⏸";
        toggleVisuals(true);
        updateMarquee("लाइभ संगीत बज्दैछ...", "2");
    }

    function resetAll() {
        audio.pause(); audio.src = "";
        if (ytPlayer) { ytPlayer.stopVideo(); }
        currentMode = '';
        document.getElementById('bj-status').innerText = "EU FM";
        toggleVisuals(false);
        document.getElementById('bj-fm-btn').innerText = "🎵";
        ytBtnIcon.innerText = "▶";
        updateMarquee("समाचार सुन्न रातो बटन र संगीत सुन्न नीलो बटन थिच्नुहोस्", "2");
    }

    document.getElementById('bj-yt-btn').onclick = controlYouTube;
    document.getElementById('bj-fm-btn').onclick = toggleFM;
    document.getElementById('bj-vol').oninput = function() { 
        audio.volume = this.value; 
        if(ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(this.value * 100);
    };

    var s = document.createElement('script');
    s.src = 'https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=ticker_headlines&max-results=8';
    document.body.appendChild(s);
})();
