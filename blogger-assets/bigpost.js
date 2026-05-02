/**
 * BigPost - Tailwind CSS Version
 * Features: Auto-detect Feed, Nepali Date, HD Image, Load More
 */
class BigPost {
    constructor(options) {
        this.containerId = options.containerId;
        this.loadMoreBtnId = options.loadMoreBtnId;
        this.feedUrl = options.feedUrl || `${window.location.origin}/feeds/posts/default`;
        this.postsPerPage = options.postsPerPage || 1;
        this.posts = [];
        this.displayedCount = 0;

        this.init();
    }

    // AD to BS Nepali Date Converter
    getNepaliDate(dateString) {
        const date = new Date(dateString);
        const nepMonths = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
        const nepNumbers = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
        
        let year = date.getFullYear() + 56;
        let month = date.getMonth() + 8;
        let day = date.getDate() + 17;

        if (day > 30) { day -= 30; month++; }
        if (month > 11) { month -= 12; year++; }

        const toNepNum = (num) => num.toString().split('').map(d => nepNumbers[d] || d).join('');
        return `${toNepNum(day)} ${nepMonths[month]} ${toNepNum(year)}`;
    }

    // HD Image Processor
    getClearHDImage(url) {
        if (!url) return 'https://via.placeholder.com/1300x700';
        let hd = url.replace(/\/s[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        hd = hd.replace(/\/w[0-9]+-h[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        if (hd.indexOf('=s') > -1) hd = hd.split('=s')[0] + '=s1600';
        return hd;
    }

    init() {
        const script = document.createElement('script');
        const callbackName = `ghCB_${Math.random().toString(36).substr(2, 9)}`;
        window[callbackName] = (data) => this.handleData(data);
        script.src = `${this.feedUrl}?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(script);

        const btn = document.getElementById(this.loadMoreBtnId);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                this.renderChunk();
            };
        }
    }

    handleData(data) {
        this.posts = data.feed.entry || [];
        if (this.posts.length > 0) {
            this.renderChunk();
        }
    }

    // Tailwind CSS UI Generator
    createPostHTML(post) {
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        const authorName = post.author[0].name.$t;
        const authorPic = post.author[0].gd$image ? post.author[0].gd$image.src.replace('/s35-c/', '/s100-c/') : 'https://via.placeholder.com/100';
        const thumb = post.media$thumbnail ? this.getClearHDImage(post.media$thumbnail.url) : 'https://via.placeholder.com/1300x700';
        const snip = (post.content.$t || post.summary.$t).replace(/<[^>]*>?/gm, '').trim().split(/\s+/).slice(0, 35).join(" ") + "...";
        const label = post.category ? post.category[0].term : "समाचार";
        const nepaliDate = this.getNepaliDate(post.published.$t);

        return `
            <article class="BigPost-wrap max-w-[1300px] mx-auto mb-12 px-4 font-['Mukta'] text-center">
                <a href="${link}" class="block text-[42px] md:text-[70px] font-[900] text-[#ed1c24] leading-[1.1] mb-4 hover:opacity-90 transition-all">
                    ${title}
                </a>

                <div class="flex items-center justify-center gap-3 mb-5 text-gray-500">
                    <img src="${authorPic}" class="w-[45px] h-[45px] rounded-full border-2 border-[#ed1c24] object-cover" alt="${authorName}">
                    <span class="font-bold text-gray-800 dark:text-gray-200">${authorName}</span>
                    <span class="text-gray-300">|</span>
                    <span class="text-[18px]">${nepaliDate}</span>
                </div>

                <div class="relative w-full overflow-hidden rounded-lg bg-gray-100 group">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 bg-[#ed1c24] text-white px-6 py-1 text-[16px] font-bold z-20 rounded-b-lg">
                        ${label}
                    </div>

                    <div class="absolute inset-[15px] border-[5px] border-[#ed1c24] z-10 pointer-events-none opacity-100 group-hover:opacity-80 transition-opacity"></div>

                    <div class="absolute bottom-[25px] left-1/2 -translate-x-1/2 z-20 flex gap-4">
                        <a href="#" class="bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" class="w-6 h-6" alt="FB"></a>
                        <a href="#" class="bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" class="w-6 h-6" alt="WA"></a>
                        <a href="#" class="bg-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" class="w-6 h-6" alt="YT"></a>
                    </div>

                    <a href="${link}">
                        <img src="${thumb}" class="w-full h-auto block object-contain" loading="lazy" alt="${title}">
                    </a>
                </div>

                <p class="text-[20px] text-gray-600 dark:text-gray-400 max-w-[900px] mx-auto mt-6 mb-4 line-relaxed">
                    ${snip}
                </p>

                <a href="${link}" class="inline-block bg-[#002e5b] text-white px-8 py-2 rounded font-bold hover:bg-[#001f3d] transition-colors">
                    थप पढ्नुहोस्
                </a>

                <hr class="border-t border-gray-200 mt-10">
            </article>
        `;
    }

    renderChunk() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const chunk = this.posts.slice(this.displayedCount, this.displayedCount + this.postsPerPage);
        chunk.forEach(p => {
            container.insertAdjacentHTML('beforeend', this.createPostHTML(p));
        });

        this.displayedCount += chunk.length;
        if (this.displayedCount >= this.posts.length) {
            const btn = document.getElementById(this.loadMoreBtnId);
            if (btn) btn.classList.add('hidden');
        }
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    new BigPost({
        containerId: 'big-post-container',
        loadMoreBtnId: 'big-post-load-more',
        postsPerPage: 1
    });
});
