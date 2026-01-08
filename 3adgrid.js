(function() {
    // १. मल्टि-फङ्सन कन्फिगरेसन (यहाँ लिङ्क र नाम परिवर्तन गर्नुहोस्)
    const adConfig = {
        labelLink: "https://your-ad-policy-link.com", // Adnp मा क्लिक गर्दा जाने लिङ्क
        labelText: "Adnp",
        ads: [
            {
                title: "Image Ad 1",
                size: "200 x 200",
                adLink: "https://link1.com" // पहिलो विज्ञापनको लिङ्क
            },
            {
                title: "Image Ad 2",
                size: "200 x 200",
                adLink: "https://link2.com" // दोस्रो विज्ञापनको लिङ्क
            },
            {
                title: "Image Ad 3",
                size: "200 x 200",
                adLink: "https://link3.com" // तेस्रो विज्ञापनको लिङ्क
            }
        ]
    };

    // २. विज्ञापन ग्रिड बनाउने फङ्सन
    function init3AdGrid() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ad-grid-wrapper';

        adConfig.ads.forEach(ad => {
            const adBox = document.createElement('div');
            adBox.className = 'ad-grid-box';

            // मुख्य विज्ञापनको लिङ्क (Heading र Size मा क्लिक गर्दा जाने)
            adBox.innerHTML = `
                <a href="${ad.adLink}" target="_blank" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
                    <h3>${ad.title}</h3>
                    <p>${ad.size}</p>
                </a>
                <a href="${adConfig.labelLink}" target="_blank" class="adnp-label">${adConfig.labelText}</a>
            `;
            
            wrapper.appendChild(adBox);
        });

        // यो कोड जहाँ राखिन्छ त्यही ठाउँमा विज्ञापन देखाउने
        const thisScript = document.currentScript;
        thisScript.parentNode.insertBefore(wrapper, thisScript);
    }

    // ३. रन गर्ने फङ्सन
    init3AdGrid();

})();
