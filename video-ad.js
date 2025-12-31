async function embedLatestFromChannel(channelId, apiKey, containerId) {
    try {
        // Step 1: Get Channel Details (Title & Uploads Playlist ID)
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet,statistics&id=${channelId}&key=${apiKey}`;
        const channelRes = await fetch(channelUrl);
        const channelData = await channelRes.json();

        if (!channelData.items) return;

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        const channelTitle = channelData.items[0].snippet.title;

        // Step 2: Get the latest video from that playlist
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`;
        const playlistRes = await fetch(playlistUrl);
        const playlistData = await playlistRes.json();

        const latestVideoId = playlistData.items[0].snippet.resourceId.videoId;

        // Step 3: Inject the HTML
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="margin-bottom:10px; font-family: sans-serif;">
                <strong>Latest from ${channelTitle}</strong>
            </div>
            <iframe width="100%" height="360" 
                src="https://www.youtube.com/embed/${latestVideoId}" 
                frameborder="0" allowfullscreen>
            </iframe>
        `;
    } catch (error) {
        console.error("YouTube API Error:", error);
    }
}