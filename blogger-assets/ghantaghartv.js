/**
 * File: newspaper-final-fix.js
 * Description: 4-Column Newspaper Layout (No Back-to-Top, Fixed Columns 2 & 3)
 */
(function() {
    const container = document.querySelector('[data-label]'); 
    if (!container) return;

    const SETTINGS = {
        id: container.id || 'newspaper-layout-dynamic',
        label: container.getAttribute('data-label') || 'Article',
        imgHeight: container.getAttribute('data-img-height') || '350px'
    };

    // १. फन्ट इन्जेक्सन
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const utils = {
        toText: (html) => {
            let tmp = document.createElement("div");
            tmp.innerHTML = html;
            return (tmp.textContent || tmp.innerText || "").trim();
        },
        fixImg: (thumb) => thumb ? thumb.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/1200x600'
    };

    // २. रेन्डर फङ्सन (४ कोलम फिक्स)
    window.renderLayout = function(json) {
        const entry = json.feed.entry ? json.feed.entry[0] : null;
        if (!entry) {
            document.getElementById(SETTINGS.id).innerHTML = 'समाचार फेला परेन।';
            return;
        }

        const title = entry.title.$t;
        const postLink = entry.link.find(l => l.rel === 'alternate').href;
        const imgUrl = utils.fixImg(entry.media$thumbnail);
        const fullText = utils.toText(entry.content ? entry.content.$t : entry.summary.$t);

        // कोलम अनुसार टेक्स्ट बाँडफाँड
        const col1Text = fullText.substring(0, 700);
        const col2Text = fullText.substring(700, 1000);
        const col3Text = fullText.substring(1000, 1300);
        const col4Text = fullText.substring(1300, 2000);

        const html = `
            <div class="max-w-[1250px] mx-auto bg-white p-4 md:p-8 font-['Mukta'] text-black border border-gray-200 shadow-sm mt-10 overflow-hidden">
                
                <div class="text-center border-b-4 border-black pb-3 mb-8">
                    <a href="${postLink}" class="no-underline text-black hover:text-red-700 transition-colors">
                        <h1 class="text-4xl md:text-[75px] font-[900] leading-[0.9] tracking-tighter uppercase m-0 p-0">${title}</h1>
                    </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    <div class="hidden md:block text-justify text-[17px] leading-relaxed border-r border-gray-100 pr-4">
                        ${col1Text}...
                    </div>
                    
                    <div class="md:col-span-2 flex flex-col gap-4">
                        <a href="${postLink}" class="block overflow-hidden border border-gray-100 group shadow-sm">
                            <img src="${imgUrl}" class="w-full h-auto object-cover max-h-[${SETTINGS.imgHeight}] transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <div class="grid grid-cols-2 gap-6 text-justify text-[15px] leading-snug text-gray-700 italic border-t border-gray-100 pt-4">
                            <div>${col2Text}...</div>
                            <div>${col3Text}...</div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col border-l border-gray-100 pl-4">
                        <div class="md:hidden block text-lg mb-4 leading-relaxed font-medium">
                            ${col1Text.substring(0, 300)}...
                        </div>
                        <div class="hidden md:block text-justify text-[17px] leading-relaxed h-[350px] overflow-hidden">
                            ${col4Text}...
                        </div>
                        
                        <a href="${postLink}" class="mt-auto block text-red-700 font-black border-t-2 border-black pt-2 text-right hover:text-black transition-all">
                            थप पढ्नुहोस् ➔
                        </a>
                    </div>
                    
                </div>
            </div>`;

        document.getElementById(SETTINGS.id).innerHTML = html;
    };

    // ३. फिड कल
    const script = document.createElement('script');
    script.src = `/feeds/posts/default/-/${encodeURIComponent(SETTINGS.label)}?alt=json-in-script&callback=renderLayout&max-results=1`;
    document.body.appendChild(script);

})();
