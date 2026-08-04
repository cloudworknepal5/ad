const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January': { m: 'माघ', offset: 56, start: 15, prevDays: 16 },
            'February': { m: 'फागुन', offset: 56, start: 13, prevDays: 17 },
            'March': { m: 'चैत', offset: 56, start: 15, prevDays: 14 },
            'April': { m: 'वैशाख', offset: 57, start: 14, prevDays: 17 },
            'May': { m: 'जेठ', offset: 57, start: 15, prevDays: 17 },
            'June': { m: 'असार', offset: 57, start: 15, prevDays: 16 },
            'July': { m: 'साउन', offset: 56, start: 17, prevDays: 15 }, // सच्याइएको
            'August': { m: 'भदौ', offset: 57, start: 18, prevDays: 19 }, // सच्याइएको
            'September': { m: 'असोज', offset: 57, start: 17, prevDays: 15 },
            'October': { m: 'कात्तिक', offset: 57, start: 18, prevDays: 14 },
            'November': { m: 'मंसिर', offset: 57, start: 17, prevDays: 14 },
            'December': { m: 'पुस', offset: 57, start: 16, prevDays: 15 }
        }
    },

    // नम्बरलाई नेपालीमा बदल्ने मल्टि-फङ्सन
    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // मिति कन्भर्ट गर्ने मुख्य मल्टि-फङ्सन
    initDateTool: function() {
        const elements = document.querySelectorAll(".location-date");
        elements.forEach(el => {
            const match = el.innerText.trim().match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
            if (!match) return;

            const [_, eM, eD, eY] = match;
            const data = this.config.monthData[eM];
            if (!data) return; 

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
        });
    }
};

// पेज लोड भएपछि मल्टि-फङ्सन रन गर्ने
window.addEventListener('load', () => {
    BloggerDateTool.initDateTool();
});
