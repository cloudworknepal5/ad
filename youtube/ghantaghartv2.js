/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UC3-zHSIXFWEC-NgrTL98uXg',
    results: 6, 
    containerId: 'video-container-2', // नयाँ आइडी
    buttonId: 'btn-load-more-2'
};

let nextPageToken = '';

/**
 * २. परिमार्जित CSS
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 1.8fr 1.2fr;
            grid-gap: 20px;
            max-width: 1200px;
            margin: 20px auto;
            padding: 10px;
            align-items: start;
        }
        
        .main-player-area { order: 1; position: sticky; top: 10px; }
        
        .sidebar-wrapper { 
            order: 2; 
            display: flex; 
            flex-direction: column; 
        }

        .sidebar-list { 
            display: flex; 
            flex-direction: column; 
            gap: 10px; 
        }

        .video-item-main iframe { 
            width: 100%; 
            height: 380px; 
            background: #000; 
            border: none; 
            border-radius: 4px;
        }
        
        .main-title { 
            padding: 10px 0; 
            font-weight: bold; 
            font-size: 18px; 
            color: #222;
        }

        .video-card { 
            display: flex; 
            gap: 10px; 
            cursor: pointer; 
            background: #fff; 
            border: 1px solid #f0f0f0; 
            padding: 6px;
            align-items: center;
        }
        
        .thumb-box { 
            position: relative; 
            width: 110px; 
            aspect-ratio: 16/9; 
            flex-shrink: 0; 
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .play-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 22px; height: 22px; background: rgba(255, 0, 0, 0.8); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .play-overlay::after {
            content: ''; border-style: solid; border-width: 3px 0 3px 6px;
            border-color: transparent transparent transparent white; margin-left: 1px;
        }

        .title-box { 
            font-size: 12px; 
            font-weight: 600; 
            color: #333; 
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* लोड मोर बटन स्टायल */
        .load-more-container { margin-top: 15px; text-align: center; }
        #${CONFIG.buttonId} {
            width: 100%;
            padding: 10px;
            cursor: pointer;
            border: 1px solid #ddd;
            background: #f8f8f8;
            font-size: 13px;
            font-weight: bold;
            border-radius: 4px;
            transition: 0.2s;
        }
        #${CONFIG.buttonId}:hover { background: #eee; }

        @media (max-width: 850px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; }
            .main-player-area { position: relative; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. मल्टि-फङ्सन: भिडियो प्ले र स्क्रोलिङ
 */
function playVideo(vId, vTitle) {
    const mainArea = document.querySelector('.main-player-area');
    const iframe = mainArea.querySelector('iframe');
    const titleDiv = mainArea.querySelector('.main-title');

    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`;
        if (titleDiv) titleDiv.innerText = decodeURIComponent(vTitle);
        if (window.innerWidth <= 850) {
            mainArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * ४. कार्ड जेनेरेटर
 */
function getCardHtml(item) {
    if(!item) return '';
    const vId = item.id.videoId;
    const cleanTitle = encodeURIComponent(item.snippet.title).replace(/'/g, "%27");
    return `
        <div class="video-card" onclick="playVideo('${vId}', '${cleanTitle}')">
            <div class="thumb-box">
                <div class="play-overlay"></div>
                <img src="${item.snippet.thumbnails.medium.url}">
            </div>
            <div class="title-box">${item.snippet.title}</div>
        </div>`;
}

/**
 * ५. मुख्य फेच फङ्सन (Load More Logic Included)
 */
async function loadYouTubeContent() {
    let container = document.getElementById(CONFIG.containerId);
    if (!container) return;

    const btn = document.getElementById(CONFIG.buttonId);
    if (btn) btn.innerText = 'लोड हुँदैछ...';

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            const v = data.items;
            
            // पहिलो पटक लोड हुँदा (Initial Load)
            if (!document.querySelector('.sidebar-list')) {
                let playerHtml = `
                    <div class="main-player-area">
                        <div class="video-item-main">
                            <iframe src="https://www.youtube.com/embed/${v[0].id.videoId}?rel=0" allowfullscreen></iframe>
                            <div class="main-title">${v[0].snippet.title}</div>
                        </div>
                    </div>`;

                let sidebarHtml = `
                    <div class="sidebar-wrapper">
                        <div class="sidebar-list">
                            ${v.slice(1).map(item => getCardHtml(item)).join('')}
                        </div>
                        <div class="load-more-container">
                            <button id="${CONFIG.buttonId}" onclick="loadYouTubeContent()">थप लोड गर्नुहोस्</button>
                        </div>
                    </div>`;

                container.innerHTML = playerHtml + sidebarHtml;
            } else {
                // लोड मोर थिच्दा लिष्टमा मात्र थप्ने
                const list = document.querySelector('.sidebar-list');
                v.forEach(item => {
                    const div = document.createElement('div');
                    div.innerHTML = getCardHtml(item);
                    list.appendChild(div.firstElementChild);
                });
                
                if (btn) btn.innerText = 'थप लोड गर्नुहोस्';
            }

            // यदि थप भिडियो छैन भने बटन हटाउने
            if (!nextPageToken && btn) btn.parentElement.remove();
        }
    } catch (err) {
        console.error('Error:', err);
        if (btn) btn.innerText = 'पुन: प्रयास गर्नुहोस्';
    }
}

// कार्यान्वयन
(function init() {
    injectStyles();
    // सुनिश्चित गर्ने कि कन्टेनर उपलब्ध छ
    window.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById(CONFIG.containerId)) {
            const div = document.createElement('div');
            div.id = CONFIG.containerId;
            document.body.appendChild(div);
        }
        loadYouTubeContent();
    });
})();
