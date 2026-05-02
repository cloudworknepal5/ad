(function() {
    // १. स्टाइल इन्जेक्सन (होभर इफेक्टका लागि मात्र)
    if (!document.getElementById('news-widget-styles')) {
        var style = document.createElement('style');
        style.id = 'news-widget-styles';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap');
            .news-title-text:hover { color: #cc0000 !important; }
            .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        `;
        document.head.appendChild(style);
    }

    // २. मुख्य रेन्डर फङ्सन
    window.mainNewsRender = function(json, targetId) {
        var target = document.getElementById(targetId);
        if (!target) return;
        
        var posts = json.feed.entry || [];
        var labelDisplay = json.feed.title.$t.split(": ").pop();

        // डार्क मोड चेक गर्ने लजिक
        var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var themeColor = isDarkMode ? "#ffffff" : "#000000";

        if (posts.length === 0) {
            target.innerHTML = `<div class="p-4 text-gray-500 text-center font-['Mukta']">समाचार फेला परेन।</div>`;
            return;
        }

        var html = `
            <div class="flex flex-col bg-transparent h-full font-['Mukta']">
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase">
                        ${labelDisplay}
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-4">`;

        posts.forEach((entry, i) => {
            if (i >= 3) return; 
            
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            // Inline Style प्रयोग गरेर कलर फिक्स (यसले थिमको CSS लाई ओभरराइड गर्छ)
            var dynamicStyle = `style="color: ${themeColor} !important; text-decoration: none !important; display: block;"`;

            if (i === 0) {
                html += `
                    <div class="col-span-2 border-b border-gray-100 pb-3 mb-1">
                        <a href="${link}" class="group block overflow-hidden rounded-lg shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[210px] md:h-[230px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="news-title-text font-extrabold leading-tight mt-3" ${dynamicStyle}>
                            <span style="font-size: 24px;">${title}</span>
                        </a>
                    </div>`;
            } else {
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-md shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[105px] md:h-[125px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="news-title-text font-bold leading-snug mt-2 line-clamp-2" ${dynamicStyle}>
                            <span style="font-size: 16px;">${title}</span>
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
