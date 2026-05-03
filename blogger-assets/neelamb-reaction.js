/**
 * Neelamb News Minimal Reaction Plugin - V3 (Color Optimized)
 * Features: High-contrast text for Dark/Light modes, Center aligned, Large emojis.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-feedback-styles';
        style.textContent = `
            .neelamb-feedback-container {
                display: flex;
                justify-content: center;
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
                gap: 15px;
                flex-wrap: wrap;
            }
            .feedback-item {
                display: flex; 
                flex-direction: column;
                align-items: center; 
                gap: 2px;
                cursor: pointer; 
                transition: transform 0.2s;
                background: none;
                border: none;
                /* यो लाइनले लाइट मोडमा अक्षरलाई डिफल्ट डार्क र डार्क मोडमा लाइट बनाउँछ */
                color: inherit; 
            }
            .feedback-item:hover { transform: scale(1.2); }
            
            .fb-emoji { 
                font-size: 30px; 
                line-height: 1;
            }
            
            .fb-count { 
                font-size: 14px; 
                font-weight: 800;
                /* फिक्स्ड कलरको सट्टा ओपासिटी चलाउँदा दुवै मोडमा स्पष्ट देखिन्छ */
                color: #333; 
            }

            /* डार्क मोडका लागि विशेष कन्डिसन */
            @media (prefers-color-scheme: dark) {
                .fb-count { color: #f1f1f1 !important; }
            }

            /* यदि तपाईंको ब्लगरमा 'dark' क्लास प्रयोग हुन्छ भने */
            .dark .fb-count, [data-theme='dark'] .fb-count {
                color: #ffffff !important;
            }
            
            /* लाइट मोडमा अक्षर अझ गाढा बनाउन */
            .light .fb-count, [data-theme='light'] .fb-count {
                color: #222222 !important;
            }

            .feedback-item.voted { color: #1877F2 !important; }
            .feedback-item.voted .fb-count { color: #1877F2 !important; }

            @media (max-width: 480px) {
                .feedback-grid { gap: 12px; }
                .fb-emoji { font-size: 26px; }
            }
        `;
        document.head.appendChild(style);
    };

    const getFeedbackData = (url) => {
        const key = 'nb_fb_v3_' + btoa(url).substring(0, 16);
        let data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            // सुरुवाती डमी डेटा
            data = { like: 10, dislike: 0, happy: 4, love: 6, sad: 0, angry: 0, userVoted: null };
            localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
    };

    const handleFeedback = (url, type) => {
        const key = 'nb_fb_v3_' + btoa(url).substring(0, 16);
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
