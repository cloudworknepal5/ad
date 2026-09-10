<div style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; background: rgba(185, 28, 28, 0.9); padding: 30px 15px; box-sizing: border-box; overflow: hidden; font-family: 'Mukta', sans-serif;">
    
    <!-- ब्याकग्राउन्ड युट्युब भिडियो र रातो ओभरले -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none;">
        <iframe src="url?id=15" 
          style="position: absolute; top: 50%; left: 50%; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; transform: translate(-50%, -50%); border: none;" 
          allow="autoplay; encrypted-media">
        </iframe>
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(185, 28, 28, 0.85); z-index: 2;"></div>
    </div>

    <!-- मुख्य सामग्रीहरू (Container to keep alignment) -->
    <div style="position: relative; z-index: 3; max-width: 1200px; margin: 0 auto;">
        
        <!-- शीर्षक खण्ड -->
        <div style="display: flex; align-items: center; margin-bottom: 25px; position: relative;">
            <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
            <h2 style="padding: 0 20px; font-size: 24px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 8px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); text-align: center; white-space: nowrap;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #fff; display: inline-block;"></span>
                फेसबुक रिलहरू (Reels Only)
            </h2>
            <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
        </div>

        <!-- रिलहरूको ग्रिड लेआउट (तपाईंले पठाउनुभएको ५ वटा वास्तविक रिलहरूसहित) -->
        <div class="tv-reel-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; box-sizing: border-box;">
            
            <!-- रिल १ -->
            <div class="tv-reel-item">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2488492351627228%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल २ -->
            <div class="tv-reel-item">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1536919751455365%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ३ -->
            <div class="tv-reel-item">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1062815883119978%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ४ -->
            <div class="tv-reel-item">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1342406334356634%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ५ -->
            <div class="tv-reel-item">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1419765423480113%2F&show_text=true&width=357&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

        </div>
    </div>
</div>

<!-- रेस्पोन्सिभ डिजाइनका लागि CSS -->
<style>
  .tv-reel-item {
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    position: relative;
    width: 100%;
    padding-bottom: 177.77%; /* 9:16 ठाडो रिल साइज रेसियो */
    box-sizing: border-box;
  }
  .tv-reel-item iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    overflow: hidden;
  }
  
  /* डेस्कटपमा ५ वटै स्पष्ट देखिने व्यवस्था */
  @media (min-width: 901px) {
    .tv-reel-grid {
      grid-template-columns: repeat(5, 1fr) !important;
    }
  }

  /* ट्याब्लेट भ्युमा ३ वटा */
  @media (max-width: 900px) and (min-width: 551px) {
    .tv-reel-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  /* मोबाइल भ्युमा ठीक एउटा मात्र रिल देखिने व्यवस्था */
  @media (max-width: 550px) {
    .tv-reel-grid {
      grid-template-columns: 1fr !important;
    }
  }
</style>
