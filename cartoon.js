(function() {
    // १. CSS Styles (JS बाटै इन्जेक्ट गरिएको)
    const style = document.createElement('style');
    style.innerHTML = `
        .photo-only-container {
            max-width: 100%;
            margin: 10px auto;
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #fff;
        }
        .photo-viewport {
            width: 100%;
            height: 500px;
            position: relative;
        }
        .sb-photo-card {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sb-photo-card.active { opacity: 1; z-index: 10; }
        .sb-photo-card img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }
        @media (max-width: 600px) { .photo-viewport { height: 350px; } }
    `;
    document.head.appendChild(style);

    // २. HTML Structure सिर्जना गर्ने
    const container = document.getElementById('cartoon-frame-slider');
    if (!container) return; // यदि ID भेटिएन भने रोकिने

    container.className = 'photo-only-container';
    container.innerHTML = `<div class="photo-viewport" id="photo-portal"><div style="text-align:center; padding-top:150px; font-family:sans-serif; color:#999;">तस्विर लोड हुँदैछ...</div></div>`;

    let photoData = [];
    let currentIndex = 0;
    let photoTimer;

    // Multi-function 1: Image Proxy
    const getProxy = (url) => url ? "https://images.weserv.nl/?url=" + encodeURIComponent(url.replace(/https?:\/\//, "")) : "";

    // Multi-function 2: Blogger Feed Callback (Global Scope मा राख्नुपर्छ)
    window.sbBuild = function(json) {
        const entries = json.feed.entry || [];
        if (entries.length === 0) {
            document.getElementById('photo-portal').innerHTML = "कुनै तस्विर भेटिएन।";
            return;
        }

        photoData = entries.map(e => ({
            photo: getProxy(e.media$thumbnail ? e.media$thumbnail.url.replace('s72-c', 's1600') : '')
        }));
        
        renderPhotos();
        startSlideshow();
    };

    // Multi-function 3: API Fetch
    const sbSync = () => {
        const label = "cartoon";
        const s = document.createElement('script');
        s.src = `https://www.mukeshbasnet.com.np/feeds/posts/default/-/${label}?alt=json-in-script&callback=sbBuild&max-results=50`;
        document.body.appendChild(s);
    };

    const renderPhotos = () => {
        const portal = document.getElementById('photo-portal');
        portal.innerHTML = photoData.map((item, i) => `
            <div class="sb-photo-card" id="p-item-${i}">
                <img src="${item.photo}" alt="Cartoon Content">
            </div>
        `).join('');
        updateDisplay();
    };

    const updateDisplay = () => {
        const allPhotos = document.querySelectorAll('.sb-photo-card');
        allPhotos.forEach(p => p.classList.remove('active'));
        if (allPhotos[currentIndex]) allPhotos[currentIndex].classList.add('active');
    };

    const startSlideshow = () => {
        photoTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % photoData.length;
            updateDisplay();
        }, 5000);
    };

    // Multi-function 4: Interaction Control
    container.onmouseenter = () => clearInterval(photoTimer);
    container.onmouseleave = () => startSlideshow();

    sbSync();
})();
