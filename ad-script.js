(function() {
    function initResponsiveAd() {
        const adData = {
            type: "image", // Switch to "video" for video ads
            mediaUrl: "https://educationnepal.eu.org/ad/image/new-year-2026.png?text=Responsive+Ad", // Use a high-res file
            link: "https://neelamb.com",
            aspectRatio: "16/9" // Optional: helps prevent layout shift
        };

        const adSlots = document.querySelectorAll('.custom-ad-provider');

        adSlots.forEach(slot => {
            // Prevent double loading
            if (slot.getAttribute('data-ad-loaded') === 'true') return;

            // Apply Responsive Styles to Container
            slot.style.width = "100%";
            slot.style.maxWidth = "100%"; // Ensures it doesn't overflow
            slot.style.display = "block";
            slot.style.position = "relative";
            slot.style.lineHeight = "0"; // Removes tiny gaps under images

            let html = "";
            if (adData.type === "video") {
                html = `
                <div style="width:100%; position:relative; padding-top: 56.25%;"> <video autoplay muted loop playsinline 
                           style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                        <source src="${adData.mediaUrl}" type="video/mp4">
                    </video>
                    <a href="${adData.link}" target="_blank" 
                       style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10;"></a>
                </div>`;
            } else {
                html = `
                <a href="${adData.link}" target="_blank" style="display:block; width:100%;">
                    <img src="${adData.mediaUrl}" 
                         style="width:100%; height:auto; display:block; border:none; border-radius:4px;">
                </a>`;
            }

            slot.innerHTML = html;
            slot.setAttribute('data-ad-loaded', 'true');
        });
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResponsiveAd);
    } else {
        initResponsiveAd();
    }
})();