(function() {
    const config = {
        // तपाईं यहाँ एउटा मात्र लिङ्क वा धेरै लिङ्कहरूको लिस्ट (Array) राख्न सक्नुहुन्छ
        sources: [
            'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueXNoeXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpx9U5I3S904/giphy.gif', // GIF
            'https://via.placeholder.com/720x400?text=NeelamB+Ad+2', // JPG
            'https://www.w3schools.com/html/mov_bbb.mp4' // MP4 Video
        ],
        target: 'https://ad.neelamb.com',
        waitTime: 8,
        id: 'nl_multi_v4'
    };

    // १. फाइलको प्रकार चिन्ने फङ्सन (Multi-Function Logic)
    const getFileType = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        const ext = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
        return 'iframe';
    };

    // २. मिडिया रेन्डरर (विविध फाइलका लागि)
    const renderMedia = (url) => {
        const type = getFileType(url);
        if (type === 'image') {
            return `<a href="${config.target}" target="_blank"><img src="${url}" style="width:100%; display:block; max-height:80vh; object-fit:contain;"></a>`;
        } else if (type === 'video') {
            return `<video id="nl-v3-vid" style="width:100%; display:block;" autoplay muted playsinline controls><source src="${url}" type="video/mp4"></video>`;
        } else if (type === 'youtube') {
            return `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.youtube.com/embed/${url.match(/v=([^&]+)/)[1]}?autoplay=1&mute=1" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe></div>`;
        }
        return `<iframe src="${url}" style="width:100%; height:450px; border:none;"></iframe>`;
    };

    // ३. CSS डिजाइन
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #nl-v4-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 9999999; display: flex; justify-content: center; align-items: center; }
            #nl-v4-box { width: 90%; max-width: 750px; background: #000; border: 2px solid #00d2ff; border-radius: 15px; overflow: hidden; position: relative; }
            #nl-v4-tm { position: absolute; top: 15px; right: 15px; background: #00d2ff; color: #000; padding: 5px 15px; border-radius: 50px; font-weight: bold; font-family: sans-serif; z-index: 1000; }
            #nl-v4-cl { display: none; position: absolute; top: 15px; right: 15px; background: #ff4757; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; z-index: 1001; font-weight: bold; }
            .nl-slide { display: none; }
            .nl-active { display: block; }
        `;
        document.head.appendChild(style);
    };

    // ४. मल्टी-फाइल ह्यान्डलर (Slider Logic)
    let currentSlide = 0;
    const startSlider = () => {
        const slides = document.querySelectorAll('.nl-slide');
        if (slides.length <= 1) return;
        
        setInterval(() => {
            slides[currentSlide].classList.remove('nl-active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('nl-active');
        }, 3000); // प्रत्येक ३ सेकेन्डमा विज्ञापन फेरिने
    };

    // ५. मुख्य विज्ञापन इन्जिन
    const runEngine = () => {
        if (document.getElementById('nl-v4-overlay')) return;
        injectStyles();

        const overlay = document.createElement('div');
        overlay.id = 'nl-v4-overlay';

        // सबै फाइलहरूलाई स्लाइडमा राख्ने
        let contentHtml = '';
        config.sources.forEach((src, index) => {
            contentHtml += `<div class="nl-slide ${index === 0 ? 'nl-active' : ''}">${renderMedia(src)}</div>`;
        });

        overlay.innerHTML = `
            <div id="nl-v4-box">
                <div id="nl-v4-tm">Skip in: <span id="nl-v4-s">${config.waitTime}</span>s</div>
                <button id="nl-v4-cl" onclick="this.closest('#nl-v4-overlay').remove()">CLOSE ✖</button>
                ${contentHtml}
            </div>`;

        document.body.appendChild(overlay);
        
        // टाइमर सुरु
        let sec = config.waitTime;
        const timer = setInterval(() => {
            sec--;
            if(document.getElementById('nl-v4-s')) document.getElementById('nl-v4-s').innerText = sec;
            if (sec <= 0) {
                clearInterval(timer);
                document.getElementById('nl-v4-tm').style.display = 'none';
                document.getElementById('nl-v4-cl').style.display = 'block';
            }
        }, 1000);

        startSlider();
    };

    // ६. बुटस्ट्र्याप
    ['click', 'touchstart'].forEach(e => 
        document.addEventListener(e, runEngine, { once: true })
    );

})();
