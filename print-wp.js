/**
 * Premium WordPress Newspaper Layout & Button Fixer
 * प्रिन्ट बटनलाई भिजिटर काउन्टको दायाँतिर इनलाइन राख्ने र साइडबारको भिजुअल फिक्स गर्ने मल्टि-फङ्क्सनल इन्जिन।
 */
(function() {
    // १. html2canvas लाइब्रेरी सुरक्षित रूपमा लोड गर्ने
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    class WordPressPNGToolkit {
        constructor() {
            this.init();
        }

        // २. बटन र डेस्कटप रेन्डरको CSS स्टाइल
        injectStyles() {
            if (document.getElementById('wp-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'wp-toolkit-styles';
            style.innerHTML = `
                /* इनलाइन बटन स्टाइल - आइकनहरूसँग मिल्दो */
                .custom-print-btn {
                    background-color: #c82333 !important; color: white !important; border: 1px solid rgba(255,255,255,0.2) !important; 
                    padding: 3px 10px !important; font-size: 12px !important; font-weight: 500 !important; 
                    cursor: pointer !important; border-radius: 4px !important; display: inline-flex !important; 
                    align-items: center !important; gap: 4px !important; margin-left: 10px !important; 
                    vertical-align: middle !important; font-family: 'Mukta', sans-serif !important;
                    transition: all 0.2s ease !important; height: 24px !important; line-height: 24px !important;
                }
                .custom-print-btn:hover { background-color: #bd2130 !important; transform: translateY(-1px); }
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 1360px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); padding: 10px 0; z-index: 10; border-bottom: 1px solid #eee; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* डेस्कटप कम्प्युटर मोड (1280px) सिम्युलेटर - साइडबार फिक्ससहित */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 15px; border: 1px solid #ddd; 
                    width: 1280px !important; max-width: 1280px !important; min-width: 1280px !important;
                    box-sizing: border-box; margin: 0 auto; overflow: hidden !important;
                    display: block !important; color: #333 !important;
                }
                /* साइडबार खप्टिने समस्या हटाउन ग्रिड लेआउट */
                #print-area-wrapper .site-content,
                #print-area-wrapper .main-container,
                #print-area-wrapper .row,
                #print-area-wrapper #content { 
                    display: grid !important;
                    grid-template-columns: 68% 30% !important;
                    gap: 2% !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                #print-area-wrapper main, #print-area-wrapper .content-area { width: 100% !important; display: block !important; }
                #print-area-wrapper sidebar, #print-area-wrapper aside, #print-area-wrapper .widget-area { 
                    width: 100% !important; display: block !important; visibility: visible !important; opacity: 1 !important; 
                }
            `;
            document.head.appendChild(style);
        }

        // ३. पप-अप मोडल विन्डो
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

        // ४. इमेज र विज्ञापन फिक्ससहित क्लोन गर्ने इन्जिन
        preparePrintContent() {
            const pageContainer = document.querySelector('.site-content') || document.querySelector('#page') || document.body;
            const printWrapper = document.getElementById('print-area-wrapper');
            
            const clone = pageContainer.cloneNode(true);
            
            const nestedModal = clone.querySelector('#printCropModal');
            if (nestedModal) nestedModal.remove();
            clone.querySelectorAll('.custom-print-btn').forEach(btn => btn.remove());

            // इमेज र विज्ञापन इमेज फिक्स (Weserv Proxy)
            const clonedImages = clone.querySelectorAll('img');
            clonedImages.forEach(img => {
                let realSrc = img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || img.src;
                if (realSrc && realSrc.indexOf('data:image') === -1) {
                    const cleanUrl = realSrc.replace(/^https?:\/\//, '');
                    img.src = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
                }
                img.setAttribute('crossorigin', 'anonymous');
                img.removeAttribute('loading');
            });

            printWrapper.innerHTML = '';
            printWrapper.appendChild(clone);
            this.toggleModal(true);
        }

        // ५. HD PNG डाउनलोड प्रोसेसिङ
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("लाइब्रेरी लोड हुँदैछ, कृपया पुनः प्रयास गर्नुहोस्।");
                return;
            }

            const downloadBtn = document.getElementById('downloadPngAction');
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै...";
            downloadBtn.disabled = true;

            setTimeout(() => {
                html2canvas(printWrapper, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1.5,
                    width: 1280,
                    windowWidth: 1280,
                    scrollY: -window.scrollY
                }).then(canvas => {
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.download = `Sahara-Desktop-View-${Date.now()}.png`;
                    link.href = image;
                    link.click();
                    
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                }).catch(err => {
                    console.error(err);
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                });
            }, 250);
        }

        // ६. ⚠️ बटनलाई भिजिटर काउन्ट वा कमेन्टको दायाँपट्टि इनलाइन राख्ने प्रणाली ⚠️
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            // थिमको टाइम, कमेन्ट वा भिजिटर काउन्टर भएको मेटा डाटा र्‍यापर पत्ता लगाउने
            const metaContainer = document.querySelector('.post-meta-items') || 
                                  document.querySelector('.entry-meta') || 
                                  document.querySelector('.single-post-meta');

            if (metaContainer) {
                // र्‍यापर भित्र इनलाइन घुसाउने
                metaContainer.appendChild(printBtn);
            } else {
                // यदि बुलेट र्‍यापर नभेटिएमा अन्तिम आइकन (जस्तै कमेन्ट वा भिजिटर टेक्स्ट) को सिधै दायाँपट्टि राख्ने
                const lastIcon = document.querySelector('.post-meta-items li:last-child') || 
                                 document.querySelector('.entry-meta span:last-child');
                if (lastIcon) {
                    lastIcon.parentNode.insertBefore(printBtn, lastIcon.nextSibling);
                } else {
                    // ब्याकअप: शीर्षक मुनि
                    const h1Title = document.querySelector('h1');
                    if (h1Title) h1Title.parentNode.insertBefore(printBtn, h1Title.nextSibling);
                }
            }
        }

        init() {
            this.injectStyles();
            this.createModal();
            this.renderButton();
        }
    }

    const runToolkit = () => { new WordPressPNGToolkit(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runToolkit);
    } else {
        runToolkit();
    }
    setTimeout(runToolkit, 1000);
    setTimeout(runToolkit, 2500);
})();
