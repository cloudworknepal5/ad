/**
 * Neelamb News Full Feedback System
 * Features: Like, Dislike, Happy, Sad, Angry counters with emojis.
 * Technical: Multi-site support, LocalStorage persistence.
 */

(function() {
    const injectStyles = () => {
        if (document.getElementById('neelamb-feedback-styles')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-feedback-styles';
        style.textContent = `
            .neelamb-feedback-container {
                text-align: center; margin: 25px 0; padding: 20px;
                background: #fdfdfd; border: 1px solid #eee; border-radius: 12px;
                font-family: 'Mukta', sans-serif;
            }
            .feedback-title { font-size: 18px; font-weight: 700; color: #444; margin-bottom: 20px; }
            .feedback-grid {
                display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;
            }
            .feedback-item {
                display: flex; flex-direction: column; align-items: center;
                min-width: 55px; cursor: pointer; transition: transform 0.2s;
                padding: 8px; border-radius: 8px; background: #fff;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;
            }
            .feedback-item:hover { transform: translateY(-3px); border-color: #ddd; }
            .feedback-item.voted { background: #eef2ff; border-color: #1877F2; }
            
            .fb-emoji { font-size: 24px; margin-bottom: 4px; }
            .fb-count { font-size: 14px; font-weight: 800; color: #333; }
            .fb-label { font-size: 10px; color: #888; text-transform: uppercase; font-weight: 700; }

            @media (max-width: 480px) {
                .feedback-grid { gap: 8px; }
                .feedback-item { min-width: 48px; padding: 5px; }
                .fb-emoji { font-size: 20px; }
            }
        `;
        document.head.appendChild(style);
    };

    const getFeedbackData = (url) => {
        const key = 'nb_feedback_' + btoa(url).substring(0, 16);
        let data = JSON.parse(localStorage.getItem(key));
        if (!data) {
            // सुरुवाती केही डमी नम्बरहरू ताकि पोष्ट खाली नदेखियोस्
            data = { like: 12, dislike: 2, happy: 5, love: 8, sad: 0, angry: 1, userVoted: null };
            localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
    };

    const handleFeedback = (url, type) => {
        const key = 'nb_feedback_' + btoa(url).substring(0, 16);
        let data = getFeedbackData(url);
        
        if (data.userVoted) return; // एकपटक भोट गरेपछि फेरि मिल्दैन

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
            { id: 'like', label: 'Like', emoji: '👍' },
            { id: 'dislike', label: 'Dislike', emoji: '👎' },
            { id: 'happy', label: 'Happy', emoji: '😊' },
            { id: 'love', label: 'Love', emoji: '❤️' },
            { id: 'sad', label: 'Sad', emoji: '😢' },
            { id: 'angry', label: 'Angry', emoji: '😡' }
        ];

        const html = `
            <div class="neelamb-feedback-container">
                <div class="feedback-title">यो समाचार पढेर तपाईंको प्रतिक्रिया दिनुहोस्:</div>
                <div class="feedback-grid">
                    ${items.map(item => `
                        <div class="feedback-item ${data.userVoted === item.id ? 'voted' : ''}" data-type="${item.id}">
                            <span class="fb-emoji">${item.emoji}</span>
                            <span class="fb-count">${data[item.id]}</span>
                            <span class="fb-label">${item.label}</span>
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
    // पेज लोड भएपछि रेन्डर गर्ने
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFeedback);
    } else {
        renderFeedback();
    }
})();
