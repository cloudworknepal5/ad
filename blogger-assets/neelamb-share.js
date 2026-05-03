/**
 * Neelamb Multi-Site Share Plugin - Optimized Version 2.0
 * Features: Starts from 0, Center-aligned, Multi-function.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-styles';
        style.textContent = `
            .neelamb-share-plugin {
                display: flex;
                flex-wrap: nowrap;
                overflow-x: auto;
                gap: 12px;
                margin: 15px auto;
                padding: 12px 0;
                font-family: 'Mukta', sans-serif;
                align-items: center;
                justify-content: center; 
                width: 100%;
                min-height: 55px; /* बटन नकाटिन यो अनिवार्य छ */
                overflow: visible !important;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
            }
            .neelamb-share-plugin::-webkit-scrollbar { display: none; }

            .neelamb-count-inline {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-right: 12px;
                border-right: 2px solid #ddd;
                min-width: 55px;
                flex-shrink: 0;
            }
            .neelamb-num { font-size: 18px; font-weight: 900; color: #d32f2f; line-height: 1; }
            .neelamb-label { font-size: 9px; font-weight: 700; color: #888; text-transform: uppercase; }

            @media (prefers-color-scheme: dark) {
                .neelamb-num { color: #ff5252; }
                .neelamb-count-inline { border-right-color: #444; }
            }

            .neelamb-btn-round {
                width: 38px; height: 38px;
                border-radius: 50%; display: flex;
                flex-shrink: 0;
                align-items: center; justify-content: center; color: #fff !important;
                text-decoration: none !important; transition: all 0.3s ease;
                font-size: 18px; border: none; cursor: pointer;
            }
            
            .neelamb-btn-round:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            
            .bg-fb { background: #1877F2; }
            .bg-wa { background: #25D366; }
            .bg-msg { background: #0084FF; }
            .bg-tw { background: #000000; }
            .bg-gm { background: #EA4335; }
            .bg-copy { background: #64748b; }
            .bg-success { background: #059669 !important; }
            .bg-tw svg { fill: white; width: 18px; height: 18px; }

            @media (max-width: 480px) {
                .neelamb-share-plugin { 
                    justify-content: flex-start; /* मोबाइलमा धेरै आइकन भएमा स्लाइड गर्न मिल्ने */
                    padding-left: 15px;
                }
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
                <div class="neelamb-share-plugin">
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
