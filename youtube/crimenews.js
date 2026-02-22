/**
 * १. CONFIGURATION - तपाईको डेटा यहाँ छ
 */
const YT_WIDGET_CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    maxResults: 6,
    containerId: 'video-container'
};

/**
 * २. CSS INJECTION - कालो ब्याकग्राउन्ड र ३-कलम ग्रिड
 */
const injectGlobalStyles = () => {
    const css = `
        body { background-color: #000 !important; margin: 0; padding: 0; }
        #${YT_WIDGET_CONFIG.containerId} {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 30px;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Roboto', sans-serif;
        }
        .yt-item {
            background: #111;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.1);
            transition: 0.3s ease;
        }
        .yt-item:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3); }
        .yt-item iframe { width: 100%; aspect-ratio: 16/9; border: none; display: block; }
        .yt-item .title {
            padding: 15px;
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            text-decoration: none;
            display: block;
            line-height: 1.4;
        }
        @media (max-width: 992px) { #${YT_WIDGET_CONFIG.containerId} { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { #${YT_WIDGET_CONFIG.containerId} { grid-template-columns: 1fr; padding: 10px; } }
    `;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
};

/**
 * ३. RENDER FUNCTION - भिडियो बक्स बनाउने
 */
const renderVideo = (id, title) => {
    return `
        <div class="yt-item">
            <iframe src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen></iframe>
            <a class="title" href="https://www.youtube.com/watch?v=${id}" target="_blank">${title}</a>
        </div>`;
};

/**
 * ४. MAIN LOGIC - डेटा तान्ने र देखाउने
 */
async function fetchYouTubeData() {
    // कन्टेनर आफैँ बनाउने
    let target = document.getElementById(YT_WIDGET_CONFIG.containerId);
    if (!target) {
        target = document.createElement('div');
        target.id = YT_WIDGET_CONFIG.containerId;
        const script = document.currentScript;
        if (script) script.parentNode.insertBefore(target, script);
        else document.body.appendChild(target);
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_WIDGET_CONFIG.apiKey}&channelId=${YT_WIDGET_CONFIG.channelId}&part=snippet,id&order=date&maxResults=${YT_WIDGET_CONFIG.maxResults}&type=video`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            target.innerHTML = data.items.map(v => renderVideo(v.id.videoId, v.snippet.title)).join('');
        } else {
            console.error("API Error:", data);
            target.innerHTML = '<p style="color:white; text-align:center;">API Error: Please check Key Restrictions.</p>';
        }
    } catch (e) {
        target.innerHTML = '<p style="color:white; text-align:center;">Network Error.</p>';
    }
}

/**
 * ५. INITIALIZE
 */
const init = () => {
    injectGlobalStyles();
    fetchYouTubeData();
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
