/**
 * File: newspaper-perfect-columns.js
 * Description: 4-Column Layout with Safe Text Splitting for Columns 2 & 3
 */
(function() {
    const container = document.querySelector('[data-label]'); 
    if (!container) return;

    const SETTINGS = {
        id: container.id || 'newspaper-layout-dynamic',
        label: container.getAttribute('data-label') || 'Article',
        imgHeight: container.getAttribute('data-img-height') || '350px'
    };

    const utils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            return (tmp.textContent || tmp.innerText || "").trim();
        },
        fixImg: (thumb) => thumb ? thumb.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600'
    };

    window.renderLayout = function(json) {
        const entry = json.feed.entry ? json.feed.entry[0] : null;
        if (!entry) return;

        const title = entry.title.$t;
        const postLink = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = utils.fixImg(entry.media$thumbnail);
        const fullText = utils.toText(entry.content ? entry.content.$t : entry.summary.$t);

        // समाचारलाई ४ भागमा सुरक्षित तरिकाले बाँड्ने (Safe Splitting)
        const totalLen = fullText.length;
        const part = Math.floor(totalLen / 4);

        const c1 = fullText.substring(0, part);
        const c2 = fullText.substring(part, part * 2);
        const c3 = fullText.substring(part * 2, part * 3);
        const c4 = fullText.substring(part * 3);

        const html = `
            <div class="max-w-[1250px] mx-auto bg-white p-4 md:p-8 font-['Mukta'] text-black border border-gray-200 shadow-sm mt-10 overflow-hidden select-none">
                
                <div class="text-center border-b-4 border-black pb-3 mb-8">
                    <a href="${postLink}" class="no-underline text-black hover:text-red-700 transition-colors">
                        <h1 class="text-3xl md:text-[70px] font-[900] leading-[0.95] tracking-tighter uppercase m-0">${title}</h1>
                    </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    <div class="hidden md:block text-justify text-[17px] leading-relaxed border-r border-gray-100 pr-4">
                        <p class="mb-4">${c1}...</p>
                    </div>
                    
                    <div class="md:col-span-2 flex flex-col gap-5">
                        <a href="${postLink}" class="block overflow-hidden border border-gray-100 group shadow-sm">
                            <img src="${imgUrl}" class="w-full h-auto object-cover max-h-[${SETTINGS.imgHeight}] transition-transform duration-500 group-hover:scale-105">
                        </a>
                        
                        <div class="grid grid-cols-2 gap-6 text-justify text-[15px] leading-snug text-gray-700 italic border-t border-gray-100 pt-4">
                            <div class="border-r border-gray-50 pr-3">${c2.substring(0, 400)}...</div>
                            <div>${c3.substring(0, 400)}...</div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col border-l border-gray-100 pl-4">
                        <div class="md:hidden block text-lg mb-4 leading-relaxed font-bold border-b pb-2">
                            ${c1.substring(0, 200)}...
                        </div>
                        <div class="hidden md:block text-justify text-[17px] leading-relaxed line-clamp-[12]">
                            ${c4}
                        </div>
                        
                        <a href="${postLink}" class="mt-auto block bg-black text-white text-center py-2 px-4 rounded font-bold hover:bg-red-700 transition-all no-underline">
                            थप पढ्नुहोस् ➔
                        </a>
                    </div>
                    
                </div>
            </div>`;

        document.getElementById(SETTINGS.id).innerHTML = html;
    };

    const script = document.createElement('script');
    script.src = `/feeds/posts/default/-/${encodeURIComponent(SETTINGS.label)}?alt=json-in-script&callback=renderLayout&max-results=1`;
    document.body.appendChild(script);
})();
