/**
 * Ultimate Multi-functional Desktop-View Full-Page PNG & Print Toolkit
 * विशेष गरी ब्लगरको 'location-date' र 'flex' लेआउटमा १००% काम गर्ने गरी बनाइएको।
 */
(function() {
    // १. html2canvas लाइब्रेरी सुरक्षित रूपमा लोड गर्ने
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    class UltimateDesktopPrintToolkit {
        constructor() {
            this.contentSelectors = [
                '.post-body', 'article', '#main-content', '.entry-content'
            ];
            this.init();
        }

        // २. CSS स्टाइलहरू (बटन र पप-अपको लागि)
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
                
                /* तपाईंको थिमको फ्लेक्स बक्ससँग मिल्ने गरी बनाइएको बटन स्टाइल */
                .custom-print-btn {
                    background-color: #28a745 !important; 
                    color: white !important; 
                    border: none !important; 
                    padding: 2px 8px !important; 
                    font-size: 11px !important; 
                    font-weight: bold !important; 
                    cursor: pointer !important; 
                    border-radius: 4px !important; 
                    display: inline-flex !important; 
                    align-items: center !important; 
                    margin-left: 10px !important;
                    z-index: 99999 !important; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
                    font-family: sans-serif !important;
                    height: 22px !important;
                    line-height: 22px !important;
                    white-space: nowrap !important;
                }
                .custom-print-btn:hover { background-color: #218838 !important; }
                
                /* फुल पेज स्क्रिनशट पप-अप विन्डो */
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 950px; margin: 30px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-success { background: #28a745; color: white; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* डेस्कटप मोड सिम्युलेटर साइज */
                #print-area-wrapper { 
                    background: white; padding: 20px; border: 1px solid #ddd; 
                    width: 1200px !important; max-width: 100% !important; 
                    overflow-x: auto; box-sizing: border-box;
                }
            `;
            document.head.appendChild(style);
        }

        // ३. पप-अप विन्डो तयार गर्ने
        createModal() {
            if (document.getElementById('printCropModal')) return;
            const modal = document.createElement('div');
            modal.className = 'crop-modal';
            modal.id = 'printCropModal';
            modal.innerHTML = `
                <div class="crop-box">
                    <h3>🖥️ डेस्कटप मोड फुल-पेज स्क्रिनशट टुलकिट</h3>
                    <div class="btn-group">
                        <button class="btn-action btn-info" id="downloadPngAction">📸 सिधै PNG डाउनलोड गर्नुहोस्</button>
                        <button class="btn-action btn-success" id="startPrintAction">🖨️ A4 मा प्रिन्ट/सेभ गर्नुहोस्</button>
                        <button class="btn-action btn-danger" id="closeModalAction">बन्द गर्नुहोस्</button>
                    </div>
                    <div id="print-area-wrapper"></div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('closeModalAction').onclick = () => this.toggleModal(false);
            document.getElementById('startPrintAction').onclick = () => window.print();
            document.getElementById('downloadPngAction').onclick = () => this.downloadAsPNG();
        }

        toggleModal(show) {
            const modal = document.getElementById('printCropModal');
            if (modal) {
                modal.style.display = show ? 'block' : 'none';
                document.body.style.overflow = show ? 'hidden' : 'auto';
            }
        }

        // ४. डेस्कटप भ्यु कपी गर्ने र पाना ब्रेक मिलाउने
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
                const maxPageHeight = 1100; 
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
            }, 200);
        }

        // ५. पूरै स्क्रोल हुने पेजको डेस्कटप मोडमा PNG डाउनलोड गर्ने प्रणाली
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("लाइब्रेरी लोड हुँदैछ, कृपया १ सेकेन्डपछि पुनः प्रयास गर्नुहोस्।");
                return;
            }

            const downloadBtn = document.getElementById('downloadPngAction');
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै...";
            downloadBtn.disabled = true;

            // ब्याकग्राउन्डमा डेस्कटप मोड साइज (1200px width) र पूरै हाइट सेट गर्ने
            html2canvas(printWrapper, {
                useCORS: true,
                allowTaint: true,
                scale: 2, // क्लियर क्वालिटीको लागि
                width: 1200,
                windowWidth: 1200
            }).then(canvas => {
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.download = `Full-Page-Desktop-${Date.now()}.png`;
                link.href = image;
                link.click();
                
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस्";
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error(err);
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस्";
                downloadBtn.disabled = false;
            });
        }

        // ६. बटनलाई झुक्किन नदिई '.location-date' को ठीक बाहिर राख्ने परिमार्जित फङ्क्सन
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            // थिमभित्रको वास्तविक location-date छान्ने
            const targetLocation = document.querySelector('.flex.items-center.gap-2.overflow-hidden .location-date');

            if (targetLocation) {
                // टार्गेट डिभभित्र नघुसाई त्यसको ठीक बाहिर (Next Sibling) राख्ने ताकि फ्लेक्स लेआउट नबिग्रियोस्
                targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
                console.log("✅ सही ठाउँमा बटन राखियो।");
            } else {
                // यदि क्लास भेटिएन भने ब्याकअपको रूपमा पहिलो location-date को बाहिर राख्ने
                const fallback = document.querySelector('.location-date');
                if (fallback) {
                    fallback.parentNode.insertBefore(printBtn, fallback.nextSibling);
                }
            }
        }

        init() {
            this.injectStyles();
            this.createModal();
            this.renderButton();
        }
    }

    const runToolkit = () => { new UltimateDesktopPrintToolkit(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runToolkit);
    } else {
        runToolkit();
    }
    setTimeout(runToolkit, 1200); // ब्लगरको ढिलो लोड हुने संरचनाको लागि
})();
