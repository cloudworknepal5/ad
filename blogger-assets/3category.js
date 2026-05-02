(function() {
    // १. फन्ट र लाइन-क्ल्याम्प स्टाइल (यदि टेलवेन्डको पुरानो भर्सन छ भनेका लागि)
    if (!document.getElementById('mukta-font')) {
        var f = document.createElement('link');
        f.id = 'mukta-font';
        f.href = "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap";
        f.rel = "stylesheet";
        document.head.appendChild(f);
        
        var style = document.createElement('style');
        style.innerHTML = `
            .custom-line-clamp {
                display: -webkit-box;
                -webkit-line-clamp: 2; /* शीर्षक २ लाइनमा मात्र सीमित */
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // २. मुख्य रेन्डर फङ्सन
    window.mainNewsRender = function(json, targetId) {
        var target = document.getElementById(targetId);
        if (!target) return;
        
        var posts = json.feed.entry || [];
        var labelDisplay = json.feed.title.$t.split(": ").pop();

        if (posts.length === 0) {
            target.innerHTML = `<div class="p-4 text-gray-500 text-center font-['Mukta']">समाचार भेटिएन।</div>`;
            return;
        }

        var html = `
            <div class="flex flex-col bg-transparent h-full font-['Mukta']">
                <!-- विधाको हेडलाइन -->
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase">
                        ${labelDisplay}
                    </span>
                </div>
                
                <!-- न्यूज ग्रिड -->
                <div class="grid grid-cols-2 gap-4">`;

        posts.forEach((entry, i) => {
            if (i >= 3) return; // जम्मा ३ वटा पोष्ट देखाउने (१ ठूलो, २ सानो)
            
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            // टेलवेन्ड क्लासहरू: लाइटमा कालो, डार्कमा सेतो, र २ लाइन क्ल्याम्प
            var titleClasses = "text-black dark:text-white hover:text-red-700 transition-colors duration-200 no-underline block custom-line-clamp";

            if (i === 0) {
                // पहिलो ठूलो पोष्ट
                html += `
                    <div class="col-span-2 border-b border-gray-200 dark:border-gray-800 pb-4 mb-2">
                        <a href="${link}" class="group block overflow-hidden rounded-lg shadow-sm bg-gray-100">
                            <img src="${thumb}" alt="${title}" class="w-full h-[200px] md:h-[240px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleClasses} font-extrabold leading-tight mt-3 text-2xl md:text-3xl">
                            ${title}
                        </a>
                    </div>`;
            } else {
                // साना पोष्टहरु
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-md shadow-sm bg-gray-100">
                            <img src="${thumb}" alt="${title}" class="w-full h-[100px] md:h-[130px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleClasses} font-bold leading-snug mt-2 text-base md:text-lg">
                            ${title}
                        </a>
                    </div>`;
            }
        });

        html += `</div></div>`;
        target.innerHTML = html;
    };

    // ३. क्यालब्याक र इनिसियलाइजेसन
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
