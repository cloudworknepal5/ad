/**

 * Ultimate Full-Page PNG Toolkit (Inline Button Fix)

 * प्रिन्ट बटनलाई भिजिटर काउन्टको दायाँतिर इनलाइन राख्ने प्रणाली।

 */

(function() {

    // १. html2canvas लाइब्रेरी लोड गर्ने

    if (!window.html2canvas) {

        const script = document.createElement('script');

        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

        document.head.appendChild(script);

    }



    class WordPressPNGToolkit {

        constructor() {

            this.init();

        }



        injectStyles() {

            if (document.getElementById('wp-toolkit-styles')) return;

            

            const style = document.createElement('style');

            style.id = 'wp-toolkit-styles';

            style.innerHTML = `

                .custom-print-btn {

                    background-color: #c82333 !important; color: white !important; border: none !important; 

                    padding: 2px 8px !important; font-size: 11px !important; font-weight: bold !important; 

                    cursor: pointer !important; border-radius: 3px !important; display: inline-flex !important; 

                    align-items: center !important; margin-left: 5px !important; vertical-align: middle !important;

                    height: 20px !important; line-height: 20px !important; box-shadow: none !important;

                }

                .custom-print-btn:hover { background-color: #a71d2a !important; }

                

                .crop-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 9999999; overflow: auto; padding: 20px; font-family: sans-serif; }

                .crop-box { max-width: 1360px; margin: 10px auto; background: white; padding: 25px; border-radius: 8px; }

                .btn-group { display: flex; gap: 10px; margin-bottom: 15px; background: #f8f9fa; padding: 10px; border-bottom: 1px solid #ddd; }

                .btn-action { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }

                .btn-info { background: #007bff; color: white; }

                .btn-danger { background: #dc3545; color: white; }

                

                #print-area-wrapper { width: 1280px !important; margin: 0 auto; background: white; padding: 20px; }

            `;

            document.head.appendChild(style);

        }



        createModal() {

            if (document.getElementById('printCropModal')) return;

            const modal = document.createElement('div');

            modal.className = 'crop-modal';

            modal.id = 'printCropModal';

            modal.innerHTML = `

                <div class="crop-box">

                    <div class="btn-group">

                        <button class="btn-action btn-info" id="downloadPngAction">📸 PNG डाउनलोड गर्नुहोस्</button>

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

            if (modal) modal.style.display = show ? 'block' : 'none';

        }



        preparePrintContent() {

            const pageContainer = document.querySelector('.site-content') || document.body;

            const printWrapper = document.getElementById('print-area-wrapper');

            const clone = pageContainer.cloneNode(true);

            

            clone.querySelectorAll('.custom-print-btn').forEach(b => b.remove());

            printWrapper.innerHTML = '';

            printWrapper.appendChild(clone);

            this.toggleModal(true);

        }



        downloadAsPNG() {

            html2canvas(document.getElementById('print-area-wrapper'), { useCORS: true, scale: 1.5, width: 1280 }).then(canvas => {

                const link = document.createElement('a');

                link.download = `Print-${Date.now()}.png`;

                link.href = canvas.toDataURL("image/png");

                link.click();

            });

        }



        // ⚠️ यो भागले भिजिटर काउन्टको दायाँतिर बटन राख्छ ⚠️

        renderButton() {

            if (document.getElementById('instant-print-btn')) return;



            // भिजिटर काउन्टको लागि डिभ (Div) सिर्जना

            const visitorDiv = document.createElement('div');

            visitorDiv.id = 'visitor-count';

            visitorDiv.className = 'leading-none';

            visitorDiv.style.display = 'inline-flex';

            visitorDiv.style.alignItems = 'center';



            const printBtn = document.createElement('button');

            printBtn.id = 'instant-print-btn';

            printBtn.className = 'custom-print-btn';

            printBtn.innerHTML = '🖨️ प्रिन्ट';

            printBtn.onclick = () => this.preparePrintContent();



            // भिजिटर काउन्टको दायाँतिर प्रिन्ट बटन

            visitorDiv.appendChild(printBtn);



            // थिमको मेटा डाटा र्‍यापर पत्ता लगाउने

            const meta = document.querySelector('.post-meta-items') || document.querySelector('.entry-meta');

            if (meta) {

                meta.appendChild(visitorDiv);

            } else {

                const title = document.querySelector('h1');

                if (title) title.parentNode.insertBefore(visitorDiv, title.nextSibling);

            }

        }



        init() {

            this.injectStyles();

            this.createModal();

            this.renderButton();

        }

    }



    new WordPressPNGToolkit();

})(); 
