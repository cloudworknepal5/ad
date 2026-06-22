/**
 * Ultimate Desktop-View Full-Page PNG Toolkit
 * इमेज र विज्ञापन फिक्स गरिएको तथा डाउनलोड र क्लोज बटन मात्र भएको मल्टि-फङ्क्सनल क्लास।
 */
(function() {
    // १. html2canvas लाइब्रेरी सुरक्षित रूपमा लोड गर्ने
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    class UltimateDesktopPNGToolkit {
        constructor() {
            this.init();
        }

        // २. CSS स्टाइलहरू (PNG प्रिव्यु र बटन लेआउट)
        injectStyles() {
            if (document.getElementById('ultimate-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'ultimate-toolkit-styles';
            style.innerHTML = `
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
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* डेस्कटप साइज सिम्युलेटर */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 10px; border: 1px solid #ddd; 
                    width: 1280px !important; max-width: 1280px !important;
                    min-width: 1280px !important;
                    box-sizing: border-box;
                    margin: 0 auto;
                    overflow: hidden !important;
                }
                #print-area-wrapper .wrapper, #print-area-wrapper .container { width: 100% !important; max-width: 100% !important; }
            `;
            document.head.appendChild(style);
        }

        // ३. दुईवटा मात्र बटन भएको पप-अप विन्डो (Modal UI)
        createModal() {
            if (document.getElementById('printCropModal')) return;
            const modal = document.createElement('div');
            modal.className = 'crop-modal';
            modal.id = 'printCropModal';
            modal.innerHTML = `
                <div class="crop-box">
                    <div class="btn-group">
                        <button class="btn-action btn-info" id="downloadPngAction">📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)</button>
                        <button class="btn-action btn-danger" id="closeModalAction">बन्द गर्नुहोस्</button>
                    </div>
                    <div id="print-area-wrapper"></div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('closeModalAction').onclick = () => this.toggleModal(false);
            document.getElementById('downloadPngAction').onclick = () => this.downloadAsPNG();
        }

        toggleModal(show) {
            const modal = document.getElementById('printCropModal');
            if (modal) {
                modal.style.display = show ? 'block' : 'none';
                document.body.style.overflow = show ? 'hidden' : 'auto';
            }
        }

        // ४. इमेजहरूलाई CORS समस्याबाट बचाउन र कपी गर्न मल्टि-फङ्क्सनल प्रोसेसर
        preparePrintContent() {
            const mainContent = document.querySelector('#page-wrapper') || document.querySelector('.site-wrapper') || document.body;
            const printWrapper = document.getElementById('print-area-wrapper');
            
            const clone = mainContent.cloneNode(true);
            const nestedModal = clone.querySelector('#printCropModal');
            if (nestedModal) nestedModal.remove();
            
            // कपी गरिएका ठाउँबाट प्रिन्ट बटनहरू हटाउने
            const clonedButtons = clone.querySelectorAll('.custom-print-btn');
            clonedButtons.forEach(btn => btn.remove());

            // इमेज लोड फिक्स: इमेज ट्यागहरूमा 'crossOrigin' एट्रीब्युट थप्ने र बलियो बनाउने
            const images = clone.querySelectorAll('img');
            images.forEach(img => {
                if (img.src) {
                    // इमेजहरू ब्याकग्राउन्डमा पुनः रि-लोड गराएर क्याप्चर सुरक्षित गर्ने
                    const originalSrc = img.src;
                    img.setAttribute('crossorigin', 'anonymous');
                    img.src = originalSrc;
                }
            });

            printWrapper.innerHTML = '';
            printWrapper.appendChild(clone);

            this.toggleModal(true);
        }

        // ५. इमेज र विज्ञापनसहित डेस्कटप मोडको PNG डाउनलोड गर्ने फङ्क्सन
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("लाइब्रेरी लोड हुँदैछ, कृपया १ सेकेन्डपछि पुनः प्रयास गर्नुहोस्।");
                return;
            }

            const downloadBtn = document.getElementById('downloadPngAction');
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै, कृपया पर्खनुहोस्...";
            downloadBtn.disabled = true;

            // इमेज र विज्ञापन देखिनका लागि 'useCORS: true' र 'logging: true' अन गरिएको छ
            html2canvas(printWrapper, {
                useCORS: true,
                allowTaint: false,
                foreignObjectRendering: false,
                scale: 1.5, // उच्च गुणस्तरको फोटोका लागि
                width: 1280,
                windowWidth: 1280,
                scrollY: -window.scrollY
            }).then(canvas => {
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.download = `Desktop-FullPage-${Date.now()}.png`;
                link.href = image;
                link.click();
                
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                downloadBtn.disabled = false;
            }).catch(err => {
                console.error("PNG सेभ गर्दा त्रुटि आयो:", err);
                downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                downloadBtn.disabled = false;
            });
        }

        // ६. बटन राख्ने फङ्क्सन
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

    const runToolkit = () => { new UltimateDesktopPNGToolkit(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runToolkit);
    } else {
        runToolkit();
    }
    setTimeout(runToolkit, 1200);
})();
