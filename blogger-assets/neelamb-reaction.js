/**
 * Neelamb News Minimal Reaction Plugin - V5
 * Status: Post-specific tracking, Toggle-able reactions, High-contrast.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-feedback-styles';
        style.textContent = `
            .neelamb-feedback-container {
                display: flex; justify-content: center; align-items: center;
                margin: 20px auto; padding: 0; background: transparent;
                font-family: 'Mukta', sans-serif; width: 100%;
            }
            .feedback-grid { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
            .feedback-item {
                display: flex; flex-direction: column; align-items: center; 
                gap: 2px; cursor: pointer; transition: transform 0.2s;
                background: none; border: none; outline: none;
            }
            .feedback-item:hover { transform: scale(1.2); }
            .fb-emoji { font-size: 30px; line-height: 1; }
            .fb-count { 
                font-size: 14px; font-weight: 800; 
                color: #222 !important;
            }
            @media (prefers-color-scheme: dark) {
                .fb-count { color: #f1f1f1 !important; }
            }
            .dark .fb-count, [data-theme='dark'] .fb-count { color: #ffffff !important; }
            
            /* Active/Voted State */
            .feedback-item.voted .fb-count, 
            .feedback-item.voted .fb-emoji { 
                color: #1877F2 !important; 
                filter: drop-shadow(0 0 5px rgba(24, 119, 242, 0.3));
            }

            @media (max-width: 480px) {
                .feedback-grid { gap: 12px; }
                .fb-emoji { font-size: 26px; }
            }
        `;
        document.head.appendChild(style);
    };

    // प्रत्येक पोस्टको लागि छुट्टाछुट्टै युनिक ID निकाल्ने फङ्सन
    const getStorageKey = (url) => {
        return 'neelamb_v5_' + btoa(url.split('?')[0].split('#')[0]).replace(/=/g, '').substring(0, 32);
    };

    const getFeedbackData = (url) => {
        const key = getStorageKey(url);
        let data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            data = { like: 0, dislike: 0, happy: 0, love: 0, sad: 0, angry: 0, userVoted: null };
        }
        return data;
    };

    const handleFeedback = (url, type) => {
        const key = getStorageKey(url);
        let data = getFeedbackData(url);

        // Multi-function: यदि पहिले नै त्यही इमोजी थिचिएको छ भने रियाक्सन हटाउने (Toggle)
        if (data.userVoted === type) {
            data[type] = Math.max(0, data[type] - 1);
            data.userVoted = null;
        } else {
            // यदि अर्कै इमोजी थिचिएको छ भने पुरानो घटाउने र नयाँ बढाउने
            if (data.userVoted) {
                data[data.userVoted] = Math.max(0, data[data.userVoted] - 1);
            }
            data[type] += 1;
            data.userVoted = type;
        }

        localStorage.setItem(key, JSON.stringify(data));
        renderFeedback();
    };

    const renderFeedback = () => {
        const containers = document.querySelectorAll('#neelamb-reaction-plugin');
        if (containers.length === 0) return;

        // प्रत्येक कन्टेनरको लागि छुट्टाछुट्टै चेक गर्ने (Multi-post support)
        containers.forEach(container => {
            // यदि पोस्टको आफ्नै URL छ भने (Blogger/WordPress मा प्राय: हुन्छ)
            const postUrl = container.getAttribute('data-url') || window.location.href;
            const data = getFeedbackData(postUrl);

            const items = [
                { id: 'like', emoji: '👍' },
                { id: 'dislike', emoji: '👎' },
                { id: 'happy', emoji: '😊' },
                { id: 'love', emoji: '❤️' },
                { id: 'sad', emoji: '😢' },
                { id: 'angry', emoji: '😡' }
            ];

            container.innerHTML = `
                <div class="neelamb-feedback-container">
                    <div class="feedback-grid">
                        ${items.map(item => `
                            <div class="feedback-item ${data.userVoted === item.id ? 'voted' : ''}" data-type="${item.id}">
                                <span class="fb-emoji">${item.emoji}</span>
                                <span class="fb-count">${data[item.id]}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            container.querySelectorAll('.feedback-item').forEach(el => {
                el.onclick = function() {
                    handleFeedback(postUrl, this.dataset.type);
                };
            });
        });
    };

    injectStyles();
    
    // Multi-function Init: पेज लोड हुँदा र पछि पनि चल्ने
    if (document.readyState === 'complete') {
        renderFeedback();
    } else {
        window.addEventListener('load', renderFeedback);
        document.addEventListener('DOMContentLoaded', renderFeedback);
    }
})();
