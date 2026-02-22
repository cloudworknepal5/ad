/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 6,
    containerId: 'video-container'
};

let nextPageToken = '';

/**
 * २. क्लिन CSS Injection (Multi-function)
 * कुनै पनि रङ वा ब्याकग्राउन्ड नराखिएको मात्र लेआउट सेटिङ
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
        .video-item {
            width: 100%;
        }
        .video-item iframe {
            width: 100%;
            aspect-ratio: 16 / 9;
            border: none;
            display: block;
        }
        .video-title {
            display: block;
            padding: 10px 0;
            text-decoration: none;
            color: inherit; /* वेबसाइटको आफ्नै रङ लिने */
            font-size: 15px;
            font-weight: bold;
        }
        .load-more-wrapper {
            text-align: center;
            margin: 20px 0;
            width: 100%;
        }
        #btn-load-more {
            padding: 8px 20px;
            cursor: pointer;
            border: 1px solid #ccc;
            background: transparent;
            color: inherit;
        }
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
    
    // पहिलो पटक लोड हुँदा कन्टेनर र बटन तयार गर्ने
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const scriptTag = document.currentScript;
        if (scriptTag) scriptTag.parentNode.insertBefore(container, scriptTag);
        else document.body.appendChild(container);

        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'load-more-wrapper';
        loaderDiv.innerHTML = `<button id="btn-load-more">Load More</button>`;
        container.after(loaderDiv);
        
        document.getElementById('btn-load-more').addEventListener('click', loadYouTubeVideos);
    }

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

            // थप डेटा नभए बटन हटाउने
            if (!nextPageToken) {
                document.querySelector('.load-more-wrapper').remove();
            }
        }
    } catch (err) {
        console.error('Error fetching videos:', err);
    }
}

/**
 * ५. सुरुवात (Initialization)
 */
function init() {
    injectStyles();
    loadYouTubeVideos();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
