/**
 * Animation-Ad JS - Slice Slider & Flutter Effect
 * Multi-functionality: Slice animation, Auto-slide, Wave motion
 */

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

const adImg = new Image();
adImg.src = 'ad-image.png'; // तपाईंको PNG फाइलको नाम
adImg.crossOrigin = "Anonymous";

let slices = [];
const numberOfSlices = 15; // फोटोलाई कतिवटा टुक्रामा काट्ने (slices)

class Slice {
    constructor(y, sliceHeight) {
        this.y = y;
        this.sliceHeight = sliceHeight;
        // सुरुमा टुक्राहरू स्क्रिन बाहिर (दायाँ तिर) हुनेछन्
        this.x = canvas.width + Math.random() * 500; 
        this.targetX = 0;
        this.speed = 0.02 + Math.random() * 0.05;
        this.flutterAmount = Math.random() * 10;
        this.angle = 0;
    }

    // फङ्सन १: स्लाइड गर्ने र फरफराउने लजिक
    update() {
        // स्लाइडिङ लजिक (Easing)
        let dx = this.targetX - this.x;
        this.x += dx * this.speed;

        // फरफराउने लजिक (Fluttering Effect)
        this.angle += 0.05;
        this.offsetY = Math.sin(this.angle) * 2; 
    }

    // फङ्सन २: टुक्रा कोर्ने
    draw() {
        ctx.drawImage(
            adImg, 
            0, this.y, adImg.width, this.sliceHeight, // Source (Image)
            this.x, this.y + this.offsetY, canvas.width, this.sliceHeight // Destination (Canvas)
        );
    }
}

// फङ्सन ३: स्लाइसहरू बनाउने
function initSlices() {
    slices = [];
    const sliceHeight = canvas.height / numberOfSlices;
    for (let i = 0; i < numberOfSlices; i++) {
        slices.push(new Slice(i * sliceHeight, sliceHeight));
    }
}

// फङ्सन ४: एनिमेसन लुप
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    slices.forEach(slice => {
        slice.update();
        slice.draw();
    });
    requestAnimationFrame(animate);
}

adImg.onload = () => {
    initSlices();
    animate();
};

// क्लिक गर्दा फेरि रि-एनिमेट हुने (Multi-function)
canvas.addEventListener('click', () => {
    initSlices();
});
