/**
 * Neelamb Multi-Site Share Plugin - Optimized Version
 * Features: Small icons, Screen-fitted layout, White X logo, Auto-URL detection.
 */

(function() {
    // १. स्टाइल इन्जेक्सन
    const injectStyles = () => {
        if (document.getElementById('neelamb-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-styles';
        style.textContent = `
            .neelamb-share-plugin {
                display: flex;
                flex-wrap: nowrap; /* आइकनहरू तल झर्न दिँदैन */
                overflow-x: auto; /* धेरै सानो स्क्रिन भएमा स्क्रोल हुन्छ, तल झर्दैन */
                gap: 8px; /* आइकनहरू बीचको दुरी अलि कम */
                margin: 15px 0;
                padding: 10px 0;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
                font-family: 'Mukta', sans-serif;
                align-items: center;
                justify-content: flex-start;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none; /* फायरफक्सका लागि स्क्रोलबार हटाउने */
            }
            .neelamb-share-plugin::-webkit-scrollbar { display: none; } /* क्रोमका लागि */

            .neelamb-count-inline {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-right: 10px;
                border-right: 2px solid #ddd;
                margin-right: 2px;
                min-width: 50px;
                flex-shrink: 0;
            }
            .neelamb-num { font-size: 18px; font-weight: 900; color: #d32f2f; line-height: 1; }
            .neelamb-label { font-size: 9px; font-weight: 700; color: #888; text-transform: uppercase; }

            .neelamb-btn-round {
                width: 36px; height: 36px; /* साइज ३६px बनाइएको छ (पहिले ४२px थियो) */
                border-radius: 50%; display: flex;
                flex-shrink: 0; /* आइकनलाई सानो हुन दिँदैन */
                align-items: center; justify-content: center; color: #fff !important;
                text-decoration: none !important; transition: all 0.3s ease;
                font-size: 16px; border: none; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .neelamb-btn-round:hover { transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0,0,0,0.15); }
            
            .bg-fb { background: #1877F2; }
            .bg-wa { background: #25D366; }
            .bg-msg { background: #0084FF; }
            .bg-tw { background: #000000; color: #ffffff !important; } /* X लोगो सेतो बनाइएको */
            .bg-gm { background: #EA4335; }
            .bg-copy { background: #64748b; }
            .bg-success { background: #059669 !important; }

            /* X Logo SVG Style */
            .bg-tw svg { fill: white; width: 16px; height: 16px; }

            @media (max-width: 480px) {
                .neelamb-share-plugin { gap: 6px; }
                .neelamb-btn-round { width: 34px; height: 34px; font-size: 14px; }
            }
        `;
        document.head.appendChild(style);
    };

    // २. शेयर काउन्ट लजिक
    const getShareCount = (url) => {
        let count = localStorage.getItem('neelamb_count_' + btoa(url).substring(0, 16));
        if (!count) {
            count = Math.floor(Math.random() * 40) + 15; 
            localStorage.setItem('neelamb_count_' + btoa(url).substring(0, 16), count);
        }
        return count;
    };

    const updateCount = (url) => {
        let count = parseInt(getShareCount(url)) + 1;
        localStorage.setItem('neelamb_count_' + btoa(url).substring(0, 16), count);
        const el = document.getElementById('neelamb-total-num');
        if(el) el.innerText = count;
    };

    // ३. मुख्य जेनेरेटर
    const renderNeelamb = () => {
        const containers = document.querySelectorAll('#neelambshare-plugin');
        if (containers.length === 0) return;

        const url = window.location.href;
        const title = document.title;
        const count = getShareCount(url);

        // X (Twitter) को लागि सेतो र क्लियर SVG लोगो
        const xLogo = `<svg viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>`;

        const pluginHTML = `
            <div class="neelamb-share-plugin">
                <div class="neelamb-count-inline">
                    <span class="neelamb-num" id="neelamb-total-num">${count}</span>
                    <span class="neelamb-label">Shares</span>
                </div>
                <a class="neelamb-btn-round bg-fb" title="Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                <a class="neelamb-btn-round bg-wa" title="WhatsApp" href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                <a class="neelamb-btn-round bg-msg" title="Messenger" href="fb-messenger://share/?link=${encodeURIComponent(url)}" target="_blank"><i class="fa-brands fa-facebook-messenger"></i></a>
                <a class="neelamb-btn-round bg-tw" title="X (Twitter)" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank">${xLogo}</a>
                <a class="neelamb-btn-round bg-gm" title="Gmail" href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" target="_blank"><i class="fa-solid fa-envelope"></i></a>
                <button class="neelamb-btn-round bg-copy" title="Copy Link" id="neelamb-copy-btn"><i class="fa-solid fa-link"></i></button>
            </div>
        `;

        containers.forEach(container => {
            container.innerHTML = pluginHTML;
            container.querySelectorAll('a, button').forEach(el => {
                el.onclick = () => updateCount(url);
            });

            const copyBtn = container.querySelector('#neelamb-copy-btn');
            copyBtn.onclick = function() {
                navigator.clipboard.writeText(url).then(() => {
                    const icon = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-check"></i>';
                    this.classList.add('bg-success');
                    setTimeout(() => {
                        this.innerHTML = icon;
                        this.classList.remove('bg-success');
                    }, 2000);
                });
                updateCount(url);
            };
        });
    };

    injectStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNeelamb);
    } else {
        renderNeelamb();
    }
})();
