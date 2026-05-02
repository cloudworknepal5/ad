(function() {
    // स्टाइल र फन्ट
    if (!document.getElementById('news-core-style')) {
        var style = document.createElement('style');
        style.id = 'news-core-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap');
            .clamp-2-lines {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        document.head.appendChild(style);
    }

    // मुख्य रेन्डर फङ्सन
    window.mainNewsRender = function(json, targetId, customTitle) {
        var target = document.getElementById(targetId);
        if (!target) return;
        
        var posts = json.feed.entry || [];

        if (posts.length === 0) {
            target.innerHTML = `<div class="p-4 text-gray-500 text-center font-['Mukta'] italic border rounded-lg border-dashed">"${customTitle}" मा समाचार फेला परेन।</div>`;
            return;
        }

        var html = `
            <div class="flex flex-col h-full font-['Mukta']">
                <!-- नेपाली टाइटल यहाँ देखिन्छ -->
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase tracking-tight">
                        ${customTitle}
                    </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">`;

        posts.forEach((entry, i) => {
            if (i >= 3) return; 
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/600x400';

            var titleBase = "text-black dark:text-white hover:text-red-700 transition-colors duration-200 no-underline block clamp-2-lines font-bold leading-tight";

            if (i === 0) {
                html += `
                    <div class="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                        <a href="${link}" class="group block overflow-hidden rounded-xl shadow-sm bg-gray-100">
                            <img src="${thumb}" alt="${title}" class="w-full h-[200px] md:h-[240px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleBase} mt-3 text-2xl md:text-3xl font-extrabold">
                            ${title}
                        </a>
                    </div>`;
            } else {
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-lg shadow-sm bg-gray-100">
                            <img src="${thumb}" alt="${title}" class="w-full h-[100px] md:h-[130px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleBase} mt-2 text-base md:text-lg">
                            ${title}
                        </a>
                    </div>`;
            }
        });

        html += `</div></div>`;
        target.innerHTML = html;
    };

    // क्यालब्याकहरू
    window.mainNewsCB1 = j => mainNewsRender(j, "main-box-1", window.title1);
    window.mainNewsCB2 = j => mainNewsRender(j, "main-box-2", window.title2);
    window.mainNewsCB3 = j => mainNewsRender(j, "main-box-3", window.title3);

    /**
     * नयाँ इनिट फङ्सन
     * l1, l2, l3: अंग्रेजी लेबलहरू (Blogger Labels)
     * t1, t2, t3: नेपाली टाइटलहरू (HTML Display Titles)
     * n: समाचार संख्या
     */
    window.mainNewsInit = function(l1, t1, l2, t2, l3, t3, n) {
        window.title1 = t1; window.title2 = t2; window.title3 = t3;

        var labels = [l1, l2, l3];
        var cbs = ['mainNewsCB1', 'mainNewsCB2', 'mainNewsCB3'];
        
        labels.forEach((label, i) => {
            if (label) {
                var s = document.createElement('script');
                s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbs[i] + "&max-results=" + n;
                document.head.appendChild(s);
            }
        });
    }; 
})();
