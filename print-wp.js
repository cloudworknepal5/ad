/**
 * Ultimate WordPress Inline Print Toolkit
 * मिति र भिजिटर काउन्टको दायाँतिर इनलाइन प्रिन्ट बटन।
 */
(function() {
    // १. लाइब्रेरी लोड
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    // २. स्टाइल (लेआउट नबिगार्ने CSS)
    const injectStyles = () => {
        if (document.getElementById('print-styles')) return;
        const style = document.createElement('style');
        style.id = 'print-styles';
        style.innerHTML = `
            .inline-print-wrapper { display: inline-flex !important; align-items: center !important; }
            .custom-print-btn { 
                background: #c82333 !important; color: white !important; border: none !important; 
                padding: 2px 8px !important; font-size: 11px !important; cursor: pointer !important; 
                border-radius: 3px !important; margin-left: 8px !important; height: 18px !important; 
                line-height: 18px !important; display: inline-flex !important; align-items: center !important;
                font-family: sans-serif !important; vertical-align: middle !important;
            }
            .custom-print-btn:hover { background: #a71d2a !important; }
            /* प्रिन्ट मोडल */
            .crop-modal { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.8); z-index: 999999; overflow: auto; padding: 20px; }
            .crop-box { max-width: 1200px; margin: 20px auto; background: white; padding: 20px; border-radius: 5px; }
            #print-area-wrapper { width: 100%; overflow: hidden; }
        `;
        document.head.appendChild(style);
    };

    // ३. प्रिन्ट फङ्क्शन
    const initPrint = () => {
        const modal = document.createElement('div');
        modal.className = 'crop-modal';
        modal.id = 'printCropModal';
        modal.innerHTML = `
            <div class="crop-box">
                <button onclick="document.getElementById('printCropModal').style.display='none'">बन्द गर्नुहोस्</button>
                <div id="print-area-wrapper"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const printBtn = document.createElement('button');
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ प्रिन्ट';
        printBtn.onclick = () => {
            const content = document.querySelector('.site-content') || document.body;
            document.getElementById('print-area-wrapper').innerHTML = content.innerHTML;
            document.getElementById('printCropModal').style.display = 'block';
        };

        // मिति/भिजिटर काउन्ट भएको ठाउँमा इन्जेक्सन
        const meta = document.querySelector('.post-meta-items') || document.querySelector('.entry-meta');
        if (meta) {
            meta.appendChild(printBtn);
        }
    };

    // ५. कार्यान्वयन
    if (document.readyState === 'complete') {
        injectStyles();
        initPrint();
    } else {
        window.addEventListener('load', () => { injectStyles(); initPrint(); });
    }
})();
