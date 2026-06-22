/**
 * Ultimate Universal Web Page Print & A4 Layout Toolkit
 * ब्लगर, वर्डप्रेस र जुनसुकै थिममा १००% बटन देखाउने र चल्ने क्लास।
 */
class UltimatePrintToolkit {
    constructor() {
        // १. कन्फिगरेसन र क्लास/आईडीहरूको प्राथमिकता सूची
        this.customContainerId = 'fanda-print-container';
        
        this.contentSelectors = [
            '.post-body', 'article', '#main-content', '.entry-content', '.site-main', '#content'
        ];
        
        this.targetSelectors = [
            '.post-timestamp', '.entry-date', '.author-line', '.post-meta', 
            '.tg-post-date', '.meta-wrapper', '.post-share-buttons'
        ];
        
        this.init();
    }

    // २. CSS स्टाइल हेडमा राख्ने (A4 Multi-page प्रिन्ट लेआउट र बटन डिजाइन)
    injectStyles() {
        if (document.getElementById('ultimate-toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'ultimate-toolkit-styles';
        style.innerHTML = `
            @media print {
                body * { visibility: hidden !important; }
                #print-area-wrapper, #print-area-wrapper * { visibility: visible !important; }
                #print-area-wrapper { 
                    position: absolute !important; 
                    left: 0 !important; top: 0 !important; 
                    width: 210mm !important; 
                }
                .page-break { 
                    page-break-after: always !important; 
                    break-after: page !important; 
                    display: block !important; height: 0 !important;
                }
                .crop-modal, .btn-group, .custom-print-btn { display: none !important; }
            }

            /* प्रिन्ट बटनको स्टाइल */
            .custom-print-btn {
                background-color: #28a745 !important; 
                color: white !important; 
                border: none !important; 
                padding: 6px 12px !important; 
                font-size: 13px !important; 
                font-weight: bold !important; 
                cursor: pointer !important; 
                border-radius: 4px !important; 
                display: inline-flex !important; 
                align-items: center !important; 
                margin: 5px !important; 
                vertical-align: middle !important;
                z-index: 99999 !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
                font-family: sans-serif !important;
            }
            .custom-print-btn:hover { background-color: #218838 !important; }
            
            /* यदि कतै ठाउँ नभेटिएमा स्क्रिनको दायाँ देखिने फ्लोटिङ बार */
            .universal-floating-bar {
                position: fixed !important; top: 20px !important; right: 20px !important; z-index: 999999 !important;
            }

            /* पप-अप विन्डो (Modal) */
            .crop-modal { 
                display: none; position: fixed; top: 0; left: 0; 
                width: 100%; height: 100%; background: rgba(0,0,0,0.85); 
                z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif;
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

    // ३. पप-अप मोडल बनाउने
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

    // ४. ए४ मल्टि-पेज लेआउट तयार गर्ने मल्टि-फङ्क्सनल कोर
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        printWrapper.innerHTML = mainContent.innerHTML;

        // स्वचालित रूपमा पाना काट्ने (Page Break)
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

    // ५. ग्यारेन्टीका साथ बटन देखाउने एम्बेड प्रणाली
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ A4 प्रिन्ट / क्रप';
        printBtn.onclick = () => this.preparePrintContent();

        // क) पहिलो प्रयास: तपाईंको कस्टम आईडी चेक गर्ने
        const customContainer = document.getElementById(this.customContainerId);
        if (customContainer) {
            customContainer.appendChild(printBtn);
            return;
        }

        // ख) दोस्रो प्रयास: थिमको मिति वा सामाजिक सेयर क्लास खोज्ने
        let targetLocation = null;
        for (let selector of this.targetSelectors) {
            targetLocation = document.querySelector(selector);
            if (targetLocation) break;
        }

        if (targetLocation) {
            targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
            return;
        }

        // ग) तेस्रो प्रयास (Fallback): यदि केही भेटिएन भने स्क्रिनको दायाँ कुनामा Floating बटन राख्ने
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

// ब्लगरको ढिलो लोड हुने समस्या समाधान गर्न मल्टिपल चेकिङ लोड प्रणाली
const startToolkit = () => { new UltimatePrintToolkit(); };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startToolkit);
} else {
    startToolkit();
}
// सेफ साइडका लागि १ सेकेन्डपछि फेरि चेक गर्ने (ब्लगर डायनामिक एलिमेन्ट्सको लागि)
setTimeout(startToolkit, 1000);
