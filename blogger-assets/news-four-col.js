(function() {
    // १. फन्ट र ३-लाइन क्ल्याम्प स्टाइल
    if (!document.getElementById('news-grid-style')) {
        var style = document.createElement('style');
        style.id = 'news-grid-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap');
            .clamp-3-lines {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // २. न्यूज रेन्डर फङ्सन (तस्विरको डिजाइन अनुसार)
    window.renderFourCol = function(json, targetId, customTitle) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];

        // टाइटल हेडलाइन (तस्विरमा जस्तै बीचमा नाम र दुबैतिर लाइन)
        var html = `
            <div class="font-['Mukta'] mb-8">
                <div class="relative flex py-2 items-center mb-4">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-red-600 text-xl font-extrabold">${customTitle}</span>
                    <div class="flex-grow border-t border-green-600 border-t-2"></div>
                </div>
                <div class="flex flex-col gap-4">`;

        if (posts.length === 0) {
            html += `<p class="text-gray-400 text-sm italic">समाचार भेटिएन।</p>`;
        } else {
            posts.forEach((entry, i) => {
                if (i >= 3) return; // प्रति सेक्सन ३ वटा पोष्ट
                var title = entry.title.$t;
                var link = entry.link.find(l => l.rel === 'alternate').href;
                var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 's200') : 'https://via.placeholder.com/150';

                html += `
                    <div class="flex gap-3 items-start group">
                        <div class="flex-shrink-0 w-24 h-16 overflow-hidden rounded shadow-sm bg-gray-100">
                            <a href="${link}">
                                <img src="${thumb}" alt="${title}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                            </a>
                        </div>
                        <div class="flex-grow">
                            <a href="${link}" class="text-gray-900 dark:text-gray-100 font-bold leading-tight text-[15px] hover:text-red-600 transition-colors clamp-3-lines no-underline">
                                ${title}
                            </a>
                        </div>
                    </div>`;
            });
        }

        html += `</div></div>`;
        target.innerHTML = html;
    };

    // ३. इनिसियलाइजेसन फङ्सन
    window.initFourCol = function(labels, titles, count) {
        labels.forEach((label, i) => {
            var cbName = "fourColCB" + i;
            window[cbName] = function(json) {
                renderFourCol(json, "col-box-" + i, titles[i]);
            };
            var s = document.createElement('script');
            s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbName + "&max-results=" + count;
            document.head.appendChild(s);
        });
    };
})();
