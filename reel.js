<div class="dnn-reel-section" style="font-family: 'Mukta', sans-serif; max-width: 1200px; margin: 0 auto; padding: 10px; position: relative; overflow: hidden; border-radius: 15px;">
    
    <!-- ब्याकग्राउन्ड युट्युब भिडियो र रातो ओभरले (Background YouTube Video & Red Overlay) -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; overflow: hidden; pointer-events: none;">
        <!-- युट्युब ब्याकग्राउन्ड भिडियो -->
        <iframe src="https://www.youtube.com/embed/elu-0ykTXqo?autoplay=1&mute=1&loop=1&playlist=elu-0ykTXqo&controls=0&showinfo=0&autohide=1&modestbranding=1" 
          style="position: absolute; top: 50%; left: 50%; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; transform: translate(-50%, -50%); border: none;" 
          allow="autoplay; encrypted-media">
        </iframe>
        <!-- रातो रङ्गको ओभरले (Red Overlay Layer) -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(185, 28, 28, 0.75); z-index: 2;"></div>
    </div>

    <!-- मुख्य सामग्रीहरू (Headings, Reels) जुन ओभरलेको माथि देखिनेछन् -->
    <div style="position: relative; z-index: 3;">
        <!-- शीर्षक खण्ड -->
        <div style="display: flex; align-items: center; margin-bottom: 20px; position: relative;">
            <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
            <h2 style="padding: 0 20px; font-size: 24px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 8px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #fff; display: inline-block;"></span>
                फेसबुक रिलहरू (Reels Only)
            </h2>
            <div style="flex-grow: 2; border-top: 2px solid rgba(255, 255, 255, 0.8);"></div>
        </div>

        <!-- रिलहरूको ग्रिड लेआउट (डेस्कटपमा ५ वटा कोलम हुने गरी सेट गरिएको) -->
        <div id="fb-reels-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
            
            <!-- रिल १ -->
            <div class="reel-card">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2488492351627228%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल २ -->
            <div class="reel-card">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1536919751455365%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ३ -->
            <div class="reel-card">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1062815883119978%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ४ -->
            <div class="reel-card">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1342406334356634%2F&show_text=true&width=267&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

            <!-- रिल ५ -->
            <div class="reel-card">
                <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1419765423480113%2F&show_text=true&width=357&t=0" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
            </div>

        </div>
    </div>
</div>

<!-- रेस्पोन्सिभिटी र रिल साइजको लागि CSS -->
<style>
  .reel-card {
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    position: relative;
    width: 100%;
    /* 9:16 ठाडो रिल साइज रेसियो */
    padding-bottom: 177.77%; 
  }
  .reel-card iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    overflow: hidden;
  }
  
  /* मोबाइल भ्युमा ठीक एउटा मात्र कोलम (Single Column) देखिने व्यवस्था */
  @media (max-width: 768px) {
    #fb-reels-grid {
      grid-template-columns: 1fr !important;
      gap: 15px;
    }
  }
</style>
