async function showVideoGrid(channelId, apiKey, containerId) {
    try {
        // Step 1: Get the 'Uploads' Playlist ID for the channel
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl);
        const channelData = await channelRes.json();
        
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Step 2: Get the latest 9 videos from that playlist
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=4&key=${apiKey}`;
        const playlistRes = await fetch(playlistUrl);
        const playlistData = await playlistRes.json();

        // Step 3: Build the Grid HTML
        const container = document.getElementById(containerId);
        let gridHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 15px;">';

        playlistData.items.forEach(item => {
            const vId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            
            gridHtml += `
                <div style="background: #f9f9f9; padding: 10px; border-radius: 8px;">
                    <iframe width="100%" height="250" 
                        src="https://www.youtube.com/embed/${vId}" 
                        frameborder="0" allowfullscreen>
                    </iframe>
                    <p style="font-size: 14px; font-family: sans-serif; height: 40px; overflow: hidden;">
                        ${title}
                    </p>
                </div>
            `;
        });

        gridHtml += '</div>';
        container.innerHTML = gridHtml;

    } catch (error) {
        console.error("Error loading video grid:", error);
        document.getElementById(containerId).innerHTML = "Failed to load videos.";
    }
}


