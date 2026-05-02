/**
 * Neelamb Share Plugin
 * Features: Inline Share Count, Black X Logo, Round Buttons
 * Host: GitHub / Cloudflare
 */

(function() {
    // १. सिएसएस इन्जेक्सन (Class Name: neelambshare)
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .neelamb-share-plugin {
                display: flex; flex-wrap: wrap; gap: 12px; margin: 25px 0;
                padding: 15px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;
                font-family: 'Mukta', sans-serif; align-items: center; justify-content: flex-start;
            }
            .neelamb-count-inline {
                display: flex; flex-direction: column; align-items: center;
                padding-right: 15px; border-right: 2px solid #ddd; margin-right: 5px;
                min-width: 60px;
            }
            .neelamb-num { font-size: 22px; font-weight: 900; color: #d32f2f; line-height: 1; }
            .neelamb-label { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; }
            
            .neelamb-btn-round {
                width: 42px; height: 42px; border-radius: 50%; display: flex;
                align-items: center; justify-content: center; color: #fff !important;
                text-decoration: none !important; transition: all 0.3s ease;
                font-size: 18px; border: none; cursor: pointer;
                box-shadow: 0 3px 6px rgba(0,0,0,0.1);
            }
            .neelamb-btn-round:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); }

            /* Brand Colors */
            .bg-fb { background: #1877F2; }
            .bg-wa { background: #25D366; }
            .bg-msg { background: #0084FF; }
            .bg-tw { background: #000000; color: #ffffff !important; }
            .bg-gm { background: #EA4335; }
            .bg-copy { background: #64748b; }
            .bg-success { background: #059669 !important; }

            @media (max-width: 480px) {
                .neelamb-share-plugin { justify-content: center; gap: 10px; }
                .neelamb-count-inline { border-right: 1px solid #ddd; padding-right: 10px; }
            }
        `;
        document.head.appendChild(style);
    };

    // २. शेयर काउन्ट लजिक
    const getShareCount = (url) => {
        let count = localStorage.getItem('neelamb_shares_' + btoa(url));
        if (!count) {
            count = Math.floor(Math.random() * 50) + 20; 
            localStorage.setItem('neelamb_shares_' + btoa(url), count);
        }
        return count;
    };

    const updateCount = (url) => {
        let count = parseInt(getShareCount(url)) + 1;
        localStorage.setItem('neelamb_shares_' + btoa(url), count);
        const el = document.getElementById('neelamb-total-num');
        if(el) el.innerText = count;
    };

    // ३. प्लगइन जेनेरेटर
    const renderPlugin = () => {
        const container = document.getElementById('neelambshare-plugin');
        if (!container) return;

        const url = window.location.href;
        const title = document.title;
        const count = getShareCount(url);

        container.innerHTML = `
            <div class="neelamb-share-plugin">
                <div class="neelamb-count-inline">
                    <span class="neelamb-num" id="neelamb-total-num">${count}</span>
                    <span class="neelamb-label">Shares</span>
                </div>
                
                <a class="neelamb-btn-round bg-fb" title="Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
                
                <a class="neelamb-btn-round bg-wa" title="WhatsApp" href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>

                <a class="neelamb-btn-round bg-msg" title="Messenger" href="fb-messenger://share/?link=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-brands fa-facebook-messenger"></i>
                </a>
                
                <a class="neelamb-btn-round bg-tw" title="X (Twitter)" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank">
                    <i class="fa-brands fa-x-twitter"></i>
                </a>

                <a class="neelamb-btn-round bg-gm" title="Gmail" href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-solid fa-envelope"></i>
                </a>
                
                <button class="neelamb-btn-round bg-copy" title="Copy Link" id="neelamb-copy-btn">
                    <i class="fa-solid fa-link"></i>
                </button>
            </div>
        `;

        container.querySelectorAll('a, button').forEach(el => {
            el.onclick = () => updateCount(url);
        });

        const copyBtn = document.getElementById('neelamb-copy-btn');
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
    };

    injectStyles();
    window.addEventListener('load', renderPlugin);
})();
