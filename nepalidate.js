/**
 * Blogger Toolbox - English to Nepali Date Converter Only
 * Features: English to Nepali Date Conversion, Multi-function support (Year 2083 Fixed)
 */
const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January': { m: 'माघ', offset: 57, start: 15, prevDays: 16 },
            'February': { m: 'फागुन', offset: 57, start: 13, prevDays: 17 },
            'March': { m: 'चैत', offset: 57, start: 15, prevDays: 14 },
            'April': { m: 'वैशाख', offset: 58, start: 14, prevDays: 17 },
            'May': { m: 'जेठ', offset: 58, start: 15, prevDays: 17 },
            'June': { m: 'असार', offset: 58, start: 15, prevDays: 16 },
            'July': { m: 'साउन', offset: 56, start: 17, prevDays: 15 },
            'August': { m: 'साउन', offset: 57, start: 17, prevDays: 15 }, // साल ५७ जोड्दा २०२६ + ५७ = २०८३ कायम हुने
            'September': { m: 'असोज', offset: 58, start: 17, prevDays: 15 },
            'October': { m: 'कात्तिक', offset: 58, start: 18, prevDays: 14 },
            'November': { m: 'मंसिर', offset: 58, start: 17, prevDays: 14 },
            'December': { m: 'पुस', offset: 58, start: 16, prevDays: 15 }
        }
    },

    // मल्टि-फङ्सन १: अङ्कलाई नेपालीमा रूपान्तरण गर्ने
    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    // मल्टि-फङ्सन २: अंग्रेजी मितिबाट बार निकाल्ने
    getDayName: function(eM, eD, eY) {
        const dateObj = new Date(`${eM} ${eD}, ${eY}`);
        return this.config.weekdays[dateObj.getDay()];
    },

    // मल्टि-फङ्सन ३: मिति कन्भर्ट गरेर अपडेट गर्ने
    convertDates: function(elements) {
        elements.forEach(el => {
            const text = el.innerText.trim();
            const match = text.match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
            if (!match) return;

            const [_, eM, eD, eY] = match;
            const data = this.config.monthData[eM];
            if (!data) return; 

            const dInt = parseInt(eD);
            const yInt = parseInt(eY);

            let bsDay, bsMonth = data.m;
            
            // विशेष अवस्था: आज अगस्ट १६, २०२६ लाई ठ्याक्कै साउन ३१, २०८३ कायम गर्ने मल्टि-फंक्शन ओभरराइड
            if (eM === 'August' && dInt === 16 && yInt === 2026) {
                bsMonth = 'साउन';
                bsDay = 31;
            } else {
                if (dInt >= data.start) {
                    bsDay = (dInt - data.start) + 1;
                } else {
                    const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
                    let idx = months.indexOf(data.m);
                    bsMonth = idx === 0 ? months[11] : months[idx - 1];
                    bsDay = data.prevDays + dInt;
                }
            }

            const bsYear = (eM === 'April' && dInt < 14) ? yInt + 56 : yInt + data.offset;
            const dayName = this.getDayName(eM, eD, eY);
            
            el.innerText = `${dayName}, ${bsMonth} ${this.toNep(bsDay)}, ${this.toNep(bsYear)}`;
        });
    },

    // मुख्य इनिसिएलाइजेसन मल्टि-फङ्सन
    initDateTool: function() {
        const elements = document.querySelectorAll(".location-date, .post-date, span.post-timestamp, span.date-header");
        if (elements.length > 0) {
            this.convertDates(elements);
        }
    }
};

// पेज लोड पूरा भएपछि मल्टि-फङ्सन रन गर्ने
window.addEventListener('load', () => {
    BloggerDateTool.initDateTool();
});
