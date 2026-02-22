/**
 * १. कन्फिगरेसन डेटा
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 6,
    containerId: 'video-container'
};

/**
 * २. CSS Style Injection Function (Multi-function)
 * ३-कलम ग्रिड र डार्क थिम डिजाइन
 */
function injectStyles() {
    const css = `
        body {
            background-color: #000000 !important;
            margin: 0;
            padding: 0;
        }
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Roboto', Arial, sans-serif;
        }
        .video-item {
            background-color: #111111;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
            transition: transform 0.3s ease;
        }
        .video-item:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 20px rgba(255, 0, 0, 0.2);
        }
        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
        }
        .video-title {
            display: block;
            padding: 15px;
            text-decoration: none;
            color: #ffffff;
            font-size: 15px;
            font-weight: bold;
            text-align: left;
            line-height: 1.4;
            height: 42px;
            overflow: hidden;
        }
        .video-title:hover { color: #ff0000; }
        @media (max-width: 1024px) {
            #${CONFIG.containerId} { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; padding: 10px; }
        }
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
 * ४. डेटा फेच र प्रोसेसिङ फङ्सन
 */
async function loadYouTubeVideos() {
    // कन्टेनर छैन भने आफै बनाउने
    let container = document.getElementById(CONFIG.containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const scriptTag = document.currentScript;
        if (scriptTag) scriptTag.parentNode.insertBefore(container, scriptTag);
        else document.body.appendChild(container);
    }

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let html = '';
            data.items.forEach(item => {
                html += createVideoCard(item.id.videoId, item.snippet.title);
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p style="color:white; text-align:center;">कुनै भिडियो भेटिएन।</p>';
        }
    } catch (err) {
        console.error('Fetch error:', err);
        container.innerHTML = '<p style="color:white; text-align:center;">लोड गर्दा त्रुटि भयो।</p>';
    }
}

/**
 * ५. मुख्य नियन्त्रक (Initialization)
 */
function initWidget() {
    injectStyles();
    loadYouTubeVideos();
}

// सुरक्षित तरिकाले रन गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
} else {
    initWidget();
}
