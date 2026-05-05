(function() {
    if (!document.getElementById('news-mixed-style')) {
        var style = document.createElement('style');
        style.id = 'news-mixed-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;700;800&display=swap');
            .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        `;
        document.head.appendChild(style);
    }

    window.renderMixedLayout = function(json, targetId, customTitle, type) {
        var target = document.getElementById(targetId);
        if (!target) return;
        var posts = json.feed.entry || [];

        var html = `
            <div class="font-['Mukta']">
                <div class="relative flex py-2 items-center mb-6">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-red-600 text-2xl font-extrabold">${customTitle}</span>
                    <div class="flex-grow border-t border-green-600 border-t-2"></div>
                </div>`;

        if (posts.length === 0) {
            target.innerHTML = html + `<p class="text-gray-400 italic">समाचार भेटिएन।</p></div>`;
            return;
        }

        if (type === 'mixed') {
            // अर्थ/कृषि लेआउट: १ ठूलो, २ तल साना, ५ दायाँ साना
            html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- बायाँ भाग -->
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col border-b pb-4 mb-2">
                        <a href="${posts[0].link.find(l=>l.rel==='alternate').href}" class="block overflow-hidden rounded-lg mb-3">
                            <img src="${posts[0].media$thumbnail.url.replace('s72-c','s600')}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500">
                        </a>
                        <a href="${posts[0].link.find(l=>l.rel==='alternate').href}" class="text-2xl font-extrabold leading-tight text-black dark:text-white no-underline hover:text-red-700">${posts[0].title.$t}</a>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${[1, 2].map(i => posts[i] ? `
                            <div class="flex flex-col gap-2">
                                <a href="${posts[i].link.find(l=>l.rel==='alternate').href}" class="block overflow-hidden rounded shadow-sm">
                                    <img src="${posts[i].media$thumbnail.url.replace('s72-c','s400')}" class="w-full h-28 object-cover hover:scale-105 transition-transform">
                                </a>
                                <a href="${posts[i].link.find(l=>l.rel==='alternate').href}" class="text-sm font-bold leading-snug text-black dark:text-white no-underline clamp-2 hover:text-red-700">${posts[i].title.$t}</a>
                            </div>` : '').join('')}
                    </div>
                </div>
                <!-- दायाँ सूची भाग -->
                <div class="flex flex-col gap-4 border-l pl-0 md:pl-6">
                    ${posts.slice(3, 8).map(post => `
                        <div class="flex gap-3 items-center group">
                            <div class="flex-shrink-0 w-24 h-16 overflow-hidden rounded bg-gray-100">
                                <img src="${post.media$thumbnail.url.replace('s72-c','s200')}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                            </div>
                            <a href="${post.link.find(l=>l.rel==='alternate').href}" class="text-[15px] font-bold leading-tight text-gray-900 dark:text-gray-100 no-underline clamp-2 hover:text-red-700">${post.title.$t}</a>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        } else {
            // कर्पोरेट/व्यवसाय लेआउट: शुद्ध ५ वटा सूची
            html += `<div class="flex flex-col gap-5">
                ${posts.slice(0, 6).map(post => `
                    <div class="flex gap-4 items-center group">
                        <div class="flex-shrink-0 w-28 h-20 overflow-hidden rounded bg-gray-100">
                            <img src="${post.media$thumbnail.url.replace('s72-c','s300')}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                        </div>
                        <a href="${post.link.find(l=>l.rel==='alternate').href}" class="text-[15px] font-bold leading-snug text-black dark:text-white no-underline clamp-3 hover:text-red-700">${post.title.$t}</a>
                    </div>
                `).join('')}
            </div>`;
        }

        target.innerHTML = html + `</div>`;
    };

    window.initMixedLayout = function(l1, t1, l2, t2) {
        var labels = [l1, l2];
        var titles = [t1, t2];
        var types = ['mixed', 'list'];
        
        labels.forEach((label, i) => {
            var cbName = "mixedCB" + i;
            window[cbName] = function(json) { renderMixedLayout(json, "mixed-box-" + i, titles[i], types[i]); };
            var s = document.createElement('script');
            s.src = "/feeds/posts/default/-/" + encodeURIComponent(label.trim()) + "?alt=json-in-script&callback=" + cbName + "&max-results=8";
            document.head.appendChild(s);
        });
    };
})();
