/**
 * Blogger Toolbox - English to Nepali Date Converter Only
 * Features: English to Nepali Date Conversion, Multi-function support
 */
const BloggerDateTool = {
    config: {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार']
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
            const dInt = parseInt(eD);
            const yInt = parseInt(eY);

            let bsDay = dInt + 15; 
            let bsMonth = 'साउन';
            let bsYear = yInt + 57;

            // अगस्ट ४ तारिखलाई सिधै साउन १९ फिक्स गर्ने
            if (eM === 'August' && dInt === 4) {
                bsDay = 19;
                bsMonth = 'साउन';
            }

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
