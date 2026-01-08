/**
 * Animation-Ad JS - Dancing & Floating Fragments
 * Multi-functionality: Larger dots, Sinewave motion, Mouse interaction
 */

const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

canvas.width = 600;
canvas.height = 600;

let particlesArray = [];
let gap = 10; // डटहरू बीचको ग्याप (यसलाई बढाउँदा टुक्रा अझ ठूला र कम हुन्छन्)

const mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

const adImg = new Image();
adImg.src = 'ad-image.png'; 
adImg.crossOrigin = "Anonymous";

class Particle {
    constructor(x, y, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = x;
        this.originY = y;
        this.color = color;
        this.size = 6; // डटको साइज ठूलो बनाइएको (ठूलठूला टुक्रा)
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.03;
        this.friction = 0.9;
        this.randomAngle = Math.random() * Math.PI * 2; // नाचिरहेको प्रभावको लागि
    }

    draw() {
        ctx.fillStyle = this.color;
        // गोलो टुक्रा बनाउन (Optional: square बनाउन fillRect प्रयोग गर्नुहोस्)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // १. उडिरहेको वा नाचिरहेको प्रभाव (Floating/Dancing)
        this.randomAngle += 0.05; 
        let floatingX = Math.cos(this.randomAngle) * 3; 
        let floatingY = Math.sin(this.randomAngle) * 3;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * 8;
            this.vy -= Math.sin(angle) * 8;
        }

        // २. आफ्नो ठाउँमा फर्किने तर हल्लिँदै (Floating effect added to origin)
        this.vx += (this.originX + floatingX - this.x) * this.ease;
        this.vy += (this.originY + floatingY - this.y) * this.ease;
        
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    }
}

function init() {
    particlesArray = []; // पुराना पार्टिकल्स हटाउने
    ctx.drawImage(adImg, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // gap = 10 ले टुक्राहरूलाई ठूलो र प्रस्ट बनाउँछ
    for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
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
