/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 6, // एक पटकमा कतिवटा लोड गर्ने
    containerId: 'video-container'
};

let nextPageToken = ''; // अर्को पेजको डेटाको लागि टोकन

/**
 * २. न्यूनतम CSS Injection (Multi-function)
 * अनावश्यक ब्याकग्राउन्ड र फन्टहरू हटाइएको छ।
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
        .video-item { overflow: hidden; }
        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
            border-radius: 8px;
        }
        .video-title {
            display: block;
            padding: 10px 0;
            text-decoration: none;
            color: inherit; /* वेबसाइटको फन्ट रङ लिने */
            font-size: 15px;
            font-weight: bold;
        }
        .load-more-wrapper {
            text-align: center;
            margin: 30px 0;
            width: 100%;
        }
        .btn-load-more {
            padding: 10px 25px;
            cursor: pointer;
            background: #ff0000;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-weight: bold;
        }
        @media (max-width: 1024px) { #${CONFIG.containerId} { grid-template-columns: repeat(2, 1fr); } }
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
 * ४. डेटा फेच र लोड मोर प्रोसेसिङ (Multi-function)
 */
async function loadYouTubeVideos() {
    let container = document.getElementById(CONFIG.containerId);
    
    // कन्टेनर र बटन बनाउने
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const scriptTag = document.currentScript;
        if (scriptTag) scriptTag.parentNode.insertBefore(container, scriptTag);
        else document.body.appendChild(container);

        // Load More बटनको ढाँचा
        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'load-more-wrapper';
        loaderDiv.innerHTML = `<button id="btn-load-more" class="btn-load-more">Load More</button>`;
        container.after(loaderDiv);
        
        document.getElementById('btn-load-more').addEventListener('click', loadYouTubeVideos);
    }

    const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${pageParam}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || ''; // अर्को पटकको लागि टोकन सेभ गर्ने
            
            let html = '';
            data.items.forEach(item => {
                html += createVideoCard(item.id.videoId, item.snippet.title);
            });
            
            container.insertAdjacentHTML('beforeend', html);

            // यदि थप भिडियो छैन भने बटन लुकाउने
            if (!nextPageToken) {
                document.querySelector('.load-more-wrapper').style.display = 'none';
            }
        }
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

/**
 * ५. मुख्य नियन्त्रक
 */
function initWidget() {
    injectStyles();
    loadYouTubeVideos();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
} else {
    initWidget();
}
