/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 1, // एक पटकमा एउटा मात्र पोष्ट देखाउन
    containerId: 'audio-container'
};

let nextPageToken = '';

/**
 * २. CSS Injection (Multi-function)
 * हेडलाइनलाई एक लाइनमा मात्र सीमित गरिएको छ।
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            max-width: 600px; /* एउटा पोष्टको लागि उपयुक्त चौडाइ */
            margin: 0 auto;
        }
        .audio-item {
            display: flex;
            flex-direction: column;
            padding: 15px 0;
            border-bottom: 1px solid #ddd;
        }
        .audio-title {
            font-size: 15px;
            font-weight: bold;
            color: inherit;
            text-decoration: none;
            margin-bottom: 10px;
            /* हेडलाइनलाई एक लाइनमा मात्र देखाउन */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }
        .controls-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .play-btn {
            width: 20px;
            height: 20px;
            min-width: 20px;
            border: 1px solid #333;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        .yt-wrapper {
            width: 120px;
            height: 30px;
            overflow: hidden;
            position: relative;
        }
        .yt-wrapper iframe {
            position: absolute;
            top: -325px; /* भोल्युम बार तानेको */
            left: -10px;
            width: 500px;
            height: 400px;
            border: none;
        }
        .load-more-wrapper { text-align: center; margin: 20px 0; }
        #btn-load-more { 
            cursor: pointer; 
            background: #f8f8f8; 
            border: 1px solid #ccc; 
            padding: 8px 20px;
            font-size: 14px;
        }
        #btn-load-more:hover { background: #eee; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. अडियो कन्ट्रोल फङ्सन
 */
window.toggleAudio = function(btn, videoId) {
    const frame = document.getElementById('frame-' + videoId);
    const wrapper = document.getElementById('wrapper-' + videoId);
    const isPlaying = btn.classList.contains('playing');

    if (!isPlaying) {
        wrapper.style.display = 'block';
        frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
        btn.innerHTML = '⏸';
        btn.classList.add('playing');
        btn.style.background = '#ff0000';
        btn.style.color = '#fff';
    } else {
        frame.src = '';
        btn.innerHTML = '▶';
        btn.classList.remove('playing');
        btn.style.background = 'transparent';
        btn.style.color = 'inherit';
        wrapper.style.display = 'none';
    }
};

/**
 * ४. UI रेन्डर फङ्सन
 */
function createAudioCard(id, title) {
    return `
        <div class="audio-item">
            <a class="audio-title" title="${title}" href="https://www.youtube.com/watch?v=${id}" target="_blank">${title}</a>
            <div class="controls-row">
                <button class="play-btn" onclick="toggleAudio(this, '${id}')">▶</button>
                <div class="yt-wrapper" id="wrapper-${id}" style="display:none;">
                    <iframe id="frame-${id}" src="" allow="autoplay"></iframe>
                </div>
            </div>
        </div>`;
}

/**
 * ५. मुख्य लोड फङ्सन
 */
async function loadYouTubeAudio() {
    let container = document.getElementById(CONFIG.containerId);
    let btn = document.getElementById('btn-load-more');
    
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);

        const loaderDiv = document.createElement('div');
        loaderDiv.className = 'load-more-wrapper';
        loaderDiv.innerHTML = `<button id="btn-load-more">अर्को लोड गर्नुहोस् (Load More)</button>`;
        container.after(loaderDiv);
        btn = document.getElementById('btn-load-more');
        btn.addEventListener('click', loadYouTubeAudio);
    }

    btn.innerText = 'लोड हुँदैछ...';

    const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${pageParam}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            let html = createAudioCard(data.items[0].id.videoId, data.items[0].snippet.title);
            container.insertAdjacentHTML('beforeend', html);
            btn.innerText = 'अर्को लोड गर्नुहोस्';
            
            if (!nextPageToken) btn.parentElement.remove();
        }
    } catch (err) {
        console.error('Error:', err);
        btn.innerText = 'पुनः प्रयास गर्नुहोस्';
    }
}

// कार्यान्वयन
injectStyles();
loadYouTubeAudio();
