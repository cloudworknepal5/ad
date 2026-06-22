/**
 * Multi-functional Web Page Print & Crop Toolkit (Class-Based)
 * ब्लगर र वर्डप्रेसका लागि उपयुक्त, A4 साइज र बहु-पृष्ठ (Multi-page) सपोर्ट गर्ने।
 */
class WebPrintToolkit {
    constructor() {
        // १. मुख्य कन्फिगरेसन (क्लास र आईडीहरू)
        this.contentSelectors = [
            '.post-body', '#post-body', 'article', '#main-content', '.entry-content', '.site-main'
        ];
        this.targetSelectors = [
            '.post-timestamp', '.entry-date', '.author-line', '.post-meta', 
            '#post-meta', '.tg-post-date', '.meta-wrapper', '#entry-meta'
        ];
        
        // टुल सुरु गर्ने
        this.init();
    }

    // २. स्टाइल र डिजाइन थप्ने फङ्क्सन
    injectStyles() {
        if (document.getElementById('toolkit-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toolkit-styles';
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #print-area-wrapper, #print-area-wrapper * { visibility: visible; }
                #print-area-wrapper { position: absolute; left: 0; top: 0; width: 210mm; }
                .page-break { page-break-after: always; break-after: page; }
            }
            .custom-print-btn {
                background-color: #28a745; color: white; border: none; padding: 6px 12px;
                font-size: 13px; font-weight: bold; cursor: pointer; border-radius: 4px;
                display: inline-flex; align-items: center; margin-left: 10px; vertical-align: middle;
            }
            .custom-print-btn:hover { background-color: #218838; }
            .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                          background: rgba(0,0,0,0.8); z-index: 99999; overflow: auto; padding: 20px; }
            .crop-box { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; }
            .btn-group { display: flex; gap: 10px; margin-top: 10px; margin-bottom: 15px; }
            .btn-action { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            .btn-success { background: #28a745; color: white; }
            .btn-danger { background: #dc3545; color: white; }
        `;
        document.head.appendChild(style);
    }

    // ३. पप-अप विन्डो (Modal UI) बनाउने फङ्क्सन
    createModal() {
        if (document.getElementById('printCropModal')) return;

        const modal = document.createElement('div');
        modal.className = 'crop-modal';
        modal.id = 'printCropModal';
        modal.innerHTML = `
            <div class="crop-box">
                <h3>✂️ A4 प्रिन्ट / क्रप टुलकिट (Multi-Page)</h3>
                <div class="btn-group">
                    <button class="btn-action btn-success" id="startPrintAction">🖨️ A4 मा प्रिन्ट गर्नुहोस</button>
                    <button class="btn-action btn-danger" id="closeModalAction">बन्द गर्नुहोस</button>
                </div>
                <div id="print-area-wrapper"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // बटनका क्लिक इभेन्टहरू बाइन्ड (Bind) गर्ने
        document.getElementById('closeModalAction').onclick = () => this.toggleModal(false);
        document.getElementById('startPrintAction').onclick = () => window.print();
    }

    // ४. मोडल खोल्ने वा बन्द गर्ने फङ्क्सन
    toggleModal(show) {
        const modal = document.getElementById('printCropModal');
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
        }
    }

    // ५. मुख्य कन्टेन्ट कपी गर्ने र बहु-पृष्ठ (Multi-page A4) विभाजन गर्ने फङ्क्सन
    preparePrintContent() {
        let mainContent = null;
        for (let selector of this.contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        if (!mainContent) mainContent = document.body;

        const printWrapper = document.getElementById('print-area-wrapper');
        printWrapper.innerHTML = mainContent.innerHTML;

        // स्वचालित पाना ब्रेक (Page Break): लामो पोस्ट भए अर्को पानामा लैजाने (लगभग १००० पिक्सेलमा)
        const children = printWrapper.children;
        let currentHeight = 0;
        for (let i = 0; i < children.length; i++) {
            currentHeight += children[i].offsetHeight || 0;
            if (currentHeight > 1000) {
                const breakDiv = document.createElement('div');
                breakDiv.className = 'page-break';
                children[i].parentNode.insertBefore(breakDiv, children[i]);
                currentHeight = 0; // रिसेट
            }
        }

        this.toggleModal(true);
    }

    // ६. बटन बनाउने र निर्धारित क्लास वा आईडीको दायाँ राख्ने फङ्क्सन
    renderButton() {
        if (document.getElementById('instant-print-btn')) return;

        const printBtn = document.createElement('button');
        printBtn.id = 'instant-print-btn';
        printBtn.className = 'custom-print-btn';
        printBtn.innerHTML = '🖨️ A4 प्रिन्ट / क्रप';
        
        // बटन क्लिक गर्दा कन्टेन्ट तयार गर्ने
        printBtn.onclick = () => this.preparePrintContent();

        // उपयुक्त लोकेशन (क्लास वा आईडी) खोज्ने
        let targetLocation = null;
        for (let selector of this.targetSelectors) {
            targetLocation = document.querySelector(selector);
            if (targetLocation) break;
        }

        // यदि थिमको क्लास/आईडी भेटियो भने इनलाइन राख्ने
        if (targetLocation) {
            targetLocation.style.display = 'inline-block';
            targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
        }
    }

    // सुरुवाती फङ्क्सन
    init() {
        this.injectStyles();
        this.createModal();
        this.renderButton();
    }
}

// पेज पुरै लोड भएपछि क्लास इन्स्टन्स (Instance) सुरु गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WebPrintToolkit());
} else {
    new WebPrintToolkit();
}
