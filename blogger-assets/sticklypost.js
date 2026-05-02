/**
 * File: floating-news-widget.js
 * Features: Tailwind CSS, Icons only, Responsive, Floating, Dark Mode Support
 */
(function() {
    const rootId = 'birgunj-widget-root';
    // कन्टेनर छैन भने थप्ने
    if (!document.getElementById(rootId)) {
        const div = document.createElement('div');
        div.id = rootId;
        document.body.appendChild(div);
    }

    const root = document.getElementById(rootId);
    
    // विजेटको HTML संरचना (Tailwind Classes सहित)
    root.innerHTML = `
        <div id="floating-wrapper" class="fixed top-[150px] right-3 z-[999999] flex flex-col items-end gap-3 font-['Mukta',sans-serif]">
            <div class="flex flex-col gap-2">
                <button id="btn-taja" title="ताजा खबर" class="tab-btn w-12 h-12 bg-[#bc1d22] border-2 border-white rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-110 active:scale-95 focus:outline-none">⚡</button>
                <button id="btn-pop" title="लोकप्रिय" class="tab-btn w-12 h-12 bg-[#bc1d22] border-2 border-white rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-110 active:scale-95 focus:outline-none">🔥</button>
            </div>

            <div id="news-content" class="absolute right-[60px] top-0 w-[300px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-0 transition-all duration-400 ease-in-out invisible opacity-0 border border-gray-100 dark:border-slate-700">
                <div id="list-header" class="bg-[#bc1d22] text-white py-2 px-4 text-sm font-bold text-center tracking-wide">समाचार</div>
                <div class="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-red-600">
                    <div id="taja-list" class="news-list hidden">
                        <p class="p-4 text-center text-gray-500 text-sm">लोड हुँदैछ...</p>
                    </div>
                    <div id="pop-list" class="news-list hidden">
                        <p class="p-4 text-center text-gray-500 text-sm">लोड हुँदैछ...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const content = document.getElementById('news-content');
    const header = document.getElementById('list-header');
    const tajaBtn = document.getElementById('btn-taja');
    const popBtn = document.getElementById('btn-pop');
    const tajaList = document.getElementById('taja-list');
    const popList = document.getElementById('pop-list');

    // टगल फङ्सन
    function toggle(type, btn) {
        const isActive = btn.classList.contains('active-tab');
        
        // सबै रिसेट गर्ने
        [tajaBtn, popBtn].forEach(b => b.classList.remove('active-tab', 'bg-slate-800', 'border-red-500'));
        [tajaList, popList].forEach(l => l.classList.add('hidden'));

        if (!isActive) {
            btn.classList.add('active-tab', 'bg-slate-800', 'border-red-500');
            content.classList.remove('max-h-0', 'invisible', 'opacity-0');
            content.classList.add('max-h-[450px]', 'visible', 'opacity-100');
            header.innerText = (type === 'taja') ? "ताजा समाचार" : "लोकप्रिय समाचार";
            (type === 'taja' ? tajaList : popList).classList.remove('hidden');
        } else {
            content.classList.add('max-h-0', 'invisible', 'opacity-0');
            content.classList.remove('max-h-[450px]', 'visible', 'opacity-100');
        }
    }

    tajaBtn.onclick = () => toggle('taja', tajaBtn);
    popBtn.onclick = () => toggle('pop', popBtn);

    let tajaTitles = [];

    // ताजा समाचार रेन्डर
    window.renderTaja = function(data) {
        let html = "";
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t; 
            tajaTitles.push(t);
            let l = e.link.find(x => x.rel==='alternate').href;
            html += `
                <div class="p-3 px-4 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <a href="${l}" target="_parent" class="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1d22] leading-snug block">${t}</a>
                </div>`;
        });
        tajaList.innerHTML = html || "<p class='p-4 text-center'>समाचार फेला परेन।</p>";
    };

    // लोकप्रिय समाचार रेन्डर
    window.renderPop = function(data) {
        let html = "", count = 0;
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            let t = e.title.$t;
            if(!tajaTitles.includes(t) && count < 8) {
                let l = e.link.find(x => x.rel==='alternate').href;
                html += `
                    <div class="p-3 px-4 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <a href="${l}" target="_parent" class="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1d22] leading-snug block">${t}</a>
                    </div>`;
                count++;
            }
        });
        popList.innerHTML = html || "<p class='p-4 text-center'>थप समाचार लोड हुँदैछ...</p>";
    };

    function injectScript(url) {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    }

    // फिड लोड गर्ने
    injectScript("/feeds/posts/default?alt=json-in-script&max-results=10&callback=renderTaja");
    
    setTimeout(() => {
        injectScript("/feeds/posts/default?alt=json-in-script&orderby=updated&max-results=20&callback=renderPop");
    }, 1500);

})();
