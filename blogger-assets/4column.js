/**
 * File: newspaper-fix-final.js
 * Description: 4-Column Layout with Guaranteed Text Visibility in Columns 2 & 3
 */
(function() {
    const container = document.querySelector('[data-label]'); 
    if (!container) return;

    const SETTINGS = {
        id: container.id || 'newspaper-layout-dynamic',
        label: container.getAttribute('data-label') || 'Article',
        imgHeight: container.getAttribute('data-img-height') || '380px'
    };

    const utils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            // अनावश्यक स्पेस र ट्याग हटाउने
            return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, ' ').trim();
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

        // टेक्स्टलाई ४ भागमा सुरक्षित बाँड्ने
        const partSize = Math.floor(fullText.length / 4);
        const c1 = fullText.slice(0, partSize);
        const c2 = fullText.slice(partSize, partSize * 2);
        const c3 = fullText.slice(partSize * 2, partSize * 3);
        const c4 = fullText.slice(partSize * 3);

        const html = `
            <div class="max-w-[1250px] mx-auto bg-white p-4 md:p-8 font-['Mukta'] text-black border border-gray-200 shadow-md mt-10 overflow-hidden">
                
                <div class="text-center border-b-[5px] border-black pb-4 mb-8">
                    <a href="${postLink}" class="no-underline text-black hover:text-red-700 transition-colors">
                        <h1 class="text-3xl md:text-[72px] font-[900] leading-[0.9] tracking-tighter uppercase m-0">${title}</h1>
                    </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    <div class="hidden md:block text-justify text-[17px] leading-relaxed border-r border-gray-100 pr-4">
                        <p>${c1}...</p>
                    </div>
                    
                    <div class="md:col-span-2 flex flex-col gap-6">
                        <a href="${postLink}" class="block overflow-hidden border-2 border-gray-100 group">
                            <img src="${imgUrl}" class="w-full h-auto object-cover max-h-[${SETTINGS.imgHeight}] transition-transform duration-700 group-hover:scale-105">
                        </a>
                        
                        <div class="grid grid-cols-2 gap-8 text-justify text-[16px] leading-snug text-gray-800 italic border-t-2 border-black pt-4">
                            <div class="border-r border-gray-100 pr-4">
                                ${c2.substring(0, 450)}...
                            </div>
                            <div>
                                ${c3.substring(0, 450)}...
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col border-l border-gray-100 pl-4">
                        <div class="md:hidden block text-xl mb-4 font-bold border-b-2 border-red-600 pb-2">
                            ${c1.substring(0, 250)}...
                        </div>
                        <div class="hidden md:block text-justify text-[17px] leading-relaxed">
                            <p>${c4.substring(0, 800)}...</p>
                        </div>
                        
                        <a href="${postLink}" class="mt-auto inline-block bg-red-700 text-white text-center py-3 px-6 rounded-md font-black hover:bg-black transition-all no-underline shadow-lg">
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
