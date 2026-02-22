/**
 * Birgunj EU FM + YouTube Audio Multi-function Player
 * Features: FM, News MP3, and YouTube Latest Video Audio
 */
(function() {
    // युट्युब कन्फिगरेसन
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
            <div class="bj-bar" style="width:5px; background:#ff8c00; height: 10%; animation: bjWave 1.1s infinite alternate; animation-delay: 0.6s; animation-play-state: paused;"></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; flex-shrink: 0; width: 80px; line-height: 1;">
            <div style="color: #fff; font-size: 10px; font-weight: 900; text-shadow: 0 0 5px #00d2ff; margin-bottom: 2px;">BIRGUNJ</div>
            <div id="bj-logo" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #00d2ff; overflow: hidden; animation: bjRotate 5s linear infinite; animation-play-state: paused;">
                <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiBnC4hcDiMC18QrERnMrE8HTsMkzJDQqBmgeGvMpw_MA8NcKTPX3jUdY-byqu7K7iXUR9uByo0VBeiYdx5UXPJQHoslvzt6z-EprS-I-bg-L-w9hC_n2AUfIXuq5Nr5R1jZF5txT9r3_g5zq6FE1O8KcpaTVzrrhTWEIFv2PsjwJTSuLyHWRcjtzKRLnI=s100" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div id="bj-status" style="color: #00ff87; font-size: 9px; font-weight: 900; margin-top: 2px;">EU FM</div>
        </div>

        <div style="flex: 1; margin: 0 10px; z-index: 5; display: flex; flex-direction: column; gap: 4px; overflow: hidden;">
            <div style="background: rgba(0, 0, 0, 0.4); border-radius: 4px; padding: 4px 8px; border: 1px solid rgba(0,210,255,0.2);">
                <marquee id="bj-marquee" onmouseover="this.stop();" onmouseout="this.start();" scrollamount="4" style="color: #00ff87; font-size: 12px; font-weight: bold; display: block;">
                    <span id="bj-ticker-content">ताजा हेडलाइन लोड हुँदैछ...</span>
                </marquee>
            </div>
            <div id="yt-audio-info" style="color: #ffea00; font-size: 10px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display:none; padding-left: 5px;">
                Playing: YouTube Audio...
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 5; flex-shrink: 0;">
            <div style="display: flex; gap: 5px;">
                <button id="bj-fm-btn" title="Live FM" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: #00d2ff; color: #000; cursor: pointer; font-size: 14px; box-shadow: 0 0 8px #00d2ff; display: flex; align-items: center; justify-content: center;">🎵</button>
                <button id="bj-news-btn" title="Daily News" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: #27ae60; color: white; cursor: pointer; font-size: 14px; box-shadow: 0 0 8px #27ae60; display: flex; align-items: center; justify-content: center;">🎙️</button>
                <button id="bj-yt-btn" title="YouTube Audio" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: #ff0000; color: white; cursor: pointer; font-size: 14px; box-shadow: 0 0 8px #ff0000; display: flex; align-items: center; justify-content: center;">📽️</button>
            </div>
            
            <div id="vol-box" style="display: flex; align-items: center; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px;">
                <span style="font-size: 10px; color: white; margin-right: 4px;">🔊</span>
                <input type="range" id="bj-vol" min="0" max="1" step="0.1" value="1" style="width: 45px; cursor: pointer; accent-color: #00ff87; height: 3px;" />
            </div>

            <div id="yt-frame-container" style="width: 80px; height: 20px; overflow: hidden; position: relative; display: none; border: 1px solid #444; border-radius: 4px; background: #000;">
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
                #bj-container { height: auto; padding: 10px; flex-wrap: wrap; }
                #bj-logo { width: 35px; height: 35px; }
                button { width: 30px !important; height: 30px !important; }
            }
        </style>
    </div>
    `;

    document.write(playerHTML);

    // Elements
    var audio = document.getElementById('bj-audio');
    var ytIframe = document.getElementById('bj-yt-iframe');
    var ytWrapper = document.getElementById('yt-frame-container');
    var ytInfo = document.getElementById('yt-audio-info');
    var volBox = document.getElementById('vol-box');
    var logo = document.getElementById('bj-logo');
    var bars = document.querySelectorAll('.bj-bar');
    var fmBtn = document.getElementById('bj-fm-btn');
    var newsBtn = document.getElementById('bj-news-btn');
    var ytBtn = document.getElementById('bj-yt-btn');
    var statusText = document.getElementById('bj-status');
    var volRange = document.getElementById('bj-vol');
    var currentMode = '';
    var lastYtId = '';

    // News Ticker
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

    // YouTube Data Fetch
    async function getLatestVideo() {
        if(lastYtId) return lastYtId;
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_CONFIG.apiKey}&channelId=${YT_CONFIG.channelId}&part=snippet,id&order=date&maxResults=1&type=video`);
            const data = await res.json();
            if(data.items && data.items.length > 0) {
                ytInfo.innerText = "Title: " + data.items[0].snippet.title;
                lastYtId = data.items[0].id.videoId;
                return lastYtId;
            }
        } catch(e) { console.error("YT Fetch Error"); }
        return '';
    }

    // Toggle Player Mode
    async function toggle(type) {
        const links = {
            fm: "https://stream-151.zeno.fm/tdfnrjbmb8gtv",
            news: "https://educationnepal.eu.org/todaynews.mp3"
        };

        // Reset all states
        if (currentMode === type) {
            stopAll();
            return;
        }

        stopAll();
        currentMode = type;
        logo.style.animationPlayState = 'running';
        bars.forEach(b => b.style.animationPlayState = 'running');

        if (type === 'yt') {
            statusText.innerText = "YT AUDIO";
            ytInfo.style.display = 'block';
            ytWrapper.style.display = 'block';
            volBox.style.display = 'none';
            var vidId = await getLatestVideo();
            ytIframe.src = `https://www.youtube.com/embed/${vidId}?autoplay=1&controls=1`;
            ytBtn.innerHTML = "⏸";
        } else {
            statusText.innerText = (type === 'fm') ? "LIVE FM" : "LIVE NEWS";
            ytInfo.style.display = 'none';
            ytWrapper.style.display = 'none';
            volBox.style.display = 'flex';
            audio.src = links[type];
            audio.play();
            if(type === 'fm') fmBtn.innerHTML = "⏸"; else newsBtn.innerHTML = "⏸";
        }
    }

    function stopAll() {
        audio.pause();
        audio.src = "";
        ytIframe.src = "";
        currentMode = '';
        statusText.innerText = "EU FM";
        logo.style.animationPlayState = 'paused';
        bars.forEach(b => b.style.animationPlayState = 'paused');
        fmBtn.innerHTML = "🎵";
        newsBtn.innerHTML = "🎙️";
        ytBtn.innerHTML = "📽️";
        ytWrapper.style.display = 'none';
        ytInfo.style.display = 'none';
        volBox.style.display = 'flex';
    }

    // Handlers
    fmBtn.onclick = () => toggle('fm');
    newsBtn.onclick = () => toggle('news');
    ytBtn.onclick = () => toggle('yt');
    volRange.oninput = function() { audio.volume = this.value; };

    // Load Feed
    var s = document.createElement('script');
    s.src = 'https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&callback=ticker_headlines&max-results=8';
    document.body.appendChild(s);
})();
