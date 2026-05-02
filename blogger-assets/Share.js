/**
 * Professional Round Share Plugin with Share Count
 * Supports: FB, WhatsApp, Messenger, X, Gmail, and Copy Link
 * Developed for ghantaghartv.com
 */

(function() {
    // १. सिएसएस इन्जेक्सन (Round Design & Styles)
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .gh-share-plugin {
                display: flex; flex-wrap: wrap; gap: 12px; margin: 25px 0;
                padding: 15px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;
                font-family: 'Mukta', sans-serif; align-items: center; justify-content: center;
            }
            .gh-share-count {
                text-align: center; padding-right: 15px; border-right: 2px solid #ddd; margin-right: 5px;
            }
            .gh-count-num { font-size: 26px; font-weight: 900; color: #d32f2f; display: block; line-height: 1; }
            .gh-count-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; }
            
            .gh-btn-round {
                width: 45px; height: 45px; border-radius: 50%; display: flex;
                align-items: center; justify-content: center; color: #fff !important;
                text-decoration: none !important; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-size: 20px; border: none; cursor: pointer;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;
            }
            .gh-btn-round:hover { transform: scale(1.15) translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
            
            /* Tooltip अन-होभर */
            .gh-btn-round::after {
                content: attr(data-label); position: absolute; bottom: -30px; font-size: 10px;
                background: #333; color: #fff; padding: 2px 8px; border-radius: 4px;
                opacity: 0; pointer-events: none; transition: 0.2s; white-space: nowrap;
            }
            .gh-btn-round:hover::after { opacity: 1; bottom: -35px; }

            .bg-fb { background: #1877F2; }
            .bg-wa { background: #25D366; }
            .bg-msg { background: #0084FF; }
            .bg-tw { background: #000000; }
            .bg-gm { background: #EA4335; }
            .bg-copy { background: #64748b; }
            .bg-success { background: #059669 !important; }

            @media (max-width: 600px) {
                .gh-share-plugin { gap: 15px; }
                .gh-share-count { width: 100%; border-right: none; border-bottom: 2px solid #eee; padding: 0 0 10px 0; margin-bottom: 10px; }
            }
        `;
        document.head.appendChild(style);
    };

    // २. शेयर काउन्ट लजिक
    const getShareCount = (url) => {
        let count = localStorage.getItem('gh_shares_' + btoa(url));
        if (!count) {
            count = Math.floor(Math.random() * 70) + 30; // ३०-१०० रेन्डम सुरुवाती
            localStorage.setItem('gh_shares_' + btoa(url), count);
        }
        return count;
    };

    const updateCount = (url) => {
        let count = parseInt(getShareCount(url)) + 1;
        localStorage.setItem('gh_shares_' + btoa(url), count);
        document.getElementById('gh-total-num').innerText = count;
    };

    // ३. प्लगइन जेनेरेटर
    const renderPlugin = () => {
        const container = document.getElementById('ghantaghar-share-plugin');
        if (!container) return;

        const url = window.location.href;
        const title = document.title;
        const count = getShareCount(url);

        container.innerHTML = `
            <div class="gh-share-plugin">
                <div class="gh-share-count">
                    <span class="gh-count-num" id="gh-total-num">${count}</span>
                    <span class="gh-count-label">Shares</span>
                </div>
                
                <a class="gh-btn-round bg-fb" data-label="Facebook" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
                
                <a class="gh-btn-round bg-wa" data-label="WhatsApp" href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>

                <a class="gh-btn-round bg-msg" data-label="Messenger" href="fb-messenger://share/?link=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-brands fa-facebook-messenger"></i>
                </a>
                
                <a class="gh-btn-round bg-tw" data-label="X (Twitter)" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank">
                    <i class="fa-brands fa-x-twitter"></i>
                </a>

                <a class="gh-btn-round bg-gm" data-label="Gmail" href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}" target="_blank">
                    <i class="fa-solid fa-envelope"></i>
                </a>
                
                <button class="gh-btn-round bg-copy" data-label="Copy Link" id="gh-copy-btn">
                    <i class="fa-solid fa-link"></i>
                </button>
            </div>
        `;

        // बटन क्लिकमा काउन्ट बढाउने
        container.querySelectorAll('a, button').forEach(el => {
            el.onclick = () => updateCount(url);
        });

        // कपी लजिक
        const copyBtn = document.getElementById('gh-copy-btn');
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
