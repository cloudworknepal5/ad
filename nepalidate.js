<script type='text/javascript'>
// <![CDATA[
function getNepaliDate(dateString) {
    if (!dateString) return '';
    var d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    var nepaliMonths = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
    var nepaliDigits = ['०','१','२','३','४','५','६','७','८','९'];

    var toNep = function(n) {
        return n.toString().split('').map(function(num) {
            return nepaliDigits[num] || num;
        }).join('');
    };

    // ५६ वर्ष ८ महिना १५ दिनको औसत हिसाब
    var year = d.getFullYear() + 56;
    var month = d.getMonth() + 9;
    var day = d.getDate() + 15;

    if (day > 30) { day -= 30; month++; }
    if (month > 12) { month -= 12; year++; }

    return toNep(day) + " " + nepaliMonths[month-1] + " " + toNep(year);
}
// ]]>
</script>