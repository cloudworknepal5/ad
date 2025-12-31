// Function to create and inject the popup HTML and CSS
(function() {
    // 1. Create the CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #popup-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; visibility: hidden; opacity: 0;
            transition: all 0.3s ease-in-out;
            font-family: sans-serif;
        }
        #popup-overlay.popup-visible { visibility: visible; opacity: 1; }
        #popup-content {
            background: #fff; border-radius: 15px; overflow: hidden;
            width: 90%; max-width: 400px; position: relative;
            transform: scale(0.7); transition: transform 0.3s ease;
        }
        #popup-overlay.popup-visible #popup-content { transform: scale(1); }
        #popup-img { width: 100%; height: auto; display: block; }
        .popup-body { padding: 20px; text-align: center; }
        #close-popup {
            position: absolute; top: 8px; right: 8px; background: #fff;
            border: none; font-size: 25px; cursor: pointer; border-radius: 50%;
            width: 32px; height: 32px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .popup-button {
            display: block; margin-top: 15px; padding: 12px;
            background: #e74c3c; color: #fff; text-decoration: none; 
            border-radius: 50px; font-weight: bold; text-transform: uppercase;
        }
    `;
    document.head.appendChild(style);

    // 2. Create the HTML Structure
    const popupHTML = `
        <div id="popup-overlay">
            <div id="popup-content">
                <button id="close-popup">&times;</button>
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0bGmyBe0orDC5j2U0Ub6jozlvss61koZFkG9Y7coUSmyWB7QBmOQONIWoibT8eLiFIgGyPkUuA4s5iiL3EX4hlGIpn203Qru2WT_Yrp4QgVXEwKYACs5agx_y9mhT-ceXQUUWiAcIisDUZy6arHf8y2YhJSPatV6sZXpbEXJnujlRjlvssjVVWJNiuUDu/s16000/neelamb-ad.gif" alt="Special Offer" id="popup-img">
                <div class="popup-body">
                    <h2>Special Offer!</h2>
                    <p>Don't miss.</p>
                    <a href="https://neelamb.com" class="popup-button">Click Here</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 3. Popup Logic
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('close-popup');

    // Show popup after 2 seconds
    setTimeout(() => {
        overlay.classList.add('popup-visible');
    }, 2000);

    // Close Events
    closeBtn.onclick = () => overlay.classList.remove('popup-visible');
    window.onclick = (e) => { if (e.target == overlay) overlay.classList.remove('popup-visible'); };
})();