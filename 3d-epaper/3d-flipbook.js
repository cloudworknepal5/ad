(function () {
    // १. आवश्यक CSS स्टाइलहरू सिर्जना गरी पृष्ठमा इन्जेक्ट (Inject) गर्ने
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            background-color: #f0f2f5;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
            font-family: sans-serif;
        }
        .controls-bar {
            position: absolute;
            top: 10px;
            z-index: 999;
            display: flex;
            gap: 10px;
            background: rgba(255, 255, 255, 0.9);
            padding: 6px 15px;
            border-radius: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        .controls-bar button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 6px 12px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .controls-bar button:hover {
            background-color: #0056b3;
        }
        #book-container {
            width: 100%;
            max-width: 1000px;
            height: 82vh;
            margin-top: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            transition: transform 0.3s ease;
        }
        .page {
            background-color: white;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
            position: relative;
        }
        .page img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .zoom-icon {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            padding: 6px 10px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            z-index: 10;
        }
        .zoom-icon:hover {
            background-color: rgba(0, 0, 0, 0.9);
        }
        #lightbox-modal {
            display: none;
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            justify-content: center;
            align-items: center;
        }
        #lightbox-modal img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 4px;
        }
        #lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        @media (max-width: 768px) {
            #book-container {
                width: 100vw;
                height: 75vh;
                margin-top: 30px;
            }
            .controls-bar {
                top: 5px;
                padding: 4px 10px;
            }
            .controls-bar button {
                padding: 5px 8px;
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);

    // २. HTML संरचना स्वचालित रूपमा सिर्जना गरेर body मा राख्ने
    const containerDiv = document.createElement('div');
    containerDiv.innerHTML = `
        <div class="controls-bar">
            <button id="zoomInBtn" title="Zoom In">➕ जुम इन</button>
            <button id="zoomOutBtn" title="Zoom Out">➖ जुम आउट</button>
            <button id="resetZoomBtn" title="Reset">🔄 रिसेट</button>
        </div>

        <div id="book-container">
            <div id="flipbook">
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_1.png" alt="Cover Page">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_2.png" alt="Page 2">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_3.png" alt="Page 3">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_4.png" alt="Page 4">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_5.png" alt="Page 5">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
                <div class="page">
                    <img src="https://ad.neelamb.com/3d-epaper/image/Page_6.png" alt="Page 6">
                    <div class="zoom-icon" title="Zoom">🔍</div>
                </div>
            </div>
        </div>

        <div id="lightbox-modal">
            <span id="lightbox-close">&times;</span>
            <img id="lightbox-img" src="" alt="Zoomed Page">
        </div>
    `;
    document.body.appendChild(containerDiv);

    // ३. Page-Flip पुस्तकालय लोड नभएसम्म पर्खिने र फ्लिपबुक इनिसियलाइज गर्ने
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    loadScript("https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js", function () {
        let currentScale = 1;

        const bookContainer = document.getElementById('book-container');

        document.getElementById('zoomInBtn').addEventListener('click', function() {
            if (currentScale < 1.8) {
                currentScale += 0.15;
                bookContainer.style.transform = `scale(${currentScale})`;
            }
        });

        document.getElementById('zoomOutBtn').addEventListener('click', function() {
            if (currentScale > 0.7) {
                currentScale -= 0.15;
                bookContainer.style.transform = `scale(${currentScale})`;
            }
        });

        document.getElementById('resetZoomBtn').addEventListener('click', function() {
            currentScale = 1;
            bookContainer.style.transform = `scale(1)`;
        });

        let bookWidth = 450;
        let bookHeight = 636;

        if (window.innerWidth < 768) {
            bookWidth = Math.floor((window.innerWidth * 0.92) / 2);
            bookHeight = Math.floor(bookWidth * 1.414); 
        }

        const flipBook = new St.PageFlip(
            document.getElementById('flipbook'),
            {
                width: bookWidth, 
                height: bookHeight, 
                showCover: true,
                maxShadowOpacity: 0.5,
                mobileScrollSupport: true,
                usePortrait: false
            }
        );

        flipBook.loadFromHTML(document.querySelectorAll('.page'));

        const flipSound = new Audio('https://ad.neelamb.com/3d-epaper/image/flip-sound.mp3');
        
        flipBook.on('flip', (e) => {
            const soundInstance = flipSound.cloneNode();
            soundInstance.play().catch(error => {
                console.log("Audio play error: ", error);
            });
        });

        // लाइटबक्स (जुम प्रिभ्यू) लजिक
        const modal = document.getElementById('lightbox-modal');
        const modalImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');

        document.querySelectorAll('.zoom-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const pageDiv = this.closest('.page');
                const imgElement = pageDiv.querySelector('img');
                modal.style.display = 'flex';
                modalImg.src = imgElement.src;
            });
        });

        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function(e) {
            if(e.target === this) {
                modal.style.display = 'none';
            }
        });
    });
})();
