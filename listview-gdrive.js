/**
 * Neelamb Universal Gallery Engine v8.1 (List View Mode)
 */

class NeelambGallery {
    constructor(config) {
        this.containerId = config.containerId;
        this.folderId = config.folderId;
        this.title = config.title || "Gallery";
        this.allowUpload = config.allowUpload || false;
        this.scriptUrl = config.scriptUrl || "";
        
        this.allFiles = [];
        this.filteredFiles = [];
        this.displayedCount = 0;
        this.batchSize = 20;

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
            @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');
            .nb-wrapper { max-width: 1200px; margin: 25px auto; font-family: 'Segoe UI', sans-serif; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .nb-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #e60000; margin-bottom: 20px; padding-bottom: 10px; }
            .nb-header span { font-size: 22px; font-weight: bold; color: #333; }
            
            /* List View Table Styles */
            .nb-table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; }
            .nb-table th { background: #f8f9fa; color: #333; padding: 12px 15px; font-weight: 600; border-bottom: 2px solid #ddd; }
            .nb-table td { padding: 12px 15px; border-bottom: 1px solid #eee; color: #444; font-size: 14px; }
            .nb-table tr:hover { background: #fdfdfd; }
            .nb-table a { color: #007bff; text-decoration: none; font-weight: 500; }
            .nb-table a:hover { text-decoration: underline; }
            
            .nb-ext-badge { background: #e9ecef; color: #495057; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            
            .nb-up-btn { background: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
            .nb-modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); align-items: center; justify-content: center; }
            .nb-modal-content { background: #fff; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; text-align: center; color: #333; }
            .nb-modal-content h3 { margin-top: 0; }
            .nb-modal-content input { padding: 12px; margin: 10px 0; width: 100%; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
            .nb-load-btn { display: block; margin: 25px auto; padding: 10px 30px; background: #28a745; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
            @media (max-width: 768px) { .nb-table th, .nb-table td { padding: 8px 10px; font-size: 13px; } }
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
                <div class="nb-status" style="text-align:center; padding:30px; color:#666;">Loading files...</div>
                <button class="nb-load-btn" style="display:none;">Load More</button>
            </div>
            <div id="modal-${this.containerId}" class="nb-modal">
                <div class="nb-modal-content">
                    <h3>${this.title}</h3>
                    <p style="font-size: 14px; color: #666;">Select a file to upload.</p>
                    <input type="file" id="input-${this.containerId}">
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
            const res = await fetch(`${this.scriptUrl}?id=${this.folderId}&pass=${encodeURIComponent(window.galleryPassword || '')}&t=${new Date().getTime()}`);
            const data = await res.json();
            
            if (data.error) {
                document.getElementById(this.containerId).querySelector('.nb-status').innerText = data.error;
                return;
            }

            this.allFiles = data.sort((a,b) => new Date(b.date) - new Date(a.date));
            this.filteredFiles = [...this.allFiles];
            document.getElementById(this.containerId).querySelector('.nb-status').style.display = 'none';
            this.renderBatch(true);
        } catch(e) { 
            console.error("Load Error", e); 
            document.getElementById(this.containerId).querySelector('.nb-status').innerText = "Failed to load gallery data.";
        }
    }

    renderBatch(isFirst = false) {
        const root = document.getElementById(this.containerId);
        const area = root.querySelector('.nb-area');
        if (isFirst) { area.innerHTML = ''; this.displayedCount = 0; }
        
        const next = this.filteredFiles.slice(this.displayedCount, this.displayedCount + this.batchSize);
        
        if (this.displayedCount === 0 && next.length === 0) {
            area.innerHTML = '<p style="text-align:center; color:#777; padding:20px;">No files found in this folder.</p>';
            root.querySelector('.nb-load-btn').style.display = 'none';
            return;
        }

        if (next.length > 0) {
            let tableContainer = area.querySelector('.nb-table');
            if (!tableContainer) {
                tableContainer = document.createElement('table');
                tableContainer.className = 'nb-table';
                tableContainer.innerHTML = `
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Extension</th>
                            <th>Size</th>
                            <th>Date</th>
                            <th style="text-align:right;">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                area.appendChild(tableContainer);
            }
            
            const tbody = tableContainer.querySelector('tbody');
            const rowsHTML = next.map(f => {
                const parts = f.name.split('.');
                const ext = parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
                const formattedSize = f.size ? this.formatBytes(f.size) : 'N/A';
                
                return `
                    <tr>
                        <td><a href="${f.url}" target="_blank" title="${f.name}">${f.name}</a></td>
                        <td><span class="nb-ext-badge">${ext}</span></td>
                        <td>${formattedSize}</td>
                        <td>${new Date(f.date).toLocaleDateString()}</td>
                        <td style="text-align:right;">
                            <a href="https://drive.google.com/uc?export=download&id=${f.id}" style="background:#e60000; color:#fff; padding:5px 12px; border-radius:4px; font-size:12px;">Download</a>
                        </td>
                    </tr>
                `;
            }).join('');
            
            tbody.insertAdjacentHTML('beforeend', rowsHTML);
        }
        
        this.displayedCount += next.length;
        root.querySelector('.nb-load-btn').style.display = (this.displayedCount < this.filteredFiles.length) ? 'block' : 'none';
    }

    formatBytes(bytes, decimals = 2) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
                    stat.innerText = "Upload successful! Refreshing..."; 
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
