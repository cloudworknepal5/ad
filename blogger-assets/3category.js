(function() {
    // १. फन्ट र २-लाइन क्ल्याम्प स्टाइल
    if (!document.getElementById('news-pro-style')) {
        var style = document.createElement('style');
        style.id = 'news-pro-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap');
            .clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // २. न्यूज रेन्डर गर्ने मुख्य फङ्सन
    window.renderGrid = function(json, targetId, displayTitle) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];
        
        // विजेटको हेडलाइन (रातो बक्स)
        var html = `
            <div class="font-['Mukta']">
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase tracking-tight">${displayTitle}</span>
                </div>
                <div class="grid grid-cols-2 gap-4">`;

        if (posts.length === 0) {
            target.innerHTML = html + `<p class="col-span-2 text-gray-500 py-6 text-center italic border border-dashed border-gray-300 rounded-lg">"${displayTitle}" मा कुनै पोस्ट भेटिएन।</p></div>`;
            return;
        }

        posts.forEach((entry, i) => {
            if (i >= 3) return; // १ ठूलो, २ सानो (कुल ३ पोस्ट)
            
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 's600') : 'https://via.placeholder.com/600x400';
            
            if (i === 0) {
                // पहिलो ठूलो पोस्ट
                html += `
                    <div class="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                        <a href="${link}" class="group block overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                            <img src="${thumb}" class="w-full h-[200px] md:h-[250px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-black dark:text-white hover:text-red-700 font-extrabold text-2xl md:text-3xl mt-3 block leading-tight clamp-2 no-underline transition-colors">
                            ${title}
                        </a>
                    </div>`;
            } else {
                // तलका दुईवटा साना पोस्ट
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                            <img src="${thumb}" class="w-full h-[100px] md:h-[140px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-black dark:text-white hover:text-red-700 font-bold text-base md:text-lg mt-2 block leading-snug clamp-2 no-underline transition-colors">
                            ${title}
                        </a>
                    </div>`;
            }
        });

        target.innerHTML = html + `</div></div>`;
    };

    // ३. फिड लोड गर्ने फङ्सन (URL Encoding Fix)
    window.loadNews = function(targetId, labelName, displayTitle, count) {
        var script = document.createElement('script');
        var blogUrl = window.location.origin;
        // नेपाली लेबललाई सुरक्षित तरिकाले URL मा बदल्ने
        script.src = blogUrl + "/feeds/posts/default/-/" + encodeURIComponent(labelName.trim()) + "?alt=json-in-script&callback=cb_" + targetId + "&max-results=" + count;
        
        window["cb_" + targetId] = function(json) {
            renderGrid(json, targetId, displayTitle);
        };
        document.head.appendChild(script);
    };
})();
