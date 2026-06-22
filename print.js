/**
 * Universal Ultimate Multi-functional Print, Crop & A4 Layout Toolkit
 * यो कोड ब्लगर, वर्डप्रेस, र जुनसुकै वेबसाइटमा पनि स्वतः चल्छ।
 */
class UniversalPrintToolkit {
    constructor() {
        // १. तपाईंको कस्टम आईडी र वेबसाइटका अन्य सम्भावित कन्टेन्ट एरियाहरू
        this.customContainerId = 'fanda-print-container';
        
        this.contentSelectors = [
            '.post-body', 'article', '#main-content', '.entry-content', '.site-main', '.post', '#content'
        ];
        
        this.targetSelectors = [
            '.post-timestamp', '.entry-date', '.author-line', '.post-meta', 
            '#post-meta', '.tg-post-date', '.meta-wrapper'
        ];
        
        this.init();
    }

    // २. CSS स्टाइलहरू हेडमा इन्जेक्ट गर्ने (A4 Layout र UI)
    injectStyles() {
        if (document.getElementById('universal-toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'universal-toolkit-styles';
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

            .custom-print-btn {
                background-color: #28a745; color: white !important; border: none; 
                padding: 5px 10px; font-size: 13px; font-weight: bold; cursor: pointer; 
                border-radius: 4px; display: inline-flex; align-items: center; 
                margin: 5px; vertical-align: middle; z-index: 9999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .custom-print-btn:hover { background-color: #218838; }
            
            .universal-top-bar {
                position: fixed; top: 15px; right: 15px; z-index: 999999;
            }

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

    // ४. मुख्य पोष्टलाई मात्र छानेर मल्टि-पेज A4 मा कन्भर्ट गर्ने
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        printWrapper.innerHTML = mainContent.innerHTML;

        // स्वतः अर्को पाना (Page Break) थप्ने मल्टि-फङ्क्सनल प्रणाली
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

    // ५. युनिभर्सल बटन रेन्डर प्रणाली (प्राथमिकताको आधारमा)
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ A4 प्रिन्ट / क्रप';
        printBtn.onclick = () => this.preparePrintContent();

        // क) प्राथमिकता १: तपाईंले थिममा राख्नुभएको निश्चित आईडी (#fanda-print-container) चेक गर्ने
        const customContainer = document.getElementById(this.customContainerId);
        if (customContainer) {
            customContainer.appendChild(printBtn);
            console.log("✅ निश्चित HTML ID भित्र प्रिन्ट बटन थपियो।");
            return;
        }

        // ख) प्राथमिकता २: यदि आईडी फेला परेन भने थिमको मिति वा सेयर क्लास स्वतः खोज्ने
        let targetLocation = null;
        for (let selector of this.targetSelectors) {
            targetLocation = document.querySelector(selector);
            if (targetLocation) break;
        }

        if (targetLocation) {
            targetLocation.style.display = 'inline-block';
            targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
            console.log("✅ थिमको क्लास पहिचान गरी बटन थपियो।");
            return;
        }

        // ग) प्राथमिकता ३: यदि केही पनि भेटिएन भने स्क्रिनको दायाँ कुनामा Floating बटन राख्ने (Universal Fallback)
        const topBar = document.createElement('div');
        topBar.className = 'universal-top-bar';
        topBar.appendChild(printBtn);
        document.body.appendChild(topBar);
        console.log("✅ युनिभर्सल फ्लोटिङ बारमा प्रिन्ट बटन थपियो।");
    }

    init() {
        this.injectStyles();
        this.createModal();
        this.renderButton();
    }
}

// वेबसाइट पूर्ण रूपमा लोड भएपछि रन गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new UniversalPrintToolkit());
} else {
    setTimeout(() => { new UniversalPrintToolkit(); }, 500);
}
