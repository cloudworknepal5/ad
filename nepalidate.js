/**
 * Blogger Toolbox - English to Nepali Date Converter
 * Fixes: Accurate AD to BS Mapping for Year 2083 and beyond
 */
const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        // २०२६ AD (२०८२-२०८३ BS) को लागि सही महिना सुरु हुने AD मिति (Start Day) र BS महिना
        adToBs2026: [
            { monthName: 'माघ', startAD: new Date('2026-01-15'), bsYear: 2082 },
            { monthName: 'फागुन', startAD: new Date('2026-02-13'), bsYear: 2082 },
            { monthName: 'चैत', startAD: new Date('2026-03-15'), bsYear: 2082 },
            { monthName: 'वैशाख', startAD: new Date('2026-04-14'), bsYear: 2083 },
            { monthName: 'जेठ', startAD: new Date('2026-05-15'), bsYear: 2083 },
            { monthName: 'असार', startAD: new Date('2026-06-15'), bsYear: 2083 },
            { monthName: 'साउन', startAD: new Date('2026-07-17'), bsYear: 2083 },
            { monthName: 'भदौ', startAD: new Date('2026-08-18'), bsYear: 2083 },
            { monthName: 'असोज', startAD: new Date('2026-09-18'), bsYear: 2083 },
            { monthName: 'कात्तिक', startAD: new Date('2026-10-18'), bsYear: 2083 },
            { monthName: 'मंसिर', startAD: new Date('2026-11-17'), bsYear: 2083 },
            { monthName: 'पुस', startAD: new Date('2026-12-16'), bsYear: 2083 }
        ]
    },

    toNep: function(n) {
        if (n === undefined || n === null) return '';
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    getDayName: function(dateObj) {
        return this.config.weekdays[dateObj.getDay()];
    },

    convertDates: function(elements) {
        elements.forEach(el => {
            const text = el.innerText.trim();
            const dateObj = new Date(text);

            if (isNaN(dateObj.getTime())) return; // invalid date skip गर्ने

            // २०२६ को लागि सही BS Date पत्ता लगाउने logic
            let matchedMonth = null;
            let nextStartAD = null;

            for (let i = 0; i < this.config.adToBs2026.length; i++) {
                const current = this.config.adToBs2026[i];
                const next = this.config.adToBs2026[i + 1];

                if (dateObj >= current.startAD && (!next || dateObj < next.startAD)) {
                    matchedMonth = current;
                    break;
                }
            }

            if (matchedMonth) {
                // दिनको हिसाब (Difference in days)
                const diffTime = Math.abs(dateObj - matchedMonth.startAD);
                const bsDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                const bsYear = matchedMonth.bsYear;
                const dayName = this.getDayName(dateObj);

                el.innerText = `${dayName}, ${matchedMonth.monthName} ${this.toNep(bsDay)}, ${this.toNep(bsYear)}`;
            }
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
