(function() {
    // १. विज्ञापन सेटअप (यहाँ आफ्नो डाटा राख्नुहोस्)
    const adConfig = {
        imageUrl: "https://via.placeholder.com/1200x100?text=Your+Billboard+Ad+Here", // विज्ञापनको फोटो
        targetUrl: "https://your-product-link.com", // क्लिक गर्दा जाने ठाउँ
        adnpLink: "https://ad.neelamb.com/",        // Adnp को छुट्टै लिङ्क
        altText: "Premium Billboard Ad"
    };

    // २. विज्ञापन बनाउने फङ्सन
    function initBillboard() {
        const adWrapper = document.createElement('div');
        adWrapper.className = 'billboard-container';

        adWrapper.innerHTML = `
            <a href="${adConfig.targetUrl}" target="_blank" class="billboard-link">
                <img src="${adConfig.imageUrl}" alt="${adConfig.altText}" class="billboard-img">
            </a>
            <a href="${adConfig.adnpLink}" target="_blank" class="billboard-adnp">Adnp</a>
        `;

        // जहाँ स्क्रिप्ट राखिन्छ त्यहीँ विज्ञापन देखाउने
        const scriptTag = document.currentScript;
        scriptTag.parentNode.insertBefore(adWrapper, scriptTag);
    }

    // फङ्सन रन गर्ने
    initBillboard();
})();
