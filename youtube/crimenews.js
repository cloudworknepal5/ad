/**
 * १. कन्फिगरेसन
 */
const YT_CONFIG = {
    API_KEY: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    CHANNEL_ID: 'UCfUTicHKti23x6s6KPWtSmQ',
    MAX_RESULTS: 6, // ३ को गुणाङ्क (३, ६, ९) राख्दा राम्रो देखिन्छ
    CONTAINER_ID: 'video-container'
};

/**
 * २. CSS Styles Injection (Multi-function)
 * ३-कलम लेआउटको लागि सुधार गरिएको डिजाइन
 */
function injectStyles() {
    const css = `
        #${YT_CONFIG.CONTAINER_ID} {
            display: grid;
            grid-template-columns: repeat(3, 1fr); /* मुख्य ३-कलम ग्रिड */
            gap: 20px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .video-item {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .video-item:hover {
            transform: translateY(-5px);
        }

        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
        }

        .video-title {
            padding: 12px;
            font-size: 14px;
            color: #333;
            text-decoration: none;
            font-weight: 600;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* २ लाइन भन्दा बढी भएमा ... देखाउने */
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* ट्याब्लेटको लागि २ कलम (१०२४px भन्दा कम) */
        @media (max-width: 1024px) {
            #${YT_CONFIG.CONTAINER_ID} { grid-template-columns: repeat(2, 1fr); }
        }

        /* मोबाइलको लागि १ कलम (७६८px भन्दा कम) */
        @media (max-width: 768px) {
            #${YT_CONFIG.CONTAINER_ID} { grid-template-columns: 1fr; padding: 10px; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. भिडियोको HTML एलिमेन्ट बनाउने फङ्सन
 */
function createVideoElement(videoId, title) {
    const videoItem = document.createElement('div');
    videoItem.classList.add('video-item');
    videoItem.innerHTML = `
        <iframe allowfullscreen src="https://www.youtube.com/embed/${videoId}?rel=0"></iframe>
        <a class="video-title" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" title="${title}">${title}</a>
    `;
    return videoItem;
}

/**
 * ४. डेटा लोड गर्ने मुख्य फङ्सन
 */
async function loadVideos() {
    let container = document.getElementById(YT_CONFIG.CONTAINER_ID);
    if (!container) {
        container = document.createElement('div');
        container.id = YT_CONFIG.CONTAINER_ID;
        document.currentScript ? document.currentScript.parentNode.insertBefore(container, document.currentScript) : document.body.appendChild(container);
    }

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${YT_CONFIG.API_KEY}&channelId=${YT_CONFIG.CHANNEL_ID}&part=snippet,id&order=date&maxResults=${YT_CONFIG.MAX_RESULTS}&type=video`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items) {
            container.innerHTML = '';
            data.items.forEach(video => {
                const element = createVideoElement(video.id.videoId, video.snippet.title);
                container.appendChild(element);
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        container.innerHTML = '<p>भिडियो लोड गर्न सकिएन।</p>';
    }
}

/**
 * ५. सुरुवात (Initialization)
 */
function init() {
    injectStyles();
    loadVideos();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
