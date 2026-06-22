/**
 * Ultimate Desktop-View Full-Page PNG & Print Toolkit
 * साइडबार, विज्ञापन र कम्प्युटर लेआउट जस्ताको त्यस्तै क्याप्चर गर्ने मल्टि-फङ्क्सनल क्लास।
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
            this.init();
        }

        // २. CSS स्टाइलहरू (डेस्कटप मोड र बटन लेआउट)
        injectStyles() {
            if (document.getElementById('ultimate-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'ultimate-toolkit-styles';
            style.innerHTML = `
                @media print {
                    body * { visibility: hidden !important; }
                    #print-area-wrapper, #print-area-wrapper * { visibility: visible !important; }
                    #print-area-wrapper { position: absolute !important; left: 0 !important; top: 0 !important; width: 297mm !important; }
                    .page-break { page-break-after: always !important; break-after: page !important; display: block !important; height: 0 !important; }
                    .crop-modal, .btn-group, .custom-print-btn { display: none !important; }
                }
                
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
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 1320px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); padding: 10px 0; z-index: 10; border-bottom: 1px solid #eee; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-success { background: #28a745; color: white; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* कम्प्युटर स्क्रिनको जस्तै (1280px Width) बनाउने प्रिव्यु बक्स */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 10px; border: 1px solid #ddd; 
                    width: 1280px !important; max-width: 1280px !important;
                    min-width: 1280px !important;
                    box-sizing: border-box;
                    margin: 0 auto;
                    overflow: hidden !important;
                }
                /* प्रिव्यु भित्रका सबै फ्याट एलिमेन्टलाई डेस्कटप लेआउटमा फोर्स गर्ने */
                #print-area-wrapper .wrapper, #print-area-wrapper .container { width: 100% !important; max-width: 100% !important; }
            `;
            document.head.appendChild(style);
        }

        // ३. कम्प्युटर विन्डोज प्रिव्यु पप-अप (Modal UI)
        createModal() {
            if (document.getElementById('printCropModal')) return;
            const modal = document.createElement('div');
            modal.className = 'crop-modal';
            modal.id = 'printCropModal';
            modal.innerHTML = `
                <div class="crop-box">
                    <div class="btn-group">
                        <button class="btn-action btn-info" id="downloadPngAction">📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)</button>
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

        // ४. साइडबार र विज्ञापनसहितको पुरै पेजको डेस्कटप संरचना तान्ने
        preparePrintContent() {
            // हामी पुरै बडी वा मुख्य र्‍यापरलाई नै कपी गर्छौँ जसले गर्दा साइडबार पनि आउँछ
            const mainContent = document.querySelector('#page-wrapper') || document.querySelector('.site-wrapper') || document.body;
            const printWrapper = document.getElementById('print-area-wrapper');
            
            // मुख्य स्क्रिन कपी गर्ने तर हाम्रो मोडललाई भित्र पर्न नदिने
            const clone = mainContent.cloneNode(true);
            const nestedModal = clone.querySelector('#printCropModal');
            if (nestedModal) nestedModal.remove();
            
            // कपी गरिएका एलिमेन्ट भित्रका प्रिन्ट बटनहरू हटाउने
            const clonedButtons = clone.querySelectorAll('.custom-print-btn');
            clonedButtons.forEach(btn => btn.remove());

            printWrapper.innerHTML = '';
            printWrapper.appendChild(clone);

            // पप-अप विन्डो खोल्ने
            this.toggleModal(true);
        }

        // ५. कम्प्युटर भ्युको पूरै स्क्रोल हुने पेजलाई सिधै PNG मा डाउनलोड गर्ने फङ्क्सन
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("लाइब्रेरी लोड हुँदैछ, कृपया १ सेकेन्डपछि पुनः प्रयास गर्नुहोस्।");
                return;
            }

            const downloadBtn = document.getElementById('downloadPngAction');
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै, कृपया पर्खनुहोस्...";
            downloadBtn.disabled = true;

            // ब्याकग्राउन्डमा १२८० पिक्सेल चौडाइ भएको डेस्कटप रेन्डरर सेट गर्ने
            html2canvas(printWrapper, {
                useCORS: true,
                allowTaint: true,
                scale: 1.5, // क्रिस्प र प्रष्ट फोटो क्वालिटीको लागि
                width: 1280,
                windowWidth: 1280,
                scrollY: -window.scrollY // स्क्रोलिङ पोजिसन फिक्स गर्न
            }).then(canvas => {
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.download = `Desktop-FullPage-${Date.now()}.png`;
                link.href = image;
                link.click();
                
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error(err);
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                downloadBtn.disabled = false;
            });
        }

        // ६. बटनलाई मितिको ठीक बाहिर सुरक्षित रूपमा राख्ने फङ्क्सन
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            const targetLocation = document.querySelector('.flex.items-center.gap-2.overflow-hidden .location-date');

            if (targetLocation) {
                targetLocation.parentNode.insertBefore(printBtn, targetLocation.nextSibling);
            } else {
                const fallback = document.querySelector('.location-date');
                if (fallback) fallback.parentNode.insertBefore(printBtn, fallback.nextSibling);
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
    setTimeout(runToolkit, 1200);
})();
