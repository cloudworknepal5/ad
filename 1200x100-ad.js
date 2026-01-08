(function() {
    // --- MULTI-FUNCTION CONFIGURATION ---
    // यहाँ तपाईंले आफ्नो इमेज र लिङ्कहरू राख्नुहोस्
    const adConfig = {
        imageUrl: "https://your-image-link-here.jpg", // विज्ञापनको तस्बिरको लिङ्क
        targetUrl: "https://advertiser-site.com",     // विज्ञापनमा क्लिक गर्दा खुल्ने लिङ्क
        adnpLink: "https://ad.neelamb.com/",          // Adnp लेबलमा क्लिक गर्दा खुल्ने लिङ्क
        altText: "Premium Billboard Advertisement"
    };

    // विज्ञापन ढाँचा तयार गर्ने फङ्सन
    function buildAd() {
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-1200x100-wrapper';

        adContainer.innerHTML = `
            <a href="${adConfig.targetUrl}" target="_blank" class="ad-1200x100-link">
                <img src="${adConfig.imageUrl}" alt="${adConfig.altText}" class="ad-1200x100-img">
            </a>
            <a href="${adConfig.adnpLink}" target="_blank" class="ad-1200x100-label">Adnp</a>
        `;

        // जहाँ यो स्क्रिप्ट लोड हुन्छ, त्यहीँ विज्ञापन देखाउने
        const currentScript = document.currentScript;
        currentScript.parentNode.insertBefore(adContainer, currentScript);
    }

    // विज्ञापन लोड गर्ने
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildAd);
    } else {
        buildAd();
    }
})();
