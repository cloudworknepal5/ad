(function() {
    // १. स्टाइल र फन्ट लोड
    if (!document.getElementById('news-final-style')) {
        var style = document.createElement('style');
        style.id = 'news-final-style';
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

    // २. न्यूज रेन्डर गर्ने फङ्सन
    window.renderGrid = function(json, targetId, displayTitle) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];
        
        var html = `
            <div class="font-['Mukta']">
                <!-- विजेट टाइटल: रातो बक्स -->
                <div class="flex items-center border-b-2 border-red-700 mb-4">
                    <span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase">${displayTitle}</span>
                </div>
                <div class="grid grid-cols-2 gap-4">`;

        if (posts.length === 0) {
            target.innerHTML = html + `<p class="col-span-2 text-gray-500 py-6 text-center italic border border-dashed border-gray-300 rounded-lg">"${displayTitle}" मा पोस्ट भेटिएन।</p></div>`;
            return;
        }

        posts.forEach((entry, i) => {
            if (i >= 3) return;
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 's600') : 'https://via.placeholder.com/600x400';
            
            // टाइटल क्लास: लाइट मोडमा कालो, डार्क मोडमा सेतो, २ लाइन मात्र
            var titleClass = "text-black dark:text-white hover:text-red-700 font-bold leading-tight clamp-2 no-underline transition-colors";

            if (i === 0) {
                html += `
                    <div class="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                        <a href="${link}" class="group block overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                            <img src="${thumb}" class="w-full h-[200px] md:h-[240px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleClass} text-2xl md:text-3xl font-extrabold mt-3 block">${title}</a>
                    </div>`;
            } else {
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                            <img src="${thumb}" class="w-full h-[100px] md:h-[130px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="${titleClass} text-base md:text-lg mt-2 block">${title}</a>
                    </div>`;
            }
        });
        target.innerHTML = html + `</div></div>`;
    };

    // ३. फिड लोड गर्ने फङ्सन (नेपाली युनिकोड सपोर्ट)
    window.loadNews = function(targetId, labelName, displayTitle, count) {
        var script = document.createElement('script');
        var blogUrl = window.location.origin;
        script.src = blogUrl + "/feeds/posts/default/-/" + encodeURIComponent(labelName.trim()) + "?alt=json-in-script&callback=cb_" + targetId + "&max-results=" + count;
        window["cb_" + targetId] = function(json) { renderGrid(json, targetId, displayTitle); };
        document.head.appendChild(script);
    };
})();
