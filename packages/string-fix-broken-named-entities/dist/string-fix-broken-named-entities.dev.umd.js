/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 5.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-fix-broken-named-entities/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringFixBrokenNamedEntities = {}));
}(this, (function (exports) { 'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var array = [];
var charCodeCache = [];

var leven = function leven(left, right) {
  if (left === right) {
    return 0;
  }

  var swap = left; // Swapping the strings if `a` is longer than `b` so we know which one is the
  // shortest & which one is the longest

  if (left.length > right.length) {
    left = right;
    right = swap;
  }

  var leftLength = left.length;
  var rightLength = right.length; // Performing suffix trimming:
  // We can linearly drop suffix common to both strings since they
  // don't increase distance at all
  // Note: `~-` is the bitwise way to perform a `- 1` operation

  while (leftLength > 0 && left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength)) {
    leftLength--;
    rightLength--;
  } // Performing prefix trimming
  // We can linearly drop prefix common to both strings since they
  // don't increase distance at all


  var start = 0;

  while (start < leftLength && left.charCodeAt(start) === right.charCodeAt(start)) {
    start++;
  }

  leftLength -= start;
  rightLength -= start;

  if (leftLength === 0) {
    return rightLength;
  }

  var bCharCode;
  var result;
  var temp;
  var temp2;
  var i = 0;
  var j = 0;

  while (i < leftLength) {
    charCodeCache[i] = left.charCodeAt(start + i);
    array[i] = ++i;
  }

  while (j < rightLength) {
    bCharCode = right.charCodeAt(start + j);
    temp = j++;
    result = j;

    for (i = 0; i < leftLength; i++) {
      temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
      temp = array[i]; // eslint-disable-next-line no-multi-assign

      result = array[i] = temp > result ? temp2 > result ? result + 1 : temp2 : temp2 > temp ? temp + 1 : temp2;
    }
  }

  return result;
};

var leven_1 = leven; // TODO: Remove this for the next major release

var _default = leven;
leven_1.default = _default;

/**
 * all-named-html-entities
 * List of all named HTML entities
 * Version: 1.5.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/all-named-html-entities/
 */
var Aacute = "Á";
var aacute = "á";
var Abreve = "Ă";
var abreve = "ă";
var ac$1 = "∾";
var acd = "∿";
var acE = "∾̳";
var Acirc = "Â";
var acirc = "â";
var acute$1 = "´";
var Acy = "А";
var acy = "а";
var AElig = "Æ";
var aelig = "æ";
var af = "⁡";
var Afr = "𝔄";
var afr = "𝔞";
var Agrave = "À";
var agrave = "à";
var alefsym = "ℵ";
var aleph = "ℵ";
var Alpha$1 = "Α";
var alpha$1 = "α";
var Amacr = "Ā";
var amacr = "ā";
var amalg = "⨿";
var AMP = "&";
var amp$1 = "&";
var And$1 = "⩓";
var and$1 = "∧";
var andand = "⩕";
var andd = "⩜";
var andslope = "⩘";
var andv = "⩚";
var ang = "∠";
var ange$1 = "⦤";
var angle$1 = "∠";
var angmsd = "∡";
var angmsdaa = "⦨";
var angmsdab = "⦩";
var angmsdac = "⦪";
var angmsdad = "⦫";
var angmsdae = "⦬";
var angmsdaf = "⦭";
var angmsdag = "⦮";
var angmsdah = "⦯";
var angrt = "∟";
var angrtvb = "⊾";
var angrtvbd = "⦝";
var angsph = "∢";
var angst$1 = "Å";
var angzarr = "⍼";
var Aogon = "Ą";
var aogon = "ą";
var Aopf = "𝔸";
var aopf = "𝕒";
var ap$1 = "≈";
var apacir = "⩯";
var apE = "⩰";
var ape$1 = "≊";
var apid = "≋";
var apos = "'";
var ApplyFunction = "⁡";
var approx$1 = "≈";
var approxeq = "≊";
var Aring$1 = "Å";
var aring$1 = "å";
var Ascr$1 = "𝒜";
var ascr$1 = "𝒶";
var Assign$1 = "≔";
var ast$1 = "*";
var asymp = "≈";
var asympeq = "≍";
var Atilde = "Ã";
var atilde$1 = "ã";
var Auml = "Ä";
var auml = "ä";
var awconint = "∳";
var awint = "⨑";
var backcong = "≌";
var backepsilon = "϶";
var backprime = "‵";
var backsim = "∽";
var backsimeq = "⋍";
var Backslash$1 = "∖";
var Barv = "⫧";
var barvee = "⊽";
var Barwed = "⌆";
var barwed = "⌅";
var barwedge$1 = "⌅";
var bbrk = "⎵";
var bbrktbrk = "⎶";
var bcong = "≌";
var Bcy = "Б";
var bcy = "б";
var bdquo = "„";
var becaus$1 = "∵";
var Because$1 = "∵";
var because$1 = "∵";
var bemptyv = "⦰";
var bepsi$1 = "϶";
var bernou = "ℬ";
var Bernoullis$1 = "ℬ";
var Beta$1 = "Β";
var beta$1 = "β";
var beth$1 = "ℶ";
var between$1 = "≬";
var Bfr = "𝔅";
var bfr = "𝔟";
var bigcap = "⋂";
var bigcirc = "◯";
var bigcup = "⋃";
var bigodot = "⨀";
var bigoplus = "⨁";
var bigotimes = "⨂";
var bigsqcup = "⨆";
var bigstar = "★";
var bigtriangledown = "▽";
var bigtriangleup = "△";
var biguplus = "⨄";
var bigvee = "⋁";
var bigwedge = "⋀";
var bkarow = "⤍";
var blacklozenge = "⧫";
var blacksquare = "▪";
var blacktriangle = "▴";
var blacktriangledown = "▾";
var blacktriangleleft = "◂";
var blacktriangleright = "▸";
var blank$1 = "␣";
var blk12 = "▒";
var blk14 = "░";
var blk34 = "▓";
var block$1 = "█";
var bne = "=⃥";
var bnequiv = "≡⃥";
var bNot = "⫭";
var bnot = "⌐";
var Bopf = "𝔹";
var bopf = "𝕓";
var bot$1 = "⊥";
var bottom$1 = "⊥";
var bowtie$1 = "⋈";
var boxbox = "⧉";
var boxDL = "╗";
var boxDl = "╖";
var boxdL = "╕";
var boxdl = "┐";
var boxDR = "╔";
var boxDr = "╓";
var boxdR = "╒";
var boxdr = "┌";
var boxH = "═";
var boxh = "─";
var boxHD = "╦";
var boxHd = "╤";
var boxhD = "╥";
var boxhd = "┬";
var boxHU = "╩";
var boxHu = "╧";
var boxhU = "╨";
var boxhu = "┴";
var boxminus = "⊟";
var boxplus = "⊞";
var boxtimes = "⊠";
var boxUL = "╝";
var boxUl = "╜";
var boxuL = "╛";
var boxul = "┘";
var boxUR = "╚";
var boxUr = "╙";
var boxuR = "╘";
var boxur = "└";
var boxV = "║";
var boxv = "│";
var boxVH = "╬";
var boxVh = "╫";
var boxvH = "╪";
var boxvh = "┼";
var boxVL = "╣";
var boxVl = "╢";
var boxvL = "╡";
var boxvl = "┤";
var boxVR = "╠";
var boxVr = "╟";
var boxvR = "╞";
var boxvr = "├";
var bprime = "‵";
var Breve = "˘";
var breve$1 = "˘";
var brvbar = "¦";
var Bscr = "ℬ";
var bscr = "𝒷";
var bsemi = "⁏";
var bsim = "∽";
var bsime = "⋍";
var bsol = "\\";
var bsolb = "⧅";
var bsolhsub = "⟈";
var bull$1 = "•";
var bullet$1 = "•";
var bump$1 = "≎";
var bumpE = "⪮";
var bumpe = "≏";
var Bumpeq = "≎";
var bumpeq = "≏";
var Cacute = "Ć";
var cacute$1 = "ć";
var Cap$1 = "⋒";
var cap$1 = "∩";
var capand$1 = "⩄";
var capbrcup = "⩉";
var capcap = "⩋";
var capcup = "⩇";
var capdot = "⩀";
var CapitalDifferentialD = "ⅅ";
var caps$1 = "∩︀";
var caret$1 = "⁁";
var caron$1 = "ˇ";
var Cayleys = "ℭ";
var ccaps = "⩍";
var Ccaron = "Č";
var ccaron = "č";
var Ccedil = "Ç";
var ccedil = "ç";
var Ccirc = "Ĉ";
var ccirc = "ĉ";
var Cconint = "∰";
var ccups = "⩌";
var ccupssm = "⩐";
var Cdot = "Ċ";
var cdot = "ċ";
var cedil$1 = "¸";
var Cedilla$1 = "¸";
var cemptyv = "⦲";
var cent$1 = "¢";
var CenterDot = "·";
var centerdot = "·";
var Cfr = "ℭ";
var cfr = "𝔠";
var CHcy = "Ч";
var chcy = "ч";
var check$1 = "✓";
var checkmark$1 = "✓";
var Chi$1 = "Χ";
var chi$1 = "χ";
var cir$1 = "○";
var circ$1 = "ˆ";
var circeq = "≗";
var circlearrowleft = "↺";
var circlearrowright = "↻";
var circledast = "⊛";
var circledcirc = "⊚";
var circleddash = "⊝";
var CircleDot = "⊙";
var circledR = "®";
var circledS = "Ⓢ";
var CircleMinus = "⊖";
var CirclePlus = "⊕";
var CircleTimes = "⊗";
var cirE = "⧃";
var cire = "≗";
var cirfnint = "⨐";
var cirmid = "⫯";
var cirscir = "⧂";
var ClockwiseContourIntegral = "∲";
var CloseCurlyDoubleQuote = "”";
var CloseCurlyQuote = "’";
var clubs$1 = "♣";
var clubsuit$1 = "♣";
var Colon$1 = "∷";
var colon$1 = ":";
var Colone$1 = "⩴";
var colone$1 = "≔";
var coloneq = "≔";
var comma$1 = ",";
var commat$1 = "@";
var comp$1 = "∁";
var compfn = "∘";
var complement$1 = "∁";
var complexes$1 = "ℂ";
var cong$1 = "≅";
var congdot = "⩭";
var Congruent$1 = "≡";
var Conint = "∯";
var conint$1 = "∮";
var ContourIntegral = "∮";
var Copf = "ℂ";
var copf$1 = "𝕔";
var coprod$1 = "∐";
var Coproduct = "∐";
var COPY$1 = "©";
var copy$1 = "©";
var copysr = "℗";
var CounterClockwiseContourIntegral = "∳";
var crarr = "↵";
var Cross$1 = "⨯";
var cross$1 = "✗";
var Cscr = "𝒞";
var cscr = "𝒸";
var csub = "⫏";
var csube = "⫑";
var csup = "⫐";
var csupe = "⫒";
var ctdot = "⋯";
var cudarrl = "⤸";
var cudarrr = "⤵";
var cuepr = "⋞";
var cuesc = "⋟";
var cularr = "↶";
var cularrp = "⤽";
var Cup$1 = "⋓";
var cup$1 = "∪";
var cupbrcap = "⩈";
var CupCap = "≍";
var cupcap = "⩆";
var cupcup = "⩊";
var cupdot = "⊍";
var cupor = "⩅";
var cups$1 = "∪︀";
var curarr = "↷";
var curarrm = "⤼";
var curlyeqprec = "⋞";
var curlyeqsucc = "⋟";
var curlyvee = "⋎";
var curlywedge = "⋏";
var curren = "¤";
var curvearrowleft = "↶";
var curvearrowright = "↷";
var cuvee = "⋎";
var cuwed = "⋏";
var cwconint = "∲";
var cwint = "∱";
var cylcty = "⌭";
var Dagger$1 = "‡";
var dagger$1 = "†";
var daleth$1 = "ℸ";
var Darr = "↡";
var dArr = "⇓";
var darr$1 = "↓";
var dash$1 = "‐";
var Dashv = "⫤";
var dashv = "⊣";
var dbkarow = "⤏";
var dblac = "˝";
var Dcaron = "Ď";
var dcaron = "ď";
var Dcy = "Д";
var dcy = "д";
var DD$1 = "ⅅ";
var dd$1 = "ⅆ";
var ddagger = "‡";
var ddarr = "⇊";
var DDotrahd = "⤑";
var ddotseq = "⩷";
var deg$1 = "°";
var Del$1 = "∇";
var Delta$1 = "Δ";
var delta$1 = "δ";
var demptyv = "⦱";
var dfisht = "⥿";
var Dfr = "𝔇";
var dfr = "𝔡";
var dHar = "⥥";
var dharl = "⇃";
var dharr$1 = "⇂";
var DiacriticalAcute = "´";
var DiacriticalDot = "˙";
var DiacriticalDoubleAcute = "˝";
var DiacriticalGrave = "`";
var DiacriticalTilde = "˜";
var diam$1 = "⋄";
var Diamond$1 = "⋄";
var diamond$1 = "⋄";
var diamondsuit = "♦";
var diams$1 = "♦";
var die$1 = "¨";
var DifferentialD = "ⅆ";
var digamma$1 = "ϝ";
var disin$1 = "⋲";
var div$1 = "÷";
var divide$1 = "÷";
var divideontimes = "⋇";
var divonx = "⋇";
var DJcy = "Ђ";
var djcy = "ђ";
var dlcorn = "⌞";
var dlcrop = "⌍";
var dollar$1 = "$";
var Dopf = "𝔻";
var dopf$1 = "𝕕";
var Dot$1 = "¨";
var dot$1 = "˙";
var DotDot = "⃜";
var doteq = "≐";
var doteqdot = "≑";
var DotEqual = "≐";
var dotminus = "∸";
var dotplus = "∔";
var dotsquare = "⊡";
var doublebarwedge = "⌆";
var DoubleContourIntegral = "∯";
var DoubleDot = "¨";
var DoubleDownArrow = "⇓";
var DoubleLeftArrow = "⇐";
var DoubleLeftRightArrow = "⇔";
var DoubleLeftTee = "⫤";
var DoubleLongLeftArrow = "⟸";
var DoubleLongLeftRightArrow = "⟺";
var DoubleLongRightArrow = "⟹";
var DoubleRightArrow = "⇒";
var DoubleRightTee = "⊨";
var DoubleUpArrow = "⇑";
var DoubleUpDownArrow = "⇕";
var DoubleVerticalBar = "∥";
var DownArrow = "↓";
var Downarrow = "⇓";
var downarrow = "↓";
var DownArrowBar = "⤓";
var DownArrowUpArrow = "⇵";
var DownBreve = "̑";
var downdownarrows = "⇊";
var downharpoonleft = "⇃";
var downharpoonright = "⇂";
var DownLeftRightVector = "⥐";
var DownLeftTeeVector = "⥞";
var DownLeftVector = "↽";
var DownLeftVectorBar = "⥖";
var DownRightTeeVector = "⥟";
var DownRightVector = "⇁";
var DownRightVectorBar = "⥗";
var DownTee = "⊤";
var DownTeeArrow = "↧";
var drbkarow = "⤐";
var drcorn = "⌟";
var drcrop = "⌌";
var Dscr = "𝒟";
var dscr = "𝒹";
var DScy = "Ѕ";
var dscy = "ѕ";
var dsol$1 = "⧶";
var Dstrok = "Đ";
var dstrok = "đ";
var dtdot = "⋱";
var dtri$1 = "▿";
var dtrif = "▾";
var duarr = "⇵";
var duhar = "⥯";
var dwangle = "⦦";
var DZcy = "Џ";
var dzcy = "џ";
var dzigrarr = "⟿";
var Eacute = "É";
var eacute = "é";
var easter$1 = "⩮";
var Ecaron = "Ě";
var ecaron = "ě";
var ecir$1 = "≖";
var Ecirc = "Ê";
var ecirc = "ê";
var ecolon$1 = "≕";
var Ecy = "Э";
var ecy$1 = "э";
var eDDot = "⩷";
var Edot = "Ė";
var eDot = "≑";
var edot$1 = "ė";
var ee$1 = "ⅇ";
var efDot = "≒";
var Efr = "𝔈";
var efr$1 = "𝔢";
var eg$1 = "⪚";
var Egrave = "È";
var egrave$1 = "è";
var egs$1 = "⪖";
var egsdot = "⪘";
var el$1 = "⪙";
var Element = "∈";
var elinters = "⏧";
var ell$1 = "ℓ";
var els$1 = "⪕";
var elsdot = "⪗";
var Emacr = "Ē";
var emacr = "ē";
var empty$1 = "∅";
var emptyset = "∅";
var EmptySmallSquare = "◻";
var emptyv = "∅";
var EmptyVerySmallSquare = "▫";
var emsp = " ";
var emsp13 = " ";
var emsp14 = " ";
var ENG$1 = "Ŋ";
var eng$1 = "ŋ";
var ensp = " ";
var Eogon = "Ę";
var eogon = "ę";
var Eopf = "𝔼";
var eopf = "𝕖";
var epar = "⋕";
var eparsl = "⧣";
var eplus = "⩱";
var epsi$1 = "ε";
var Epsilon$1 = "Ε";
var epsilon$1 = "ε";
var epsiv = "ϵ";
var eqcirc = "≖";
var eqcolon = "≕";
var eqsim = "≂";
var eqslantgtr = "⪖";
var eqslantless = "⪕";
var Equal$1 = "⩵";
var equals$1 = "=";
var EqualTilde = "≂";
var equest$1 = "≟";
var Equilibrium$1 = "⇌";
var equiv$1 = "≡";
var equivDD = "⩸";
var eqvparsl = "⧥";
var erarr = "⥱";
var erDot = "≓";
var Escr = "ℰ";
var escr$1 = "ℯ";
var esdot = "≐";
var Esim = "⩳";
var esim$1 = "≂";
var Eta$1 = "Η";
var eta$1 = "η";
var ETH$1 = "Ð";
var eth$1 = "ð";
var Euml = "Ë";
var euml = "ë";
var euro$1 = "€";
var excl$1 = "!";
var exist$1 = "∃";
var Exists$1 = "∃";
var expectation$1 = "ℰ";
var ExponentialE = "ⅇ";
var exponentiale = "ⅇ";
var fallingdotseq = "≒";
var Fcy = "Ф";
var fcy = "ф";
var female$1 = "♀";
var ffilig = "ﬃ";
var fflig = "ﬀ";
var ffllig = "ﬄ";
var Ffr = "𝔉";
var ffr = "𝔣";
var filig = "ﬁ";
var FilledSmallSquare = "◼";
var FilledVerySmallSquare = "▪";
var fjlig = "fj";
var flat$1 = "♭";
var fllig = "ﬂ";
var fltns = "▱";
var fnof = "ƒ";
var Fopf = "𝔽";
var fopf = "𝕗";
var ForAll = "∀";
var forall = "∀";
var fork$1 = "⋔";
var forkv = "⫙";
var Fouriertrf = "ℱ";
var fpartint = "⨍";
var frac12 = "½";
var frac13 = "⅓";
var frac14 = "¼";
var frac15 = "⅕";
var frac16 = "⅙";
var frac18 = "⅛";
var frac23 = "⅔";
var frac25 = "⅖";
var frac34 = "¾";
var frac35 = "⅗";
var frac38 = "⅜";
var frac45 = "⅘";
var frac56 = "⅚";
var frac58 = "⅝";
var frac78 = "⅞";
var frasl = "⁄";
var frown$1 = "⌢";
var Fscr = "ℱ";
var fscr = "𝒻";
var gacute = "ǵ";
var Gamma$1 = "Γ";
var gamma$1 = "γ";
var Gammad = "Ϝ";
var gammad = "ϝ";
var gap$1 = "⪆";
var Gbreve = "Ğ";
var gbreve = "ğ";
var Gcedil = "Ģ";
var Gcirc = "Ĝ";
var gcirc = "ĝ";
var Gcy = "Г";
var gcy$1 = "г";
var Gdot = "Ġ";
var gdot = "ġ";
var gE = "≧";
var ge$1 = "≥";
var gEl = "⪌";
var gel$1 = "⋛";
var geq$1 = "≥";
var geqq = "≧";
var geqslant = "⩾";
var ges$1 = "⩾";
var gescc = "⪩";
var gesdot = "⪀";
var gesdoto = "⪂";
var gesdotol = "⪄";
var gesl$1 = "⋛︀";
var gesles = "⪔";
var Gfr = "𝔊";
var gfr = "𝔤";
var Gg = "⋙";
var gg$1 = "≫";
var ggg = "⋙";
var gimel = "ℷ";
var GJcy = "Ѓ";
var gjcy = "ѓ";
var gl$1 = "≷";
var gla$1 = "⪥";
var glE = "⪒";
var glj = "⪤";
var gnap = "⪊";
var gnapprox = "⪊";
var gnE = "≩";
var gne$1 = "⪈";
var gneq = "⪈";
var gneqq = "≩";
var gnsim = "⋧";
var Gopf = "𝔾";
var gopf = "𝕘";
var grave$1 = "`";
var GreaterEqual = "≥";
var GreaterEqualLess = "⋛";
var GreaterFullEqual = "≧";
var GreaterGreater = "⪢";
var GreaterLess = "≷";
var GreaterSlantEqual = "⩾";
var GreaterTilde = "≳";
var Gscr = "𝒢";
var gscr = "ℊ";
var gsim = "≳";
var gsime = "⪎";
var gsiml = "⪐";
var GT$1 = ">";
var Gt = "≫";
var gt$1 = ">";
var gtcc = "⪧";
var gtcir = "⩺";
var gtdot = "⋗";
var gtlPar = "⦕";
var gtquest = "⩼";
var gtrapprox = "⪆";
var gtrarr = "⥸";
var gtrdot = "⋗";
var gtreqless = "⋛";
var gtreqqless = "⪌";
var gtrless = "≷";
var gtrsim = "≳";
var gvertneqq = "≩︀";
var gvnE = "≩︀";
var Hacek = "ˇ";
var hairsp = " ";
var half$1 = "½";
var hamilt = "ℋ";
var HARDcy = "Ъ";
var hardcy = "ъ";
var hArr = "⇔";
var harr = "↔";
var harrcir = "⥈";
var harrw = "↭";
var Hat$1 = "^";
var hbar = "ℏ";
var Hcirc = "Ĥ";
var hcirc = "ĥ";
var hearts$1 = "♥";
var heartsuit = "♥";
var hellip = "…";
var hercon = "⊹";
var Hfr = "ℌ";
var hfr = "𝔥";
var HilbertSpace = "ℋ";
var hksearow = "⤥";
var hkswarow = "⤦";
var hoarr = "⇿";
var homtht = "∻";
var hookleftarrow = "↩";
var hookrightarrow = "↪";
var Hopf = "ℍ";
var hopf$1 = "𝕙";
var horbar = "―";
var HorizontalLine = "─";
var Hscr = "ℋ";
var hscr = "𝒽";
var hslash = "ℏ";
var Hstrok = "Ħ";
var hstrok = "ħ";
var HumpDownHump = "≎";
var HumpEqual = "≏";
var hybull = "⁃";
var hyphen$1 = "‐";
var Iacute = "Í";
var iacute = "í";
var ic$1 = "⁣";
var Icirc = "Î";
var icirc = "î";
var Icy = "И";
var icy$1 = "и";
var Idot = "İ";
var IEcy = "Е";
var iecy = "е";
var iexcl = "¡";
var iff$1 = "⇔";
var Ifr = "ℑ";
var ifr = "𝔦";
var Igrave = "Ì";
var igrave = "ì";
var ii$1 = "ⅈ";
var iiiint = "⨌";
var iiint = "∭";
var iinfin = "⧜";
var iiota = "℩";
var IJlig = "Ĳ";
var ijlig = "ĳ";
var Im = "ℑ";
var Imacr = "Ī";
var imacr = "ī";
var image$1 = "ℑ";
var ImaginaryI = "ⅈ";
var imagline = "ℐ";
var imagpart = "ℑ";
var imath = "ı";
var imof = "⊷";
var imped$1 = "Ƶ";
var Implies = "⇒";
var incare = "℅";
var infin = "∞";
var infintie = "⧝";
var inodot = "ı";
var Int = "∬";
var int$1 = "∫";
var intcal = "⊺";
var integers$1 = "ℤ";
var Integral = "∫";
var intercal = "⊺";
var Intersection = "⋂";
var intlarhk = "⨗";
var intprod = "⨼";
var InvisibleComma = "⁣";
var InvisibleTimes = "⁢";
var IOcy = "Ё";
var iocy$1 = "ё";
var Iogon = "Į";
var iogon$1 = "į";
var Iopf = "𝕀";
var iopf = "𝕚";
var Iota = "Ι";
var iota$1 = "ι";
var iprod = "⨼";
var iquest = "¿";
var Iscr = "ℐ";
var iscr = "𝒾";
var isin$1 = "∈";
var isindot = "⋵";
var isinE = "⋹";
var isins = "⋴";
var isinsv = "⋳";
var isinv = "∈";
var it$1 = "⁢";
var Itilde = "Ĩ";
var itilde = "ĩ";
var Iukcy = "І";
var iukcy = "і";
var Iuml = "Ï";
var iuml = "ï";
var Jcirc = "Ĵ";
var jcirc = "ĵ";
var Jcy = "Й";
var jcy = "й";
var Jfr = "𝔍";
var jfr = "𝔧";
var jmath = "ȷ";
var Jopf = "𝕁";
var jopf = "𝕛";
var Jscr = "𝒥";
var jscr = "𝒿";
var Jsercy = "Ј";
var jsercy = "ј";
var Jukcy = "Є";
var jukcy = "є";
var Kappa$1 = "Κ";
var kappa$1 = "κ";
var kappav = "ϰ";
var Kcedil = "Ķ";
var kcedil = "ķ";
var Kcy = "К";
var kcy = "к";
var Kfr = "𝔎";
var kfr = "𝔨";
var kgreen = "ĸ";
var KHcy = "Х";
var khcy = "х";
var KJcy = "Ќ";
var kjcy = "ќ";
var Kopf = "𝕂";
var kopf$1 = "𝕜";
var Kscr = "𝒦";
var kscr = "𝓀";
var lAarr = "⇚";
var Lacute = "Ĺ";
var lacute = "ĺ";
var laemptyv = "⦴";
var lagran = "ℒ";
var Lambda$1 = "Λ";
var lambda$1 = "λ";
var Lang = "⟪";
var lang$1 = "⟨";
var langd = "⦑";
var langle = "⟨";
var lap$1 = "⪅";
var Laplacetrf = "ℒ";
var laquo = "«";
var Larr = "↞";
var lArr = "⇐";
var larr = "←";
var larrb = "⇤";
var larrbfs = "⤟";
var larrfs = "⤝";
var larrhk = "↩";
var larrlp = "↫";
var larrpl = "⤹";
var larrsim = "⥳";
var larrtl = "↢";
var lat$1 = "⪫";
var lAtail = "⤛";
var latail = "⤙";
var late$1 = "⪭";
var lates$1 = "⪭︀";
var lBarr = "⤎";
var lbarr = "⤌";
var lbbrk = "❲";
var lbrace = "{";
var lbrack = "[";
var lbrke = "⦋";
var lbrksld = "⦏";
var lbrkslu = "⦍";
var Lcaron = "Ľ";
var lcaron = "ľ";
var Lcedil = "Ļ";
var lcedil = "ļ";
var lceil = "⌈";
var lcub = "{";
var Lcy = "Л";
var lcy = "л";
var ldca = "⤶";
var ldquo = "“";
var ldquor = "„";
var ldrdhar = "⥧";
var ldrushar = "⥋";
var ldsh = "↲";
var lE = "≦";
var le$1 = "≤";
var LeftAngleBracket = "⟨";
var LeftArrow = "←";
var Leftarrow = "⇐";
var leftarrow = "←";
var LeftArrowBar = "⇤";
var LeftArrowRightArrow = "⇆";
var leftarrowtail = "↢";
var LeftCeiling = "⌈";
var LeftDoubleBracket = "⟦";
var LeftDownTeeVector = "⥡";
var LeftDownVector = "⇃";
var LeftDownVectorBar = "⥙";
var LeftFloor = "⌊";
var leftharpoondown = "↽";
var leftharpoonup = "↼";
var leftleftarrows = "⇇";
var LeftRightArrow = "↔";
var Leftrightarrow = "⇔";
var leftrightarrow = "↔";
var leftrightarrows = "⇆";
var leftrightharpoons = "⇋";
var leftrightsquigarrow = "↭";
var LeftRightVector = "⥎";
var LeftTee = "⊣";
var LeftTeeArrow = "↤";
var LeftTeeVector = "⥚";
var leftthreetimes = "⋋";
var LeftTriangle = "⊲";
var LeftTriangleBar = "⧏";
var LeftTriangleEqual = "⊴";
var LeftUpDownVector = "⥑";
var LeftUpTeeVector = "⥠";
var LeftUpVector = "↿";
var LeftUpVectorBar = "⥘";
var LeftVector = "↼";
var LeftVectorBar = "⥒";
var lEg = "⪋";
var leg$1 = "⋚";
var leq$1 = "≤";
var leqq = "≦";
var leqslant = "⩽";
var les$1 = "⩽";
var lescc = "⪨";
var lesdot = "⩿";
var lesdoto = "⪁";
var lesdotor = "⪃";
var lesg = "⋚︀";
var lesges = "⪓";
var lessapprox = "⪅";
var lessdot = "⋖";
var lesseqgtr = "⋚";
var lesseqqgtr = "⪋";
var LessEqualGreater = "⋚";
var LessFullEqual = "≦";
var LessGreater = "≶";
var lessgtr = "≶";
var LessLess = "⪡";
var lesssim = "≲";
var LessSlantEqual = "⩽";
var LessTilde = "≲";
var lfisht = "⥼";
var lfloor = "⌊";
var Lfr = "𝔏";
var lfr = "𝔩";
var lg$1 = "≶";
var lgE = "⪑";
var lHar = "⥢";
var lhard = "↽";
var lharu = "↼";
var lharul = "⥪";
var lhblk = "▄";
var LJcy = "Љ";
var ljcy = "љ";
var Ll = "⋘";
var ll$1 = "≪";
var llarr = "⇇";
var llcorner = "⌞";
var Lleftarrow = "⇚";
var llhard = "⥫";
var lltri = "◺";
var Lmidot = "Ŀ";
var lmidot = "ŀ";
var lmoust = "⎰";
var lmoustache = "⎰";
var lnap = "⪉";
var lnapprox = "⪉";
var lnE = "≨";
var lne$1 = "⪇";
var lneq = "⪇";
var lneqq = "≨";
var lnsim = "⋦";
var loang = "⟬";
var loarr = "⇽";
var lobrk = "⟦";
var LongLeftArrow = "⟵";
var Longleftarrow = "⟸";
var longleftarrow = "⟵";
var LongLeftRightArrow = "⟷";
var Longleftrightarrow = "⟺";
var longleftrightarrow = "⟷";
var longmapsto = "⟼";
var LongRightArrow = "⟶";
var Longrightarrow = "⟹";
var longrightarrow = "⟶";
var looparrowleft = "↫";
var looparrowright = "↬";
var lopar = "⦅";
var Lopf = "𝕃";
var lopf = "𝕝";
var loplus = "⨭";
var lotimes = "⨴";
var lowast = "∗";
var lowbar = "_";
var LowerLeftArrow = "↙";
var LowerRightArrow = "↘";
var loz = "◊";
var lozenge$1 = "◊";
var lozf = "⧫";
var lpar = "(";
var lparlt = "⦓";
var lrarr = "⇆";
var lrcorner = "⌟";
var lrhar = "⇋";
var lrhard = "⥭";
var lrm = "‎";
var lrtri = "⊿";
var lsaquo = "‹";
var Lscr = "ℒ";
var lscr = "𝓁";
var Lsh = "↰";
var lsh$1 = "↰";
var lsim = "≲";
var lsime = "⪍";
var lsimg = "⪏";
var lsqb = "[";
var lsquo = "‘";
var lsquor = "‚";
var Lstrok = "Ł";
var lstrok = "ł";
var LT$1 = "<";
var Lt = "≪";
var lt$1 = "<";
var ltcc = "⪦";
var ltcir = "⩹";
var ltdot = "⋖";
var lthree = "⋋";
var ltimes$1 = "⋉";
var ltlarr = "⥶";
var ltquest = "⩻";
var ltri = "◃";
var ltrie = "⊴";
var ltrif = "◂";
var ltrPar = "⦖";
var lurdshar = "⥊";
var luruhar = "⥦";
var lvertneqq = "≨︀";
var lvnE = "≨︀";
var macr = "¯";
var male$1 = "♂";
var malt$1 = "✠";
var maltese = "✠";
var map$1 = "↦";
var mapsto = "↦";
var mapstodown = "↧";
var mapstoleft = "↤";
var mapstoup = "↥";
var marker$1 = "▮";
var mcomma = "⨩";
var Mcy = "М";
var mcy = "м";
var mdash = "—";
var mDDot = "∺";
var measuredangle = "∡";
var MediumSpace = " ";
var Mellintrf = "ℳ";
var Mfr = "𝔐";
var mfr = "𝔪";
var mho = "℧";
var micro = "µ";
var mid$1 = "∣";
var midast = "*";
var midcir = "⫰";
var middot = "·";
var minus$1 = "−";
var minusb = "⊟";
var minusd = "∸";
var minusdu = "⨪";
var MinusPlus = "∓";
var mlcp = "⫛";
var mldr = "…";
var mnplus = "∓";
var models$1 = "⊧";
var Mopf = "𝕄";
var mopf = "𝕞";
var mp$1 = "∓";
var Mscr = "ℳ";
var mscr = "𝓂";
var mstpos = "∾";
var Mu = "Μ";
var mu$1 = "μ";
var multimap = "⊸";
var mumap = "⊸";
var nabla = "∇";
var Nacute = "Ń";
var nacute = "ń";
var nang$1 = "∠⃒";
var nap$1 = "≉";
var napE = "⩰̸";
var napid = "≋̸";
var napos = "ŉ";
var napprox = "≉";
var natur = "♮";
var natural$1 = "♮";
var naturals$1 = "ℕ";
var nbsp = " ";
var nbump = "≎̸";
var nbumpe = "≏̸";
var ncap = "⩃";
var Ncaron = "Ň";
var ncaron = "ň";
var Ncedil = "Ņ";
var ncedil = "ņ";
var ncong = "≇";
var ncongdot = "⩭̸";
var ncup = "⩂";
var Ncy = "Н";
var ncy$1 = "н";
var ndash = "–";
var ne$1 = "≠";
var nearhk = "⤤";
var neArr = "⇗";
var nearr = "↗";
var nearrow = "↗";
var nedot = "≐̸";
var NegativeMediumSpace = "​";
var NegativeThickSpace = "​";
var NegativeThinSpace = "​";
var NegativeVeryThinSpace = "​";
var nequiv = "≢";
var nesear = "⤨";
var nesim = "≂̸";
var NestedGreaterGreater = "≫";
var NestedLessLess = "≪";
var NewLine = "\n";
var nexist = "∄";
var nexists = "∄";
var Nfr = "𝔑";
var nfr = "𝔫";
var ngE = "≧̸";
var nge$1 = "≱";
var ngeq = "≱";
var ngeqq = "≧̸";
var ngeqslant = "⩾̸";
var nges = "⩾̸";
var nGg = "⋙̸";
var ngsim = "≵";
var nGt = "≫⃒";
var ngt$1 = "≯";
var ngtr = "≯";
var nGtv = "≫̸";
var nhArr = "⇎";
var nharr = "↮";
var nhpar = "⫲";
var ni$1 = "∋";
var nis$1 = "⋼";
var nisd = "⋺";
var niv = "∋";
var NJcy = "Њ";
var njcy = "њ";
var nlArr = "⇍";
var nlarr = "↚";
var nldr = "‥";
var nlE = "≦̸";
var nle$1 = "≰";
var nLeftarrow = "⇍";
var nleftarrow = "↚";
var nLeftrightarrow = "⇎";
var nleftrightarrow = "↮";
var nleq = "≰";
var nleqq = "≦̸";
var nleqslant = "⩽̸";
var nles$1 = "⩽̸";
var nless$1 = "≮";
var nLl = "⋘̸";
var nlsim = "≴";
var nLt = "≪⃒";
var nlt$1 = "≮";
var nltri = "⋪";
var nltrie = "⋬";
var nLtv = "≪̸";
var nmid = "∤";
var NoBreak = "⁠";
var NonBreakingSpace = " ";
var Nopf = "ℕ";
var nopf$1 = "𝕟";
var Not$1 = "⫬";
var not$1 = "¬";
var NotCongruent = "≢";
var NotCupCap = "≭";
var NotDoubleVerticalBar = "∦";
var NotElement = "∉";
var NotEqual = "≠";
var NotEqualTilde = "≂̸";
var NotExists = "∄";
var NotGreater = "≯";
var NotGreaterEqual = "≱";
var NotGreaterFullEqual = "≧̸";
var NotGreaterGreater = "≫̸";
var NotGreaterLess = "≹";
var NotGreaterSlantEqual = "⩾̸";
var NotGreaterTilde = "≵";
var NotHumpDownHump = "≎̸";
var NotHumpEqual = "≏̸";
var notin = "∉";
var notindot = "⋵̸";
var notinE = "⋹̸";
var notinva = "∉";
var notinvb = "⋷";
var notinvc = "⋶";
var NotLeftTriangle = "⋪";
var NotLeftTriangleBar = "⧏̸";
var NotLeftTriangleEqual = "⋬";
var NotLess = "≮";
var NotLessEqual = "≰";
var NotLessGreater = "≸";
var NotLessLess = "≪̸";
var NotLessSlantEqual = "⩽̸";
var NotLessTilde = "≴";
var NotNestedGreaterGreater = "⪢̸";
var NotNestedLessLess = "⪡̸";
var notni = "∌";
var notniva = "∌";
var notnivb = "⋾";
var notnivc = "⋽";
var NotPrecedes = "⊀";
var NotPrecedesEqual = "⪯̸";
var NotPrecedesSlantEqual = "⋠";
var NotReverseElement = "∌";
var NotRightTriangle = "⋫";
var NotRightTriangleBar = "⧐̸";
var NotRightTriangleEqual = "⋭";
var NotSquareSubset = "⊏̸";
var NotSquareSubsetEqual = "⋢";
var NotSquareSuperset = "⊐̸";
var NotSquareSupersetEqual = "⋣";
var NotSubset = "⊂⃒";
var NotSubsetEqual = "⊈";
var NotSucceeds = "⊁";
var NotSucceedsEqual = "⪰̸";
var NotSucceedsSlantEqual = "⋡";
var NotSucceedsTilde = "≿̸";
var NotSuperset = "⊃⃒";
var NotSupersetEqual = "⊉";
var NotTilde = "≁";
var NotTildeEqual = "≄";
var NotTildeFullEqual = "≇";
var NotTildeTilde = "≉";
var NotVerticalBar = "∤";
var npar = "∦";
var nparallel = "∦";
var nparsl = "⫽⃥";
var npart = "∂̸";
var npolint = "⨔";
var npr = "⊀";
var nprcue = "⋠";
var npre = "⪯̸";
var nprec = "⊀";
var npreceq = "⪯̸";
var nrArr = "⇏";
var nrarr = "↛";
var nrarrc = "⤳̸";
var nrarrw = "↝̸";
var nRightarrow = "⇏";
var nrightarrow = "↛";
var nrtri = "⋫";
var nrtrie = "⋭";
var nsc$1 = "⊁";
var nsccue = "⋡";
var nsce$1 = "⪰̸";
var Nscr = "𝒩";
var nscr = "𝓃";
var nshortmid = "∤";
var nshortparallel = "∦";
var nsim = "≁";
var nsime = "≄";
var nsimeq = "≄";
var nsmid = "∤";
var nspar = "∦";
var nsqsube = "⋢";
var nsqsupe = "⋣";
var nsub = "⊄";
var nsubE = "⫅̸";
var nsube = "⊈";
var nsubset = "⊂⃒";
var nsubseteq = "⊈";
var nsubseteqq = "⫅̸";
var nsucc = "⊁";
var nsucceq = "⪰̸";
var nsup = "⊅";
var nsupE = "⫆̸";
var nsupe = "⊉";
var nsupset = "⊃⃒";
var nsupseteq = "⊉";
var nsupseteqq = "⫆̸";
var ntgl = "≹";
var Ntilde = "Ñ";
var ntilde = "ñ";
var ntlg = "≸";
var ntriangleleft = "⋪";
var ntrianglelefteq = "⋬";
var ntriangleright = "⋫";
var ntrianglerighteq = "⋭";
var Nu = "Ν";
var nu$1 = "ν";
var num$1 = "#";
var numero = "№";
var numsp = " ";
var nvap = "≍⃒";
var nVDash = "⊯";
var nVdash = "⊮";
var nvDash = "⊭";
var nvdash = "⊬";
var nvge = "≥⃒";
var nvgt = ">⃒";
var nvHarr = "⤄";
var nvinfin = "⧞";
var nvlArr = "⤂";
var nvle = "≤⃒";
var nvlt = "<⃒";
var nvltrie = "⊴⃒";
var nvrArr = "⤃";
var nvrtrie = "⊵⃒";
var nvsim = "∼⃒";
var nwarhk = "⤣";
var nwArr = "⇖";
var nwarr = "↖";
var nwarrow = "↖";
var nwnear = "⤧";
var Oacute = "Ó";
var oacute = "ó";
var oast = "⊛";
var ocir = "⊚";
var Ocirc = "Ô";
var ocirc = "ô";
var Ocy = "О";
var ocy = "о";
var odash = "⊝";
var Odblac = "Ő";
var odblac = "ő";
var odiv = "⨸";
var odot = "⊙";
var odsold = "⦼";
var OElig = "Œ";
var oelig = "œ";
var ofcir = "⦿";
var Ofr = "𝔒";
var ofr = "𝔬";
var ogon = "˛";
var Ograve = "Ò";
var ograve = "ò";
var ogt$1 = "⧁";
var ohbar = "⦵";
var ohm$1 = "Ω";
var oint = "∮";
var olarr = "↺";
var olcir = "⦾";
var olcross = "⦻";
var oline$1 = "‾";
var olt$1 = "⧀";
var Omacr = "Ō";
var omacr = "ō";
var Omega$1 = "Ω";
var omega$1 = "ω";
var Omicron$1 = "Ο";
var omicron$1 = "ο";
var omid = "⦶";
var ominus = "⊖";
var Oopf = "𝕆";
var oopf$1 = "𝕠";
var opar$1 = "⦷";
var OpenCurlyDoubleQuote = "“";
var OpenCurlyQuote = "‘";
var operp = "⦹";
var oplus = "⊕";
var Or = "⩔";
var or$1 = "∨";
var orarr = "↻";
var ord = "⩝";
var order$1 = "ℴ";
var orderof = "ℴ";
var ordf = "ª";
var ordm = "º";
var origof = "⊶";
var oror$1 = "⩖";
var orslope = "⩗";
var orv$1 = "⩛";
var oS = "Ⓢ";
var Oscr = "𝒪";
var oscr = "ℴ";
var Oslash = "Ø";
var oslash = "ø";
var osol$1 = "⊘";
var Otilde = "Õ";
var otilde = "õ";
var Otimes = "⨷";
var otimes = "⊗";
var otimesas = "⨶";
var Ouml = "Ö";
var ouml = "ö";
var ovbar = "⌽";
var OverBar = "‾";
var OverBrace = "⏞";
var OverBracket = "⎴";
var OverParenthesis = "⏜";
var par$1 = "∥";
var para$1 = "¶";
var parallel$1 = "∥";
var parsim = "⫳";
var parsl = "⫽";
var part$1 = "∂";
var PartialD = "∂";
var Pcy = "П";
var pcy = "п";
var percnt = "%";
var period = ".";
var permil = "‰";
var perp = "⊥";
var pertenk = "‱";
var Pfr = "𝔓";
var pfr = "𝔭";
var Phi = "Φ";
var phi$1 = "φ";
var phiv = "ϕ";
var phmmat = "ℳ";
var phone$1 = "☎";
var Pi$1 = "Π";
var pi$1 = "π";
var pitchfork$1 = "⋔";
var piv = "ϖ";
var planck = "ℏ";
var planckh = "ℎ";
var plankv = "ℏ";
var plus$1 = "+";
var plusacir = "⨣";
var plusb = "⊞";
var pluscir = "⨢";
var plusdo = "∔";
var plusdu = "⨥";
var pluse = "⩲";
var PlusMinus = "±";
var plusmn = "±";
var plussim = "⨦";
var plustwo = "⨧";
var pm$1 = "±";
var Poincareplane = "ℌ";
var pointint = "⨕";
var Popf = "ℙ";
var popf$1 = "𝕡";
var pound$1 = "£";
var Pr = "⪻";
var pr$1 = "≺";
var prap = "⪷";
var prcue = "≼";
var prE = "⪳";
var pre = "⪯";
var prec = "≺";
var precapprox = "⪷";
var preccurlyeq = "≼";
var Precedes = "≺";
var PrecedesEqual = "⪯";
var PrecedesSlantEqual = "≼";
var PrecedesTilde = "≾";
var preceq = "⪯";
var precnapprox = "⪹";
var precneqq = "⪵";
var precnsim = "⋨";
var precsim = "≾";
var Prime = "″";
var prime$1 = "′";
var primes$1 = "ℙ";
var prnap = "⪹";
var prnE = "⪵";
var prnsim = "⋨";
var prod$1 = "∏";
var Product$1 = "∏";
var profalar = "⌮";
var profline = "⌒";
var profsurf = "⌓";
var prop$1 = "∝";
var Proportion$1 = "∷";
var Proportional$1 = "∝";
var propto = "∝";
var prsim = "≾";
var prurel = "⊰";
var Pscr = "𝒫";
var pscr = "𝓅";
var Psi = "Ψ";
var psi$1 = "ψ";
var puncsp = " ";
var Qfr = "𝔔";
var qfr = "𝔮";
var qint = "⨌";
var Qopf = "ℚ";
var qopf = "𝕢";
var qprime = "⁗";
var Qscr = "𝒬";
var qscr = "𝓆";
var quaternions = "ℍ";
var quatint = "⨖";
var quest$1 = "?";
var questeq = "≟";
var QUOT$1 = "\"";
var quot$1 = "\"";
var rAarr = "⇛";
var race$1 = "∽̱";
var Racute = "Ŕ";
var racute = "ŕ";
var radic = "√";
var raemptyv = "⦳";
var Rang = "⟫";
var rang$1 = "⟩";
var rangd = "⦒";
var range$1 = "⦥";
var rangle = "⟩";
var raquo = "»";
var Rarr = "↠";
var rArr = "⇒";
var rarr = "→";
var rarrap = "⥵";
var rarrb = "⇥";
var rarrbfs = "⤠";
var rarrc = "⤳";
var rarrfs = "⤞";
var rarrhk = "↪";
var rarrlp = "↬";
var rarrpl = "⥅";
var rarrsim = "⥴";
var Rarrtl = "⤖";
var rarrtl = "↣";
var rarrw = "↝";
var rAtail = "⤜";
var ratail = "⤚";
var ratio$1 = "∶";
var rationals = "ℚ";
var RBarr = "⤐";
var rBarr = "⤏";
var rbarr = "⤍";
var rbbrk = "❳";
var rbrace = "}";
var rbrack = "]";
var rbrke = "⦌";
var rbrksld = "⦎";
var rbrkslu = "⦐";
var Rcaron = "Ř";
var rcaron = "ř";
var Rcedil = "Ŗ";
var rcedil = "ŗ";
var rceil = "⌉";
var rcub = "}";
var Rcy = "Р";
var rcy = "р";
var rdca = "⤷";
var rdldhar = "⥩";
var rdquo = "”";
var rdquor = "”";
var rdsh = "↳";
var Re$1 = "ℜ";
var real$1 = "ℜ";
var realine = "ℛ";
var realpart = "ℜ";
var reals$1 = "ℝ";
var rect$1 = "▭";
var REG$1 = "®";
var reg$1 = "®";
var ReverseElement = "∋";
var ReverseEquilibrium = "⇋";
var ReverseUpEquilibrium = "⥯";
var rfisht = "⥽";
var rfloor = "⌋";
var Rfr = "ℜ";
var rfr = "𝔯";
var rHar = "⥤";
var rhard = "⇁";
var rharu = "⇀";
var rharul = "⥬";
var Rho = "Ρ";
var rho = "ρ";
var rhov = "ϱ";
var RightAngleBracket = "⟩";
var RightArrow = "→";
var Rightarrow = "⇒";
var rightarrow = "→";
var RightArrowBar = "⇥";
var RightArrowLeftArrow = "⇄";
var rightarrowtail = "↣";
var RightCeiling = "⌉";
var RightDoubleBracket = "⟧";
var RightDownTeeVector = "⥝";
var RightDownVector = "⇂";
var RightDownVectorBar = "⥕";
var RightFloor = "⌋";
var rightharpoondown = "⇁";
var rightharpoonup = "⇀";
var rightleftarrows = "⇄";
var rightleftharpoons = "⇌";
var rightrightarrows = "⇉";
var rightsquigarrow = "↝";
var RightTee = "⊢";
var RightTeeArrow = "↦";
var RightTeeVector = "⥛";
var rightthreetimes = "⋌";
var RightTriangle = "⊳";
var RightTriangleBar = "⧐";
var RightTriangleEqual = "⊵";
var RightUpDownVector = "⥏";
var RightUpTeeVector = "⥜";
var RightUpVector = "↾";
var RightUpVectorBar = "⥔";
var RightVector = "⇀";
var RightVectorBar = "⥓";
var ring$1 = "˚";
var risingdotseq = "≓";
var rlarr = "⇄";
var rlhar = "⇌";
var rlm = "‏";
var rmoust = "⎱";
var rmoustache = "⎱";
var rnmid = "⫮";
var roang = "⟭";
var roarr = "⇾";
var robrk = "⟧";
var ropar = "⦆";
var Ropf = "ℝ";
var ropf = "𝕣";
var roplus = "⨮";
var rotimes = "⨵";
var RoundImplies = "⥰";
var rpar = ")";
var rpargt = "⦔";
var rppolint = "⨒";
var rrarr = "⇉";
var Rrightarrow = "⇛";
var rsaquo = "›";
var Rscr = "ℛ";
var rscr = "𝓇";
var Rsh = "↱";
var rsh$1 = "↱";
var rsqb = "]";
var rsquo = "’";
var rsquor = "’";
var rthree = "⋌";
var rtimes = "⋊";
var rtri = "▹";
var rtrie = "⊵";
var rtrif = "▸";
var rtriltri = "⧎";
var RuleDelayed = "⧴";
var ruluhar = "⥨";
var rx = "℞";
var Sacute = "Ś";
var sacute = "ś";
var sbquo = "‚";
var Sc = "⪼";
var sc$1 = "≻";
var scap$1 = "⪸";
var Scaron = "Š";
var scaron = "š";
var sccue = "≽";
var scE = "⪴";
var sce$1 = "⪰";
var Scedil = "Ş";
var scedil = "ş";
var Scirc = "Ŝ";
var scirc = "ŝ";
var scnap = "⪺";
var scnE = "⪶";
var scnsim = "⋩";
var scpolint = "⨓";
var scsim = "≿";
var Scy = "С";
var scy$1 = "с";
var sdot$1 = "⋅";
var sdotb = "⊡";
var sdote = "⩦";
var searhk = "⤥";
var seArr = "⇘";
var searr = "↘";
var searrow = "↘";
var sect$1 = "§";
var semi$1 = ";";
var seswar = "⤩";
var setminus = "∖";
var setmn = "∖";
var sext = "✶";
var Sfr = "𝔖";
var sfr = "𝔰";
var sfrown = "⌢";
var sharp$1 = "♯";
var SHCHcy = "Щ";
var shchcy = "щ";
var SHcy = "Ш";
var shcy = "ш";
var ShortDownArrow = "↓";
var ShortLeftArrow = "←";
var shortmid = "∣";
var shortparallel = "∥";
var ShortRightArrow = "→";
var ShortUpArrow = "↑";
var shy$1 = "­";
var Sigma$1 = "Σ";
var sigma$1 = "σ";
var sigmaf = "ς";
var sigmav = "ς";
var sim$1 = "∼";
var simdot = "⩪";
var sime = "≃";
var simeq = "≃";
var simg = "⪞";
var simgE = "⪠";
var siml = "⪝";
var simlE = "⪟";
var simne = "≆";
var simplus = "⨤";
var simrarr = "⥲";
var slarr = "←";
var SmallCircle = "∘";
var smallsetminus = "∖";
var smashp = "⨳";
var smeparsl = "⧤";
var smid = "∣";
var smile = "⌣";
var smt = "⪪";
var smte = "⪬";
var smtes = "⪬︀";
var SOFTcy = "Ь";
var softcy = "ь";
var sol$1 = "/";
var solb = "⧄";
var solbar = "⌿";
var Sopf = "𝕊";
var sopf = "𝕤";
var spades$1 = "♠";
var spadesuit = "♠";
var spar = "∥";
var sqcap = "⊓";
var sqcaps = "⊓︀";
var sqcup = "⊔";
var sqcups = "⊔︀";
var Sqrt = "√";
var sqsub = "⊏";
var sqsube = "⊑";
var sqsubset = "⊏";
var sqsubseteq = "⊑";
var sqsup = "⊐";
var sqsupe = "⊒";
var sqsupset = "⊐";
var sqsupseteq = "⊒";
var squ = "□";
var Square = "□";
var square$1 = "□";
var SquareIntersection = "⊓";
var SquareSubset = "⊏";
var SquareSubsetEqual = "⊑";
var SquareSuperset = "⊐";
var SquareSupersetEqual = "⊒";
var SquareUnion = "⊔";
var squarf = "▪";
var squf = "▪";
var srarr = "→";
var Sscr = "𝒮";
var sscr = "𝓈";
var ssetmn = "∖";
var ssmile = "⌣";
var sstarf = "⋆";
var Star$1 = "⋆";
var star$1 = "☆";
var starf = "★";
var straightepsilon = "ϵ";
var straightphi = "ϕ";
var strns = "¯";
var Sub$1 = "⋐";
var sub$1 = "⊂";
var subdot = "⪽";
var subE = "⫅";
var sube$1 = "⊆";
var subedot = "⫃";
var submult = "⫁";
var subnE = "⫋";
var subne = "⊊";
var subplus = "⪿";
var subrarr = "⥹";
var Subset = "⋐";
var subset = "⊂";
var subseteq = "⊆";
var subseteqq = "⫅";
var SubsetEqual = "⊆";
var subsetneq = "⊊";
var subsetneqq = "⫋";
var subsim = "⫇";
var subsub = "⫕";
var subsup = "⫓";
var succ = "≻";
var succapprox = "⪸";
var succcurlyeq = "≽";
var Succeeds = "≻";
var SucceedsEqual = "⪰";
var SucceedsSlantEqual = "≽";
var SucceedsTilde = "≿";
var succeq = "⪰";
var succnapprox = "⪺";
var succneqq = "⪶";
var succnsim = "⋩";
var succsim = "≿";
var SuchThat = "∋";
var Sum$1 = "∑";
var sum$1 = "∑";
var sung = "♪";
var Sup = "⋑";
var sup = "⊃";
var sup1 = "¹";
var sup2 = "²";
var sup3 = "³";
var supdot = "⪾";
var supdsub = "⫘";
var supE = "⫆";
var supe = "⊇";
var supedot = "⫄";
var Superset = "⊃";
var SupersetEqual = "⊇";
var suphsol = "⟉";
var suphsub = "⫗";
var suplarr = "⥻";
var supmult = "⫂";
var supnE = "⫌";
var supne = "⊋";
var supplus = "⫀";
var Supset = "⋑";
var supset = "⊃";
var supseteq = "⊇";
var supseteqq = "⫆";
var supsetneq = "⊋";
var supsetneqq = "⫌";
var supsim = "⫈";
var supsub = "⫔";
var supsup = "⫖";
var swarhk = "⤦";
var swArr = "⇙";
var swarr = "↙";
var swarrow = "↙";
var swnwar = "⤪";
var szlig = "ß";
var Tab$1 = "\t";
var target$1 = "⌖";
var Tau$1 = "Τ";
var tau$1 = "τ";
var tbrk = "⎴";
var Tcaron = "Ť";
var tcaron = "ť";
var Tcedil = "Ţ";
var tcedil = "ţ";
var Tcy = "Т";
var tcy = "т";
var tdot = "⃛";
var telrec = "⌕";
var Tfr = "𝔗";
var tfr = "𝔱";
var there4 = "∴";
var Therefore = "∴";
var therefore$1 = "∴";
var Theta$1 = "Θ";
var theta$1 = "θ";
var thetasym = "ϑ";
var thetav = "ϑ";
var thickapprox = "≈";
var thicksim = "∼";
var ThickSpace = "  ";
var thinsp = " ";
var ThinSpace = " ";
var thkap = "≈";
var thksim = "∼";
var THORN$1 = "Þ";
var thorn$1 = "þ";
var Tilde$1 = "∼";
var tilde$1 = "˜";
var TildeEqual = "≃";
var TildeFullEqual = "≅";
var TildeTilde = "≈";
var times$1 = "×";
var timesb = "⊠";
var timesbar = "⨱";
var timesd = "⨰";
var tint$1 = "∭";
var toea = "⤨";
var top$1 = "⊤";
var topbot = "⌶";
var topcir = "⫱";
var Topf = "𝕋";
var topf = "𝕥";
var topfork = "⫚";
var tosa$1 = "⤩";
var tprime = "‴";
var TRADE$1 = "™";
var trade$1 = "™";
var triangle$1 = "▵";
var triangledown = "▿";
var triangleleft = "◃";
var trianglelefteq = "⊴";
var triangleq = "≜";
var triangleright = "▹";
var trianglerighteq = "⊵";
var tridot = "◬";
var trie$1 = "≜";
var triminus = "⨺";
var TripleDot = "⃛";
var triplus = "⨹";
var trisb = "⧍";
var tritime = "⨻";
var trpezium = "⏢";
var Tscr = "𝒯";
var tscr = "𝓉";
var TScy = "Ц";
var tscy = "ц";
var TSHcy = "Ћ";
var tshcy = "ћ";
var Tstrok = "Ŧ";
var tstrok = "ŧ";
var twixt = "≬";
var twoheadleftarrow = "↞";
var twoheadrightarrow = "↠";
var Uacute = "Ú";
var uacute = "ú";
var Uarr = "↟";
var uArr = "⇑";
var uarr = "↑";
var Uarrocir = "⥉";
var Ubrcy = "Ў";
var ubrcy = "ў";
var Ubreve = "Ŭ";
var ubreve = "ŭ";
var Ucirc = "Û";
var ucirc = "û";
var Ucy = "У";
var ucy$1 = "у";
var udarr = "⇅";
var Udblac = "Ű";
var udblac = "ű";
var udhar = "⥮";
var ufisht = "⥾";
var Ufr = "𝔘";
var ufr = "𝔲";
var Ugrave = "Ù";
var ugrave = "ù";
var uHar = "⥣";
var uharl = "↿";
var uharr = "↾";
var uhblk = "▀";
var ulcorn = "⌜";
var ulcorner = "⌜";
var ulcrop = "⌏";
var ultri = "◸";
var Umacr = "Ū";
var umacr = "ū";
var uml$1 = "¨";
var UnderBar = "_";
var UnderBrace = "⏟";
var UnderBracket = "⎵";
var UnderParenthesis = "⏝";
var Union$1 = "⋃";
var UnionPlus = "⊎";
var Uogon = "Ų";
var uogon = "ų";
var Uopf = "𝕌";
var uopf = "𝕦";
var UpArrow = "↑";
var Uparrow = "⇑";
var uparrow = "↑";
var UpArrowBar = "⤒";
var UpArrowDownArrow = "⇅";
var UpDownArrow = "↕";
var Updownarrow = "⇕";
var updownarrow = "↕";
var UpEquilibrium = "⥮";
var upharpoonleft = "↿";
var upharpoonright = "↾";
var uplus$1 = "⊎";
var UpperLeftArrow = "↖";
var UpperRightArrow = "↗";
var Upsi$1 = "ϒ";
var upsi$1 = "υ";
var upsih = "ϒ";
var Upsilon = "Υ";
var upsilon = "υ";
var UpTee = "⊥";
var UpTeeArrow = "↥";
var upuparrows = "⇈";
var urcorn = "⌝";
var urcorner = "⌝";
var urcrop = "⌎";
var Uring = "Ů";
var uring$1 = "ů";
var urtri = "◹";
var Uscr = "𝒰";
var uscr = "𝓊";
var utdot = "⋰";
var Utilde = "Ũ";
var utilde = "ũ";
var utri = "▵";
var utrif = "▴";
var uuarr = "⇈";
var Uuml = "Ü";
var uuml = "ü";
var uwangle = "⦧";
var vangrt = "⦜";
var varepsilon = "ϵ";
var varkappa = "ϰ";
var varnothing = "∅";
var varphi = "ϕ";
var varpi = "ϖ";
var varpropto = "∝";
var vArr = "⇕";
var varr = "↕";
var varrho = "ϱ";
var varsigma = "ς";
var varsubsetneq = "⊊︀";
var varsubsetneqq = "⫋︀";
var varsupsetneq = "⊋︀";
var varsupsetneqq = "⫌︀";
var vartheta = "ϑ";
var vartriangleleft = "⊲";
var vartriangleright = "⊳";
var Vbar = "⫫";
var vBar = "⫨";
var vBarv = "⫩";
var Vcy = "В";
var vcy = "в";
var VDash = "⊫";
var Vdash = "⊩";
var vDash = "⊨";
var vdash = "⊢";
var Vdashl = "⫦";
var Vee = "⋁";
var vee$1 = "∨";
var veebar = "⊻";
var veeeq = "≚";
var vellip = "⋮";
var Verbar = "‖";
var verbar = "|";
var Vert$1 = "‖";
var vert$1 = "|";
var VerticalBar = "∣";
var VerticalLine = "|";
var VerticalSeparator = "❘";
var VerticalTilde = "≀";
var VeryThinSpace = " ";
var Vfr = "𝔙";
var vfr = "𝔳";
var vltri = "⊲";
var vnsub = "⊂⃒";
var vnsup = "⊃⃒";
var Vopf = "𝕍";
var vopf = "𝕧";
var vprop = "∝";
var vrtri = "⊳";
var Vscr = "𝒱";
var vscr = "𝓋";
var vsubnE = "⫋︀";
var vsubne = "⊊︀";
var vsupnE = "⫌︀";
var vsupne = "⊋︀";
var Vvdash = "⊪";
var vzigzag = "⦚";
var Wcirc = "Ŵ";
var wcirc = "ŵ";
var wedbar = "⩟";
var Wedge$1 = "⋀";
var wedge$1 = "∧";
var wedgeq = "≙";
var weierp = "℘";
var Wfr = "𝔚";
var wfr = "𝔴";
var Wopf = "𝕎";
var wopf = "𝕨";
var wp = "℘";
var wr = "≀";
var wreath$1 = "≀";
var Wscr = "𝒲";
var wscr = "𝓌";
var xcap = "⋂";
var xcirc = "◯";
var xcup = "⋃";
var xdtri = "▽";
var Xfr = "𝔛";
var xfr = "𝔵";
var xhArr = "⟺";
var xharr = "⟷";
var Xi$1 = "Ξ";
var xi$1 = "ξ";
var xlArr = "⟸";
var xlarr = "⟵";
var xmap = "⟼";
var xnis = "⋻";
var xodot = "⨀";
var Xopf = "𝕏";
var xopf = "𝕩";
var xoplus = "⨁";
var xotime = "⨂";
var xrArr = "⟹";
var xrarr = "⟶";
var Xscr = "𝒳";
var xscr = "𝓍";
var xsqcup = "⨆";
var xuplus = "⨄";
var xutri = "△";
var xvee = "⋁";
var xwedge = "⋀";
var Yacute = "Ý";
var yacute = "ý";
var YAcy = "Я";
var yacy = "я";
var Ycirc$1 = "Ŷ";
var ycirc$1 = "ŷ";
var Ycy = "Ы";
var ycy$1 = "ы";
var yen$1 = "¥";
var Yfr = "𝔜";
var yfr = "𝔶";
var YIcy = "Ї";
var yicy = "ї";
var Yopf = "𝕐";
var yopf = "𝕪";
var Yscr = "𝒴";
var yscr = "𝓎";
var YUcy = "Ю";
var yucy = "ю";
var Yuml = "Ÿ";
var yuml = "ÿ";
var Zacute$1 = "Ź";
var zacute$1 = "ź";
var Zcaron = "Ž";
var zcaron = "ž";
var Zcy = "З";
var zcy = "з";
var Zdot = "Ż";
var zdot = "ż";
var zeetrf = "ℨ";
var ZeroWidthSpace = "​";
var Zeta$1 = "Ζ";
var zeta$1 = "ζ";
var Zfr = "ℨ";
var zfr = "𝔷";
var ZHcy = "Ж";
var zhcy = "ж";
var zigrarr = "⇝";
var Zopf = "ℤ";
var zopf = "𝕫";
var Zscr = "𝒵";
var zscr = "𝓏";
var zwj = "‍";
var zwnj = "‌";
var allNamedEntitiesJson = {
  Aacute: Aacute,
  aacute: aacute,
  Abreve: Abreve,
  abreve: abreve,
  ac: ac$1,
  acd: acd,
  acE: acE,
  Acirc: Acirc,
  acirc: acirc,
  acute: acute$1,
  Acy: Acy,
  acy: acy,
  AElig: AElig,
  aelig: aelig,
  af: af,
  Afr: Afr,
  afr: afr,
  Agrave: Agrave,
  agrave: agrave,
  alefsym: alefsym,
  aleph: aleph,
  Alpha: Alpha$1,
  alpha: alpha$1,
  Amacr: Amacr,
  amacr: amacr,
  amalg: amalg,
  AMP: AMP,
  amp: amp$1,
  And: And$1,
  and: and$1,
  andand: andand,
  andd: andd,
  andslope: andslope,
  andv: andv,
  ang: ang,
  ange: ange$1,
  angle: angle$1,
  angmsd: angmsd,
  angmsdaa: angmsdaa,
  angmsdab: angmsdab,
  angmsdac: angmsdac,
  angmsdad: angmsdad,
  angmsdae: angmsdae,
  angmsdaf: angmsdaf,
  angmsdag: angmsdag,
  angmsdah: angmsdah,
  angrt: angrt,
  angrtvb: angrtvb,
  angrtvbd: angrtvbd,
  angsph: angsph,
  angst: angst$1,
  angzarr: angzarr,
  Aogon: Aogon,
  aogon: aogon,
  Aopf: Aopf,
  aopf: aopf,
  ap: ap$1,
  apacir: apacir,
  apE: apE,
  ape: ape$1,
  apid: apid,
  apos: apos,
  ApplyFunction: ApplyFunction,
  approx: approx$1,
  approxeq: approxeq,
  Aring: Aring$1,
  aring: aring$1,
  Ascr: Ascr$1,
  ascr: ascr$1,
  Assign: Assign$1,
  ast: ast$1,
  asymp: asymp,
  asympeq: asympeq,
  Atilde: Atilde,
  atilde: atilde$1,
  Auml: Auml,
  auml: auml,
  awconint: awconint,
  awint: awint,
  backcong: backcong,
  backepsilon: backepsilon,
  backprime: backprime,
  backsim: backsim,
  backsimeq: backsimeq,
  Backslash: Backslash$1,
  Barv: Barv,
  barvee: barvee,
  Barwed: Barwed,
  barwed: barwed,
  barwedge: barwedge$1,
  bbrk: bbrk,
  bbrktbrk: bbrktbrk,
  bcong: bcong,
  Bcy: Bcy,
  bcy: bcy,
  bdquo: bdquo,
  becaus: becaus$1,
  Because: Because$1,
  because: because$1,
  bemptyv: bemptyv,
  bepsi: bepsi$1,
  bernou: bernou,
  Bernoullis: Bernoullis$1,
  Beta: Beta$1,
  beta: beta$1,
  beth: beth$1,
  between: between$1,
  Bfr: Bfr,
  bfr: bfr,
  bigcap: bigcap,
  bigcirc: bigcirc,
  bigcup: bigcup,
  bigodot: bigodot,
  bigoplus: bigoplus,
  bigotimes: bigotimes,
  bigsqcup: bigsqcup,
  bigstar: bigstar,
  bigtriangledown: bigtriangledown,
  bigtriangleup: bigtriangleup,
  biguplus: biguplus,
  bigvee: bigvee,
  bigwedge: bigwedge,
  bkarow: bkarow,
  blacklozenge: blacklozenge,
  blacksquare: blacksquare,
  blacktriangle: blacktriangle,
  blacktriangledown: blacktriangledown,
  blacktriangleleft: blacktriangleleft,
  blacktriangleright: blacktriangleright,
  blank: blank$1,
  blk12: blk12,
  blk14: blk14,
  blk34: blk34,
  block: block$1,
  bne: bne,
  bnequiv: bnequiv,
  bNot: bNot,
  bnot: bnot,
  Bopf: Bopf,
  bopf: bopf,
  bot: bot$1,
  bottom: bottom$1,
  bowtie: bowtie$1,
  boxbox: boxbox,
  boxDL: boxDL,
  boxDl: boxDl,
  boxdL: boxdL,
  boxdl: boxdl,
  boxDR: boxDR,
  boxDr: boxDr,
  boxdR: boxdR,
  boxdr: boxdr,
  boxH: boxH,
  boxh: boxh,
  boxHD: boxHD,
  boxHd: boxHd,
  boxhD: boxhD,
  boxhd: boxhd,
  boxHU: boxHU,
  boxHu: boxHu,
  boxhU: boxhU,
  boxhu: boxhu,
  boxminus: boxminus,
  boxplus: boxplus,
  boxtimes: boxtimes,
  boxUL: boxUL,
  boxUl: boxUl,
  boxuL: boxuL,
  boxul: boxul,
  boxUR: boxUR,
  boxUr: boxUr,
  boxuR: boxuR,
  boxur: boxur,
  boxV: boxV,
  boxv: boxv,
  boxVH: boxVH,
  boxVh: boxVh,
  boxvH: boxvH,
  boxvh: boxvh,
  boxVL: boxVL,
  boxVl: boxVl,
  boxvL: boxvL,
  boxvl: boxvl,
  boxVR: boxVR,
  boxVr: boxVr,
  boxvR: boxvR,
  boxvr: boxvr,
  bprime: bprime,
  Breve: Breve,
  breve: breve$1,
  brvbar: brvbar,
  Bscr: Bscr,
  bscr: bscr,
  bsemi: bsemi,
  bsim: bsim,
  bsime: bsime,
  bsol: bsol,
  bsolb: bsolb,
  bsolhsub: bsolhsub,
  bull: bull$1,
  bullet: bullet$1,
  bump: bump$1,
  bumpE: bumpE,
  bumpe: bumpe,
  Bumpeq: Bumpeq,
  bumpeq: bumpeq,
  Cacute: Cacute,
  cacute: cacute$1,
  Cap: Cap$1,
  cap: cap$1,
  capand: capand$1,
  capbrcup: capbrcup,
  capcap: capcap,
  capcup: capcup,
  capdot: capdot,
  CapitalDifferentialD: CapitalDifferentialD,
  caps: caps$1,
  caret: caret$1,
  caron: caron$1,
  Cayleys: Cayleys,
  ccaps: ccaps,
  Ccaron: Ccaron,
  ccaron: ccaron,
  Ccedil: Ccedil,
  ccedil: ccedil,
  Ccirc: Ccirc,
  ccirc: ccirc,
  Cconint: Cconint,
  ccups: ccups,
  ccupssm: ccupssm,
  Cdot: Cdot,
  cdot: cdot,
  cedil: cedil$1,
  Cedilla: Cedilla$1,
  cemptyv: cemptyv,
  cent: cent$1,
  CenterDot: CenterDot,
  centerdot: centerdot,
  Cfr: Cfr,
  cfr: cfr,
  CHcy: CHcy,
  chcy: chcy,
  check: check$1,
  checkmark: checkmark$1,
  Chi: Chi$1,
  chi: chi$1,
  cir: cir$1,
  circ: circ$1,
  circeq: circeq,
  circlearrowleft: circlearrowleft,
  circlearrowright: circlearrowright,
  circledast: circledast,
  circledcirc: circledcirc,
  circleddash: circleddash,
  CircleDot: CircleDot,
  circledR: circledR,
  circledS: circledS,
  CircleMinus: CircleMinus,
  CirclePlus: CirclePlus,
  CircleTimes: CircleTimes,
  cirE: cirE,
  cire: cire,
  cirfnint: cirfnint,
  cirmid: cirmid,
  cirscir: cirscir,
  ClockwiseContourIntegral: ClockwiseContourIntegral,
  CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
  CloseCurlyQuote: CloseCurlyQuote,
  clubs: clubs$1,
  clubsuit: clubsuit$1,
  Colon: Colon$1,
  colon: colon$1,
  Colone: Colone$1,
  colone: colone$1,
  coloneq: coloneq,
  comma: comma$1,
  commat: commat$1,
  comp: comp$1,
  compfn: compfn,
  complement: complement$1,
  complexes: complexes$1,
  cong: cong$1,
  congdot: congdot,
  Congruent: Congruent$1,
  Conint: Conint,
  conint: conint$1,
  ContourIntegral: ContourIntegral,
  Copf: Copf,
  copf: copf$1,
  coprod: coprod$1,
  Coproduct: Coproduct,
  COPY: COPY$1,
  copy: copy$1,
  copysr: copysr,
  CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
  crarr: crarr,
  Cross: Cross$1,
  cross: cross$1,
  Cscr: Cscr,
  cscr: cscr,
  csub: csub,
  csube: csube,
  csup: csup,
  csupe: csupe,
  ctdot: ctdot,
  cudarrl: cudarrl,
  cudarrr: cudarrr,
  cuepr: cuepr,
  cuesc: cuesc,
  cularr: cularr,
  cularrp: cularrp,
  Cup: Cup$1,
  cup: cup$1,
  cupbrcap: cupbrcap,
  CupCap: CupCap,
  cupcap: cupcap,
  cupcup: cupcup,
  cupdot: cupdot,
  cupor: cupor,
  cups: cups$1,
  curarr: curarr,
  curarrm: curarrm,
  curlyeqprec: curlyeqprec,
  curlyeqsucc: curlyeqsucc,
  curlyvee: curlyvee,
  curlywedge: curlywedge,
  curren: curren,
  curvearrowleft: curvearrowleft,
  curvearrowright: curvearrowright,
  cuvee: cuvee,
  cuwed: cuwed,
  cwconint: cwconint,
  cwint: cwint,
  cylcty: cylcty,
  Dagger: Dagger$1,
  dagger: dagger$1,
  daleth: daleth$1,
  Darr: Darr,
  dArr: dArr,
  darr: darr$1,
  dash: dash$1,
  Dashv: Dashv,
  dashv: dashv,
  dbkarow: dbkarow,
  dblac: dblac,
  Dcaron: Dcaron,
  dcaron: dcaron,
  Dcy: Dcy,
  dcy: dcy,
  DD: DD$1,
  dd: dd$1,
  ddagger: ddagger,
  ddarr: ddarr,
  DDotrahd: DDotrahd,
  ddotseq: ddotseq,
  deg: deg$1,
  Del: Del$1,
  Delta: Delta$1,
  delta: delta$1,
  demptyv: demptyv,
  dfisht: dfisht,
  Dfr: Dfr,
  dfr: dfr,
  dHar: dHar,
  dharl: dharl,
  dharr: dharr$1,
  DiacriticalAcute: DiacriticalAcute,
  DiacriticalDot: DiacriticalDot,
  DiacriticalDoubleAcute: DiacriticalDoubleAcute,
  DiacriticalGrave: DiacriticalGrave,
  DiacriticalTilde: DiacriticalTilde,
  diam: diam$1,
  Diamond: Diamond$1,
  diamond: diamond$1,
  diamondsuit: diamondsuit,
  diams: diams$1,
  die: die$1,
  DifferentialD: DifferentialD,
  digamma: digamma$1,
  disin: disin$1,
  div: div$1,
  divide: divide$1,
  divideontimes: divideontimes,
  divonx: divonx,
  DJcy: DJcy,
  djcy: djcy,
  dlcorn: dlcorn,
  dlcrop: dlcrop,
  dollar: dollar$1,
  Dopf: Dopf,
  dopf: dopf$1,
  Dot: Dot$1,
  dot: dot$1,
  DotDot: DotDot,
  doteq: doteq,
  doteqdot: doteqdot,
  DotEqual: DotEqual,
  dotminus: dotminus,
  dotplus: dotplus,
  dotsquare: dotsquare,
  doublebarwedge: doublebarwedge,
  DoubleContourIntegral: DoubleContourIntegral,
  DoubleDot: DoubleDot,
  DoubleDownArrow: DoubleDownArrow,
  DoubleLeftArrow: DoubleLeftArrow,
  DoubleLeftRightArrow: DoubleLeftRightArrow,
  DoubleLeftTee: DoubleLeftTee,
  DoubleLongLeftArrow: DoubleLongLeftArrow,
  DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
  DoubleLongRightArrow: DoubleLongRightArrow,
  DoubleRightArrow: DoubleRightArrow,
  DoubleRightTee: DoubleRightTee,
  DoubleUpArrow: DoubleUpArrow,
  DoubleUpDownArrow: DoubleUpDownArrow,
  DoubleVerticalBar: DoubleVerticalBar,
  DownArrow: DownArrow,
  Downarrow: Downarrow,
  downarrow: downarrow,
  DownArrowBar: DownArrowBar,
  DownArrowUpArrow: DownArrowUpArrow,
  DownBreve: DownBreve,
  downdownarrows: downdownarrows,
  downharpoonleft: downharpoonleft,
  downharpoonright: downharpoonright,
  DownLeftRightVector: DownLeftRightVector,
  DownLeftTeeVector: DownLeftTeeVector,
  DownLeftVector: DownLeftVector,
  DownLeftVectorBar: DownLeftVectorBar,
  DownRightTeeVector: DownRightTeeVector,
  DownRightVector: DownRightVector,
  DownRightVectorBar: DownRightVectorBar,
  DownTee: DownTee,
  DownTeeArrow: DownTeeArrow,
  drbkarow: drbkarow,
  drcorn: drcorn,
  drcrop: drcrop,
  Dscr: Dscr,
  dscr: dscr,
  DScy: DScy,
  dscy: dscy,
  dsol: dsol$1,
  Dstrok: Dstrok,
  dstrok: dstrok,
  dtdot: dtdot,
  dtri: dtri$1,
  dtrif: dtrif,
  duarr: duarr,
  duhar: duhar,
  dwangle: dwangle,
  DZcy: DZcy,
  dzcy: dzcy,
  dzigrarr: dzigrarr,
  Eacute: Eacute,
  eacute: eacute,
  easter: easter$1,
  Ecaron: Ecaron,
  ecaron: ecaron,
  ecir: ecir$1,
  Ecirc: Ecirc,
  ecirc: ecirc,
  ecolon: ecolon$1,
  Ecy: Ecy,
  ecy: ecy$1,
  eDDot: eDDot,
  Edot: Edot,
  eDot: eDot,
  edot: edot$1,
  ee: ee$1,
  efDot: efDot,
  Efr: Efr,
  efr: efr$1,
  eg: eg$1,
  Egrave: Egrave,
  egrave: egrave$1,
  egs: egs$1,
  egsdot: egsdot,
  el: el$1,
  Element: Element,
  elinters: elinters,
  ell: ell$1,
  els: els$1,
  elsdot: elsdot,
  Emacr: Emacr,
  emacr: emacr,
  empty: empty$1,
  emptyset: emptyset,
  EmptySmallSquare: EmptySmallSquare,
  emptyv: emptyv,
  EmptyVerySmallSquare: EmptyVerySmallSquare,
  emsp: emsp,
  emsp13: emsp13,
  emsp14: emsp14,
  ENG: ENG$1,
  eng: eng$1,
  ensp: ensp,
  Eogon: Eogon,
  eogon: eogon,
  Eopf: Eopf,
  eopf: eopf,
  epar: epar,
  eparsl: eparsl,
  eplus: eplus,
  epsi: epsi$1,
  Epsilon: Epsilon$1,
  epsilon: epsilon$1,
  epsiv: epsiv,
  eqcirc: eqcirc,
  eqcolon: eqcolon,
  eqsim: eqsim,
  eqslantgtr: eqslantgtr,
  eqslantless: eqslantless,
  Equal: Equal$1,
  equals: equals$1,
  EqualTilde: EqualTilde,
  equest: equest$1,
  Equilibrium: Equilibrium$1,
  equiv: equiv$1,
  equivDD: equivDD,
  eqvparsl: eqvparsl,
  erarr: erarr,
  erDot: erDot,
  Escr: Escr,
  escr: escr$1,
  esdot: esdot,
  Esim: Esim,
  esim: esim$1,
  Eta: Eta$1,
  eta: eta$1,
  ETH: ETH$1,
  eth: eth$1,
  Euml: Euml,
  euml: euml,
  euro: euro$1,
  excl: excl$1,
  exist: exist$1,
  Exists: Exists$1,
  expectation: expectation$1,
  ExponentialE: ExponentialE,
  exponentiale: exponentiale,
  fallingdotseq: fallingdotseq,
  Fcy: Fcy,
  fcy: fcy,
  female: female$1,
  ffilig: ffilig,
  fflig: fflig,
  ffllig: ffllig,
  Ffr: Ffr,
  ffr: ffr,
  filig: filig,
  FilledSmallSquare: FilledSmallSquare,
  FilledVerySmallSquare: FilledVerySmallSquare,
  fjlig: fjlig,
  flat: flat$1,
  fllig: fllig,
  fltns: fltns,
  fnof: fnof,
  Fopf: Fopf,
  fopf: fopf,
  ForAll: ForAll,
  forall: forall,
  fork: fork$1,
  forkv: forkv,
  Fouriertrf: Fouriertrf,
  fpartint: fpartint,
  frac12: frac12,
  frac13: frac13,
  frac14: frac14,
  frac15: frac15,
  frac16: frac16,
  frac18: frac18,
  frac23: frac23,
  frac25: frac25,
  frac34: frac34,
  frac35: frac35,
  frac38: frac38,
  frac45: frac45,
  frac56: frac56,
  frac58: frac58,
  frac78: frac78,
  frasl: frasl,
  frown: frown$1,
  Fscr: Fscr,
  fscr: fscr,
  gacute: gacute,
  Gamma: Gamma$1,
  gamma: gamma$1,
  Gammad: Gammad,
  gammad: gammad,
  gap: gap$1,
  Gbreve: Gbreve,
  gbreve: gbreve,
  Gcedil: Gcedil,
  Gcirc: Gcirc,
  gcirc: gcirc,
  Gcy: Gcy,
  gcy: gcy$1,
  Gdot: Gdot,
  gdot: gdot,
  gE: gE,
  ge: ge$1,
  gEl: gEl,
  gel: gel$1,
  geq: geq$1,
  geqq: geqq,
  geqslant: geqslant,
  ges: ges$1,
  gescc: gescc,
  gesdot: gesdot,
  gesdoto: gesdoto,
  gesdotol: gesdotol,
  gesl: gesl$1,
  gesles: gesles,
  Gfr: Gfr,
  gfr: gfr,
  Gg: Gg,
  gg: gg$1,
  ggg: ggg,
  gimel: gimel,
  GJcy: GJcy,
  gjcy: gjcy,
  gl: gl$1,
  gla: gla$1,
  glE: glE,
  glj: glj,
  gnap: gnap,
  gnapprox: gnapprox,
  gnE: gnE,
  gne: gne$1,
  gneq: gneq,
  gneqq: gneqq,
  gnsim: gnsim,
  Gopf: Gopf,
  gopf: gopf,
  grave: grave$1,
  GreaterEqual: GreaterEqual,
  GreaterEqualLess: GreaterEqualLess,
  GreaterFullEqual: GreaterFullEqual,
  GreaterGreater: GreaterGreater,
  GreaterLess: GreaterLess,
  GreaterSlantEqual: GreaterSlantEqual,
  GreaterTilde: GreaterTilde,
  Gscr: Gscr,
  gscr: gscr,
  gsim: gsim,
  gsime: gsime,
  gsiml: gsiml,
  GT: GT$1,
  Gt: Gt,
  gt: gt$1,
  gtcc: gtcc,
  gtcir: gtcir,
  gtdot: gtdot,
  gtlPar: gtlPar,
  gtquest: gtquest,
  gtrapprox: gtrapprox,
  gtrarr: gtrarr,
  gtrdot: gtrdot,
  gtreqless: gtreqless,
  gtreqqless: gtreqqless,
  gtrless: gtrless,
  gtrsim: gtrsim,
  gvertneqq: gvertneqq,
  gvnE: gvnE,
  Hacek: Hacek,
  hairsp: hairsp,
  half: half$1,
  hamilt: hamilt,
  HARDcy: HARDcy,
  hardcy: hardcy,
  hArr: hArr,
  harr: harr,
  harrcir: harrcir,
  harrw: harrw,
  Hat: Hat$1,
  hbar: hbar,
  Hcirc: Hcirc,
  hcirc: hcirc,
  hearts: hearts$1,
  heartsuit: heartsuit,
  hellip: hellip,
  hercon: hercon,
  Hfr: Hfr,
  hfr: hfr,
  HilbertSpace: HilbertSpace,
  hksearow: hksearow,
  hkswarow: hkswarow,
  hoarr: hoarr,
  homtht: homtht,
  hookleftarrow: hookleftarrow,
  hookrightarrow: hookrightarrow,
  Hopf: Hopf,
  hopf: hopf$1,
  horbar: horbar,
  HorizontalLine: HorizontalLine,
  Hscr: Hscr,
  hscr: hscr,
  hslash: hslash,
  Hstrok: Hstrok,
  hstrok: hstrok,
  HumpDownHump: HumpDownHump,
  HumpEqual: HumpEqual,
  hybull: hybull,
  hyphen: hyphen$1,
  Iacute: Iacute,
  iacute: iacute,
  ic: ic$1,
  Icirc: Icirc,
  icirc: icirc,
  Icy: Icy,
  icy: icy$1,
  Idot: Idot,
  IEcy: IEcy,
  iecy: iecy,
  iexcl: iexcl,
  iff: iff$1,
  Ifr: Ifr,
  ifr: ifr,
  Igrave: Igrave,
  igrave: igrave,
  ii: ii$1,
  iiiint: iiiint,
  iiint: iiint,
  iinfin: iinfin,
  iiota: iiota,
  IJlig: IJlig,
  ijlig: ijlig,
  Im: Im,
  Imacr: Imacr,
  imacr: imacr,
  image: image$1,
  ImaginaryI: ImaginaryI,
  imagline: imagline,
  imagpart: imagpart,
  imath: imath,
  imof: imof,
  imped: imped$1,
  Implies: Implies,
  "in": "∈",
  incare: incare,
  infin: infin,
  infintie: infintie,
  inodot: inodot,
  Int: Int,
  int: int$1,
  intcal: intcal,
  integers: integers$1,
  Integral: Integral,
  intercal: intercal,
  Intersection: Intersection,
  intlarhk: intlarhk,
  intprod: intprod,
  InvisibleComma: InvisibleComma,
  InvisibleTimes: InvisibleTimes,
  IOcy: IOcy,
  iocy: iocy$1,
  Iogon: Iogon,
  iogon: iogon$1,
  Iopf: Iopf,
  iopf: iopf,
  Iota: Iota,
  iota: iota$1,
  iprod: iprod,
  iquest: iquest,
  Iscr: Iscr,
  iscr: iscr,
  isin: isin$1,
  isindot: isindot,
  isinE: isinE,
  isins: isins,
  isinsv: isinsv,
  isinv: isinv,
  it: it$1,
  Itilde: Itilde,
  itilde: itilde,
  Iukcy: Iukcy,
  iukcy: iukcy,
  Iuml: Iuml,
  iuml: iuml,
  Jcirc: Jcirc,
  jcirc: jcirc,
  Jcy: Jcy,
  jcy: jcy,
  Jfr: Jfr,
  jfr: jfr,
  jmath: jmath,
  Jopf: Jopf,
  jopf: jopf,
  Jscr: Jscr,
  jscr: jscr,
  Jsercy: Jsercy,
  jsercy: jsercy,
  Jukcy: Jukcy,
  jukcy: jukcy,
  Kappa: Kappa$1,
  kappa: kappa$1,
  kappav: kappav,
  Kcedil: Kcedil,
  kcedil: kcedil,
  Kcy: Kcy,
  kcy: kcy,
  Kfr: Kfr,
  kfr: kfr,
  kgreen: kgreen,
  KHcy: KHcy,
  khcy: khcy,
  KJcy: KJcy,
  kjcy: kjcy,
  Kopf: Kopf,
  kopf: kopf$1,
  Kscr: Kscr,
  kscr: kscr,
  lAarr: lAarr,
  Lacute: Lacute,
  lacute: lacute,
  laemptyv: laemptyv,
  lagran: lagran,
  Lambda: Lambda$1,
  lambda: lambda$1,
  Lang: Lang,
  lang: lang$1,
  langd: langd,
  langle: langle,
  lap: lap$1,
  Laplacetrf: Laplacetrf,
  laquo: laquo,
  Larr: Larr,
  lArr: lArr,
  larr: larr,
  larrb: larrb,
  larrbfs: larrbfs,
  larrfs: larrfs,
  larrhk: larrhk,
  larrlp: larrlp,
  larrpl: larrpl,
  larrsim: larrsim,
  larrtl: larrtl,
  lat: lat$1,
  lAtail: lAtail,
  latail: latail,
  late: late$1,
  lates: lates$1,
  lBarr: lBarr,
  lbarr: lbarr,
  lbbrk: lbbrk,
  lbrace: lbrace,
  lbrack: lbrack,
  lbrke: lbrke,
  lbrksld: lbrksld,
  lbrkslu: lbrkslu,
  Lcaron: Lcaron,
  lcaron: lcaron,
  Lcedil: Lcedil,
  lcedil: lcedil,
  lceil: lceil,
  lcub: lcub,
  Lcy: Lcy,
  lcy: lcy,
  ldca: ldca,
  ldquo: ldquo,
  ldquor: ldquor,
  ldrdhar: ldrdhar,
  ldrushar: ldrushar,
  ldsh: ldsh,
  lE: lE,
  le: le$1,
  LeftAngleBracket: LeftAngleBracket,
  LeftArrow: LeftArrow,
  Leftarrow: Leftarrow,
  leftarrow: leftarrow,
  LeftArrowBar: LeftArrowBar,
  LeftArrowRightArrow: LeftArrowRightArrow,
  leftarrowtail: leftarrowtail,
  LeftCeiling: LeftCeiling,
  LeftDoubleBracket: LeftDoubleBracket,
  LeftDownTeeVector: LeftDownTeeVector,
  LeftDownVector: LeftDownVector,
  LeftDownVectorBar: LeftDownVectorBar,
  LeftFloor: LeftFloor,
  leftharpoondown: leftharpoondown,
  leftharpoonup: leftharpoonup,
  leftleftarrows: leftleftarrows,
  LeftRightArrow: LeftRightArrow,
  Leftrightarrow: Leftrightarrow,
  leftrightarrow: leftrightarrow,
  leftrightarrows: leftrightarrows,
  leftrightharpoons: leftrightharpoons,
  leftrightsquigarrow: leftrightsquigarrow,
  LeftRightVector: LeftRightVector,
  LeftTee: LeftTee,
  LeftTeeArrow: LeftTeeArrow,
  LeftTeeVector: LeftTeeVector,
  leftthreetimes: leftthreetimes,
  LeftTriangle: LeftTriangle,
  LeftTriangleBar: LeftTriangleBar,
  LeftTriangleEqual: LeftTriangleEqual,
  LeftUpDownVector: LeftUpDownVector,
  LeftUpTeeVector: LeftUpTeeVector,
  LeftUpVector: LeftUpVector,
  LeftUpVectorBar: LeftUpVectorBar,
  LeftVector: LeftVector,
  LeftVectorBar: LeftVectorBar,
  lEg: lEg,
  leg: leg$1,
  leq: leq$1,
  leqq: leqq,
  leqslant: leqslant,
  les: les$1,
  lescc: lescc,
  lesdot: lesdot,
  lesdoto: lesdoto,
  lesdotor: lesdotor,
  lesg: lesg,
  lesges: lesges,
  lessapprox: lessapprox,
  lessdot: lessdot,
  lesseqgtr: lesseqgtr,
  lesseqqgtr: lesseqqgtr,
  LessEqualGreater: LessEqualGreater,
  LessFullEqual: LessFullEqual,
  LessGreater: LessGreater,
  lessgtr: lessgtr,
  LessLess: LessLess,
  lesssim: lesssim,
  LessSlantEqual: LessSlantEqual,
  LessTilde: LessTilde,
  lfisht: lfisht,
  lfloor: lfloor,
  Lfr: Lfr,
  lfr: lfr,
  lg: lg$1,
  lgE: lgE,
  lHar: lHar,
  lhard: lhard,
  lharu: lharu,
  lharul: lharul,
  lhblk: lhblk,
  LJcy: LJcy,
  ljcy: ljcy,
  Ll: Ll,
  ll: ll$1,
  llarr: llarr,
  llcorner: llcorner,
  Lleftarrow: Lleftarrow,
  llhard: llhard,
  lltri: lltri,
  Lmidot: Lmidot,
  lmidot: lmidot,
  lmoust: lmoust,
  lmoustache: lmoustache,
  lnap: lnap,
  lnapprox: lnapprox,
  lnE: lnE,
  lne: lne$1,
  lneq: lneq,
  lneqq: lneqq,
  lnsim: lnsim,
  loang: loang,
  loarr: loarr,
  lobrk: lobrk,
  LongLeftArrow: LongLeftArrow,
  Longleftarrow: Longleftarrow,
  longleftarrow: longleftarrow,
  LongLeftRightArrow: LongLeftRightArrow,
  Longleftrightarrow: Longleftrightarrow,
  longleftrightarrow: longleftrightarrow,
  longmapsto: longmapsto,
  LongRightArrow: LongRightArrow,
  Longrightarrow: Longrightarrow,
  longrightarrow: longrightarrow,
  looparrowleft: looparrowleft,
  looparrowright: looparrowright,
  lopar: lopar,
  Lopf: Lopf,
  lopf: lopf,
  loplus: loplus,
  lotimes: lotimes,
  lowast: lowast,
  lowbar: lowbar,
  LowerLeftArrow: LowerLeftArrow,
  LowerRightArrow: LowerRightArrow,
  loz: loz,
  lozenge: lozenge$1,
  lozf: lozf,
  lpar: lpar,
  lparlt: lparlt,
  lrarr: lrarr,
  lrcorner: lrcorner,
  lrhar: lrhar,
  lrhard: lrhard,
  lrm: lrm,
  lrtri: lrtri,
  lsaquo: lsaquo,
  Lscr: Lscr,
  lscr: lscr,
  Lsh: Lsh,
  lsh: lsh$1,
  lsim: lsim,
  lsime: lsime,
  lsimg: lsimg,
  lsqb: lsqb,
  lsquo: lsquo,
  lsquor: lsquor,
  Lstrok: Lstrok,
  lstrok: lstrok,
  LT: LT$1,
  Lt: Lt,
  lt: lt$1,
  ltcc: ltcc,
  ltcir: ltcir,
  ltdot: ltdot,
  lthree: lthree,
  ltimes: ltimes$1,
  ltlarr: ltlarr,
  ltquest: ltquest,
  ltri: ltri,
  ltrie: ltrie,
  ltrif: ltrif,
  ltrPar: ltrPar,
  lurdshar: lurdshar,
  luruhar: luruhar,
  lvertneqq: lvertneqq,
  lvnE: lvnE,
  macr: macr,
  male: male$1,
  malt: malt$1,
  maltese: maltese,
  "Map": "⤅",
  map: map$1,
  mapsto: mapsto,
  mapstodown: mapstodown,
  mapstoleft: mapstoleft,
  mapstoup: mapstoup,
  marker: marker$1,
  mcomma: mcomma,
  Mcy: Mcy,
  mcy: mcy,
  mdash: mdash,
  mDDot: mDDot,
  measuredangle: measuredangle,
  MediumSpace: MediumSpace,
  Mellintrf: Mellintrf,
  Mfr: Mfr,
  mfr: mfr,
  mho: mho,
  micro: micro,
  mid: mid$1,
  midast: midast,
  midcir: midcir,
  middot: middot,
  minus: minus$1,
  minusb: minusb,
  minusd: minusd,
  minusdu: minusdu,
  MinusPlus: MinusPlus,
  mlcp: mlcp,
  mldr: mldr,
  mnplus: mnplus,
  models: models$1,
  Mopf: Mopf,
  mopf: mopf,
  mp: mp$1,
  Mscr: Mscr,
  mscr: mscr,
  mstpos: mstpos,
  Mu: Mu,
  mu: mu$1,
  multimap: multimap,
  mumap: mumap,
  nabla: nabla,
  Nacute: Nacute,
  nacute: nacute,
  nang: nang$1,
  nap: nap$1,
  napE: napE,
  napid: napid,
  napos: napos,
  napprox: napprox,
  natur: natur,
  natural: natural$1,
  naturals: naturals$1,
  nbsp: nbsp,
  nbump: nbump,
  nbumpe: nbumpe,
  ncap: ncap,
  Ncaron: Ncaron,
  ncaron: ncaron,
  Ncedil: Ncedil,
  ncedil: ncedil,
  ncong: ncong,
  ncongdot: ncongdot,
  ncup: ncup,
  Ncy: Ncy,
  ncy: ncy$1,
  ndash: ndash,
  ne: ne$1,
  nearhk: nearhk,
  neArr: neArr,
  nearr: nearr,
  nearrow: nearrow,
  nedot: nedot,
  NegativeMediumSpace: NegativeMediumSpace,
  NegativeThickSpace: NegativeThickSpace,
  NegativeThinSpace: NegativeThinSpace,
  NegativeVeryThinSpace: NegativeVeryThinSpace,
  nequiv: nequiv,
  nesear: nesear,
  nesim: nesim,
  NestedGreaterGreater: NestedGreaterGreater,
  NestedLessLess: NestedLessLess,
  NewLine: NewLine,
  nexist: nexist,
  nexists: nexists,
  Nfr: Nfr,
  nfr: nfr,
  ngE: ngE,
  nge: nge$1,
  ngeq: ngeq,
  ngeqq: ngeqq,
  ngeqslant: ngeqslant,
  nges: nges,
  nGg: nGg,
  ngsim: ngsim,
  nGt: nGt,
  ngt: ngt$1,
  ngtr: ngtr,
  nGtv: nGtv,
  nhArr: nhArr,
  nharr: nharr,
  nhpar: nhpar,
  ni: ni$1,
  nis: nis$1,
  nisd: nisd,
  niv: niv,
  NJcy: NJcy,
  njcy: njcy,
  nlArr: nlArr,
  nlarr: nlarr,
  nldr: nldr,
  nlE: nlE,
  nle: nle$1,
  nLeftarrow: nLeftarrow,
  nleftarrow: nleftarrow,
  nLeftrightarrow: nLeftrightarrow,
  nleftrightarrow: nleftrightarrow,
  nleq: nleq,
  nleqq: nleqq,
  nleqslant: nleqslant,
  nles: nles$1,
  nless: nless$1,
  nLl: nLl,
  nlsim: nlsim,
  nLt: nLt,
  nlt: nlt$1,
  nltri: nltri,
  nltrie: nltrie,
  nLtv: nLtv,
  nmid: nmid,
  NoBreak: NoBreak,
  NonBreakingSpace: NonBreakingSpace,
  Nopf: Nopf,
  nopf: nopf$1,
  Not: Not$1,
  not: not$1,
  NotCongruent: NotCongruent,
  NotCupCap: NotCupCap,
  NotDoubleVerticalBar: NotDoubleVerticalBar,
  NotElement: NotElement,
  NotEqual: NotEqual,
  NotEqualTilde: NotEqualTilde,
  NotExists: NotExists,
  NotGreater: NotGreater,
  NotGreaterEqual: NotGreaterEqual,
  NotGreaterFullEqual: NotGreaterFullEqual,
  NotGreaterGreater: NotGreaterGreater,
  NotGreaterLess: NotGreaterLess,
  NotGreaterSlantEqual: NotGreaterSlantEqual,
  NotGreaterTilde: NotGreaterTilde,
  NotHumpDownHump: NotHumpDownHump,
  NotHumpEqual: NotHumpEqual,
  notin: notin,
  notindot: notindot,
  notinE: notinE,
  notinva: notinva,
  notinvb: notinvb,
  notinvc: notinvc,
  NotLeftTriangle: NotLeftTriangle,
  NotLeftTriangleBar: NotLeftTriangleBar,
  NotLeftTriangleEqual: NotLeftTriangleEqual,
  NotLess: NotLess,
  NotLessEqual: NotLessEqual,
  NotLessGreater: NotLessGreater,
  NotLessLess: NotLessLess,
  NotLessSlantEqual: NotLessSlantEqual,
  NotLessTilde: NotLessTilde,
  NotNestedGreaterGreater: NotNestedGreaterGreater,
  NotNestedLessLess: NotNestedLessLess,
  notni: notni,
  notniva: notniva,
  notnivb: notnivb,
  notnivc: notnivc,
  NotPrecedes: NotPrecedes,
  NotPrecedesEqual: NotPrecedesEqual,
  NotPrecedesSlantEqual: NotPrecedesSlantEqual,
  NotReverseElement: NotReverseElement,
  NotRightTriangle: NotRightTriangle,
  NotRightTriangleBar: NotRightTriangleBar,
  NotRightTriangleEqual: NotRightTriangleEqual,
  NotSquareSubset: NotSquareSubset,
  NotSquareSubsetEqual: NotSquareSubsetEqual,
  NotSquareSuperset: NotSquareSuperset,
  NotSquareSupersetEqual: NotSquareSupersetEqual,
  NotSubset: NotSubset,
  NotSubsetEqual: NotSubsetEqual,
  NotSucceeds: NotSucceeds,
  NotSucceedsEqual: NotSucceedsEqual,
  NotSucceedsSlantEqual: NotSucceedsSlantEqual,
  NotSucceedsTilde: NotSucceedsTilde,
  NotSuperset: NotSuperset,
  NotSupersetEqual: NotSupersetEqual,
  NotTilde: NotTilde,
  NotTildeEqual: NotTildeEqual,
  NotTildeFullEqual: NotTildeFullEqual,
  NotTildeTilde: NotTildeTilde,
  NotVerticalBar: NotVerticalBar,
  npar: npar,
  nparallel: nparallel,
  nparsl: nparsl,
  npart: npart,
  npolint: npolint,
  npr: npr,
  nprcue: nprcue,
  npre: npre,
  nprec: nprec,
  npreceq: npreceq,
  nrArr: nrArr,
  nrarr: nrarr,
  nrarrc: nrarrc,
  nrarrw: nrarrw,
  nRightarrow: nRightarrow,
  nrightarrow: nrightarrow,
  nrtri: nrtri,
  nrtrie: nrtrie,
  nsc: nsc$1,
  nsccue: nsccue,
  nsce: nsce$1,
  Nscr: Nscr,
  nscr: nscr,
  nshortmid: nshortmid,
  nshortparallel: nshortparallel,
  nsim: nsim,
  nsime: nsime,
  nsimeq: nsimeq,
  nsmid: nsmid,
  nspar: nspar,
  nsqsube: nsqsube,
  nsqsupe: nsqsupe,
  nsub: nsub,
  nsubE: nsubE,
  nsube: nsube,
  nsubset: nsubset,
  nsubseteq: nsubseteq,
  nsubseteqq: nsubseteqq,
  nsucc: nsucc,
  nsucceq: nsucceq,
  nsup: nsup,
  nsupE: nsupE,
  nsupe: nsupe,
  nsupset: nsupset,
  nsupseteq: nsupseteq,
  nsupseteqq: nsupseteqq,
  ntgl: ntgl,
  Ntilde: Ntilde,
  ntilde: ntilde,
  ntlg: ntlg,
  ntriangleleft: ntriangleleft,
  ntrianglelefteq: ntrianglelefteq,
  ntriangleright: ntriangleright,
  ntrianglerighteq: ntrianglerighteq,
  Nu: Nu,
  nu: nu$1,
  num: num$1,
  numero: numero,
  numsp: numsp,
  nvap: nvap,
  nVDash: nVDash,
  nVdash: nVdash,
  nvDash: nvDash,
  nvdash: nvdash,
  nvge: nvge,
  nvgt: nvgt,
  nvHarr: nvHarr,
  nvinfin: nvinfin,
  nvlArr: nvlArr,
  nvle: nvle,
  nvlt: nvlt,
  nvltrie: nvltrie,
  nvrArr: nvrArr,
  nvrtrie: nvrtrie,
  nvsim: nvsim,
  nwarhk: nwarhk,
  nwArr: nwArr,
  nwarr: nwarr,
  nwarrow: nwarrow,
  nwnear: nwnear,
  Oacute: Oacute,
  oacute: oacute,
  oast: oast,
  ocir: ocir,
  Ocirc: Ocirc,
  ocirc: ocirc,
  Ocy: Ocy,
  ocy: ocy,
  odash: odash,
  Odblac: Odblac,
  odblac: odblac,
  odiv: odiv,
  odot: odot,
  odsold: odsold,
  OElig: OElig,
  oelig: oelig,
  ofcir: ofcir,
  Ofr: Ofr,
  ofr: ofr,
  ogon: ogon,
  Ograve: Ograve,
  ograve: ograve,
  ogt: ogt$1,
  ohbar: ohbar,
  ohm: ohm$1,
  oint: oint,
  olarr: olarr,
  olcir: olcir,
  olcross: olcross,
  oline: oline$1,
  olt: olt$1,
  Omacr: Omacr,
  omacr: omacr,
  Omega: Omega$1,
  omega: omega$1,
  Omicron: Omicron$1,
  omicron: omicron$1,
  omid: omid,
  ominus: ominus,
  Oopf: Oopf,
  oopf: oopf$1,
  opar: opar$1,
  OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
  OpenCurlyQuote: OpenCurlyQuote,
  operp: operp,
  oplus: oplus,
  Or: Or,
  or: or$1,
  orarr: orarr,
  ord: ord,
  order: order$1,
  orderof: orderof,
  ordf: ordf,
  ordm: ordm,
  origof: origof,
  oror: oror$1,
  orslope: orslope,
  orv: orv$1,
  oS: oS,
  Oscr: Oscr,
  oscr: oscr,
  Oslash: Oslash,
  oslash: oslash,
  osol: osol$1,
  Otilde: Otilde,
  otilde: otilde,
  Otimes: Otimes,
  otimes: otimes,
  otimesas: otimesas,
  Ouml: Ouml,
  ouml: ouml,
  ovbar: ovbar,
  OverBar: OverBar,
  OverBrace: OverBrace,
  OverBracket: OverBracket,
  OverParenthesis: OverParenthesis,
  par: par$1,
  para: para$1,
  parallel: parallel$1,
  parsim: parsim,
  parsl: parsl,
  part: part$1,
  PartialD: PartialD,
  Pcy: Pcy,
  pcy: pcy,
  percnt: percnt,
  period: period,
  permil: permil,
  perp: perp,
  pertenk: pertenk,
  Pfr: Pfr,
  pfr: pfr,
  Phi: Phi,
  phi: phi$1,
  phiv: phiv,
  phmmat: phmmat,
  phone: phone$1,
  Pi: Pi$1,
  pi: pi$1,
  pitchfork: pitchfork$1,
  piv: piv,
  planck: planck,
  planckh: planckh,
  plankv: plankv,
  plus: plus$1,
  plusacir: plusacir,
  plusb: plusb,
  pluscir: pluscir,
  plusdo: plusdo,
  plusdu: plusdu,
  pluse: pluse,
  PlusMinus: PlusMinus,
  plusmn: plusmn,
  plussim: plussim,
  plustwo: plustwo,
  pm: pm$1,
  Poincareplane: Poincareplane,
  pointint: pointint,
  Popf: Popf,
  popf: popf$1,
  pound: pound$1,
  Pr: Pr,
  pr: pr$1,
  prap: prap,
  prcue: prcue,
  prE: prE,
  pre: pre,
  prec: prec,
  precapprox: precapprox,
  preccurlyeq: preccurlyeq,
  Precedes: Precedes,
  PrecedesEqual: PrecedesEqual,
  PrecedesSlantEqual: PrecedesSlantEqual,
  PrecedesTilde: PrecedesTilde,
  preceq: preceq,
  precnapprox: precnapprox,
  precneqq: precneqq,
  precnsim: precnsim,
  precsim: precsim,
  Prime: Prime,
  prime: prime$1,
  primes: primes$1,
  prnap: prnap,
  prnE: prnE,
  prnsim: prnsim,
  prod: prod$1,
  Product: Product$1,
  profalar: profalar,
  profline: profline,
  profsurf: profsurf,
  prop: prop$1,
  Proportion: Proportion$1,
  Proportional: Proportional$1,
  propto: propto,
  prsim: prsim,
  prurel: prurel,
  Pscr: Pscr,
  pscr: pscr,
  Psi: Psi,
  psi: psi$1,
  puncsp: puncsp,
  Qfr: Qfr,
  qfr: qfr,
  qint: qint,
  Qopf: Qopf,
  qopf: qopf,
  qprime: qprime,
  Qscr: Qscr,
  qscr: qscr,
  quaternions: quaternions,
  quatint: quatint,
  quest: quest$1,
  questeq: questeq,
  QUOT: QUOT$1,
  quot: quot$1,
  rAarr: rAarr,
  race: race$1,
  Racute: Racute,
  racute: racute,
  radic: radic,
  raemptyv: raemptyv,
  Rang: Rang,
  rang: rang$1,
  rangd: rangd,
  range: range$1,
  rangle: rangle,
  raquo: raquo,
  Rarr: Rarr,
  rArr: rArr,
  rarr: rarr,
  rarrap: rarrap,
  rarrb: rarrb,
  rarrbfs: rarrbfs,
  rarrc: rarrc,
  rarrfs: rarrfs,
  rarrhk: rarrhk,
  rarrlp: rarrlp,
  rarrpl: rarrpl,
  rarrsim: rarrsim,
  Rarrtl: Rarrtl,
  rarrtl: rarrtl,
  rarrw: rarrw,
  rAtail: rAtail,
  ratail: ratail,
  ratio: ratio$1,
  rationals: rationals,
  RBarr: RBarr,
  rBarr: rBarr,
  rbarr: rbarr,
  rbbrk: rbbrk,
  rbrace: rbrace,
  rbrack: rbrack,
  rbrke: rbrke,
  rbrksld: rbrksld,
  rbrkslu: rbrkslu,
  Rcaron: Rcaron,
  rcaron: rcaron,
  Rcedil: Rcedil,
  rcedil: rcedil,
  rceil: rceil,
  rcub: rcub,
  Rcy: Rcy,
  rcy: rcy,
  rdca: rdca,
  rdldhar: rdldhar,
  rdquo: rdquo,
  rdquor: rdquor,
  rdsh: rdsh,
  Re: Re$1,
  real: real$1,
  realine: realine,
  realpart: realpart,
  reals: reals$1,
  rect: rect$1,
  REG: REG$1,
  reg: reg$1,
  ReverseElement: ReverseElement,
  ReverseEquilibrium: ReverseEquilibrium,
  ReverseUpEquilibrium: ReverseUpEquilibrium,
  rfisht: rfisht,
  rfloor: rfloor,
  Rfr: Rfr,
  rfr: rfr,
  rHar: rHar,
  rhard: rhard,
  rharu: rharu,
  rharul: rharul,
  Rho: Rho,
  rho: rho,
  rhov: rhov,
  RightAngleBracket: RightAngleBracket,
  RightArrow: RightArrow,
  Rightarrow: Rightarrow,
  rightarrow: rightarrow,
  RightArrowBar: RightArrowBar,
  RightArrowLeftArrow: RightArrowLeftArrow,
  rightarrowtail: rightarrowtail,
  RightCeiling: RightCeiling,
  RightDoubleBracket: RightDoubleBracket,
  RightDownTeeVector: RightDownTeeVector,
  RightDownVector: RightDownVector,
  RightDownVectorBar: RightDownVectorBar,
  RightFloor: RightFloor,
  rightharpoondown: rightharpoondown,
  rightharpoonup: rightharpoonup,
  rightleftarrows: rightleftarrows,
  rightleftharpoons: rightleftharpoons,
  rightrightarrows: rightrightarrows,
  rightsquigarrow: rightsquigarrow,
  RightTee: RightTee,
  RightTeeArrow: RightTeeArrow,
  RightTeeVector: RightTeeVector,
  rightthreetimes: rightthreetimes,
  RightTriangle: RightTriangle,
  RightTriangleBar: RightTriangleBar,
  RightTriangleEqual: RightTriangleEqual,
  RightUpDownVector: RightUpDownVector,
  RightUpTeeVector: RightUpTeeVector,
  RightUpVector: RightUpVector,
  RightUpVectorBar: RightUpVectorBar,
  RightVector: RightVector,
  RightVectorBar: RightVectorBar,
  ring: ring$1,
  risingdotseq: risingdotseq,
  rlarr: rlarr,
  rlhar: rlhar,
  rlm: rlm,
  rmoust: rmoust,
  rmoustache: rmoustache,
  rnmid: rnmid,
  roang: roang,
  roarr: roarr,
  robrk: robrk,
  ropar: ropar,
  Ropf: Ropf,
  ropf: ropf,
  roplus: roplus,
  rotimes: rotimes,
  RoundImplies: RoundImplies,
  rpar: rpar,
  rpargt: rpargt,
  rppolint: rppolint,
  rrarr: rrarr,
  Rrightarrow: Rrightarrow,
  rsaquo: rsaquo,
  Rscr: Rscr,
  rscr: rscr,
  Rsh: Rsh,
  rsh: rsh$1,
  rsqb: rsqb,
  rsquo: rsquo,
  rsquor: rsquor,
  rthree: rthree,
  rtimes: rtimes,
  rtri: rtri,
  rtrie: rtrie,
  rtrif: rtrif,
  rtriltri: rtriltri,
  RuleDelayed: RuleDelayed,
  ruluhar: ruluhar,
  rx: rx,
  Sacute: Sacute,
  sacute: sacute,
  sbquo: sbquo,
  Sc: Sc,
  sc: sc$1,
  scap: scap$1,
  Scaron: Scaron,
  scaron: scaron,
  sccue: sccue,
  scE: scE,
  sce: sce$1,
  Scedil: Scedil,
  scedil: scedil,
  Scirc: Scirc,
  scirc: scirc,
  scnap: scnap,
  scnE: scnE,
  scnsim: scnsim,
  scpolint: scpolint,
  scsim: scsim,
  Scy: Scy,
  scy: scy$1,
  sdot: sdot$1,
  sdotb: sdotb,
  sdote: sdote,
  searhk: searhk,
  seArr: seArr,
  searr: searr,
  searrow: searrow,
  sect: sect$1,
  semi: semi$1,
  seswar: seswar,
  setminus: setminus,
  setmn: setmn,
  sext: sext,
  Sfr: Sfr,
  sfr: sfr,
  sfrown: sfrown,
  sharp: sharp$1,
  SHCHcy: SHCHcy,
  shchcy: shchcy,
  SHcy: SHcy,
  shcy: shcy,
  ShortDownArrow: ShortDownArrow,
  ShortLeftArrow: ShortLeftArrow,
  shortmid: shortmid,
  shortparallel: shortparallel,
  ShortRightArrow: ShortRightArrow,
  ShortUpArrow: ShortUpArrow,
  shy: shy$1,
  Sigma: Sigma$1,
  sigma: sigma$1,
  sigmaf: sigmaf,
  sigmav: sigmav,
  sim: sim$1,
  simdot: simdot,
  sime: sime,
  simeq: simeq,
  simg: simg,
  simgE: simgE,
  siml: siml,
  simlE: simlE,
  simne: simne,
  simplus: simplus,
  simrarr: simrarr,
  slarr: slarr,
  SmallCircle: SmallCircle,
  smallsetminus: smallsetminus,
  smashp: smashp,
  smeparsl: smeparsl,
  smid: smid,
  smile: smile,
  smt: smt,
  smte: smte,
  smtes: smtes,
  SOFTcy: SOFTcy,
  softcy: softcy,
  sol: sol$1,
  solb: solb,
  solbar: solbar,
  Sopf: Sopf,
  sopf: sopf,
  spades: spades$1,
  spadesuit: spadesuit,
  spar: spar,
  sqcap: sqcap,
  sqcaps: sqcaps,
  sqcup: sqcup,
  sqcups: sqcups,
  Sqrt: Sqrt,
  sqsub: sqsub,
  sqsube: sqsube,
  sqsubset: sqsubset,
  sqsubseteq: sqsubseteq,
  sqsup: sqsup,
  sqsupe: sqsupe,
  sqsupset: sqsupset,
  sqsupseteq: sqsupseteq,
  squ: squ,
  Square: Square,
  square: square$1,
  SquareIntersection: SquareIntersection,
  SquareSubset: SquareSubset,
  SquareSubsetEqual: SquareSubsetEqual,
  SquareSuperset: SquareSuperset,
  SquareSupersetEqual: SquareSupersetEqual,
  SquareUnion: SquareUnion,
  squarf: squarf,
  squf: squf,
  srarr: srarr,
  Sscr: Sscr,
  sscr: sscr,
  ssetmn: ssetmn,
  ssmile: ssmile,
  sstarf: sstarf,
  Star: Star$1,
  star: star$1,
  starf: starf,
  straightepsilon: straightepsilon,
  straightphi: straightphi,
  strns: strns,
  Sub: Sub$1,
  sub: sub$1,
  subdot: subdot,
  subE: subE,
  sube: sube$1,
  subedot: subedot,
  submult: submult,
  subnE: subnE,
  subne: subne,
  subplus: subplus,
  subrarr: subrarr,
  Subset: Subset,
  subset: subset,
  subseteq: subseteq,
  subseteqq: subseteqq,
  SubsetEqual: SubsetEqual,
  subsetneq: subsetneq,
  subsetneqq: subsetneqq,
  subsim: subsim,
  subsub: subsub,
  subsup: subsup,
  succ: succ,
  succapprox: succapprox,
  succcurlyeq: succcurlyeq,
  Succeeds: Succeeds,
  SucceedsEqual: SucceedsEqual,
  SucceedsSlantEqual: SucceedsSlantEqual,
  SucceedsTilde: SucceedsTilde,
  succeq: succeq,
  succnapprox: succnapprox,
  succneqq: succneqq,
  succnsim: succnsim,
  succsim: succsim,
  SuchThat: SuchThat,
  Sum: Sum$1,
  sum: sum$1,
  sung: sung,
  Sup: Sup,
  sup: sup,
  sup1: sup1,
  sup2: sup2,
  sup3: sup3,
  supdot: supdot,
  supdsub: supdsub,
  supE: supE,
  supe: supe,
  supedot: supedot,
  Superset: Superset,
  SupersetEqual: SupersetEqual,
  suphsol: suphsol,
  suphsub: suphsub,
  suplarr: suplarr,
  supmult: supmult,
  supnE: supnE,
  supne: supne,
  supplus: supplus,
  Supset: Supset,
  supset: supset,
  supseteq: supseteq,
  supseteqq: supseteqq,
  supsetneq: supsetneq,
  supsetneqq: supsetneqq,
  supsim: supsim,
  supsub: supsub,
  supsup: supsup,
  swarhk: swarhk,
  swArr: swArr,
  swarr: swarr,
  swarrow: swarrow,
  swnwar: swnwar,
  szlig: szlig,
  Tab: Tab$1,
  target: target$1,
  Tau: Tau$1,
  tau: tau$1,
  tbrk: tbrk,
  Tcaron: Tcaron,
  tcaron: tcaron,
  Tcedil: Tcedil,
  tcedil: tcedil,
  Tcy: Tcy,
  tcy: tcy,
  tdot: tdot,
  telrec: telrec,
  Tfr: Tfr,
  tfr: tfr,
  there4: there4,
  Therefore: Therefore,
  therefore: therefore$1,
  Theta: Theta$1,
  theta: theta$1,
  thetasym: thetasym,
  thetav: thetav,
  thickapprox: thickapprox,
  thicksim: thicksim,
  ThickSpace: ThickSpace,
  thinsp: thinsp,
  ThinSpace: ThinSpace,
  thkap: thkap,
  thksim: thksim,
  THORN: THORN$1,
  thorn: thorn$1,
  Tilde: Tilde$1,
  tilde: tilde$1,
  TildeEqual: TildeEqual,
  TildeFullEqual: TildeFullEqual,
  TildeTilde: TildeTilde,
  times: times$1,
  timesb: timesb,
  timesbar: timesbar,
  timesd: timesd,
  tint: tint$1,
  toea: toea,
  top: top$1,
  topbot: topbot,
  topcir: topcir,
  Topf: Topf,
  topf: topf,
  topfork: topfork,
  tosa: tosa$1,
  tprime: tprime,
  TRADE: TRADE$1,
  trade: trade$1,
  triangle: triangle$1,
  triangledown: triangledown,
  triangleleft: triangleleft,
  trianglelefteq: trianglelefteq,
  triangleq: triangleq,
  triangleright: triangleright,
  trianglerighteq: trianglerighteq,
  tridot: tridot,
  trie: trie$1,
  triminus: triminus,
  TripleDot: TripleDot,
  triplus: triplus,
  trisb: trisb,
  tritime: tritime,
  trpezium: trpezium,
  Tscr: Tscr,
  tscr: tscr,
  TScy: TScy,
  tscy: tscy,
  TSHcy: TSHcy,
  tshcy: tshcy,
  Tstrok: Tstrok,
  tstrok: tstrok,
  twixt: twixt,
  twoheadleftarrow: twoheadleftarrow,
  twoheadrightarrow: twoheadrightarrow,
  Uacute: Uacute,
  uacute: uacute,
  Uarr: Uarr,
  uArr: uArr,
  uarr: uarr,
  Uarrocir: Uarrocir,
  Ubrcy: Ubrcy,
  ubrcy: ubrcy,
  Ubreve: Ubreve,
  ubreve: ubreve,
  Ucirc: Ucirc,
  ucirc: ucirc,
  Ucy: Ucy,
  ucy: ucy$1,
  udarr: udarr,
  Udblac: Udblac,
  udblac: udblac,
  udhar: udhar,
  ufisht: ufisht,
  Ufr: Ufr,
  ufr: ufr,
  Ugrave: Ugrave,
  ugrave: ugrave,
  uHar: uHar,
  uharl: uharl,
  uharr: uharr,
  uhblk: uhblk,
  ulcorn: ulcorn,
  ulcorner: ulcorner,
  ulcrop: ulcrop,
  ultri: ultri,
  Umacr: Umacr,
  umacr: umacr,
  uml: uml$1,
  UnderBar: UnderBar,
  UnderBrace: UnderBrace,
  UnderBracket: UnderBracket,
  UnderParenthesis: UnderParenthesis,
  Union: Union$1,
  UnionPlus: UnionPlus,
  Uogon: Uogon,
  uogon: uogon,
  Uopf: Uopf,
  uopf: uopf,
  UpArrow: UpArrow,
  Uparrow: Uparrow,
  uparrow: uparrow,
  UpArrowBar: UpArrowBar,
  UpArrowDownArrow: UpArrowDownArrow,
  UpDownArrow: UpDownArrow,
  Updownarrow: Updownarrow,
  updownarrow: updownarrow,
  UpEquilibrium: UpEquilibrium,
  upharpoonleft: upharpoonleft,
  upharpoonright: upharpoonright,
  uplus: uplus$1,
  UpperLeftArrow: UpperLeftArrow,
  UpperRightArrow: UpperRightArrow,
  Upsi: Upsi$1,
  upsi: upsi$1,
  upsih: upsih,
  Upsilon: Upsilon,
  upsilon: upsilon,
  UpTee: UpTee,
  UpTeeArrow: UpTeeArrow,
  upuparrows: upuparrows,
  urcorn: urcorn,
  urcorner: urcorner,
  urcrop: urcrop,
  Uring: Uring,
  uring: uring$1,
  urtri: urtri,
  Uscr: Uscr,
  uscr: uscr,
  utdot: utdot,
  Utilde: Utilde,
  utilde: utilde,
  utri: utri,
  utrif: utrif,
  uuarr: uuarr,
  Uuml: Uuml,
  uuml: uuml,
  uwangle: uwangle,
  vangrt: vangrt,
  varepsilon: varepsilon,
  varkappa: varkappa,
  varnothing: varnothing,
  varphi: varphi,
  varpi: varpi,
  varpropto: varpropto,
  vArr: vArr,
  varr: varr,
  varrho: varrho,
  varsigma: varsigma,
  varsubsetneq: varsubsetneq,
  varsubsetneqq: varsubsetneqq,
  varsupsetneq: varsupsetneq,
  varsupsetneqq: varsupsetneqq,
  vartheta: vartheta,
  vartriangleleft: vartriangleleft,
  vartriangleright: vartriangleright,
  Vbar: Vbar,
  vBar: vBar,
  vBarv: vBarv,
  Vcy: Vcy,
  vcy: vcy,
  VDash: VDash,
  Vdash: Vdash,
  vDash: vDash,
  vdash: vdash,
  Vdashl: Vdashl,
  Vee: Vee,
  vee: vee$1,
  veebar: veebar,
  veeeq: veeeq,
  vellip: vellip,
  Verbar: Verbar,
  verbar: verbar,
  Vert: Vert$1,
  vert: vert$1,
  VerticalBar: VerticalBar,
  VerticalLine: VerticalLine,
  VerticalSeparator: VerticalSeparator,
  VerticalTilde: VerticalTilde,
  VeryThinSpace: VeryThinSpace,
  Vfr: Vfr,
  vfr: vfr,
  vltri: vltri,
  vnsub: vnsub,
  vnsup: vnsup,
  Vopf: Vopf,
  vopf: vopf,
  vprop: vprop,
  vrtri: vrtri,
  Vscr: Vscr,
  vscr: vscr,
  vsubnE: vsubnE,
  vsubne: vsubne,
  vsupnE: vsupnE,
  vsupne: vsupne,
  Vvdash: Vvdash,
  vzigzag: vzigzag,
  Wcirc: Wcirc,
  wcirc: wcirc,
  wedbar: wedbar,
  Wedge: Wedge$1,
  wedge: wedge$1,
  wedgeq: wedgeq,
  weierp: weierp,
  Wfr: Wfr,
  wfr: wfr,
  Wopf: Wopf,
  wopf: wopf,
  wp: wp,
  wr: wr,
  wreath: wreath$1,
  Wscr: Wscr,
  wscr: wscr,
  xcap: xcap,
  xcirc: xcirc,
  xcup: xcup,
  xdtri: xdtri,
  Xfr: Xfr,
  xfr: xfr,
  xhArr: xhArr,
  xharr: xharr,
  Xi: Xi$1,
  xi: xi$1,
  xlArr: xlArr,
  xlarr: xlarr,
  xmap: xmap,
  xnis: xnis,
  xodot: xodot,
  Xopf: Xopf,
  xopf: xopf,
  xoplus: xoplus,
  xotime: xotime,
  xrArr: xrArr,
  xrarr: xrarr,
  Xscr: Xscr,
  xscr: xscr,
  xsqcup: xsqcup,
  xuplus: xuplus,
  xutri: xutri,
  xvee: xvee,
  xwedge: xwedge,
  Yacute: Yacute,
  yacute: yacute,
  YAcy: YAcy,
  yacy: yacy,
  Ycirc: Ycirc$1,
  ycirc: ycirc$1,
  Ycy: Ycy,
  ycy: ycy$1,
  yen: yen$1,
  Yfr: Yfr,
  yfr: yfr,
  YIcy: YIcy,
  yicy: yicy,
  Yopf: Yopf,
  yopf: yopf,
  Yscr: Yscr,
  yscr: yscr,
  YUcy: YUcy,
  yucy: yucy,
  Yuml: Yuml,
  yuml: yuml,
  Zacute: Zacute$1,
  zacute: zacute$1,
  Zcaron: Zcaron,
  zcaron: zcaron,
  Zcy: Zcy,
  zcy: zcy,
  Zdot: Zdot,
  zdot: zdot,
  zeetrf: zeetrf,
  ZeroWidthSpace: ZeroWidthSpace,
  Zeta: Zeta$1,
  zeta: zeta$1,
  Zfr: Zfr,
  zfr: zfr,
  ZHcy: ZHcy,
  zhcy: zhcy,
  zigrarr: zigrarr,
  Zopf: Zopf,
  zopf: zopf,
  Zscr: Zscr,
  zscr: zscr,
  zwj: zwj,
  zwnj: zwnj
};
var ound = "pound";
var pond = "pound";
var poubd = "pound";
var poud = "pound";
var poumd = "pound";
var poun = "pound";
var pund = "pound";
var zvbj = "zwnj";
var zvhj = "zwnj";
var zvjb = "zwnj";
var zvjh = "zwnj";
var zvjm = "zwnj";
var zvjn = "zwnj";
var zvmj = "zwnj";
var zvng = "zwnj";
var zvnh = "zwnj";
var zvnj = "zwnj";
var zvnk = "zwnj";
var zvnm = "zwnj";
var zwbj = "zwnj";
var zwhj = "zwnj";
var zwjb = "zwnj";
var zwjh = "zwnj";
var zwjm = "zwnj";
var zwjn = "zwnj";
var zwmj = "zwnj";
var zwng = "zwnj";
var zwnh = "zwnj";
var zwnk = "zwnj";
var zwnm = "zwnj";
var bsp = "nbsp";
var nsp = "nbsp";
var nbp = "nbsp";
var nbs = "nbsp";
var brokenNamedEntitiesJson = {
  ound: ound,
  pond: pond,
  poubd: poubd,
  poud: poud,
  poumd: poumd,
  poun: poun,
  pund: pund,
  zvbj: zvbj,
  zvhj: zvhj,
  zvjb: zvjb,
  zvjh: zvjh,
  zvjm: zvjm,
  zvjn: zvjn,
  zvmj: zvmj,
  zvng: zvng,
  zvnh: zvnh,
  zvnj: zvnj,
  zvnk: zvnk,
  zvnm: zvnm,
  zwbj: zwbj,
  zwhj: zwhj,
  zwjb: zwjb,
  zwjh: zwjh,
  zwjm: zwjm,
  zwjn: zwjn,
  zwmj: zwmj,
  zwng: zwng,
  zwnh: zwnh,
  zwnk: zwnk,
  zwnm: zwnm,
  bsp: bsp,
  nsp: nsp,
  nbp: nbp,
  nbs: nbs
};
var A = {
  a: ["Aacute"],
  b: ["Abreve"],
  c: ["Acirc", "Acy"],
  E: ["AElig"],
  f: ["Afr"],
  g: ["Agrave"],
  l: ["Alpha"],
  m: ["Amacr"],
  M: ["AMP"],
  n: ["And"],
  o: ["Aogon", "Aopf"],
  p: ["ApplyFunction"],
  r: ["Aring"],
  s: ["Ascr", "Assign"],
  t: ["Atilde"],
  u: ["Auml"]
};
var a$3 = {
  a: ["aacute"],
  b: ["abreve"],
  c: ["ac", "acd", "acE", "acirc", "acute", "acy"],
  e: ["aelig"],
  f: ["af", "afr"],
  g: ["agrave"],
  l: ["alefsym", "aleph", "alpha"],
  m: ["amacr", "amalg", "amp"],
  n: ["and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr"],
  o: ["aogon", "aopf"],
  p: ["ap", "apacir", "apE", "ape", "apid", "apos", "approx", "approxeq"],
  r: ["aring"],
  s: ["ascr", "ast", "asymp", "asympeq"],
  t: ["atilde"],
  u: ["auml"],
  w: ["awconint", "awint"]
};
var b$3 = {
  a: ["backcong", "backepsilon", "backprime", "backsim", "backsimeq", "barvee", "barwed", "barwedge"],
  b: ["bbrk", "bbrktbrk"],
  c: ["bcong", "bcy"],
  d: ["bdquo"],
  e: ["becaus", "because", "bemptyv", "bepsi", "bernou", "beta", "beth", "between"],
  f: ["bfr"],
  i: ["bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge"],
  k: ["bkarow"],
  l: ["blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block"],
  n: ["bne", "bnequiv", "bnot"],
  N: ["bNot"],
  o: ["bopf", "bot", "bottom", "bowtie", "boxbox", "boxDL", "boxDl", "boxdL", "boxdl", "boxDR", "boxDr", "boxdR", "boxdr", "boxH", "boxh", "boxHD", "boxHd", "boxhD", "boxhd", "boxHU", "boxHu", "boxhU", "boxhu", "boxminus", "boxplus", "boxtimes", "boxUL", "boxUl", "boxuL", "boxul", "boxUR", "boxUr", "boxuR", "boxur", "boxV", "boxv", "boxVH", "boxVh", "boxvH", "boxvh", "boxVL", "boxVl", "boxvL", "boxvl", "boxVR", "boxVr", "boxvR", "boxvr"],
  p: ["bprime"],
  r: ["breve", "brvbar"],
  s: ["bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub"],
  u: ["bull", "bullet", "bump", "bumpE", "bumpe", "bumpeq"]
};
var B = {
  a: ["Backslash", "Barv", "Barwed"],
  c: ["Bcy"],
  e: ["Because", "Bernoullis", "Beta"],
  f: ["Bfr"],
  o: ["Bopf"],
  r: ["Breve"],
  s: ["Bscr"],
  u: ["Bumpeq"]
};
var C = {
  a: ["Cacute", "Cap", "CapitalDifferentialD", "Cayleys"],
  c: ["Ccaron", "Ccedil", "Ccirc", "Cconint"],
  d: ["Cdot"],
  e: ["Cedilla", "CenterDot"],
  f: ["Cfr"],
  H: ["CHcy"],
  h: ["Chi"],
  i: ["CircleDot", "CircleMinus", "CirclePlus", "CircleTimes"],
  l: ["ClockwiseContourIntegral", "CloseCurlyDoubleQuote", "CloseCurlyQuote"],
  o: ["Colon", "Colone", "Congruent", "Conint", "ContourIntegral", "Copf", "Coproduct", "CounterClockwiseContourIntegral"],
  O: ["COPY"],
  r: ["Cross"],
  s: ["Cscr"],
  u: ["Cup", "CupCap"]
};
var c$3 = {
  a: ["cacute", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "caps", "caret", "caron"],
  c: ["ccaps", "ccaron", "ccedil", "ccirc", "ccups", "ccupssm"],
  d: ["cdot"],
  e: ["cedil", "cemptyv", "cent", "centerdot"],
  f: ["cfr"],
  h: ["chcy", "check", "checkmark", "chi"],
  i: ["cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "circledR", "circledS", "cirE", "cire", "cirfnint", "cirmid", "cirscir"],
  l: ["clubs", "clubsuit"],
  o: ["colon", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "conint", "copf", "coprod", "copy", "copysr"],
  r: ["crarr", "cross"],
  s: ["cscr", "csub", "csube", "csup", "csupe"],
  t: ["ctdot"],
  u: ["cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "cup", "cupbrcap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed"],
  w: ["cwconint", "cwint"],
  y: ["cylcty"]
};
var D$1 = {
  a: ["Dagger", "Darr", "Dashv"],
  c: ["Dcaron", "Dcy"],
  D: ["DD", "DDotrahd"],
  e: ["Del", "Delta"],
  f: ["Dfr"],
  i: ["DiacriticalAcute", "DiacriticalDot", "DiacriticalDoubleAcute", "DiacriticalGrave", "DiacriticalTilde", "Diamond", "DifferentialD"],
  J: ["DJcy"],
  o: ["Dopf", "Dot", "DotDot", "DotEqual", "DoubleContourIntegral", "DoubleDot", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLeftTee", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleRightTee", "DoubleUpArrow", "DoubleUpDownArrow", "DoubleVerticalBar", "DownArrow", "Downarrow", "DownArrowBar", "DownArrowUpArrow", "DownBreve", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownLeftVectorBar", "DownRightTeeVector", "DownRightVector", "DownRightVectorBar", "DownTee", "DownTeeArrow"],
  s: ["Dscr", "Dstrok"],
  S: ["DScy"],
  Z: ["DZcy"]
};
var d$3 = {
  a: ["dagger", "daleth", "darr", "dash", "dashv"],
  A: ["dArr"],
  b: ["dbkarow", "dblac"],
  c: ["dcaron", "dcy"],
  d: ["dd", "ddagger", "ddarr", "ddotseq"],
  e: ["deg", "delta", "demptyv"],
  f: ["dfisht", "dfr"],
  H: ["dHar"],
  h: ["dharl", "dharr"],
  i: ["diam", "diamond", "diamondsuit", "diams", "die", "digamma", "disin", "div", "divide", "divideontimes", "divonx"],
  j: ["djcy"],
  l: ["dlcorn", "dlcrop"],
  o: ["dollar", "dopf", "dot", "doteq", "doteqdot", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "downarrow", "downdownarrows", "downharpoonleft", "downharpoonright"],
  r: ["drbkarow", "drcorn", "drcrop"],
  s: ["dscr", "dscy", "dsol", "dstrok"],
  t: ["dtdot", "dtri", "dtrif"],
  u: ["duarr", "duhar"],
  w: ["dwangle"],
  z: ["dzcy", "dzigrarr"]
};
var E$1 = {
  a: ["Eacute"],
  c: ["Ecaron", "Ecirc", "Ecy"],
  d: ["Edot"],
  f: ["Efr"],
  g: ["Egrave"],
  l: ["Element"],
  m: ["Emacr", "EmptySmallSquare", "EmptyVerySmallSquare"],
  N: ["ENG"],
  o: ["Eogon", "Eopf"],
  p: ["Epsilon"],
  q: ["Equal", "EqualTilde", "Equilibrium"],
  s: ["Escr", "Esim"],
  t: ["Eta"],
  T: ["ETH"],
  u: ["Euml"],
  x: ["Exists", "ExponentialE"]
};
var e$3 = {
  a: ["eacute", "easter"],
  c: ["ecaron", "ecir", "ecirc", "ecolon", "ecy"],
  D: ["eDDot", "eDot"],
  d: ["edot"],
  e: ["ee"],
  f: ["efDot", "efr"],
  g: ["eg", "egrave", "egs", "egsdot"],
  l: ["el", "elinters", "ell", "els", "elsdot"],
  m: ["emacr", "empty", "emptyset", "emptyv", "emsp", "emsp13", "emsp14"],
  n: ["eng", "ensp"],
  o: ["eogon", "eopf"],
  p: ["epar", "eparsl", "eplus", "epsi", "epsilon", "epsiv"],
  q: ["eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "equals", "equest", "equiv", "equivDD", "eqvparsl"],
  r: ["erarr", "erDot"],
  s: ["escr", "esdot", "esim"],
  t: ["eta", "eth"],
  u: ["euml", "euro"],
  x: ["excl", "exist", "expectation", "exponentiale"]
};
var f$3 = {
  a: ["fallingdotseq"],
  c: ["fcy"],
  e: ["female"],
  f: ["ffilig", "fflig", "ffllig", "ffr"],
  i: ["filig"],
  j: ["fjlig"],
  l: ["flat", "fllig", "fltns"],
  n: ["fnof"],
  o: ["fopf", "forall", "fork", "forkv"],
  p: ["fpartint"],
  r: ["frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown"],
  s: ["fscr"]
};
var F = {
  c: ["Fcy"],
  f: ["Ffr"],
  i: ["FilledSmallSquare", "FilledVerySmallSquare"],
  o: ["Fopf", "ForAll", "Fouriertrf"],
  s: ["Fscr"]
};
var g$3 = {
  a: ["gacute", "gamma", "gammad", "gap"],
  b: ["gbreve"],
  c: ["gcirc", "gcy"],
  d: ["gdot"],
  E: ["gE", "gEl"],
  e: ["ge", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles"],
  f: ["gfr"],
  g: ["gg", "ggg"],
  i: ["gimel"],
  j: ["gjcy"],
  l: ["gl", "gla", "glE", "glj"],
  n: ["gnap", "gnapprox", "gnE", "gne", "gneq", "gneqq", "gnsim"],
  o: ["gopf"],
  r: ["grave"],
  s: ["gscr", "gsim", "gsime", "gsiml"],
  t: ["gt", "gtcc", "gtcir", "gtdot", "gtlPar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim"],
  v: ["gvertneqq", "gvnE"]
};
var G$1 = {
  a: ["Gamma", "Gammad"],
  b: ["Gbreve"],
  c: ["Gcedil", "Gcirc", "Gcy"],
  d: ["Gdot"],
  f: ["Gfr"],
  g: ["Gg"],
  J: ["GJcy"],
  o: ["Gopf"],
  r: ["GreaterEqual", "GreaterEqualLess", "GreaterFullEqual", "GreaterGreater", "GreaterLess", "GreaterSlantEqual", "GreaterTilde"],
  s: ["Gscr"],
  T: ["GT"],
  t: ["Gt"]
};
var H$1 = {
  a: ["Hacek", "Hat"],
  A: ["HARDcy"],
  c: ["Hcirc"],
  f: ["Hfr"],
  i: ["HilbertSpace"],
  o: ["Hopf", "HorizontalLine"],
  s: ["Hscr", "Hstrok"],
  u: ["HumpDownHump", "HumpEqual"]
};
var h$3 = {
  a: ["hairsp", "half", "hamilt", "hardcy", "harr", "harrcir", "harrw"],
  A: ["hArr"],
  b: ["hbar"],
  c: ["hcirc"],
  e: ["hearts", "heartsuit", "hellip", "hercon"],
  f: ["hfr"],
  k: ["hksearow", "hkswarow"],
  o: ["hoarr", "homtht", "hookleftarrow", "hookrightarrow", "hopf", "horbar"],
  s: ["hscr", "hslash", "hstrok"],
  y: ["hybull", "hyphen"]
};
var I$1 = {
  a: ["Iacute"],
  c: ["Icirc", "Icy"],
  d: ["Idot"],
  E: ["IEcy"],
  f: ["Ifr"],
  g: ["Igrave"],
  J: ["IJlig"],
  m: ["Im", "Imacr", "ImaginaryI", "Implies"],
  n: ["Int", "Integral", "Intersection", "InvisibleComma", "InvisibleTimes"],
  O: ["IOcy"],
  o: ["Iogon", "Iopf", "Iota"],
  s: ["Iscr"],
  t: ["Itilde"],
  u: ["Iukcy", "Iuml"]
};
var i$3 = {
  a: ["iacute"],
  c: ["ic", "icirc", "icy"],
  e: ["iecy", "iexcl"],
  f: ["iff", "ifr"],
  g: ["igrave"],
  i: ["ii", "iiiint", "iiint", "iinfin", "iiota"],
  j: ["ijlig"],
  m: ["imacr", "image", "imagline", "imagpart", "imath", "imof", "imped"],
  n: ["in", "incare", "infin", "infintie", "inodot", "int", "intcal", "integers", "intercal", "intlarhk", "intprod"],
  o: ["iocy", "iogon", "iopf", "iota"],
  p: ["iprod"],
  q: ["iquest"],
  s: ["iscr", "isin", "isindot", "isinE", "isins", "isinsv", "isinv"],
  t: ["it", "itilde"],
  u: ["iukcy", "iuml"]
};
var J = {
  c: ["Jcirc", "Jcy"],
  f: ["Jfr"],
  o: ["Jopf"],
  s: ["Jscr", "Jsercy"],
  u: ["Jukcy"]
};
var j$3 = {
  c: ["jcirc", "jcy"],
  f: ["jfr"],
  m: ["jmath"],
  o: ["jopf"],
  s: ["jscr", "jsercy"],
  u: ["jukcy"]
};
var K = {
  a: ["Kappa"],
  c: ["Kcedil", "Kcy"],
  f: ["Kfr"],
  H: ["KHcy"],
  J: ["KJcy"],
  o: ["Kopf"],
  s: ["Kscr"]
};
var k$3 = {
  a: ["kappa", "kappav"],
  c: ["kcedil", "kcy"],
  f: ["kfr"],
  g: ["kgreen"],
  h: ["khcy"],
  j: ["kjcy"],
  o: ["kopf"],
  s: ["kscr"]
};
var l$3 = {
  A: ["lAarr", "lArr", "lAtail"],
  a: ["lacute", "laemptyv", "lagran", "lambda", "lang", "langd", "langle", "lap", "laquo", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "latail", "late", "lates"],
  B: ["lBarr"],
  b: ["lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu"],
  c: ["lcaron", "lcedil", "lceil", "lcub", "lcy"],
  d: ["ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh"],
  E: ["lE", "lEg"],
  e: ["le", "leftarrow", "leftarrowtail", "leftharpoondown", "leftharpoonup", "leftleftarrows", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "leftthreetimes", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "lessgtr", "lesssim"],
  f: ["lfisht", "lfloor", "lfr"],
  g: ["lg", "lgE"],
  H: ["lHar"],
  h: ["lhard", "lharu", "lharul", "lhblk"],
  j: ["ljcy"],
  l: ["ll", "llarr", "llcorner", "llhard", "lltri"],
  m: ["lmidot", "lmoust", "lmoustache"],
  n: ["lnap", "lnapprox", "lnE", "lne", "lneq", "lneqq", "lnsim"],
  o: ["loang", "loarr", "lobrk", "longleftarrow", "longleftrightarrow", "longmapsto", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "lopf", "loplus", "lotimes", "lowast", "lowbar", "loz", "lozenge", "lozf"],
  p: ["lpar", "lparlt"],
  r: ["lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri"],
  s: ["lsaquo", "lscr", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "lstrok"],
  t: ["lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrPar"],
  u: ["lurdshar", "luruhar"],
  v: ["lvertneqq", "lvnE"]
};
var L$1 = {
  a: ["Lacute", "Lambda", "Lang", "Laplacetrf", "Larr"],
  c: ["Lcaron", "Lcedil", "Lcy"],
  e: ["LeftAngleBracket", "LeftArrow", "Leftarrow", "LeftArrowBar", "LeftArrowRightArrow", "LeftCeiling", "LeftDoubleBracket", "LeftDownTeeVector", "LeftDownVector", "LeftDownVectorBar", "LeftFloor", "LeftRightArrow", "Leftrightarrow", "LeftRightVector", "LeftTee", "LeftTeeArrow", "LeftTeeVector", "LeftTriangle", "LeftTriangleBar", "LeftTriangleEqual", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftUpVectorBar", "LeftVector", "LeftVectorBar", "LessEqualGreater", "LessFullEqual", "LessGreater", "LessLess", "LessSlantEqual", "LessTilde"],
  f: ["Lfr"],
  J: ["LJcy"],
  l: ["Ll", "Lleftarrow"],
  m: ["Lmidot"],
  o: ["LongLeftArrow", "Longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "LongRightArrow", "Longrightarrow", "Lopf", "LowerLeftArrow", "LowerRightArrow"],
  s: ["Lscr", "Lsh", "Lstrok"],
  T: ["LT"],
  t: ["Lt"]
};
var m$3 = {
  a: ["macr", "male", "malt", "maltese", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker"],
  c: ["mcomma", "mcy"],
  d: ["mdash"],
  D: ["mDDot"],
  e: ["measuredangle"],
  f: ["mfr"],
  h: ["mho"],
  i: ["micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu"],
  l: ["mlcp", "mldr"],
  n: ["mnplus"],
  o: ["models", "mopf"],
  p: ["mp"],
  s: ["mscr", "mstpos"],
  u: ["mu", "multimap", "mumap"]
};
var M = {
  a: ["Map"],
  c: ["Mcy"],
  e: ["MediumSpace", "Mellintrf"],
  f: ["Mfr"],
  i: ["MinusPlus"],
  o: ["Mopf"],
  s: ["Mscr"],
  u: ["Mu"]
};
var n$3 = {
  a: ["nabla", "nacute", "nang", "nap", "napE", "napid", "napos", "napprox", "natur", "natural", "naturals"],
  b: ["nbsp", "nbump", "nbumpe"],
  c: ["ncap", "ncaron", "ncedil", "ncong", "ncongdot", "ncup", "ncy"],
  d: ["ndash"],
  e: ["ne", "nearhk", "neArr", "nearr", "nearrow", "nedot", "nequiv", "nesear", "nesim", "nexist", "nexists"],
  f: ["nfr"],
  g: ["ngE", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "ngsim", "ngt", "ngtr"],
  G: ["nGg", "nGt", "nGtv"],
  h: ["nhArr", "nharr", "nhpar"],
  i: ["ni", "nis", "nisd", "niv"],
  j: ["njcy"],
  l: ["nlArr", "nlarr", "nldr", "nlE", "nle", "nleftarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nlsim", "nlt", "nltri", "nltrie"],
  L: ["nLeftarrow", "nLeftrightarrow", "nLl", "nLt", "nLtv"],
  m: ["nmid"],
  o: ["nopf", "not", "notin", "notindot", "notinE", "notinva", "notinvb", "notinvc", "notni", "notniva", "notnivb", "notnivc"],
  p: ["npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq"],
  r: ["nrArr", "nrarr", "nrarrc", "nrarrw", "nrightarrow", "nrtri", "nrtrie"],
  R: ["nRightarrow"],
  s: ["nsc", "nsccue", "nsce", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsubE", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupE", "nsupe", "nsupset", "nsupseteq", "nsupseteqq"],
  t: ["ntgl", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq"],
  u: ["nu", "num", "numero", "numsp"],
  v: ["nvap", "nvDash", "nvdash", "nvge", "nvgt", "nvHarr", "nvinfin", "nvlArr", "nvle", "nvlt", "nvltrie", "nvrArr", "nvrtrie", "nvsim"],
  V: ["nVDash", "nVdash"],
  w: ["nwarhk", "nwArr", "nwarr", "nwarrow", "nwnear"]
};
var N$1 = {
  a: ["Nacute"],
  c: ["Ncaron", "Ncedil", "Ncy"],
  e: ["NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "NestedGreaterGreater", "NestedLessLess", "NewLine"],
  f: ["Nfr"],
  J: ["NJcy"],
  o: ["NoBreak", "NonBreakingSpace", "Nopf", "Not", "NotCongruent", "NotCupCap", "NotDoubleVerticalBar", "NotElement", "NotEqual", "NotEqualTilde", "NotExists", "NotGreater", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterGreater", "NotGreaterLess", "NotGreaterSlantEqual", "NotGreaterTilde", "NotHumpDownHump", "NotHumpEqual", "NotLeftTriangle", "NotLeftTriangleBar", "NotLeftTriangleEqual", "NotLess", "NotLessEqual", "NotLessGreater", "NotLessLess", "NotLessSlantEqual", "NotLessTilde", "NotNestedGreaterGreater", "NotNestedLessLess", "NotPrecedes", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotReverseElement", "NotRightTriangle", "NotRightTriangleBar", "NotRightTriangleEqual", "NotSquareSubset", "NotSquareSubsetEqual", "NotSquareSuperset", "NotSquareSupersetEqual", "NotSubset", "NotSubsetEqual", "NotSucceeds", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSucceedsTilde", "NotSuperset", "NotSupersetEqual", "NotTilde", "NotTildeEqual", "NotTildeFullEqual", "NotTildeTilde", "NotVerticalBar"],
  s: ["Nscr"],
  t: ["Ntilde"],
  u: ["Nu"]
};
var O = {
  a: ["Oacute"],
  c: ["Ocirc", "Ocy"],
  d: ["Odblac"],
  E: ["OElig"],
  f: ["Ofr"],
  g: ["Ograve"],
  m: ["Omacr", "Omega", "Omicron"],
  o: ["Oopf"],
  p: ["OpenCurlyDoubleQuote", "OpenCurlyQuote"],
  r: ["Or"],
  s: ["Oscr", "Oslash"],
  t: ["Otilde", "Otimes"],
  u: ["Ouml"],
  v: ["OverBar", "OverBrace", "OverBracket", "OverParenthesis"]
};
var o$3 = {
  a: ["oacute", "oast"],
  c: ["ocir", "ocirc", "ocy"],
  d: ["odash", "odblac", "odiv", "odot", "odsold"],
  e: ["oelig"],
  f: ["ofcir", "ofr"],
  g: ["ogon", "ograve", "ogt"],
  h: ["ohbar", "ohm"],
  i: ["oint"],
  l: ["olarr", "olcir", "olcross", "oline", "olt"],
  m: ["omacr", "omega", "omicron", "omid", "ominus"],
  o: ["oopf"],
  p: ["opar", "operp", "oplus"],
  r: ["or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv"],
  S: ["oS"],
  s: ["oscr", "oslash", "osol"],
  t: ["otilde", "otimes", "otimesas"],
  u: ["ouml"],
  v: ["ovbar"]
};
var p$3 = {
  a: ["par", "para", "parallel", "parsim", "parsl", "part"],
  c: ["pcy"],
  e: ["percnt", "period", "permil", "perp", "pertenk"],
  f: ["pfr"],
  h: ["phi", "phiv", "phmmat", "phone"],
  i: ["pi", "pitchfork", "piv"],
  l: ["planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "plusmn", "plussim", "plustwo"],
  m: ["pm"],
  o: ["pointint", "popf", "pound"],
  r: ["pr", "prap", "prcue", "prE", "pre", "prec", "precapprox", "preccurlyeq", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "prime", "primes", "prnap", "prnE", "prnsim", "prod", "profalar", "profline", "profsurf", "prop", "propto", "prsim", "prurel"],
  s: ["pscr", "psi"],
  u: ["puncsp"]
};
var P$1 = {
  a: ["PartialD"],
  c: ["Pcy"],
  f: ["Pfr"],
  h: ["Phi"],
  i: ["Pi"],
  l: ["PlusMinus"],
  o: ["Poincareplane", "Popf"],
  r: ["Pr", "Precedes", "PrecedesEqual", "PrecedesSlantEqual", "PrecedesTilde", "Prime", "Product", "Proportion", "Proportional"],
  s: ["Pscr", "Psi"]
};
var Q = {
  f: ["Qfr"],
  o: ["Qopf"],
  s: ["Qscr"],
  U: ["QUOT"]
};
var q$3 = {
  f: ["qfr"],
  i: ["qint"],
  o: ["qopf"],
  p: ["qprime"],
  s: ["qscr"],
  u: ["quaternions", "quatint", "quest", "questeq", "quot"]
};
var r$3 = {
  A: ["rAarr", "rArr", "rAtail"],
  a: ["race", "racute", "radic", "raemptyv", "rang", "rangd", "range", "rangle", "raquo", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "rarrtl", "rarrw", "ratail", "ratio", "rationals"],
  B: ["rBarr"],
  b: ["rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu"],
  c: ["rcaron", "rcedil", "rceil", "rcub", "rcy"],
  d: ["rdca", "rdldhar", "rdquo", "rdquor", "rdsh"],
  e: ["real", "realine", "realpart", "reals", "rect", "reg"],
  f: ["rfisht", "rfloor", "rfr"],
  H: ["rHar"],
  h: ["rhard", "rharu", "rharul", "rho", "rhov"],
  i: ["rightarrow", "rightarrowtail", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "rightthreetimes", "ring", "risingdotseq"],
  l: ["rlarr", "rlhar", "rlm"],
  m: ["rmoust", "rmoustache"],
  n: ["rnmid"],
  o: ["roang", "roarr", "robrk", "ropar", "ropf", "roplus", "rotimes"],
  p: ["rpar", "rpargt", "rppolint"],
  r: ["rrarr"],
  s: ["rsaquo", "rscr", "rsh", "rsqb", "rsquo", "rsquor"],
  t: ["rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri"],
  u: ["ruluhar"],
  x: ["rx"]
};
var R$1 = {
  a: ["Racute", "Rang", "Rarr", "Rarrtl"],
  B: ["RBarr"],
  c: ["Rcaron", "Rcedil", "Rcy"],
  e: ["Re", "ReverseElement", "ReverseEquilibrium", "ReverseUpEquilibrium"],
  E: ["REG"],
  f: ["Rfr"],
  h: ["Rho"],
  i: ["RightAngleBracket", "RightArrow", "Rightarrow", "RightArrowBar", "RightArrowLeftArrow", "RightCeiling", "RightDoubleBracket", "RightDownTeeVector", "RightDownVector", "RightDownVectorBar", "RightFloor", "RightTee", "RightTeeArrow", "RightTeeVector", "RightTriangle", "RightTriangleBar", "RightTriangleEqual", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightUpVectorBar", "RightVector", "RightVectorBar"],
  o: ["Ropf", "RoundImplies"],
  r: ["Rrightarrow"],
  s: ["Rscr", "Rsh"],
  u: ["RuleDelayed"]
};
var S$1 = {
  a: ["Sacute"],
  c: ["Sc", "Scaron", "Scedil", "Scirc", "Scy"],
  f: ["Sfr"],
  H: ["SHCHcy", "SHcy"],
  h: ["ShortDownArrow", "ShortLeftArrow", "ShortRightArrow", "ShortUpArrow"],
  i: ["Sigma"],
  m: ["SmallCircle"],
  O: ["SOFTcy"],
  o: ["Sopf"],
  q: ["Sqrt", "Square", "SquareIntersection", "SquareSubset", "SquareSubsetEqual", "SquareSuperset", "SquareSupersetEqual", "SquareUnion"],
  s: ["Sscr"],
  t: ["Star"],
  u: ["Sub", "Subset", "SubsetEqual", "Succeeds", "SucceedsEqual", "SucceedsSlantEqual", "SucceedsTilde", "SuchThat", "Sum", "Sup", "Superset", "SupersetEqual", "Supset"]
};
var s$3 = {
  a: ["sacute"],
  b: ["sbquo"],
  c: ["sc", "scap", "scaron", "sccue", "scE", "sce", "scedil", "scirc", "scnap", "scnE", "scnsim", "scpolint", "scsim", "scy"],
  d: ["sdot", "sdotb", "sdote"],
  e: ["searhk", "seArr", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext"],
  f: ["sfr", "sfrown"],
  h: ["sharp", "shchcy", "shcy", "shortmid", "shortparallel", "shy"],
  i: ["sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simgE", "siml", "simlE", "simne", "simplus", "simrarr"],
  l: ["slarr"],
  m: ["smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes"],
  o: ["softcy", "sol", "solb", "solbar", "sopf"],
  p: ["spades", "spadesuit", "spar"],
  q: ["sqcap", "sqcaps", "sqcup", "sqcups", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "square", "squarf", "squf"],
  r: ["srarr"],
  s: ["sscr", "ssetmn", "ssmile", "sstarf"],
  t: ["star", "starf", "straightepsilon", "straightphi", "strns"],
  u: ["sub", "subdot", "subE", "sube", "subedot", "submult", "subnE", "subne", "subplus", "subrarr", "subset", "subseteq", "subseteqq", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "sum", "sung", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supE", "supe", "supedot", "suphsol", "suphsub", "suplarr", "supmult", "supnE", "supne", "supplus", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup"],
  w: ["swarhk", "swArr", "swarr", "swarrow", "swnwar"],
  z: ["szlig"]
};
var T$1 = {
  a: ["Tab", "Tau"],
  c: ["Tcaron", "Tcedil", "Tcy"],
  f: ["Tfr"],
  h: ["Therefore", "Theta", "ThickSpace", "ThinSpace"],
  H: ["THORN"],
  i: ["Tilde", "TildeEqual", "TildeFullEqual", "TildeTilde"],
  o: ["Topf"],
  R: ["TRADE"],
  r: ["TripleDot"],
  s: ["Tscr", "Tstrok"],
  S: ["TScy", "TSHcy"]
};
var t$3 = {
  a: ["target", "tau"],
  b: ["tbrk"],
  c: ["tcaron", "tcedil", "tcy"],
  d: ["tdot"],
  e: ["telrec"],
  f: ["tfr"],
  h: ["there4", "therefore", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "thinsp", "thkap", "thksim", "thorn"],
  i: ["tilde", "times", "timesb", "timesbar", "timesd", "tint"],
  o: ["toea", "top", "topbot", "topcir", "topf", "topfork", "tosa"],
  p: ["tprime"],
  r: ["trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "triplus", "trisb", "tritime", "trpezium"],
  s: ["tscr", "tscy", "tshcy", "tstrok"],
  w: ["twixt", "twoheadleftarrow", "twoheadrightarrow"]
};
var U$1 = {
  a: ["Uacute", "Uarr", "Uarrocir"],
  b: ["Ubrcy", "Ubreve"],
  c: ["Ucirc", "Ucy"],
  d: ["Udblac"],
  f: ["Ufr"],
  g: ["Ugrave"],
  m: ["Umacr"],
  n: ["UnderBar", "UnderBrace", "UnderBracket", "UnderParenthesis", "Union", "UnionPlus"],
  o: ["Uogon", "Uopf"],
  p: ["UpArrow", "Uparrow", "UpArrowBar", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "UpEquilibrium", "UpperLeftArrow", "UpperRightArrow", "Upsi", "Upsilon", "UpTee", "UpTeeArrow"],
  r: ["Uring"],
  s: ["Uscr"],
  t: ["Utilde"],
  u: ["Uuml"]
};
var u$3 = {
  a: ["uacute", "uarr"],
  A: ["uArr"],
  b: ["ubrcy", "ubreve"],
  c: ["ucirc", "ucy"],
  d: ["udarr", "udblac", "udhar"],
  f: ["ufisht", "ufr"],
  g: ["ugrave"],
  H: ["uHar"],
  h: ["uharl", "uharr", "uhblk"],
  l: ["ulcorn", "ulcorner", "ulcrop", "ultri"],
  m: ["umacr", "uml"],
  o: ["uogon", "uopf"],
  p: ["uparrow", "updownarrow", "upharpoonleft", "upharpoonright", "uplus", "upsi", "upsih", "upsilon", "upuparrows"],
  r: ["urcorn", "urcorner", "urcrop", "uring", "urtri"],
  s: ["uscr"],
  t: ["utdot", "utilde", "utri", "utrif"],
  u: ["uuarr", "uuml"],
  w: ["uwangle"]
};
var v$3 = {
  a: ["vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright"],
  A: ["vArr"],
  B: ["vBar", "vBarv"],
  c: ["vcy"],
  D: ["vDash"],
  d: ["vdash"],
  e: ["vee", "veebar", "veeeq", "vellip", "verbar", "vert"],
  f: ["vfr"],
  l: ["vltri"],
  n: ["vnsub", "vnsup"],
  o: ["vopf"],
  p: ["vprop"],
  r: ["vrtri"],
  s: ["vscr", "vsubnE", "vsubne", "vsupnE", "vsupne"],
  z: ["vzigzag"]
};
var V$1 = {
  b: ["Vbar"],
  c: ["Vcy"],
  D: ["VDash"],
  d: ["Vdash", "Vdashl"],
  e: ["Vee", "Verbar", "Vert", "VerticalBar", "VerticalLine", "VerticalSeparator", "VerticalTilde", "VeryThinSpace"],
  f: ["Vfr"],
  o: ["Vopf"],
  s: ["Vscr"],
  v: ["Vvdash"]
};
var W = {
  c: ["Wcirc"],
  e: ["Wedge"],
  f: ["Wfr"],
  o: ["Wopf"],
  s: ["Wscr"]
};
var w$3 = {
  c: ["wcirc"],
  e: ["wedbar", "wedge", "wedgeq", "weierp"],
  f: ["wfr"],
  o: ["wopf"],
  p: ["wp"],
  r: ["wr", "wreath"],
  s: ["wscr"]
};
var x$3 = {
  c: ["xcap", "xcirc", "xcup"],
  d: ["xdtri"],
  f: ["xfr"],
  h: ["xhArr", "xharr"],
  i: ["xi"],
  l: ["xlArr", "xlarr"],
  m: ["xmap"],
  n: ["xnis"],
  o: ["xodot", "xopf", "xoplus", "xotime"],
  r: ["xrArr", "xrarr"],
  s: ["xscr", "xsqcup"],
  u: ["xuplus", "xutri"],
  v: ["xvee"],
  w: ["xwedge"]
};
var X = {
  f: ["Xfr"],
  i: ["Xi"],
  o: ["Xopf"],
  s: ["Xscr"]
};
var Y$1 = {
  a: ["Yacute"],
  A: ["YAcy"],
  c: ["Ycirc", "Ycy"],
  f: ["Yfr"],
  I: ["YIcy"],
  o: ["Yopf"],
  s: ["Yscr"],
  U: ["YUcy"],
  u: ["Yuml"]
};
var y$3 = {
  a: ["yacute", "yacy"],
  c: ["ycirc", "ycy"],
  e: ["yen"],
  f: ["yfr"],
  i: ["yicy"],
  o: ["yopf"],
  s: ["yscr"],
  u: ["yucy", "yuml"]
};
var Z = {
  a: ["Zacute"],
  c: ["Zcaron", "Zcy"],
  d: ["Zdot"],
  e: ["ZeroWidthSpace", "Zeta"],
  f: ["Zfr"],
  H: ["ZHcy"],
  o: ["Zopf"],
  s: ["Zscr"]
};
var z$3 = {
  a: ["zacute"],
  c: ["zcaron", "zcy"],
  d: ["zdot"],
  e: ["zeetrf", "zeta"],
  f: ["zfr"],
  h: ["zhcy"],
  i: ["zigrarr"],
  o: ["zopf"],
  s: ["zscr"],
  w: ["zwj", "zwnj"]
};
var entStartsWithJson = {
  A: A,
  a: a$3,
  b: b$3,
  B: B,
  C: C,
  c: c$3,
  D: D$1,
  d: d$3,
  E: E$1,
  e: e$3,
  f: f$3,
  F: F,
  g: g$3,
  G: G$1,
  H: H$1,
  h: h$3,
  I: I$1,
  i: i$3,
  J: J,
  j: j$3,
  K: K,
  k: k$3,
  l: l$3,
  L: L$1,
  m: m$3,
  M: M,
  n: n$3,
  N: N$1,
  O: O,
  o: o$3,
  p: p$3,
  P: P$1,
  Q: Q,
  q: q$3,
  r: r$3,
  R: R$1,
  S: S$1,
  s: s$3,
  T: T$1,
  t: t$3,
  U: U$1,
  u: u$3,
  v: v$3,
  V: V$1,
  W: W,
  w: w$3,
  x: x$3,
  X: X,
  Y: Y$1,
  y: y$3,
  Z: Z,
  z: z$3
};
var e$2 = {
  t: ["Aacute", "aacute", "acute", "Cacute", "cacute", "CloseCurlyDoubleQuote", "CloseCurlyQuote", "DiacriticalAcute", "DiacriticalDoubleAcute", "Eacute", "eacute", "gacute", "Iacute", "iacute", "Lacute", "lacute", "late", "Nacute", "nacute", "Oacute", "oacute", "OpenCurlyDoubleQuote", "OpenCurlyQuote", "Racute", "racute", "Sacute", "sacute", "sdote", "smte", "Uacute", "uacute", "Yacute", "yacute", "Zacute", "zacute"],
  v: ["Abreve", "abreve", "Agrave", "agrave", "Breve", "breve", "DiacriticalGrave", "DownBreve", "Egrave", "egrave", "Gbreve", "gbreve", "grave", "Igrave", "igrave", "Ograve", "ograve", "Ubreve", "ubreve", "Ugrave", "ugrave"],
  p: ["andslope", "ape", "bumpe", "csupe", "nbumpe", "nsqsupe", "nsupe", "orslope", "sqsupe", "supe"],
  g: ["ange", "barwedge", "bigwedge", "blacklozenge", "curlywedge", "doublebarwedge", "ge", "image", "lozenge", "nge", "nvge", "range", "Wedge", "wedge", "xwedge"],
  l: ["angle", "blacktriangle", "dwangle", "exponentiale", "female", "langle", "le", "LeftTriangle", "male", "measuredangle", "nle", "NotLeftTriangle", "NotRightTriangle", "nvle", "rangle", "RightTriangle", "SmallCircle", "smile", "ssmile", "triangle", "uwangle"],
  a: ["angmsdae"],
  d: ["Atilde", "atilde", "DiacriticalTilde", "divide", "EqualTilde", "GreaterTilde", "Itilde", "itilde", "LessTilde", "NotEqualTilde", "NotGreaterTilde", "NotLessTilde", "NotSucceedsTilde", "NotTilde", "NotTildeTilde", "Ntilde", "ntilde", "Otilde", "otilde", "PrecedesTilde", "SucceedsTilde", "Tilde", "tilde", "TildeTilde", "trade", "Utilde", "utilde", "VerticalTilde"],
  m: ["backprime", "bprime", "bsime", "gsime", "lsime", "nsime", "Prime", "prime", "qprime", "sime", "tprime", "tritime", "xotime"],
  e: ["barvee", "bigvee", "curlyvee", "cuvee", "DoubleLeftTee", "DoubleRightTee", "DownTee", "ee", "LeftTee", "lthree", "RightTee", "rthree", "UpTee", "Vee", "vee", "xvee"],
  s: ["Because", "because", "maltese", "pluse"],
  r: ["blacksquare", "cire", "dotsquare", "EmptySmallSquare", "EmptyVerySmallSquare", "FilledSmallSquare", "FilledVerySmallSquare", "incare", "npre", "pre", "Square", "square", "Therefore", "therefore"],
  n: ["bne", "Colone", "colone", "gne", "HorizontalLine", "imagline", "lne", "ne", "NewLine", "oline", "phone", "Poincareplane", "profline", "realine", "simne", "subne", "supne", "VerticalLine", "vsubne", "vsupne"],
  i: ["bowtie", "die", "infintie", "ltrie", "nltrie", "nrtrie", "nvltrie", "nvrtrie", "rtrie", "trie"],
  b: ["csube", "nsqsube", "nsube", "sqsube", "sube"],
  c: ["HilbertSpace", "lbrace", "MediumSpace", "NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "NonBreakingSpace", "nsce", "OverBrace", "race", "rbrace", "sce", "ThickSpace", "ThinSpace", "UnderBrace", "VeryThinSpace", "ZeroWidthSpace"],
  k: ["lbrke", "rbrke"],
  h: ["lmoustache", "rmoustache"],
  u: ["nprcue", "nsccue", "prcue", "sccue"],
  R: ["Re"]
};
var c$2 = {
  a: ["ac", "angmsdac", "dblac", "Odblac", "odblac", "Udblac", "udblac"],
  r: ["Acirc", "acirc", "bigcirc", "Ccirc", "ccirc", "circ", "circledcirc", "Ecirc", "ecirc", "eqcirc", "Gcirc", "gcirc", "Hcirc", "hcirc", "Icirc", "icirc", "Jcirc", "jcirc", "nrarrc", "Ocirc", "ocirc", "rarrc", "Scirc", "scirc", "Ucirc", "ucirc", "Wcirc", "wcirc", "xcirc", "Ycirc", "ycirc"],
  s: ["cuesc", "nsc", "sc"],
  e: ["curlyeqprec", "nprec", "prec", "telrec"],
  c: ["curlyeqsucc", "gescc", "gtcc", "lescc", "ltcc", "nsucc", "succ"],
  i: ["ic", "radic"],
  v: ["notinvc", "notnivc"],
  S: ["Sc"]
};
var d$2 = {
  c: ["acd"],
  n: ["And", "and", "andand", "capand", "Diamond", "diamond", "pound"],
  d: ["andd", "dd"],
  s: ["angmsd", "minusd", "nisd", "timesd"],
  a: ["angmsdad", "Gammad", "gammad"],
  b: ["angrtvbd"],
  i: ["apid", "cirmid", "mid", "napid", "nmid", "nshortmid", "nsmid", "omid", "rnmid", "shortmid", "smid"],
  e: ["Barwed", "barwed", "cuwed", "imped", "RuleDelayed"],
  H: ["boxHd"],
  h: ["boxhd", "DDotrahd"],
  o: ["coprod", "intprod", "iprod", "period", "prod"],
  g: ["langd", "rangd"],
  l: ["lbrksld", "odsold", "rbrksld"],
  r: ["lhard", "llhard", "lrhard", "ord", "rhard"]
};
var E = {
  c: ["acE", "scE"],
  p: ["apE", "bumpE", "napE", "nsupE", "supE"],
  r: ["cirE", "prE"],
  l: ["ExponentialE", "glE", "lE", "nlE", "simlE"],
  g: ["gE", "lgE", "ngE", "simgE"],
  n: ["gnE", "gvnE", "isinE", "lnE", "lvnE", "notinE", "prnE", "scnE", "subnE", "supnE", "vsubnE", "vsupnE"],
  b: ["nsubE", "subE"],
  D: ["TRADE"]
};
var y$2 = {
  c: ["Acy", "acy", "Bcy", "bcy", "CHcy", "chcy", "Dcy", "dcy", "DJcy", "djcy", "DScy", "dscy", "DZcy", "dzcy", "Ecy", "ecy", "Fcy", "fcy", "Gcy", "gcy", "GJcy", "gjcy", "HARDcy", "hardcy", "Icy", "icy", "IEcy", "iecy", "IOcy", "iocy", "Iukcy", "iukcy", "Jcy", "jcy", "Jsercy", "jsercy", "Jukcy", "jukcy", "Kcy", "kcy", "KHcy", "khcy", "KJcy", "kjcy", "Lcy", "lcy", "LJcy", "ljcy", "Mcy", "mcy", "Ncy", "ncy", "NJcy", "njcy", "Ocy", "ocy", "Pcy", "pcy", "Rcy", "rcy", "Scy", "scy", "SHCHcy", "shchcy", "SHcy", "shcy", "SOFTcy", "softcy", "Tcy", "tcy", "TScy", "tscy", "TSHcy", "tshcy", "Ubrcy", "ubrcy", "Ucy", "ucy", "Vcy", "vcy", "YAcy", "yacy", "Ycy", "ycy", "YIcy", "yicy", "YUcy", "yucy", "Zcy", "zcy", "ZHcy", "zhcy"],
  p: ["copy"],
  t: ["cylcty", "empty"],
  h: ["shy"]
};
var g$2 = {
  i: ["AElig", "aelig", "ffilig", "fflig", "ffllig", "filig", "fjlig", "fllig", "IJlig", "ijlig", "OElig", "oelig", "szlig"],
  l: ["amalg", "lg", "ntlg"],
  n: ["ang", "Aring", "aring", "backcong", "bcong", "cong", "eng", "Lang", "lang", "LeftCeiling", "loang", "nang", "ncong", "Rang", "rang", "RightCeiling", "ring", "roang", "sung", "Uring", "uring", "varnothing"],
  a: ["angmsdag", "vzigzag"],
  e: ["deg", "eg", "leg", "reg"],
  G: ["Gg", "nGg"],
  g: ["gg", "ggg"],
  E: ["lEg"],
  s: ["lesg"],
  m: ["lsimg", "simg"]
};
var f$2 = {
  a: ["af", "angmsdaf", "sigmaf"],
  p: ["Aopf", "aopf", "Bopf", "bopf", "Copf", "copf", "Dopf", "dopf", "Eopf", "eopf", "Fopf", "fopf", "Gopf", "gopf", "Hopf", "hopf", "Iopf", "iopf", "Jopf", "jopf", "Kopf", "kopf", "Lopf", "lopf", "Mopf", "mopf", "Nopf", "nopf", "Oopf", "oopf", "Popf", "popf", "Qopf", "qopf", "Ropf", "ropf", "Sopf", "sopf", "Topf", "topf", "Uopf", "uopf", "Vopf", "vopf", "Wopf", "wopf", "Xopf", "xopf", "Yopf", "yopf", "Zopf", "zopf"],
  i: ["dtrif", "ltrif", "rtrif", "utrif"],
  o: ["fnof", "imof", "orderof", "origof"],
  r: ["Fouriertrf", "Laplacetrf", "Mellintrf", "profsurf", "squarf", "sstarf", "starf", "zeetrf"],
  l: ["half"],
  f: ["iff"],
  z: ["lozf"],
  d: ["ordf"],
  u: ["squf"]
};
var r$2 = {
  f: ["Afr", "afr", "Bfr", "bfr", "Cfr", "cfr", "Dfr", "dfr", "Efr", "efr", "Ffr", "ffr", "Gfr", "gfr", "Hfr", "hfr", "Ifr", "ifr", "Jfr", "jfr", "Kfr", "kfr", "Lfr", "lfr", "Mfr", "mfr", "Nfr", "nfr", "Ofr", "ofr", "Pfr", "pfr", "Qfr", "qfr", "Rfr", "rfr", "Sfr", "sfr", "Tfr", "tfr", "Ufr", "ufr", "Vfr", "vfr", "Wfr", "wfr", "Xfr", "xfr", "Yfr", "yfr", "Zfr", "zfr"],
  c: ["Amacr", "amacr", "Ascr", "ascr", "Bscr", "bscr", "Cscr", "cscr", "Dscr", "dscr", "Emacr", "emacr", "Escr", "escr", "Fscr", "fscr", "Gscr", "gscr", "Hscr", "hscr", "Imacr", "imacr", "Iscr", "iscr", "Jscr", "jscr", "Kscr", "kscr", "Lscr", "lscr", "macr", "Mscr", "mscr", "Nscr", "nscr", "Omacr", "omacr", "Oscr", "oscr", "Pscr", "pscr", "Qscr", "qscr", "Rscr", "rscr", "Sscr", "sscr", "Tscr", "tscr", "Umacr", "umacr", "Uscr", "uscr", "Vscr", "vscr", "Wscr", "wscr", "Xscr", "xscr", "Yscr", "yscr", "Zscr", "zscr"],
  r: ["angzarr", "crarr", "cudarrr", "cularr", "curarr", "Darr", "dArr", "darr", "ddarr", "dharr", "duarr", "dzigrarr", "erarr", "gtrarr", "hArr", "harr", "hoarr", "lAarr", "Larr", "lArr", "larr", "lBarr", "lbarr", "llarr", "loarr", "lrarr", "ltlarr", "neArr", "nearr", "nhArr", "nharr", "nlArr", "nlarr", "nrArr", "nrarr", "nvHarr", "nvlArr", "nvrArr", "nwArr", "nwarr", "olarr", "orarr", "rAarr", "Rarr", "rArr", "rarr", "RBarr", "rBarr", "rbarr", "rlarr", "roarr", "rrarr", "seArr", "searr", "simrarr", "slarr", "srarr", "subrarr", "suplarr", "swArr", "swarr", "Uarr", "uArr", "uarr", "udarr", "uharr", "uuarr", "vArr", "varr", "xhArr", "xharr", "xlArr", "xlarr", "xrArr", "xrarr", "zigrarr"],
  i: ["apacir", "cir", "cirscir", "ecir", "gtcir", "harrcir", "ltcir", "midcir", "ocir", "ofcir", "olcir", "plusacir", "pluscir", "topcir", "Uarrocir"],
  a: ["bigstar", "brvbar", "dHar", "dollar", "DoubleVerticalBar", "DownArrowBar", "DownLeftVectorBar", "DownRightVectorBar", "duhar", "epar", "gtlPar", "hbar", "horbar", "ldrdhar", "ldrushar", "LeftArrowBar", "LeftDownVectorBar", "LeftTriangleBar", "LeftUpVectorBar", "LeftVectorBar", "lHar", "lopar", "lowbar", "lpar", "lrhar", "ltrPar", "lurdshar", "luruhar", "nesear", "nhpar", "NotDoubleVerticalBar", "NotLeftTriangleBar", "NotRightTriangleBar", "NotVerticalBar", "npar", "nspar", "nwnear", "ohbar", "opar", "ovbar", "OverBar", "par", "profalar", "rdldhar", "rHar", "RightArrowBar", "RightDownVectorBar", "RightTriangleBar", "RightUpVectorBar", "RightVectorBar", "rlhar", "ropar", "rpar", "ruluhar", "seswar", "solbar", "spar", "Star", "star", "swnwar", "timesbar", "udhar", "uHar", "UnderBar", "UpArrowBar", "Vbar", "vBar", "veebar", "Verbar", "verbar", "VerticalBar", "wedbar"],
  D: ["boxDr"],
  d: ["boxdr", "mldr", "nldr"],
  U: ["boxUr"],
  u: ["boxur", "natur"],
  V: ["boxVr"],
  v: ["boxvr"],
  s: ["copysr"],
  p: ["cuepr", "npr", "pr"],
  o: ["cupor", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownRightTeeVector", "DownRightVector", "ldquor", "LeftDownTeeVector", "LeftDownVector", "LeftFloor", "LeftRightVector", "LeftTeeVector", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftVector", "lesdotor", "lfloor", "lsquor", "or", "oror", "rdquor", "rfloor", "RightDownTeeVector", "RightDownVector", "RightFloor", "RightTeeVector", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightVector", "rsquor", "VerticalSeparator"],
  e: ["Dagger", "dagger", "ddagger", "easter", "GreaterGreater", "LessEqualGreater", "LessGreater", "llcorner", "lrcorner", "marker", "NestedGreaterGreater", "NotGreater", "NotGreaterGreater", "NotLessGreater", "NotNestedGreaterGreater", "order", "ulcorner", "urcorner"],
  t: ["eqslantgtr", "lesseqgtr", "lesseqqgtr", "lessgtr", "ngtr"],
  O: ["Or"],
  P: ["Pr"],
  w: ["wr"]
};
var m$2 = {
  y: ["alefsym", "thetasym"],
  i: ["backsim", "bsim", "eqsim", "Esim", "esim", "gnsim", "gsim", "gtrsim", "larrsim", "lesssim", "lnsim", "lsim", "nesim", "ngsim", "nlsim", "nsim", "nvsim", "parsim", "plussim", "precnsim", "precsim", "prnsim", "prsim", "rarrsim", "scnsim", "scsim", "sim", "subsim", "succnsim", "succsim", "supsim", "thicksim", "thksim"],
  o: ["bottom"],
  s: ["ccupssm"],
  r: ["curarrm", "lrm"],
  a: ["diam"],
  u: ["Equilibrium", "num", "ReverseEquilibrium", "ReverseUpEquilibrium", "Sum", "sum", "trpezium", "UpEquilibrium"],
  I: ["Im"],
  h: ["ohm"],
  d: ["ordm"],
  p: ["pm"],
  l: ["rlm"]
};
var h$2 = {
  p: ["aleph", "angsph"],
  a: ["angmsdah"],
  s: ["Backslash", "circleddash", "dash", "hslash", "ldsh", "Lsh", "lsh", "mdash", "ndash", "nVDash", "nVdash", "nvDash", "nvdash", "odash", "Oslash", "oslash", "rdsh", "Rsh", "rsh", "VDash", "Vdash", "vDash", "vdash", "Vvdash"],
  t: ["beth", "daleth", "eth", "imath", "jmath", "wreath"],
  x: ["boxh"],
  V: ["boxVh"],
  v: ["boxvh"],
  k: ["planckh"],
  i: ["upsih"]
};
var a$2 = {
  h: ["Alpha", "alpha"],
  a: ["angmsdaa"],
  t: ["Beta", "beta", "Delta", "delta", "Eta", "eta", "iiota", "Iota", "iota", "Theta", "theta", "vartheta", "Zeta", "zeta"],
  l: ["Cedilla", "gla", "nabla"],
  m: ["comma", "digamma", "Gamma", "gamma", "InvisibleComma", "mcomma", "Sigma", "sigma", "varsigma"],
  p: ["Kappa", "kappa", "varkappa"],
  d: ["Lambda", "lambda"],
  c: ["ldca", "rdca"],
  v: ["notinva", "notniva"],
  g: ["Omega", "omega"],
  r: ["para"],
  e: ["toea"],
  s: ["tosa"]
};
var P = {
  M: ["AMP"]
};
var p$2 = {
  m: ["amp", "asymp", "bump", "comp", "HumpDownHump", "mp", "nbump", "NotHumpDownHump"],
  a: ["ap", "bigcap", "Cap", "cap", "capcap", "cupbrcap", "CupCap", "cupcap", "gap", "gnap", "lap", "lnap", "Map", "map", "multimap", "mumap", "nap", "ncap", "NotCupCap", "nvap", "prap", "prnap", "rarrap", "scap", "scnap", "sqcap", "thkap", "xcap", "xmap"],
  u: ["bigcup", "bigsqcup", "bigtriangleup", "capbrcup", "capcup", "csup", "Cup", "cup", "cupcup", "leftharpoonup", "mapstoup", "ncup", "nsup", "rightharpoonup", "sqcup", "sqsup", "subsup", "Sup", "sup", "supsup", "vnsup", "xcup", "xsqcup"],
  r: ["cularrp", "operp", "perp", "sharp", "weierp"],
  o: ["dlcrop", "drcrop", "prop", "top", "ulcrop", "urcrop", "vprop"],
  s: ["emsp", "ensp", "hairsp", "nbsp", "numsp", "puncsp", "thinsp"],
  i: ["hellip", "vellip"],
  l: ["larrlp", "rarrlp"],
  c: ["mlcp"],
  h: ["smashp"],
  w: ["wp"]
};
var v$2 = {
  d: ["andv"],
  r: ["Barv", "orv", "vBarv"],
  y: ["bemptyv", "cemptyv", "demptyv", "emptyv", "laemptyv", "raemptyv"],
  i: ["bnequiv", "div", "epsiv", "equiv", "nequiv", "niv", "odiv", "phiv", "piv"],
  x: ["boxv"],
  h: ["Dashv", "dashv"],
  k: ["forkv", "plankv"],
  s: ["isinsv"],
  n: ["isinv"],
  a: ["kappav", "sigmav", "thetav"],
  t: ["nGtv", "nLtv"],
  o: ["rhov"]
};
var b$2 = {
  a: ["angmsdab", "Tab"],
  v: ["angrtvb", "notinvb", "notnivb"],
  l: ["bsolb", "solb"],
  u: ["bsolhsub", "csub", "lcub", "nsub", "rcub", "sqsub", "Sub", "sub", "subsub", "supdsub", "suphsub", "supsub", "vnsub"],
  r: ["larrb", "rarrb"],
  q: ["lsqb", "rsqb"],
  s: ["minusb", "plusb", "timesb", "trisb"],
  t: ["sdotb"]
};
var t$2 = {
  r: ["angrt", "imagpart", "npart", "part", "realpart", "Sqrt", "vangrt", "Vert", "vert"],
  s: ["angst", "ast", "circledast", "equest", "exist", "gtquest", "iquest", "lmoust", "lowast", "ltquest", "midast", "nexist", "oast", "quest", "rmoust"],
  n: ["awconint", "awint", "Cconint", "cent", "cirfnint", "complement", "Congruent", "Conint", "conint", "cwconint", "cwint", "Element", "fpartint", "geqslant", "iiiint", "iiint", "Int", "int", "leqslant", "ngeqslant", "nleqslant", "NotCongruent", "NotElement", "NotReverseElement", "npolint", "oint", "percnt", "pointint", "qint", "quatint", "ReverseElement", "rppolint", "scpolint", "tint"],
  o: ["bigodot", "bNot", "bnot", "bot", "capdot", "Cdot", "cdot", "CenterDot", "centerdot", "CircleDot", "congdot", "ctdot", "cupdot", "DiacriticalDot", "Dot", "dot", "DotDot", "doteqdot", "DoubleDot", "dtdot", "eDDot", "Edot", "eDot", "edot", "efDot", "egsdot", "elsdot", "erDot", "esdot", "Gdot", "gdot", "gesdot", "gtdot", "gtrdot", "Idot", "inodot", "isindot", "lesdot", "lessdot", "Lmidot", "lmidot", "ltdot", "mDDot", "middot", "ncongdot", "nedot", "Not", "not", "notindot", "odot", "quot", "sdot", "simdot", "subdot", "subedot", "supdot", "supedot", "tdot", "topbot", "tridot", "TripleDot", "utdot", "xodot", "Zdot", "zdot"],
  f: ["blacktriangleleft", "circlearrowleft", "curvearrowleft", "downharpoonleft", "looparrowleft", "mapstoleft", "ntriangleleft", "triangleleft", "upharpoonleft", "vartriangleleft"],
  h: ["blacktriangleright", "circlearrowright", "curvearrowright", "dfisht", "downharpoonright", "homtht", "lfisht", "looparrowright", "ntriangleright", "rfisht", "triangleright", "ufisht", "upharpoonright", "vartriangleright"],
  e: ["bullet", "caret", "emptyset", "LeftAngleBracket", "LeftDoubleBracket", "NotSquareSubset", "NotSquareSuperset", "NotSubset", "NotSuperset", "nsubset", "nsupset", "OverBracket", "RightAngleBracket", "RightDoubleBracket", "sqsubset", "sqsupset", "SquareSubset", "SquareSuperset", "Subset", "subset", "Superset", "Supset", "supset", "target", "UnderBracket"],
  i: ["clubsuit", "diamondsuit", "heartsuit", "it", "spadesuit"],
  a: ["commat", "flat", "Hat", "lat", "phmmat", "SuchThat"],
  c: ["Coproduct", "Product", "rect", "sect"],
  G: ["Gt", "nGt"],
  g: ["gt", "ngt", "nvgt", "ogt", "rpargt"],
  l: ["hamilt", "lparlt", "lt", "malt", "nlt", "nvlt", "olt", "submult", "supmult"],
  L: ["Lt", "nLt"],
  x: ["sext", "twixt"],
  m: ["smt"]
};
var n$2 = {
  o: ["Aogon", "aogon", "ApplyFunction", "backepsilon", "caron", "Ccaron", "ccaron", "Colon", "colon", "Dcaron", "dcaron", "Ecaron", "ecaron", "ecolon", "Eogon", "eogon", "Epsilon", "epsilon", "eqcolon", "expectation", "hercon", "Intersection", "Iogon", "iogon", "Lcaron", "lcaron", "Ncaron", "ncaron", "ogon", "Omicron", "omicron", "Proportion", "Rcaron", "rcaron", "Scaron", "scaron", "SquareIntersection", "SquareUnion", "straightepsilon", "Tcaron", "tcaron", "Union", "Uogon", "uogon", "Upsilon", "upsilon", "varepsilon", "Zcaron", "zcaron"],
  g: ["Assign"],
  e: ["between", "curren", "hyphen", "kgreen", "yen"],
  w: ["bigtriangledown", "blacktriangledown", "frown", "leftharpoondown", "mapstodown", "rightharpoondown", "sfrown", "triangledown"],
  f: ["compfn"],
  i: ["disin", "iinfin", "in", "infin", "isin", "notin", "nvinfin"],
  r: ["dlcorn", "drcorn", "thorn", "ulcorn", "urcorn"],
  a: ["lagran"],
  m: ["plusmn", "setmn", "ssetmn"]
};
var s$2 = {
  o: ["apos", "mstpos", "napos"],
  u: ["becaus", "bigoplus", "biguplus", "boxminus", "boxplus", "CircleMinus", "CirclePlus", "dotminus", "dotplus", "eplus", "loplus", "minus", "MinusPlus", "mnplus", "ominus", "oplus", "plus", "PlusMinus", "roplus", "setminus", "simplus", "smallsetminus", "subplus", "supplus", "triminus", "triplus", "UnionPlus", "uplus", "xoplus", "xuplus"],
  i: ["Bernoullis", "nis", "OverParenthesis", "UnderParenthesis", "xnis"],
  e: ["bigotimes", "boxtimes", "CircleTimes", "complexes", "divideontimes", "ges", "gesles", "Implies", "InvisibleTimes", "lates", "leftthreetimes", "les", "lesges", "lotimes", "ltimes", "nges", "nles", "NotPrecedes", "Otimes", "otimes", "Precedes", "primes", "rightthreetimes", "rotimes", "RoundImplies", "rtimes", "smtes", "spades", "times"],
  p: ["caps", "ccaps", "ccups", "cups", "sqcaps", "sqcups"],
  y: ["Cayleys"],
  b: ["clubs"],
  s: ["Cross", "cross", "eqslantless", "GreaterEqualLess", "GreaterLess", "gtreqless", "gtreqqless", "gtrless", "LessLess", "NestedLessLess", "nless", "NotGreaterLess", "NotLess", "NotLessLess", "NotNestedLessLess", "olcross"],
  m: ["diams"],
  w: ["downdownarrows", "leftleftarrows", "leftrightarrows", "rightleftarrows", "rightrightarrows", "upuparrows"],
  g: ["egs"],
  r: ["elinters", "integers"],
  l: ["els", "equals", "models", "naturals", "rationals", "reals"],
  t: ["Exists", "hearts", "nexists", "NotExists"],
  n: ["fltns", "isins", "leftrightharpoons", "quaternions", "rightleftharpoons", "strns"],
  f: ["larrbfs", "larrfs", "rarrbfs", "rarrfs"],
  d: ["NotSucceeds", "Succeeds"],
  a: ["otimesas"]
};
var x$2 = {
  o: ["approx", "boxbox", "gnapprox", "gtrapprox", "lessapprox", "lnapprox", "napprox", "precapprox", "precnapprox", "succapprox", "succnapprox", "thickapprox"],
  n: ["divonx"],
  r: ["rx"]
};
var q$2 = {
  e: ["approxeq", "asympeq", "backsimeq", "Bumpeq", "bumpeq", "circeq", "coloneq", "ddotseq", "doteq", "fallingdotseq", "geq", "gneq", "leq", "lneq", "ngeq", "nleq", "npreceq", "nsimeq", "nsubseteq", "nsucceq", "nsupseteq", "ntrianglelefteq", "ntrianglerighteq", "preccurlyeq", "preceq", "questeq", "risingdotseq", "simeq", "sqsubseteq", "sqsupseteq", "subseteq", "subsetneq", "succcurlyeq", "succeq", "supseteq", "supsetneq", "trianglelefteq", "triangleq", "trianglerighteq", "varsubsetneq", "varsupsetneq", "veeeq", "wedgeq"],
  q: ["geqq", "gneqq", "gvertneqq", "leqq", "lneqq", "lvertneqq", "ngeqq", "nleqq", "nsubseteqq", "nsupseteqq", "precneqq", "subseteqq", "subsetneqq", "succneqq", "supseteqq", "supsetneqq", "varsubsetneqq", "varsupsetneqq"]
};
var l$2 = {
  m: ["Auml", "auml", "Euml", "euml", "gsiml", "Iuml", "iuml", "Ouml", "ouml", "siml", "uml", "Uuml", "uuml", "Yuml", "yuml"],
  D: ["boxDl"],
  d: ["boxdl"],
  U: ["boxUl"],
  u: ["boxul", "lharul", "rharul"],
  V: ["boxVl"],
  v: ["boxvl"],
  o: ["bsol", "dsol", "gesdotol", "osol", "sol", "suphsol"],
  l: ["bull", "ell", "ForAll", "forall", "hybull", "ll"],
  i: ["Ccedil", "ccedil", "cedil", "Gcedil", "Kcedil", "kcedil", "lAtail", "latail", "Lcedil", "lcedil", "lceil", "leftarrowtail", "Ncedil", "ncedil", "permil", "rAtail", "ratail", "Rcedil", "rcedil", "rceil", "rightarrowtail", "Scedil", "scedil", "Tcedil", "tcedil"],
  a: ["ClockwiseContourIntegral", "ContourIntegral", "CounterClockwiseContourIntegral", "DotEqual", "DoubleContourIntegral", "Equal", "GreaterEqual", "GreaterFullEqual", "GreaterSlantEqual", "HumpEqual", "intcal", "Integral", "intercal", "LeftTriangleEqual", "LessFullEqual", "LessSlantEqual", "natural", "NotEqual", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterSlantEqual", "NotHumpEqual", "NotLeftTriangleEqual", "NotLessEqual", "NotLessSlantEqual", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotRightTriangleEqual", "NotSquareSubsetEqual", "NotSquareSupersetEqual", "NotSubsetEqual", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSupersetEqual", "NotTildeEqual", "NotTildeFullEqual", "PrecedesEqual", "PrecedesSlantEqual", "Proportional", "real", "RightTriangleEqual", "SquareSubsetEqual", "SquareSupersetEqual", "SubsetEqual", "SucceedsEqual", "SucceedsSlantEqual", "SupersetEqual", "TildeEqual", "TildeFullEqual"],
  r: ["cudarrl", "dharl", "uharl"],
  e: ["Del", "el", "gel", "gimel", "nparallel", "nshortparallel", "parallel", "prurel", "shortparallel"],
  s: ["eparsl", "eqvparsl", "frasl", "gesl", "nparsl", "parsl", "smeparsl"],
  c: ["excl", "iexcl"],
  E: ["gEl"],
  g: ["gl", "ntgl"],
  p: ["larrpl", "rarrpl"],
  t: ["larrtl", "Rarrtl", "rarrtl"],
  L: ["Ll", "nLl"],
  h: ["Vdashl"]
};
var k$2 = {
  r: ["bbrk", "bbrktbrk", "checkmark", "fork", "lbbrk", "lobrk", "pitchfork", "rbbrk", "robrk", "tbrk", "topfork"],
  n: ["blank", "pertenk"],
  c: ["block", "check", "lbrack", "planck", "rbrack"],
  o: ["Dstrok", "dstrok", "Hstrok", "hstrok", "Lstrok", "lstrok", "Tstrok", "tstrok"],
  e: ["Hacek"],
  h: ["intlarhk", "larrhk", "nearhk", "nwarhk", "rarrhk", "searhk", "swarhk"],
  l: ["lhblk", "uhblk"],
  a: ["NoBreak"]
};
var o$2 = {
  u: ["bdquo", "laquo", "ldquo", "lsaquo", "lsquo", "raquo", "rdquo", "rsaquo", "rsquo", "sbquo"],
  r: ["euro", "micro", "numero"],
  t: ["gesdoto", "lesdoto", "longmapsto", "mapsto", "propto", "varpropto"],
  h: ["mho", "Rho", "rho", "varrho"],
  d: ["plusdo"],
  w: ["plustwo"],
  i: ["ratio"]
};
var i$2 = {
  s: ["bepsi", "epsi", "Psi", "psi", "Upsi", "upsi"],
  m: ["bsemi", "semi"],
  h: ["Chi", "chi", "Phi", "phi", "straightphi", "varphi"],
  r: ["dtri", "lltri", "lrtri", "ltri", "nltri", "nrtri", "rtri", "rtriltri", "ultri", "urtri", "utri", "vltri", "vrtri", "xdtri", "xutri"],
  i: ["ii"],
  n: ["ni", "notni"],
  P: ["Pi"],
  p: ["pi", "varpi"],
  X: ["Xi"],
  x: ["xi"]
};
var u$2 = {
  o: ["bernou"],
  H: ["boxHu"],
  h: ["boxhu"],
  l: ["lbrkslu", "rbrkslu"],
  r: ["lharu", "rharu"],
  d: ["minusdu", "plusdu"],
  M: ["Mu"],
  m: ["mu"],
  N: ["Nu"],
  n: ["nu"],
  q: ["squ"],
  a: ["Tau", "tau"]
};
var w$2 = {
  o: ["bkarow", "dbkarow", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleUpArrow", "DoubleUpDownArrow", "DownArrow", "Downarrow", "downarrow", "DownArrowUpArrow", "DownTeeArrow", "drbkarow", "hksearow", "hkswarow", "hookleftarrow", "hookrightarrow", "LeftArrow", "Leftarrow", "leftarrow", "LeftArrowRightArrow", "LeftRightArrow", "Leftrightarrow", "leftrightarrow", "leftrightsquigarrow", "LeftTeeArrow", "Lleftarrow", "LongLeftArrow", "Longleftarrow", "longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "longleftrightarrow", "LongRightArrow", "Longrightarrow", "longrightarrow", "LowerLeftArrow", "LowerRightArrow", "nearrow", "nLeftarrow", "nleftarrow", "nLeftrightarrow", "nleftrightarrow", "nRightarrow", "nrightarrow", "nwarrow", "RightArrow", "Rightarrow", "rightarrow", "RightArrowLeftArrow", "rightsquigarrow", "RightTeeArrow", "Rrightarrow", "searrow", "ShortDownArrow", "ShortLeftArrow", "ShortRightArrow", "ShortUpArrow", "swarrow", "twoheadleftarrow", "twoheadrightarrow", "UpArrow", "Uparrow", "uparrow", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "updownarrow", "UpperLeftArrow", "UpperRightArrow", "UpTeeArrow"],
  r: ["harrw", "nrarrw", "rarrw"]
};
var L = {
  D: ["boxDL"],
  d: ["boxdL"],
  U: ["boxUL"],
  u: ["boxuL"],
  V: ["boxVL"],
  v: ["boxvL"]
};
var R = {
  D: ["boxDR"],
  d: ["boxdR", "circledR"],
  U: ["boxUR"],
  u: ["boxuR"],
  V: ["boxVR"],
  v: ["boxvR"]
};
var H = {
  x: ["boxH"],
  V: ["boxVH"],
  v: ["boxvH"],
  T: ["ETH"]
};
var D = {
  H: ["boxHD"],
  h: ["boxhD"],
  l: ["CapitalDifferentialD", "DifferentialD", "PartialD"],
  D: ["DD", "equivDD"]
};
var U = {
  H: ["boxHU"],
  h: ["boxhU"]
};
var V = {
  x: ["boxV"]
};
var S = {
  d: ["circledS"],
  o: ["oS"]
};
var Y = {
  P: ["COPY"]
};
var G = {
  N: ["ENG"],
  E: ["REG"]
};
var j$2 = {
  l: ["glj"],
  w: ["zwj"],
  n: ["zwnj"]
};
var T = {
  G: ["GT"],
  L: ["LT"],
  O: ["QUOT"]
};
var I = {
  y: ["ImaginaryI"]
};
var z$2 = {
  o: ["loz"]
};
var N = {
  R: ["THORN"]
};
var entEndsWithJson = {
  "1": {
    p: ["sup1"]
  },
  "2": {
    "1": ["blk12", "frac12"],
    p: ["sup2"]
  },
  "3": {
    "1": ["emsp13", "frac13"],
    "2": ["frac23"],
    p: ["sup3"]
  },
  "4": {
    "1": ["blk14", "emsp14", "frac14"],
    "3": ["blk34", "frac34"],
    e: ["there4"]
  },
  "5": {
    "1": ["frac15"],
    "2": ["frac25"],
    "3": ["frac35"],
    "4": ["frac45"]
  },
  "6": {
    "1": ["frac16"],
    "5": ["frac56"]
  },
  "8": {
    "1": ["frac18"],
    "3": ["frac38"],
    "5": ["frac58"],
    "7": ["frac78"]
  },
  e: e$2,
  c: c$2,
  d: d$2,
  E: E,
  y: y$2,
  g: g$2,
  f: f$2,
  r: r$2,
  m: m$2,
  h: h$2,
  a: a$2,
  P: P,
  p: p$2,
  v: v$2,
  b: b$2,
  t: t$2,
  n: n$2,
  s: s$2,
  x: x$2,
  q: q$2,
  l: l$2,
  k: k$2,
  o: o$2,
  i: i$2,
  u: u$2,
  w: w$2,
  L: L,
  R: R,
  H: H,
  D: D,
  U: U,
  V: V,
  S: S,
  Y: Y,
  G: G,
  j: j$2,
  T: T,
  I: I,
  z: z$2,
  N: N
};
var ac = {
  addAmpIfSemiPresent: "edge only",
  addSemiIfAmpPresent: false
};
var acute = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Alpha = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var alpha = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var amp = {
  addAmpIfSemiPresent: "edge only",
  addSemiIfAmpPresent: true
};
var And = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var and = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var ange = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var angle = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var angst = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var ap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ape = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var approx = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Aring = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var aring = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var Ascr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ascr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Assign = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ast = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var atilde = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var Backslash = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var barwedge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var becaus = {
  addAmpIfSemiPresent: true,
  addSemiIfAmpPresent: "edge only"
};
var Because = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var because = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bepsi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Bernoullis = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Beta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var beta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var beth = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var between = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var blank = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var block = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bottom = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bowtie = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var breve = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bull = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bullet = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var bump = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cacute = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Cap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var cap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var capand = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var caps = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var caret = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var caron = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cedil = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Cedilla = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var cent = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var check = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var checkmark = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Chi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var chi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cir = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var circ = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var clubs = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var clubsuit = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Colon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var colon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Colone = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var colone = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var comma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var commat = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var comp = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var complement = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var complexes = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cong = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Congruent = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var conint = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var copf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var coprod = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var COPY = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var copy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Cross = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var cross = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Cup = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cup = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var cups = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Dagger = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var dagger = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var daleth = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var darr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var dash = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var DD = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var dd = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var deg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Del = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Delta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var delta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var dharr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var diam = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Diamond = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var diamond = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var diams = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var die = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var digamma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var disin = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var div = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var divide = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var dollar = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var dopf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Dot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var dot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var dsol = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var dtri = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var easter = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ecir = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ecolon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ecy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var edot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ee = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var efr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var eg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var egrave = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var egs = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var el = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ell = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var els = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var empty = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ENG = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var eng = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var epsi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Epsilon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var epsilon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Equal = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var equals = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var equest = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Equilibrium = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var equiv = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var escr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var esim = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Eta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var eta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ETH = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var eth = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var euro = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var excl = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var exist = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Exists = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var expectation = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var female = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var flat = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var fork = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var frown = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Gamma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var gamma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var gap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var gcy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gel = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var geq = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ges = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gesl = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gl = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gla = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gne = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var grave = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var GT = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var gt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var half = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Hat = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var hearts = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var hopf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var hyphen = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ic = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var icy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var iff = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ii = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var image = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var imped = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var int = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var integers = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var iocy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var iogon = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var iota = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var isin = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var it = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Kappa = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var kappa = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var kopf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Lambda = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lambda = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lang = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lat = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var late = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lates = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var le = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var leg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var leq = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var les = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ll = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var lne = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var lozenge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lsh = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var LT = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var lt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ltimes = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var male = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var malt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var map = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var marker = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var mid = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var minus = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var models = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var mp = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var mu = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var nang = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var natural = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var naturals = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ncy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ne = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ngt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ni = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nis = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nle = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nles = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nless = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nlt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nopf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Not = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var not = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var nsc = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nsce = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var nu = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var num = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ogt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ohm = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var oline = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var olt = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Omega = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var omega = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Omicron = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var omicron = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var oopf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var opar = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var or = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var order = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var oror = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var orv = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var osol = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var par = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var para = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var parallel = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var part = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var phi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var phone = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Pi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var pi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var pitchfork = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var plus = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var pm = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var popf = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var pound = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var pr = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var prime = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var primes = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var prod = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Product = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var prop = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Proportion = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Proportional = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var psi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var quest = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var QUOT = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var quot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var race = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var rang = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var range = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var ratio = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Re = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var real = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var reals = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var rect = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var REG = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: true
};
var reg = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ring = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var rsh = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var sc = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var scap = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var sce = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var scy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var sdot = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var sect = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var semi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sharp = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var shy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Sigma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sigma = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sim = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sol = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var spades = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var square = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Star = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var star = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Sub = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sub = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sube = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Sum = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var sum = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Tab = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var target = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Tau = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var tau = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var therefore = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Theta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var theta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var THORN = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var thorn = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Tilde = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var tilde = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var times = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var tint = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var top = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var tosa = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var TRADE = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var trade = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var triangle = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var trie = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ucy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var uml = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Union = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var uplus = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Upsi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var upsi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var uring = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var vee = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Vert = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var vert = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var wedge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Wedge = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var wreath = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Xi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var xi = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Ycirc = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ycirc = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var ycy = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var yen = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var Zacute = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var zacute = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: "edge only"
};
var Zeta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var zeta = {
  addAmpIfSemiPresent: false,
  addSemiIfAmpPresent: false
};
var uncertainJson = {
  ac: ac,
  acute: acute,
  Alpha: Alpha,
  alpha: alpha,
  amp: amp,
  And: And,
  and: and,
  ange: ange,
  angle: angle,
  angst: angst,
  ap: ap,
  ape: ape,
  approx: approx,
  Aring: Aring,
  aring: aring,
  Ascr: Ascr,
  ascr: ascr,
  Assign: Assign,
  ast: ast,
  atilde: atilde,
  Backslash: Backslash,
  barwedge: barwedge,
  becaus: becaus,
  Because: Because,
  because: because,
  bepsi: bepsi,
  Bernoullis: Bernoullis,
  Beta: Beta,
  beta: beta,
  beth: beth,
  between: between,
  blank: blank,
  block: block,
  bot: bot,
  bottom: bottom,
  bowtie: bowtie,
  breve: breve,
  bull: bull,
  bullet: bullet,
  bump: bump,
  cacute: cacute,
  Cap: Cap,
  cap: cap,
  capand: capand,
  caps: caps,
  caret: caret,
  caron: caron,
  cedil: cedil,
  Cedilla: Cedilla,
  cent: cent,
  check: check,
  checkmark: checkmark,
  Chi: Chi,
  chi: chi,
  cir: cir,
  circ: circ,
  clubs: clubs,
  clubsuit: clubsuit,
  Colon: Colon,
  colon: colon,
  Colone: Colone,
  colone: colone,
  comma: comma,
  commat: commat,
  comp: comp,
  complement: complement,
  complexes: complexes,
  cong: cong,
  Congruent: Congruent,
  conint: conint,
  copf: copf,
  coprod: coprod,
  COPY: COPY,
  copy: copy,
  Cross: Cross,
  cross: cross,
  Cup: Cup,
  cup: cup,
  cups: cups,
  Dagger: Dagger,
  dagger: dagger,
  daleth: daleth,
  darr: darr,
  dash: dash,
  DD: DD,
  dd: dd,
  deg: deg,
  Del: Del,
  Delta: Delta,
  delta: delta,
  dharr: dharr,
  diam: diam,
  Diamond: Diamond,
  diamond: diamond,
  diams: diams,
  die: die,
  digamma: digamma,
  disin: disin,
  div: div,
  divide: divide,
  dollar: dollar,
  dopf: dopf,
  Dot: Dot,
  dot: dot,
  dsol: dsol,
  dtri: dtri,
  easter: easter,
  ecir: ecir,
  ecolon: ecolon,
  ecy: ecy,
  edot: edot,
  ee: ee,
  efr: efr,
  eg: eg,
  egrave: egrave,
  egs: egs,
  el: el,
  ell: ell,
  els: els,
  empty: empty,
  ENG: ENG,
  eng: eng,
  epsi: epsi,
  Epsilon: Epsilon,
  epsilon: epsilon,
  Equal: Equal,
  equals: equals,
  equest: equest,
  Equilibrium: Equilibrium,
  equiv: equiv,
  escr: escr,
  esim: esim,
  Eta: Eta,
  eta: eta,
  ETH: ETH,
  eth: eth,
  euro: euro,
  excl: excl,
  exist: exist,
  Exists: Exists,
  expectation: expectation,
  female: female,
  flat: flat,
  fork: fork,
  frown: frown,
  Gamma: Gamma,
  gamma: gamma,
  gap: gap,
  gcy: gcy,
  ge: ge,
  gel: gel,
  geq: geq,
  ges: ges,
  gesl: gesl,
  gg: gg,
  gl: gl,
  gla: gla,
  gne: gne,
  grave: grave,
  GT: GT,
  gt: gt,
  half: half,
  Hat: Hat,
  hearts: hearts,
  hopf: hopf,
  hyphen: hyphen,
  ic: ic,
  icy: icy,
  iff: iff,
  ii: ii,
  image: image,
  imped: imped,
  "in": {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  },
  int: int,
  integers: integers,
  iocy: iocy,
  iogon: iogon,
  iota: iota,
  isin: isin,
  it: it,
  Kappa: Kappa,
  kappa: kappa,
  kopf: kopf,
  Lambda: Lambda,
  lambda: lambda,
  lang: lang,
  lap: lap,
  lat: lat,
  late: late,
  lates: lates,
  le: le,
  leg: leg,
  leq: leq,
  les: les,
  lg: lg,
  ll: ll,
  lne: lne,
  lozenge: lozenge,
  lsh: lsh,
  LT: LT,
  lt: lt,
  ltimes: ltimes,
  male: male,
  malt: malt,
  map: map,
  marker: marker,
  mid: mid,
  minus: minus,
  models: models,
  mp: mp,
  mu: mu,
  nang: nang,
  nap: nap,
  natural: natural,
  naturals: naturals,
  ncy: ncy,
  ne: ne,
  nge: nge,
  ngt: ngt,
  ni: ni,
  nis: nis,
  nle: nle,
  nles: nles,
  nless: nless,
  nlt: nlt,
  nopf: nopf,
  Not: Not,
  not: not,
  nsc: nsc,
  nsce: nsce,
  nu: nu,
  num: num,
  ogt: ogt,
  ohm: ohm,
  oline: oline,
  olt: olt,
  Omega: Omega,
  omega: omega,
  Omicron: Omicron,
  omicron: omicron,
  oopf: oopf,
  opar: opar,
  or: or,
  order: order,
  oror: oror,
  orv: orv,
  osol: osol,
  par: par,
  para: para,
  parallel: parallel,
  part: part,
  phi: phi,
  phone: phone,
  Pi: Pi,
  pi: pi,
  pitchfork: pitchfork,
  plus: plus,
  pm: pm,
  popf: popf,
  pound: pound,
  pr: pr,
  prime: prime,
  primes: primes,
  prod: prod,
  Product: Product,
  prop: prop,
  Proportion: Proportion,
  Proportional: Proportional,
  psi: psi,
  quest: quest,
  QUOT: QUOT,
  quot: quot,
  race: race,
  rang: rang,
  range: range,
  ratio: ratio,
  Re: Re,
  real: real,
  reals: reals,
  rect: rect,
  REG: REG,
  reg: reg,
  ring: ring,
  rsh: rsh,
  sc: sc,
  scap: scap,
  sce: sce,
  scy: scy,
  sdot: sdot,
  sect: sect,
  semi: semi,
  sharp: sharp,
  shy: shy,
  Sigma: Sigma,
  sigma: sigma,
  sim: sim,
  sol: sol,
  spades: spades,
  square: square,
  Star: Star,
  star: star,
  Sub: Sub,
  sub: sub,
  sube: sube,
  Sum: Sum,
  sum: sum,
  Tab: Tab,
  target: target,
  Tau: Tau,
  tau: tau,
  therefore: therefore,
  Theta: Theta,
  theta: theta,
  THORN: THORN,
  thorn: thorn,
  Tilde: Tilde,
  tilde: tilde,
  times: times,
  tint: tint,
  top: top,
  tosa: tosa,
  TRADE: TRADE,
  trade: trade,
  triangle: triangle,
  trie: trie,
  ucy: ucy,
  uml: uml,
  Union: Union,
  uplus: uplus,
  Upsi: Upsi,
  upsi: upsi,
  uring: uring,
  vee: vee,
  Vert: Vert,
  vert: vert,
  wedge: wedge,
  Wedge: Wedge,
  wreath: wreath,
  Xi: Xi,
  xi: xi,
  Ycirc: Ycirc,
  ycirc: ycirc,
  ycy: ycy,
  yen: yen,
  Zacute: Zacute,
  zacute: zacute,
  Zeta: Zeta,
  zeta: zeta
};
var allNamedEntities = allNamedEntitiesJson;
var brokenNamedEntities = brokenNamedEntitiesJson;
var entStartsWith = entStartsWithJson;
var entEndsWith = entEndsWithJson;
var uncertain = uncertainJson;
var allNamedEntitiesSetOnly = new Set(["Aacute", "aacute", "Abreve", "abreve", "ac", "acd", "acE", "Acirc", "acirc", "acute", "Acy", "acy", "AElig", "aelig", "af", "Afr", "afr", "Agrave", "agrave", "alefsym", "aleph", "Alpha", "alpha", "Amacr", "amacr", "amalg", "AMP", "amp", "And", "and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr", "Aogon", "aogon", "Aopf", "aopf", "ap", "apacir", "apE", "ape", "apid", "apos", "ApplyFunction", "approx", "approxeq", "Aring", "aring", "Ascr", "ascr", "Assign", "ast", "asymp", "asympeq", "Atilde", "atilde", "Auml", "auml", "awconint", "awint", "backcong", "backepsilon", "backprime", "backsim", "backsimeq", "Backslash", "Barv", "barvee", "Barwed", "barwed", "barwedge", "bbrk", "bbrktbrk", "bcong", "Bcy", "bcy", "bdquo", "becaus", "Because", "because", "bemptyv", "bepsi", "bernou", "Bernoullis", "Beta", "beta", "beth", "between", "Bfr", "bfr", "bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge", "bkarow", "blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block", "bne", "bnequiv", "bNot", "bnot", "Bopf", "bopf", "bot", "bottom", "bowtie", "boxbox", "boxDL", "boxDl", "boxdL", "boxdl", "boxDR", "boxDr", "boxdR", "boxdr", "boxH", "boxh", "boxHD", "boxHd", "boxhD", "boxhd", "boxHU", "boxHu", "boxhU", "boxhu", "boxminus", "boxplus", "boxtimes", "boxUL", "boxUl", "boxuL", "boxul", "boxUR", "boxUr", "boxuR", "boxur", "boxV", "boxv", "boxVH", "boxVh", "boxvH", "boxvh", "boxVL", "boxVl", "boxvL", "boxvl", "boxVR", "boxVr", "boxvR", "boxvr", "bprime", "Breve", "breve", "brvbar", "Bscr", "bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub", "bull", "bullet", "bump", "bumpE", "bumpe", "Bumpeq", "bumpeq", "Cacute", "cacute", "Cap", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "CapitalDifferentialD", "caps", "caret", "caron", "Cayleys", "ccaps", "Ccaron", "ccaron", "Ccedil", "ccedil", "Ccirc", "ccirc", "Cconint", "ccups", "ccupssm", "Cdot", "cdot", "cedil", "Cedilla", "cemptyv", "cent", "CenterDot", "centerdot", "Cfr", "cfr", "CHcy", "chcy", "check", "checkmark", "Chi", "chi", "cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "CircleDot", "circledR", "circledS", "CircleMinus", "CirclePlus", "CircleTimes", "cirE", "cire", "cirfnint", "cirmid", "cirscir", "ClockwiseContourIntegral", "CloseCurlyDoubleQuote", "CloseCurlyQuote", "clubs", "clubsuit", "Colon", "colon", "Colone", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "Congruent", "Conint", "conint", "ContourIntegral", "Copf", "copf", "coprod", "Coproduct", "COPY", "copy", "copysr", "CounterClockwiseContourIntegral", "crarr", "Cross", "cross", "Cscr", "cscr", "csub", "csube", "csup", "csupe", "ctdot", "cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "Cup", "cup", "cupbrcap", "CupCap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed", "cwconint", "cwint", "cylcty", "Dagger", "dagger", "daleth", "Darr", "dArr", "darr", "dash", "Dashv", "dashv", "dbkarow", "dblac", "Dcaron", "dcaron", "Dcy", "dcy", "DD", "dd", "ddagger", "ddarr", "DDotrahd", "ddotseq", "deg", "Del", "Delta", "delta", "demptyv", "dfisht", "Dfr", "dfr", "dHar", "dharl", "dharr", "DiacriticalAcute", "DiacriticalDot", "DiacriticalDoubleAcute", "DiacriticalGrave", "DiacriticalTilde", "diam", "Diamond", "diamond", "diamondsuit", "diams", "die", "DifferentialD", "digamma", "disin", "div", "divide", "divideontimes", "divonx", "DJcy", "djcy", "dlcorn", "dlcrop", "dollar", "Dopf", "dopf", "Dot", "dot", "DotDot", "doteq", "doteqdot", "DotEqual", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "DoubleContourIntegral", "DoubleDot", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLeftTee", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleRightTee", "DoubleUpArrow", "DoubleUpDownArrow", "DoubleVerticalBar", "DownArrow", "Downarrow", "downarrow", "DownArrowBar", "DownArrowUpArrow", "DownBreve", "downdownarrows", "downharpoonleft", "downharpoonright", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownLeftVectorBar", "DownRightTeeVector", "DownRightVector", "DownRightVectorBar", "DownTee", "DownTeeArrow", "drbkarow", "drcorn", "drcrop", "Dscr", "dscr", "DScy", "dscy", "dsol", "Dstrok", "dstrok", "dtdot", "dtri", "dtrif", "duarr", "duhar", "dwangle", "DZcy", "dzcy", "dzigrarr", "Eacute", "eacute", "easter", "Ecaron", "ecaron", "ecir", "Ecirc", "ecirc", "ecolon", "Ecy", "ecy", "eDDot", "Edot", "eDot", "edot", "ee", "efDot", "Efr", "efr", "eg", "Egrave", "egrave", "egs", "egsdot", "el", "Element", "elinters", "ell", "els", "elsdot", "Emacr", "emacr", "empty", "emptyset", "EmptySmallSquare", "emptyv", "EmptyVerySmallSquare", "emsp", "emsp13", "emsp14", "ENG", "eng", "ensp", "Eogon", "eogon", "Eopf", "eopf", "epar", "eparsl", "eplus", "epsi", "Epsilon", "epsilon", "epsiv", "eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "Equal", "equals", "EqualTilde", "equest", "Equilibrium", "equiv", "equivDD", "eqvparsl", "erarr", "erDot", "Escr", "escr", "esdot", "Esim", "esim", "Eta", "eta", "ETH", "eth", "Euml", "euml", "euro", "excl", "exist", "Exists", "expectation", "ExponentialE", "exponentiale", "fallingdotseq", "Fcy", "fcy", "female", "ffilig", "fflig", "ffllig", "Ffr", "ffr", "filig", "FilledSmallSquare", "FilledVerySmallSquare", "fjlig", "flat", "fllig", "fltns", "fnof", "Fopf", "fopf", "ForAll", "forall", "fork", "forkv", "Fouriertrf", "fpartint", "frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown", "Fscr", "fscr", "gacute", "Gamma", "gamma", "Gammad", "gammad", "gap", "Gbreve", "gbreve", "Gcedil", "Gcirc", "gcirc", "Gcy", "gcy", "Gdot", "gdot", "gE", "ge", "gEl", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles", "Gfr", "gfr", "Gg", "gg", "ggg", "gimel", "GJcy", "gjcy", "gl", "gla", "glE", "glj", "gnap", "gnapprox", "gnE", "gne", "gneq", "gneqq", "gnsim", "Gopf", "gopf", "grave", "GreaterEqual", "GreaterEqualLess", "GreaterFullEqual", "GreaterGreater", "GreaterLess", "GreaterSlantEqual", "GreaterTilde", "Gscr", "gscr", "gsim", "gsime", "gsiml", "GT", "Gt", "gt", "gtcc", "gtcir", "gtdot", "gtlPar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim", "gvertneqq", "gvnE", "Hacek", "hairsp", "half", "hamilt", "HARDcy", "hardcy", "hArr", "harr", "harrcir", "harrw", "Hat", "hbar", "Hcirc", "hcirc", "hearts", "heartsuit", "hellip", "hercon", "Hfr", "hfr", "HilbertSpace", "hksearow", "hkswarow", "hoarr", "homtht", "hookleftarrow", "hookrightarrow", "Hopf", "hopf", "horbar", "HorizontalLine", "Hscr", "hscr", "hslash", "Hstrok", "hstrok", "HumpDownHump", "HumpEqual", "hybull", "hyphen", "Iacute", "iacute", "ic", "Icirc", "icirc", "Icy", "icy", "Idot", "IEcy", "iecy", "iexcl", "iff", "Ifr", "ifr", "Igrave", "igrave", "ii", "iiiint", "iiint", "iinfin", "iiota", "IJlig", "ijlig", "Im", "Imacr", "imacr", "image", "ImaginaryI", "imagline", "imagpart", "imath", "imof", "imped", "Implies", "in", "incare", "infin", "infintie", "inodot", "Int", "int", "intcal", "integers", "Integral", "intercal", "Intersection", "intlarhk", "intprod", "InvisibleComma", "InvisibleTimes", "IOcy", "iocy", "Iogon", "iogon", "Iopf", "iopf", "Iota", "iota", "iprod", "iquest", "Iscr", "iscr", "isin", "isindot", "isinE", "isins", "isinsv", "isinv", "it", "Itilde", "itilde", "Iukcy", "iukcy", "Iuml", "iuml", "Jcirc", "jcirc", "Jcy", "jcy", "Jfr", "jfr", "jmath", "Jopf", "jopf", "Jscr", "jscr", "Jsercy", "jsercy", "Jukcy", "jukcy", "Kappa", "kappa", "kappav", "Kcedil", "kcedil", "Kcy", "kcy", "Kfr", "kfr", "kgreen", "KHcy", "khcy", "KJcy", "kjcy", "Kopf", "kopf", "Kscr", "kscr", "lAarr", "Lacute", "lacute", "laemptyv", "lagran", "Lambda", "lambda", "Lang", "lang", "langd", "langle", "lap", "Laplacetrf", "laquo", "Larr", "lArr", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "lAtail", "latail", "late", "lates", "lBarr", "lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu", "Lcaron", "lcaron", "Lcedil", "lcedil", "lceil", "lcub", "Lcy", "lcy", "ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh", "lE", "le", "LeftAngleBracket", "LeftArrow", "Leftarrow", "leftarrow", "LeftArrowBar", "LeftArrowRightArrow", "leftarrowtail", "LeftCeiling", "LeftDoubleBracket", "LeftDownTeeVector", "LeftDownVector", "LeftDownVectorBar", "LeftFloor", "leftharpoondown", "leftharpoonup", "leftleftarrows", "LeftRightArrow", "Leftrightarrow", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "LeftRightVector", "LeftTee", "LeftTeeArrow", "LeftTeeVector", "leftthreetimes", "LeftTriangle", "LeftTriangleBar", "LeftTriangleEqual", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftUpVectorBar", "LeftVector", "LeftVectorBar", "lEg", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "LessEqualGreater", "LessFullEqual", "LessGreater", "lessgtr", "LessLess", "lesssim", "LessSlantEqual", "LessTilde", "lfisht", "lfloor", "Lfr", "lfr", "lg", "lgE", "lHar", "lhard", "lharu", "lharul", "lhblk", "LJcy", "ljcy", "Ll", "ll", "llarr", "llcorner", "Lleftarrow", "llhard", "lltri", "Lmidot", "lmidot", "lmoust", "lmoustache", "lnap", "lnapprox", "lnE", "lne", "lneq", "lneqq", "lnsim", "loang", "loarr", "lobrk", "LongLeftArrow", "Longleftarrow", "longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "longleftrightarrow", "longmapsto", "LongRightArrow", "Longrightarrow", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "Lopf", "lopf", "loplus", "lotimes", "lowast", "lowbar", "LowerLeftArrow", "LowerRightArrow", "loz", "lozenge", "lozf", "lpar", "lparlt", "lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri", "lsaquo", "Lscr", "lscr", "Lsh", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "Lstrok", "lstrok", "LT", "Lt", "lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrPar", "lurdshar", "luruhar", "lvertneqq", "lvnE", "macr", "male", "malt", "maltese", "Map", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker", "mcomma", "Mcy", "mcy", "mdash", "mDDot", "measuredangle", "MediumSpace", "Mellintrf", "Mfr", "mfr", "mho", "micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu", "MinusPlus", "mlcp", "mldr", "mnplus", "models", "Mopf", "mopf", "mp", "Mscr", "mscr", "mstpos", "Mu", "mu", "multimap", "mumap", "nabla", "Nacute", "nacute", "nang", "nap", "napE", "napid", "napos", "napprox", "natur", "natural", "naturals", "nbsp", "nbump", "nbumpe", "ncap", "Ncaron", "ncaron", "Ncedil", "ncedil", "ncong", "ncongdot", "ncup", "Ncy", "ncy", "ndash", "ne", "nearhk", "neArr", "nearr", "nearrow", "nedot", "NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "nequiv", "nesear", "nesim", "NestedGreaterGreater", "NestedLessLess", "NewLine", "nexist", "nexists", "Nfr", "nfr", "ngE", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "nGg", "ngsim", "nGt", "ngt", "ngtr", "nGtv", "nhArr", "nharr", "nhpar", "ni", "nis", "nisd", "niv", "NJcy", "njcy", "nlArr", "nlarr", "nldr", "nlE", "nle", "nLeftarrow", "nleftarrow", "nLeftrightarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nLl", "nlsim", "nLt", "nlt", "nltri", "nltrie", "nLtv", "nmid", "NoBreak", "NonBreakingSpace", "Nopf", "nopf", "Not", "not", "NotCongruent", "NotCupCap", "NotDoubleVerticalBar", "NotElement", "NotEqual", "NotEqualTilde", "NotExists", "NotGreater", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterGreater", "NotGreaterLess", "NotGreaterSlantEqual", "NotGreaterTilde", "NotHumpDownHump", "NotHumpEqual", "notin", "notindot", "notinE", "notinva", "notinvb", "notinvc", "NotLeftTriangle", "NotLeftTriangleBar", "NotLeftTriangleEqual", "NotLess", "NotLessEqual", "NotLessGreater", "NotLessLess", "NotLessSlantEqual", "NotLessTilde", "NotNestedGreaterGreater", "NotNestedLessLess", "notni", "notniva", "notnivb", "notnivc", "NotPrecedes", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotReverseElement", "NotRightTriangle", "NotRightTriangleBar", "NotRightTriangleEqual", "NotSquareSubset", "NotSquareSubsetEqual", "NotSquareSuperset", "NotSquareSupersetEqual", "NotSubset", "NotSubsetEqual", "NotSucceeds", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSucceedsTilde", "NotSuperset", "NotSupersetEqual", "NotTilde", "NotTildeEqual", "NotTildeFullEqual", "NotTildeTilde", "NotVerticalBar", "npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq", "nrArr", "nrarr", "nrarrc", "nrarrw", "nRightarrow", "nrightarrow", "nrtri", "nrtrie", "nsc", "nsccue", "nsce", "Nscr", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsubE", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupE", "nsupe", "nsupset", "nsupseteq", "nsupseteqq", "ntgl", "Ntilde", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq", "Nu", "nu", "num", "numero", "numsp", "nvap", "nVDash", "nVdash", "nvDash", "nvdash", "nvge", "nvgt", "nvHarr", "nvinfin", "nvlArr", "nvle", "nvlt", "nvltrie", "nvrArr", "nvrtrie", "nvsim", "nwarhk", "nwArr", "nwarr", "nwarrow", "nwnear", "Oacute", "oacute", "oast", "ocir", "Ocirc", "ocirc", "Ocy", "ocy", "odash", "Odblac", "odblac", "odiv", "odot", "odsold", "OElig", "oelig", "ofcir", "Ofr", "ofr", "ogon", "Ograve", "ograve", "ogt", "ohbar", "ohm", "oint", "olarr", "olcir", "olcross", "oline", "olt", "Omacr", "omacr", "Omega", "omega", "Omicron", "omicron", "omid", "ominus", "Oopf", "oopf", "opar", "OpenCurlyDoubleQuote", "OpenCurlyQuote", "operp", "oplus", "Or", "or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv", "oS", "Oscr", "oscr", "Oslash", "oslash", "osol", "Otilde", "otilde", "Otimes", "otimes", "otimesas", "Ouml", "ouml", "ovbar", "OverBar", "OverBrace", "OverBracket", "OverParenthesis", "par", "para", "parallel", "parsim", "parsl", "part", "PartialD", "Pcy", "pcy", "percnt", "period", "permil", "perp", "pertenk", "Pfr", "pfr", "Phi", "phi", "phiv", "phmmat", "phone", "Pi", "pi", "pitchfork", "piv", "planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "PlusMinus", "plusmn", "plussim", "plustwo", "pm", "Poincareplane", "pointint", "Popf", "popf", "pound", "Pr", "pr", "prap", "prcue", "prE", "pre", "prec", "precapprox", "preccurlyeq", "Precedes", "PrecedesEqual", "PrecedesSlantEqual", "PrecedesTilde", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "Prime", "prime", "primes", "prnap", "prnE", "prnsim", "prod", "Product", "profalar", "profline", "profsurf", "prop", "Proportion", "Proportional", "propto", "prsim", "prurel", "Pscr", "pscr", "Psi", "psi", "puncsp", "Qfr", "qfr", "qint", "Qopf", "qopf", "qprime", "Qscr", "qscr", "quaternions", "quatint", "quest", "questeq", "QUOT", "quot", "rAarr", "race", "Racute", "racute", "radic", "raemptyv", "Rang", "rang", "rangd", "range", "rangle", "raquo", "Rarr", "rArr", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "Rarrtl", "rarrtl", "rarrw", "rAtail", "ratail", "ratio", "rationals", "RBarr", "rBarr", "rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu", "Rcaron", "rcaron", "Rcedil", "rcedil", "rceil", "rcub", "Rcy", "rcy", "rdca", "rdldhar", "rdquo", "rdquor", "rdsh", "Re", "real", "realine", "realpart", "reals", "rect", "REG", "reg", "ReverseElement", "ReverseEquilibrium", "ReverseUpEquilibrium", "rfisht", "rfloor", "Rfr", "rfr", "rHar", "rhard", "rharu", "rharul", "Rho", "rho", "rhov", "RightAngleBracket", "RightArrow", "Rightarrow", "rightarrow", "RightArrowBar", "RightArrowLeftArrow", "rightarrowtail", "RightCeiling", "RightDoubleBracket", "RightDownTeeVector", "RightDownVector", "RightDownVectorBar", "RightFloor", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "RightTee", "RightTeeArrow", "RightTeeVector", "rightthreetimes", "RightTriangle", "RightTriangleBar", "RightTriangleEqual", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightUpVectorBar", "RightVector", "RightVectorBar", "ring", "risingdotseq", "rlarr", "rlhar", "rlm", "rmoust", "rmoustache", "rnmid", "roang", "roarr", "robrk", "ropar", "Ropf", "ropf", "roplus", "rotimes", "RoundImplies", "rpar", "rpargt", "rppolint", "rrarr", "Rrightarrow", "rsaquo", "Rscr", "rscr", "Rsh", "rsh", "rsqb", "rsquo", "rsquor", "rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri", "RuleDelayed", "ruluhar", "rx", "Sacute", "sacute", "sbquo", "Sc", "sc", "scap", "Scaron", "scaron", "sccue", "scE", "sce", "Scedil", "scedil", "Scirc", "scirc", "scnap", "scnE", "scnsim", "scpolint", "scsim", "Scy", "scy", "sdot", "sdotb", "sdote", "searhk", "seArr", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext", "Sfr", "sfr", "sfrown", "sharp", "SHCHcy", "shchcy", "SHcy", "shcy", "ShortDownArrow", "ShortLeftArrow", "shortmid", "shortparallel", "ShortRightArrow", "ShortUpArrow", "shy", "Sigma", "sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simgE", "siml", "simlE", "simne", "simplus", "simrarr", "slarr", "SmallCircle", "smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes", "SOFTcy", "softcy", "sol", "solb", "solbar", "Sopf", "sopf", "spades", "spadesuit", "spar", "sqcap", "sqcaps", "sqcup", "sqcups", "Sqrt", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "Square", "square", "SquareIntersection", "SquareSubset", "SquareSubsetEqual", "SquareSuperset", "SquareSupersetEqual", "SquareUnion", "squarf", "squf", "srarr", "Sscr", "sscr", "ssetmn", "ssmile", "sstarf", "Star", "star", "starf", "straightepsilon", "straightphi", "strns", "Sub", "sub", "subdot", "subE", "sube", "subedot", "submult", "subnE", "subne", "subplus", "subrarr", "Subset", "subset", "subseteq", "subseteqq", "SubsetEqual", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "Succeeds", "SucceedsEqual", "SucceedsSlantEqual", "SucceedsTilde", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "SuchThat", "Sum", "sum", "sung", "Sup", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supE", "supe", "supedot", "Superset", "SupersetEqual", "suphsol", "suphsub", "suplarr", "supmult", "supnE", "supne", "supplus", "Supset", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup", "swarhk", "swArr", "swarr", "swarrow", "swnwar", "szlig", "Tab", "target", "Tau", "tau", "tbrk", "Tcaron", "tcaron", "Tcedil", "tcedil", "Tcy", "tcy", "tdot", "telrec", "Tfr", "tfr", "there4", "Therefore", "therefore", "Theta", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "ThickSpace", "thinsp", "ThinSpace", "thkap", "thksim", "THORN", "thorn", "Tilde", "tilde", "TildeEqual", "TildeFullEqual", "TildeTilde", "times", "timesb", "timesbar", "timesd", "tint", "toea", "top", "topbot", "topcir", "Topf", "topf", "topfork", "tosa", "tprime", "TRADE", "trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "TripleDot", "triplus", "trisb", "tritime", "trpezium", "Tscr", "tscr", "TScy", "tscy", "TSHcy", "tshcy", "Tstrok", "tstrok", "twixt", "twoheadleftarrow", "twoheadrightarrow", "Uacute", "uacute", "Uarr", "uArr", "uarr", "Uarrocir", "Ubrcy", "ubrcy", "Ubreve", "ubreve", "Ucirc", "ucirc", "Ucy", "ucy", "udarr", "Udblac", "udblac", "udhar", "ufisht", "Ufr", "ufr", "Ugrave", "ugrave", "uHar", "uharl", "uharr", "uhblk", "ulcorn", "ulcorner", "ulcrop", "ultri", "Umacr", "umacr", "uml", "UnderBar", "UnderBrace", "UnderBracket", "UnderParenthesis", "Union", "UnionPlus", "Uogon", "uogon", "Uopf", "uopf", "UpArrow", "Uparrow", "uparrow", "UpArrowBar", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "updownarrow", "UpEquilibrium", "upharpoonleft", "upharpoonright", "uplus", "UpperLeftArrow", "UpperRightArrow", "Upsi", "upsi", "upsih", "Upsilon", "upsilon", "UpTee", "UpTeeArrow", "upuparrows", "urcorn", "urcorner", "urcrop", "Uring", "uring", "urtri", "Uscr", "uscr", "utdot", "Utilde", "utilde", "utri", "utrif", "uuarr", "Uuml", "uuml", "uwangle", "vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "vArr", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright", "Vbar", "vBar", "vBarv", "Vcy", "vcy", "VDash", "Vdash", "vDash", "vdash", "Vdashl", "Vee", "vee", "veebar", "veeeq", "vellip", "Verbar", "verbar", "Vert", "vert", "VerticalBar", "VerticalLine", "VerticalSeparator", "VerticalTilde", "VeryThinSpace", "Vfr", "vfr", "vltri", "vnsub", "vnsup", "Vopf", "vopf", "vprop", "vrtri", "Vscr", "vscr", "vsubnE", "vsubne", "vsupnE", "vsupne", "Vvdash", "vzigzag", "Wcirc", "wcirc", "wedbar", "Wedge", "wedge", "wedgeq", "weierp", "Wfr", "wfr", "Wopf", "wopf", "wp", "wr", "wreath", "Wscr", "wscr", "xcap", "xcirc", "xcup", "xdtri", "Xfr", "xfr", "xhArr", "xharr", "Xi", "xi", "xlArr", "xlarr", "xmap", "xnis", "xodot", "Xopf", "xopf", "xoplus", "xotime", "xrArr", "xrarr", "Xscr", "xscr", "xsqcup", "xuplus", "xutri", "xvee", "xwedge", "Yacute", "yacute", "YAcy", "yacy", "Ycirc", "ycirc", "Ycy", "ycy", "yen", "Yfr", "yfr", "YIcy", "yicy", "Yopf", "yopf", "Yscr", "yscr", "YUcy", "yucy", "Yuml", "yuml", "Zacute", "zacute", "Zcaron", "zcaron", "Zcy", "zcy", "Zdot", "zdot", "zeetrf", "ZeroWidthSpace", "Zeta", "zeta", "Zfr", "zfr", "ZHcy", "zhcy", "zigrarr", "Zopf", "zopf", "Zscr", "zscr", "zwj", "zwnj"]);
var allNamedEntitiesSetOnlyCaseInsensitive = new Set(["aacute", "abreve", "ac", "acd", "ace", "acirc", "acute", "acy", "aelig", "af", "afr", "agrave", "alefsym", "aleph", "alpha", "amacr", "amalg", "amp", "and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr", "aogon", "aopf", "ap", "apacir", "ape", "apid", "apos", "applyfunction", "approx", "approxeq", "aring", "ascr", "assign", "ast", "asymp", "asympeq", "atilde", "auml", "awconint", "awint", "backcong", "backepsilon", "backprime", "backsim", "backsimeq", "backslash", "barv", "barvee", "barwed", "barwedge", "bbrk", "bbrktbrk", "bcong", "bcy", "bdquo", "becaus", "because", "bemptyv", "bepsi", "bernou", "bernoullis", "beta", "beth", "between", "bfr", "bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge", "bkarow", "blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block", "bne", "bnequiv", "bnot", "bopf", "bot", "bottom", "bowtie", "boxbox", "boxdl", "boxdr", "boxh", "boxhd", "boxhu", "boxminus", "boxplus", "boxtimes", "boxul", "boxur", "boxv", "boxvh", "boxvl", "boxvr", "bprime", "breve", "brvbar", "bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub", "bull", "bullet", "bump", "bumpe", "bumpeq", "cacute", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "capitaldifferentiald", "caps", "caret", "caron", "cayleys", "ccaps", "ccaron", "ccedil", "ccirc", "cconint", "ccups", "ccupssm", "cdot", "cedil", "cedilla", "cemptyv", "cent", "centerdot", "cfr", "chcy", "check", "checkmark", "chi", "cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "circledot", "circledr", "circleds", "circleminus", "circleplus", "circletimes", "cire", "cirfnint", "cirmid", "cirscir", "clockwisecontourintegral", "closecurlydoublequote", "closecurlyquote", "clubs", "clubsuit", "colon", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "congruent", "conint", "contourintegral", "copf", "coprod", "coproduct", "copy", "copysr", "counterclockwisecontourintegral", "crarr", "cross", "cscr", "csub", "csube", "csup", "csupe", "ctdot", "cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "cup", "cupbrcap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed", "cwconint", "cwint", "cylcty", "dagger", "daleth", "darr", "dash", "dashv", "dbkarow", "dblac", "dcaron", "dcy", "dd", "ddagger", "ddarr", "ddotrahd", "ddotseq", "deg", "del", "delta", "demptyv", "dfisht", "dfr", "dhar", "dharl", "dharr", "diacriticalacute", "diacriticaldot", "diacriticaldoubleacute", "diacriticalgrave", "diacriticaltilde", "diam", "diamond", "diamondsuit", "diams", "die", "differentiald", "digamma", "disin", "div", "divide", "divideontimes", "divonx", "djcy", "dlcorn", "dlcrop", "dollar", "dopf", "dot", "dotdot", "doteq", "doteqdot", "dotequal", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "doublecontourintegral", "doubledot", "doubledownarrow", "doubleleftarrow", "doubleleftrightarrow", "doublelefttee", "doublelongleftarrow", "doublelongleftrightarrow", "doublelongrightarrow", "doublerightarrow", "doublerighttee", "doubleuparrow", "doubleupdownarrow", "doubleverticalbar", "downarrow", "downarrowbar", "downarrowuparrow", "downbreve", "downdownarrows", "downharpoonleft", "downharpoonright", "downleftrightvector", "downleftteevector", "downleftvector", "downleftvectorbar", "downrightteevector", "downrightvector", "downrightvectorbar", "downtee", "downteearrow", "drbkarow", "drcorn", "drcrop", "dscr", "dscy", "dsol", "dstrok", "dtdot", "dtri", "dtrif", "duarr", "duhar", "dwangle", "dzcy", "dzigrarr", "eacute", "easter", "ecaron", "ecir", "ecirc", "ecolon", "ecy", "eddot", "edot", "ee", "efdot", "efr", "eg", "egrave", "egs", "egsdot", "el", "element", "elinters", "ell", "els", "elsdot", "emacr", "empty", "emptyset", "emptysmallsquare", "emptyv", "emptyverysmallsquare", "emsp", "emsp13", "emsp14", "eng", "ensp", "eogon", "eopf", "epar", "eparsl", "eplus", "epsi", "epsilon", "epsiv", "eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "equal", "equals", "equaltilde", "equest", "equilibrium", "equiv", "equivdd", "eqvparsl", "erarr", "erdot", "escr", "esdot", "esim", "eta", "eth", "euml", "euro", "excl", "exist", "exists", "expectation", "exponentiale", "fallingdotseq", "fcy", "female", "ffilig", "fflig", "ffllig", "ffr", "filig", "filledsmallsquare", "filledverysmallsquare", "fjlig", "flat", "fllig", "fltns", "fnof", "fopf", "forall", "fork", "forkv", "fouriertrf", "fpartint", "frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown", "fscr", "gacute", "gamma", "gammad", "gap", "gbreve", "gcedil", "gcirc", "gcy", "gdot", "ge", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles", "gfr", "gg", "ggg", "gimel", "gjcy", "gl", "gla", "gle", "glj", "gnap", "gnapprox", "gne", "gneq", "gneqq", "gnsim", "gopf", "grave", "greaterequal", "greaterequalless", "greaterfullequal", "greatergreater", "greaterless", "greaterslantequal", "greatertilde", "gscr", "gsim", "gsime", "gsiml", "gt", "gtcc", "gtcir", "gtdot", "gtlpar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim", "gvertneqq", "gvne", "hacek", "hairsp", "half", "hamilt", "hardcy", "harr", "harrcir", "harrw", "hat", "hbar", "hcirc", "hearts", "heartsuit", "hellip", "hercon", "hfr", "hilbertspace", "hksearow", "hkswarow", "hoarr", "homtht", "hookleftarrow", "hookrightarrow", "hopf", "horbar", "horizontalline", "hscr", "hslash", "hstrok", "humpdownhump", "humpequal", "hybull", "hyphen", "iacute", "ic", "icirc", "icy", "idot", "iecy", "iexcl", "iff", "ifr", "igrave", "ii", "iiiint", "iiint", "iinfin", "iiota", "ijlig", "im", "imacr", "image", "imaginaryi", "imagline", "imagpart", "imath", "imof", "imped", "implies", "in", "incare", "infin", "infintie", "inodot", "int", "intcal", "integers", "integral", "intercal", "intersection", "intlarhk", "intprod", "invisiblecomma", "invisibletimes", "iocy", "iogon", "iopf", "iota", "iprod", "iquest", "iscr", "isin", "isindot", "isine", "isins", "isinsv", "isinv", "it", "itilde", "iukcy", "iuml", "jcirc", "jcy", "jfr", "jmath", "jopf", "jscr", "jsercy", "jukcy", "kappa", "kappav", "kcedil", "kcy", "kfr", "kgreen", "khcy", "kjcy", "kopf", "kscr", "laarr", "lacute", "laemptyv", "lagran", "lambda", "lang", "langd", "langle", "lap", "laplacetrf", "laquo", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "latail", "late", "lates", "lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu", "lcaron", "lcedil", "lceil", "lcub", "lcy", "ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh", "le", "leftanglebracket", "leftarrow", "leftarrowbar", "leftarrowrightarrow", "leftarrowtail", "leftceiling", "leftdoublebracket", "leftdownteevector", "leftdownvector", "leftdownvectorbar", "leftfloor", "leftharpoondown", "leftharpoonup", "leftleftarrows", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "leftrightvector", "lefttee", "leftteearrow", "leftteevector", "leftthreetimes", "lefttriangle", "lefttrianglebar", "lefttriangleequal", "leftupdownvector", "leftupteevector", "leftupvector", "leftupvectorbar", "leftvector", "leftvectorbar", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "lessequalgreater", "lessfullequal", "lessgreater", "lessgtr", "lessless", "lesssim", "lessslantequal", "lesstilde", "lfisht", "lfloor", "lfr", "lg", "lge", "lhar", "lhard", "lharu", "lharul", "lhblk", "ljcy", "ll", "llarr", "llcorner", "lleftarrow", "llhard", "lltri", "lmidot", "lmoust", "lmoustache", "lnap", "lnapprox", "lne", "lneq", "lneqq", "lnsim", "loang", "loarr", "lobrk", "longleftarrow", "longleftrightarrow", "longmapsto", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "lopf", "loplus", "lotimes", "lowast", "lowbar", "lowerleftarrow", "lowerrightarrow", "loz", "lozenge", "lozf", "lpar", "lparlt", "lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri", "lsaquo", "lscr", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "lstrok", "lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrpar", "lurdshar", "luruhar", "lvertneqq", "lvne", "macr", "male", "malt", "maltese", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker", "mcomma", "mcy", "mdash", "mddot", "measuredangle", "mediumspace", "mellintrf", "mfr", "mho", "micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu", "minusplus", "mlcp", "mldr", "mnplus", "models", "mopf", "mp", "mscr", "mstpos", "mu", "multimap", "mumap", "nabla", "nacute", "nang", "nap", "nape", "napid", "napos", "napprox", "natur", "natural", "naturals", "nbsp", "nbump", "nbumpe", "ncap", "ncaron", "ncedil", "ncong", "ncongdot", "ncup", "ncy", "ndash", "ne", "nearhk", "nearr", "nearrow", "nedot", "negativemediumspace", "negativethickspace", "negativethinspace", "negativeverythinspace", "nequiv", "nesear", "nesim", "nestedgreatergreater", "nestedlessless", "newline", "nexist", "nexists", "nfr", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "ngg", "ngsim", "ngt", "ngtr", "ngtv", "nharr", "nhpar", "ni", "nis", "nisd", "niv", "njcy", "nlarr", "nldr", "nle", "nleftarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nll", "nlsim", "nlt", "nltri", "nltrie", "nltv", "nmid", "nobreak", "nonbreakingspace", "nopf", "not", "notcongruent", "notcupcap", "notdoubleverticalbar", "notelement", "notequal", "notequaltilde", "notexists", "notgreater", "notgreaterequal", "notgreaterfullequal", "notgreatergreater", "notgreaterless", "notgreaterslantequal", "notgreatertilde", "nothumpdownhump", "nothumpequal", "notin", "notindot", "notine", "notinva", "notinvb", "notinvc", "notlefttriangle", "notlefttrianglebar", "notlefttriangleequal", "notless", "notlessequal", "notlessgreater", "notlessless", "notlessslantequal", "notlesstilde", "notnestedgreatergreater", "notnestedlessless", "notni", "notniva", "notnivb", "notnivc", "notprecedes", "notprecedesequal", "notprecedesslantequal", "notreverseelement", "notrighttriangle", "notrighttrianglebar", "notrighttriangleequal", "notsquaresubset", "notsquaresubsetequal", "notsquaresuperset", "notsquaresupersetequal", "notsubset", "notsubsetequal", "notsucceeds", "notsucceedsequal", "notsucceedsslantequal", "notsucceedstilde", "notsuperset", "notsupersetequal", "nottilde", "nottildeequal", "nottildefullequal", "nottildetilde", "notverticalbar", "npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq", "nrarr", "nrarrc", "nrarrw", "nrightarrow", "nrtri", "nrtrie", "nsc", "nsccue", "nsce", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupe", "nsupset", "nsupseteq", "nsupseteqq", "ntgl", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq", "nu", "num", "numero", "numsp", "nvap", "nvdash", "nvge", "nvgt", "nvharr", "nvinfin", "nvlarr", "nvle", "nvlt", "nvltrie", "nvrarr", "nvrtrie", "nvsim", "nwarhk", "nwarr", "nwarrow", "nwnear", "oacute", "oast", "ocir", "ocirc", "ocy", "odash", "odblac", "odiv", "odot", "odsold", "oelig", "ofcir", "ofr", "ogon", "ograve", "ogt", "ohbar", "ohm", "oint", "olarr", "olcir", "olcross", "oline", "olt", "omacr", "omega", "omicron", "omid", "ominus", "oopf", "opar", "opencurlydoublequote", "opencurlyquote", "operp", "oplus", "or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv", "os", "oscr", "oslash", "osol", "otilde", "otimes", "otimesas", "ouml", "ovbar", "overbar", "overbrace", "overbracket", "overparenthesis", "par", "para", "parallel", "parsim", "parsl", "part", "partiald", "pcy", "percnt", "period", "permil", "perp", "pertenk", "pfr", "phi", "phiv", "phmmat", "phone", "pi", "pitchfork", "piv", "planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "plusminus", "plusmn", "plussim", "plustwo", "pm", "poincareplane", "pointint", "popf", "pound", "pr", "prap", "prcue", "pre", "prec", "precapprox", "preccurlyeq", "precedes", "precedesequal", "precedesslantequal", "precedestilde", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "prime", "primes", "prnap", "prne", "prnsim", "prod", "product", "profalar", "profline", "profsurf", "prop", "proportion", "proportional", "propto", "prsim", "prurel", "pscr", "psi", "puncsp", "qfr", "qint", "qopf", "qprime", "qscr", "quaternions", "quatint", "quest", "questeq", "quot", "raarr", "race", "racute", "radic", "raemptyv", "rang", "rangd", "range", "rangle", "raquo", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "rarrtl", "rarrw", "ratail", "ratio", "rationals", "rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu", "rcaron", "rcedil", "rceil", "rcub", "rcy", "rdca", "rdldhar", "rdquo", "rdquor", "rdsh", "re", "real", "realine", "realpart", "reals", "rect", "reg", "reverseelement", "reverseequilibrium", "reverseupequilibrium", "rfisht", "rfloor", "rfr", "rhar", "rhard", "rharu", "rharul", "rho", "rhov", "rightanglebracket", "rightarrow", "rightarrowbar", "rightarrowleftarrow", "rightarrowtail", "rightceiling", "rightdoublebracket", "rightdownteevector", "rightdownvector", "rightdownvectorbar", "rightfloor", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "righttee", "rightteearrow", "rightteevector", "rightthreetimes", "righttriangle", "righttrianglebar", "righttriangleequal", "rightupdownvector", "rightupteevector", "rightupvector", "rightupvectorbar", "rightvector", "rightvectorbar", "ring", "risingdotseq", "rlarr", "rlhar", "rlm", "rmoust", "rmoustache", "rnmid", "roang", "roarr", "robrk", "ropar", "ropf", "roplus", "rotimes", "roundimplies", "rpar", "rpargt", "rppolint", "rrarr", "rrightarrow", "rsaquo", "rscr", "rsh", "rsqb", "rsquo", "rsquor", "rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri", "ruledelayed", "ruluhar", "rx", "sacute", "sbquo", "sc", "scap", "scaron", "sccue", "sce", "scedil", "scirc", "scnap", "scne", "scnsim", "scpolint", "scsim", "scy", "sdot", "sdotb", "sdote", "searhk", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext", "sfr", "sfrown", "sharp", "shchcy", "shcy", "shortdownarrow", "shortleftarrow", "shortmid", "shortparallel", "shortrightarrow", "shortuparrow", "shy", "sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simge", "siml", "simle", "simne", "simplus", "simrarr", "slarr", "smallcircle", "smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes", "softcy", "sol", "solb", "solbar", "sopf", "spades", "spadesuit", "spar", "sqcap", "sqcaps", "sqcup", "sqcups", "sqrt", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "square", "squareintersection", "squaresubset", "squaresubsetequal", "squaresuperset", "squaresupersetequal", "squareunion", "squarf", "squf", "srarr", "sscr", "ssetmn", "ssmile", "sstarf", "star", "starf", "straightepsilon", "straightphi", "strns", "sub", "subdot", "sube", "subedot", "submult", "subne", "subplus", "subrarr", "subset", "subseteq", "subseteqq", "subsetequal", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "succeeds", "succeedsequal", "succeedsslantequal", "succeedstilde", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "suchthat", "sum", "sung", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supe", "supedot", "superset", "supersetequal", "suphsol", "suphsub", "suplarr", "supmult", "supne", "supplus", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup", "swarhk", "swarr", "swarrow", "swnwar", "szlig", "tab", "target", "tau", "tbrk", "tcaron", "tcedil", "tcy", "tdot", "telrec", "tfr", "there4", "therefore", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "thickspace", "thinsp", "thinspace", "thkap", "thksim", "thorn", "tilde", "tildeequal", "tildefullequal", "tildetilde", "times", "timesb", "timesbar", "timesd", "tint", "toea", "top", "topbot", "topcir", "topf", "topfork", "tosa", "tprime", "trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "tripledot", "triplus", "trisb", "tritime", "trpezium", "tscr", "tscy", "tshcy", "tstrok", "twixt", "twoheadleftarrow", "twoheadrightarrow", "uacute", "uarr", "uarrocir", "ubrcy", "ubreve", "ucirc", "ucy", "udarr", "udblac", "udhar", "ufisht", "ufr", "ugrave", "uhar", "uharl", "uharr", "uhblk", "ulcorn", "ulcorner", "ulcrop", "ultri", "umacr", "uml", "underbar", "underbrace", "underbracket", "underparenthesis", "union", "unionplus", "uogon", "uopf", "uparrow", "uparrowbar", "uparrowdownarrow", "updownarrow", "upequilibrium", "upharpoonleft", "upharpoonright", "uplus", "upperleftarrow", "upperrightarrow", "upsi", "upsih", "upsilon", "uptee", "upteearrow", "upuparrows", "urcorn", "urcorner", "urcrop", "uring", "urtri", "uscr", "utdot", "utilde", "utri", "utrif", "uuarr", "uuml", "uwangle", "vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright", "vbar", "vbarv", "vcy", "vdash", "vdashl", "vee", "veebar", "veeeq", "vellip", "verbar", "vert", "verticalbar", "verticalline", "verticalseparator", "verticaltilde", "verythinspace", "vfr", "vltri", "vnsub", "vnsup", "vopf", "vprop", "vrtri", "vscr", "vsubne", "vsupne", "vvdash", "vzigzag", "wcirc", "wedbar", "wedge", "wedgeq", "weierp", "wfr", "wopf", "wp", "wr", "wreath", "wscr", "xcap", "xcirc", "xcup", "xdtri", "xfr", "xharr", "xi", "xlarr", "xmap", "xnis", "xodot", "xopf", "xoplus", "xotime", "xrarr", "xscr", "xsqcup", "xuplus", "xutri", "xvee", "xwedge", "yacute", "yacy", "ycirc", "ycy", "yen", "yfr", "yicy", "yopf", "yscr", "yucy", "yuml", "zacute", "zcaron", "zcy", "zdot", "zeetrf", "zerowidthspace", "zeta", "zfr", "zhcy", "zigrarr", "zopf", "zscr", "zwj", "zwnj"]);

function decode(ent) {
  if (typeof ent !== "string" || !ent.length || !ent.startsWith("&") || !ent.endsWith(";")) {
    throw new Error("all-named-html-entities/decode(): [THROW_ID_01] Input must be an HTML entity with leading ampersand and trailing semicolon, but \"" + ent + "\" was given");
  }

  var val = ent.slice(1, ent.length - 1);
  return allNamedEntities[val] ? allNamedEntities[val] : null;
}
var maxLength = 31;

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */

function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;

  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }

  return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */


function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}
/** Used for built-in method references. */


var funcProto = Function.prototype,
    objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString.call(Object);
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var objectToString = objectProto.toString;
/** Built-in value references. */

var getPrototype = overArg(Object.getPrototypeOf, Object);
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike(value) {
  return !!value && typeof value == 'object';
}
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */


function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

var lodash_isplainobject = isPlainObject;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
createCommonjsModule(function (module, exports) {
  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;
  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;
  /** `Object#toString` result references. */

  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to match `RegExp` flags from their coerced string values. */

  var reFlags = /\w*$/;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /** Used to identify `toStringTag` values supported by `_.clone`. */

  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /** Detect free variable `exports`. */

  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */

  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }
  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */


  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }
  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */


  function arrayEach(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }
  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */


  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }
  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */


  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
      accumulator = array[++index];
    }

    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }

    return accumulator;
  }
  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */


  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */


  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */


  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */


  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);
    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */


  function setToArray(set) {
    var index = -1,
        result = Array(set.size);
    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }
  /** Used for built-in method references. */


  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root['__core-js_shared__'];
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /** Used to resolve the decompiled source of functions. */


  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);
  /* Built-in method references that are verified to be native. */

  var DataView = getNative(root, 'DataView'),
      Map = getNative(root, 'Map'),
      Promise = getNative(root, 'Promise'),
      Set = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap'),
      nativeCreate = getNative(Object, 'create');
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */


  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */


  function listCacheClear() {
    this.__data__ = [];
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    return true;
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map || ListCache)(),
      'string': new Hash()
    };
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }
  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */


  function stackClear() {
    this.__data__ = new ListCache();
  }
  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function stackDelete(key) {
    return this.__data__['delete'](key);
  }
  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function stackGet(key) {
    return this.__data__.get(key);
  }
  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function stackHas(key) {
    return this.__data__.has(key);
  }
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */


  function stackSet(key, value) {
    var cache = this.__data__;

    if (cache instanceof ListCache) {
      var pairs = cache.__data__;

      if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }

      cache = this.__data__ = new MapCache(pairs);
    }

    cache.set(key, value);
    return this;
  } // Add methods to `Stack`.


  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length,
        skipIndexes = !!length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */


  function assignValue(object, key, value) {
    var objValue = object[key];

    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      object[key] = value;
    }
  }
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */


  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {boolean} [isFull] Specify a clone including symbols.
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */


  function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }

    if (result !== undefined) {
      return result;
    }

    if (!isObject(value)) {
      return value;
    }

    var isArr = isArray(value);

    if (isArr) {
      result = initCloneArray(value);

      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }

      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        if (isHostObject(value)) {
          return object ? value : {};
        }

        result = initCloneObject(isFunc ? {} : value);

        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }

        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    } // Check for circular references and return its corresponding clone.


    stack || (stack = new Stack());
    var stacked = stack.get(value);

    if (stacked) {
      return stacked;
    }

    stack.set(value, result);

    if (!isArr) {
      var props = isFull ? getAllKeys(value) : keys(value);
    }

    arrayEach(props || value, function (subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      } // Recursively populate clone (susceptible to call stack limits).


      assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
  }
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */


  function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
  }
  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  /**
   * The base implementation of `getTag`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */


  function baseGetTag(value) {
    return objectToString.call(value);
  }
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */


  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */


  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  }
  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */


  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }
  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */


  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  /**
   * Creates a clone of `map`.
   *
   * @private
   * @param {Object} map The map to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned map.
   */


  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
  }
  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */


  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  /**
   * Creates a clone of `set`.
   *
   * @private
   * @param {Object} set The set to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned set.
   */


  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
  }
  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */


  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */


  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */


  function copyArray(source, array) {
    var index = -1,
        length = source.length;
    array || (array = Array(length));

    while (++index < length) {
      array[index] = source[index];
    }

    return array;
  }
  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */


  function copyObject(source, props, object, customizer) {
    object || (object = {});
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
      assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }

    return object;
  }
  /**
   * Copies own symbol properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */


  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }
  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  /**
   * Creates an array of the own enumerable symbol properties of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */


  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11,
  // for data views in Edge < 14, and promises in Node.js.

  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }
  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */


  function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length); // Add properties assigned by `RegExp#exec`.

    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }

    return result;
  }
  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */


  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }
  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */


  function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;

    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case dataViewTag:
        return cloneDataView(object, isDeep);

      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);

      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        return cloneRegExp(object);

      case setTag:
        return cloneSet(object, isDeep, cloneFunc);

      case symbolTag:
        return cloneSymbol(object);
    }
  }
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */


  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */


  function isKeyable(value) {
    var type = typeof value;
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */


  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */


  function cloneDeep(value) {
    return baseClone(value, true, true);
  }
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */


  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */


  function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
  }
  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */


  var isArray = Array.isArray;
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */


  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */


  var isBuffer = nativeIsBuffer || stubFalse;
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */


  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }
  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */


  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }
  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */


  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */


  function stubArray() {
    return [];
  }
  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */


  function stubFalse() {
    return false;
  }

  module.exports = cloneDeep;
});

var RAWNBSP = "\xA0";

function x(something) {
  var res = {
    value: something,
    hungry: false,
    optional: false
  };

  if ((res.value.endsWith("?*") || res.value.endsWith("*?")) && res.value.length > 2) {
    res.value = res.value.slice(0, res.value.length - 2);
    res.optional = true;
    res.hungry = true;
  } else if (res.value.endsWith("?") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.optional = true;
  } else if (res.value.endsWith("*") && res.value.length > 1) {
    res.value = res.value.slice(0, ~-res.value.length);
    res.hungry = true;
  }

  return res;
}

function isStr$1(something) {
  return typeof something === "string";
}

function rightMain(_ref) {
  var str = _ref.str,
      _ref$idx = _ref.idx,
      idx = _ref$idx === void 0 ? 0 : _ref$idx,
      _ref$stopAtNewlines = _ref.stopAtNewlines,
      stopAtNewlines = _ref$stopAtNewlines === void 0 ? false : _ref$stopAtNewlines,
      _ref$stopAtRawNbsp = _ref.stopAtRawNbsp,
      stopAtRawNbsp = _ref$stopAtRawNbsp === void 0 ? false : _ref$stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (!str[idx + 1]) {
    return null;
  }

  if (str[idx + 1] && (str[idx + 1].trim() || stopAtNewlines && "\n\r".includes(str[idx + 1]) || stopAtRawNbsp && str[idx + 1] === RAWNBSP)) {
    return idx + 1;
  }

  if (str[idx + 2] && (str[idx + 2].trim() || stopAtNewlines && "\n\r".includes(str[idx + 2]) || stopAtRawNbsp && str[idx + 2] === RAWNBSP)) {
    return idx + 2;
  }

  for (var i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim() || stopAtNewlines && "\n\r".includes(str[i]) || stopAtRawNbsp && str[i] === RAWNBSP) {
      return i;
    }
  }

  return null;
}

function right(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

function leftMain(_ref2) {
  var str = _ref2.str,
      idx = _ref2.idx,
      stopAtNewlines = _ref2.stopAtNewlines,
      stopAtRawNbsp = _ref2.stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (idx < 1) {
    return null;
  }

  if (str[~-idx] && (str[~-idx].trim() || stopAtNewlines && "\n\r".includes(str[~-idx]) || stopAtRawNbsp && str[~-idx] === RAWNBSP)) {
    return ~-idx;
  }

  if (str[idx - 2] && (str[idx - 2].trim() || stopAtNewlines && "\n\r".includes(str[idx - 2]) || stopAtRawNbsp && str[idx - 2] === RAWNBSP)) {
    return idx - 2;
  }

  for (var i = idx; i--;) {
    if (str[i] && (str[i].trim() || stopAtNewlines && "\n\r".includes(str[i]) || stopAtRawNbsp && str[i] === RAWNBSP)) {
      return i;
    }
  }

  return null;
}

function left(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return leftMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

function seq(direction, str, idx, opts, args) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (typeof idx !== "number") {
    idx = 0;
  }

  if (direction === "right" && !str[idx + 1] || direction === "left" && !str[~-idx]) {
    return null;
  }

  var lastFinding = idx;
  var gaps = [];
  var leftmostChar;
  var rightmostChar;
  var satiated;
  var i = 0;

  while (i < args.length) {
    if (!isStr$1(args[i]) || !args[i].length) {
      i += 1;
      continue;
    }

    var _x = x(args[i]),
        value = _x.value,
        optional = _x.optional,
        hungry = _x.hungry;

    var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);

    if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
      var temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);

      if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
        satiated = true;
      } else {
        i += 1;
      }

      if (typeof whattsOnTheSide === "number" && direction === "right" && whattsOnTheSide > lastFinding + 1) {
        gaps.push([lastFinding + 1, whattsOnTheSide]);
      } else if (direction === "left" && typeof whattsOnTheSide === "number" && whattsOnTheSide < ~-lastFinding) {
        gaps.unshift([whattsOnTheSide + 1, lastFinding]);
      }

      lastFinding = whattsOnTheSide;

      if (direction === "right") {
        if (leftmostChar === undefined) {
          leftmostChar = whattsOnTheSide;
        }

        rightmostChar = whattsOnTheSide;
      } else {
        if (rightmostChar === undefined) {
          rightmostChar = whattsOnTheSide;
        }

        leftmostChar = whattsOnTheSide;
      }
    } else if (optional) {
      i += 1;
      continue;
    } else if (satiated) {
      i += 1;
      satiated = undefined;
      continue;
    } else {
      return null;
    }
  }

  if (leftmostChar === undefined || rightmostChar === undefined) {
    return null;
  }

  return {
    gaps: gaps,
    leftmostChar: leftmostChar,
    rightmostChar: rightmostChar
  };
}

var seqDefaults = {
  i: false
};

function leftSeq(str, idx) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  if (!args || !args.length) {
    throw new Error("string-left-right/leftSeq(): only two input arguments were passed! Did you intend to use left() method instead?");
  }

  var opts;

  if (lodash_isplainobject(args[0])) {
    opts = _objectSpread2(_objectSpread2({}, seqDefaults), args.shift());
  } else {
    opts = seqDefaults;
  }

  return seq("left", str, idx, opts, Array.from(args).reverse());
}

function rightSeq(str, idx) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (!args || !args.length) {
    throw new Error("string-left-right/rightSeq(): only two input arguments were passed! Did you intend to use right() method instead?");
  }

  var opts;

  if (lodash_isplainobject(args[0])) {
    opts = _objectSpread2(_objectSpread2({}, seqDefaults), args.shift());
  } else {
    opts = seqDefaults;
  }

  return seq("right", str, idx, opts, args);
}

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isLatinLetterOrNumberOrHash(char) {
  // we mean:
  // - Latin letters a-z or
  // - numbers 0-9 or
  // - letters A-Z or
  // - #
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) === 35);
}

function isNumeric(something) {
  return isStr(something) && something.charCodeAt(0) > 47 && something.charCodeAt(0) < 58;
}

function isStr(something) {
  return typeof something === "string";
}

function isLatinLetter(something) {
  return typeof something === "string" && (something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123 || something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91);
}

function resemblesNumericEntity(str2, from, to) {
  // plan: loop characters, count types, judge what's given
  var lettersCount = 0;
  var numbersCount = 0;
  var othersCount = 0;
  var hashesCount = 0;
  var whitespaceCount = 0;
  var numbersValue = "";
  var charTrimmed = "";

  for (var i = from; i < to; i++) {

    if (str2[i].trim().length) {
      charTrimmed += str2[i];
    } else {
      whitespaceCount += 1;
    }

    if (isLatinLetter(str2[i])) {
      lettersCount += 1;
    } else if (isNumeric(str2[i])) {
      numbersCount += 1;
      numbersValue += String(str2[i]);
    } else if (str2[i] === "#") {
      hashesCount += 1;
    } else {
      othersCount += 1;
    }
  } // if there are more numbers than letters (or equal) then it's more likely
  // to be a numeric entity


  var probablyNumeric = false; // if decimal-type, for example, &#999999;
  // but wide enough to include messed up cases

  if (!lettersCount && numbersCount > othersCount) {
    probablyNumeric = "deci";
  } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumeric(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
    // hexidecimal, for example, &#xA3;
    // but wide enough to include messed up cases
    probablyNumeric = "hexi";
  }

  return {
    probablyNumeric: probablyNumeric,
    lettersCount: lettersCount,
    numbersCount: numbersCount,
    numbersValue: numbersValue,
    hashesCount: hashesCount,
    othersCount: othersCount,
    charTrimmed: charTrimmed,
    whitespaceCount: whitespaceCount
  };
}

function findLongest(temp1) {
  // we are filtering something like this:
  // [
  //   {
  //       "tempEnt": "acute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 2,
  //           "rightmostChar": 6
  //       }
  //   },
  //   {
  //       "tempEnt": "zacute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 0,
  //           "rightmostChar": 6
  //       }
  //   }
  // ]
  //
  // we find the object which represents the longest matched entity, that is,
  // object which "tempEnt" key value's length is the longest.
  if (Array.isArray(temp1) && temp1.length) {
    if (temp1.length === 1) {
      // quick ending - only one value anyway
      return temp1[0];
    } // filter-out and return the longest-one


    return temp1.reduce(function (accum, tempObj) {
      if (tempObj.tempEnt.length > accum.tempEnt.length) {
        return tempObj;
      }

      return accum;
    });
  }

  return temp1;
}

function removeGappedFromMixedCases(str, temp1) {
  /* istanbul ignore if */
  if (arguments.length !== 2) {
    throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
  } // If there is one without gaps and all others with gaps, gapless
  // wins, regardless of length.
  // The longest of gapless-one wins, trumping all the ones with gaps.
  // If all are with gaps, the longest one wins.
  // [
  //   {
  //       "tempEnt": "acute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 2,
  //           "rightmostChar": 6
  //       }
  //   },
  //   {
  //       "tempEnt": "zacute",
  //       "tempRes": {
  //           "gaps": [
  //               [
  //                   1,
  //                   2
  //               ]
  //           ],
  //           "leftmostChar": 0,
  //           "rightmostChar": 6
  //       }
  //   }
  // ]
  // For example, entity "zacute" record above shows it has gaps, while the
  // "acute" does not have gaps. This is a mixed case scenario and we remove
  // all gapped entities, that is, in this case, "zacute".
  // Imagine we have string "zzzzzz acute; yyyyyy". That z on the left of
  // "acute" is legit. That's why we exclude matched gapped entities in
  // mixed cases.
  // But, semicolon also matters, for example, &acd; vs. &ac; in:
  // &ac d;
  // case picks &acd; as winner


  var copy;

  if (Array.isArray(temp1) && temp1.length) {
    // prevent mutation:
    copy = Array.from(temp1); // 1. if some matches have semicolon to the right of rightmostChar and
    // some matches don't, exclude those that don't.
    // If at any moment we've left with one match, Bob's your uncle here's
    // the final result.
    // For example, we might be working on something like this:
    // [
    //     {
    //         "tempEnt": "ac",
    //         "tempRes": {
    //             "gaps": [],
    //             "leftmostChar": 1,
    //             "rightmostChar": 2
    //         }
    //     },
    //     {
    //         "tempEnt": "acd",
    //         "tempRes": {
    //             "gaps": [
    //                 [
    //                     3,
    //                     4
    //                 ]
    //             ],
    //             "leftmostChar": 1,
    //             "rightmostChar": 4
    //         }
    //     }
    // ]

    /* istanbul ignore if */

    if (copy.length > 1 && copy.some(function (entityObj) {
      return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
    }) && copy.some(function (entityObj) {
      return str[right(str, entityObj.tempRes.rightmostChar)] !== ";";
    })) {
      // filter out those with semicolon to the right of the last character:
      copy = copy.filter(function (entityObj) {
        return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
      });
    } // 2. if still there is more than one match, first exclude gapped if
    // there is mix of gapped vs. gapless. Then, return longest.
    // If all are either gapped or gapless, return longest.


    if (!(copy.every(function (entObj) {
      return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
    }) || copy.every(function (entObj) {
      return entObj && entObj.tempRes && entObj.tempRes.gaps && Array.isArray(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
    }))) {
      // filter out entities with gaps, leave gapless-ones
      return findLongest(copy.filter(function (entObj) {
        return !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
      }));
    }
  } // else if all entries don't have gaps, return longest


  return findLongest(temp1);
}

var version$1 = "5.0.8";

var version = version$1;

function fixEnt(str, originalOpts) { //
  //
  //
  //
  //
  //                              THE PROGRAM
  //
  //
  //
  //
  //
  // insurance:
  // ---------------------------------------------------------------------------

  if (typeof str !== "string") {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n" + JSON.stringify(str, null, 4) + " (" + typeof str + "-type)");
  }

  var defaults = {
    decode: false,
    cb: function cb(_ref) {
      var rangeFrom = _ref.rangeFrom,
          rangeTo = _ref.rangeTo,
          rangeValEncoded = _ref.rangeValEncoded,
          rangeValDecoded = _ref.rangeValDecoded;
      return rangeValDecoded || rangeValEncoded ? [rangeFrom, rangeTo, isObj(originalOpts) && originalOpts.decode ? rangeValDecoded : rangeValEncoded] : [rangeFrom, rangeTo];
    },
    textAmpersandCatcherCb: null,
    progressFn: null,
    entityCatcherCb: null
  };

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n" + JSON.stringify(originalOpts, null, 4) + " (" + typeof originalOpts + "-type)");
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (opts.cb && typeof opts.cb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: " + typeof opts.cb + ", equal to: " + JSON.stringify(opts.cb, null, 4));
  }

  if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.entityCatcherCb must be a function (or falsey)! Currently it's: " + typeof opts.entityCatcherCb + ", equal to: " + JSON.stringify(opts.entityCatcherCb, null, 4));
  }

  if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_05] opts.progressFn must be a function (or falsey)! Currently it's: " + typeof opts.progressFn + ", equal to: " + JSON.stringify(opts.progressFn, null, 4));
  }

  if (opts.textAmpersandCatcherCb && typeof opts.textAmpersandCatcherCb !== "function") {
    throw new TypeError("string-fix-broken-named-entities: [THROW_ID_06] opts.textAmpersandCatcherCb must be a function (or falsey)! Currently it's: " + typeof opts.textAmpersandCatcherCb + ", equal to: " + JSON.stringify(opts.textAmpersandCatcherCb, null, 4));
  } // state flags
  // ---------------------------------------------------------------------------
  // this is what we'll return, process by default callback or user's custom-one

  var rangesArr2 = [];
  var percentageDone;
  var lastPercentageDone; // allocate all 100 of progress to the main loop below

  var len = str.length + 1;
  var counter = 0; // doNothingUntil can be either falsey or truthy: index number or boolean true
  // If it's number, it's instruction to avoid actions until that index is
  // reached when traversing. If it's boolean, it means we don't know when we'll
  // stop, we just turn on the flag (permanently, for now).

  var doNothingUntil = null; // catch letter sequences, possibly separated with whitespace. Non-letter
  // breaks the sequence. Main aim is to catch names of encoded HTML entities
  // for example, nbsp from "&nbsp;"

  var letterSeqStartAt = null;
  var brokenNumericEntityStartAt = null;
  var ampPositions = [];

  function pingAmps(untilIdx, loopIndexI) {
    if (typeof opts.textAmpersandCatcherCb === "function" && ampPositions.length) {

      while (ampPositions.length) {
        var currentAmp = ampPositions.shift();

        if ( // batch dumping, cases like end of string reached:
        untilIdx === undefined || // submit all ampersands caught up to this entity:
        currentAmp < untilIdx || // also, we might on a new ampersand, for example:
        // <span>&&nbsp&</span>
        //             ^
        //      we're here
        currentAmp === loopIndexI) { // ping each ampersand's index, starting from zero index:

          opts.textAmpersandCatcherCb(currentAmp);
        } // else, it gets discarded without action

      }
    }
  } //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //              T   H   E       L   O   O   P       S  T  A  R  T  S
  //                                      |
  //                                      |
  //                                 \    |     /
  //                                  \   |    /
  //                                   \  |   /
  //                                    \ |  /
  //                                     \| /
  //                                      V
  // differently from regex-based approach, we aim to traverse the string only once:


  var _loop = function _loop(i) {
    if (opts.progressFn) {
      percentageDone = Math.floor(counter / len * 100);
      /* istanbul ignore else */

      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    } //            |
    //            |
    //            |
    //            |
    //            |
    // PART 1. FRONTAL LOGGING
    //            |
    //            |
    //            |
    //            |
    //            | //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE TOP
    //            |
    //            |
    //            |
    //            |
    //            |

    if (doNothingUntil) {
      if (typeof doNothingUntil === "number" && i >= doNothingUntil) {
        doNothingUntil = null;
      } else {
        counter += 1;
        return "continue";
      }
    } //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE MIDDLE
    //            |
    //            |
    //            |
    //            |
    //            |
    // escape latch for text chunks


    if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
      letterSeqStartAt = null;
    } // Catch the end of a latin letter sequence.


    if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {

      if (i > letterSeqStartAt + 1) {
        var potentialEntity = str.slice(letterSeqStartAt, i);
        var whatsOnTheLeft = left(str, letterSeqStartAt);
        var whatsEvenMoreToTheLeft = whatsOnTheLeft ? left(str, whatsOnTheLeft) : null; //
        //
        //
        //
        // CASE 1 - CHECK FOR MISSING SEMICOLON
        //
        //
        //
        //

        if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) { // check, what's the index of the character to the right of
          // str[whatsOnTheLeft], is it any of the known named HTML entities.

          var firstChar = letterSeqStartAt;
          /* istanbul ignore next */

          var secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null; // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed. // mind you, there can be overlapping variations of entities, for
          // example, &ang; and &angst;. Now, if you match "ang" from "&ang;",
          // starting from the left side (like we do using "entStartsWith"),
          // when there is "&angst;", answer will also be positive. And we can't
          // rely on semicolon being on the right because we are actually
          // catching MISSING semicolons here.
          // The only way around this is to match all entities that start here
          // and pick the one with the biggest character length.
          // TODO - set up case insensitive matching here:

          /* istanbul ignore else */

          if (Object.prototype.hasOwnProperty.call(entStartsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(entStartsWith[str[firstChar]], str[secondChar])) {
            var tempEnt = "";
            var tempRes;
            var temp1 = entStartsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              tempRes = rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(oneOfKnownEntities.split("")));

              if (tempRes) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: tempRes
                }]);
              }

              return gatheredSoFar;
            }, []);
            temp1 = removeGappedFromMixedCases(str, temp1);
            /* istanbul ignore else */

            if (temp1) {
              var _temp = temp1;
              tempEnt = _temp.tempEnt;
              tempRes = _temp.tempRes;
            }

            if (tempEnt && (!Object.keys(uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (uncertain[tempEnt].addSemiIfAmpPresent === true || uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
              var decodedEntity = decode("&" + tempEnt + ";");
              rangesArr2.push({
                ruleName: "bad-html-entity-malformed-" + tempEnt,
                entityName: tempEnt,
                rangeFrom: whatsOnTheLeft || 0,
                rangeTo: tempRes.rightmostChar + 1,
                rangeValEncoded: "&" + tempEnt + ";",
                rangeValDecoded: decodedEntity
              }); // release all ampersands
              pingAmps(whatsOnTheLeft || 0, i);
            }
          }
        } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
          //
          //
          //
          //
          // CASE 2 - CHECK FOR MISSING AMPERSAND
          //
          //
          //
          // // check, what's on the left of str[i], is it any of known named HTML
          // entities. There are two thousand of them so we'll match by last
          // two characters. For posterity, we assume there can be any amount of
          // whitespace between characters and we need to tackle it as well.

          var lastChar = left(str, i);
          var secondToLast = left(str, lastChar); // we'll tap the "entEndsWith" from npm package "all-named-html-entities"
          // which gives a plain object of named entities, all grouped by first
          // and second character first. This reduces amount of matching needed.

          if (secondToLast !== null && Object.prototype.hasOwnProperty.call(entEndsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(entEndsWith[str[lastChar]], str[secondToLast])) {
            var _tempEnt = "";

            var _tempRes;

            var _temp2 = entEndsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
              // find all entities that match on the right of here
              // rightSeq could theoretically give positive answer, zero index,
              // but it's impossible here, so we're fine to match "if true".
              _tempRes = leftSeq.apply(void 0, [str, i].concat(oneOfKnownEntities.split("")));

              if (_tempRes && !(oneOfKnownEntities === "block" && str[left(str, letterSeqStartAt)] === ":")) {
                return gatheredSoFar.concat([{
                  tempEnt: oneOfKnownEntities,
                  tempRes: _tempRes
                }]);
              }

              return gatheredSoFar;
            }, []);
            _temp2 = removeGappedFromMixedCases(str, _temp2);
            /* istanbul ignore else */

            if (_temp2) {
              var _temp3 = _temp2;
              _tempEnt = _temp3.tempEnt;
              _tempRes = _temp3.tempRes;
            }

            if (_tempEnt && (!Object.keys(uncertain).includes(_tempEnt) || uncertain[_tempEnt].addAmpIfSemiPresent === true || uncertain[_tempEnt].addAmpIfSemiPresent && (!_tempRes.leftmostChar || isStr(str[_tempRes.leftmostChar - 1]) && !str[_tempRes.leftmostChar - 1].trim().length))) {

              var _decodedEntity = decode("&" + _tempEnt + ";");
              rangesArr2.push({
                ruleName: "bad-html-entity-malformed-" + _tempEnt,
                entityName: _tempEnt,
                rangeFrom: _tempRes.leftmostChar,
                rangeTo: i + 1,
                rangeValEncoded: "&" + _tempEnt + ";",
                rangeValDecoded: _decodedEntity
              });
              pingAmps(_tempRes.leftmostChar, i);
            }
          } else if (brokenNumericEntityStartAt !== null) {
            // we have a malformed numeric entity reference, like #x26; without
            // an ampersand but with the rest of characters
            // 1. push the issue:
            rangesArr2.push({
              ruleName: "bad-html-entity-malformed-numeric",
              entityName: null,
              rangeFrom: brokenNumericEntityStartAt,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
            pingAmps(brokenNumericEntityStartAt, i); // 2. reset marker:

            brokenNumericEntityStartAt = null;
          }
        } else if (str[i] === ";" && (str[whatsOnTheLeft] === "&" || str[whatsOnTheLeft] === ";" && str[whatsEvenMoreToTheLeft] === "&")) {

          if (!str[letterSeqStartAt - 1].trim() && str[whatsOnTheLeft] === "&") ; // find out more: is it legit, unrecognised or numeric...

          /* istanbul ignore else */


          if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) { // Maybe it's a numeric entity?
            // we can simply check, does entity start with a hash but that
            // would be naive because this is a tool to catch and fix errors
            // and hash might be missing or mis-typed
            // So, we have confirmed ampersand, something in between and then
            // confirmed semicolon.
            // First, we extracted the contents of all this, "situation.charTrimmed".
            // By the way, Character-trimmed string where String.trim() is
            // applied to each character. This is needed so that our tool could
            // recognise whitespace gaps anywhere in the input. Imagine, for
            // example, "&# 85;" with rogue space. Errors like that require
            // constant trimming on the algorithm side.
            // We are going to describe numeric entity as
            // * something that starts with ampersand
            // * ends with semicolon
            // - has no letter characters AND at least one number character OR
            // - has more numeric characters than letters

            var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);

            if (situation.probablyNumeric) { // 1. TACKLE HEALTHY DECIMAL NUMERIC CHARACTER REFERENCE ENTITIES:

              if (
              /* istanbul ignore next */
              situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && ( // decimal:
              !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount || // hexidecimal:
              (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                // if it's a healthy decimal numeric character reference:
                var decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));

                if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-numeric",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } else if (opts.decode) {
                  // unless decoding was requested, no further action is needed:
                  rangesArr2.push({
                    ruleName: "bad-html-entity-encoded-numeric",
                    entityName: situation.charTrimmed,
                    rangeFrom: whatsOnTheLeft || 0,
                    rangeTo: i + 1,
                    rangeValEncoded: "&" + situation.charTrimmed + ";",
                    rangeValDecoded: decodedEntitysValue
                  });
                }
                pingAmps(whatsOnTheLeft || 0, i);
              } else {
                // RAISE A GENERIC ERROR
                rangesArr2.push({
                  ruleName: "bad-html-entity-malformed-numeric",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft || 0,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
                pingAmps(whatsOnTheLeft || 0, i);
              } // also call the general entity callback if it's given


              if (opts.entityCatcherCb) {
                opts.entityCatcherCb(whatsOnTheLeft, i + 1);
              }
            } else { //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES BELOW
              //
              //
              //
              //
              // happy path:

              var potentialEntityOnlyNonWhitespaceChars = Array.from(potentialEntity).filter(function (char) {
                return char.trim().length;
              }).join("");

              if (potentialEntityOnlyNonWhitespaceChars.length <= maxLength && allNamedEntitiesSetOnlyCaseInsensitive.has(potentialEntityOnlyNonWhitespaceChars.toLowerCase())) {

                if ( // first, check is the letter case allright
                !allNamedEntitiesSetOnly.has(potentialEntityOnlyNonWhitespaceChars)) {
                  var matchingEntitiesOfCorrectCaseArr = [].concat(allNamedEntitiesSetOnly).filter(function (ent) {
                    return ent.toLowerCase() === potentialEntityOnlyNonWhitespaceChars.toLowerCase();
                  });

                  if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                    rangesArr2.push({
                      ruleName: "bad-html-entity-malformed-" + matchingEntitiesOfCorrectCaseArr[0],
                      entityName: matchingEntitiesOfCorrectCaseArr[0],
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&" + matchingEntitiesOfCorrectCaseArr[0] + ";",
                      rangeValDecoded: decode("&" + matchingEntitiesOfCorrectCaseArr[0] + ";")
                    });
                    pingAmps(whatsOnTheLeft, i);
                  } else {
                    rangesArr2.push({
                      ruleName: "bad-html-entity-unrecognised",
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null
                    });
                    pingAmps(whatsOnTheLeft, i);
                  }
                } else if ( // is it really healthy? measuring distance is a way to find out
                // any present whitespace characters will bloat the length...
                i - whatsOnTheLeft - 1 !== potentialEntityOnlyNonWhitespaceChars.length || str[whatsOnTheLeft] !== "&") {
                  var rangeFrom = str[whatsOnTheLeft] === "&" ? whatsOnTheLeft : whatsEvenMoreToTheLeft;

                  if ( // if it's a dubious entity
                  Object.keys(uncertain).includes(potentialEntityOnlyNonWhitespaceChars) && // and there's space after ampersand
                  !str[rangeFrom + 1].trim().length) {
                    letterSeqStartAt = null;
                    return "continue";
                  }
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-" + potentialEntityOnlyNonWhitespaceChars,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: rangeFrom,
                    rangeTo: i + 1,
                    rangeValEncoded: "&" + potentialEntityOnlyNonWhitespaceChars + ";",
                    rangeValDecoded: decode("&" + potentialEntityOnlyNonWhitespaceChars + ";")
                  });
                  pingAmps(rangeFrom, i);
                } else if (opts.decode) { // last thing, if decode is required, we've got an error still...
                  rangesArr2.push({
                    ruleName: "bad-html-entity-encoded-" + potentialEntityOnlyNonWhitespaceChars,
                    entityName: potentialEntityOnlyNonWhitespaceChars,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&" + potentialEntityOnlyNonWhitespaceChars + ";",
                    rangeValDecoded: decode("&" + potentialEntityOnlyNonWhitespaceChars + ";")
                  });
                  pingAmps(whatsOnTheLeft, i);
                } else if (opts.entityCatcherCb || opts.textAmpersandCatcherCb) {
                  // it's healthy - so at least ping the entity catcher
                  if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }

                  if (opts.textAmpersandCatcherCb) {
                    pingAmps(whatsOnTheLeft, i);
                  }
                }
                letterSeqStartAt = null;
                return "continue";
              } // First, match against case-insensitive list
              /* istanbul ignore next */

              letterSeqStartAt ? right(str, letterSeqStartAt) : null;
              var _tempEnt2 = "";
              var temp;

              if (Object.prototype.hasOwnProperty.call(brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                //
                //                          case I.
                //
                _tempEnt2 = situation.charTrimmed;

                var _decodedEntity2 = decode("&" + brokenNamedEntities[situation.charTrimmed.toLowerCase()] + ";");
                rangesArr2.push({
                  ruleName: "bad-html-entity-malformed-" + brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  entityName: brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: "&" + brokenNamedEntities[situation.charTrimmed.toLowerCase()] + ";",
                  rangeValDecoded: _decodedEntity2
                });
                pingAmps(whatsOnTheLeft, i);
              } else if ( // idea being, if length of suspected chunk is less or equal to
              // the length of the longest entity (add 1 for Levenshtein distance)
              // we still consider that whole chunk (from ampersand to semi)
              // might be a value of an entity
              potentialEntity.length < maxLength + 2 && ( // a) either one character is different:
              (temp = [].concat(allNamedEntitiesSetOnly).filter(function (curr) {
                return leven_1(curr, potentialEntity) === 1;
              })) && temp.length || //
              // OR
              //
              // b) two are different but entity is at least 4 chars long:
              (temp = [].concat(allNamedEntitiesSetOnly).filter(function (curr) {
                return (
                  /* istanbul ignore next */
                  leven_1(curr, potentialEntity) === 2 && potentialEntity.length > 3
                );
              })) && temp.length)) { // now the problem: what if there were multiple entities matched?

                if (temp.length === 1) {
                  var _temp4 = temp;
                  _tempEnt2 = _temp4[0];
                  rangesArr2.push({
                    ruleName: "bad-html-entity-malformed-" + _tempEnt2,
                    entityName: _tempEnt2,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&" + _tempEnt2 + ";",
                    rangeValDecoded: decode("&" + _tempEnt2 + ";")
                  });
                  pingAmps(whatsOnTheLeft, i);
                }
              } // if "tempEnt" was not set by now, it is not a known HTML entity


              if (!_tempEnt2) { // it's an unrecognised entity:
                rangesArr2.push({
                  ruleName: "bad-html-entity-unrecognised",
                  entityName: null,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: i + 1,
                  rangeValEncoded: null,
                  rangeValDecoded: null
                });
                pingAmps(whatsOnTheLeft, i);
              } //
              //
              //
              //
              //          NAMED ENTITIES CLAUSES ABOVE
              //
              //
              //
              //

            }
          }
        } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < maxLength) {
          //
          //
          //
          //
          // CASE 4 - &*...;
          //
          //
          //
          //

          var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i); // push the issue:
          rangesArr2.push({
            ruleName: "" + (
            /* istanbul ignore next */
            _situation.probablyNumeric ? "bad-html-entity-malformed-numeric" : "bad-html-entity-unrecognised"),
            entityName: null,
            rangeFrom: whatsEvenMoreToTheLeft,
            rangeTo: i + 1,
            rangeValEncoded: null,
            rangeValDecoded: null
          });
          pingAmps(whatsEvenMoreToTheLeft, i);
        }
      } // one-character chunks or chunks ending with ampersand get wiped:


      letterSeqStartAt = null;
    } // Catch the start of the sequence of latin letters. It's necessary to
    // tackle named HTML entity recognition, missing ampersands and semicolons.


    if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
      letterSeqStartAt = i;
    } // catch amp;


    if (str[i] === "a") { // 1. catch recursively-encoded cases. They're easy actually, the task will
      // be deleting sequence of repeated "amp;" between ampersand and letter.
      // For example, we have this:
      // text&   amp  ;  a  m   p   ;  nbsp;text
      // We start at the opening ampersand at index 4;

      var singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");

      if (singleAmpOnTheRight) { // if we had to delete all amp;amp;amp; and leave only ampersand, this
        // will be the index to delete up to:

        var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1; // so one &amp; is confirmed.

        var nextAmpOnTheRight = rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");

        if (nextAmpOnTheRight) {
          toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;

          var _temp5;

          do {
            _temp5 = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");

            if (_temp5) {
              toDeleteAllAmpEndHere = _temp5.rightmostChar + 1;
            }
          } while (_temp5);
        } // What we have is toDeleteAllAmpEndHere which marks where the last amp;
        // semicolon ends (were we to delete the whole thing).
        // For example, in:
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // this would be index 49, the "n" from "nbsp;"


        var firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
        var secondCharThatFollows = firstCharThatFollows ? right(str, firstCharThatFollows) : null; // If entity follows, for example,
        // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
        // we delete from the first ampersand to the beginning of that entity.
        // Otherwise, we delete only repetitions of amp; + whitespaces in between.

        var matchedTemp = "";

        if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(entStartsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(entStartsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && entStartsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
          // if (str.entStartsWith(`${entity};`, firstCharThatFollows)) {
          var matchEntityOnTheRight = rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(entity.split("")));
          /* istanbul ignore else */

          if (matchEntityOnTheRight) {
            matchedTemp = entity;
            return true;
          }
        })) {
          doNothingUntil = firstCharThatFollows + matchedTemp.length + 1; // is there ampersand on the left of "i", the first amp;?

          /* istanbul ignore next */

          var _whatsOnTheLeft = left(str, i) || 0;
          /* istanbul ignore else */


          if (str[_whatsOnTheLeft] === "&") {
            rangesArr2.push({
              ruleName: "bad-html-entity-multiple-encoding",
              entityName: matchedTemp,
              rangeFrom: _whatsOnTheLeft,
              rangeTo: doNothingUntil,
              rangeValEncoded: "&" + matchedTemp + ";",
              rangeValDecoded: decode("&" + matchedTemp + ";")
            });
            pingAmps(_whatsOnTheLeft, i);
          } else if (_whatsOnTheLeft) {
            // we need to add the ampersand as well. Now, another consideration
            // appears: whitespace and where exactly to put it. Algorithmically,
            // right here, at this first letter "a" from "amp;&<some-entity>;"
            var _rangeFrom = i;
            var spaceReplacement = "";

            if (str[i - 1] === " ") ;
            /* istanbul ignore else */

            if (typeof opts.cb === "function") {
              rangesArr2.push({
                ruleName: "bad-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: _rangeFrom,
                rangeTo: doNothingUntil,
                rangeValEncoded: spaceReplacement + "&" + matchedTemp + ";",
                rangeValDecoded: "" + spaceReplacement + decode("&" + matchedTemp + ";")
              });
              pingAmps(_rangeFrom, i);
            }
          }
        }
      }
    } // catch #x of messed up entities without ampersand (like #x26;)


    if (str[i] === "#" && right(str, i) && str[right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")) {

      if (isNumeric(str[right(str, right(str, i))])) {
        brokenNumericEntityStartAt = i;
      }
    } //            |
    //            |
    //            |
    //            |
    //            |
    // PART 3. RULES AT THE BOTTOM
    //            |
    //            |
    //            |
    //            |
    //            |
    // ampersand catches are at the bottom to prevent current index
    // being tangled into the catch-logic of a previous entity


    if (str[i] === "&") {
      ampPositions.push(i);
    }

    if (!str[i] && typeof opts.textAmpersandCatcherCb === "function" && ampPositions.length) {
      pingAmps();
    }
    counter += 1;
  };

  for (var i = 0; i <= len; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  } //                                      ^
  //                                     /|\
  //                                    / | \
  //                                   /  |  \
  //                                  /   |   \
  //                                 /    |    \
  //                                      |
  //                                      |
  //              T   H   E       L   O   O   P       E   N   D   S
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |
  //                                      |


  if (!rangesArr2.length) {
    return [];
  } // return rangesArr2.map(opts.cb);
  // if any two issue objects have identical "from" indexes, remove the one
  // which spans more. For example, [4, 8] and [4, 12] would end up [4, 12]
  // winning and [4, 8] removed. Obviously, it's not arrays, it's objects,
  // format for example
  // {
  //     "ruleName": "bad-html-entity-malformed-amp",
  //     "entityName": "amp",
  //     "rangeFrom": 4,
  //     "rangeTo": 8,
  //     "rangeValEncoded": "&amp;",
  //     "rangeValDecoded": "&"
  // },
  // so instead of [4, 8] that would be [rangeFrom, rangeTo]...

  var res = rangesArr2.filter(function (filteredRangeObj, i) {
    return rangesArr2.every(function (oneOfEveryObj, y) {
      return i === y || !(filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom && filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo);
    });
  });
  /* istanbul ignore else */

  if (typeof opts.cb === "function") {
    return res.map(opts.cb);
  }
  /* istanbul ignore next */

  return res;
}

exports.fixEnt = fixEnt;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
