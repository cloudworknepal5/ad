/**
 * Premium WordPress Layout Cloner (Sidebar & Grid Ads Fixed)
 * वर्डप्रेसको साइडबार, मुख्य समाचार र सबै विज्ञापन ब्लकहरूलाई कम्प्युटर मोडमा दुरुस्त राख्ने मल्टि-फङ्क्सनल स्क्रिप्ट।
 */
(function() {
    // १. html2canvas लाइब्रेरी स्वतः लोड गर्ने
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);
    }

    class WordPressFullPageToolkit {
        constructor() {
            this.init();
        }

        // २. प्रिमियम डेस्कटप लेआउट सिमुलेशन CSS
        injectStyles() {
            if (document.getElementById('wp-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'wp-toolkit-styles';
            style.innerHTML = `
                .custom-print-btn {
                    background-color: #28a745 !important; color: white !important; border: none !important; 
                    padding: 5px 12px !important; font-size: 13px !important; font-weight: bold !important; 
                    cursor: pointer !important; border-radius: 4px !important; display: inline-flex !important; 
                    align-items: center !important; gap: 5px !important; margin: 10px 0 !important; z-index: 99999 !important; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; font-family: 'Mukta', sans-serif !important;
                }
                .custom-print-btn:hover { background-color: #218838 !important; }
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 1400px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); padding: 10px 0; z-index: 10; border-bottom: 1px solid #eee; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* ⚠️ मुख्य फिक्स: पूरै स्क्रिन डेस्कटप (1340px) लेआउट फोर्स गर्ने प्रणाली ⚠️ */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 15px; border: 1px solid #ddd; 
                    width: 1340px !important; max-width: 1340px !important; min-width: 1340px !important;
                    box-sizing: border-box; margin: 0 auto; overflow: hidden !important;
                    display: block !important;
                }
                /* थिम भित्रको ग्रिड वा फ्लेक्सलाई कम्प्युटर मोडमा फर्काउने */
                #print-area-wrapper .site-content,
                #print-area-wrapper .main-container,
                #print-area-wrapper .row,
                #print-area-wrapper #content {
                    display: flex !important; flex-direction: row !important;
                    width: 100% !important; max-width: 100% !important; gap: 30px !important;
                    align-items: flex-start !important;
                }
                /* मुख्य समाचारको भाग ७०% */
                #print-area-wrapper main, 
                #print-area-wrapper .content-area,
                #print-area-wrapper #primary { 
                    width: 70% !important; min-width: 70% !important; max-width: 70% !important; display: block !important; 
                }
                /* साइडबारको भाग ३०% - लुकेको भए पनि बाहिर ल्याउने */
                #print-area-wrapper sidebar,
                #print-area-wrapper aside,
                #print-area-wrapper .widget-area,
                #print-area-wrapper #secondary { 
                    width: 30% !important; min-width: 30% !important; max-width: 30% !important; 
                    display: block !important; visibility: visible !important; opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);
        }

        // ३. पप-अप विन्डो UI
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

        // ४. साइडबार र विज्ञापनसहितको पूरै बडी कपी गर्ने मुख्य इन्जिन
        preparePrintContent() {
            // सिधै मुख्य कन्टेनर वा पुरै बडीलाई कपी गर्ने ताकि साइडबार नछुटोस्
            const pageContainer = document.querySelector('.site-content') || 
                                  document.querySelector('#page') || 
                                  document.querySelector('.site-wrapper') || 
                                  document.body;
                                  
            const printWrapper = document.getElementById('print-area-wrapper');
            const clone = pageContainer.cloneNode(true);
            
            // कपी भित्रबाट पप-अप र पुराना बटनहरू सफा गर्ने
            const nestedModal = clone.querySelector('#printCropModal');
            if (nestedModal) nestedModal.remove();
            clone.querySelectorAll('.custom-print-btn').forEach(btn => btn.remove());

            // विज्ञापन र सामान्य फोटोहरू फिक्स (Weserv CORS PROXY)
            const clonedImages = clone.querySelectorAll('img');
            clonedImages.forEach(img => {
                let realSrc = img.getAttribute('data-lazy-src') || 
                              img.getAttribute('data-src') || 
                              img.getAttribute('src') || 
                              img.src;
                              
                if (realSrc && realSrc.indexOf('data:image') === -1) {
                    const cleanUrl = realSrc.replace(/^https?:\/\//, '');
                    img.src = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
                    img.setAttribute('src', img.src);
                }
                img.setAttribute('crossorigin', 'anonymous');
                img.removeAttribute('loading');
            });

            printWrapper.innerHTML = '';
            printWrapper.appendChild(clone);
            this.toggleModal(true);
        }

        // ५. HD PNG रेन्डर र डाउनलोड प्रक्रिया
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("कृपया १ सेकेन्ड पर्खनुहोस्, लाइब्रेरी लोड हुँदैछ।");
                return;
            }

            const downloadBtn = document.getElementById('downloadPngAction');
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै, कृपया पर्खनुहोस्...";
            downloadBtn.disabled = true;

            setTimeout(() => {
                html2canvas(printWrapper, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1.4,
                    width: 1340,
                    windowWidth: 1340,
                    scrollY: -window.scrollY
                }).then(canvas => {
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement('a');
                    link.download = `Full-Desktop-View-${Date.now()}.png`;
                    link.href = image;
                    link.click();
                    
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                }).catch(err => {
                    console.error("त्रुटि आयो:", err);
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                });
            }, 300);
        }

        // ६. सेयर बटन वा पोस्ट मेटाको मुनि प्रिन्ट बटन राख्ने
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            // वर्डप्रेस थिमको सोसल सेयर वा टाइम-सेक्सन पत्ता लगाउने मल्टि-सेलेक्टर
            const selectors = [
                '.heateor_sss_sharing_container',
                '.social-share',
                '.entry-meta',
                '.post-meta',
                'h1.entry-title'
            ];

            let injected = false;
            for (const selector of selectors) {
                const target = document.querySelector(selector);
                if (target) {
                    target.parentNode.insertBefore(printBtn, target.nextSibling);
                    injected = true;
                    break;
                }
            }

            if (!injected) {
                const h1Title = document.querySelector('h1');
                if (h1Title) h1Title.parentNode.insertBefore(printBtn, h1Title.nextSibling);
            }
        }

        init() {
            this.injectStyles();
            this.createModal();
            this.renderButton();
        }
    }

    const runToolkit = () => { new WordPressFullPageToolkit(); };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runToolkit);
    } else {
        runToolkit();
    }
    // सुरक्षित लोड सुनिश्चित गर्न मल्टि-टिमर
    setTimeout(runToolkit, 1000);
    setTimeout(runToolkit, 2500);
})();
