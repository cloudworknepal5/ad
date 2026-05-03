/**
 * Neelamb Multi-Site Share Plugin - Optimized Version 2.0
 * Features: Responsive, Starts from 0, Flex-scrolling.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-styles';
        style.textContent = `
            .neelamb-share-plugin {
                display: flex !important;
                flex-wrap: nowrap !important; /* मोबाइलमा नटुक्रियोस् भन्नका लागि */
                overflow-x: auto !important;  /* स्क्रिन बाहिर जाँदा स्लाइड हुने बनाउन */
                gap: 8px;
                margin: 5px 0;
                padding: 5px 0;
                font-family: 'Mukta', sans-serif;
                align-items: center;
                justify-content: flex-start; /* सुरुबाट मिलाउन */
                width: 100%;
                min-height: 45px;
                overflow-y: visible !important;
                -webkit-overflow-scrolling: touch; /* मोबाइलमा स्मूथ स्क्रोलका लागि */
                scrollbar-width: none; /* फायरफक्समा स्क्रोलबार लुकाउन */
            }
            .neelamb-share-plugin::-webkit-scrollbar { display: none; } /* क्रोममा स्क्रोलबार लुकाउन */

            .neelamb-count-inline {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-right: 10px;
                margin-right: 5px;
                border-right: 1.5px solid #ddd;
                min-width: 45px;
                flex-shrink: 0; /* यो नथिचियोस् भन्नका लागि */
            }
            .neelamb-num { font-size: 16px; font-weight: 900; color: #d32f2f; line-height: 1; }
            .neelamb-label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; }

            @media (prefers-color-scheme: dark) {
                .neelamb-num { color: #ff5252; }
                .neelamb-count-inline { border-right-color: #444; }
            }

            .neelamb-btn-round {
                width: 32px; height: 32px; /* मोबाइलमा फिट हुने साइज */
                border-radius: 50%; display: flex;
                flex-shrink: 0; /* बटनहरू चेप्टो हुन नदिन अनिवार्य */
                align-items: center; justify-content: center; color: #fff !important;
                text-decoration: none !important; transition: all 0.3s ease;
                font-size: 14px; border: none; cursor: pointer;
            }
            
            .neelamb-btn-round:hover { transform: translateY(-2px); }
            
            .bg-fb { background: #1877F2; }
            .bg-wa { background: #25D366; }
            .bg-msg { background: #0084FF; }
            .bg-tw { background: #000000; }
            .bg-gm { background: #EA4335; }
            .bg-copy { background: #64748b; }
            .bg-success { background: #059669 !important; }
            .bg-tw svg { fill: white; width: 14px; height: 14px; }

            /* ठूलो स्क्रिनका लागि अटो सेन्टर */
            @media (min-width: 768px) {
                .neelamb-share-plugin { justify-content: center; gap: 12px; }
                .neelamb-btn-round { width: 36px; height: 36px; font-size: 16px; }
            }
        `;
        document.head.appendChild(style);
    };

    const getShareCount = (url) => {
        const key = 'neelamb_share_v5_' + btoa(url).substring(0, 16);
        let count = localStorage.getItem(key);
        if (!count) {
            count = 0; 
            localStorage.setItem(key, count);
        }
        return count;
    };

    const updateCount = (url, container) => {
        const key = 'neelamb_share_v5_' + btoa(url).substring(0, 16);
        let count = parseInt(getShareCount(url)) + 1;
        localStorage.setItem(key, count);
        const el = container.querySelector('.neelamb-num');
        if(el) el.innerText = count;
    };

    const renderNeelamb = () => {
        const containers = document.querySelectorAll('#neelambshare-plugin');
        if (containers.length === 0) return;

        const url = window.location.href;
        const title = document.title;
        const count = getShareCount(url);
        const xLogo = `<svg viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>`;

        containers.forEach(container => {
            container.innerHTML = `
                <div class="neelamb-share-plugin no-scrollbar">
                    <div class="neelamb-count-inline">
                        <span class="neelamb-num">${count}</span>
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

            container.querySelectorAll('a').forEach(link => {
                link.onclick = () => updateCount(url, container);
            });

            const copyBtn = container.querySelector('#neelamb-copy-btn');
            copyBtn.onclick = function() {
                navigator.clipboard.writeText(url).then(() => {
                    const originalIcon = this.innerHTML;
                    this.innerHTML = '<i class="fa-solid fa-check"></i>';
                    this.classList.add('bg-success');
                    updateCount(url, container);
                    setTimeout(() => {
                        this.innerHTML = originalIcon;
                        this.classList.remove('bg-success');
                    }, 2000);
                });
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
