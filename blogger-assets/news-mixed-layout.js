(function() {
    if (!document.getElementById('news-v5-style')) {
        var style = document.createElement('style');
        style.id = 'news-v5-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap');
            .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        `;
        document.head.appendChild(style);
    }

    window.renderParallelLayout = function(json, targetId, customTitle, isMain) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];

        var html = '<div class="font-[\'Mukta\'] h-full">';
        html += '<div class="relative flex py-2 items-center mb-4"><div class="flex-grow border-t border-gray-300"></div>';
        html += '<span class="flex-shrink mx-4 text-red-600 text-2xl font-extrabold">' + customTitle + '</span>';
        html += '<div class="flex-grow border-t border-green-600 border-t-2"></div></div>';

        if (posts.length === 0) {
            target.innerHTML = html + '<p class="text-gray-400 italic text-center">समाचार भेटिएन।</p></div>';
            return;
        }

        var titleClass = "font-bold leading-tight text-black dark:text-white no-underline hover:text-red-700 clamp-2 transition-colors";

        if (isMain) {
            // पहिलो कोलम: ग्याप कम गरिएको (gap-3)
            html += '<div class="flex flex-col gap-3">';
            // मुख्य समाचार
            html += '<div class="flex flex-col border-b border-gray-100 pb-2 mb-1">';
            html += '<a href="' + posts[0].link.find(l=>l.rel==='alternate').href + '" class="block overflow-hidden rounded-lg mb-2 shadow-sm">';
            html += '<img src="' + posts[0].media$thumbnail.url.replace('s72-c','s640') + '" class="w-full h-60 object-cover hover:scale-105 transition-transform duration-500"></a>';
            html += '<a href="' + posts[0].link.find(l=>l.rel==='alternate').href + '" class="' + titleClass + ' text-2xl font-extrabold">' + posts[0].title.$t + '</a></div>';
            
            // मुनिका २ साना समाचार
            html += '<div class="grid grid-cols-2 gap-3">';
            for (var i = 1; i <= 2; i++) {
                if (posts[i]) {
                    html += '<div class="flex flex-col gap-1">';
                    html += '<a href="' + posts[i].link.find(l=>l.rel==='alternate').href + '" class="block overflow-hidden rounded shadow-sm">';
                    html += '<img src="' + posts[i].media$thumbnail.url.replace('s72-c','s400') + '" class="w-full h-24 object-cover hover:scale-105 transition-transform"></a>';
                    html += '<a href="' + posts[i].link.find(l=>l.rel==='alternate').href + '" class="' + titleClass + ' text-sm">' + posts[i].title.$t + '</a></div>';
                }
            }
            html += '</div></div>';
        } else {
            // अन्य कोलमहरू (५ समाचार)
            html += '<div class="flex flex-col gap-4">';
            for (var j = 0; j < 6; j++) {
                if (posts[j]) {
                    html += '<div class="flex gap-3 items-center group border-b border-gray-50 pb-2 last:border-0">';
                    html += '<div class="flex-shrink-0 w-20 h-14 overflow-hidden rounded bg-gray-100">';
                    html += '<img src="' + posts[j].media$thumbnail.url.replace('s72-c','s200') + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform"></div>';
                    html += '<a href="' + posts[j].link.find(l=>l.rel==='alternate').href + '" class="' + titleClass + ' text-[15px]">' + posts[j].title.$t + '</a></div>';
                }
            }
            html += '</div>';
        }
        target.innerHTML = html + '</div>';
    };

    window.loadParallelMulti = function(l1, t1, id1, l2, t2, id2, l3, t3, id3) {
        var labels = [l1, l2, l3], titles = [t1, t2, t3], ids = [id1, id2, id3];
        labels.forEach(function(label, i) {
            var cbName = "cb_" + ids[i].replace(/-/g, '_');
            window[cbName] = function(json) { renderParallelLayout(json, ids[i], titles[i], i === 0); };
            var s = document.createElement('script');
            s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbName + "&max-results=6";
            document.head.appendChild(s);
        });
    };
})();
