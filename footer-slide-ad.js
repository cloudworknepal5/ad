(function() {
    // १. कन्फिगरेसन (यहाँ इमेज र लिङ्क राख्नुहोस्)
    const slideAdConfig = {
        imageUrl: "https://ad.neelamb.com/1200x100.png", 
        targetUrl: "https://neelamb.com",
        adnpLink: "https://ad.neelamb.com/",
        displayDelay: 2000 // २ सेकेन्ड पछि विज्ञापन निस्किन्छ
    };

    function initSlideAd() {
        // एड कन्टेनर बनाउने
        const adDiv = document.createElement('div');
        adDiv.className = 'slide-ad-container';
        adDiv.id = 'footerSlideAd';

        adDiv.innerHTML = `
            <div class="slide-ad-content">
                <button class="slide-ad-close" onclick="this.parentElement.parentElement.classList.remove('active')">Close ✖</button>
                <a href="${slideAdConfig.targetUrl}" target="_blank" class="slide-ad-link">
                    <img src="${slideAdConfig.imageUrl}" class="slide-ad-img">
                </a>
                <a href="${slideAdConfig.adnpLink}" target="_blank" class="slide-adnp">Adnp</a>
            </div>
        `;

        document.body.appendChild(adDiv);

        // केही समय पछि 'active' क्लास थप्ने (जसले गर्दा विज्ञापन स्लाइड हुन्छ)
        setTimeout(() => {
            adDiv.classList.add('active');
        }, slideAdConfig.displayDelay);
    }

    // डोम लोड भएपछि रन गर्ने
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideAd);
    } else {
        initSlideAd();
    }
})();
