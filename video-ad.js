async function showFourVideos(channelId, apiKey, containerId) {
    try {
        // 1. Get the Uploads Playlist ID
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl);
        const channelData = await channelRes.json();
        
        const uploadsId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // 2. Fetch exactly 4 videos
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=4&key=${apiKey}`;
        const playlistRes = await fetch(playlistUrl);
        const playlistData = await playlistRes.json();

        // 3. Build the Grid
        const container = document.getElementById(containerId);
        
        // CSS: 4 columns on desktop, 2 on tablet, 1 on mobile
        let gridHtml = `
            <div style="display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                        gap: 20px; 
                        font-family: Arial, sans-serif;">
        `;

        playlistData.items.forEach(item => {
            const vId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            
            gridHtml += `
                <div style="display: flex; flex-direction: column;">
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                            src="https://www.youtube.com/embed/${vId}" 
                            frameborder="0" allowfullscreen>
                        </iframe>
                    </div>
                    <p style="font-size: 13px; font-weight: bold; margin-top: 8px; line-height: 1.4;">
                        ${title}
                    </p>
                </div>
            `;
        });

        gridHtml += '</div>';
        container.innerHTML = gridHtml;

    } catch (error) {
        console.error("API Error:", error);
        document.getElementById(containerId).innerHTML = "Unable to load videos.";
    }
}
