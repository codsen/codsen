/**
 * @name detergent
 * @fileoverview Extracts, cleans and encodes text
 * @version 7.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/detergent/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var stringLeftRight = require('string-left-right');
var stringFixBrokenNamedEntities = require('string-fix-broken-named-entities');
var stringRemoveWidows = require('string-remove-widows');
var rangesProcessOutside = require('ranges-process-outside');
var stringCollapseWhiteSpace = require('string-collapse-white-space');
var stringTrimSpacesOnly = require('string-trim-spaces-only');
var stringStripHtml = require('string-strip-html');
var rangesInvert = require('ranges-invert');
var rangesApply = require('ranges-apply');
var ansiRegex = require('ansi-regex');
var rangesPush = require('ranges-push');
var he = require('he');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var htmlEntitiesNotEmailFriendly = require('html-entities-not-email-friendly');
var allNamedHtmlEntities = require('all-named-html-entities');
var stringRangeExpander = require('string-range-expander');
var stringApostrophes = require('string-apostrophes');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var ansiRegex__default = /*#__PURE__*/_interopDefaultLegacy(ansiRegex);
var he__default = /*#__PURE__*/_interopDefaultLegacy(he);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);

var version$1 = "7.1.0";

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
  eol: "lf",
  stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
  stripHtmlAddNewLine: ["li", "/ul"],
  cb: null
};
var leftSingleQuote = "\u2018";
var rightSingleQuote = "\u2019";
var leftDoubleQuote = "\u201C";
var rightDoubleQuote = "\u201D";
var punctuationChars = [".", ",", ";", "!", "?"];
var rawNDash = "\u2013";
var rawMDash = "\u2014";
var rawNbsp = "\xA0";
var rawEllipsis = "\u2026";
var widowRegexTest = /. ./g;
var latinAndNonNonLatinRanges = [[0, 880], [887, 890], [894, 900], [906, 908], [908, 910], [929, 931], [1319, 1329], [1366, 1369], [1375, 1377], [1415, 1417], [1418, 1423], [1423, 1425], [1479, 1488], [1514, 1520], [1524, 1536], [1540, 1542], [1563, 1566], [1805, 1807], [1866, 1869], [1969, 1984], [2042, 2048], [2093, 2096], [2110, 2112], [2139, 2142], [2142, 2208], [2208, 2210], [2220, 2276], [2302, 2304], [2423, 2425], [2431, 2433], [2435, 2437], [2444, 2447], [2448, 2451], [2472, 2474], [2480, 2482], [2482, 2486], [2489, 2492], [2500, 2503], [2504, 2507], [2510, 2519], [2519, 2524], [2525, 2527], [2531, 2534], [2555, 2561], [2563, 2565], [2570, 2575], [2576, 2579], [2600, 2602], [2608, 2610], [2611, 2613], [2614, 2616], [2617, 2620], [2620, 2622], [2626, 2631], [2632, 2635], [2637, 2641], [2641, 2649], [2652, 2654], [2654, 2662], [2677, 2689], [2691, 2693], [2701, 2703], [2705, 2707], [2728, 2730], [2736, 2738], [2739, 2741], [2745, 2748], [2757, 2759], [2761, 2763], [2765, 2768], [2768, 2784], [2787, 2790], [2801, 2817], [2819, 2821], [2828, 2831], [2832, 2835], [2856, 2858], [2864, 2866], [2867, 2869], [2873, 2876], [2884, 2887], [2888, 2891], [2893, 2902], [2903, 2908], [2909, 2911], [2915, 2918], [2935, 2946], [2947, 2949], [2954, 2958], [2960, 2962], [2965, 2969], [2970, 2972], [2972, 2974], [2975, 2979], [2980, 2984], [2986, 2990], [3001, 3006], [3010, 3014], [3016, 3018], [3021, 3024], [3024, 3031], [3031, 3046], [3066, 3073], [3075, 3077], [3084, 3086], [3088, 3090], [3112, 3114], [3123, 3125], [3129, 3133], [3140, 3142], [3144, 3146], [3149, 3157], [3158, 3160], [3161, 3168], [3171, 3174], [3183, 3192], [3199, 3202], [3203, 3205], [3212, 3214], [3216, 3218], [3240, 3242], [3251, 3253], [3257, 3260], [3268, 3270], [3272, 3274], [3277, 3285], [3286, 3294], [3294, 3296], [3299, 3302], [3311, 3313], [3314, 3330], [3331, 3333], [3340, 3342], [3344, 3346], [3386, 3389], [3396, 3398], [3400, 3402], [3406, 3415], [3415, 3424], [3427, 3430], [3445, 3449], [3455, 3458], [3459, 3461], [3478, 3482], [3505, 3507], [3515, 3517], [3517, 3520], [3526, 3530], [3530, 3535], [3540, 3542], [3542, 3544], [3551, 3570], [3572, 3585], [3642, 3647], [3675, 3713], [3714, 3716], [3716, 3719], [3720, 3722], [3722, 3725], [3725, 3732], [3735, 3737], [3743, 3745], [3747, 3749], [3749, 3751], [3751, 3754], [3755, 3757], [3769, 3771], [3773, 3776], [3780, 3782], [3782, 3784], [3789, 3792], [3801, 3804], [3807, 3840], [3911, 3913], [3948, 3953], [3991, 3993], [4028, 4030], [4044, 4046], [4058, 4096], [4293, 4295], [4295, 4301], [4301, 4304], [4680, 4682], [4685, 4688], [4694, 4696], [4696, 4698], [4701, 4704], [4744, 4746], [4749, 4752], [4784, 4786], [4789, 4792], [4798, 4800], [4800, 4802], [4805, 4808], [4822, 4824], [4880, 4882], [4885, 4888], [4954, 4957], [4988, 4992], [5017, 5024], [5108, 5120], [5788, 5792], [5872, 5888], [5900, 5902], [5908, 5920], [5942, 5952], [5971, 5984], [5996, 5998], [6000, 6002], [6003, 6016], [6109, 6112], [6121, 6128], [6137, 6144], [6158, 6160], [6169, 6176], [6263, 6272], [6314, 7936], [7957, 7960], [7965, 7968], [8005, 8008], [8013, 8016], [8023, 8025], [8025, 8027], [8027, 8029], [8029, 8031], [8061, 8064], [8116, 8118], [8132, 8134], [8147, 8150], [8155, 8157], [8175, 8178], [8180, 8182], [8190, 11904], [11929, 11931], [12019, 12032], [12245, 12288], [12351, 12353], [12438, 12441], [12543, 12549], [12589, 12593], [12686, 12688], [12730, 12736], [12771, 12784], [12830, 12832], [13054, 13056], [13312, 19893], [19893, 19904], [40869, 40908], [40908, 40960], [42124, 42128], [42182, 42192], [42539, 42560], [42647, 42655], [42743, 42752], [42894, 42896], [42899, 42912], [42922, 43000], [43051, 43056], [43065, 43072], [43127, 43136], [43204, 43214], [43225, 43232], [43259, 43264], [43347, 43359], [43388, 43392], [43469, 43471], [43481, 43486], [43487, 43520], [43574, 43584], [43597, 43600], [43609, 43612], [43643, 43648], [43714, 43739], [43766, 43777], [43782, 43785], [43790, 43793], [43798, 43808], [43814, 43816], [43822, 43968], [44013, 44016], [44025, 44032], [55203, 55216], [55238, 55243], [55291, 63744], [64109, 64112], [64217, 64256], [64262, 64275], [64279, 64285], [64310, 64312], [64316, 64318], [64318, 64320], [64321, 64323], [64324, 64326], [64449, 64467], [64831, 64848], [64911, 64914], [64967, 65008], [65021, 65136], [65140, 65142], [65276, 66560], [66717, 66720], [66729, 67584], [67589, 67592], [67592, 67594], [67637, 67639], [67640, 67644], [67644, 67647], [67669, 67671], [67679, 67840], [67867, 67871], [67897, 67903], [67903, 67968], [68023, 68030], [68031, 68096], [68099, 68101], [68102, 68108], [68115, 68117], [68119, 68121], [68147, 68152], [68154, 68159], [68167, 68176], [68184, 68192], [68223, 68352], [68405, 68409], [68437, 68440], [68466, 68472], [68479, 68608], [68680, 69216], [69246, 69632], [69709, 69714], [69743, 69760], [69825, 69840], [69864, 69872], [69881, 69888], [69940, 69942], [69955, 70016], [70088, 70096], [70105, 71296], [71351, 71360], [71369, 73728], [74606, 74752], [74850, 74864], [74867, 77824], [78894, 92160], [92728, 93952], [94020, 94032], [94078, 94095], [94111, 110592], [110593, 131072], [131072, 173782], [173782, 173824], [173824, 177972], [177972, 177984], [177984, 178205], [178205, 194560]];
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
function doConvertEntities(inputString, dontEncodeNonLatin) {
  if (dontEncodeNonLatin) {
    return Array.from(inputString).map(function (_char) {
      if (_char.charCodeAt(0) < 880 || latinAndNonNonLatinRanges.some(function (rangeArr) {
        return _char.charCodeAt(0) > rangeArr[0] && _char.charCodeAt(0) < rangeArr[1];
      })) {
        return he__default['default'].encode(_char, {
          useNamedReferences: true
        });
      }
      return _char;
    }).join("");
  }
  return he__default['default'].encode(inputString, {
    useNamedReferences: true
  });
}
function isNumber(something) {
  return typeof something === "string" && something.charCodeAt(0) >= 48 && something.charCodeAt(0) <= 57 || Number.isInteger(something);
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
function removeTrailingSlash(str) {
  if (typeof str === "string" && str.length && str.endsWith("/")) {
    return str.slice(0, -1).trim();
  }
  return str;
}

function processCharacter(str, opts, rangesArr, i, y, offsetBy, brClosingBracketIndexesArr, state, applicableOpts, endOfLineVal) {
  var len = str.length;
  if (/[\uD800-\uDFFF]/g.test(str[i]) && !(str.charCodeAt(i + 1) >= 0xdc00 && str.charCodeAt(i + 1) <= 0xdfff || str.charCodeAt(i - 1) >= 0xd800 && str.charCodeAt(i - 1) <= 0xdbff)) {
    rangesArr.push(i, i + 1);
  } else if (y - i > 1) {
    applicableOpts.convertEntities = true;
    applicableOpts.dontEncodeNonLatin = applicableOpts.dontEncodeNonLatin || doConvertEntities(str.slice(i, y), true) !== doConvertEntities(str.slice(i, y), false);
    if (opts.convertEntities) {
      rangesArr.push(i, y, doConvertEntities(str.slice(i, y), opts.dontEncodeNonLatin));
    }
  } else {
    var charcode = str[i].charCodeAt(0);
    if (charcode < 127) {
      if (charcode < 32) {
        if (charcode < 9) {
          if (charcode === 3) {
            rangesArr.push(i, y, opts.removeLineBreaks ? " " : opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">\n") : "\n");
            applicableOpts.removeLineBreaks = true;
            if (!opts.removeLineBreaks) {
              applicableOpts.replaceLineBreaks = true;
              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
              }
            }
          } else {
            rangesArr.push(i, y);
          }
        } else if (charcode === 9) {
          rangesArr.push(i, y, " ");
        } else if (charcode === 10) {
          if (!applicableOpts.removeLineBreaks) {
            applicableOpts.removeLineBreaks = true;
          }
          if (!opts.removeLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
            return stringLeftRight.left(str, i) === idx;
          }))) {
            if (opts.replaceLineBreaks) {
              applicableOpts.useXHTML = true;
              applicableOpts.replaceLineBreaks = true;
            } else if (!opts.replaceLineBreaks) {
              applicableOpts.replaceLineBreaks = true;
            }
          }
          if (!opts.removeLineBreaks) {
            applicableOpts.eol = true;
          }
          if (opts.removeLineBreaks) {
            var whatToInsert = " ";
            if (punctuationChars.includes(str[stringLeftRight.right(str, i)])) {
              whatToInsert = "";
            }
            rangesArr.push(i, y, whatToInsert);
          } else if (opts.replaceLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
            return stringLeftRight.left(str, i) === idx;
          }))) {
            var startingIdx = i;
            if (str[i - 1] === " " && typeof stringLeftRight.leftStopAtNewLines(str, i) === "number") {
              startingIdx = stringLeftRight.leftStopAtNewLines(str, i) + 1;
            }
            rangesArr.push(startingIdx, i + (endOfLineVal === "\r" ? 1 : 0), "<br".concat(opts.useXHTML ? "/" : "", ">").concat(endOfLineVal === "\r\n" ? "\r" : "").concat(endOfLineVal === "\r" ? "\r" : ""));
          } else {
            if (str[stringLeftRight.leftStopAtNewLines(str, i)] && str[stringLeftRight.leftStopAtNewLines(str, i)].trim()) {
              var tempIdx = stringLeftRight.leftStopAtNewLines(str, i);
              if (typeof tempIdx === "number" && tempIdx < i - 1) {
                rangesArr.push(tempIdx + 1, i, "".concat(endOfLineVal === "\r\n" ? "\r" : ""));
              }
            }
            if (endOfLineVal === "\r\n" && str[i - 1] !== "\r") {
              rangesArr.push(i, i, "\r");
            } else if (endOfLineVal === "\r") {
              rangesArr.push(i, i + 1);
            }
            var temp = stringLeftRight.rightStopAtNewLines(str, i);
            if (temp && str[temp].trim()) {
              if (temp > i + 1) {
                rangesArr.push(i + 1, temp);
              }
            }
          }
          state.onUrlCurrently = false;
        } else if (charcode === 11 || charcode === 12) {
          applicableOpts.removeLineBreaks = true;
          rangesArr.push(i, y, opts.removeLineBreaks ? " " : "\n");
        } else if (charcode === 13) {
          if (!applicableOpts.removeLineBreaks) {
            applicableOpts.removeLineBreaks = true;
          }
          if (!opts.removeLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
            return stringLeftRight.left(str, i) === idx;
          }))) {
            if (opts.replaceLineBreaks && !opts.removeLineBreaks) {
              applicableOpts.useXHTML = true;
              applicableOpts.replaceLineBreaks = true;
            } else if (!opts.replaceLineBreaks) {
              applicableOpts.replaceLineBreaks = true;
            }
          }
          if (!opts.removeLineBreaks) {
            applicableOpts.eol = true;
          }
          if (opts.removeLineBreaks) {
            var _whatToInsert = " ";
            if (punctuationChars.includes(str[stringLeftRight.right(str, i)]) || ["\n", "\r"].includes(str[i + 1])) {
              _whatToInsert = "";
            }
            rangesArr.push(i, y, _whatToInsert);
          } else if (opts.replaceLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
            return stringLeftRight.left(str, i) === idx;
          }))) {
            var _startingIdx = i;
            if (str[i - 1] === " " && typeof stringLeftRight.leftStopAtNewLines(str, i) === "number") {
              _startingIdx = stringLeftRight.leftStopAtNewLines(str, i) + 1;
            }
            var endingIdx = i;
            var _whatToInsert2 = "";
            if (str[i + 1] !== "\n") {
              if (endOfLineVal === "\n") {
                _whatToInsert2 = "\n";
              } else if (endOfLineVal === "\r\n") {
                rangesArr.push(i + 1, i + 1, "\n");
              }
            }
            if (endOfLineVal === "\n") {
              endingIdx = i + 1;
            } else if (endOfLineVal === "\r" && str[i + 1] === "\n") {
              rangesArr.push(i + 1, i + 2);
            }
            rangesArr.push(_startingIdx, endingIdx, "<br".concat(opts.useXHTML ? "/" : "", ">").concat(_whatToInsert2));
            if (str[i + 1] === "\n") {
              offsetBy(1);
            }
          } else {
            if (endOfLineVal === "\n") {
              rangesArr.push(i, i + 1, str[i + 1] === "\n" ? "" : "\n");
            } else if (endOfLineVal === "\r" && str[i + 1] === "\n") {
              rangesArr.push(i + 1, i + 2);
            } else if (endOfLineVal === "\r\n" && str[i + 1] !== "\n") {
              rangesArr.push(i, i + 1, "\n");
            }
            var tempIdx1 = stringLeftRight.leftStopAtNewLines(str, i);
            if (typeof tempIdx1 === "number" && str[tempIdx1].trim()) {
              var _endingIdx = i;
              if (endOfLineVal === "\n") {
                _endingIdx = i + 1;
              }
              if (tempIdx1 < i - 1) {
                rangesArr.push(tempIdx1 + 1, _endingIdx, "".concat(str[i + 1] === "\n" ? "" : "\n"));
              }
            }
            var tempIdx2 = stringLeftRight.rightStopAtNewLines(str, i);
            if (tempIdx2 && str[tempIdx2].trim() && str[i + 1] !== "\n") {
              if (tempIdx2 > i + 1) {
                rangesArr.push(i + 1, tempIdx2);
              }
            }
          }
        } else if (charcode > 13) {
          rangesArr.push(i, y);
        }
      } else {
        if (charcode === 32) ; else if (charcode === 34) {
          applicableOpts.convertEntities = true;
          if (isNumber(stringLeftRight.left(str, i)) || isNumber(stringLeftRight.right(str, i))) {
            applicableOpts.convertApostrophes = true;
          }
          var tempRes = stringApostrophes.convertOne(str, {
            from: i,
            convertEntities: opts.convertEntities,
            convertApostrophes: opts.convertApostrophes,
            offsetBy: offsetBy
          });
          if (tempRes && tempRes.length) {
            rangesArr.push(tempRes);
          } else if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&quot;");
          }
        } else if (charcode === 38) {
          if (isLetter(str[i + 1])) {
            var _temp = Object.keys(allNamedHtmlEntities.allNamedEntities).find(function (entName) {
              return str.startsWith(entName, i + 1) && str[i + entName.length + 1] === ";";
            });
            applicableOpts.convertEntities = true;
            if (_temp) {
              if (_temp === "apos") {
                applicableOpts.convertApostrophes = true;
                var decodedTempRes = stringApostrophes.convertOne(str, {
                  from: i,
                  to: i + _temp.length + 2,
                  value: "'",
                  convertEntities: opts.convertEntities,
                  convertApostrophes: opts.convertApostrophes,
                  offsetBy: offsetBy
                });
                if (Array.isArray(decodedTempRes) && decodedTempRes.length) {
                  rangesArr.push(decodedTempRes);
                  offsetBy(_temp.length + 2);
                } else {
                  rangesArr.push([i, i + _temp.length + 2, "'"]);
                  offsetBy(_temp.length + 2);
                }
              } else if (opts.convertEntities && Object.keys(htmlEntitiesNotEmailFriendly.notEmailFriendly).includes(str.slice(i + 1, i + _temp.length + 1))) {
                rangesArr.push(i, i + _temp.length + 2, "&".concat(htmlEntitiesNotEmailFriendly.notEmailFriendly[str.slice(i + 1, i + _temp.length + 1)], ";"));
                offsetBy(_temp.length + 1);
              } else if (!opts.convertEntities) {
                rangesArr.push(i, i + _temp.length + 2, he__default['default'].decode("".concat(str.slice(i, i + _temp.length + 2))));
                offsetBy(_temp.length + 1);
              } else {
                offsetBy(_temp.length + 1);
              }
            } else if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&amp;");
            }
          } else if (str[stringLeftRight.right(str, i)] === "#") {
            for (var z = stringLeftRight.right(str, i); z < len; z++) {
              if (str[z].trim() && !isNumber(str[z]) && str[z] !== "#") {
                if (str[z] === ";") {
                  var _tempRes = he__default['default'].encode(he__default['default'].decode(str.slice(i, z + 1)), {
                    useNamedReferences: true
                  });
                  if (_tempRes) {
                    rangesArr.push(i, z + 1, _tempRes);
                  }
                  offsetBy(z + 1 - i);
                }
              }
            }
          } else {
            applicableOpts.convertEntities = true;
            if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&amp;");
            }
          }
        } else if (charcode === 39) {
          var _temp2 = stringApostrophes.convertOne(str, {
            from: i,
            convertEntities: true,
            convertApostrophes: true
          });
          if (_temp2 && _temp2.length) {
            applicableOpts.convertApostrophes = true;
            if (opts.convertApostrophes) {
              applicableOpts.convertEntities = true;
            }
            rangesArr.push(stringApostrophes.convertOne(str, {
              from: i,
              convertEntities: opts.convertEntities,
              convertApostrophes: opts.convertApostrophes,
              offsetBy: offsetBy
            }));
          }
        } else if (charcode === 44 || charcode === 59) {
          if (str[i - 1] && !str[i - 1].trim()) {
            var whatsOnTheLeft = stringLeftRight.left(str, i);
            if (typeof whatsOnTheLeft === "number" && whatsOnTheLeft < i - 1) {
              rangesArr.push(whatsOnTheLeft + 1, i);
            }
          }
          if (charcode === 44 && str[y] !== undefined && !state.onUrlCurrently && !isNumber(str[y]) && str[y].trim() && str[y] !== " " && str[y] !== "\n" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
            applicableOpts.addMissingSpaces = true;
            if (opts.addMissingSpaces) {
              rangesArr.push(y, y, " ");
            }
          }
          if (charcode === 59 && str[y] !== undefined && !state.onUrlCurrently && str[y].trim() && str[y] !== "&" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
            applicableOpts.addMissingSpaces = true;
            if (opts.addMissingSpaces) {
              rangesArr.push(y, y, " ");
            }
          }
        } else if (charcode === 45) {
          if (str[i - 1] === " " && str[y] === " " && isNumber(str[stringLeftRight.left(str, i)]) && isNumber(str[stringLeftRight.right(str, y)])) ;
          else if ((str[i - 1] === rawNbsp || str[i - 1] === " ") && str[y] !== "$" && str[y] !== "£" && str[y] !== "€" && str[y] !== "₽" && str[y] !== "0" && str[y] !== "1" && str[y] !== "2" && str[y] !== "3" && str[y] !== "4" && str[y] !== "5" && str[y] !== "6" && str[y] !== "7" && str[y] !== "8" && str[y] !== "9" && str[y] !== "-" && str[y] !== ">" && str[y] !== " ") {
              applicableOpts.addMissingSpaces = true;
              if (opts.addMissingSpaces) {
                rangesArr.push(y, y, " ");
              }
            } else if (str[i - 1] && str[y] && (isNumber(str[i - 1]) && isNumber(str[y]) || str[i - 1].toLowerCase() === "a" && str[y].toLowerCase() === "z")) {
              applicableOpts.convertDashes = true;
              if (opts.convertDashes) {
                applicableOpts.convertEntities = true;
                rangesArr.push(i, y, opts.convertEntities ? "&ndash;" : "\u2013");
              }
            } else if (str[i - 1] && str[y] && (!str[i - 1].trim() && !str[y].trim() || isLowercaseLetter(str[i - 1]) && str[y] === "'")) {
              applicableOpts.convertDashes = true;
              if (opts.convertDashes) {
                applicableOpts.convertEntities = true;
                rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
              }
            } else if (str[i - 1] && str[y] && isLetter(str[i - 1]) && isQuote(str[y])) {
              applicableOpts.convertDashes = true;
              if (opts.convertDashes) {
                applicableOpts.convertEntities = true;
                rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
              }
            }
          if (str[i - 2] && str[i - 2].trim() && !str[i - 1].trim() && !["\n", "\r"].includes(str[i - 1])) {
            applicableOpts.removeWidows = true;
            if (opts.removeWidows) {
              applicableOpts.convertEntities = true;
              rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
            }
          }
        } else if (charcode === 46) {
          if (str[i - 1] !== "." && str[y] === "." && str[y + 1] === "." && str[y + 2] !== ".") {
            applicableOpts.convertDotsToEllipsis = true;
            if (opts.convertDotsToEllipsis) {
              applicableOpts.convertEntities = true;
              rangesArr.push(i, y + 2, opts.convertEntities ? "&hellip;" : "".concat(rawEllipsis));
            }
          }
          var first = str[y] ? str[y].toLowerCase() : "";
          var second = str[y + 1] ? str[y + 1].toLowerCase() : "";
          var third = str[y + 2] ? str[y + 2].toLowerCase() : "";
          var fourth = str[y + 3] ? str[y + 3].toLowerCase() : "";
          var nextThreeChars = first + second + third;
          if (first + second !== "js" && nextThreeChars !== "jpg" && nextThreeChars !== "png" && nextThreeChars !== "gif" && nextThreeChars !== "svg" && nextThreeChars !== "htm" && nextThreeChars !== "pdf" && nextThreeChars !== "psd" && nextThreeChars !== "tar" && nextThreeChars !== "zip" && nextThreeChars !== "rar" && nextThreeChars !== "otf" && nextThreeChars !== "ttf" && nextThreeChars !== "eot" && nextThreeChars !== "php" && nextThreeChars !== "rss" && nextThreeChars !== "asp" && nextThreeChars !== "ppt" && nextThreeChars !== "doc" && nextThreeChars !== "txt" && nextThreeChars !== "rtf" && nextThreeChars !== "git" && nextThreeChars + fourth !== "jpeg" && nextThreeChars + fourth !== "html" && nextThreeChars + fourth !== "woff" && !(!isLetter(str[i - 2]) && str[i - 1] === "p" && str[y] === "s" && str[y + 1] === "t" && !isLetter(str[y + 2]))) {
            if (str[y] !== undefined && (
            !state.onUrlCurrently && isUppercaseLetter(str[y]) || state.onUrlCurrently && isLetter(str[y]) && isUppercaseLetter(str[y]) && isLetter(str[y + 1]) && isLowercaseLetter(str[y + 1])) && str[y] !== " " && str[y] !== "." && str[y] !== "\n") {
              applicableOpts.addMissingSpaces = true;
              if (opts.addMissingSpaces) {
                rangesArr.push(y, y, " ");
              }
            }
            if (str[i - 1] !== undefined && str[i - 1].trim() === "" && str[y] !== "." && (str[i - 2] === undefined || str[i - 2] !== ".")
            ) {
                for (y = i - 1; y--;) {
                  if (str[y].trim() !== "") {
                    rangesArr.push(y + 1, i);
                    break;
                  }
                }
              }
          }
        } else if (charcode === 47) ; else if (charcode === 58) {
          if (str[y - 1] && str[stringLeftRight.right(str, y - 1)] === "/" && str[stringLeftRight.right(str, stringLeftRight.right(str, y - 1))] === "/") {
            state.onUrlCurrently = true;
          }
        } else if (charcode === 60) {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&lt;");
          }
        } else if (charcode === 62) {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            rangesArr.push(i, i + 1, "&gt;");
          }
        } else if (charcode === 119) {
          if (str[y + 1] && str[y].toLowerCase() === "w" && str[y + 1].toLowerCase() === "w") {
            state.onUrlCurrently = true;
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
                break;
              }
            }
          }
        }
      }
    } else {
      if (charcode > 126 && charcode < 160) {
        if (charcode !== 133) {
          rangesArr.push(i, y);
        } else {
          applicableOpts.removeLineBreaks = true;
          rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
        }
      } else if (charcode === 160) {
        if (!opts.removeWidows) {
          var calculatedFrom = i;
          var calculatedTo = y;
          var calculatedValue = " ";
          var charOnTheLeft = stringLeftRight.left(str, i);
          var charOnTheRight = stringLeftRight.right(str, calculatedTo - 1);
          if (charOnTheLeft === null || charOnTheRight === null) {
            calculatedValue = opts.convertEntities ? "&nbsp;" : rawNbsp;
            applicableOpts.convertEntities = true;
          } else {
            applicableOpts.removeWidows = true;
          }
          if (calculatedValue) {
            rangesArr.push(calculatedFrom, calculatedTo, calculatedValue);
          } else {
            rangesArr.push(calculatedFrom, calculatedTo);
          }
        } else {
          applicableOpts.convertEntities = true;
          applicableOpts.removeWidows = true;
          if (opts.convertEntities) {
            rangesArr.push(i, y, "&nbsp;");
          }
        }
      } else if (charcode === 173) {
        rangesArr.push(i, y);
      } else if (charcode === 8232 || charcode === 8233) {
        applicableOpts.removeLineBreaks = true;
        rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
      } else if ([5760, 8191, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288].includes(charcode)) {
        if (!str[y]) {
          rangesArr.push(i, y);
        } else {
          var expandedRange = stringRangeExpander.expander({
            str: str,
            from: i,
            to: y,
            wipeAllWhitespaceOnLeft: true,
            wipeAllWhitespaceOnRight: true,
            addSingleSpaceToPreventAccidentalConcatenation: true
          });
          rangesArr.push.apply(rangesArr, _toConsumableArray__default['default'](expandedRange));
        }
      } else if (charcode === 8206) {
        rangesArr.push(i, y);
      } else if (charcode === 8207) {
        rangesArr.push(i, y);
      } else if (charcode === 8211 || charcode === 65533 && isNumber(str[i - 1]) && isNumber(str[y])) {
        applicableOpts.convertDashes = true;
        if (!opts.convertDashes) {
          rangesArr.push(i, y, "-");
        } else {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            if (str[i - 1] && !str[i - 1].trim() && str[i + 1] && !str[i + 1].trim() && !(isNumber(str[i - 2]) && isNumber(str[i + 2]))) {
              rangesArr.push(i, y, "&mdash;");
            } else {
              rangesArr.push(i, y, "&ndash;");
            }
          } else if (charcode === 65533) {
            if (str[i - 1] && !str[i - 1].trim() && str[i + 1] && !str[i + 1].trim()) {
              rangesArr.push(i, y, rawMDash);
            } else {
              rangesArr.push(i, y, rawNDash);
            }
          }
        }
        if (str[i - 1] && !str[i - 1].trim() && str[y].trim()) {
          if (str[i - 2] && isNumber(str[i - 2]) && isNumber(str[y])) {
            rangesArr.push(i - 1, i);
          } else {
            applicableOpts.addMissingSpaces = true;
            applicableOpts.convertEntities = true;
            if (opts.addMissingSpaces) {
              var whatToAdd = " ";
              if (!widowRegexTest.test(str.slice(y))) {
                applicableOpts.removeWidows = true;
                if (opts.removeWidows) {
                  whatToAdd = opts.convertEntities ? "&nbsp;" : rawNbsp;
                }
              }
              rangesArr.push(y, y, whatToAdd);
            }
            if (str.slice(i - 1, i) !== rawNbsp) {
              applicableOpts.removeWidows = true;
              if (opts.removeWidows) {
                rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
              }
            }
          }
        } else if (str[i - 2] && str[i - 1] && str[y] && str[y + 1] && isNumber(str[i - 2]) && isNumber(str[y + 1]) && !str[i - 1].trim() && !str[y].trim()) {
          rangesArr.push(i - 1, i);
          rangesArr.push(y, y + 1);
        }
        if (str[i - 2] && str[i + 1] && !str[i - 1].trim() && str[i - 2].trim() && !str[i + 1].trim() && !(isNumber(str[i - 2]) && isNumber(str[i + 2]))) {
          applicableOpts.removeWidows = true;
          if (opts.removeWidows) {
            rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
          }
        }
      } else if (charcode === 8212 || charcode === 65533 && str[i - 1] === " " && str[y] === " ") {
        applicableOpts.convertDashes = true;
        if (str[i - 1] === " " && stringLeftRight.left(str, i) !== null) {
          applicableOpts.removeWidows = true;
          if (opts.removeWidows) {
            applicableOpts.convertEntities = true;
            if (typeof stringLeftRight.left(str, i) === "number") {
              rangesArr.push(stringLeftRight.left(str, i) + 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp);
            }
          }
        }
        if (!opts.convertDashes) {
          rangesArr.push(i, y, "-");
        } else {
          applicableOpts.convertEntities = true;
          if (str[i - 1] && !str[i - 1].trim() && str[y].trim()) {
            applicableOpts.addMissingSpaces = true;
            if (opts.addMissingSpaces) {
              rangesArr.push(y, y, " ");
            }
          }
          if (opts.convertEntities) {
            rangesArr.push(i, y, "&mdash;");
          } else if (charcode === 65533) {
            rangesArr.push(i, y, rawMDash);
          }
        }
      } else if (charcode === 8216) {
        var _tempRes2 = stringApostrophes.convertOne(str, {
          from: i,
          to: y,
          convertEntities: true,
          convertApostrophes: true
        });
        if (_tempRes2 && _tempRes2.length) {
          applicableOpts.convertApostrophes = true;
          var tempRes2 = stringApostrophes.convertOne(str, {
            from: i,
            to: y,
            convertEntities: true,
            convertApostrophes: true
          });
          if (tempRes2) {
            if (opts.convertApostrophes) {
              applicableOpts.convertEntities = true;
            }
            rangesArr.push(stringApostrophes.convertOne(str, {
              from: i,
              to: y,
              convertEntities: opts.convertEntities,
              convertApostrophes: opts.convertApostrophes,
              offsetBy: offsetBy
            }));
          }
        }
      } else if (charcode === 8217) {
        applicableOpts.convertApostrophes = true;
        if (!opts.convertApostrophes) {
          rangesArr.push(i, y, "'");
        } else {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            rangesArr.push(i, y, "&rsquo;");
          }
        }
      } else if (charcode === 8220) {
        applicableOpts.convertApostrophes = true;
        if (!opts.convertApostrophes) {
          applicableOpts.convertEntities = true;
          rangesArr.push(i, y, opts.convertEntities ? "&quot;" : "\"");
        } else if (opts.convertEntities) {
          applicableOpts.convertEntities = true;
          rangesArr.push(i, y, "&ldquo;");
        }
      } else if (charcode === 8221) {
        applicableOpts.convertApostrophes = true;
        if (!opts.convertApostrophes) {
          applicableOpts.convertEntities = true;
          rangesArr.push(i, y, opts.convertEntities ? "&quot;" : "\"");
        } else if (opts.convertEntities) {
          applicableOpts.convertEntities = true;
          rangesArr.push(i, y, "&rdquo;");
        }
      } else if (charcode === 8230) {
        applicableOpts.convertDotsToEllipsis = true;
        if (!opts.convertDotsToEllipsis) {
          rangesArr.push(i, y, "...");
        } else {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            rangesArr.push(i, y, "&hellip;");
          }
        }
      } else if (charcode === 65279) {
        rangesArr.push(i, y);
      } else {
        if (!applicableOpts.dontEncodeNonLatin && doConvertEntities(str[i], true) !== doConvertEntities(str[i], false)) {
          applicableOpts.dontEncodeNonLatin = true;
        }
        var convertedCharVal = doConvertEntities(str[i], opts.dontEncodeNonLatin);
        if (Object.keys(htmlEntitiesNotEmailFriendly.notEmailFriendly).includes(convertedCharVal.slice(1, convertedCharVal.length - 1))) {
          convertedCharVal = "&".concat(htmlEntitiesNotEmailFriendly.notEmailFriendly[convertedCharVal.slice(1, convertedCharVal.length - 1)], ";");
        }
        if (str[i] !== convertedCharVal) {
          applicableOpts.convertEntities = true;
          if (opts.convertEntities) {
            if (convertedCharVal === "&mldr;") {
              rangesArr.push(i, y, "&hellip;");
            } else if (convertedCharVal !== "&apos;") {
              rangesArr.push(i, y, convertedCharVal);
            }
            applicableOpts.convertEntities = true;
          }
        }
      }
    }
    if (state.onUrlCurrently && !str[i].trim()) {
      state.onUrlCurrently = false;
    }
  }
}

var version = version$1;
function det(str, inputOpts) {
  if (typeof str !== "string") {
    throw new Error("detergent(): [THROW_ID_01] the first input argument must be of a string type, not ".concat(_typeof__default['default'](str)));
  }
  if (inputOpts && _typeof__default['default'](inputOpts) !== "object") {
    throw new Error("detergent(): [THROW_ID_02] Options object must be a plain object, not ".concat(_typeof__default['default'](inputOpts)));
  }
  if (inputOpts && inputOpts.cb && typeof inputOpts.cb !== "function") {
    throw new Error("detergent(): [THROW_ID_03] Options callback, opts.cb must be a function, not ".concat(_typeof__default['default'](inputOpts.cb), " (value was given as:\n").concat(JSON.stringify(inputOpts.cb, null, 0), ")"));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaultOpts), inputOpts);
  if (!["lf", "crlf", "cr"].includes(opts.eol)) {
    opts.eol = "lf";
  }
  var applicableOpts = {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false,
    eol: false
  };
  var endOfLineVal = "\n";
  if (opts.eol === "crlf") {
    endOfLineVal = "\r\n";
  } else if (opts.eol === "cr") {
    endOfLineVal = "\r";
  }
  var brClosingBracketIndexesArr = [];
  var finalIndexesToDelete = new rangesPush.Ranges({
    limitToBeAddedWhitespace: false
  });
  var skipArr = new rangesPush.Ranges();
  function applyAndWipe() {
    str = rangesApply.rApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }
  function isNum(something) {
    return Number.isInteger(something);
  }
  var state = {
    onUrlCurrently: false
  };
  str = stringTrimSpacesOnly.trimSpaces(str.replace(ansiRegex__default['default'](), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false
  }).res;
  var temp = str;
  var lastVal;
  do {
    lastVal = temp;
    temp = he__default['default'].decode(temp);
  } while (temp !== str && lastVal !== temp);
  if (str !== temp) {
    str = temp;
  }
  str = stringCollapseWhiteSpace.collapse(str, {
    trimLines: true,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1
  }).result;
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      if (str[i - 1] && str[i + 1] && (str[i - 1].toLowerCase() === "n" && str[i + 1].toLowerCase() === "t" || isLetter(str[i - 1]) && str[i + 1].toLowerCase() === "s") || str[i + 2] && ((str[i + 1].toLowerCase() === "r" || str[i + 1].toLowerCase() === "v") && str[i + 2].toLowerCase() === "e" || str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l") && (str[i - 3] && str[i - 3].toLowerCase() === "y" && str[i - 2].toLowerCase() === "o" && str[i - 1].toLowerCase() === "u" || str[i - 2] && str[i - 2].toLowerCase() === "w" && str[i - 1].toLowerCase() === "e" || str[i - 4] && str[i - 4].toLowerCase() === "t" && str[i - 3].toLowerCase() === "h" && str[i - 2].toLowerCase() === "e" && str[i - 1].toLowerCase() === "y") || (str[i - 1] && str[i - 1].toLowerCase() === "i" || str[i - 2] && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e" || str[i - 3] && str[i - 3].toLowerCase() === "s" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e") && str[i + 2] && str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l" || str[i - 5] && str[i + 2] && str[i - 5].toLowerCase() === "m" && str[i - 4].toLowerCase() === "i" && str[i - 3].toLowerCase() === "g" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "t" && str[i + 1] === "v" && str[i + 2] === "e" || str[i - 1] && str[i - 1].toLowerCase() === "s" && (!str[i + 1] || !isLetter(str[i + 1]) && !isNumber(str[i + 1]))) {
        var replacement = opts.convertApostrophes ? rightSingleQuote : "'";
        finalIndexesToDelete.push(i, i + 1, "".concat(replacement));
        applicableOpts.convertApostrophes = true;
      } else if (str[i - 2] && isLowercaseLetter(str[i - 2]) && !str[i - 1].trim() && str[i + 2] && isLowercaseLetter(str[i + 2]) && !str[i + 1].trim()) {
        finalIndexesToDelete.push(i, i + 1, rawMDash);
      } else {
        finalIndexesToDelete.push(i, i + 1);
      }
    }
  }
  applyAndWipe();
  var entityFixes = stringFixBrokenNamedEntities.fixEnt(str, {
    decode: false
  });
  if (entityFixes && entityFixes.length) {
    applicableOpts.fixBrokenEntities = true;
    if (opts.fixBrokenEntities) {
      str = rangesApply.rApply(str, entityFixes);
    }
  }
  if (typeof opts.cb === "function") {
    if (str.includes("<") || str.includes(">")) {
      var calcRanges = stringStripHtml.stripHtml(str, {
        cb: function cb(_ref) {
          var tag = _ref.tag,
              rangesArr = _ref.rangesArr;
          return rangesArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1);
        },
        skipHtmlDecoding: true
      }).ranges;
      var outsideTagRanges = (rangesInvert.rInvert(calcRanges, str.length) || []).reduce(function (accumRanges, currRange) {
        if (typeof opts.cb === "function" && str.slice(currRange[0], currRange[1]) !== opts.cb(str.slice(currRange[0], currRange[1]))) {
          return accumRanges.concat([[currRange[0], currRange[1], opts.cb(str.slice(currRange[0], currRange[1]))]]);
        }
        return accumRanges;
      }, []);
      if (Array.isArray(outsideTagRanges) && outsideTagRanges.length) {
        str = rangesApply.rApply(str, outsideTagRanges);
      }
    } else {
      str = opts.cb(str);
    }
  }
  if (str.includes("<") || str.includes(">")) {
    var cb = function cb(_ref2) {
      var tag = _ref2.tag,
          deleteFrom = _ref2.deleteFrom,
          deleteTo = _ref2.deleteTo,
          proposedReturn = _ref2.proposedReturn;
      if (isNum(tag.lastOpeningBracketAt) && isNum(tag.lastClosingBracketAt) && tag.lastOpeningBracketAt < tag.lastClosingBracketAt || tag.slashPresent) {
        applicableOpts.stripHtml = true;
        skipArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length);
        if (opts.stripHtml && !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase())) {
          if (Array.isArray(opts.stripHtmlAddNewLine) && opts.stripHtmlAddNewLine.length && opts.stripHtmlAddNewLine.some(function (tagName) {
            return tagName.startsWith("/") &&
            tag.slashPresent &&
            tag.slashPresent < tag.nameEnds && tag.name.toLowerCase() === tagName.slice(1) || !tagName.startsWith("/") && !(
            tag.slashPresent &&
            tag.slashPresent < tag.nameEnds) && tag.name.toLowerCase() === removeTrailingSlash(tagName);
          })) {
            applicableOpts.removeLineBreaks = true;
            if (!opts.removeLineBreaks && typeof deleteFrom === "number" && typeof deleteTo === "number") {
              applicableOpts.replaceLineBreaks = true;
              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
              }
              finalIndexesToDelete.push(deleteFrom, deleteTo, "".concat(opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">") : "", "\n"));
            } else {
              finalIndexesToDelete.push(proposedReturn);
            }
          } else {
            finalIndexesToDelete.push(proposedReturn);
            skipArr.push(proposedReturn);
          }
        } else {
          if (voidTags.includes(tag.name.toLowerCase())) {
            applicableOpts.useXHTML = true;
            if (str[stringLeftRight.left(str, tag.lastClosingBracketAt)] !== "/" && tag.lastClosingBracketAt) {
              if (opts.useXHTML) {
                finalIndexesToDelete.push(tag.lastClosingBracketAt, tag.lastClosingBracketAt, "/");
              }
            }
            if (tag.slashPresent && isNum(tag.lastOpeningBracketAt) && tag.nameStarts && tag.lastOpeningBracketAt < tag.nameStarts - 1 && str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).split("").every(function (_char) {
              return !_char.trim() || _char === "/";
            })) {
              finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts);
            }
            if (tag.slashPresent && str[stringLeftRight.left(str, tag.lastClosingBracketAt)] === "/") {
              if (str[stringLeftRight.left(str, stringLeftRight.left(str, tag.lastClosingBracketAt))] === "/") {
                applicableOpts.useXHTML = true;
                if (!opts.useXHTML || typeof stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                  mode: 2
                }, "/") === "number" && str.slice(stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                  mode: 2
                }, "/"), tag.lastClosingBracketAt) !== "/") {
                  finalIndexesToDelete.push(
                  stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                    mode: 2
                  }, "/"), tag.lastClosingBracketAt, opts.useXHTML ? "/" : undefined);
                }
              } else if (!opts.useXHTML || typeof stringLeftRight.left(str, tag.slashPresent) !== "number" || str.slice(stringLeftRight.left(str, tag.slashPresent) + 1, tag.lastClosingBracketAt) !== "/") {
                var calculatedFrom = stringLeftRight.left(str, tag.slashPresent) + 1;
                var calculatedTo = tag.lastClosingBracketAt;
                var whatToInsert = opts.useXHTML ? "/" : null;
                if (whatToInsert) {
                  finalIndexesToDelete.push(calculatedFrom, calculatedTo, whatToInsert);
                } else {
                  finalIndexesToDelete.push(calculatedFrom, calculatedTo);
                }
              }
            }
          }
          else if (tag.slashPresent && str[stringLeftRight.left(str, tag.lastClosingBracketAt)] === "/") {
              finalIndexesToDelete.push(stringLeftRight.chompLeft(str, tag.lastClosingBracketAt, {
                mode: 2
              }, "/"), tag.lastClosingBracketAt);
              finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.lastOpeningBracketAt + 1, "/");
            }
          if (tag.name.toLowerCase() !== tag.name) {
            finalIndexesToDelete.push(tag.nameStarts, tag.nameEnds, tag.name.toLowerCase());
          }
          if ("/>".includes(str[stringLeftRight.right(str, tag.nameEnds - 1)]) && (stringLeftRight.right(str, tag.nameEnds - 1) || 0) > tag.nameEnds) {
            finalIndexesToDelete.push(tag.nameEnds, stringLeftRight.right(str, tag.nameEnds - 1));
          }
          if (isNum(tag.lastOpeningBracketAt) && isNum(tag.nameStarts) && tag.lastOpeningBracketAt + 1 < tag.nameStarts) {
            if (!str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).trim().length) {
              finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts);
            } else if (!voidTags.includes(tag.name.toLowerCase()) && str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).split("").every(function (_char2) {
              return !_char2.trim() || _char2 === "/";
            })) {
              finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts, "/");
            }
          }
        }
        if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
        }
        if (["ul", "li"].includes(tag.name.toLowerCase()) && !opts.removeLineBreaks && str[tag.lastOpeningBracketAt - 1] && !str[tag.lastOpeningBracketAt - 1].trim() && typeof tag.lastOpeningBracketAt === "number" && typeof stringLeftRight.leftStopAtNewLines(str, tag.lastOpeningBracketAt) === "number") {
          finalIndexesToDelete.push(stringLeftRight.leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1, tag.lastOpeningBracketAt);
        }
        if (str[tag.lastClosingBracketAt - 1] && !str[tag.lastClosingBracketAt - 1].trim() && typeof tag.lastClosingBracketAt === "number" && typeof stringLeftRight.left(str, tag.lastClosingBracketAt) === "number") {
          finalIndexesToDelete.push(stringLeftRight.left(str, tag.lastClosingBracketAt) + 1, tag.lastClosingBracketAt);
        }
      }
    };
    stringStripHtml.stripHtml(str, {
      cb: cb,
      trimOnlySpaces: true,
      ignoreTags: opts.stripHtml ? opts.stripHtmlButIgnoreTags : [],
      skipHtmlDecoding: true
    });
  }
  rangesProcessOutside.rProcessOutside(str, skipArr.current(), function (idxFrom, idxTo, offsetBy) {
    return processCharacter(str, opts, finalIndexesToDelete, idxFrom, idxTo, offsetBy, brClosingBracketIndexesArr, state, applicableOpts, endOfLineVal);
  }, true);
  applyAndWipe();
  str = str.replace(/ (<br[/]?>)/g, "$1");
  str = str.replace(/(\r\n|\r|\n){3,}/g, "".concat(endOfLineVal).concat(endOfLineVal));
  var widowFixes = stringRemoveWidows.removeWidows(str, {
    ignore: "all",
    convertEntities: opts.convertEntities,
    targetLanguage: "html",
    UKPostcodes: true,
    hyphens: opts.convertDashes,
    tagRanges: skipArr.current()
  });
  if (widowFixes && widowFixes.ranges && widowFixes.ranges.length) {
    if (!applicableOpts.removeWidows && widowFixes.whatWasDone.removeWidows) {
      applicableOpts.removeWidows = true;
      if (opts.removeWidows) {
        applicableOpts.convertEntities = true;
      }
    }
    if (!applicableOpts.convertEntities && widowFixes.whatWasDone.convertEntities) {
      applicableOpts.convertEntities = true;
    }
    if (opts.removeWidows) {
      str = widowFixes.res;
    }
  }
  if (str !== str.replace(/\r\n|\r|\n/gm, " ")) {
    applicableOpts.removeLineBreaks = true;
    if (opts.removeLineBreaks) {
      str = str.replace(/\r\n|\r|\n/gm, " ");
    }
  }
  str = stringCollapseWhiteSpace.collapse(str, {
    trimLines: true
  }).result;
  rangesApply.rApply(str, finalIndexesToDelete.current()).split("").forEach(function (key, idx) {
  });
  return {
    res: rangesApply.rApply(str, finalIndexesToDelete.current()),
    applicableOpts: applicableOpts
  };
}

exports.det = det;
exports.opts = defaultOpts;
exports.version = version;
