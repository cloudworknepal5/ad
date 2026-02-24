/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 8, // अब जम्मा ८ वटा भिडियो लोड हुनेछ
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. स्केच अनुसारको CSS (हाइट र एलाइनमेन्ट मिलाइएको)
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 1.8fr 1.2fr;
            grid-gap: 15px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 10px;
        }
        
        .video-item-main { grid-column: 1 / 2; }
        .video-item-main iframe { 
            width: 100%; 
            height: 380px; /* ४ वटा साइड भिडियोको कुल हाइटसँग मिलाउन अलि बढाइएको */
            background: #000; 
            border: none; 
            display: block;
        }
        .main-title { 
            padding: 10px 0; 
            font-weight: bold; 
            font-size: 18px; 
            border-bottom: 2px solid #eee; 
            margin-bottom: 10px; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
        }

        /* साइडका ४ वटा भिडियोहरू (४, ५, ६ र नयाँ थपिएको ८ नम्बर) */
        .sidebar-section { display: flex; flex-direction: column; gap: 12px; }

        /* तल्लो ३ वटा भिडियोहरू (२, ३, ७ नम्बर) */
        .bottom-section { 
            grid-column: 1 / 3; 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 15px; 
            margin-top: 15px; 
        }

        /* साझा भिडियो कार्ड स्टाइल */
        .video-card { 
            display: flex; 
            gap: 10px; 
            cursor: pointer; 
            background: #fff; 
            border: 1px solid #eee; 
            padding: 5px;
            align-items: center;
            transition: 0.2s;
        }
        .video-card:hover { border-color: #ff0000; }
        
        .thumb-box { 
            position: relative; 
            width: 150px; 
            height: 80px; 
            flex-shrink: 0; 
            background: #000; 
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        
        /* प्ले बटन */
        .play-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 30px; height: 30px; background: rgba(255,0,0,0.8); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .play-overlay::after {
            content: ''; border-style: solid; border-width: 5px 0 5px 8px;
            border-color: transparent transparent transparent white; margin-left: 2px;
        }

        .title-box { 
            font-size: 13px; 
            font-weight: bold; 
            color: #333; 
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* २ लाइनमा मात्र देखाउन */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .load-more-wrapper { text-align: center; margin: 20px 0; width: 100%; clear: both; }
        #${CONFIG.buttonId} { padding: 10px 25px; cursor: pointer; border: 1px solid #ccc; background: #fff; }

        @media (max-width: 900px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; }
            .sidebar-section, .bottom-section { grid-column: 1 / -1; }
            .video-item-main iframe { height: auto; aspect-ratio: 16/9; }
            .bottom-section { grid-template-columns: 1fr; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. भिडियो रिप्लेस गर्ने फङ्सन (Multi-function)
 */
function playInMain(videoId, title) {
    const player = document.querySelector('.video-item-main iframe');
    const playerTitle = document.querySelector('.main-title');
    if (player) {
        player.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
        if(playerTitle) playerTitle.innerText = title;
        window.scrollTo({ top: document.getElementById(CONFIG.containerId).offsetTop - 20, behavior: 'smooth' });
    }
}

/**
 * ४. कार्ड बनाउने फङ्सन
 */
function getCardHtml(item) {
    if(!item) return '';
    const vId = item.id.videoId;
    const vTitle = item.snippet.title.replace(/'/g, "\\'");
    return `
        <div class="video-card" onclick="playInMain('${vId}', '${vTitle}')">
            <div class="thumb-box">
                <div class="play-overlay"></div>
                <img src="${item.snippet.thumbnails.medium.url}">
            </div>
            <div class="title-box">${item.snippet.title}</div>
        </div>`;
}

/**
 * ५. डेटा लोड गर्ने मुख्य फङ्सन
 */
async function loadYouTubeVideos() {
    let container = document.getElementById(CONFIG.containerId);
    let btn = document.getElementById(CONFIG.buttonId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    if (!btn) {
        const loaderWrapper = document.createElement('div');
        loaderWrapper.className = 'load-more-wrapper';
        loaderWrapper.innerHTML = `<button id="${CONFIG.buttonId}">Load More</button>`;
        container.after(loaderWrapper);
        btn = document.getElementById(CONFIG.buttonId);
        btn.addEventListener('click', loadYouTubeVideos);
    }

    btn.innerText = 'Loading...';

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            const v = data.items;
            
            // १. पहिलो भिडियो (Main)
            let html = `
                <div class="video-item-main">
                    <iframe src="https://www.youtube.com/embed/${v[0].id.videoId}?rel=0" allowfullscreen></iframe>
                    <div class="main-title">${v[0].snippet.title}</div>
                </div>`;

            // २. साइडबार (४ वटा भिडियोहरू - कार्ड ३, ४, ५, ६)
            html += '<div class="sidebar-section">';
            [3, 4, 5, 7].forEach(i => { if(v[i]) html += getCardHtml(v[i]); });
            html += '</div>';

            // ३. तल (३ वटा भिडियोहरू - कार्ड १, २, ७)
            html += '<div class="bottom-section">';
            [1, 2, 6].forEach(i => { if(v[i]) html += getCardHtml(v[i]); });
            html += '</div>';

            container.innerHTML = html;
            btn.innerText = 'Load More';
            if (!nextPageToken) btn.parentElement.remove();
        }
    } catch (err) {
        console.error('Error:', err);
        btn.innerText = 'Try Again';
    }
}

function init() {
    injectStyles();
    loadYouTubeVideos();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
