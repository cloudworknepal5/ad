/**
 * १. कन्फिगरेसन र ग्लोबल सेटिङ्स
 */
const YT_WIDGET_CONFIG = {
    API_KEY: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    CHANNEL_ID: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    MAX_RESULTS: 6,
    CONTAINER_ID: 'video-container' // तपाईंले HTML मा यो ID प्रयोग गर्न सक्नुहुन्छ
};

/**
 * २. CSS Style Injection Function (Multi-function)
 * ३-कलम ग्रिड र रेस्पोन्सिभ डिजाइन
 */
function injectStyles() {
    const css = `
        #${YT_WIDGET_CONFIG.CONTAINER_ID} {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 20px 0;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .video-item {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .video-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
        }

        .video-title {
            padding: 12px;
            font-size: 14px;
            color: #333;
            text-decoration: none;
            font-weight: 600;
            line-height: 1.4;
            display: block;
            background: #fff;
        }

        .video-title:hover { color: #ff0000; }

        /* ट्याब्लेटका लागि २ कलम */
        @media (max-width: 1024px) {
            #${YT_WIDGET_CONFIG.CONTAINER_ID} { grid-template-columns: repeat(2, 1fr); }
        }

        /* मोबाइलका लागि १ कलम */
        @media (max-width: 768px) {
            #${YT_WIDGET_CONFIG.CONTAINER_ID} { 
                grid-template-columns: 1fr; 
                padding: 10px; 
            }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. HTML Container व्यवस्थापन फङ्सन (DIV Option)
 * यसले पहिले नै भएको div खोज्छ, नभए नयाँ बनाउँछ।
 */
function getOrCreateContainer() {
    let container = document.getElementById(YT_WIDGET_CONFIG.CONTAINER_ID);
    
    if (!container) {
        // यदि HTML मा div छैन भने आफै बनाउने (Auto-inject)
        container = document.createElement('div');
        container.id = YT_WIDGET_CONFIG.CONTAINER_ID;
        
        // स्क्रिप्ट ट्याग भएको ठाउँमा सिधै हाल्ने
        if (document.currentScript) {
            document.currentScript.parentNode.insertBefore(container, document.currentScript);
        } else {
            document.body.appendChild(container);
        }
    }
    return container;
}

/**
 * ४. डेटा तान्ने र भिडियो रेन्डर गर्ने फङ्सन
 */
async function fetchAndRenderVideos() {
    const container = getOrCreateContainer();
    const url = `https://www.googleapis.com/youtube/v3/search?key=${YT_WIDGET_CONFIG.API_KEY}&channelId=${YT_WIDGET_CONFIG.CHANNEL_ID}&part=snippet,id&order=date&maxResults=${YT_WIDGET_CONFIG.MAX_RESULTS}&type=video`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            container.innerHTML = data.items.map(video => `
                <div class="video-item">
                    <iframe src="https://www.youtube.com/embed/${video.id.videoId}?rel=0" allowfullscreen loading="lazy"></iframe>
                    <a class="video-title" href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                        ${video.snippet.title}
                    </a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">कुनै सार्वजनिक भिडियो फेला परेन।</p>';
        }
    } catch (error) {
        console.error('YouTube API Error:', error);
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">भिडियो लोड गर्दा समस्या भयो।</p>';
    }
}

/**
 * ५. नियन्त्रक फङ्सन (Initialization)
 */
function initYouTubeWidget() {
    injectStyles();
    fetchAndRenderVideos();
}

// पेज पूर्ण लोड भएपछि मात्र चलाउने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouTubeWidget);
} else {
    initYouTubeWidget();
}
