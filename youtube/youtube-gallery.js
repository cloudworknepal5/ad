/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UCnaM-zAbh_-I4Bsd9Yqyjvg',
    results: 7, 
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. परिमार्जित CSS (प्ले बटन र लेआउट)
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 1.8fr 1.2fr;
            grid-gap: 15px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 10px;
            align-items: start;
        }
        
        .video-item-main { grid-column: 1 / 2; display: flex; flex-direction: column; }
        .video-item-main iframe { width: 100%; height: 285px; background: #000; border: none; display: block; }

        /* साना भिडियोहरूको लागि कन्टेनर */
        .sidebar-videos { display: flex; flex-direction: column; gap: 10px; }
        
        /* थम्बनेल र प्ले बटनको डिजाइन */
        .video-thumb-wrapper {
            position: relative;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #000;
        }
        
        /* प्ले बटन आइकन (CSS बाट बनाइएको) */
        .play-icon {
            position: absolute;
            width: 30px;
            height: 30px;
            background: rgba(255, 0, 0, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: 0.3s;
        }
        .play-icon::after {
            content: '';
            border-style: solid;
            border-width: 5px 0 5px 8px;
            border-color: transparent transparent transparent white;
            margin-left: 2px;
        }
        
        .side-item:hover .play-icon, .bottom-item:hover .play-icon {
            background: #ff0000;
            transform: scale(1.1);
        }

        .side-item { display: flex; gap: 12px; cursor: pointer; height: 85px; align-items: center; }
        .side-thumb { width: 150px; height: 80px; object-fit: cover; border: 1px solid #eee; }
        
        .side-title {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }

        .bottom-videos {
            grid-column: 1 / 3;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 5px;
        }
        .bottom-item { cursor: pointer; }
        .bottom-item img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; display: block; }

        .main-t { padding: 8px 0; font-weight: bold; font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .load-more-wrapper { text-align: center; margin: 20px 0; width: 100%; clear: both; }
        #${CONFIG.buttonId} { padding: 8px 20px; cursor: pointer; border: 1px solid #ccc; background: #fff; }

        @media (max-width: 850px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; }
            .video-item-main, .bottom-videos { grid-column: 1 / -1; }
            .video-item-main iframe { height: auto; aspect-ratio: 16/9; }
            .bottom-videos { grid-template-columns: 1fr 1fr; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. भिडियो स्विच गर्ने फङ्सन (Multi-function)
 */
function playThisVideo(videoId, title) {
    const mainPlayer = document.querySelector('.video-item-main iframe');
    const mainTitle = document.querySelector('.video-item-main .main-t');
    if (mainPlayer) {
        mainPlayer.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
        if(mainTitle) mainTitle.innerText = title;
        window.scrollTo({ top: document.getElementById(CONFIG.containerId).offsetTop - 20, behavior: 'smooth' });
    }
}

/**
 * ४. डेटा लोड र रेन्डर गर्ने मुख्य फङ्सन
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

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            const videos = data.items;
            
            // १. मुख्य भिडियो
            const first = videos[0];
            let mainHtml = `
                <div class="video-item-main">
                    <iframe src="https://www.youtube.com/embed/${first.id.videoId}?rel=0" allowfullscreen></iframe>
                    <div class="main-t">${first.snippet.title}</div>
                </div>`;

            // २. साइडका ३ भिडियो (४, ५, ६ नम्बर)
            let sideHtml = '<div class="sidebar-videos">';
            for(let i=3; i<6; i++) {
                if(videos[i]) {
                    sideHtml += `
                        <div class="side-item" onclick="playThisVideo('${videos[i].id.videoId}', '${videos[i].snippet.title.replace(/'/g, "\\'")}')">
                            <div class="video-thumb-wrapper" style="width:150px; height:80px;">
                                <div class="play-icon"></div>
                                <img class="side-thumb" src="${videos[i].snippet.thumbnails.medium.url}" style="width:100%; height:100%;">
                            </div>
                            <div class="side-title">${videos[i].snippet.title}</div>
                        </div>`;
                }
            }
            sideHtml += '</div>';

            // ३. तल्लो ३ भिडियो (२, ३, ७ नम्बर)
            let bottomIndices = [1, 2, 6]; 
            let bottomHtml = '<div class="bottom-videos">';
            bottomIndices.forEach(idx => {
                if(videos[idx]) {
                    bottomHtml += `
                        <div class="bottom-item" onclick="playThisVideo('${videos[idx].id.videoId}', '${videos[idx].snippet.title.replace(/'/g, "\\'")}')">
                            <div class="video-thumb-wrapper">
                                <div class="play-icon" style="width:40px; height:40px;"></div>
                                <img src="${videos[idx].snippet.thumbnails.medium.url}">
                            </div>
                            <div class="side-title" style="margin-top:5px;">${videos[idx].snippet.title}</div>
                        </div>`;
                }
            });
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
