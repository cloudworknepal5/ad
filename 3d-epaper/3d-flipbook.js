let currentScale = 1;

// जुम इन गर्ने फंक्सन
function zoomIn() {
    if (currentScale < 1.8) {
        currentScale += 0.15;
        document.getElementById('book-container').style.transform = `scale(${currentScale})`;
    }
}

// जुम आउट गर्ने फंक्सन
function zoomOut() {
    if (currentScale > 0.7) {
        currentScale -= 0.15;
        document.getElementById('book-container').style.transform = `scale(${currentScale})`;
    }
}

// जुम रिसेट गर्ने फंक्सन
function resetZoom() {
    currentScale = 1;
    document.getElementById('book-container').style.transform = `scale(1)`;
}

document.addEventListener('DOMContentLoaded', function () {
    let bookWidth = 450;
    let bookHeight = 636;

    // मोबाइल र ट्याब्लेटका लागि डाइनामिक साइज मिलाउने
    if (window.innerWidth < 768) {
        bookWidth = Math.floor((window.innerWidth * 0.92) / 2);
        bookHeight = Math.floor(bookWidth * 1.414); 
    }

    const flipBook = new St.PageFlip(
        document.getElementById('flipbook'),
        {
            width: bookWidth, 
            height: bookHeight, 
            showCover: true,
            maxShadowOpacity: 0.5,
            mobileScrollSupport: true,
            usePortrait: false
        }
    );

    flipBook.loadFromHTML(document.querySelectorAll('.page'));

    // पाना पल्टाउँदा बज्ने साउन्ड सेटअप
    const flipSound = new Audio('https://ad.neelamb.com/3d-epaper/image/flip-sound.mp3');
    
    flipBook.on('flip', (e) => {
        const soundInstance = flipSound.cloneNode();
        soundInstance.play().catch(error => {
            console.log("Audio play error: ", error);
        });
    });
});

// आइग्लास (🔍) आइकनमा क्लिक गर्दा ठूलो (Lightbox) देखाउने फंक्सन
function openZoom(iconElement) {
    const pageDiv = iconElement.closest('.page');
    const imgElement = pageDiv.querySelector('img');
    
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    
    modal.style.display = 'flex';
    modalImg.src = imgElement.src;
}

// लाइटबक्स बन्द गर्ने लजिक
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('lightbox-close');
    const modal = document.getElementById('lightbox-modal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if(e.target === this) {
                this.style.display = 'none';
            }
        });
    }
});
