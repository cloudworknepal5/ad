/**
 * Advanced Multi-functional Print, Crop & A4 Layout Toolkit
 * विशेष क्लास र आईडी पहिचान प्रणाली सहित
 */
class FixedWebPrintToolkit {
    constructor() {
        // १. तपाईंले थिममा थप्नुभएको निश्चित आईडी र मुख्य कन्टेन्ट बस्ने क्लास
        this.buttonContainerId = 'fanda-print-container';
        this.contentSelectors = [
            '.post-body', 'article', '#main-content', '.entry-content'
        ];
        
        this.init();
    }

    // २. CSS स्टाइल इन्जेक्ट गर्ने
    injectStyles() {
        if (document.getElementById('toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toolkit-styles';
        style.innerHTML = `
            @media print {
                body * { visibility: hidden !important; }
                #print-area-wrapper, #print-area-wrapper * { visibility: visible !important; }
                #print-area-wrapper { 
                    position: absolute !important; 
                    left: 0 !important; 
                    top: 0 !important; 
                    width: 210mm !important; 
                }
                .page-break { 
                    page-break-after: always !important; 
                    break-after: page !important; 
                    display: block !important;
                    height: 0 !important;
                }
                .crop-modal, .btn-group, .custom-print-btn { display: none !important; }
            }

            .custom-print-btn {
                background-color: #28a745; 
                color: white !important; 
                border: none; 
                padding: 4px 8px;
                font-size: 12px; 
                font-weight: bold; 
                cursor: pointer; 
                border-radius: 4px;
                display: inline-flex; 
                align-items: center; 
                margin-left: 8px; 
                vertical-align: middle;
            }
            .custom-print-btn:hover { background-color: #218838; }
            
            .crop-modal { 
                display: none; position: fixed; top: 0; left: 0; 
                width: 100%; height: 100%; background: rgba(0,0,0,0.85); 
                z-index: 999999; overflow: auto; padding: 20px; font-family: sans-serif;
            }
            .crop-box { 
                max-width: 850px; margin: 30px auto; background: white; 
                padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            .btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
            .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            .btn-success { background: #28a745; color: white; }
            .btn-danger { background: #dc3545; color: white; }
            #print-area-wrapper { background: white; padding: 10px; border: 1px solid #ddd; }
        `;
        document.head.appendChild(style);
    }

    // ३. पप-अप विन्डो (Modal) ढाँचा बनाउने
    createModal() {
        if (document.getElementById('printCropModal')) return;

        const modal = document.createElement('div');
        modal.className = 'crop-modal';
        modal.id = 'printCropModal';
        modal.innerHTML = `
            <div class="crop-box">
                <h3>🖨️ विज्ञापन स्क्रिनशट र A4 प्रिन्ट टुल</h3>
                <div class="btn-group">
                    <button class="btn-action btn-success" id="startPrintAction">🖨️ A4 मा सेभ/प्रिन्ट गर्नुहोस्</button>
                    <button class="btn-action btn-danger" id="closeModalAction">बन्द गर्नुहोस्</button>
                </div>
                <div id="print-area-wrapper"></div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('closeModalAction').onclick = () => this.toggleModal(false);
        document.getElementById('startPrintAction').onclick = () => window.print();
    }

    toggleModal(show) {
        const modal = document.getElementById('printCropModal');
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
            document.body.style.overflow = show ? 'hidden' : 'auto';
        }
    }

    // ४. मुख्य पोष्टलाई मल्टि-पेज A4 मा मिलाउने
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        printWrapper.innerHTML = mainContent.innerHTML;

        // स्वतः अर्को पाना (Page Break) थप्ने मल्टि-फङ्सन
        setTimeout(() => {
            const children = printWrapper.children;
            let currentHeight = 0;
            const maxPageHeight = 980; 

            for (let i = 0; i < children.length; i++) {
                currentHeight += children[i].offsetHeight || 0;
                if (currentHeight > maxPageHeight) {
                    const breakDiv = document.createElement('div');
                    breakDiv.className = 'page-break';
                    children[i].parentNode.insertBefore(breakDiv, children[i]);
                    currentHeight = 0; 
                }
            }
            this.toggleModal(true);
        }, 100);
    }

    // ५. तपाईंले राख्नुभएको नयाँ आईडी (ID) भित्र बटन राख्ने फङ्क्सन
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        // हामीले थिममा थपेको निश्चित ठाउँ खोज्ने
        const targetContainer = document.getElementById(this.buttonContainerId);
        
        if (targetContainer) {
            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            
            printBtn.onclick = () => this.preparePrintContent();
            
            // बटनलाई आईडी भएको खाली ठाउँमा इम्बेड (Embed) गर्ने
            targetContainer.appendChild(printBtn);
            console.log("✅ प्रिन्ट बटन सफलतापूर्वक थपियो।");
        } else {
            console.log("⚠️ थिममा 'fanda-print-container' आईडी भेटिएन। कृपया HTML चेक गर्नुहोस्।");
        }
    }

    init() {
        this.injectStyles();
        this.createModal();
        this.renderButton();
    }
}

// पेज लोड भएपछि चलाउने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new FixedWebPrintToolkit());
} else {
    // ब्लगर डायनामिक लोडको लागि थोरै समय पर्खने
    setTimeout(() => { new FixedWebPrintToolkit(); }, 500);
}
