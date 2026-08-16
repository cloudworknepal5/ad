(function () {
  // १. CSS Styles Injection (अझ सानो आकार)
  const style = document.createElement('style');
  style.innerHTML = `
    .date-widget {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      line-height: 1.2;
    }
    .date-widget .icon {
      width: 12px;
      height: 12px;
      fill: currentColor;
      flex-shrink: 0;
    }
    .date-text {
      display: flex;
      align-items: center;
      gap: 3px;
    }
  `;
  document.head.appendChild(style);

  // २. nepali-date-converter Library dynamically load गर्ने
  const nepaliDateScript = document.createElement('script');
  nepaliDateScript.src = 'https://cdn.jsdelivr.net/npm/nepali-date-converter/dist/nepali-date-converter.umd.js';
  document.head.appendChild(nepaliDateScript);

  nepaliDateScript.onload = function () {
    initNepaliDateWidget();
  };

  function initNepaliDateWidget() {
    const container = document.getElementById('nepali-date-widget');
    if (!container) return;

    // UI Structure
    container.innerHTML = `
      <div class="date-widget">
        <svg class="icon text-red-600 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
        </svg>
        <div id="nd-display-text" class="date-text">लोड हुँदैछ...</div>
      </div>
    `;

    const NepaliDateClass = window.NepaliDate.default || window.NepaliDate;
    const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कात्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत'];
    const nepaliDays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिवार'];

    function toNepaliDigits(number) {
      const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
      return number.toString().padStart(2, '0').replace(/\d/g, digit => nepaliNumbers[digit]);
    }

    function updateDateTime() {
      const now = new Date();
      const todayBS = new NepaliDateClass(now);

      const bsYear = toNepaliDigits(todayBS.getYear());
      const bsMonth = nepaliMonths[todayBS.getMonth()];
      const bsDate = toNepaliDigits(todayBS.getDate());
      const bsDay = nepaliDays[todayBS.getDay()];

      const adYear = now.getFullYear();
      const adMonth = String(now.getMonth() + 1).padStart(2, '0');
      const adDate = String(now.getDate()).padStart(2, '0');
      const adFormat = `${adYear}-${adMonth}-${adDate}`;

      const hours = toNepaliDigits(now.getHours());
      const minutes = toNepaliDigits(now.getMinutes());

      const watchIcon = `<svg class="icon text-red-600 dark:text-red-500" style="margin-left: 2px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>`;

      const output = `${bsYear} ${bsMonth} ${bsDate} गते ${bsDay}, ${adFormat} ${watchIcon} ${hours}ः${minutes}`;

      const displayElem = document.getElementById('nd-display-text');
      if (displayElem) {
        displayElem.innerHTML = output;
      }
    }

    updateDateTime();
    setInterval(updateDateTime, 60000);
  }
})();
