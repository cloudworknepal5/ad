/**
 * File: news-portal-widget.js
 * Description: 3-Column News Grid using Tailwind CSS
 * Fixed: Displaying boxes side-by-side in 3 columns
 */

(function() {
    // १. समाचार रेन्डर गर्ने मुख्य फंक्सन
    window.mainNewsRender = function(json, targetId) {
        var posts = json.feed.entry || [];
        var target = document.getElementById(targetId);

        if (!posts || posts.length === 0) {
            if(target) target.innerHTML = "<div class='p-4 text-gray-400'>समाचार भेटिएन।</div>";
            return;
        }

        var labelName = json.feed.title.$t.split(": ").pop();

        // बक्स भित्रको आन्तरिक डिजाइन
        var html = `
            <div class="bg-white p-2 h-full font-['Mukta',sans-serif]">
                <div class="flex border-b-2 border-[#cc0000] mb-4">
                    <div class="bg-[#cc0000] text-white px-4 py-1 text-lg font-bold uppercase">
                        ${labelName}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">`;

        for (var i = 0; i < Math.min(posts.length, 3); i++) {
            var entry = posts[i];
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            if (i === 0) {
                html += `
                    <div class="col-span-2 border-b border-gray-100 pb-3 mb-2">
                        <a href="${link}" class="group block overflow-hidden rounded-md">
                            <img src="${thumb}" alt="${title}" class="w-full h-[200px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-[20px] font-bold text-gray-900 leading-tight mt-2 block hover:text-[#cc0000]">
                            ${title}
                        </a>
                    </div>`;
            } else {
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group block overflow-hidden rounded-md">
                            <img src="${thumb}" alt="${title}" class="w-full h-[100px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-[16px] font-bold text-gray-800 leading-snug mt-2 line-clamp-2 hover:text-[#cc0000]">
                            ${title}
                        </a>
                    </div>`;
            }
        }
        html += '</div></div>';
        target.innerHTML = html;
    };

    window.mainNewsCB1 = j => mainNewsRender(j, "main-box-1");
    window.mainNewsCB2 = j => mainNewsRender(j, "main-box-2");
    window.mainNewsCB3 = j => mainNewsRender(j, "main-box-3");

    window.mainNewsInit = function(c1, c2, c3, n) {
        if (!document.getElementById('mukta-font')) {
            var f = document.createElement('link');
            f.id = 'mukta-font';
            f.href = "https://fonts.googleapis.com/css2?family=Mukta:wght@700&display=swap";
            f.rel = "stylesheet";
            document.head.appendChild(f);
        }

        var cats = [c1, c2, c3];
        var cbs = ['mainNewsCB1', 'mainNewsCB2', 'mainNewsCB3'];
        
        cats.forEach((cat, i) => {
            if (cat) {
                let s = document.createElement('script');
                s.src = '/feeds/posts/default/-/' + encodeURIComponent(cat) + '?alt=json-in-script&callback=' + cbs[i] + '&max-results=' + n;
                document.head.appendChild(s);
            }
        });
    };
})();
