/**
 * File: newspaper-layout-widget.js
 * Description: Dynamic Newspaper Layout with Tailwind CSS, Thumbnails, and Back to Top
 * Features: Responsive, Linked Headline/Images, Floating Top Button
 */
(function() {
    // १. कन्फिगरेसन सेटअप
    const container = document.querySelector('[data-label]'); 
    if (!container) return;

    const SETTINGS = {
        id: container.id || 'newspaper-layout-dynamic',
        label: container.getAttribute('data-label') || 'Article',
        imgHeight: container.getAttribute('data-img-height') || '300px'
    };

    // २. बाह्य फन्ट र CSS इन्जेक्सन
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
        .line-clamp-news { display: -webkit-box; -webkit-line-clamp: 14; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-mobile { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .newspaper-border { border: 1px solid #ddd; position: relative; }
        .newspaper-border::before { content: ''; position: absolute; top: 5px; left: 5px; right: 5px; bottom: 5px; border: 1px solid #eee; pointer-events: none; }
    `;
    document.head.appendChild(style);

    // ३. सहयोगी फङ्सनहरू
    const utils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            return (tmp.textContent || tmp.innerText || "").replace(/^\w+, \d+ \w+\s।\s*/, "").trim();
        },
        fixImg: (thumb) => thumb ? thumb.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600',
        wrapLink: (content, url) => `<a href="${url}" class="hover:opacity-90 transition-opacity text-black">${content}</a>`
    };

    // ४. ब्याक टु टप बटन थप्ने
    const addBackToTop = () => {
        const topBtn = document.createElement('button');
        topBtn.id = "back-to-top-news";
        topBtn.innerHTML = "↑";
        topBtn.className = "fixed bottom-6 right-6 w-12 h-12 bg-red-700 text-white rounded-full shadow-2xl opacity-0 invisible transition-all duration-300 z-[9999] hover:bg-black font-bold text-xl";
        document.body.appendChild(topBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                topBtn.classList.remove('opacity-0', 'invisible');
                topBtn.classList.add('opacity-100', 'visible');
            } else {
                topBtn.classList.add('opacity-0', 'invisible');
            }
        });

        topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ५. डाटा रेन्डरिंग
    window.renderLayout = function(json) {
        if (!json.feed.entry) {
            document.getElementById(SETTINGS.id).innerHTML = 'यो लेबलमा समाचार फेला परेन।';
            return;
        }
        
        const entry = json.feed.entry[0];
        const title = entry.title.$t;
        const postLink = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = utils.fixImg(entry.media$thumbnail);
        const fullContent = utils.toText(entry.content ? entry.content.$t : entry.summary.$t);

        const htmlContent = `
            <div class="max-w-[1200px] mx-auto bg-white p-5 md:p-8 newspaper-border font-['Mukta'] text-black overflow-hidden shadow-sm border border-gray-200 mt-10">
                <div class="text-center border-b-4 border-black pb-2 mb-6">
                    ${utils.wrapLink(`<h1 class="text-4xl md:text-[80px] font-[900] leading-none tracking-tighter hover:text-red-700 transition-colors uppercase">${title}</h1>`, postLink)}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    <div class="hidden md:block text-justify text-lg leading-relaxed line-clamp-news pr-4 border-r border-gray-100">
                        ${fullContent.substring(0, 800)}
                    </div>
                    
                    <div class="md:col-span-2 space-y-4">
                        ${utils.wrapLink(`<div class="w-full overflow-hidden border border-gray-100 shadow-sm"><img src="${imgUrl}" class="w-full h-auto object-cover max-h-[${SETTINGS.imgHeight}]"></div>`, postLink)}
                        
                        <div class="hidden md:grid grid-cols-2 gap-4 text-justify text-sm italic text-gray-700">
                            <p>${fullContent.substring(800, 950)}...</p>
                            <p>${fullContent.substring(950, 1100)}...</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col">
                        <div class="md:hidden block mb-4 text-lg leading-snug line-clamp-mobile text-gray-700">
                            ${fullContent.substring(0, 300)}...
                        </div>
                        <div class="hidden md:block text-justify text-lg leading-relaxed h-[320px] overflow-hidden">
                            ${fullContent.substring(1100, 1800)}...
                        </div>
                        <a href="${postLink}" class="mt-4 block text-red-700 font-black border-t border-dashed border-gray-300 pt-2 text-right hover:text-black">
                            थप पढ्नुहोस् ➔
                        </a>
                    </div>
                    
                </div>
            </div>`;

        document.getElementById(SETTINGS.id).innerHTML = htmlContent;
        addBackToTop();
    };

    // ६. फिड कल
    const scriptTag = document.createElement('script');
    scriptTag.src = `/feeds/posts/default/-/${SETTINGS.label}?alt=json-in-script&callback=renderLayout&max-results=1`;
    document.body.appendChild(scriptTag);

})();
