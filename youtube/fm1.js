/**
 * Birgunj EU FM - Integrated YouTube & Zeno FM Player
 * Layout: YouTube (1st) | Zeno FM (2nd)
 */
(function() {
    const YT_CONFIG = {
        apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
        channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg'
    };

    var playerHTML = `
    <div id="bj-container" style="width: 100%; max-width: 790px; height: 90px; margin: 10px auto; background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%); border-radius: 12px; box-shadow: 0 0 25px rgba(0,210,255,0.6); font-family: 'Segoe UI', Arial, sans-serif; overflow: hidden; border: 2px solid #00d2ff; position: relative; display: flex; align-items: center; padding: 0 10px; box-sizing: border-box; color: #fff;">
        
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; display: flex; justify-content: space-around; align-items: flex-end; opacity: 0.1; pointer-events: none;">
            <div class="bj-bar" style="width:5px; background:#00d2ff; height: 10%; animation: bjWave 0.8s infinite alternate; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#ff0080; height: 10%; animation: bjWave 1.2s infinite alternate; animation-delay: 0.2s; animation-play-state: paused;"></div>
            <div class="bj-bar" style="width:5px; background:#00ff87; height: 10%; animation: bjWave 0.7s infinite alternate; animation-delay: 0.4s; animation-play-state: paused;"></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; width: 80px; line-height: 1;">
            <div style="color: #fff; font-size: 10px; font-weight: 900; text-shadow: 0 0 5px #00d2ff; margin-bottom: 2px;">BIRGUNJ</div>
            <div id="bj-logo" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #00d2ff; overflow: hidden; animation: bjRotate 5s linear infinite; animation-play-state: paused;">
                <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiBnC4hcDiMC18QrERnMrE8HTsMkzJDQqBmgeGvMpw_MA8NcKTPX3jUdY-byqu7K7iXUR9uByo0VBeiYdx5UXPJQHoslvzt6z-EprS-I-bg-L-w9hC_n2AUfIXuq5Nr5R1jZF5txT9r3_g5zq6FE1O8KcpaTVzrrhTWEIFv2PsjwJTSuLyHWRcjtzKRLnI=s100" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div id="bj-status" style="color: #00ff87; font-size: 9px; font-weight: 900; margin-top: 2px;">EU FM</div>
        </div>

        <div style="flex: 1; margin: 0 15px; z-index: 5; display: flex; flex-direction: column; gap: 4px; overflow: hidden;">
            <div style="background: rgba(0, 0, 0, 0.4); border-radius: 4px; padding: 4px 8px; border: 1px solid rgba(0,210,255,0.2);">
                <marquee id="bj-marquee" onmouseover="this.stop();" onmouseout="this.start();" scrollamount="4" style="color: #00ff87; font-size: 12px; font-weight: bold; display: block;">
                    <span id="bj-ticker-content">ताजा हेडलाइन लोड हुँदैछ...</span>
                </marquee>
            </div>
            <div id="yt-audio-info" style="color: #ff3d00; font-size: 11px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display:none;">
                YouTube Latest Loading...
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 5; flex-shrink: 0;">
            <div style="display: flex; gap: 8px; align-items: center;">
                <button id="bj-yt-btn" title="YouTube News" style="width: 40px; height: 28px; border-radius: 6px; border: none; background: #ff0000; color: white; cursor: pointer; font-size: 16px; box-shadow: 0 0 10px rgba(255,0,0,0.5); display: flex; align-items: center; justify-content: center;">
                   <span id="yt-btn-icon">▶</span>
                </button>
                
                <button id="bj-fm-btn" title="Zeno Live FM" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: #00d2ff; color: #000; cursor: pointer; font-size: 16px; box-shadow: 0 0 8px #00d2ff; display: flex; align-items: center; justify-content: center;">🎵</button>
            </div>
            
            <div id="vol-box" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;">
                <span style="font-size: 10px; color: white; margin-right: 4px;">🔊</span>
                <input type="range" id="bj-vol" min="0" max="1" step="0.1" value="1" style="width: 50px; cursor: pointer; accent-color: #00ff87; height: 3px;" />
            </div>

            <div id="yt-frame-container" style="width: 100px; height: 22px; overflow: hidden; position: relative; display: none; border: 1px solid #444; border-radius: 4px; background: #000;">
                <iframe id="bj-yt-iframe" src="" style="position: absolute; top: -330px; left: -10px; width: 400px; height: 400px; border: none;"></iframe>
            </div>
        </div>

        <audio id="bj-audio"></audio>

        <style>
            @keyframes bjRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes bjWave { 0% { height: 10%; } 100% { height: 90%; } }
            #bj-ticker-content a { color: #00ff87; text-decoration: none; font-weight: bold; }
            #bj-vol { -webkit-appearance: none; background: rgba(255,255,255,0.3); border-radius: 5px; }
            @media (max-width: 480px) {
                #bj-container { height: auto; padding: 10px; flex-direction: row; flex-wrap: wrap; justify-content: center; }
            }
        </style>
    </div>
    `;

    document.write(playerHTML);

    // Initialization
    var audio = document.getElementById('bj-audio');
    var ytIframe = document.getElementById('bj-yt-iframe');
    var ytWrapper = document.getElementById('yt-frame-container');
    var ytInfo = document.getElementById('yt-audio-info');
    var ytBtnIcon = document.getElementById('yt-btn-icon');
    var volBox = document.getElementById('vol-box');
    var logo = document.getElementById('bj-logo');
    var bars = document.querySelectorAll('.bj-bar');
    var fmBtn = document.getElementById('bj-fm-btn');
    var ytBtn = document.getElementById('bj-yt-btn');
    var statusText = document.getElementById('bj-status');
    var volRange = document.getElementById('bj-vol');
    var currentMode = '';
    var lastYtId = '';

    // News Ticker Handler
    window.ticker_headlines = function(json) {
        var html = "";
        if (json.feed.entry) {
            for (var i = 0; i < json.feed.entry.length; i++) {
                var entry = json.feed.entry[i];
                var url = entry.link.find(l => l.rel == 'alternate').href;
                html += "<span> &nbsp; • &nbsp; <a href='" + url + "'>" + entry.title.$t + "</a></span>";
            }
            document.getElementById("bj-ticker-content").innerHTML = html;
        }
    };

    // YouTube Fetch Logic
    async function fetchLatestVideo() {
        if(lastYtId) return lastYtId;
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_CONFIG.apiKey}&channelId=${YT_CONFIG.channelId}&part=snippet,id&order=date&maxResults=1&type=video`);
            const data = await res.json();
            if(data.items && data.items.length > 0) {
                ytInfo.innerText = "Playing: " + data.items[0].snippet.title;
                lastYtId = data.items[0].id.videoId;
                return lastYtId;
            }
        } catch(e) { console.error("YT API Error"); }
        return '';
    }

    // Toggle Function (YouTube + Zeno FM)
    async function toggle(type) {
        const fmLink = "https://stream-151.zeno.fm/tdfnrjbmb8gtv";

        if (currentMode === type) {
            resetPlayer();
            return;
        }

        resetPlayer();
        currentMode = type;
        logo.style.animationPlayState = 'running';
        bars.forEach(b => b.style.animationPlayState = 'running');

        if (type === 'yt') {
            statusText.innerText = "YT NEWS";
            ytInfo.style.display = 'block';
            ytWrapper.style.display = 'block';
            volBox.style.display = 'none';
            var vidId = await fetchLatestVideo();
            ytIframe.src = `https://www.youtube.com/embed/${vidId}?autoplay=1&controls=1`;
            ytBtnIcon.innerText = "⏸";
        } else {
            statusText.innerText = "LIVE FM";
            audio.src = fmLink;
            audio.play();
            fmBtn.innerHTML = "⏸";
        }
    }

    function resetPlayer() {
        audio.pause(); audio.src = "";
        ytIframe.src = "";
        currentMode = '';
        statusText.innerText = "EU FM";
        logo.style.animationPlayState = 'paused';
        bars.forEach(b => b.style.animationPlayState = 'paused');
        fmBtn.innerHTML = "🎵";
        ytBtnIcon.innerText = "▶";
        ytWrapper.style.display = 'none';
        ytInfo.style.display = 'none';
        volBox.style.display = 'flex';
    }

    ytBtn.onclick = () => toggle('yt');
    fmBtn.onclick = () => toggle('fm');
    volRange.oninput = function() { audio.volume = this.value; };

    // Load News Feed
    var s = document.createElement('script');
    s.src = 'https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=ticker_headlines&max-results=8';
    document.body.appendChild(s);
})();
