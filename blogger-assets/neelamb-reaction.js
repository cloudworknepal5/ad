/**
 * Neelamb News Minimal Reaction Plugin - V2
 * Features: Larger emojis, Center aligned, Dark/Light mode optimized.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-feedback-styles';
        style.textContent = `
            .neelamb-feedback-container {
                display: flex;
                justify-content: center; /* सेन्टरमा राख्न */
                align-items: center;
                margin: 20px auto;
                padding: 0;
                background: transparent;
                font-family: 'Mukta', sans-serif;
                width: 100%;
            }
            .feedback-grid {
                display: flex; 
                justify-content: center; 
                gap: 15px; /* आइकनहरू बीचको ग्याप बढाइएको */
                flex-wrap: wrap;
            }
            .feedback-item {
                display: flex; 
                flex-direction: column; /* इमोजी माथि र नम्बर तल */
                align-items: center; 
                gap: 2px;
                cursor: pointer; 
                transition: transform 0.2s;
                background: none;
                border: none;
            }
            .feedback-item:hover { transform: scale(1.2); }
            
            /* लाइट र डार्क मोडमा स्पष्ट देखिने गरी */
            .feedback-item.voted .fb-emoji { filter: grayscale(0%); }
            .fb-emoji { 
                font-size: 28px; /* इमोजीको साइज ठूलो पारिएको */
                line-height: 1;
            }
            
            .fb-count { 
                font-size: 14px; 
                font-weight: 800; 
                /* डार्क र लाइट मोड दुवैमा देखिने कलर */
                color: currentColor; 
                opacity: 0.9;
            }

            /* डार्क मोड सपोर्ट (यदि थिममा dark क्लास छ भने) */
            @media (prefers-color-scheme: dark) {
                .fb-count { color: #e5e7eb; }
            }
            
            /* भोट गरेपछि देखिने रङ्ग */
            .feedback-item.voted { color: #1877F2 !important; }

            @media (max-width: 480px) {
                .feedback-grid { gap: 10px; }
                .fb-emoji { font-size: 24px; }
            }
        `;
        document.head.appendChild(style);
    };

    const getFeedbackData = (url) => {
        const key = 'nb_fb_v2_' + btoa(url).substring(0, 16);
        let data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            data = { like: 10, dislike: 0, happy: 4, love: 6, sad: 0, angry: 0, userVoted: null };
            localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
    };

    const handleFeedback = (url, type) => {
        const key = 'nb_fb_v2_' + btoa(url).substring(0, 16);
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
