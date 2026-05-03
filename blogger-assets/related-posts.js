/**
 * Neelamb Related Posts Tool for Blogger
 * Features: Tailwind CSS UI, Dynamic Labels, Multi-function logic
 */

(function() {
    // कन्फिगरेसन सेटिङ्स
    const config = {
        numPosts: 4,
        titleLength: 60,
        containerId: 'neelamb-related-posts',
        noImage: "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"
    };

    window.showRelatedPosts = function(json) {
        const container = document.getElementById(config.containerId);
        if (!container || !json.feed.entry) return;

        let posts = json.feed.entry;
        // हालको पोष्टलाई लिस्टबाट हटाउन फिल्टर गर्न सकिन्छ
        
        let html = `
            <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
                    <span class="w-2 h-8 bg-blue-600 mr-3 rounded-full"></span>
                    सम्बन्धित थप जानकारी
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        `;

        posts.forEach(entry => {
            let title = entry.title.$t;
            if (title.length > config.titleLength) {
                title = title.substring(0, config.titleLength) + '...';
            }

            let link = "";
            for (let i = 0; i < entry.link.length; i++) {
                if (entry.link[i].rel === 'alternate') {
                    link = entry.link[i].href;
                    break;
                }
            }

            let img = entry.media$thumbnail 
                ? entry.media$thumbnail.url.replace('s72-c', 'w600-h400-c') 
                : config.noImage;

            html += `
                <a href="${link}" class="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div class="relative h-40 overflow-hidden">
                        <img src="${img}" alt="${title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"/>
                    </div>
                    <div class="p-4">
                        <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
                            ${title}
                        </h4>
                    </div>
                </a>
            `;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    };

    // लेबल अनुसार डेटा लोड गर्ने फंक्सन
    window.loadRelatedData = function(label) {
        const script = document.createElement('script');
        script.src = `/feeds/posts/default/-/${label}?alt=json-in-script&callback=showRelatedPosts&max-results=${config.numPosts}`;
        document.body.appendChild(script);
    };
})();
