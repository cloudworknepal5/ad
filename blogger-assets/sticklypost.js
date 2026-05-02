/**
 * File: floating-news-with-thumb-and-top.js
 * Features: Thumbnail Images, Back to Top Button, Tailwind CSS, Responsive
 */
(function() {
    const rootId = 'birgunj-widget-root';
    if (!document.getElementById(rootId)) {
        const div = document.createElement('div');
        div.id = rootId;
        document.body.appendChild(div);
    }

    const root = document.getElementById(rootId);
    
    // HTML Structure
    root.innerHTML = `
        <div id="floating-wrapper" class="fixed top-[150px] right-3 z-[999999] flex flex-col items-end gap-3 font-['Mukta',sans-serif]">
            <div class="flex flex-col gap-2">
                <button id="btn-taja" title="ताजा खबर" class="w-12 h-12 bg-[#bc1d22] border-2 border-white rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-110 focus:outline-none">⚡</button>
                <button id="btn-pop" title="लोकप्रिय" class="w-12 h-12 bg-[#bc1d22] border-2 border-white rounded-full flex items-center justify-center text-white text-xl shadow-lg transition-all hover:scale-110 focus:outline-none">🔥</button>
            </div>

            <div id="news-content" class="absolute right-[60px] top-0 w-[300px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-0 transition-all duration-400 invisible opacity-0 border border-gray-100 dark:border-slate-700">
                <div id="list-header" class="bg-[#bc1d22] text-white py-2 px-4 text-sm font-bold text-center">समाचार</div>
                <div class="overflow-y-auto max-h-[380px] scrollbar-thin">
                    <div id="taja-list" class="news-list hidden"></div>
                    <div id="pop-list" class="news-list hidden"></div>
                </div>
            </div>
        </div>

        <button id="back-to-top" class="fixed bottom-6 right-6 w-12 h-12 bg-black/70 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 translate-y-20 opacity-0 invisible z-[999998] hover:bg-[#bc1d22] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    `;

    const content = document.getElementById('news-content');
    const header = document.getElementById('list-header');
    const tajaBtn = document.getElementById('btn-taja');
    const popBtn = document.getElementById('btn-pop');
    const tajaList = document.getElementById('taja-list');
    const popList = document.getElementById('pop-list');
    const topBtn = document.getElementById('back-to-top');

    // Toggle Function
    function toggle(type, btn) {
        const isActive = btn.classList.contains('active-tab');
        [tajaBtn, popBtn].forEach(b => b.classList.remove('active-tab', 'ring-4', 'ring-red-300'));
        [tajaList, popList].forEach(l => l.classList.add('hidden'));

        if (!isActive) {
            btn.classList.add('active-tab', 'ring-4', 'ring-red-300');
            content.classList.remove('max-h-0', 'invisible', 'opacity-0');
            content.classList.add('max-h-[450px]', 'visible', 'opacity-100');
            header.innerText = (type === 'taja') ? "ताजा समाचार" : "लोकप्रिय समाचार";
            (type === 'taja' ? tajaList : popList).classList.remove('hidden');
        } else {
            content.classList.add('max-h-0', 'invisible', 'opacity-0');
        }
    }

    tajaBtn.onclick = () => toggle('taja', tajaBtn);
    popBtn.onclick = () => toggle('pop', popBtn);

    // Back to Top Logic
    window.onscroll = function() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            topBtn.classList.remove('translate-y-20', 'opacity-0', 'invisible');
        } else {
            topBtn.classList.add('translate-y-20', 'opacity-0', 'invisible');
        }
    };

    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Render Function with Image
    function createNewsHTML(e) {
        const title = e.title.$t;
        const link = e.link.find(x => x.rel === 'alternate').href;
        // Thumbnail Image (72x72 resize to 150 for clarity)
        const img = e.media$thumbnail ? e.media$thumbnail.url.replace('s72-c', 's150-c') : 'https://via.placeholder.com/150';
        
        return `
            <div class="flex items-center gap-3 p-3 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <img src="${img}" class="w-14 h-14 object-cover rounded-md flex-shrink-0 bg-gray-200">
                <a href="${link}" target="_parent" class="text-[14px] font-bold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 hover:text-[#bc1d22] transition-all">${title}</a>
            </div>`;
    }

    let tajaTitles = [];
    window.renderTaja = function(data) {
        let html = "";
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            tajaTitles.push(e.title.$t);
            html += createNewsHTML(e);
        });
        tajaList.innerHTML = html || "<p class='p-4 text-center'>समाचार फेला परेन।</p>";
    };

    window.renderPop = function(data) {
        let html = "", count = 0;
        const entries = data.feed.entry || [];
        entries.forEach(e => {
            if(!tajaTitles.includes(e.title.$t) && count < 8) {
                html += createNewsHTML(e);
                count++;
            }
        });
        popList.innerHTML = html || "<p class='p-4 text-center'>थप समाचार छैन।</p>";
    };

    function injectScript(url) {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    }

    injectScript("/feeds/posts/default?alt=json-in-script&max-results=10&callback=renderTaja");
    setTimeout(() => {
        injectScript("/feeds/posts/default?alt=json-in-script&orderby=updated&max-results=20&callback=renderPop");
    }, 1500);

})();
