/**
 * detergent
 * All-in-one: HTML special character encoder, invisible character cleaner and English style improvement tool
 * Version: 4.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://detergent.io
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fixBrokenEntities = _interopDefault(require('string-fix-broken-named-entities'));
var merge = _interopDefault(require('object-merge-advanced'));
var stringRemoveWidows = require('string-remove-widows');
var collapse = _interopDefault(require('string-collapse-white-space'));
var stripHtml = _interopDefault(require('string-strip-html'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var arrayiffy = _interopDefault(require('arrayiffy-if-string'));
var trimSpaces = _interopDefault(require('string-trim-spaces-only'));
var clone = _interopDefault(require('lodash.clonedeep'));
var ansiRegex = _interopDefault(require('ansi-regex'));
var stringLeftRight = require('string-left-right');
var he = _interopDefault(require('he'));
var Ranges = _interopDefault(require('ranges-push'));
var rangesApply = _interopDefault(require('ranges-apply'));
var processOutside = _interopDefault(require('ranges-process-outside'));
var htmlEntitiesNotEmailFriendly = require('html-entities-not-email-friendly');
var allNamedHtmlEntities = require('all-named-html-entities');
var rangesExpander = _interopDefault(require('string-range-expander'));
var stringApostrophes = require('string-apostrophes');

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "4.0.4";

var defaultOpts = {
  fixBrokenEntities: true,
  removeWidows: true,
  convertEntities: true,
  convertDashes: true,
  convertApostrophes: true,
  replaceLineBreaks: true,
  removeLineBreaks: false,
  useXHTML: true,
  dontEncodeNonLatin: true,
  addMissingSpaces: true,
  convertDotsToEllipsis: true,
  stripHtml: true,
  stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"]
};
var leftSingleQuote = "\u2018";
var rightSingleQuote = "\u2019";
var leftDoubleQuote = "\u201C";
var rightDoubleQuote = "\u201D";
var punctuationChars = [".", ",", ";", "!", "?"];
var rawMDash = "\u2014";
var rawNbsp = "\xA0";
var rawEllipsis = "\u2026";
var widowRegexTest = /. ./g;
var latinAndNonNonLatinRanges = [[0, 880], [887, 890], [894, 900], [906, 908], [908, 910], [929, 931], [1319, 1329], [1366, 1369], [1375, 1377], [1415, 1417], [1418, 1423], [1423, 1425], [1479, 1488], [1514, 1520], [1524, 1536], [1540, 1542], [1563, 1566], [1805, 1807], [1866, 1869], [1969, 1984], [2042, 2048], [2093, 2096], [2110, 2112], [2139, 2142], [2142, 2208], [2208, 2210], [2220, 2276], [2302, 2304], [2423, 2425], [2431, 2433], [2435, 2437], [2444, 2447], [2448, 2451], [2472, 2474], [2480, 2482], [2482, 2486], [2489, 2492], [2500, 2503], [2504, 2507], [2510, 2519], [2519, 2524], [2525, 2527], [2531, 2534], [2555, 2561], [2563, 2565], [2570, 2575], [2576, 2579], [2600, 2602], [2608, 2610], [2611, 2613], [2614, 2616], [2617, 2620], [2620, 2622], [2626, 2631], [2632, 2635], [2637, 2641], [2641, 2649], [2652, 2654], [2654, 2662], [2677, 2689], [2691, 2693], [2701, 2703], [2705, 2707], [2728, 2730], [2736, 2738], [2739, 2741], [2745, 2748], [2757, 2759], [2761, 2763], [2765, 2768], [2768, 2784], [2787, 2790], [2801, 2817], [2819, 2821], [2828, 2831], [2832, 2835], [2856, 2858], [2864, 2866], [2867, 2869], [2873, 2876], [2884, 2887], [2888, 2891], [2893, 2902], [2903, 2908], [2909, 2911], [2915, 2918], [2935, 2946], [2947, 2949], [2954, 2958], [2960, 2962], [2965, 2969], [2970, 2972], [2972, 2974], [2975, 2979], [2980, 2984], [2986, 2990], [3001, 3006], [3010, 3014], [3016, 3018], [3021, 3024], [3024, 3031], [3031, 3046], [3066, 3073], [3075, 3077], [3084, 3086], [3088, 3090], [3112, 3114], [3123, 3125], [3129, 3133], [3140, 3142], [3144, 3146], [3149, 3157], [3158, 3160], [3161, 3168], [3171, 3174], [3183, 3192], [3199, 3202], [3203, 3205], [3212, 3214], [3216, 3218], [3240, 3242], [3251, 3253], [3257, 3260], [3268, 3270], [3272, 3274], [3277, 3285], [3286, 3294], [3294, 3296], [3299, 3302], [3311, 3313], [3314, 3330], [3331, 3333], [3340, 3342], [3344, 3346], [3386, 3389], [3396, 3398], [3400, 3402], [3406, 3415], [3415, 3424], [3427, 3430], [3445, 3449], [3455, 3458], [3459, 3461], [3478, 3482], [3505, 3507], [3515, 3517], [3517, 3520], [3526, 3530], [3530, 3535], [3540, 3542], [3542, 3544], [3551, 3570], [3572, 3585], [3642, 3647], [3675, 3713], [3714, 3716], [3716, 3719], [3720, 3722], [3722, 3725], [3725, 3732], [3735, 3737], [3743, 3745], [3747, 3749], [3749, 3751], [3751, 3754], [3755, 3757], [3769, 3771], [3773, 3776], [3780, 3782], [3782, 3784], [3789, 3792], [3801, 3804], [3807, 3840], [3911, 3913], [3948, 3953], [3991, 3993], [4028, 4030], [4044, 4046], [4058, 4096], [4293, 4295], [4295, 4301], [4301, 4304], [4680, 4682], [4685, 4688], [4694, 4696], [4696, 4698], [4701, 4704], [4744, 4746], [4749, 4752], [4784, 4786], [4789, 4792], [4798, 4800], [4800, 4802], [4805, 4808], [4822, 4824], [4880, 4882], [4885, 4888], [4954, 4957], [4988, 4992], [5017, 5024], [5108, 5120], [5788, 5792], [5872, 5888], [5900, 5902], [5908, 5920], [5942, 5952], [5971, 5984], [5996, 5998], [6000, 6002], [6003, 6016], [6109, 6112], [6121, 6128], [6137, 6144], [6158, 6160], [6169, 6176], [6263, 6272], [6314, 7936], [7957, 7960], [7965, 7968], [8005, 8008], [8013, 8016], [8023, 8025], [8025, 8027], [8027, 8029], [8029, 8031], [8061, 8064], [8116, 8118], [8132, 8134], [8147, 8150], [8155, 8157], [8175, 8178], [8180, 8182], [8190, 11904], [11929, 11931], [12019, 12032], [12245, 12288], [12351, 12353], [12438, 12441], [12543, 12549], [12589, 12593], [12686, 12688], [12730, 12736], [12771, 12784], [12830, 12832], [13054, 13056], [13312, 19893], [19893, 19904], [40869, 40908], [40908, 40960], [42124, 42128], [42182, 42192], [42539, 42560], [42647, 42655], [42743, 42752], [42894, 42896], [42899, 42912], [42922, 43000], [43051, 43056], [43065, 43072], [43127, 43136], [43204, 43214], [43225, 43232], [43259, 43264], [43347, 43359], [43388, 43392], [43469, 43471], [43481, 43486], [43487, 43520], [43574, 43584], [43597, 43600], [43609, 43612], [43643, 43648], [43714, 43739], [43766, 43777], [43782, 43785], [43790, 43793], [43798, 43808], [43814, 43816], [43822, 43968], [44013, 44016], [44025, 44032], [55203, 55216], [55238, 55243], [55291, 63744], [64109, 64112], [64217, 64256], [64262, 64275], [64279, 64285], [64310, 64312], [64316, 64318], [64318, 64320], [64321, 64323], [64324, 64326], [64449, 64467], [64831, 64848], [64911, 64914], [64967, 65008], [65021, 65136], [65140, 65142], [65276, 66560], [66717, 66720], [66729, 67584], [67589, 67592], [67592, 67594], [67637, 67639], [67640, 67644], [67644, 67647], [67669, 67671], [67679, 67840], [67867, 67871], [67897, 67903], [67903, 67968], [68023, 68030], [68031, 68096], [68099, 68101], [68102, 68108], [68115, 68117], [68119, 68121], [68147, 68152], [68154, 68159], [68167, 68176], [68184, 68192], [68223, 68352], [68405, 68409], [68437, 68440], [68466, 68472], [68479, 68608], [68680, 69216], [69246, 69632], [69709, 69714], [69743, 69760], [69825, 69840], [69864, 69872], [69881, 69888], [69940, 69942], [69955, 70016], [70088, 70096], [70105, 71296], [71351, 71360], [71369, 73728], [74606, 74752], [74850, 74864], [74867, 77824], [78894, 92160], [92728, 93952], [94020, 94032], [94078, 94095], [94111, 110592], [110593, 131072], [131072, 173782], [173782, 173824], [173824, 177972], [177972, 177984], [177984, 178205], [178205, 194560]];
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
function doConvertEntities(inputString, dontEncodeNonLatin) {
  if (dontEncodeNonLatin) {
    console.log("423 doConvertEntities() - inside if (dontEncodeNonLatin) clauses");
    return Array.from(inputString).map(function (_char) {
      console.log("431 doConvertEntities() - char = \"".concat(_char, "\"; ", "\x1B[".concat(33, "m", "char.charCodeAt(0)", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(_char.charCodeAt(0), null, 4)));
      if (_char.charCodeAt(0) < 880 || latinAndNonNonLatinRanges.some(function (rangeArr) {
        return _char.charCodeAt(0) > rangeArr[0] && _char.charCodeAt(0) < rangeArr[1];
      })) {
        console.log("446 doConvertEntities() - encoding to \"".concat(he.encode(_char, {
          useNamedReferences: true
        }), "\""));
        return he.encode(_char, {
          useNamedReferences: true
        });
      }
      return _char;
    }).join("");
  }
  console.log("458 doConvertEntities() - outside if (dontEncodeNonLatin)");
  return he.encode(inputString, {
    useNamedReferences: true
  });
}
function isNumber(str) {
  return typeof str === "string" && str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57;
}
function isLetter(str) {
  return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
}
function isQuote(str) {
  return str === '"' || str === "'" || str === leftSingleQuote || str === rightSingleQuote || str === leftDoubleQuote || str === rightDoubleQuote;
}
function isLowercaseLetter(str) {
  if (!isLetter(str)) {
    return false;
  }
  return str === str.toLowerCase() && str !== str.toUpperCase();
}
function isUppercaseLetter(str) {
  if (!isLetter(str)) {
    return false;
  }
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

var endOfLine = require("os").EOL || "\n";
function processCharacter(str, opts, rangesArr, i, y, offsetBy, brClosingBracketIndexesArr, state) {
  var len = str.length;
  var isNum = Number.isInteger;
  console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[i] at ".concat(i, " = ").concat(str[i].trim().length ? str.slice(i, y) : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m (", str.slice(i, y).split("").map(function (v) {
    return "#".concat(v.charCodeAt(0));
  }).join("; "), "); i = ").concat(i, "; y = ").concat(y, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
  console.log("".concat("\x1B[".concat(90, "m", "state.onUrlCurrently = ".concat(state.onUrlCurrently), "\x1B[", 39, "m")));
  if (/[\uD800-\uDFFF]/g.test(str[i]) && !(str.charCodeAt(i + 1) >= 0xdc00 && str.charCodeAt(i + 1) <= 0xdfff || str.charCodeAt(i - 1) >= 0xd800 && str.charCodeAt(i - 1) <= 0xdbff)) {
    console.log("078 processCharacter.js - it's a stray surrogate");
    rangesArr.push(i, i + 1);
    console.log("081 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + 1, "]"));
  } else if (y - i > 1) {
    if (opts.convertEntities) {
      rangesArr.push(i, y, doConvertEntities(str.slice(i, y), opts.dontEncodeNonLatin));
    }
  } else {
    var charcode = str[i].charCodeAt(0);
    if (charcode < 127) {
      console.log("111 processCharacter.js - ".concat("\x1B[".concat(90, "m", "character within ASCII", "\x1B[", 39, "m")));
      if (charcode < 32) {
        if (charcode < 9) {
          if (charcode === 3) {
            console.log("118 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"").concat(opts.removeLineBreaks ? " " : "\\n", "\"]"));
            rangesArr.push(i, y, opts.removeLineBreaks ? " " : opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">\n") : "\n");
          } else {
            console.log("134 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
            rangesArr.push(i, y);
          }
        } else if (charcode === 9) {
          console.log("143 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \" \"]"));
          rangesArr.push(i, y, " ");
        } else if (charcode === 10) {
          if (str[i - 1] !== "\r") {
            console.log("151 processCharacter.js - LF caught");
            if (opts.removeLineBreaks) {
              var whatToInsert = " ";
              if (punctuationChars.includes(str[stringLeftRight.right(str, i)])) {
                whatToInsert = "";
              }
              console.log("162 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(JSON.stringify(whatToInsert, null, 0), "]"));
              rangesArr.push(i, y, whatToInsert);
            } else if (opts.replaceLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
              return stringLeftRight.left(str, i) === idx;
            }))) {
              console.log("182 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i, ", ", "<br".concat(opts.useXHTML ? "/" : "", ">"), "]"));
              var startingIdx = i;
              if (str[i - 1] === " ") {
                startingIdx = stringLeftRight.leftStopAtNewLines(str, i) + 1;
              }
              rangesArr.push(startingIdx, i, "<br".concat(opts.useXHTML ? "/" : "", ">").concat(endOfLine === "\r\n" ? "\r" : ""));
            } else {
              if (str[stringLeftRight.leftStopAtNewLines(str, i)].trim().length) {
                var tempIdx = stringLeftRight.leftStopAtNewLines(str, i);
                if (tempIdx < i - 1) {
                  console.log("206 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tempIdx + 1, ", ").concat(i, "]"));
                  rangesArr.push(tempIdx + 1, i, "".concat(endOfLine === "\r\n" ? "\r" : ""));
                }
              } else if (endOfLine === "\r\n" && str[i - 1] !== "\r") {
                console.log("217 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " missing CR for this Windows EOL [", i, ", ").concat(i, ", \"\\r\"]"));
                rangesArr.push(i, i, "\r");
              }
              if (str[stringLeftRight.rightStopAtNewLines(str, i)].trim().length) {
                var _tempIdx = stringLeftRight.rightStopAtNewLines(str, i);
                if (_tempIdx > i + 1) {
                  console.log("227 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i + 1, ", ").concat(_tempIdx, "]"));
                  rangesArr.push(i + 1, _tempIdx);
                }
              }
            }
          }
          state.onUrlCurrently = false;
          console.log("243 processCharacter.js - SET ".concat("\x1B[".concat(33, "m", "state.onUrlCurrently", "\x1B[", 39, "m"), " = false"));
        } else if (charcode === 11 || charcode === 12) {
          rangesArr.push(i, y, opts.removeLineBreaks ? " " : "\n");
          console.log("250 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.removeLineBreaks ? " " : "\\n", "]"));
        } else if (charcode === 13) {
          console.log("257 CR caught");
          if (opts.removeLineBreaks) {
            var _whatToInsert = " ";
            if (punctuationChars.includes(str[stringLeftRight.right(str, i)])) {
              _whatToInsert = "";
            }
            rangesArr.push(i, y, _whatToInsert);
            console.log("266 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \" \"]"));
          } else if (opts.replaceLineBreaks) {
            var _startingIdx = i;
            if (str[i - 1] === " ") {
              _startingIdx = stringLeftRight.leftStopAtNewLines(str, i) + 1;
            }
            var endingIdx = i;
            if (endOfLine === "\n") {
              endingIdx = i + 1;
            }
            rangesArr.push(_startingIdx, endingIdx, "<br".concat(opts.useXHTML ? "/" : "", ">").concat(str[i + 1] === "\n" ? "" : "\n"));
            console.log("286 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _startingIdx, ", ").concat(endingIdx, ", ").concat(JSON.stringify("<br".concat(opts.useXHTML ? "/" : "", ">").concat(str[i + 1] === "\n" ? "" : "\n"), null, 4), "]"));
          } else {
            if (str[stringLeftRight.leftStopAtNewLines(str, i)].trim().length) {
              var _endingIdx = i;
              if (endOfLine === "\n") {
                _endingIdx = i + 1;
              }
              var _tempIdx2 = stringLeftRight.leftStopAtNewLines(str, i);
              if (_tempIdx2 < i - 1) {
                console.log("306 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _tempIdx2 + 1, ", ").concat(_endingIdx, ", ").concat(JSON.stringify("".concat(str[i + 1] === "\n" ? "" : "\n"), null, 4), "]"));
                rangesArr.push(_tempIdx2 + 1, _endingIdx, "".concat(str[i + 1] === "\n" ? "" : "\n"));
              }
            }
            if (str[stringLeftRight.rightStopAtNewLines(str, i)].trim().length && str[i + 1] !== "\n") {
              var _tempIdx3 = stringLeftRight.rightStopAtNewLines(str, i);
              if (_tempIdx3 > i + 1) {
                console.log("329 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i + 1, ", ").concat(_tempIdx3, "]"));
                rangesArr.push(i + 1, _tempIdx3);
              }
            }
          }
        } else if (charcode > 13) {
          rangesArr.push(i, y);
          console.log("340 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
        }
      } else {
        console.log("345 processCharacter.js - clauses 32 <= charcode < 127");
        if (charcode === 32) ; else if (charcode === 34) {
          console.log("353 double quote caught");
          if (stringLeftRight.right(str, i) || stringLeftRight.left(str, i)) {
            rangesArr.push(stringApostrophes.convertOne(str, {
              from: i,
              convertEntities: opts.convertEntities,
              convertApostrophes: opts.convertApostrophes,
              offsetBy: offsetBy
            }));
          } else if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&quot;");
          }
        } else if (charcode === 38) {
          console.log("369 processCharacter.js - ampersand clauses");
          if (isLetter(str[i + 1])) {
            var temp = Object.keys(allNamedHtmlEntities.allNamedEntities).find(function (entName) {
              return str.startsWith(entName, i + 1) && str[i + entName.length + 1] === ";";
            });
            console.log("378 processCharacter.js - ".concat("\x1B[".concat(33, "m", "temp", "\x1B[", 39, "m"), " = ", JSON.stringify(temp, null, 4)));
            if (temp) {
              console.log("386 processCharacter.js - named entity, ".concat("\x1B[".concat(32, "m", temp, "\x1B[", 39, "m"), " found"));
              if (temp === "apos") {
                console.log("389 processCharacter.js - let's decode");
                var decodedTempRes = stringApostrophes.convertOne(str, {
                  from: i,
                  to: i + temp.length + 2,
                  value: "'",
                  convertEntities: opts.convertEntities,
                  convertApostrophes: opts.convertApostrophes,
                  offsetBy: offsetBy
                });
                if (Array.isArray(decodedTempRes) && decodedTempRes.length) {
                  rangesArr.push(decodedTempRes);
                  console.log("401 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(decodedTempRes, null, 0)));
                  console.log("407 offset by ".concat(temp.length + 2));
                  offsetBy(temp.length + 2);
                } else {
                  rangesArr.push([i, i + temp.length + 2, "'"]);
                  console.log("412 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify([i, i + temp.length + 2, "'"], null, 0)));
                  console.log("418 offset by ".concat(temp.length + 2));
                  offsetBy(temp.length + 2);
                }
              } else if (opts.convertEntities && Object.keys(htmlEntitiesNotEmailFriendly.notEmailFriendly).includes(str.slice(i + 1, i + temp.length + 1))) {
                console.log("428 processCharacter.js - not email-friendly named entity");
                rangesArr.push(i, i + temp.length + 2, "&".concat(htmlEntitiesNotEmailFriendly.notEmailFriendly[str.slice(i + 1, i + temp.length + 1)], ";"));
                console.log("436 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + temp.length + 2, ", &").concat(JSON.stringify(htmlEntitiesNotEmailFriendly.notEmailFriendly[str.slice(i + 1, i + temp.length + 1)], null, 4), ";]"));
                offsetBy(temp.length + 1);
                console.log("445 offset by ".concat(temp.length + 1));
              } else if (!opts.convertEntities) {
                console.log("448 decoded ".concat(JSON.stringify(str.slice(i, i + temp.length + 2), null, 4), " (charCodeAt = ").concat(he.decode("".concat(str.slice(i, i + temp.length + 2))).charCodeAt(0), ")"));
                console.log("457 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " decoded [", i, ", ").concat(i + temp.length + 2, ", ").concat(JSON.stringify(he.decode("".concat(str.slice(i, i + temp.length + 2))), null, 4), "]"));
                rangesArr.push(i, i + temp.length + 2, he.decode("".concat(str.slice(i, i + temp.length + 2))));
                offsetBy(temp.length + 1);
                console.log("471 offset by ".concat(temp.length + 1));
              } else {
                offsetBy(temp.length + 1);
                console.log("476 offset by ".concat(temp.length + 1));
              }
            } else if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&amp;");
              console.log("482 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + 1, ", \"&amp;\"]"));
            }
          } else if (str[stringLeftRight.right(str, i)] === "#") {
            console.log("488 ██ numeric, a decimal or a hex entity");
            for (var z = stringLeftRight.right(str, i); z < len; z++) {
              if (str[z].trim().length && !isNum(str[z]) && str[z] !== "#") {
                if (str[z] === ";") {
                  console.log("493 carved out \"".concat(str.slice(i, z + 1), "\""));
                  var tempRes = he.encode(he.decode(str.slice(i, z + 1)), {
                    useNamedReferences: true
                  });
                  console.log("498 ".concat("\x1B[".concat(33, "m", "tempRes", "\x1B[", 39, "m"), " = ", JSON.stringify(tempRes, null, 4)));
                  if (tempRes) {
                    rangesArr.push(i, z + 1, tempRes);
                    console.log("507 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(z + 1, ", \"").concat(tempRes, "\"]"));
                  }
                  offsetBy(z + 1 - i);
                  console.log("512 offset by ".concat(z + 1 - i));
                }
              }
            }
          } else {
            if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&amp;");
              console.log("524 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + 1, ", \"&amp;\"]"));
            }
          }
        } else if (charcode === 39) {
          rangesArr.push(stringApostrophes.convertOne(str, {
            from: i,
            convertEntities: opts.convertEntities,
            convertApostrophes: opts.convertApostrophes,
            offsetBy: offsetBy
          }));
        } else if (charcode === 44 || charcode === 59) {
          if (str[i - 1] && !str[i - 1].trim().length) {
            var whatsOnTheLeft = stringLeftRight.left(str, i);
            if (whatsOnTheLeft < i - 1) {
              rangesArr.push(whatsOnTheLeft + 1, i);
              console.log("548 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", whatsOnTheLeft + 1, ", ").concat(i, "]"));
            }
          }
          if (charcode === 44 && opts.addMissingSpaces && str[y] !== undefined && !state.onUrlCurrently && !isNumber(str[y]) && str[y].trim().length && str[y] !== " " && str[y] !== "\n" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
            rangesArr.push(y, y, " ");
            console.log("574 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", \" \"]"));
          }
          console.log("578");
          if (charcode === 59 && opts.addMissingSpaces && str[y] !== undefined && !state.onUrlCurrently && str[y].trim().length && str[y] !== "&" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
            rangesArr.push(y, y, " ");
            console.log("596 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", \" \"]"));
          }
        } else if (charcode === 45) {
          console.log("601 processCharacter.js - minus caught");
          if ((str[i - 1] === rawNbsp || str[i - 1] === " ") && str[y] !== "$" && str[y] !== "£" && str[y] !== "€" && str[y] !== "₽" && str[y] !== "0" && str[y] !== "1" && str[y] !== "2" && str[y] !== "3" && str[y] !== "4" && str[y] !== "5" && str[y] !== "6" && str[y] !== "7" && str[y] !== "8" && str[y] !== "9" && str[y] !== "-" && str[y] !== ">" && str[y] !== " ") {
            rangesArr.push(y, y, " ");
            console.log("628 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", \" \"]"));
          } else if (opts.convertDashes && str[i - 1] && str[y] && (isNumber(str[i - 1]) && isNumber(str[y]) || str[i - 1].toLowerCase() === "a" && str[y].toLowerCase() === "z")) {
            console.log("640 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.convertEntities ? "&ndash;" : "\u2013", "]"));
            rangesArr.push(i, y, opts.convertEntities ? "&ndash;" : "\u2013");
          } else if (opts.convertDashes && str[i - 1] && str[y] && (str[i - 1].trim().length === 0 && str[y].trim().length === 0 || isLowercaseLetter(str[i - 1]) && str[y] === "'")) {
            console.log("654 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.convertEntities ? "&mdash;" : rawMDash, "]"));
            rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
          } else if (opts.convertDashes && str[i - 1] && str[y] && isLetter(str[i - 1]) && isQuote(str[y])) {
            console.log("666 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.convertEntities ? "&mdash;" : rawMDash, "]"));
            rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
          }
        } else if (charcode === 46) {
          if (str[i - 1] !== "." && str[y] === "." && str[y + 1] === "." && str[y + 2] !== ".") {
            if (opts.convertDotsToEllipsis) {
              console.log("687 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y + 2, ", ").concat(opts.convertEntities ? "&hellip;" : "".concat(rawEllipsis), "]"));
              rangesArr.push(i, y + 2, opts.convertEntities ? "&hellip;" : "".concat(rawEllipsis));
            }
          }
          var first = str[y] ? str[y].toLowerCase() : "";
          var second = str[y + 1] ? str[y + 1].toLowerCase() : "";
          var third = str[y + 2] ? str[y + 2].toLowerCase() : "";
          var fourth = str[y + 3] ? str[y + 3].toLowerCase() : "";
          var nextThreeChars = first + second + third;
          if (first + second !== "js" && nextThreeChars !== "jpg" && nextThreeChars !== "png" && nextThreeChars !== "gif" && nextThreeChars !== "svg" && nextThreeChars !== "htm" && nextThreeChars !== "pdf" && nextThreeChars !== "psd" && nextThreeChars !== "tar" && nextThreeChars !== "zip" && nextThreeChars !== "rar" && nextThreeChars !== "otf" && nextThreeChars !== "ttf" && nextThreeChars !== "eot" && nextThreeChars !== "php" && nextThreeChars !== "rss" && nextThreeChars !== "asp" && nextThreeChars !== "ppt" && nextThreeChars !== "doc" && nextThreeChars !== "txt" && nextThreeChars !== "rtf" && nextThreeChars !== "git" && nextThreeChars + fourth !== "jpeg" && nextThreeChars + fourth !== "html" && nextThreeChars + fourth !== "woff" && !(!isLetter(str[i - 2]) && str[i - 1] === "p" && str[y] === "s" && str[y + 1] === "t" && !isLetter(str[y + 2]))) {
            if (opts.addMissingSpaces && str[y] !== undefined && (
            !state.onUrlCurrently && isUppercaseLetter(str[y]) || state.onUrlCurrently && isLetter(str[y]) && isUppercaseLetter(str[y]) && isLetter(str[y + 1]) && isLowercaseLetter(str[y + 1])) && str[y] !== " " && str[y] !== "." && str[y] !== "\n") {
              rangesArr.push(y, y, " ");
              console.log("760 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", \" \"]"));
            }
            if (str[i - 1] !== undefined && str[i - 1].trim() === "" && str[y] !== "." && (str[i - 2] === undefined || str[i - 2] !== ".")
            ) {
                for (y = i - 1; y--;) {
                  if (str[y].trim() !== "") {
                    rangesArr.push(y + 1, i);
                    console.log("776 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y + 1, ", ").concat(i, "]"));
                    break;
                  }
                }
              }
          }
        } else if (charcode === 47) {
          console.log("785 processCharacter.js - right slash caught");
        } else if (charcode === 58) {
          if (str[y - 1] && str[stringLeftRight.right(str, y - 1)] === "/" && str[stringLeftRight.right(str, stringLeftRight.right(str, y - 1))] === "/") {
            state.onUrlCurrently = true;
            console.log("800 processCharacter.js - ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "state.onUrlCurrently", "\x1B[", 39, "m"), " = true"));
          }
        } else if (charcode === 60) {
          if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&lt;");
            console.log("808 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + 1, ", \"&lt;\"]"));
          }
        } else if (charcode === 62) {
          if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&gt;");
            console.log("817 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(i + 1, ", \"&gt;\"]"));
          }
        } else if (charcode === 119) {
          if (str[y + 1] && str[y].toLowerCase() === "w" && str[y + 1].toLowerCase() === "w") {
            state.onUrlCurrently = true;
            console.log("833 processCharacter.js - ".concat("\x1B[".concat(33, "m", "state.onUrlCurrently", "\x1B[", 39, "m"), " = true"));
          }
        } else if (charcode === 123) {
          var stopUntil;
          if (str[y] === "{") {
            stopUntil = "}}";
          } else if (str[y] === "%") {
            stopUntil = "%}";
          }
          if (stopUntil) {
            for (var _z = i; _z < len; _z++) {
              if (str[_z] === stopUntil[0] && str[_z + 1] === stopUntil[1]) {
                offsetBy(_z + 1 - i);
              }
            }
          }
        }
      }
    } else {
      console.log("863 processCharacter.js - ".concat("\x1B[".concat(90, "m", "character outside ASCII", "\x1B[", 39, "m"), "; charcode = ", charcode));
      if (charcode > 126 && charcode < 160) {
        if (charcode !== 133) {
          rangesArr.push(i, y);
          console.log("875 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
        } else {
          rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
          console.log("882 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.removeLineBreaks ? "" : "\\n", "]"));
        }
      } else if (charcode === 173) {
        rangesArr.push(i, y);
        console.log("891 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
      } else if (charcode === 8232 || charcode === 8233) {
        rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
        console.log("897 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(opts.removeLineBreaks ? "" : "\\n", "]"));
      } else if (charcode === 8202) {
        console.log("903 processCharacter.js - hairspace caught");
        if (!str[y]) {
          rangesArr.push(i, y);
          console.log("907 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
        } else {
          var expandedRange = rangesExpander({
            str: str,
            from: i,
            to: y,
            wipeAllWhitespaceOnLeft: true,
            wipeAllWhitespaceOnRight: true,
            addSingleSpaceToPreventAccidentalConcatenation: true
          });
          console.log("920 processCharacter.js - expanded to ".concat(JSON.stringify(expandedRange, null, 0), " and then pushed it"));
          rangesArr.push.apply(rangesArr, _toConsumableArray(expandedRange));
        }
      } else if (charcode === 8206) {
        console.log("930 processCharacter.js - LTR mark caught");
        rangesArr.push(i, y);
        console.log("933 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
      } else if (charcode === 8207) {
        console.log("936 processCharacter.js - RTL mark caught");
        rangesArr.push(i, y);
        console.log("940 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
      } else if (charcode === 8211) {
        console.log("945 - processCharacter.js - N dash caught");
        if (str[i - 1] && str[i - 1].trim().length === 0 && str[y].trim().length !== 0) {
          if (str[i - 2] && isNumber(str[i - 2]) && isNumber(str[y])) {
            rangesArr.push(i - 1, i);
            console.log("956 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " (TO DELETE) [", i - 1, ", ").concat(i, "]"));
          } else {
            if (opts.addMissingSpaces) {
              var whatToAdd = " ";
              if (opts.removeWidows && !widowRegexTest.test(str.slice(y))) {
                whatToAdd = opts.convertEntities ? "&nbsp;" : rawNbsp;
                console.log("970 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " whatToAdd = ", opts.convertEntities ? whatToAdd : "rawNbsp"));
              }
              rangesArr.push(y, y, whatToAdd);
              console.log("978 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", ").concat(JSON.stringify(whatToAdd, null, 0), "]"));
            }
            if (opts.removeWidows && str.slice(i - 1, i) !== rawNbsp) {
              rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
              console.log("995 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i - 1, ", ").concat(i, ", ").concat(JSON.stringify(opts.convertEntities ? "&nbsp;" : rawNbsp, null, 0), "]"));
            }
          }
        } else if (str[i - 2] && str[i - 1] && str[y] && str[y + 1] && isNumber(str[i - 2]) && isNumber(str[y + 1]) && str[i - 1].trim().length === 0 && str[y].trim().length === 0) {
          rangesArr.push(i - 1, i);
          rangesArr.push(y, y + 1);
          console.log("1018 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i - 1, ", ").concat(i, "], then [").concat(y, ", ").concat(y + 1, "]"));
        }
        if (opts.convertEntities) {
          rangesArr.push(i, y, "&ndash;");
          console.log("1026 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"&ndash;\"]"));
        } else if (charcode === 65533) {
          rangesArr.push(i, y, rawMDash);
          console.log("1031 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"raw m-dash\"]"));
        }
      } else if (charcode === 8212) {
        console.log("1037 processCharacter.js - M dash caught");
        if (opts.addMissingSpaces && str[i - 1] && str[i - 1].trim().length === 0 && str[y].trim().length !== 0) {
          rangesArr.push(y, y, " ");
          console.log("1048 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", y, ", ").concat(y, ", \" \"]"));
        }
        if (opts.convertEntities) {
          rangesArr.push(i, y, "&mdash;");
          console.log("1056 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"&mdash;\"]"));
        }
        if (opts.removeWidows && str[i - 1] === " " && stringLeftRight.left(str, i) !== null) {
          rangesArr.push(stringLeftRight.left(str, i) + 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
          console.log("1068 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", stringLeftRight.left(str, i) + 1, ", ").concat(i, ", ").concat(JSON.stringify(opts.convertEntities ? "&nbsp;" : rawNbsp, null, 4), " (charCodeAt=").concat(rawNbsp.charCodeAt(0), ")]"));
        }
        console.log("".concat("\x1B[".concat(33, "m", "rangesArr.current()", "\x1B[", 39, "m"), " = ", JSON.stringify(rangesArr.current(), null, 4)));
      } else if (charcode === 8230) {
        if (!opts.convertDotsToEllipsis) {
          rangesArr.push(i, y, "...");
          console.log("1090 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"...\"]"));
        } else if (opts.convertEntities) {
          rangesArr.push(i, y, "&hellip;");
          console.log("1095 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"&hellip;\"]"));
        }
      } else if (charcode === 65279) {
        rangesArr.push(i, y);
        console.log("1102 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, "]"));
      } else {
        console.log("1106 processCharacter.js - ".concat("\x1B[".concat(90, "m", "else clause leading to encode", "\x1B[", 39, "m")));
        if (opts.convertEntities) {
          console.log("1115 processCharacter.js - ".concat("\x1B[".concat(90, "m", "inside if (opts.convertEntities)", "\x1B[", 39, "m")));
          var convertedCharVal = doConvertEntities(str[i], opts.dontEncodeNonLatin);
          console.log("1123 processCharacter.js - ".concat("\x1B[".concat(33, "m", "convertedCharVal", "\x1B[", 39, "m"), " = ", JSON.stringify(convertedCharVal, null, 4)));
          if (Object.keys(htmlEntitiesNotEmailFriendly.notEmailFriendly).includes(convertedCharVal.slice(1, convertedCharVal.length - 1))) {
            convertedCharVal = "&".concat(htmlEntitiesNotEmailFriendly.notEmailFriendly[convertedCharVal.slice(1, convertedCharVal.length - 1)], ";");
          }
          console.log("1141 processCharacter.js - ".concat("\x1B[".concat(33, "m", "convertedCharVal", "\x1B[", 39, "m"), " = ", JSON.stringify(convertedCharVal, null, 4)));
          if (str[i] !== convertedCharVal) {
            if (convertedCharVal === "&mldr;") {
              console.log("1153 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", \"&hellip;\"]"));
              rangesArr.push(i, y, "&hellip;");
            } else if (convertedCharVal !== "&apos;") {
              console.log("1158 processCharacter.js - ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", i, ", ").concat(y, ", ").concat(convertedCharVal, "]"));
              rangesArr.push(i, y, convertedCharVal);
            }
          }
        }
      }
    }
    if (state.onUrlCurrently && !str[i].trim().length) {
      console.log("1169 SET ".concat("\x1B[".concat(33, "m", "state.onUrlCurrently", "\x1B[", 39, "m"), " = false"));
      state.onUrlCurrently = false;
    }
  }
}

function det(str, inputOpts) {
  var opts;
  if (inputOpts) {
    if (isObj(inputOpts)) {
      if (inputOpts.stripHtmlButIgnoreTags) {
        inputOpts.stripHtmlButIgnoreTags = arrayiffy(inputOpts.stripHtmlButIgnoreTags);
      }
      opts = merge(defaultOpts, inputOpts, {
        cb: function cb(inputArg1, inputArg2, resultAboutToBeReturned) {
          if (Array.isArray(inputArg1) && Array.isArray(inputArg2) && inputArg2.length || typeof inputArg1 === "boolean" && typeof inputArg2 === "boolean") {
            return inputArg2;
          }
          return resultAboutToBeReturned;
        }
      });
      if (typeof opts.stripHtmlButIgnoreTags === "string") {
        opts.stripHtmlButIgnoreTags = [opts.stripHtmlButIgnoreTags];
      } else if (!opts.stripHtmlButIgnoreTags) {
        opts.stripHtmlButIgnoreTags = [];
      }
    } else {
      throw new Error("detergent(): [THROW_ID_01] Options object must be a plain object, not ".concat(_typeof(inputOpts)));
    }
  } else {
    opts = clone(defaultOpts);
  }
  var applicableOpts = {};
  Object.keys(defaultOpts).sort().filter(function (val) {
    return val !== "stripHtmlButIgnoreTags";
  }).forEach(function (singleOption) {
    applicableOpts[singleOption] = false;
  });
  var endOfLine = require("os").EOL || "\n";
  var brClosingBracketIndexesArr = [];
  var finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true
  });
  var skipArr = new Ranges();
  function applyAndWipe() {
    str = rangesApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
    skipArr.wipe();
  }
  function isNum(something) {
    return Number.isInteger(something);
  }
  var isArr = Array.isArray;
  var state = {
    onUrlCurrently: false
  };
  console.log("180 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. Initial =================", "\x1B[", 39, "m")));
  str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false
  }).res;
  console.log("190 after the initial trim, str = ".concat(JSON.stringify(str, null, 0)));
  var temp = str;
  var lastVal;
  do {
    lastVal = temp;
    temp = he.decode(temp);
  } while (temp !== str && lastVal !== temp);
  str = temp;
  console.log("207 after recursive decoding, str = ".concat(JSON.stringify(str, null, 4)));
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      console.log("221 main.js: entering charcode #65533 catch clauses");
      if (str[i - 1] && str[i + 1] && (str[i - 1].toLowerCase() === "n" && str[i + 1].toLowerCase() === "t" || isLetter(str[i - 1]) && str[i + 1].toLowerCase() === "s") || str[i + 2] && ((str[i + 1].toLowerCase() === "r" || str[i + 1].toLowerCase() === "v") && str[i + 2].toLowerCase() === "e" || str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l") && (str[i - 3] && str[i - 3].toLowerCase() === "y" && str[i - 2].toLowerCase() === "o" && str[i - 1].toLowerCase() === "u" || str[i - 2] && str[i - 2].toLowerCase() === "w" && str[i - 1].toLowerCase() === "e" || str[i - 4] && str[i - 4].toLowerCase() === "t" && str[i - 3].toLowerCase() === "h" && str[i - 2].toLowerCase() === "e" && str[i - 1].toLowerCase() === "y") || (str[i - 1] && str[i - 1].toLowerCase() === "i" || str[i - 2] && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e" || str[i - 3] && str[i - 3].toLowerCase() === "s" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e") && str[i + 2] && str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l" || str[i - 5] && str[i + 2] && str[i - 5].toLowerCase() === "m" && str[i - 4].toLowerCase() === "i" && str[i - 3].toLowerCase() === "g" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "t" && str[i + 1] === "v" && str[i + 2] === "e" || str[i - 1] && str[i - 1].toLowerCase() === "s" && (!str[i + 1] || !isLetter(str[i + 1]) && !isNumber(str[i + 1]))) {
        var replacement = opts.convertApostrophes ? rightSingleQuote : "'";
        finalIndexesToDelete.push(i, i + 1, "".concat(replacement));
        console.log("280 main.js - PUSH [".concat(i, ", ").concat(i + 1, ", ").concat(replacement, "]"));
      } else if (str[i - 2] && isLowercaseLetter(str[i - 2]) && !str[i - 1].trim().length && str[i + 2] && isLowercaseLetter(str[i + 2]) && !str[i + 1].trim().length) {
        finalIndexesToDelete.push(i, i + 1, rawMDash);
        console.log("291 main.js - PUSH [".concat(i, ", ").concat(i + 1, ", ").concat(rawMDash, "]"));
      } else {
        finalIndexesToDelete.push(i, i + 1);
        console.log("295 main.js - PUSH [".concat(i, ", ").concat(i + 1, "]"));
      }
    }
  }
  applyAndWipe();
  console.log("310 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. fix broken HTML entity references =================", "\x1B[", 39, "m")));
  if (opts.fixBrokenEntities) {
    str = rangesApply(str, fixBrokenEntities(str, {
      decode: false
    }));
    console.log("316 after fixing broken entities, str = ".concat(JSON.stringify(str, null, 0)));
  }
  if (str.includes("<") || str.includes(">")) {
    console.log("327 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. HTML tags =================", "\x1B[", 39, "m")));
    var cb = function cb(_ref) {
      var tag = _ref.tag,
          deleteFrom = _ref.deleteFrom,
          deleteTo = _ref.deleteTo,
          proposedReturn = _ref.proposedReturn;
      console.log("347 main.js: ".concat("\x1B[".concat(33, "m", "tag", "\x1B[", 39, "m"), " = ", JSON.stringify(tag, null, 4)));
      if (isNum(tag.lastOpeningBracketAt) && isNum(tag.lastClosingBracketAt) && tag.lastOpeningBracketAt < tag.lastClosingBracketAt || tag.slashPresent) {
        skipArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length);
        if (opts.stripHtml && !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase()) || opts.removeLineBreaks && tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          if (tag.name.toLowerCase() === "li" && !tag.slashPresent || tag.name.toLowerCase() === "ul" && tag.slashPresent) {
            if (!opts.removeLineBreaks) {
              finalIndexesToDelete.push(deleteFrom, deleteTo, "".concat(opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">") : "", "\n"));
              console.log("391 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify([deleteFrom, deleteTo, "".concat(opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">") : "", "\n")], null, 0)));
            } else {
              finalIndexesToDelete.push(proposedReturn);
              console.log("408 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(proposedReturn, null, 4)));
            }
          } else if (["ul", "li"].includes(tag.name.toLowerCase()) && !opts.removeLineBreaks) {
            finalIndexesToDelete.push(deleteFrom, deleteTo);
            console.log("422 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify([deleteFrom, deleteTo], null, 4)));
          } else {
            finalIndexesToDelete.push(proposedReturn);
            console.log("431 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(proposedReturn, null, 4)));
          }
        } else {
          if ((!opts.stripHtml || isArr(opts.stripHtmlButIgnoreTags) && opts.stripHtmlButIgnoreTags.includes("br")) && opts.replaceLineBreaks && tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt && !"\n\r".includes(str[tag.lastClosingBracketAt + 1])) {
            console.log("449 insert line break clauses");
            finalIndexesToDelete.push(tag.lastClosingBracketAt + 1, tag.lastClosingBracketAt + 1, "\n");
          }
          if (opts.useXHTML && voidTags.includes(tag.name.toLowerCase()) && str[stringLeftRight.left(str, tag.lastClosingBracketAt)] !== "/" && tag.lastClosingBracketAt) {
            console.log("465 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tag.lastClosingBracketAt, ", ").concat(tag.lastClosingBracketAt, ", \"/\"]"));
            finalIndexesToDelete.push(tag.lastClosingBracketAt, tag.lastClosingBracketAt, "/");
          }
          if (voidTags.includes(tag.name.toLowerCase()) && tag.slashPresent && isNum(tag.lastOpeningBracketAt) && tag.nameStarts && tag.lastOpeningBracketAt < tag.nameStarts - 1 && str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).split("").every(function (_char) {
            return !_char.trim().length || _char === "/";
          })) {
            console.log("489 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tag.lastOpeningBracketAt, ", ").concat(tag.nameStarts, "]"));
            finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts);
          }
          if (voidTags.includes(tag.name.toLowerCase()) && tag.slashPresent && str[stringLeftRight.left(str, tag.lastClosingBracketAt)] === "/") {
            console.log("506");
            if (str[stringLeftRight.left(str, stringLeftRight.left(str, tag.lastClosingBracketAt))] === "/") {
              if (!opts.useXHTML || str.slice(stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                mode: 2
              }, "/"), tag.lastClosingBracketAt) !== "/") {
                finalIndexesToDelete.push(
                stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                  mode: 2
                }, "/"), tag.lastClosingBracketAt, opts.useXHTML ? "/" : undefined);
                console.log("526 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " chomped [", stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                  mode: 2
                }, "/"), ", ").concat(tag.lastClosingBracketAt, ", ").concat(opts.useXHTML ? "/" : undefined, "]"));
              }
            } else if (!opts.useXHTML || str.slice(tag.slashPresent, tag.lastClosingBracketAt) !== "/") {
              console.log("541 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tag.slashPresent, ", ").concat(tag.lastClosingBracketAt, "]"));
              finalIndexesToDelete.push(tag.slashPresent, tag.lastClosingBracketAt);
            }
          }
          if (tag.name.toLowerCase() !== tag.name) {
            console.log("555 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tag.nameStarts, ", ").concat(tag.nameEnds, ", ").concat(tag.name.toLowerCase(), "]"));
            finalIndexesToDelete.push(tag.nameStarts, tag.nameEnds, tag.name.toLowerCase());
          }
          if ("/>".includes(str[stringLeftRight.right(str, tag.nameEnds - 1)]) && stringLeftRight.right(str, tag.nameEnds - 1) > tag.nameEnds) {
            console.log("572 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", tag.nameEnds, ", ").concat(stringLeftRight.right(str, tag.nameEnds - 1), "]"));
            finalIndexesToDelete.push(tag.nameEnds, stringLeftRight.right(str, tag.nameEnds - 1));
          }
          if (!voidTags.includes(tag.name.toLowerCase()) && tag.slashPresent && str[stringLeftRight.left(str, tag.lastClosingBracketAt)] === "/") {
            finalIndexesToDelete.push(stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
              mode: 2
            }, "/"), tag.lastClosingBracketAt);
            finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.lastOpeningBracketAt + 1, "/");
          }
        }
        if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
          console.log("606 brClosingBracketIndexesArr now = ".concat(JSON.stringify(brClosingBracketIndexesArr, null, 0)));
        }
        if (["ul", "li"].includes(tag.name.toLowerCase()) && !opts.removeLineBreaks && str[tag.lastOpeningBracketAt - 1] && !str[tag.lastOpeningBracketAt - 1].trim().length) {
          console.log("621 - ul/li prep");
          finalIndexesToDelete.push(stringLeftRight.leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1, tag.lastOpeningBracketAt);
          console.log("628 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", stringLeftRight.leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1, ", ").concat(tag.lastOpeningBracketAt, "]"));
        }
      }
      console.log("".concat("\x1B[".concat(90, "m", "========================================\nENDING finalIndexesToDelete[]:\n", "\x1B[", 39, "m")));
      console.log("".concat("\x1B[".concat(90, "m", JSON.stringify(finalIndexesToDelete.current(), null, 4), "\x1B[", 39, "m")));
    };
    console.log("".concat("\x1B[".concat(90, "m", "========================================", "\x1B[", 39, "m")));
    stripHtml(str, {
      cb: cb,
      trimOnlySpaces: true,
      ignoreTags: stripHtml ? opts.stripHtmlButIgnoreTags : [],
      skipHtmlDecoding: true,
      returnRangesOnly: true
    });
  }
  console.log("664 ".concat(str.includes("<") || str.includes(">") ? "" : "no tags found"));
  console.log("667 ".concat("\x1B[".concat(33, "m", "rangesArr", "\x1B[", 39, "m"), ".current() = ", JSON.stringify(finalIndexesToDelete.current(), null, 0), "; ", "\x1B[".concat(33, "m", "skipArr", "\x1B[", 39, "m"), ".current() = ").concat(JSON.stringify(skipArr.current(), null, 0)));
  console.log("682 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. Process outside tags =================", "\x1B[", 39, "m")));
  console.log("685 call processOutside()");
  processOutside(str, skipArr.current(), function (idxFrom, idxTo, offsetBy) {
    return processCharacter(str, opts, finalIndexesToDelete, idxFrom, idxTo, offsetBy, brClosingBracketIndexesArr, state);
  }, true);
  console.log("704 LOOPING DONE: ".concat("\x1B[".concat(33, "m", "str", "\x1B[", 39, "m"), "=", JSON.stringify(str, null, 0), "\n---\n", "\x1B[".concat(33, "m", "rangesArr.current()", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(finalIndexesToDelete.current(), null, 4)));
  console.log("719 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. apply+wipe =================", "\x1B[", 39, "m")));
  applyAndWipe();
  str = str.replace(/(\r\n|\r|\n){3,}/g, "".concat(endOfLine).concat(endOfLine));
  console.log("729 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. widows =================", "\x1B[", 39, "m")));
  if (opts.removeWidows) {
    str = stringRemoveWidows.removeWidows(str, {
      ignore: "all",
      convertEntities: opts.convertEntities,
      targetLanguage: "html",
      UKPostcodes: true,
      hyphens: opts.convertDashes
    }).res;
  }
  console.log("747 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. linebreaks =================", "\x1B[", 39, "m")));
  console.log("\n\n\n");
  console.log("752 STEP#6 ".concat("\x1B[".concat(33, "m", "brClosingBracketIndexesArr", "\x1B[", 39, "m"), " = ", JSON.stringify(brClosingBracketIndexesArr, null, 4), "\n\n\n"));
  if (opts.removeLineBreaks) {
    str = str.replace(/\r\n|\r|\n/gm, " ");
  }
  console.log("768 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. collapse =================", "\x1B[", 39, "m")));
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: true
  });
  console.log("775 str after collapsing: ".concat(JSON.stringify(str, null, 0)));
  console.log("781 ".concat("\x1B[".concat(90, "m", "================= NEXT STEP. final =================", "\x1B[", 39, "m")));
  console.log("785 FINAL RESULT:\n".concat(JSON.stringify({
    res: rangesApply(str, finalIndexesToDelete.current())
  }, null, 4)));
  return {
    res: rangesApply(str, finalIndexesToDelete.current()),
    applicableOpts: applicableOpts
  };
}

exports.det = det;
exports.opts = defaultOpts;
exports.version = version;
