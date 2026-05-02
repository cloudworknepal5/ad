(function() {
    // १. फन्ट र स्टाइल इन्जेक्सन
    if (!document.getElementById('mukta-font')) {
        var f = document.createElement('link');
        f.id = 'mukta-font';
        f.href = "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap";
        f.rel = "stylesheet";
        document.head.appendChild(f);
    }

    // २. मुख्य रेन्डर फङ्सन
    window.mainNewsRender = function(json, targetId) {
        var target = document.getElementById(targetId);
        if (!target) return;
        
        var posts = json.feed.entry || [];
        // फिड टाइटलबाट लेबलको नाम शुद्ध नेपालीमा निकाल्ने
        var labelDisplay = json.feed.title.$t.split(": ").pop();

        if (posts.length === 0) {
            target.innerHTML = `<div class="p-4 text-gray-400 border border-dashed rounded text-center">"${labelDisplay}" मा समाचार फेला परेन।</div>`;
            return;
        }

        var html = `
            <div class="flex flex-col bg-white h-full font-['Mukta']">
                <!-- Header -->
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase tracking-tight">
                        ${labelDisplay}
                    </span>
                </div>
                <!-- Grid -->
                <div class="grid grid-cols-2 gap-3">`;

        posts.forEach((entry, i) => {
            if (i >= 3) return; // जम्मा ३ वटा मात्र देखाउने
            
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            if (i === 0) {
                // पहिलो ठूलो पोस्ट
                html += `
                    <div class="col-span-2 border-b border-gray-100 pb-3 mb-2 flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-lg">
                            <img src="${thumb}" alt="${title}" class="w-full h-[210px] object-cover transition-transform duration-500 group-hover:scale-110">
                        </a>
                        <a href="${link}" class="text-[22px] font-extrabold text-gray-900 leading-[1.2] mt-3 block hover:text-red-700 transition-colors">
                            ${title}
                        </a>
                    </div>`;
            } else {
                // साना पोस्टहरू
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-md shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[105px] object-cover transition-transform duration-500 group-hover:scale-110">
                        </a>
                        <a href="${link}" class="text-[16px] font-bold text-gray-800 leading-snug mt-2 line-clamp-2 hover:text-red-700 transition-colors">
                            ${title}
                        </a>
                    </div>`;
            }
        });

        html += `</div></div>`;
        target.innerHTML = html;
    };

    // ३. ग्लोबल क्यालब्याकहरू
    window.mainNewsCB1 = j => mainNewsRender(j, "main-box-1");
    window.mainNewsCB2 = j => mainNewsRender(j, "main-box-2");
    window.mainNewsCB3 = j => mainNewsRender(j, "main-box-3");

    // ४. फिड लोड गर्ने (नेपाली लेबल फिक्स सहित)
    window.mainNewsInit = function(c1, c2, c3, n) {
        var cats = [c1, c2, c3];
        var cbs = ['mainNewsCB1', 'mainNewsCB2', 'mainNewsCB3'];
        
        cats.forEach((cat, i) => {
            if (cat) {
                var s = document.createElement('script');
                // नेपाली लेबलको लागि सुरक्षित URL संरचना
                var feedPath = "/feeds/posts/default/-/" + encodeURIComponent(cat.trim()) + "?alt=json-in-script&callback=" + cbs[i] + "&max-results=" + n;
                s.src = feedPath;
                document.head.appendChild(s);
            }
        });
    };
})();
