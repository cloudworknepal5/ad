/**
 * Birgunj News - Multi-function Audio Fix
 * Features: Guaranteed User-Gesture Activation, Voice Initialization, Nepali Support
 */

window.birgunjStore = { taja: [], pop: [] };

// Global Callbacks for Blogger
window.renderTaja = (d) => processFeed(d, 'taja');
window.renderPop = (d) => processFeed(d, 'pop');

function processFeed(data, type) {
    const listEl = document.getElementById(type + '-list');
    if (!listEl || !data.feed.entry) return;

    let html = "";
    window.birgunjStore[type] = [];

    data.feed.entry.forEach(e => {
        const title = e.title.$t;
        const link = e.link.find(l => l.rel === 'alternate').href;
        const snippet = e.summary ? e.summary.$t.replace(/<[^>]*>?/gm, '').trim() : "विवरण छैन";
        
        window.birgunjStore[type].push({ title, snippet });
        html += `<div class="news-item" style="padding:12px; border-bottom:1px solid #eee;">
                    <a href="${link}" target="_blank" style="text-decoration:none; color:#222; font-weight:600; font-size:14px;">${title}</a>
                 </div>`;
    });
    listEl.innerHTML = html;
}

(function() {
    // UI Setup
    const root = document.getElementById('birgunj-widget-root');
    if (!root) return;

    const style = document.createElement('style');
    style.textContent = `
        #floating-wrapper { position: fixed; top: 150px; right: 12px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; font-family: sans-serif; }
        .tab-btn { width: 50px; height: 50px; background: #bc1d22; border-radius: 50%; border: 2px solid #fff; cursor: pointer; color: white; font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .tab-btn.playing { background: #2ecc71 !important; animation: b-pulse 1.2s infinite; }
        #news-box { width: 300px; background: white; border-radius: 10px; position: absolute; right: 60px; top: 0; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: none; overflow: hidden; border: 1px solid #ddd; }
        #news-box.show { display: block; }
        .active-list { display: block !important; }
        @keyframes b-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);

    root.innerHTML = `
        <div id="floating-wrapper">
            <button class="tab-btn" onclick="toggleView('taja')" id="t-btn">⚡</button>
            <button class="tab-btn" onclick="toggleView('pop')" id="p-btn">🔥</button>
            <button class="tab-btn" onclick="handleAudio()" id="a-btn">🔊</button>
            <div id="news-box">
                <div id="box-head" style="background:#bc1d22; color:white; padding:10px; text-align:center; font-weight:bold;">बिरगञ्ज न्यूज</div>
                <div id="taja-list" class="news-list" style="display:none; max-height:400px; overflow-y:auto;"></div>
                <div id="pop-list" class="news-list" style="display:none; max-height:400px; overflow-y:auto;"></div>
            </div>
        </div>
    `;

    let synth = window.speechSynthesis;
    let currentType = 'taja';

    // 1. Multi-function: UI Toggle
    window.toggleView = (type) => {
        currentType = type;
        document.getElementById('news-box').classList.add('show');
        document.querySelectorAll('.news-list').forEach(l => l.style.display = 'none');
        document.getElementById(type + '-list').style.display = 'block';
        document.getElementById('box-head').innerText = type === 'taja' ? "ताजा समाचार" : "लोकप्रिय समाचार";
    };

    // 2. Multi-function: Audio Handling with Fix
    window.handleAudio = () => {
        if (synth.speaking) {
            synth.cancel();
            setAudioState(false);
            return;
        }

        const items = window.birgunjStore[currentType];
        if (!items || items.length === 0) {
            alert("समाचार लोड हुँदैछ, कृपया एकछिन पर्खनुहोस्।");
            return;
        }

        setAudioState(true);
        let text = "नमस्ते, बिरगञ्ज न्यूज सुन्नुहोस्। ";
        items.forEach((item, i) => {
            text += `समाचार ${i+1}: ${item.title}. विवरण: ${item.snippet}. `;
        });

        const utter = new SpeechSynthesisUtterance(text);
        
        // Voice Fix: Get Nepali or Hindi
        const voices = synth.getVoices();
        const nepaliVoice = voices.find(v => v.lang.includes('ne') || v.lang.includes('hi'));
        
        utter.voice = nepaliVoice || voices[0];
        utter.lang = 'ne-NP';
        utter.rate = 0.85; // Clarity fix

        utter.onend = () => setAudioState(false);
        utter.onerror = () => {
            console.error("Audio Error");
            setAudioState(false);
        };

        synth.speak(utter);
    };

    function setAudioState(playing) {
        const btn = document.getElementById('a-btn');
        btn.innerText = playing ? "🛑" : "🔊";
        playing ? btn.classList.add('playing') : btn.classList.remove('playing');
    }

    // Load Feeds
    const load = (url) => {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    };

    load("/feeds/posts/summary?alt=json-in-script&max-results=6&callback=renderTaja");
    setTimeout(() => load("/feeds/posts/summary?alt=json-in-script&max-results=6&callback=renderPop"), 1000);

    // Safari Fix: Initialize voices
    synth.getVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = synth.getVoices;
    }
})();
