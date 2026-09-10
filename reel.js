<div class="dnn-reel-wrapper" style="width: 100%; box-sizing: border-box; overflow: hidden; margin: 20px 0;">
  <div class="dnn-reel-section" style="font-family: 'Mukta', sans-serif; max-width: 1200px; margin: 0 auto; padding: 15px; position: relative; overflow: hidden; border-radius: 15px; box-sizing: border-box;">
      
      <!-- ब्याकग्राउन्ड युट्युब भिडियो र रातो ओभरले -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none;">
          <iframe src="https://www.youtube.com/embed/elu-0ykTXqo?autoplay=1&mute=1&loop=1&playlist=elu-0ykTXqo&controls=0&showinfo=0&autohide=1&modestbranding=1" 
            style="position: absolute; top: 50%; left: 50%; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; transform: translate(-50%, -50%); border: none;" 
            allow="autoplay; encrypted-media">
          </iframe>
          <!-- रातो रङ्गको ओभरले -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(185, 28, 28, 0.85); z-index: 2;"></div>
      </div>

      <!-- मुख्य सामग्रीहरू -->
      <div style="position: relative; z-index: 3;">
          <!-- शीर्षक खण्ड -->
          <div style="display: flex; align-items: center; margin-bottom: 20px; position: relative;">
              <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
              <h2 style="padding: 0 20px; font-size: 22px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 8px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); text-align: center;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #fff; display: inline-block;"></span>
                  फेसबुक रिलहरू (Reels Only)
              </h2>
              <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
          </div>

          <!-- रिलहरूको ग्रिड लेआउट -->
          <div class="fb-reels-grid-custom" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; box-sizing: border-box;">
              
              <div class="reel-card-item">
                  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2488492351627228%2F&show_text=false&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>

              <div class="reel-card-item">
                  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1536919751455365%2F&show_text=false&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>

              <div class="reel-card-item">
                  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1062815883119978%2F&show_text=false&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>

              <div class="reel-card-item">
                  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1342406334356634%2F&show_text=false&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>

              <div class="reel-card-item">
                  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1419765423480113%2F&show_text=false&width=357&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
              </div>

          </div>
      </div>
  </div>
</div>

<!-- वर्डप्रेसको लागि विशेष रेस्पोन्सिभ CSS -->
<style>
  .reel-card-item {
    background: #000;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    position: relative;
    width: 100%;
    padding-bottom: 177.77%; /* 9:16 रेसियो */
    box-sizing: border-box;
  }
  .reel-card-item iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    overflow: hidden;
  }
  
  /* मोबाइल र ट्याब्लेट रेस्पोन्सिभ व्यवस्था */
  @media (max-width: 900px) {
    .fb-reels-grid-custom {
      grid-template-columns: repeat(2, 1fr) !important; /* ट्याब्लेटमा २ वटा */
    }
  }
  @media (max-width: 550px) {
    .fb-reels-grid-custom {
      grid-template-columns: 1fr !important; /* मोबाइलमा ठ्याक्कै १ वटा मात्र */
    }
  }
</style>
