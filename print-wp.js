/**
 * Inline Print Button for Rastriya Sahara Daily
 * मिति र भिजिटर काउन्टको छेउमा प्रिन्ट बटन राख्ने कोड।
 */
(function() {
    function injectPrintButton() {
        // बटन पहिले नै छ भने नथप्ने
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.innerHTML = '🖨️ प्रिन्ट';
        // इनलाइन स्टाइल - मितिको छेउमा बस्नको लागि
        printBtn.style.cssText = "margin-left: 10px; cursor: pointer; border: 1px solid #ccc; background: #f4f4f4; padding: 2px 6px; font-size: 11px; border-radius: 3px; vertical-align: middle;";
        
        printBtn.onclick = () => window.print();

        // तपाईँको साइटको मिति/भ्यु काउन्ट भएको र्‍यापर पत्ता लगाउने
        // स्क्रिनसट अनुसार 'news-desk' वा मिति भएको ठाउँ
        const metaContainer = document.querySelector('.leading-none'); 

        if (metaContainer) {
            metaContainer.appendChild(printBtn);
        }
    }

    // साइट लोड भएपछि बटन थप्ने
    window.addEventListener('load', injectPrintButton);
})();
