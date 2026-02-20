(function() {
    // 1. CSS Injection (Styles)
    const style = document.createElement('style');
    style.innerHTML = `
        .rp-sticky-widget {
            width: 100%;
            max-width: 320px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #e1e1e1;
            background: #fff;
            position: sticky;
            top: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 20px;
        }
        .rp-header {
            display: flex;
            background: #f4f4f4;
            border-bottom: 2px solid #ed1c24;
        }
        .rp-tab {
            flex: 1;
            padding: 12px 5px;
            border: none;
            cursor: pointer;
            background: #f4f4f4;
            font-weight: bold;
            font-size: 16px;
            color: #333;
            transition: 0.3s;
        }
        .rp-tab.active {
            background: #ed1c24;
            color: #fff;
        }
        .rp-content {
            max-height: 450px;
            overflow-y: auto;
        }
        .rp-list {
            display: none;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .rp-list.active {
            display: block;
        }
        .rp-item {
            padding: 12px 15px;
            border-bottom: 1px dotted #ccc;
            display: flex;
            align-items: flex-start;
        }
        .rp-item:hover {
            background: #fdf2f2;
        }
        .rp-item a {
            text-decoration: none;
            color: #222;
            font-size: 14px;
            line-height: 1.5;
            font-weight: 500;
        }
        .rp-item:before {
            content: "•";
            color: #ed1c24;
            font-weight: bold;
            margin-right: 8px;
        }
        .rp-footer {
            padding: 10px;
            text-align: center;
            background: #fafafa;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);

    // 2. Multi-function Widget HTML Structure
    const widgetHTML = `
        <div class="rp-sticky-widget">
            <div class="rp-header">
                <button class="rp-tab active" data-target="taja">ताजा</button>
                <button class="rp-tab" data-target="lokpriya">लोकप्रिय</button>
            </div>
            <div class="rp-content">
                <ul id="taja" class="rp-list active">
                    <li class="rp-item"><a href="#">लोडिङ हुँदैछ...</a></li>
                </ul>
                <ul id="lokpriya" class="rp-list">
                    <li class="rp-item"><a href="#">डाटा खोज्दै...</a></li>
                </ul>
            </div>
            <div class="rp-footer">
                <a href="/" style="color:#ed1c24; text-decoration:none;">थप समाचार »</a>
            </div>
        </div>
    `;

    // 3. Script Execution Logic
    document.addEventListener("DOMContentLoaded", function() {
        const container = document.getElementById('rp-sidebar-container');
        if (container) {
            container.innerHTML = widgetHTML;

            // Tab Switching Functionality
            const tabs = document.querySelectorAll('.rp-tab');
            const lists = document.querySelectorAll('.rp-list');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const target = this.getAttribute('data-target');
                    
                    tabs.forEach(t => t.classList.remove('active'));
                    lists.forEach(l => l.classList.remove('active'));

                    this.classList.add('active');
                    document.getElementById(target).classList.add('active');
                });
            });

            // Auto-fetch News Simulation (Multi-functionality)
            fetchBloggerNews();
        }
    });

    function fetchBloggerNews() {
        // यहाँ तपाईंले आफ्नो ब्लगरको RSS Feed URL हाल्न सक्नुहुन्छ
        const tajaList = document.getElementById('taja');
        const dummyNews = [
            { title: "नेपालको पछिल्लो राजनीतिक अवस्था र अबको बाटो", url: "#" },
            { title: "आजको सुनचाँदीको भाउ: तोलामा ५०० ले वृद्धि", url: "#" },
            { title: "खेलकुद: राष्ट्रिय टोलीको नयाँ जर्सी सार्वजनिक", url: "#" },
            { title: "मौसम अपडेट: पहाडी क्षेत्रमा वर्षाको सम्भावना", url: "#" }
        ];

        let html = dummyNews.map(news => `
            <li class="rp-item"><a href="${news.url}">${news.title}</a></li>
        `).join('');
        
        tajaList.innerHTML = html;
    }
})();
