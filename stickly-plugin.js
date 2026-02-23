/**
 * Birgunj News Tab Widget - Audio & Icon Version
 * Features: Icons, Responsive, Text-to-Speech Multi-functionality
 */
(function() {
    const rootId = 'birgunj-widget-root';
    if (!document.getElementById(rootId)) {
        const div = document.createElement('div');
        div.id = rootId;
        document.body.appendChild(div);
    }

    const style = document.createElement('style');
    style.textContent = `
        #floating-wrapper {
            position: fixed;
            top: 150px;
            right: 12px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        .tabs-trigger { display: flex; flex-direction: column; gap: 10px; }
        .tab-btn {
            width: 48px; height: 48px;
            background: #bc1d22 !important;
            border-radius: 50% !important;
            border: 2px solid #fff !important;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            font-size: 22px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            padding: 0;
            outline: none;
        }
        .tab-btn:hover { transform: scale(1.1); background: #333 !important; }
        .tab-btn.active { background: #333 !important; border-color: #00d2ff !important; }
        .tab-btn.playing { background: #2ecc71 !important; animation: pulse 1.5s infinite; }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
            100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
        }

        #news-content {
            width: 300px;
            background: #fff !important;
            border-radius: 12px;
            max-height: 0;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: absolute;
            right: 60px;
            top: 0;
            border: none;
        }
        #news-content.show { max-height: 450px; border: 1px solid #ddd; }
        
        .content-area { overflow-y: auto; max-height: 400px; padding: 5px 0; }
        .news-list { display: none; list-style: none; padding: 0; margin: 0; }
        .news-list.active { display: block; }
        
        .news-item { padding: 12px 15px; border-bottom: 1px solid #f2f2f2; transition: background 0.2s; }
        .news-item:hover { background: #f9f9f9; }
        .news-item a { 
            text-decoration: none !important; 
            color: #333 !important; 
            font-size: 14px; 
            display: block; 
            line-height: 1.5; 
            font-weight: 500; 
        }

        @media (max-width: 480px) {
            #news-content { width: 260px; right: 55px; }
            .tab-btn { width: 42px; height: 42px; font-size: 18px; }
            #floating-wrapper { top: 120px; right: 8px; }
        }
        .content-area::-webkit-scrollbar { width: 4px; }
        .content-area::-webkit-scrollbar-thumb { background: #bc1d22; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    const root = document.getElementById(rootId);
    root.innerHTML = `
        <div id="floating-wrapper">
            <div class="tabs-trigger">
                <button class="tab-btn" id="btn-taja" title="ताजा खबर">⚡</button>
                <button class="tab-btn" id="btn-pop" title="लोकप्रिय">🔥</button>
                <button class="tab-btn" id="btn-audio" title="समाचार सुन्नुहोस्">🔊</button>
            </div>
            <div id="news-content">
                <div style="background:#bc1d22; color:white; padding:8px 15px; font-size:13px; font-weight:bold; text-align:center;" id="list-header">समाचार</div>
                <div class="content-area">
                    <div id="taja-list" class="news-list">लोडिङ...</div>
                    <div id="pop-list" class="news-list">लोडिङ...</div>
                </div>
            </div>
        </div>
    `;

    const content = document.getElementById('news-content');
    const header = document.getElementById('list-header');
    const tajaBtn = document.getElementById('btn-taja');
    const popBtn = document.getElementById('btn-pop');
    const audioBtn = document.getElementById('btn-audio');
    const tajaList = document.getElementById('taja-list');
    const popList = document.getElementById('pop-list');

    let synth = window.speechSynthesis;
    let isSpeaking = false;

    // --- Multi-function logic for UI toggle ---
    function toggle(type, btn) {
        const isActive = btn.classList.contains('active');
        [tajaBtn, popBtn].forEach(b => b.classList.remove('active'));
        [tajaList, popList].forEach(l => l.classList.remove('active'));
        
        if (!isActive) {
            btn.classList.add('active');
            content.classList.add('show');
            header.innerText = (type === 'taja') ? "ताजा समाचार" : "लोकप्रिय समाचार";
            (type === 'taja' ? tajaList : popList).classList.add('active');
        } else {
            content.classList.remove('show');
        }
    }

    // --- Multi-function logic for Audio (TTS) ---
    function speakNews() {
        if (isSpeaking) {
            synth.cancel();
            isSpeaking = false;
            audioBtn.classList.remove('playing');
            audioBtn.innerText = "🔊";
            return;
        }

        const activeList = document.querySelector('.news-list.active');
        const items = activeList ? activeList.querySelectorAll('.news-item a') : [];
        
        if (items.length === 0) {
            alert("कृपया पहिले समाचार सूची लोड गर्नुहोस्।");
            return;
        }

        isSpeaking = true;
        audioBtn.classList.add('playing');
        audioBtn.innerText = "🛑";

        let fullText = "नमस्ते, बिरगञ्ज न्यूजमा स्वागत छ। आजका मुख्य समाचारहरू यस प्रकार छन्: ";
        items.forEach((item, index) => {
            fullText += (index + 1) + ". " + item.innerText + ". ";
        });

        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'ne-NP'; // Sets language to Nepali
        utterance.rate = 0.9;

        utterance.onend = () => {
            isSpeaking = false;
            audioBtn.classList.remove('playing');
            audioBtn.innerText = "🔊";
        };

        synth.speak(utterance);
    }

    tajaBtn.onclick = () => toggle('taja', tajaBtn);
    popBtn.onclick = () => toggle('pop', popBtn);
    audioBtn.onclick = () => speakNews();

    let tajaTitles = [];

    window.renderTaja = function(data) {
        let html = "";
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t; 
            tajaTitles.push(t);
            let l = e.link.find(x => x.rel==='alternate').href;
            html += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
        });
        tajaList.innerHTML = html || "समाचार फेला परेन।";
    };

    window.renderPop = function(data) {
        let html = "", count = 0;
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t;
            if(!tajaTitles.includes(t) && count < 8) {
                let l = e.link.find(x => x.rel==='alternate').href;
                html += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
                count++;
            }
        });
        popList.innerHTML = html || "थप समाचार लोड हुँदैछ...";
    };

    function injectScript(url) {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    }

    injectScript("https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&max-results=10&callback=renderTaja");
    
    setTimeout(() => {
        injectScript("https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&orderby=updated&max-results=20&callback=renderPop");
    }, 1500);

})();
