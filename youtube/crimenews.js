/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 6,
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. क्लिन CSS Injection
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .video-item { width: 100%; }
        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
            background: #eee;
        }
        .video-title {
            display: block;
            padding: 10px 0;
            text-decoration: none;
            color: inherit;
            font-size: 15px;
            font-weight: bold;
        }
        .load-more-wrapper {
            text-align: center;
            margin: 30px 0;
            width: 100%;
            clear: both;
        }
        #${CONFIG.buttonId} {
            padding: 10px 25px;
            cursor: pointer;
            border: 1px solid #ccc;
            background: transparent;
            color: inherit;
            font-size: 16px;
            transition: 0.3s;
        }
        #${CONFIG.buttonId}:hover { background: #f0f0f0; border-color: #999; }
        @media (max-width: 992px) { #${CONFIG.containerId} { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { #${CONFIG.containerId} { grid-template-columns: 1fr; } }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. UI रेन्डर फङ्सन
 */
function createVideoCard(id, title) {
    return `
        <div class="video-item">
            <iframe src="https://www.youtube.com/embed/${id}?rel=0" allowfullscreen></iframe>
            <a class="video-title" href="https://www.youtube.com/watch?v=${id}" target="_blank">
                ${title}
            </a>
        </div>`;
}

/**
 * ४. डेटा लोड गर्ने मुख्य फङ्सन (Multi-function)
 */
async function loadYouTubeVideos() {
    let container = document.getElementById(CONFIG.containerId);
    let btn = document.getElementById(CONFIG.buttonId);
    
    // १. यदि कन्टेनर छैन भने बनाउने (वर्डप्रेस सुरक्षाको लागि)
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    // २. यदि बटन छैन भने बनाउने
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
            
            let html = '';
            data.items.forEach(item => {
                if(item.id.videoId) {
                    html += createVideoCard(item.id.videoId, item.snippet.title);
                }
            });
            
            container.insertAdjacentHTML('beforeend', html);
            btn.innerText = 'Load More';

            // थप डेटा नभए बटन हटाउने
            if (!nextPageToken) {
                btn.parentElement.remove();
            }
        } else {
            btn.innerText = 'No more videos';
        }
    } catch (err) {
        console.error('Error fetching videos:', err);
        btn.innerText = 'Try Again';
    }
}

/**
 * ५. सुरु गर्ने (Initialization)
 */
function init() {
    injectStyles();
    loadYouTubeVideos();
}

// वर्डप्रेसमा सुरक्षित तरिकाले लोड गर्न
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}
