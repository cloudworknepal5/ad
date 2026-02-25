/**
 * १. कन्फिगरेसन
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk',
    channelId: 'UC3-zHSIXFWEC-NgrTL98uXg',
    results: 6, 
    containerId: 'video-container'
};

/**
 * २. परिमार्जित CSS (दायाँ लिष्ट र बायाँ प्लेयर)
 */
function injectStyles() {
    const css = `
        #${CONFIG.containerId} {
            display: grid;
            grid-template-columns: 1.8fr 1.2fr; /* बायाँ प्लेयर ठूलो, दायाँ लिष्ट सानो */
            grid-gap: 20px;
            max-width: 1200px;
            margin: 20px auto;
            padding: 10px;
            align-items: start; /* दुवैलाई माथिबाट बराबर बनाउन */
        }
        
        .main-player-area { order: 1; }
        .sidebar-list { 
            order: 2; 
            display: flex; 
            flex-direction: column; 
            gap: 10px; 
            max-height: 400px; /* लिष्टको उचाइ नियन्त्रण */
            overflow-y: auto; 
            padding-right: 5px;
        }

        /* मेन प्लेयरको हाइट घटाउन यहाँ एडजस्ट गरिएको छ */
        .video-item-main iframe { 
            width: 100%; 
            height: 380px; /* हाइट अलि घटाइएको */
            background: #000; 
            border: none; 
            border-radius: 4px;
            display: block;
        }
        
        .main-title { 
            padding: 10px 0; 
            font-weight: bold; 
            font-size: 18px; 
            color: #222;
            border-bottom: 1px solid #eee;
        }

        .video-card { 
            display: flex; 
            gap: 10px; 
            cursor: pointer; 
            background: #fff; 
            border: 1px solid #f0f0f0; 
            padding: 6px;
            align-items: center;
            transition: background 0.2s;
        }
        
        .video-card:hover { background: #f9f9f9; }
        
        .thumb-box { 
            position: relative; 
            width: 110px; 
            aspect-ratio: 16/9; 
            flex-shrink: 0; 
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .play-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 22px; height: 22px; background: rgba(255, 0, 0, 0.8); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .play-overlay::after {
            content: ''; border-style: solid; border-width: 3px 0 3px 6px;
            border-color: transparent transparent transparent white; margin-left: 1px;
        }

        .title-box { 
            font-size: 12px; 
            font-weight: 600; 
            color: #333; 
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* मोबाइल रेस्पोन्सिभ */
        @media (max-width: 850px) {
            #${CONFIG.containerId} { 
                grid-template-columns: 1fr; 
            }
            .video-item-main iframe { height: auto; aspect-ratio: 16 / 9; }
            .sidebar-list { max-height: none; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. मल्टि-फङ्सन: प्लेयर अपडेट र स्क्रोलिङ
 */
function playVideo(vId, vTitle) {
    const mainArea = document.querySelector('.main-player-area');
    const iframe = mainArea.querySelector('iframe');
    const titleDiv = mainArea.querySelector('.main-title');

    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`;
        if (titleDiv) titleDiv.innerText = decodeURIComponent(vTitle);

        // मोबाइलमा क्लिक गरेपछि स्मूथ स्क्रोल
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
 * ५. मुख्य फेच फङ्सन
 */
async function loadYouTubeContent() {
    let container = document.getElementById(CONFIG.containerId);
    
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const v = data.items;
            
            // बायाँ मेन प्लेयर
            let playerHtml = `
                <div class="main-player-area">
                    <div class="video-item-main">
                        <iframe src="https://www.youtube.com/embed/${v[0].id.videoId}?rel=0" allowfullscreen></iframe>
                        <div class="main-title">${v[0].snippet.title}</div>
                    </div>
                </div>`;

            // दायाँ साइडबार (बाँकी ५ भिडियो)
            let sidebarHtml = '<div class="sidebar-list">';
            for(let i=1; i < v.length; i++) {
                sidebarHtml += getSmallCardHtml(v[i]);
            }
            sidebarHtml += '</div>';

            container.innerHTML = playerHtml + sidebarHtml;
        }
    } catch (err) {
        console.error('Error:', err);
        container.innerHTML = '<p style="text-align:center;">भिडियो लोड गर्न सकिएन ।</p>';
    }
}

// कार्यान्वयन
(function init() {
    injectStyles();
    loadYouTubeContent();
})();
