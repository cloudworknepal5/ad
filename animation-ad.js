/**
 * Animation-Ad JS
 * Function: Fragments to Image Assembly
 * Features: Auto-join, Mouse-repel, Multi-speed control
 */

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// साइज कन्ट्रोल गर्ने मल्टी-फङ्सन सेटिङ
canvas.width = 600;
canvas.height = 600;

let particlesArray = [];
const mouse = {
    x: null,
    y: null,
    radius: 100
};

// माउसको स्थान पत्ता लगाउने
window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

const adImg = new Image();
adImg.src = 'ad-image.png'; // तपाईंको PNG फाइलको नाम यहाँ राख्नुहोस्
adImg.crossOrigin = "Anonymous";

class Particle {
    constructor(x, y, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = x;
        this.originY = y;
        this.color = color;
        this.size = 2; // टुक्राको साइज
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.04; // जोडिने गति (यसलाई परिवर्तन गरेर हेर्नुहोस्)
        this.friction = 0.8;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        // टुक्रा छरिने लजिक
        if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * 5;
            this.vy -= Math.sin(angle) * 5;
        }

        // टुक्रा जोडिने लजिक
        this.vx += (this.originX - this.x) * this.ease;
        this.vy += (this.originY - this.y) * this.ease;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
    }
}

function init() {
    ctx.drawImage(adImg, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 4) { // ४ पिक्सेलको ग्यापमा टुक्रा बनाउने
        for (let x = 0; x < canvas.width; x += 4) {
            const index = (y * pixels.width + x) * 4;
            const alpha = pixels.data[index + 3];
            if (alpha > 128) {
                const color = `rgb(${pixels.data[index]},${pixels.data[index+1]},${pixels.data[index+2]})`;
                particlesArray.push(new Particle(x, y, color));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

adImg.onload = () => {
    init();
    animate();
};
