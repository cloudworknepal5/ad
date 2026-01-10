// GitHub मा राख्ने JS कोड (ad-script.js)
function loadMultiAd(containerId, adList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // विज्ञापन छान्ने (Random Selection)
    const selectedAd = adList[Math.floor(Math.random() * adList.length)];
    
    // Stats व्यवस्थापन
    let stats = JSON.parse(localStorage.getItem(selectedAd.id)) || { views: 0, clicks: 0 };
    stats.views++;
    localStorage.setItem(selectedAd.id, JSON.stringify(stats));

    // UI रेन्डर गर्ने
    let html = '';
    if (selectedAd.type === 'image') {
        html = `<a href="${selectedAd.link}" target="_blank" onclick="trackAdClick('${selectedAd.id}')">
                    <img src="${selectedAd.source}" style="width: 100%; display: block;">
                </a>`;
    } else if (selectedAd.type === 'youtube') {
        const vId = selectedAd.source.split('v=')[1];
        html = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${vId}" frameborder="0" allowfullscreen></iframe>`;
    }

    container.innerHTML = html;
}

function trackAdClick(id) {
    let stats = JSON.parse(localStorage.getItem(id)) || { views: 0, clicks: 0 };
    stats.clicks++;
    localStorage.setItem(id, JSON.stringify(stats));
}
