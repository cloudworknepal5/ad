/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 7, // इमेज अनुसार ७ वटा भिडियो देखाउन ७ बनाइएको
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. क्लिन CSS Injection (इमेज अनुसारको लेआउट)
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 2fr 1fr; /* मुख्य भिडियो ठुलो र साइडमा साना */
            grid-gap: 15px;
            max-width: 1100px;
            margin: 0 auto;
            padding: 10px;
        }
        
        /* पहिलो भिडियोको लागि ठुलो स्पेस */
        .video-item-main {
            grid-column: 1 / 2;
            grid-row: 1 / 3;
        }
        
        /* साना भिडियोहरूको ग्रुपिङ */
        .sidebar-videos {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .bottom-videos {
            grid-column: 1 / 3;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .video-item { 
            cursor: pointer;
            border: 1px solid #ddd;
            padding: 5px;
            background: #fff;
        }
        
        .video-item iframe, .video-item-main iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
            background: #000;
        }
        
        .video-title {
            display: block;
            padding: 5px 0;
            text-decoration: none;
            color: #333;
            font-size: 13px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .load-more-wrapper { text-align: center; margin: 30px 0; width: 100%; }
        #${CONFIG.buttonId} { padding: 10px 25px; cursor: pointer; border: 1px solid #ccc; background: #f9f9f9; transition: 0.3s; }
        
        @media (max-width: 768px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; }
            .video-item-main, .bottom-videos { grid-column: 1 / -1; }
            .bottom-videos { grid-template-columns: 1fr 1fr; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. भिडियो स्विच गर्ने फङ्सन
 */
function playThisVideo(videoId) {
    const mainPlayer = document.querySelector('.video-item-main iframe');
    if (mainPlayer) {
        mainPlayer.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
        window.scrollTo({ top: document.getElementById(CONFIG.containerId).offsetTop - 20, behavior: 'smooth' });
    }
}

/**
 * ४. डेटा लोड गर्ने मुख्य फङ्सन (Multi-function)
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

    const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${pageParam}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            
            // नयाँ डेटा आउँदा पुरानो सफा नगर्ने तर स्ट्रक्चर मिलाउने
            const videos = data.items;
            
            // पहिलो मुख्य भिडियो (पहिले लोड भएको छैन भने मात्र)
            let mainHtml = '';
            if (!container.querySelector('.video-item-main')) {
                const first = videos[0];
                mainHtml = `
                    <div class="video-item-main">
                        <iframe src="https://www.youtube.com/embed/${first.id.videoId}?rel=0" allowfullscreen></iframe>
                        <div class="video-title" style="font-size:18px">${first.snippet.title}</div>
                    </div>`;
            }

            // साइड र तलका भिडियोहरू
            let sideHtml = '<div class="sidebar-videos">';
            let bottomHtml = '<div class="bottom-videos">';
            
            videos.forEach((item, index) => {
                // पहिलो पटक लोड हुँदा ० इन्डेक्स मुख्यमा गयो, बाँकी साइड र तल
                if (index > 0 && index <= 3) {
                    sideHtml += `
                        <div class="video-item" onclick="playThisVideo('${item.id.videoId}')">
                            <img src="${item.snippet.thumbnails.medium.url}" style="width:100%">
                            <div class="video-title">${item.snippet.title}</div>
                        </div>`;
                } else if (index > 3) {
                    bottomHtml += `
                        <div class="video-item" onclick="playThisVideo('${item.id.videoId}')">
                            <img src="${item.snippet.thumbnails.medium.url}" style="width:100%">
                            <div class="video-title">${item.snippet.title}</div>
                        </div>`;
                }
            });

            sideHtml += '</div>';
            bottomHtml += '</div>';
            
            container.innerHTML = mainHtml + sideHtml + bottomHtml;
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
