/**
 * WordPress Inline Print Button Fix
 * मिति/भिजिटर काउन्टको छेउमा प्रिन्ट आइकन राख्ने सुरक्षित कोड
 */
(function() {
    // १. बटन इन्जेक्सन फङ्क्सन
    function renderPrintButton() {
        if (document.getElementById('instant-print-btn')) return;

        // बटन सिर्जना
        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.innerHTML = '🖨️'; // आइकन मात्र
        printBtn.style.cssText = "margin-left: 8px; cursor: pointer; border: none; background: none; font-size: 14px; vertical-align: middle;";
        
        printBtn.onclick = () => {
            window.print(); // सिधै ब्राउजरको प्रिन्ट कमान्ड
        };

        // मिति/भिजिटर काउन्ट भएको कन्टेनर पत्ता लगाउने (अति-सटीक)
        const metaContainer = document.querySelector('.post-meta-items') || 
                              document.querySelector('.entry-meta') || 
                              document.querySelector('.entry-date');

        if (metaContainer) {
            // मितिको छेउमा थप्ने
            metaContainer.appendChild(printBtn);
        }
    }

    // २. साइट लोड भइसकेपछि चलाउने
    if (document.readyState === 'complete') {
        renderPrintButton();
    } else {
        window.addEventListener('load', renderPrintButton);
    }
})();
