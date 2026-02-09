// if we are executing as a Notepad++ NppScripting plugin
if ( typeof(Editor) != "undefined" ){
  var kantipur = Editor.addMenu("Kantipur");
  var kantipurMenu = {
    text: "Kantipur - Unicode\t(Ctrl+Shift+C)",
    cmd: convertKantipur,
    ctrl:true,
    shift:true,
    alt:false,
    key:"c"
  };
  Editor.addSystemHotKey(kantipurMenu);
  kantipurMenu["menuItem"] = kantipur.addItem(kantipurMenu);

  function convertKantipur(){
    if (Editor.currentView.selection.length > 0){
      Editor.currentView.selection = kantipurConfigToUnicode( Editor.currentView.selection );
    }
  }
}

function kantipurConfigToUnicode( kantipurConfig )
{
  var langSections = [];
  var found = kantipurConfig.search( /(\*[en]\*)/ );
  while( found >= 0 ){
    langSections.push( kantipurConfig.substring(0, found) );
    langSections.push( kantipurConfig.substring(found, found + 3) );
    
    kantipurConfig = kantipurConfig.substring( found + 3 );
    found = kantipurConfig.search( /(\*[en]\*)/ );
  }
  langSections.push( kantipurConfig );

  var translatedSections = [];
  var sectionIsNepali = true;
  for ( var i = 0; i < langSections.length; i++ ) {
    var section = langSections[i];
    if ( section == "*n*" ) {
      sectionIsNepali = true;
      continue;
    }
    if ( section == "*e*" ) {
      sectionIsNepali = false;
      continue;
    }
    // this must be a text section
    if ( sectionIsNepali ) {
      section = kantipurToUnicode(section);
    }
    translatedSections.push( section );
  }
  var unicode = translatedSections.join("");
  return unicode;
}

function kantipurToUnicode( kantipur )
{
  var replacements = [
    {from:";{f", to: ";f{"},
    {from:"d{L", to: "dL{"},
    {from:"y{L", to: "yL{"},
    {from:"d{f", to: "df{"},
    {from:"n{f", to: "nf{"},
    {from:"s{f", to: "sf{"},
    {from:"o{f", to: "of{"},
    {from:"5G", to: "5g"},
    {from:"lyOG", to: "lyOg"},
    {from:"T?", to: "lq"},
    {from:"5}gG", to: "5}gg"},
    {from:"gG", to: "gg"},
    {from:"w{f", to: "wf{"},
    {from:"x'G", to: "x'g"},
{from:"x'g5", to: "x'G5"},
{from:"t{L", to: "tL{"},
{from:"b{f", to: "bf{"},
{from:"ljB'T", to: "ljB't"},
{from:"jif{f", to: "jiff{"},
{from:"?{", to: "¥"},
{from:"ofT?", to: "ofq'"},
{from:"…", to: "‘"},
{from:"…", to: "‘"},
{from:"h{f", to: "hf{"},
{from:";'lt{", to: ";'tL{"},
{from:";{L", to: ";L{"},
{from:"F", to: "“"},
{from:"…", to: "æ"},
{from:"é", to: "Æ"},
{from:"Ý", to: "¶"},
{from:";'?", to: "z'?"},
{from:";'¿", to: "z'?"},
{from:"z'¿", to: "z'?"},
{from:"ljlxg", to: "ljxLg"},
{from:"lalxg", to: "ljxLg"},
{from:"laxLg", to: "ljxLg"},
{from:"k'¿if", to: "k'?if"},
{from:"gSzf", to: "gS;f"},
{from:";fj{hgLs", to: ";fj{hlgs"},
{from:"s]lGb|o", to: "s]Gb|Lo"},
{from:"s]Gb|Lt", to: "s]lGb|t"},
{from:";x/L", to: "zx/L"},
{from:";x/", to: "zx/"},
{from:"ljwfno", to: "ljBfno"},
{from:"lawfno", to: "ljBfno"},
{from:"jLwfno", to: "ljBfno"},
{from:"laBfno", to: "ljBfno"},
{from:"lj/u+h", to: "jL/u+h"},
{from:"la/u+h", to: "jL/u+h"},
{from:"aL/u+h", to: "jL/u+h"},
{from:"aL/uGh", to: "jL/u+h"},
{from:"lj/uGh", to: "jL/u+h"},
{from:"jL/uGh", to: "jL/u+h"},
{from:"kl/IFf", to: "k/LIff"},
{from:"t[lto", to: "t[tLo"},
{from:"lålto", to: "låtLo"},
{from:"l4lto", to: "låtLo"},
{from:"l4tLo", to: "låtLo"},
{from:"nfvf}“", to: "nfvf}+"},
{from:"sf7df8f}“", to: "sf7df8f}+"},
{from:"km{", to: "k{m"},
{from:"6{L", to: "6L{"},
{from:"4Gb", to: "åGå"},
{from:"t{f", to: "tf{"},
{from:"n{L", to: "nL{"},
{from:"ˆ", to: "km"},
{from:"sf“u|];", to: "sfªu|];"},
{from:"af/", to: "jf/"},
{from:"s{L", to: "sL{"},
{from:"if{L", to: "ifL{"},
{from:"e{f", to: "ef{"},
{from:"s{f", to: "sf{"},
{from:"w{f", to: "wf{"},
{from:"b{f", to: "bf{"},
{from:"l;“rfO", to: "l;+rfO"},
{from:"r{f", to: "rf{"},
{from:"sf7df8f}}“", to: "sf7df8f}+"},
{from:"sf7df8f}", to: "sf7df8f}+"},
{from:"lgMz'Ns", to: "lgZz'Ns"},
{from:"j{f", to: "jf{"},
{from:"g{f", to: "gf{"},
{from:"h{f", to: "hf{"},
{from:"xf]nfG", to: "xf]nfg"},
{from:";f]Rg':", to: ";f]Rg';"},
{from:"s[ifL:", to: "s[lif;"},
{from:":yflgo", to: ":yfgLo"},
{from:"u|fld0f", to: "u|fdL0f"},
{from:"sld{", to: "sdL{"},
{from:"6f]ln", to: "6f]nL"},
{from:"p4]Zo", to: "p2]Zo"},
{from:"ljwfno", to: "ljBfno"},
{from:"lawfno", to: "ljBfno"},
{from:"ca?4", to: "cj?4"},
{from:";ldtL", to: ";ldlt"},
{from:"r'gf}lt", to: "r'gf}tL"},
{from:"pknAwL", to: "pknlAw"},
{from:";DalGw", to: ";DaGwL"},
{from:";t{", to: "zt{"},
{from:"lslt{", to: "sLlt{"},
{from:"lstL{", to: "sLlt{"},
{from:"pkl:ytL", to: "pkl:ylt"},
{from:"km{L", to: "kmL{"},
{from:"k{L", to: "kL{"},
{from:"a|flhn", to: "a|fhLn"},
{from:"6{f", to: "6f{"},
{from:"‹", to: "ª3"},
{from:";lx", to: ";xL"},
{from:"v'l;", to: "v'zL"},
{from:"kl/Iff", to: "k/LIff"},
{from:"c+s", to: "c°"},
{from:"af]l8{u", to: "af]l8{·"},
{from:"/}nL", to: "¥ofnL"},
{from:"/}ln", to: "¥ofnL"},
{from:"l;ntf", to: "zLntf"},
{from:"pwd", to: "pBd"},
{from:"pb]Zo", to: "p2]Zo"},
{from:"s|", to: "qm"},
{from:"lzk", to: ";Lk"},
{from:"uf]i6L", to: "uf]i7L"},
{from:" ,", to: ","},
{from:"pwf]u", to: "pBf]u"},
{from:"jf/f", to: "af/f"},
{from:"ljwfyL{", to: "ljBfyL{"},
{from:"lawfyL{", to: "ljBfyL{"},
{from:"cf‘vf", to: "cf“vf"},
{from:"lgnf]", to: "gLnf]"},
{from:"kx]nf]", to: "kx]+nf]"},
{from:"rf]l6", to: "rf]6L"},
{from:"/f]kfO{", to: "/f]kfO“"},
{from:"lba;", to: "lbj;"},
{from:"l;rfO{", to: "l;+rfO"},
{from:";xLt", to: ";lxt"},
{from:"alif{", to: "jifL{"},
{from:"jlif{", to: "jifL{"},
{from:"lgl/Ifs", to: "lg/LIFs"},
{from:"4f/f", to: "åf/f"},
{from:"4f/f", to: "åf/f"},
{from:"?", to: "¿"},
{from:"O{nfsf", to: "Onfsf"},
{from:"aif{", to: "jif{"},
{from:"lhjg", to: "hLjg"},
{from:";+sng", to: ";°ng"},
{from:"sf/jfxL", to: "sf/afO{"},
{from:"3fO{t]", to: "3fOt]"},
{from:"ulDe/", to: "uDeL/"},
{from:"If]lqo", to: "If]qLo"},
{from:"ldtL", to: "ldlt"},
{from:"/fhlglt", to: "/fhgLlt"},
{from:"b]vL", to: "b]lv"},
{from:"h{L", to: "hL{"},
{from:"lgnf]", to: "gLnf]"},
{from:"Ú", to: "’"},
{from:"Ë", to: "·"},
{from:"jiff{T", to: "jiff{t"},
{from:"ljB'T", to: "ljB't"},
{from:"lyOG", to: "lyOg"},
{from:"lyO{G", to: "lyOg"},

{from:"xf]:", to: "xf];"},
{from:"atfOG", to: "atfOg"},
{from:"kfOG", to: "kfOg"},
{from:"l5G", to: "l5g"},
{from:"?{", to: "¥"},
{from:"8f.", to: "8f="},
{from:"k|f.", to: "k|f="},
{from:"cy{fT", to: "cyf{t"},
{from:";'gfOG", to: ";'gfOg"},
{from:"lbOG", to: "lbOg"},
{from:"g':", to: "g';"},
{from:"lgof{T:", to: "lgof{t"},
{from:"emG", to: "emg"},
{from:"¿{", to: "¥"},
{from:"g'{:", to: "g'{;"},
{from:"g{':", to: "g'{;"},
{from:"cf]:", to: "cf];"},
{from:"lk8f", to: "kL8f"},
{from:"OG", to: "Og"},
{from:"5{G", to: "5{g"},
{from:"l8G", to: "l8g"},
{from:"luG", to: "lug"},
{from:"uf]v{f", to: "uf]vf{"},
{from:"ljkT", to: "ljkt"},
{from:"dfk{mT", to: "dfk{mt"},
{from:"al;G", to: "al;g"},
{from:":kf]6{:", to: ":kf]6{;"},
{from:"•", to: "88"},
{from:":yLt", to: "l:yt"},
{from:"lkl8t", to: "kLl8t"},
{from:"(/f;;)", to: "/f;;"},
{from:"(Ph]G;L)", to: "Ph]G;L"},
{from:"x'gg", to: "x'Gg"},
{from:"xf]:", to: "xf];"},
{from:"Ogwg", to: "OGwg"},
{from:"Uof;", to: "Uof“;"},
{from:"emg8}", to: "emG8}"},
{from:";G", to: ";g"},
{from:";gb]z", to: ";Gb]z"},
{from:";gbe{", to: ";Gbe{"},
{from:"lj.;.", to: "lj=;+="},
{from:"lj.;", to: "lj=;+="},
{from:"k|wfggofofwLz", to: "k|wfgGofwLz"},
{from:"gofofwLz", to: "GofofwLz"},
{from:"cg';gwfg", to: "cg';Gwfg"},
{from:"pkl/Ifs", to: "pk/LIfs"},
{from:"pkl/Ifs", to: "pk/LIfs"},
{from:"ldof", to: "ldof“"},
{from:"›", to: "b|"},
{from:"/f]:", to: "/f];"},
{from:"l/G", to: "l/g"},
{from:"tTj", to: "tŒj"},
{from:"lggb|f", to: "lgGb|f"},
{from:"„", to: "w|"},
{from:"A¿", to: "a'|"},
{from:"kZrfT", to: "kZrft"},
{from:"kZrfto", to: "kZrfTo"},
{from:"p¢f6g", to: "pb3f6g"},
{from:":joD", to: ":jo+"},
{from:"j;gt", to: "j;Gt"},
{from:"dflgg5", to: "dflgG5"},
{from:"el/g5", to: "el/G5"},
{from:"lql6", to: "q'l6"},
{from:"u5{f}+", to: "u5f}{"},
{from:"kfOg5g", to: "kfOG5g"},
{from:"elgg5", to: "elgG5"},
{from:"Ogr", to: "OGr"},
{from:"?{", to: "¥"},
{from:";gtf]if", to: ";Gtf]if"},
{from:"g+.", to: "g+="},
{from:"(Pdfn])", to: "Pdfn]"},
{from:"z'?ª", to: ";'?ª"},
{from:"atfOg5", to: "atfOG5"},
{from:"l;gw'", to: "l;Gw'"},
{from:";gt", to: ";Gt"},
{from:"lq6L", to: "q'l6"},
{from:"?{", to: "¥"},
{from:"kfOg5", to: "kfOG5"},
{from:"b]vfOg5", to: "b]vfOG5"},
{from:"elgg5", to: "elgG5"},
{from:"ul/g5", to: "ul/G5"},
{from:"ofjT", to: "ofjt"},
{from:"lyPG", to: "lyPg"},
{from:"j{L", to: "jL{"},
{from:"?{", to: "¥"},
{from:"Og6/g]6", to: "OG6/g]6"},
{from:"PjD", to: "Pj+"},
{from:"lbOg5", to: "lbOG5"},
{from:"?{", to: "¥"},
{from:"ggbg", to: "gGbg"},
{from:"Å", to: "X"},
{from:"gofozLw", to: "GofozLw"},
{from:"5}G", to: "5}g"},
{from:"x}G", to: "x}g"},
{from:"b'u{f", to: "b'uf{"},
{from:"afl;gbf", to: "afl;Gbf"},
{from:"jfl;gbf", to: "jfl;Gbf"},
{from:";+;ßf", to: ";+;bdf"},
{from:"”", to: "Æ"},
{from:"dxTj", to: "dxŒj"},
{from:"oflq", to: "ofqL"},
{from:"cfXjfg", to: "cfxjfg"},
{from:"lg3{ft", to: "lg3f{t"},
{from:"¿k}of", to: "?lkof“"},
{from:"emg8f", to: "´G8f"},
{from:"/ªu", to: "/·"},
{from:"g].s.kf.", to: "g]skf"},
{from:"cfggb", to: "cfgGb"},
{from:"sf7df8f}++", to: "sf7df8f}+"},
{from:"cf;gg", to: "cf;Gg"},
{from:"Og6/g];gn", to: "OG6/g]zgn"},
{from:"Og6/g]zgn", to: "OG6/g]zgn"},
{from:";fOg;", to: ";fOG;"},
{from:"Ë", to: "·"},
{from:"›", to: "b|"},
{from:"cftÍ", to: "cft°"},
{from:"l;gXjf", to: "l;Gxjf"},
{from:"cÍ", to: "c°"},
{from:"ufp", to: "ufp“"},
{from:"lh/f", to: "hL/f"},
{from:"b'O", to: "b'O{"},
{from:";+hfn", to: ";~hfn"},
{from:";dflhs", to: ";fdflhs"},
{from:";xeflu", to: ";xefuL"},
{from:"la¿jfu'l7", to: "la?jfu'7L"},
{from:"k;f{ul9", to: "k;f{u9L"},
{from:"Po/nfOg;", to: "Po/nfOG;"},
{from:";Í6", to: ";°6"},
{from:";Íng", to: ";°ng"},
{from:"tYofÍ", to: "tYof°"},
{from:"em", to: "´"},
{from:"?{", to: "¥"},
{from:" -/f;;_ M", to: "÷/f;;"},
{from:"nÍf", to: "n+sf"},
{from:"a}Í", to: "a}+s"},
{from:"zÍ/", to: "z°//"},
{from:"lnÍ", to: "ln+s"},

{from:"Íg", to: "°g"},
{from:"u~h", to: "u+h"},
{from:"ggt", to: "gGt"},
{from:"6\of{Í", to: "6of°"},
{from:";ª3", to: ";+3"},
    
    
    {from:"tÍ", to: "t°"},
{from:"zÍf", to: "z°f"},


    // punctuation marks
    {from: "।", to: " ."}
    
  ];
  
  
  var unicode = Encoder.htmlDecode(kantipur);
  
  for ( var i = 0; i < replacements.length; i++ ) {
    if ( replacements[i]["from"] instanceof RegExp ) {
      unicode = unicode.replace(replacements[i]["from"], replacements[i]["to"] );
      
    } else {
      unicode = replaceAll( unicode, replacements[i]["from"], replacements[i]["to"] );
    }
  }
  
  return unicode;
}

function replaceAll(str, find, replace) 
{
  return str.split(find).join(replace);
}


var Encoder = {

  // When encoding do we convert characters into html or numerical entities
  EncodeType : "entity",  // entity OR numerical

  isEmpty : function(val){
    if(val){
      return ((val===null) || val.length==0 || /^\s+$/.test(val));
    }else{
      return true;
    }
  },
  // Convert HTML entities into numerical entities
  HTML2Numerical : function(s){
    var arr1 = new Array;
    var arr2 = new Array;
    return this.swapArrayVals(s,arr1,arr2);
  },  

  // Convert Numerical entities into HTML entities
  NumericalToHTML : function(s){
    var arr1 = new Array;
    var arr2 = new Array;
  },


  // Numerically encodes all unicode characters
  numEncode : function(s){
    
    if(this.isEmpty(s)) return "";

    var e = "";
    for (var i = 0; i < s.length; i++)
    {
      var c = s.charAt(i);
      if (c < " " || c > "~")
      {
        c = "&#" + c.charCodeAt() + ";";
      }
      e += c;
    }
    return e;
  },
  
  // HTML Decode numerical and HTML entities back to original values
  htmlDecode : function(s){

    var c,m,d = s;
    
    if(this.isEmpty(d)) return "";

    // convert HTML entites back to numerical entites first
    d = this.HTML2Numerical(d);
    
    // look for numerical entities &#34;
    arr=d.match(/&#[0-9]{1,5};/g);
    
    // if no matches found in string then skip
    if(arr!=null){
      for(var x=0;x<arr.length;x++){
        m = arr[x];
        c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
        // if its a valid number we can decode
        if(c >= -32768 && c <= 65535){
          // decode every single match within string
          d = d.replace(m, String.fromCharCode(c));
        }else{
          d = d.replace(m, ""); //invalid so replace with nada
        }
      }      
    }

    return d;
  },    

  // encode an input string into either numerical or HTML entities
  htmlEncode : function(s,dbl){
      
    if(this.isEmpty(s)) return "";

    // do we allow double encoding? E.g will &amp; be turned into &amp;amp;
    dbl = dbl | false; //default to prevent double encoding
    
    // if allowing double encoding we do ampersands first
    if(dbl){
      if(this.EncodeType=="numerical"){
        s = s.replace;
      }else{
        s = s.replace;
      }
    }

    // convert the xss chars to numerical entities ' " < >
    s = this.XSSEncode(s,false);
    
    if(this.EncodeType=="numerical" || !dbl){
      // Now call function that will convert any HTML entities to numerical codes
      s = this.HTML2Numerical(s);
    }

    // Now encode all chars above 127 e.g unicode
    s = this.numEncode(s);

    // now we know anything that needs to be encoded has been converted to numerical entities we
    // can encode any ampersands & that are not part of encoded entities
    // to handle the fact that I need to do a negative check and handle multiple ampersands &&&
    // I am going to use a placeholder

    // if we don't want double encoded entities we ignore the & in existing entities
    if(!dbl){
      s = s.replace;
    
      if(this.EncodeType=="numerical"){
        s = s.replace;
      }else{
        s = s.replace;
      }

      s = s.replace;
    }
    
    // replace any malformed entities
    s = s.replace;

    if(!dbl){
      // safety check to correct any double encoded &amp;
      s = this.correctEncoding(s);
    }

    // now do we need to convert our numerical encoded string into entities
    if(this.EncodeType=="entity"){
      s = this.NumericalToHTML(s);
    }

    return s;          
  },

  

  // returns true if a string contains html or numerical encoded entities
  hasEncoded : function(s){
    if(/&#[0-9]{1,5};/g.test(s)){
      return true;
    }else if(/&[A-Z]{2,6};/gi.test(s)){
      return true;
    }else{
      return false;
    }
  },

  // will remove any unicode characters
  stripUnicode : function(s){
    return s.replace;
    
  },

  // corrects any double encoded &amp; entities e.g &amp;amp;
  correctEncoding : function(s){
    return s.replace;
  },


  // Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
  swapArrayVals : function(s,arr1,arr2){
    if(this.isEmpty(s)) return "";
    var re;
    if(arr1 && arr2){
      //ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
      // array lengths must match
      if(arr1.length == arr2.length){
        for(var x=0,i=arr1.length;x<i;x++){
          re = new RegExp(arr1[x], 'g');
          s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2  
        }
      }
    }
    return s;
  },

  inArray : function( item, arr ) {
    for ( var i = 0, x = arr.length; i < x; i++ ){
      if ( arr[i] === item ){
        return i;
      }
    }
    return -1;
  }

}

