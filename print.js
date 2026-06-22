/**
 * Complete Multi-functional Web Page Print, Crop & A4 Layout Toolkit
 * डेभलपर: राष्ट्रिय फण्डा / नीलम्ब विशेष एडिसन
 */
class WebPrintToolkit {
    constructor() {
        // १. मुख्य पोष्ट (कन्टेन्ट) र बटन राख्ने (टार्गेट) सम्भावित क्लास/आईडीहरू
        this.contentSelectors = [
            '.post-body', 'article', '#main-content', '.entry-content', '.site-main'
        ];
        this.targetSelectors = [
            '.post-timestamp', '.entry-date', '.author-line', '.post-meta', 
            '#post-meta', '.tg-post-date', '.meta-wrapper'
        ];
        
        // टुलकिट सुरु गर्ने
        this.init();
    }

    // २. आवश्यक CSS स्टाइलहरू हेडमा इन्जेक्ट गर्ने (A4 Layout र UI को लागि)
    injectStyles() {
        if (document.getElementById('toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toolkit-styles';
        style.innerHTML = `
            /* प्रिन्ट गर्दा मात्र लागु हुने स्टाइल (A4 Multi-page Configuration) */
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

            /* स्क्रिनमा देखिने बटन र पप-अपको स्टाइल */
            .custom-print-btn {
                background-color: #28a745; 
                color: white !important; 
                border: none; 
                padding: 5px 10px;
                font-size: 13px; 
                font-weight: bold; 
                cursor: pointer; 
                border-radius: 4px;
                display: inline-flex; 
                align-items: center; 
                margin-left: 10px; 
                vertical-align: middle;
                text-decoration: none;
            }
            .custom-print-btn:hover { background-color: #218838; }
            
            /* क्रप र प्रिन्ट गर्ने पप-अप विन्डो (Modal) */
            .crop-modal { 
                display: none; 
                position: fixed; 
                top: 0; left: 0; 
                width: 100%; height: 100%; 
                background: rgba(0,0,0,0.85); 
                z-index: 999999; 
                overflow: auto; 
                padding: 20px; 
                font-family: sans-serif;
            }
            .crop-box { 
                max-width: 850px; 
                margin: 30px auto; 
                background: white; 
                padding: 25px; 
                border-radius: 8px; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            .crop-box h3 { margin-top: 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
            .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; }
            .btn-success { background: #28a745; color: white; }
            .btn-success:hover { background: #218838; }
            .btn-danger { background: #dc3545; color: white; }
            .btn-danger:hover { background: #c82333; }
            #print-area-wrapper { background: white; padding: 10px; border: 1px solid #ddd; }
        `;
        document.head.appendChild(style);
    }

    // ३. प्रिन्ट प्रिव्यु देखाउने पप-अप विन्डो (Modal) ढाँचा बनाउने
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
                    <button class="btn-action btn-danger" id="closeModalAction">بند गर्नुहोस् (Close)</button>
                </div>
                <div id="print-area-wrapper"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // बटनका एक्सनहरू बाइन्ड गर्ने
        document.getElementById('closeModalAction').onclick = () => this.toggleModal(false);
        document.getElementById('startPrintAction').onclick = () => window.print();
    }

    // ४. पप-अप खोल्ने र बन्द गर्ने नियन्त्रक
    toggleModal(show) {
        const modal = document.getElementById('printCropModal');
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
            if (show) document.body.style.overflow = 'hidden'; // ब्याकग्राउन्ड स्क्रोल रोक्ने
            else document.body.style.overflow = 'auto';
        }
    }

    // ५. मुख्य पोस्टलाई मात्र छानेर बहु-पृष्ठ (Multi-page) मा मिलाउने फङ्क्सन
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        // यदि थिमको पोस्ट क्लास भेटिएन भने पुरै बडी कपी गर्ने
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        // फालतू ब्यानर वा भिडियोहरू हटाउनका लागि कन्टेन्ट कपी गर्ने
        printWrapper.innerHTML = mainContent.innerHTML;

        // मल्टि-पेज एल्गोरिदम: कन्टेन्ट धेरै लामो भए स्वतः अर्को पाना (Page Break) थप्ने
        setTimeout(() => {
            const children = printWrapper.children;
            let currentHeight = 0;
            const maxPageHeight = 980; // A4 पानाको सुरक्षित पिक्सेल उचाइ

            for (let i = 0; i < children.length; i++) {
                currentHeight += children[i].offsetHeight || 0;
                if (currentHeight > maxPageHeight) {
                    const breakDiv = document.createElement('div');
                    breakDiv.className = 'page-break';
                    children[i].parentNode.insertBefore(breakDiv, children[i]);
                    currentHeight = 0; // नयाँ पानाको लागि रिसेट
                }
            }
            this.toggleModal(true);
        }, 100);
    }

    // ६. मितिको दायाँ छेउमा 'प्रिन्ट' बटन राख्ने फङ्क्सन
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ A4 प्रिन्ट / क्रप';
        
        // क्लिक गर्दा प्रिन्ट लेआउट तयार गर्ने
        printBtn.onclick = () => this.preparePrintContent();

        // वेबसाइटमा मिति भएको क्लास खोज्ने
        let targetLocation = null;
        for (let selector of this.targetSelectors) {
            targetLocation = document.querySelector(selector);
            if (targetLocation) break;
        }

        // यदि थिममा लोकेशन भेटियो भने ठ्याक्कै त्यहीँ इनलाइन राख्ने
        if (targetLocation) {
            targetLocation.style.display = 'inline-block';
            targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
        }
    }

    // क्लास लोड हुँदा स्वतः चल्ने फङ्क्सन
    init() {
        this.injectStyles();
        this.createModal();
        this.renderButton();
    }
}

// पेज तयार हुने बित्तिकै टुलकिट एक्टिभेट गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WebPrintToolkit());
} else {
    new WebPrintToolkit();
}
