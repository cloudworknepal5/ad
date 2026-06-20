/**
 * Blogger Toolbox v14.5 - Clean Multi-Function Edition
 * Features: 
 * 1. English to Nepali Date Converter
 * 2. Firebase View Counter (Every Hit Edition - Optimized for IDs and Classes)
 */
const BloggerToolbox = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January': { m: 'माघ', offset: 56, start: 15, prevDays: 16 },
            'February': { m: 'फागुन', offset: 56, start: 13, prevDays: 17 },
            'March': { m: 'चैत', offset: 56, start: 15, prevDays: 14 },
            'April': { m: 'वैशाख', offset: 57, start: 14, prevDays: 17 },
            'May': { m: 'जेठ', offset: 57, start: 15, prevDays: 17 },
            'June': { m: 'असार', offset: 57, start: 15, prevDays: 16 },
            'July': { m: 'साउन', offset: 57, start: 17, prevDays: 16 },
            'August': { m: 'भदौ', offset: 57, start: 17, prevDays: 16 },
            'September': { m: 'असोज', offset: 57, start: 17, prevDays: 15 },
            'October': { m: 'कात्तिक', offset: 57, start: 18, prevDays: 14 },
            'November': { m: 'मंसिर', offset: 57, start: 17, prevDays: 14 },
            'December': { m: 'पुस', offset: 57, start: 16, prevDays: 15 }
        }
    },

    // नम्बरलाई नेपालीमा बदल्ने साझा फङ्सन
    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // फङ्सन १: भ्यु काउन्टर अपडेट गर्ने (Every Hit र Post ID लजिक सहित)
    initCounter: async function() {
        // ID (#visitor-count) वा Class (.visitor-count) दुवै सर्च गर्ने
        const el = document.getElementById("visitor-count") || document.querySelector(".visitor-count");
        if (!el) return;

        // बडी क्लासबाट पोष्ट आईडी लिने, नभए "home" राख्ने
        const bodyMatch = document.body.className.match(/postid-(\d+)/);
        const pId = bodyMatch ? "post_" + bodyMatch[1] : "home";
        
        try {
            const url = `${this.config.databaseURL}/views/${pId}.json`;
            
            // १. पहिलेको भ्युज तान्ने
            let res = await fetch(url);
            let count = await res.json() || 0;

            // २. प्रत्येक हिटमा बिना कुनै रोकावट १ अंक बढाउने (Session हटाइएको)
            count++;
            
            // ३. नयाँ काउन्ट डाटाबेसमा सेभ गर्ने
            await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
            
            // ४. आइकन र नम्बर नेपालीमा देखाउने
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:6px;fill:currentColor;vertical-align:middle;" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            el.innerHTML = `${eyeIcon}<span style="font-weight:bold; vertical-align:middle;">${this.toNep(count)}</span>`;
        } catch (e) { 
            console.warn("Counter error"); 
        }
    },

    // फङ्सन २: मिति कन्भर्ट गर्ने
    initDateTool: function() {
        const el = document.querySelector(".location-date");
        if (!el) return;

        const match = el.innerText.trim().match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
        if (match) {
            const [_, eM, eD, eY] = match;
            const data = this.config.monthData[eM];
            if (!data) return; // सुरक्षित रहन महिना म्याच नभए रोकिने

            const dInt = parseInt(eD);
            const yInt = parseInt(eY);

            let bsDay, bsMonth = data.m;
            if (dInt >= data.start) {
                bsDay = (dInt - data.start) + 1;
            } else {
                const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
                let idx = months.indexOf(data.m);
                bsMonth = idx === 0 ? months[11] : months[idx - 1];
                bsDay = data.prevDays + dInt;
            }
            const bsYear = (eM === 'April' && dInt < 14) ? yInt + 56 : yInt + data.offset;
            const dayName = this.config.weekdays[new Date(`${eM} ${eD}, ${eY}`).getDay()];
            
            el.innerText = `${dayName}, ${bsMonth} ${this.toNep(bsDay)}, ${this.toNep(bsYear)}`;
        }
    },

    // मुख्य इनिसियलाइजर (दुवै फङ्सन कल गर्ने)
    init: function() {
        this.initCounter();
        this.initDateTool();
    }
};

// पेज लोड पूरा भएपछि मात्र एउटा Listener बाट सबै फङ्सन रन गर्ने
window.addEventListener('load', () => BloggerToolbox.init());
