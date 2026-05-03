/**
 * Neelamb News Minimal Reaction Plugin
 * Features: Zero-background, Compact spacing, Individual counters.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-feedback-styles';
        style.textContent = `
            .neelamb-feedback-container {
                text-align: left; /* बायाँ साइडमा मिलाइएको */
                margin: 10px 0;
                padding: 0; /* सबै प्याडिङ हटाइयो */
                background: transparent; /* ब्याकग्राउन्ड हटाइयो */
                font-family: 'Mukta', sans-serif;
            }
            .feedback-title { 
                font-size: 14px; 
                font-weight: 700; 
                color: #555; 
                margin-bottom: 8px; 
            }
            .feedback-grid {
                display: flex; 
                justify-content: flex-start; 
                gap: 8px; /* आइकनहरू बीचको न्यून ग्याप */
                flex-wrap: wrap;
            }
            .feedback-item {
                display: flex; 
                align-items: center; 
                gap: 4px; /* इमोजी र नम्बर बीचको ग्याप */
                cursor: pointer; 
                transition: transform 0.2s;
                padding: 2px 0;
                background: none;
                border: none;
            }
            .feedback-item:hover { transform: scale(1.1); }
            .feedback-item.voted { color: #1877F2; }
            
            .fb-emoji { font-size: 20px; }
            .fb-count { font-size: 13px; font-weight: 800; color: #333; }
            .fb-label { display: none; /* नाम हटाएर डिजाइन अझ सानो बनाइएको */ }

            @media (max-width: 480px) {
                .feedback-grid { gap: 6px; }
                .fb-emoji { font-size: 18px; }
            }
        `;
        document.head.appendChild(style);
    };

    const getFeedbackData = (url) => {
        const key = 'nb_fb_compact_' + btoa(url).substring(0, 16);
        let data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            data = { like: 10, dislike: 0, happy: 4, love: 6, sad: 0, angry: 0, userVoted: null };
            localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
    };

    const handleFeedback = (url, type) => {
        const key = 'nb_fb_compact_' + btoa(url).substring(0, 16);
        let data = getFeedbackData(url);
        if (data.userVoted) return;

        data[type] += 1;
        data.userVoted = type;
        localStorage.setItem(key, JSON.stringify(data));
        renderFeedback();
    };

    const renderFeedback = () => {
        const containers = document.querySelectorAll('#neelamb-reaction-plugin');
        if (containers.length === 0) return;

        const url = window.location.href;
        const data = getFeedbackData(url);

        const items = [
            { id: 'like', emoji: '👍' },
            { id: 'dislike', emoji: '👎' },
            { id: 'happy', emoji: '😊' },
            { id: 'love', emoji: '❤️' },
            { id: 'sad', emoji: '😢' },
            { id: 'angry', emoji: '😡' }
        ];

        const html = `
            <div class="neelamb-feedback-container">
                <div class="feedback-title">प्रतिक्रिया:</div>
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

        containers.forEach(c => {
            c.innerHTML = html;
            c.querySelectorAll('.feedback-item').forEach(el => {
                el.onclick = function() {
                    handleFeedback(url, this.dataset.type);
                };
            });
        });
    };

    injectStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFeedback);
    } else {
        renderFeedback();
    }
})();
