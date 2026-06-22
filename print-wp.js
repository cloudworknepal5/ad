/**
 * WordPress Newspaper Layout Fixer (Multi-Selector & Ads Fixed)
 * वर्डप्रेस थिममा '🖨️ A4 प्रिन्ट' बटन र लेआउट दुरुस्त देखाउने प्रणाली।
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

        // २. बटन र मोडलको प्रिमियम CSS स्टाइल
        injectStyles() {
            if (document.getElementById('wp-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'wp-toolkit-styles';
            style.innerHTML = `
                .custom-print-btn {
                    background-color: #28a745 !important; color: white !important; border: none !important; 
                    padding: 4px 12px !important; font-size: 13px !important; font-weight: bold !important; 
                    cursor: pointer !important; border-radius: 4px !important; display: inline-flex !important; 
                    align-items: center !important; gap: 5px !important; margin: 10px 5px !important; z-index: 99999 !important; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; font-family: 'Mukta', sans-serif !important;
                    text-transform: none !important; line-height: 1.4 !important; height: auto !important;
                }
                .custom-print-btn:hover { background-color: #218838 !important; }
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 1320px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); padding: 10px 0; z-index: 10; border-bottom: 1px solid #eee; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* वर्डप्रेस डेस्कटप कम्प्युटर मोड (1280px) सिम्युलेटर */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 10px; border: 1px solid #ddd; 
                    width: 1280px !important; max-width: 1280px !important; min-width: 1280px !important;
                    box-sizing: border-box; margin: 0 auto; overflow: hidden !important;
                    display: block !important; color: #333 !important;
                }
                /* साइडबार र मेन कन्टेन्टलाई दायाँ-बायाँ कम्प्युटर लुक दिने */
                #print-area-wrapper .row, 
                #print-area-wrapper .content-area,
                #print-area-wrapper .site-main { 
                    display: flex !important; flex-direction: row !important; 
                    width: 100% !important; max-width: 100% !important; gap: 25px !important;
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
            // वर्डप्रेसको पुरै मुख्य बडी वा र्‍यापर समात्ने
            const mainContent = document.querySelector('.site-content') || document.querySelector('#content') || document.querySelector('main') || document.body;
            const printWrapper = document.getElementById('print-area-wrapper');
            
            const clone = mainContent.cloneNode(true);
            
            // मोडल र बटनहरू हटाउने
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
            downloadBtn.innerText = "📸 स्क्रिनशट लिँदै, कृपया पर्खनुहोस्...";
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

        // ६. ⚠️ वर्डप्रेस थिम मल्टि-डिटेक्टर इन्जेक्सन प्रणाली ⚠️
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            // तपाईंको वर्डप्रेस थिममा भएका सम्भावित क्लासहरू (शीर्षक, मिति वा सामाजिक बटनहरू)
            const selectors = [
                '.single-post-meta',
                '.post-meta',
                '.entry-meta',
                '.heateor_sss_sharing_container', // सेयर बटन र्‍यापर
                '.social-share',
                'h1.entry-title',
                '.entry-header'
            ];

            let injected = false;
            for (const selector of selectors) {
                const target = document.querySelector(selector);
                if (target) {
                    // फेला परेको क्लासको ठीक तल बटन घुसाउने
                    target.parentNode.insertBefore(printBtn, target.nextSibling);
                    injected = true;
                    break;
                }
            }

            // यदि कुनै पनि क्लास फेला परेन भने मुख्य समाचारको शीर्षकमै राख्ने
            if (!injected) {
                const h1Title = document.querySelector('h1');
                if (h1Title) {
                    h1Title.parentNode.insertBefore(printBtn, h1Title.nextSibling);
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
    // वर्डप्रेसका विभिन्न प्लगइनहरू लोड भइसकेपछि चल्ने ब्याकअप टाइमिङ
    setTimeout(runToolkit, 1000);
    setTimeout(runToolkit, 2500);
})();
