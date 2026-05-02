(function() {
    // १. फन्ट र २-लाइन क्ल्याम्प स्टाइल
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

    // २. मुख्य रेन्डर फङ्सन
    window.mainNewsRender = function(json, targetId, customTitle) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];

        var html = '<div class="flex flex-col h-full font-[\'Mukta\']">';
        html += '<div class="flex items-center border-b-2 border-red-700 mb-4">';
        html += '<span class="bg-red-700 text-white px-4 py-1 text-lg font-extrabold uppercase tracking-tight">' + customTitle + '</span>';
        html += '</div>';

        if (posts.length === 0) {
            html += '<div class="p-4 text-gray-500 text-center italic border rounded-lg border-dashed">समाचार भेटिएन।</div>';
        } else {
            html += '<div class="grid grid-cols-2 gap-4">';
            for (var i = 0; i < posts.length; i++) {
                if (i >= 3) break;
                var entry = posts[i];
                var title = entry.title.$t;
                var link = "";
                for (var j = 0; j < entry.link.length; j++) {
                    if (entry.link[j].rel === 'alternate') { link = entry.link[j].href; break; }
                }
                var thumbSize = (i === 0) ? 's640' : 's400';
                var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/600x400';
                
                var titleBase = "text-black dark:text-white hover:text-red-700 transition-colors duration-200 no-underline block clamp-2-lines font-bold leading-tight";

                if (i === 0) {
                    html += '<div class="col-span-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">';
                    html += '<a href="' + link + '" class="group block overflow-hidden rounded-xl shadow-sm bg-gray-100">';
                    html += '<img src="' + thumb + '" class="w-full h-[200px] md:h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"></a>';
                    html += '<a href="' + link + '" class="' + titleBase + ' mt-3 text-2xl md:text-3xl font-extrabold">' + title + '</a>';
                    html += '</div>';
                } else {
                    html += '<div class="flex flex-col">';
                    html += '<a href="' + link + '" class="group block overflow-hidden rounded-lg shadow-sm bg-gray-100">';
                    html += '<img src="' + thumb + '" class="w-full h-[100px] md:h-[130px] object-cover transition-transform duration-500 group-hover:scale-105"></a>';
                    html += '<a href="' + link + '" class="' + titleBase + ' mt-2 text-base md:text-lg">' + title + '</a>';
                    html += '</div>';
                }
            }
            html += '</div>';
        }
        html += '</div>';
        target.innerHTML = html;
    };

    // ३. इनिसियलाइजेशन फङ्सन
    window.mainNewsInit = function(l1, t1, l2, t2, l3, t3, n) {
        var labels = [l1, l2, l3];
        var titles = [t1, t2, t3];
        var boxes = ["main-box-1", "main-box-2", "main-box-3"];

        labels.forEach(function(label, i) {
            if (label) {
                var cbName = "mainNewsCB" + (i + 1);
                window[cbName] = function(json) { mainNewsRender(json, boxes[i], titles[i]); };
                var s = document.createElement('script');
                s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbName + "&max-results=" + n;
                document.head.appendChild(s);
            }
        });
    };
})();
