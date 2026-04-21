/**
 * Neelamb Universal Gallery Engine v8.0 (Secure Server-Side Auth)
 */

class NeelambGallery {
    constructor(config) {
        this.containerId = config.containerId;
        this.folderId = config.folderId;
        this.title = config.title || "Gallery";
        this.allowUpload = config.allowUpload || false;
        // Password is not stored here; it is verified on the server side
        this.scriptUrl = "https://script.google.com/macros/s/AKfycbxo0-FMXFgkRmItxN9ofTi1QT1lnA_d2CJhwB7s_4uF2EaCFSEVJcRv4wz-8klQHLsq/exec";
        
        this.allFiles = [];
        this.filteredFiles = [];
        this.displayedCount = 0;
        this.batchSize = 9;

        this.injectCSS();
        this.initStructure();
        this.fetchData();
        
        if (!window.neelambInstances) window.neelambInstances = [];
        window.neelambInstances.push(this);
    }

    injectCSS() {
        if (document.getElementById('nb-style')) return;
        const style = document.createElement('style');
        style.id = 'nb-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap');
            .nb-wrapper { max-width: 1400px; margin: 25px auto; font-family: 'Segoe UI', sans-serif; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 8px; }
            .nb-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #e60000; margin-bottom: 20px; padding-bottom: 10px; }
            .nb-header span { font-size: 24px; font-weight: bold; }
            .nb-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; grid-auto-rows: minmax(240px, auto); grid-gap: 15px; }
            .nb-grid .nb-card:first-child { grid-row: span 2; }
            .nb-card { position: relative; border: 1px solid #444; overflow: hidden; height: 100%; transition: 0.3s; background: #000; }
            .nb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.9; }
            .nb-name { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: #fff; padding: 10px; text-align: center; font-size: 14px; }
            .nb-download-link { position: absolute; top: 10px; right: 10px; background: #e60000; color: #fff; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; border: 2px solid #fff; text-decoration: none; }
            .nb-up-btn { background: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
            .nb-modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); align-items: center; justify-content: center; }
            .nb-modal-content { background: #fff; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; text-align: center; color: #333; }
            .nb-modal-content h3 { margin-top: 0; }
            .nb-modal-content input { padding: 12px; margin: 10px 0; width: 100%; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
            .nb-load-btn { display: block; margin: 30px auto; padding: 12px 40px; background: #28a745; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
            @media (max-width: 900px) { .nb-grid { grid-template-columns: 1fr 1fr; } .nb-grid .nb-card:first-child { grid-column: span 2; } }
        `;
        document.head.appendChild(style);
    }

    initStructure() {
        const root = document.getElementById(this.containerId);
        if (!root) return;
        root.innerHTML = `
            <div class="nb-wrapper">
                <div class="nb-header">
                    <span>${this.title}</span>
                    ${this.allowUpload ? `<button class="nb-up-btn" id="open-mod-${this.containerId}">+ Upload</button>` : ''}
                </div>
                <div class="nb-area"></div>
                <div class="nb-status" style="text-align:center; padding:40px;">Loading assets...</div>
                <button class="nb-load-btn" style="display:none;">Load More</button>
            </div>
            <div id="modal-${this.containerId}" class="nb-modal">
                <div class="nb-modal-content">
                    <h3>${this.title}</h3>
                    <p style="font-size: 14px; color: #666;">Select a file and enter the security password.</p>
                    <input type="file" id="input-${this.containerId}" accept="image/*,application/pdf">
                    <input type="password" id="pass-${this.containerId}" placeholder="Enter Security Password">
                    <button class="nb-up-btn" id="btn-up-${this.containerId}" style="width:100%;">Start Upload</button>
                    <button id="close-mod-${this.containerId}" style="border:none; background:none; color:red; margin-top:15px; cursor:pointer; font-weight: bold;">Cancel</button>
                    <div id="stat-${this.containerId}" style="margin-top:10px; font-weight:bold;"></div>
                </div>
            </div>
        `;

        root.querySelector('.nb-load-btn').onclick = () => this.renderBatch();
        if(this.allowUpload) {
            root.querySelector(`#open-mod-${this.containerId}`).onclick = () => document.getElementById(`modal-${this.containerId}`).style.display='flex';
            root.querySelector(`#close-mod-${this.containerId}`).onclick = () => document.getElementById(`modal-${this.containerId}`).style.display='none';
            root.querySelector(`#btn-up-${this.containerId}`).onclick = () => this.handleUpload();
        }
    }

    async fetchData() {
        try {
            const res = await fetch(`${this.scriptUrl}?id=${this.folderId}&t=${new Date().getTime()}`);
            const data = await res.json();
            this.allFiles = data.sort((a,b) => new Date(b.date) - new Date(a.date));
            this.filteredFiles = [...this.allFiles];
            document.getElementById(this.containerId).querySelector('.nb-status').style.display = 'none';
            this.renderBatch(true);
        } catch(e) { 
            console.error("Load Error"); 
            document.getElementById(this.containerId).querySelector('.nb-status').innerText = "Failed to load gallery data.";
        }
    }

    renderBatch(isFirst = false) {
        const root = document.getElementById(this.containerId);
        const area = root.querySelector('.nb-area');
        if (isFirst) { area.innerHTML = ''; this.displayedCount = 0; }
        const next = this.filteredFiles.slice(this.displayedCount, this.displayedCount + this.batchSize);
        if (next.length > 0) {
            const group = document.createElement('div');
            group.className = 'nb-grid';
            group.innerHTML = next.map(f => `
                <div class="nb-card">
                    <a href="https://drive.google.com/uc?export=download&id=${f.id}" class="nb-download-link" title="Download">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </a>
                    <a href="${f.url}" target="_blank">
                        <div class="nb-thumb">
                            <img src="https://drive.google.com/thumbnail?id=${f.id}&sz=w800" loading="lazy">
                            <div class="nb-name">${f.name}</div>
                        </div>
                    </a>
                </div>`).join('');
            area.appendChild(group);
        }
        this.displayedCount += next.length;
        root.querySelector('.nb-load-btn').style.display = (this.displayedCount < this.filteredFiles.length) ? 'block' : 'none';
    }

    async handleUpload() {
        const btn = document.getElementById(`btn-up-${this.containerId}`);
        const stat = document.getElementById(`stat-${this.containerId}`);
        const inp = document.getElementById(`input-${this.containerId}`);
        const passInp = document.getElementById(`pass-${this.containerId}`);

        if(!inp.files[0]) return alert("Please select a file first!");
        if(!passInp.value) return alert("Please enter the security password!");

        btn.disabled = true;
        stat.style.color = "black";
        stat.innerText = "Authenticating and uploading...";

        const file = inp.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];
            try {
                const res = await fetch(this.scriptUrl, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        fileName: file.name, 
                        mimeType: file.type, 
                        base64: base64, 
                        folderId: this.folderId,
                        password: passInp.value 
                    })
                });
                const out = await res.json();
                if(out.result === "success") { 
                    stat.style.color = "green";
                    stat.innerText = "Upload successful! Refreshing page..."; 
                    setTimeout(() => location.reload(), 1500); 
                } else {
                    stat.style.color = "red";
                    stat.innerText = "Incorrect password! Upload cancelled.";
                    btn.disabled = false;
                }
            } catch(err) { 
                stat.innerText = "Server communication error!"; 
                btn.disabled = false; 
            }
        };
        reader.readAsDataURL(file);
    }

    applyGlobalSearch(q) {
        this.filteredFiles = this.allFiles.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
        this.renderBatch(true);
    }
}