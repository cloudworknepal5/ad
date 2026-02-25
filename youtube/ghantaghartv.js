/**
 * १. कन्फिगरेसन
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UC3-zHSIXFWEC-NgrTL98uXg',
    results: 6, // जम्मा ६ वटा भिडियो
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. CSS: बायाँ ५ भिडियो र दायाँ प्लेयर (Multi-column Layout)
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 350px 1fr; /* बायाँ ३५०px लिष्ट, दायाँ बाँकी भाग प्लेयर */
            grid-gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 15px;
            font-family: sans-serif;
        }
        
        /* बायाँ साइडको लिष्ट */
        .sidebar-list { 
            display: flex; 
            flex-direction: column; 
            gap: 12px; 
            order: 1; 
        }

        /* दायाँ साइडको मेन प्लेयर */
        .main-player-area { 
            order: 2; 
        }

        .video-item-main iframe { 
            width: 100%; 
            height: 480px; 
            background: #000; 
            border: none; 
            border-radius: 8px;
        }
        
        .main-title { 
            padding: 15px 0; 
            font-weight: bold; 
            font-size: 20px; 
            color: #111;
            line-height: 1.4;
        }

        .video-card { 
            display: flex; 
            gap: 10px; 
            cursor: pointer; 
            background: #f9f9f9; 
            border: 1px solid #eee; 
            padding: 8px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .video-card:hover { background: #efefef; transform: translateX(5px); }
        
        .thumb-box { 
            position: relative; 
            width: 120px; 
            aspect-ratio: 16/9; 
            flex-shrink: 0; 
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
        
        .play-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 24px; height: 24px; background: rgba(204, 0, 0, 0.9); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .play-overlay::after {
            content: ''; border-style: solid; border-width: 4px 0 4px 7px;
            border-color: transparent transparent transparent white; margin-left: 2px;
        }

        .title-box { 
            font-size: 13px; 
            font-weight: 600; 
            color: #333; 
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .load-more-wrapper { text-align: center; margin: 20px 0; width: 100%; }
        #${CONFIG.buttonId} { padding: 10px 25px; cursor: pointer; border: 1px solid #ddd; background: #fff; border-radius: 20px; font-weight: bold; }

        /* मोबाइल रेस्पोन्सिभ: प्लेयर माथि, लिष्ट तल */
        @media (max-width: 850px) {
            #${CONFIG.containerId} { 
                grid-template-columns: 1fr; 
            }
            .main-player-area { order: 1; }
            .sidebar-list { order: 2; }
            .video-item-main iframe { height: auto; aspect-ratio: 16 / 9; }
            .video-card { padding: 10px; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. मल्टि-फङ्सन: भिडियो प्ले गर्ने र मोबाइलमा माथि स्क्रोल गर्ने
 */
function playVideo(vId, vTitle) {
    const mainArea = document.querySelector('.main-player-area');
    const iframe = mainArea.querySelector('iframe');
    const titleDiv = mainArea.querySelector('.main-title');

    if (iframe) {
        // भिडियो परिवर्तन र अटोप्ले
        iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`;
        if (titleDiv) titleDiv.innerText = decodeURIComponent(vTitle);

        // मोबाइलमा क्लिक गरेपछि प्लेयर भएको ठाउँमा स्मूथ स्क्रोल
        if (window.innerWidth <= 850) {
            mainArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * ४. कार्ड जेनेरेटर
 */
function getSmallCardHtml(item) {
    if(!item) return '';
    const vId = item.id.videoId;
    const cleanTitle = encodeURIComponent(item.snippet.title).replace(/'/g, "%27");
    return `
        <div class="video-card" onclick="playVideo('${vId}', '${cleanTitle}')">
            <div class="thumb-box">
                <div class="play-overlay"></div>
                <img src="${item.snippet.thumbnails.medium.url}">
            </div>
            <div class="title-box">${item.snippet.title}</div>
        </div>`;
}

/**
 * ५. मुख्य लोड फङ्सन
 */
async function loadYouTubeContent() {
    let container = document.getElementById(CONFIG.containerId);
    let btn = document.getElementById(CONFIG.buttonId);
    
    // कन्टेनर नभए बनाउने
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            const v = data.items;
            
            // नयाँ लेआउट संरचना
            let sidebarHtml = '<div class="sidebar-list">';
            // १ देखि ५ सम्मका भिडियोहरू बायाँ साइडबारमा
            for(let i=1; i<v.length; i++) {
                sidebarHtml += getSmallCardHtml(v[i]);
            }
            sidebarHtml += '</div>';

            let playerHtml = `
                <div class="main-player-area">
                    <div class="video-item-main">
                        <iframe src="https://www.youtube.com/embed/${v[0].id.videoId}?rel=0" allowfullscreen></iframe>
                        <div class="main-title">${v[0].snippet.title}</div>
                    </div>
                </div>`;

            container.innerHTML = sidebarHtml + playerHtml;
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

// सुरु गर्ने
(function init() {
    injectStyles();
    loadYouTubeContent();
})();
