(function() {
    // १. रातोपाटी स्टाइल CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #neelamb-footer-v2 { 
            font-family: 'Mukta', sans-serif; 
            background: #ffffff; 
            color: #333; 
            padding: 60px 0 20px; 
            border-top: 4px solid #e31e24; 
            margin-top: 50px; 
            width: 100%;
            display: block;
            clear: both;
        }
        .f2-container { 
            max-width: 1240px; 
            margin: 0 auto; 
            padding: 0 20px; 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr 1fr; 
            gap: 40px; 
        }
        
        .f2-col h3 { 
            color: #e31e24; 
            font-size: 22px; 
            font-weight: 800; 
            margin-bottom: 25px; 
            position: relative; 
            padding-bottom: 10px; 
        }
        .f2-col h3::after { 
            content: ''; 
            position: absolute; 
            left: 0; 
            bottom: 0; 
            width: 50px; 
            height: 3px; 
            background: #e31e24; 
        }
        
        .f2-links { display: flex; flex-direction: column; gap: 12px; }
        .f2-links a { 
            color: #444; 
            font-size: 17px; 
            font-weight: 600; 
            text-decoration: none; 
            transition: 0.3s; 
        }
        .f2-links a:hover { color: #e31e24; padding-left: 5px; }
        
        .f2-info { line-height: 1.8; font-size: 16px; color: #555; }
        .f2-info strong { color: #1a1a1a; display: block; margin-top: 10px; }
        
        .f2-social { display: flex; gap: 15px; margin-top: 20px; }
        .f2-social a { 
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            background: #f8f8f8; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #e31e24; 
            font-size: 18px; 
            transition: 0.3s; 
            border: 1px solid #eee;
        }
        .f2-social a:hover { 
            background: #e31e24; 
            color: #ffffff; 
            transform: translateY(-3px); 
        }
        
        .f2-bottom { 
            max-width: 1240px; 
            margin: 40px auto 0; 
            padding: 20px; 
            border-top: 1px solid #eee; 
            text-align: center; 
            font-size: 15px; 
            color: #666; 
            font-weight: 600; 
        }
        
        /* Dark Mode Compatibility */
        .dark #neelamb-footer-v2 { background: #161e2e !important; color: #f1f5f9 !important; border-top-color: #ef4444; }
        .dark .f2-col h3 { color: #ffffff !important; }
        .dark .f2-links a, .dark .f2-info { color: #cbd5e1 !important; }
        .dark .f2-info strong { color: #ffffff !important; }
        .dark .f2-social a { background: #1e293b; color: #ef4444; border-color: #334155; }
        .dark .f2-bottom { border-top-color: #1e293b; color: #94a3b8; }

        @media (max-width: 1024px) {
            .f2-container { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) { 
            .f2-container { grid-template-columns: 1fr; text-align: center; } 
            .f2-col h3::after { left: 50%; transform: translateX(-50%); } 
            .f2-social { justify-content: center; } 
        }
    `;
    document.head.appendChild(style);

    // २. Footer HTML Structure
    const footerHTML = `
        <div class="f2-container">
            <div class="f2-col">
                <h3>हाम्रो बारेमा</h3>
                <div class="f2-info">
                    नेपालको अग्रणी समाचार पोर्टल, जहाँ हामी सत्य, तथ्य र निष्पक्ष समाचार सम्प्रेषण गर्दछौं। हामी भीडभन्दा अलग र विश्वसनीय पत्रकारितामा विश्वास राख्छौं।
                </div>
                <div class="f2-social">
                    <a href="https://facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" target="_blank"><i class="fab fa-twitter"></i></a>
                    <a href="https://youtube.com" target="_blank"><i class="fab fa-youtube"></i></a>
                    <a href="https://tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
                </div>
            </div>
            
            <div class="f2-col">
                <h3>महत्वपूर्ण लिङ्कहरू</h3>
                <div class="f2-links">
                    <a href="/">गृहपृष्ठ</a>
                    <a href="/search/label/समाचार">समाचार</a>
                    <a href="/search/label/बिचार">बिचार</a>
                    <a href="/search/label/खेलकुद">खेलकुद</a>
                    <a href="/search/label/मनोरञ्जन">मनोरञ्जन</a>
                </div>
            </div>
            
            <div class="f2-col">
                <h3>सम्पर्क</h3>
                <div class="f2-info">
                    <strong>कार्यालय:</strong> काठमाडौं, नेपाल
                    <strong>फोन:</strong> +९७७-०१-XXXXXXX
                    <strong>इमेल:</strong> info@neelamb.com
                </div>
            </div>
            
            <div class="f2-col">
                <h3>कानुनी जानकारी</h3>
                <div class="f2-links">
                    <a href="#">हाम्रो टिम</a>
                    <a href="#">गोपनीयता नीति</a>
                    <a href="#">विज्ञापन दर</a>
                    <a href="#">सम्पर्क</a>
                </div>
            </div>
        </div>
        <div class="f2-bottom">
            &copy; ${new Date().getFullYear()} सर्वाधिकार सुरक्षित: तपाईंको न्यूज पोर्टल | Design by Neelamb Art & Design
        </div>
    `;

    // ३. फुटरलाई डममा इन्जेक्ट गर्ने (Multi-function)
    function injectFooter() {
        const footerDiv = document.getElementById('neelamb-footer-v2');
        if (footerDiv) {
            footerDiv.innerHTML = footerHTML;
        }
    }

    // पेज लोड भएपछि रन गर्ने
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();