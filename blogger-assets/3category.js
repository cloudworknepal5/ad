/**
 * File: news-portal-widget.js
 * Description: Multi-column News Grid using Tailwind CSS
 * No changes made to the original logic, only CSS and JS merged.
 */

(function() {
    // १. समाचार रेन्डर गर्ने मुख्य फंक्सन (अपरिवर्तित लजिक)
    window.mainNewsRender = function(json, targetId) {
        var posts = json.feed.entry || [];
        var target = document.getElementById(targetId);

        if (!posts || posts.length === 0) {
            if(target) target.innerHTML = "<div class='p-4 text-gray-500'>समाचार भेटिएन।</div>";
            return;
        }

        // फिडबाट लेबलको नाम प्राप्त गर्ने
        var labelName = json.feed.title.$t.split(": ").pop();

        // Tailwind CSS मार्फत डिजाइन संरचना
        var html = `
            <div class="flex-1 min-w-[320px] bg-white p-2 font-['Mukta',sans-serif]">
                <div class="flex border-b-2 border-[#cc0000] mb-4">
                    <div class="bg-[#cc0000] text-white px-4 py-1 text-lg font-bold uppercase tracking-wide">
                        ${labelName}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">`;

        for (var i = 0; i < Math.min(posts.length, 3); i++) {
            var entry = posts[i];
            var title = entry.title.$t;
            var link = entry.link.find(l => l.rel === 'alternate').href;
            
            // थम्बनेल साइज लजिक
            var thumbSize = (i === 0) ? 's640' : 's400';
            var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', thumbSize) : 'https://via.placeholder.com/400x250';

            if (i === 0) {
                // पहिलो ठूलो समाचार (Span 2)
                html += `
                    <div class="col-span-2 border-b border-gray-100 pb-3 mb-2 flex flex-col">
                        <a href="${link}" class="group overflow-hidden rounded-md shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-[22px] font-bold text-gray-900 leading-tight mt-3 hover:text-[#cc0000] transition-colors">
                            ${title}
                        </a>
                    </div>`;
            } else {
                // बाँकी २ साना समाचारहरू
                html += `
                    <div class="flex flex-col">
                        <a href="${link}" class="group overflow-hidden rounded-md shadow-sm">
                            <img src="${thumb}" alt="${title}" class="w-full h-[110px] object-cover transition-transform duration-500 group-hover:scale-105">
                        </a>
                        <a href="${link}" class="text-[17px] font-bold text-gray-800 leading-snug mt-2 line-clamp-2 hover:text-[#cc0000] transition-colors">
                            ${title}
                        </a>
                    </div>`;
            }
        }
        html += '</div></div>';
        target.innerHTML = html;
    };

    // २. JSON Callbacks
    window.mainNewsCB1 = j => mainNewsRender(j, "main-box-1");
    window.mainNewsCB2 = j => mainNewsRender(j, "main-box-2");
    window.mainNewsCB3 = j => mainNewsRender(j, "main-box-3");

    // ३. फिड कनेक्ट गर्ने फंक्सन (अपरिवर्तित)
    window.mainNewsInit = function(c1, c2, c3, n) {
        // फन्ट लोड गर्ने
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
