(function() {
    // १. स्टाइल र डार्क मोड फिक्स
    if (!document.getElementById('news-widget-styles')) {
        var style = document.createElement('style');
        style.id = 'news-widget-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap');
            
            /* डार्क मोडमा टाइटल सेतो बनाउने */
            @media (prefers-color-scheme: dark) {
                .news-title-text { color: #ffffff !important; }
            }
            .dark .news-title-text { color: #ffffff !important; }

            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // २. मुख्य रेन्डर फङ्सन (१ ठूलो + २ साना ग्रिड)
    window.mainNewsRender = function(json, targetId) {
        var target = document.getElementById(targetId);
        if (!target) return;
        
        var posts = json.feed.entry || [];
        var labelDisplay = json.feed.title.$t.split(": ").pop();

        if (posts.length === 0) {
            target.innerHTML = `<div class="p-4 text-gray-500 text-center">समाचार भेटिएन।</div>`;
            return;
        }

        var html = `
            <div class="flex flex-col bg-transparent h-full font-['Mukta']">
                <!-- हेडलाइन -->
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase">
                        ${labelDisplay}
                    </span>
                </div>
                
                <!-- न्यूज ग्रिड (मोबाइल र डेस्कटप दुवैमा २ कोलम ग्रिड) -->
                <div class="grid grid-cols-2 gap-3">`;

        posts.forEach((entry, i) => {
            if (i >= 3) return; 
            
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            if (i === 0) {
                // ठूलो पोष्ट
                html += `
                    <div class="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-1">
                        <a href="${link}" class="group block overflow-hidden rounded-lg shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[200px] md:h-[220px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="news-title-text text-[20px] md:text-[22px] font-extrabold text-gray-900 leading-tight mt-3 block hover:text-red-600 transition-colors">
                            ${title}
                        </a>
                    </div>`;
            } else {
                // साना दुई पोष्टहरु
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-md shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[100px] md:h-[120px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="news-title-text text-[15px] md:text-[17px] font-bold text-gray-800 leading-snug mt-2 line-clamp-2 hover:text-red-600 transition-colors">
                            ${title}
                        </a>
                    </div>`;
            }
        });

        html += `</div></div>`;
        target.innerHTML = html;
    };

    window.mainNewsCB1 = j => mainNewsRender(j, "main-box-1");
    window.mainNewsCB2 = j => mainNewsRender(j, "main-box-2");
    window.mainNewsCB3 = j => mainNewsRender(j, "main-box-3");

    window.mainNewsInit = function(c1, c2, c3, n) {
        var cats = [c1, c2, c3];
        var cbs = ['mainNewsCB1', 'mainNewsCB2', 'mainNewsCB3'];
        cats.forEach((cat, i) => {
            if (cat) {
                var s = document.createElement('script');
                s.src = "/feeds/posts/default/-/" + encodeURIComponent(cat.trim()) + "?alt=json-in-script&callback=" + cbs[i] + "&max-results=" + n;
                document.head.appendChild(s);
            }
        });
    };
})();
