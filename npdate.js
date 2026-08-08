document.addEventListener("DOMContentLoaded", function() {
  let dateElements = document.querySelectorAll('.location-date');

  dateElements.forEach(function(el) {
    let rawText = el.innerText.trim();
    
    // "News Desk | " जस्ता अगाडिका अक्षरहरू हटाएर अङ्ग्रेजी मिति मात्र निकाल्ने
    let match = rawText.match(/([A-Za-z]+,\s*)?[A-Za-z]+\s+\d{1,2},\s*\d{4}|\d{4}-\d{2}-\d{2}/);
    
    if (match) {
      let cleanDateStr = match[0];
      let parsedDate = new Date(cleanDateStr);

      if (!isNaN(parsedDate.getTime())) {
        try {
          let bsDate = new NepaliDate(parsedDate);

          let nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
          let nepaliMonths = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
          let nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

          let toNepDigits = function(num) {
            return num.toString().split('').map(d => nepaliDigits[d] || d).join('');
          };

          let year = toNepDigits(bsDate.getYear());
          let month = nepaliMonths[bsDate.getMonth()];
          let day = toNepDigits(bsDate.getDate());
          let dayOfWeek = nepaliDays[parsedDate.getDay()];

          let icon = el.querySelector('i');
          let iconHTML = icon ? icon.outerHTML + ' ' : '<i class="fa-regular fa-calendar-days"></i> ';

          // नतिजा: शनिवार, २३ साउन २०८३
          el.innerHTML = `${iconHTML}${dayOfWeek}, ${month} ${day}, ${year}`;
        } catch (e) {
          console.error("Date conversion failed:", e);
        }
      }
    }
  });
});
