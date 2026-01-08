(function() {
    // --- MULTI-FUNCTION CONFIGURATION ---
    const adConfig = {
        adnpLink: "https://ad.neelamb.com/", // Adnp बटनको लिङ्क
        ads: [
            {
                imgUrl: "https://ad.neelamb.com/300x300%20copy.png", // १. पहिलो फोटोको URL
                targetUrl: "https://link1.com"           // क्लिक गर्दा जाने लिङ्क
            },
            {
                imgUrl: "https://ad.neelamb.com/300x300-facebook.jpg", // २. दोस्रो फोटोको URL
                targetUrl: "https://link2.com"           // क्लिक गर्दा जाने लिङ्क
            },
            {
                imgUrl: "https://ad.neelamb.com/newspaper.jpg",  // ३. तेस्रो फोटोको URL
                targetUrl: "https://link3.com"           // क्लिक गर्दा जाने लिङ्क
            }
        ]
    };

    function init3AdGrid() {
        const container = document.createElement('div');
        container.className = 'neelamb-ad-grid';

        adConfig.ads.forEach((ad, index) => {
            const adBox = document.createElement('div');
            adBox.className = 'neelamb-ad-box';
            
            // इमेज ट्याग सहितको विज्ञापन
            let content = `
                <a href="${ad.targetUrl}" target="_blank" class="main-ad-link">
                    <img src="${ad.imgUrl}" alt="Ad ${index + 1}" style="width:100%; height:100%; object-fit:cover; display:block;">
                </a>
            `;

            // अन्तिम बक्समा मात्र Adnp लेबल थप्ने
            if (index === adConfig.ads.length - 1) {
                content += `<a href="${adConfig.adnpLink}" target="_blank" class="adnp-single-label">Adnp</a>`;
            }

            adBox.innerHTML = content;
            container.appendChild(adBox);
        });

        const currentScript = document.currentScript;
        currentScript.parentNode.insertBefore(container, currentScript);
    }

    init3AdGrid();
})();
