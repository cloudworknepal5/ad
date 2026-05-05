(function() {
    if (!document.getElementById('news-v3-style')) {
        var style = document.createElement('style');
        style.id = 'news-v3-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap');
            .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        `;
        document.head.appendChild(style);
    }

    window.renderParallelLayout = function(json, targetId, customTitle, isMain) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];

        var html = '<div class="font-[\'Mukta\'] h-full">';
        html += '<div class="relative flex py-2 items-center mb-6"><div class="flex-grow border-t border-gray-300"></div>';
        html += '<span class="flex-shrink mx-4 text-red-600 text-2xl font-extrabold">' + customTitle + '</span>';
        html += '<div class="flex-grow border-t border-green-600 border-t-2"></div></div>';

        if (posts.length === 0) {
            target.innerHTML = html + '<p class="text-gray-400 italic text-center">समाचार भेटिएन।</p></div>';
            return;
        }

        if (isMain) {
            // पहिलो कोलम: १ ठूलो + २ साना (कुल ३)
            html += '<div class="flex flex-col gap-6">';
            // मुख्य ठूलो समाचार
            html += '<div class="flex flex-col border-b border-gray-100 pb-4">';
            html += '<a href="' + posts[0].link.find(l=>l.rel==='alternate').href + '" class="block overflow-hidden rounded-lg mb-3 shadow-sm">';
            html += '<img src="' + posts[0].media$thumbnail.url.replace('s72-c','s640') + '" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"></a>';
            html += '<a href="' + posts[0].link.find(l=>l.rel==='alternate').href + '" class="text-2xl font-extrabold leading-tight text-black dark:text-white no-underline hover:text-red-700">' + posts[0].title.$t + '</a></div>';
            
            // मुनिका २ वटा साना समाचार
            html += '<div class="grid grid-cols-2 gap-4">';
            for (var i = 1; i <= 2; i++) {
                if (posts[i]) {
                    html += '<div class="flex flex-col gap-2">';
                    html += '<a href="' + posts[i].link.find(l=>l.rel==='alternate').href + '" class="block overflow-hidden rounded shadow-sm">';
                    html += '<img src="' + posts[i].media$thumbnail.url.replace('s72-c','s400') + '" class="w-full h-28 object-cover hover:scale-105 transition-transform"></a>';
                    html += '<a href="' + posts[i].link.find(l=>l.rel==='alternate').href + '" class="text-sm font-bold leading-snug text-black dark:text-white no-underline clamp-2 hover:text-red-700">' + posts[i].title.$t + '</a></div>';
                }
            }
            html += '</div></div>';
        } else {
            // दोस्रो र तेस्रो कोलम: ५-५ वटा समाचारको सूची
            html += '<div class="flex flex-col gap-5">';
            for (var j = 0; j < 5; j++) {
                if (posts[j]) {
                    html += '<div class="flex gap-4 items-center group border-b border-gray-50 pb-3 last:border-0">';
                    html += '<div class="flex-shrink-0 w-24 h-16 overflow-hidden rounded bg-gray-100 shadow-sm">';
                    html += '<img src="' + posts[j].media$thumbnail.url.replace('s72-c','s200') + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform"></div>';
                    html += '<a href="' + posts[j].link.find(l=>l.rel==='alternate').href + '" class="text-[15px] font-bold leading-tight text-gray-900 dark:text-gray-100 no-underline clamp-2 hover:text-red-700">' + posts[j].title.$t + '</a></div>';
                }
            }
            html += '</div>';
        }
        target.innerHTML = html + '</div>';
    };

    window.loadParallel = function(l1, t1, id1, l2, t2, id2, l3, t3, id3) {
        var labels = [l1, l2, l3];
        var titles = [t1, t2, t3];
        var ids = [id1, id2, id3];
        
        labels.forEach(function(label, i) {
            var cbName = "cb_parallel_" + ids[i].replace(/-/g, '_');
            window[cbName] = function(json) { renderParallelLayout(json, ids[i], titles[i], i === 0); };
            var s = document.createElement('script');
            s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbName + "&max-results=5";
            document.head.appendChild(s);
        });
    };
})();
