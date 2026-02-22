/**
 * १. CSS Styles Injection
 */
function injectStyles() {
    const css = `
        .yt-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            padding: 20px 0;
            max-width: 1200px;
            margin: 0 auto;
        }
        .yt-video-item {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            background: #000;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        .yt-video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
        }
        @media (max-width: 768px) {
            .yt-grid { grid-template-columns: 1fr; padding: 10px; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * २. भिडियो ID निकाल्ने सुरक्षित तरिका (Regex Method)
 * Error 153 हटाउन यो महत्वपूर्ण छ।
 */
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * ३. HTML Template Function
 */
function createVideoHTML(videoID) {
    if (!videoID) return '';
    return `
        <div class="yt-video-item">
            <iframe 
                src="https://www.youtube.com/embed/${videoID}?rel=0&modestbranding=1" 
                allowfullscreen 
                loading="lazy">
            </iframe>
        </div>`;
}

/**
 * ४. Main Controller & Data Fetching
 */
async function fetchYouTubeFeed() {
    const CHANNEL_ID = 'UCnaM-zAbh_-I4Bsd9Yqyjvg'; 
    const MAX_VIDEOS = 6;
    const feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedURL)}`;

    // 'youtube-feed' div छ कि छैन चेक गर्ने, नभए बनाउने
    let container = document.getElementById('youtube-feed');
    if (!container) {
        container = document.createElement('div');
        container.id = 'youtube-feed';
        // जहाँ स्क्रिप्ट छ त्यहीँ भिडियो देखाउन
        const currentScript = document.currentScript;
        if (currentScript) {
            currentScript.parentNode.insertBefore(container, currentScript);
        } else {
            document.body.appendChild(container);
        }
    }
    container.classList.add('yt-grid');

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.status === 'ok' && data.items) {
            let htmlContent = '';
            const items = data.items.slice(0, MAX_VIDEOS);
            
            items.forEach(item => {
                const videoID = getYouTubeID(item.link);
                if (videoID) {
                    htmlContent += createVideoHTML(videoID);
                }
            });
            container.innerHTML = htmlContent || 'कुनै भिडियो फेला परेन।';
        } else {
            container.innerHTML = 'फिड लोड गर्न सकिएन।';
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        container.innerHTML = 'प्राविधिक समस्या देखियो।';
    }
}

/**
 * ५. Execution logic
 */
function initFeed() {
    injectStyles();
    fetchYouTubeFeed();
}

// सुरक्षित तरिकाले स्क्रिप्ट लोड गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeed);
} else {
    initFeed();
}
