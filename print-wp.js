/**
 * Ultimate Precise Inline Print Fix
 * प्रिन्ट आइकनलाई मिति र भिजिटर काउन्टको सिधै छेउमा इनलाइन राख्ने कोड।
 */
(function() {
    // १. लाइब्रेरी लोड
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    // २. CSS स्टाइल - लेआउट नबिगार्ने र इनलाइन बस्ने
    const style = document.createElement('style');
    style.innerHTML = `
        .inline-print-wrapper { display: inline-flex !important; align-items: center !important; gap: 5px !important; }
        .custom-print-btn { 
            background: #c82333 !important; color: white !important; border: none !important; 
            padding: 2px 8px !important; font-size: 11px !important; cursor: pointer !important; 
            border-radius: 3px !important; height: 20px !important; line-height: 20px !important;
            display: inline-flex !important; align-items: center !important; white-space: nowrap !important;
        }
    `;
    document.head.appendChild(style);

    // ३. बटन इन्जेक्सन फङ्क्सन
    function injectPrintButton() {
        const printBtn = document.createElement('button');
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ प्रिन्ट';
        printBtn.onclick = () => {
            // यहाँ अघिल्लो प्रिन्ट र्‍यापर र मोडलको लजिक राख्नुहोस्
            alert("प्रिन्ट मोड सुरु भयो..."); 
        };

        // भिजिटर काउन्ट र मिति भएको कन्टेनर
        const meta = document.querySelector('.post-meta-items') || document.querySelector('.entry-meta');
        
        if (meta) {
            const wrapper = document.createElement('div');
            wrapper.className = 'inline-print-wrapper';
            // मिति वा भिजिटर काउन्टको अन्तिम एलिमेन्टको पछाडि राख्ने
            meta.appendChild(wrapper);
            wrapper.appendChild(printBtn);
        }
    }

    // कोड लोड गर्ने
    if (document.readyState === 'complete') {
        injectPrintButton();
    } else {
        window.addEventListener('load', injectPrintButton);
    }
})();
