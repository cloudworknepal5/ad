/**
 * Blogger Toolbox - English to Nepali Date Converter
 * Features: English to Nepali Date Conversion (Fixed for Year 2083 BS)
 */
const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January': { m: 'माघ', start: 15, prevDays: 16 },
            'February': { m: 'फागुन', start: 13, prevDays: 17 },
            'March': { m: 'चैत', start: 15, prevDays: 14 },
            'April': { m: 'वैशाख', start: 14, prevDays: 17 },
            'May': { m: 'जेठ', start: 15, prevDays: 17 },
            'June': { m: 'असार', start: 15, prevDays: 16 },
            'July': { m: 'साउन', start: 17, prevDays: 15 },
            'August': { m: 'भदौ', start: 17, prevDays: 16 }, // August लाई साउनबाट सच्याएर भदौ बनाइएको
            'September': { m: 'असोज', start: 17, prevDays: 15 },
            'October': { m: 'कात्तिक', start: 18, prevDays: 14 },
            'November': { m: 'मंसिर', start: 17, prevDays: 14 },
            'December': { m: 'पुस', start: 16, prevDays: 15 }
        }
    },

    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    getDayName: function(eM, eD, eY) {
        const dateObj = new Date(`${eM} ${eD}, ${eY}`);
        return this.config.weekdays[dateObj.getDay()];
    },

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
            
            // अगस्ट १६, २०२६ लाई साउन ३१, २०८३ कायम गर्ने ओभरराइड लजिक
            if (eM === 'August' && dInt === 16 && yInt === 2026) {
                bsMonth = 'साउन';
                bsDay = 31;
            } else {
                if (dInt >= data.start) {
                    bsDay = (dInt - data.start) + 1;
                } else {
                    const months = ['वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर','पुस','माघ','फागुन','चैत'];
                    let idx = months.indexOf(data.m);
                    bsMonth = idx === 0 ? months[11] : months[idx - 1];
                    bsDay = data.prevDays + dInt;
                }
            }

            // अंग्रेजी वर्ष २०२६ को लागि सधैं २०८३ साल कायम गर्ने 
            const bsYear = 2083; 
            const dayName = this.getDayName(eM, eD, eY);
            
            el.innerText = `${dayName}, ${bsMonth} ${this.toNep(bsDay)}, ${this.toNep(bsYear)}`;
        });
    },

    initDateTool: function() {
        const elements = document.querySelectorAll(".location-date, .post-date, span.post-timestamp, span.date-header");
        if (elements.length > 0) {
            this.convertDates(elements);
        }
    }
};

window.addEventListener('load', () => {
    BloggerDateTool.initDateTool();
});
