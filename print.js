/**
 * Ultimate Universal Desktop-View Full-Page PNG & Print Toolkit
 * यसले स्वतः डेस्कटप मोडको आकारमा पूरै पेज स्क्रोल गरी PNG फरमेटमा सेभ र प्रिन्ट गर्छ।
 */
(function() {
    // १. html2canvas लाइब्रेरी स्वतः लोड गर्ने (PNG स्क्रिनशटको लागि)
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

        // २. CSS स्टाइलहरू (Desktop Layout र PNG Modal Design)
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
                    align-items: center !important; margin-left: 6px !important; vertical-align: middle !important;
                    z-index: 99999 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
                    font-family: sans-serif !important; height: 20px !important; line-height: 14px !important;
                }
                .custom-print-btn:hover { background-color: #218838 !important; }
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 950px; margin: 30px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-success { background: #28a745; color: white; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* डेस्कटप मोड प्रिव्यु कन्टेनर */
                #print-area-wrapper { 
                    background: white; padding: 20px; border: 1px solid #ddd; 
                    width: 1200px !important; max-width: 100% !important; 
                    overflow-x: auto; box-sizing: border-box;
                }
            `;
            document.head.appendChild(style);
        }

        // ३. मल्टि-फङ्क्सनल पप-अप विन्डो (Modal UI)
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

        // ४. डेस्कटप मोड सिम्युलेट गरेर पूरै स्क्रोल हुने कन्टेन्ट तान्ने
        preparePrintContent() {
            let mainContent = null;
            for (let selector of this.contentSelectors) {
                mainContent = document.querySelector(selector);
                if (mainContent) break;
            }
            if (!mainContent) mainContent = document.body;

            const printWrapper
