/**
 * १. कन्फिगरेसन र ग्लोबल स्टेट
 */
const CONFIG = {
    apiKey: 'AIzaSyAh5DKuOvbRcLEF3IFdq_XjeFGseKy5LWk', // पक्का गर्नुहोस् यो की सक्रिय छ
    channelId: 'UC3-zHSIXFWEC-NgrTL98uXg',
    results: 10, // थप भिडियोहरूका लागि थोरै बढाइएको
    containerId: 'video-container',
    buttonId: 'btn-load-more'
};

let nextPageToken = '';

/**
 * २. CSS (मोबाइल र डेस्कटप दुवैका लागि अनुकूलित)
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
        }
        
        .video-item-main { grid-column: 1 / 2; position: relative; }
        .video-item-main iframe { 
            width: 100%; 
            height: 450px; 
            background: #000; 
            border: none; 
            display: block;
        }
        
        .main-title { 
            padding: 12px 0; 
            font-weight: bold; 
            font-size: 18px; 
            border-bottom: 2px solid #f1f1f1; 
            margin-bottom: 10px;
        }

        .sidebar-section { display: flex; flex-direction: column; gap: 10px; }

        .bottom-section { 
            grid-column: 1 / 3; 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 15px; 
            margin-top: 15px;
        }

        .video-card { 
            display: flex; 
            gap: 10px; 
            cursor: pointer; 
            background: #fff; 
            border: 1px solid #eee; 
            padding: 8px;
            transition: background 0.2s;
        }
        
        .video-card:hover { background: #f9f9f9; }
        
        .thumb-box { 
            position: relative; 
            width: 120px; 
            aspect-ratio: 16/9; 
            flex-shrink: 0; 
            background: #000; 
        }
        .thumb-box img { width: 100%; height: 100%; object-fit: cover; }
        
        .play-overlay {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 25px; height: 25px; background: rgba(255,0,0,0.9); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; z-index: 2;
        }
        .play-overlay::after {
            content: ''; border-style: solid; border-width: 4px 0 4px 7px;
            border-color: transparent transparent transparent white; margin-left: 2px;
        }

        .title-box { 
            font-size: 13px; 
            font-weight: 600; 
            color: #222; 
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .load-more-wrapper { text-align: center; margin: 30px 0; width: 100%; }
        #${CONFIG.buttonId} { 
            padding: 12px 30px; 
            cursor: pointer; 
            border: none; 
            background: #cc0000; 
            color: white; 
            font-weight: bold; 
            border-radius: 50px; 
        }

        /* मोबाइल रेस्पोन्सिभ */
        @media (max-width: 850px) {
            #${CONFIG.containerId} { grid-template-columns: 1fr; }
            .video-item-main, .sidebar-section, .bottom-section { grid-column: 1 / -1; }
            .video-item-main iframe { height: auto; aspect-ratio: 16 / 9; }
            .bottom-section { grid-template-columns: 1fr; }
            .video-card { padding: 10px; }
            .thumb-box { width: 130px; }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}

/**
 * ३. मल्टि-फङ्सन: भिडियो प्ले गर्ने र मोबाइलमा स्क्रोल गर्ने
 */
function playInMain(videoId, title) {
    const mainSection = document.querySelector('.video-item-main');
    const player = mainSection.querySelector('iframe');
    const playerTitle = mainSection.querySelector('.main-title');

    if (player) {
        // भिडियोको URL अपडेट (autoplay=1 ले तुरुन्तै सुरु गर्छ)
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        
        if(playerTitle) playerTitle.innerText = decodeURIComponent(title);
        
        // मोबाइलको लागि विशेष स्क्रोलिङ लजिक
        if (window.innerWidth <= 850) {
            mainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // डेस्कटपमा पनि थोरै माथि सार्न मन लागेमा
            window.scrollTo({ top: mainSection.offsetTop - 20, behavior: 'smooth' });
        }
    }
}

/**
 * ४. कार्ड जेनेरेटर (Multi-functional Template)
 */
function createVideoCard(item) {
    if(!item || !item.id.videoId) return '';
    
    const vId = item.id.videoId;
    // टाइटलमा हुने स्पेसल क्यारेक्टरहरू हटाउन/ह्यान्डल गर्न
    const rawTitle = item.snippet.title;
    const cleanTitle = encodeURIComponent(rawTitle).replace(/'/g, "%27");

    return `
        <div class="video-card" onclick="playInMain('${vId}', '${cleanTitle}')">
            <div class="thumb-box">
                <div class="play-overlay"></div>
                <img src="${item.snippet.thumbnails.medium.url}" alt="thumbnail">
            </div>
            <div class="title-box">${rawTitle}</div>
        </div>`;
}

/**
 * ५. डेटा फेच र रेन्डर गर्ने फङ्सन
 */
async function loadYouTubeVideos() {
    let container = document.getElementById(CONFIG.containerId);
    let btn = document.getElementById(CONFIG.buttonId);
    
    // कन्टेनर सेटअप
    if (!container) {
        container = document.createElement('div');
        container.id = CONFIG.containerId;
        const currentScript = document.currentScript || document.scripts[document.scripts.length - 1];
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    // लोड मोर बटन सेटअप
    if (!btn) {
        const loaderWrapper = document.createElement('div');
        loaderWrapper.className = 'load-more-wrapper';
        loaderWrapper.innerHTML = `<button id="${CONFIG.buttonId}">थप भिडियोहरू</button>`;
        container.after(loaderWrapper);
        btn = document.getElementById(CONFIG.buttonId);
        btn.onclick = loadYouTubeVideos;
    }

    btn.innerText = 'लोड हुँदैछ...';

    const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.apiKey}&channelId=${CONFIG.channelId}&part=snippet,id&order=date&maxResults=${CONFIG.results}&type=video${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            nextPageToken = data.nextPageToken || '';
            const v = data.items;
            
            // पहिलो पटक लोड हुँदा मात्र मेन प्लेयर सेट गर्ने
            let html = '';
            if (container.innerHTML === '') {
                html += `
                    <div class="video-item-main">
                        <iframe src="https://www.youtube.com/embed/${v[0].id.videoId}?rel=0" allowfullscreen></iframe>
                        <div class="main-title">${v[0].snippet.title}</div>
                    </div>`;

                // साइडबार (भिडियो २-५ सम्म)
                html += '<div class="sidebar-section">';
                v.slice(1, 5).forEach(item => { html += createVideoCard(item); });
                html += '</div>';

                // तल्लो सेक्सन (भिडियो ६-९ सम्म)
                html += '<div class="bottom-section">';
                v.slice(5, 9).forEach(item => { html += createVideoCard(item); });
                html += '</div>';
                
                container.innerHTML = html;
            } else {
                // "Load More" थिच्दा तल नयाँ कार्डहरू मात्र थप्ने
                const bottomSection = container.querySelector('.bottom-section');
                v.forEach(item => {
                    const temp = document.createElement('div');
                    temp.innerHTML = createVideoCard(item);
                    bottomSection.appendChild(temp.firstElementChild);
                });
            }

            btn.innerText = 'Load More';
            if (!nextPageToken) btn.style.display = 'none';
        }
    } catch (err) {
        console.error('Error fetching YouTube data:', err);
        btn.innerText = 'पुन: प्रयास गर्नुहोस्';
    }
}

// सुरु गर्ने
(function init() {
    injectStyles();
    loadYouTubeVideos();
})();
