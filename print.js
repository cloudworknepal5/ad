/**
 * Universal Multi-functional Print & Crop Toolkit
 * विशेष गरी 'location-date' क्लासलाई लक्षित गरी बनाइएको कोड।
 */
class UltimatePrintToolkit {
    constructor() {
        // १. तपाईंको थिममा भएको 'location-date' क्लासलाई पहिलो प्राथमिकतामा राख्ने
        this.targetSelectors = [
            '.location-date', 
            '.post-timestamp',
            '.post-share-buttons',
            '.entry-date'
        ];
        
        this.contentSelectors = [
            '.post-body', 'article', '#main-content', '.entry-content'
        ];
        
        this.init();
    }

    // २. CSS स्टाइलहरू (A4 र बटन लेआउट)
    injectStyles() {
        if (document.getElementById('ultimate-toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ultimate-toolkit-styles';
        style.innerHTML = `
            @media print {
                body * { visibility: hidden !important; }
                #print-area-wrapper, #print-area-wrapper * { visibility: visible !important; }
                #print-area-wrapper { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; }
                .page-break { page-break-after: always !important; break-after: page !important; display: block !important; height: 0 !important; }
                .crop-modal, .btn-group, .custom-print-btn { display: none !important; }
            }
            .custom-print-btn {
                background-color: #28a745 !important; color: white !important; border: none !important; 
                padding: 3px 8px !important; font-size: 11px !important; font-weight: bold !important; 
                cursor: pointer !important; border-radius: 4px !important; display: inline-flex !important; 
                align-items: center !important; margin-left: 8px !important; vertical-align: middle !important;
                z-index: 99999 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
                font-family: sans-serif !important;
            }
            .custom-print-btn:hover { background-color: #218838 !important; }
            .universal-floating-bar { position: fixed !important; top: 20px !important; right: 20px !important; z-index: 999999 !important; }
            .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
            .crop-box { max-width: 850px; margin: 30px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
            .btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
            .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            .btn-success { background: #28a745; color: white; }
            .btn-danger { background: #dc3545; color: white; }
            #print-area-wrapper { background: white; padding: 10px; border: 1px solid #ddd; }
        `;
        document.head.appendChild(style);
    }

    // ३. पप-अप विन्डो (Modal) बनाउने
    createModal() {
        if (document.getElementById('printCropModal')) return;
        const modal = document.createElement('div');
        modal.className = 'crop-modal';
        modal.id = 'printCropModal';
        modal.innerHTML = `
            <div class="crop-box">
                <h3>🖨️ विज्ञापन स्क्रिनशट र A4 प्रिन्ट टुलकिट</h3>
                <div class="btn-group">
                    <button class="btn-action btn-success" id="startPrintAction">🖨️ A4 साइजमा सेभ/प्रिन्ट गर्नुहोस्</button>
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

    // ४. मुख्य पोष्ट संकलन र मल्टि-पेज (A4 Page Break) विभाजन
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        printWrapper.innerHTML = mainContent.innerHTML;

        setTimeout(() => {
            const children = printWrapper.children;
            let currentHeight = 0;
            const maxPageHeight = 950; 
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
        }, 150);
    }

    // ५. 'location-date' को ठीक दायाँ इनलाइन बटन राख्ने
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
        printBtn.onclick = () => this.preparePrintContent();

        // सूचीबाट क्लास नेमहरू खोज्ने (पहिले .location-date भेटिनेछ)
        let targetLocation = null;
        for (let selector of this.targetSelectors) {
            targetLocation = document.querySelector(selector);
            if (targetLocation) break;
        }

        // यदि थिममा 'location-date' भेटियो भने त्यसको ठीक दायाँ (Next Sibling) बटन राख्ने
        if (targetLocation) {
            targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
            console.log("✅ location-date को दायाँ छेउमा प्रिन्ट बटन थपियो।");
            return;
        }

        // ब्याकअप: यदि थिममा क्लास फेला परेन भने स्क्रिनको दायाँ कुनामा राख्ने
        const floatingBar = document.createElement('div');
        floatingBar.className = 'universal-floating-bar';
        floatingBar.appendChild(printBtn);
        document.body.appendChild(floatingBar);
    }

    init() {
        this.injectStyles();
        this.createModal();
        this.renderButton();
    }
}

// ब्लगर थिममा एलिमेन्ट लोड हुन समय लाग्ने हुनाले टाइमआउट व्यवस्थापन
const runToolkit = () => { new UltimatePrintToolkit(); };
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runToolkit);
} else {
    runToolkit();
}
setTimeout(runToolkit, 1000); // सुरक्षित रहन १ सेकेन्डपछि पुनः जाँच्ने
