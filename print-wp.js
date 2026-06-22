/**
 * WordPress Multi-Function Full-Page PNG Toolkit (Selector & Layout Fixed)
 * वर्डप्रेसका लागि पोष्ट शीर्षक वा सेयर बटनको मुनि स्वतः '🖨️ A4 प्रिन्ट' राख्ने प्रणाली।
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

        // २. बटन र मोडलको CSS स्टाइल
        injectStyles() {
            if (document.getElementById('wp-toolkit-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'wp-toolkit-styles';
            style.innerHTML = `
                .custom-print-btn {
                    background-color: #28a745 !important; color: white !important; border: none !important; 
                    padding: 6px 14px !important; font-size: 14px !important; font-weight: bold !important; 
                    cursor: pointer !important; border-radius: 4px !important; display: inline-flex !important; 
                    align-items: center !important; gap: 5px !important; margin: 10px 0 !important; z-index: 99999 !important; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; font-family: 'Mukta', sans-serif !important;
                    text-transform: none !important; line-height: 1.2 !important;
                }
                .custom-print-btn:hover { background-color: #218838 !important; }
                
                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }
                .crop-box { max-width: 1320px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
                .btn-group { display: flex; gap: 12px; margin-bottom: 20px; position: sticky; top: 0; background: rgba(255,255,255,0.95); padding: 10px 0; z-index: 10; border-bottom: 1px solid #eee; }
                .btn-action { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                .btn-info { background: #007bff; color: white; }
                .btn-danger { background: #dc3545; color: white; }
                
                /* डेस्कटप कम्प्युटर मोड सिम्युलेटर */
                #print-area-wrapper { 
                    background: #f8f9fa; padding: 10px; border: 1px solid #ddd; 
                    width: 1280px !important; max-width: 1280px !important; min-width: 1280px !important;
                    box-sizing: border-box; margin: 0 auto; overflow: hidden !important;
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

        // ४. सामग्री कपी र Weserv इमेज प्रोक्सी प्रोसेसिङ
        preparePrintContent() {
            // वर्डप्रेसको मुख्य पोष्ट वा बडी एरिया समात्ने
            const mainContent = document.querySelector('article') || document.querySelector('.post-content') || document.querySelector('.entry-content') || document.body;
            const printWrapper = document.getElementById('print-area-wrapper');
            
            const clone = mainContent.cloneNode(true);
            
            // मोडल र बटनहरू हटाउने
            const nestedModal = clone.querySelector('#printCropModal');
            if (nestedModal) nestedModal.remove();
            clone.querySelectorAll('.custom-print-btn').forEach(btn => btn.remove());

            // इमेज फिक्स (Weserv CORS Proxy)
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

        // ५. डाउनलोड फङ्क्सन
        downloadAsPNG() {
            const printWrapper = document.getElementById('print-area-wrapper');
            if (!window.html2canvas) {
                alert("लाइब्रेरी लोड हुँदैछ, कृपया १ सेकेन्डपछि पुनः प्रयास गर्नुहोस्।");
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
                    link.download = `WP-Desktop-View-${Date.now()}.png`;
                    link.href = image;
                    link.click();
                    
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                }).catch(err => {
                    console.error(err);
                    downloadBtn.innerText = "📸 सिधै PNG डाउनलोड गर्नुहोस् (Desktop View)";
                    downloadBtn.disabled = false;
                });
            }, 200);
        }

        // ६. वर्डप्रेसको शीर्षक वा सेयर बटनको मुनि बटन राख्ने स्मार्ट फङ्क्सन
        renderButton() {
            if (document.getElementById('instant-print-btn')) return;

            const printBtn = document.createElement('button');
            printBtn.id = 'instant-print-btn';
            printBtn.className = 'custom-print-btn';
            printBtn.innerHTML = '🖨️ A4 प्रिन्ट';
            printBtn.onclick = () => this.preparePrintContent();

            // वर्डप्रेस थिमहरूमा सामान्यतया प्रयोग हुने क्लासहरू (Title, Meta, Entry, Content)
            const target = document.querySelector('.entry-title') || 
                           document.querySelector('.post-title') || 
                           document.querySelector('.entry-meta') ||
                           document.querySelector('.single-post-title') ||
                           document.querySelector('h1');

            if (target) {
                target.parentNode.insertBefore(printBtn, target.nextSibling);
            } else {
                // यदि केही भेटिएन भने बडीको सुरुमा राख्ने
                document.body.insertBefore(printBtn, document.body.firstChild);
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
    // वर्डप्रेस प्लगइन वा ढिलो लोड हुने थिमका लागि सेफ टाइमर
    setTimeout(runToolkit, 1500);
})();
