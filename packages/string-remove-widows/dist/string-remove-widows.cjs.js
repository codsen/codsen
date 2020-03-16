/**
 * string-remove-widows
 * Helps to prevent widow words in a text
 * Version: 1.5.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringMatchLeftRight = require('string-match-left-right');
var arrayiffyIfStr = _interopDefault(require('arrayiffy-if-string'));
var stringLeftRight = require('string-left-right');
var isObj = _interopDefault(require('lodash.isplainobject'));
var Ranges = _interopDefault(require('ranges-push'));
var apply = _interopDefault(require('ranges-apply'));

function _typeof(obj) {
  "@babel/helpers - typeof";

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

var version = "1.5.14";

var rawnbsp = "\xA0";
var encodedNbspHtml = "&nbsp;";
var encodedNbspCss = "\\00A0";
var encodedNbspJs = "\\u00A0";
var rawNdash = "\u2013";
var encodedNdashHtml = "&ndash;";
var encodedNdashCss = "\\2013";
var encodedNdashJs = "\\u2013";
var rawMdash = "\u2014";
var encodedMdashHtml = "&mdash;";
var encodedMdashCss = "\\2014";
var encodedMdashJs = "\\u2014";
var headsAndTailsJinja = [{
  heads: "{{",
  tails: "}}"
}, {
  heads: ["{% if", "{%- if"],
  tails: ["{% endif", "{%- endif"]
}, {
  heads: ["{% for", "{%- for"],
  tails: ["{% endfor", "{%- endfor"]
}, {
  heads: ["{%", "{%-"],
  tails: ["%}", "-%}"]
}, {
  heads: "{#",
  tails: "#}"
}];
var headsAndTailsHugo = [{
  heads: "{{",
  tails: "}}"
}];
var headsAndTailsHexo = [{
  heads: ["<%", "<%=", "<%-"],
  tails: ["%>", "=%>", "-%>"]
}];
var knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];

var defaultOpts = {
  removeWidowPreventionMeasures: false,
  convertEntities: true,
  targetLanguage: "html",
  UKPostcodes: false,
  hyphens: true,
  minWordCount: 4,
  minCharCount: 5,
  ignore: [],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagRanges: []
};
function removeWidows(str, originalOpts) {
  function push(finalStart, finalEnd) {
    var finalWhatToInsert = rawnbsp;
    if (opts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (opts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;
      if (isStr(opts.targetLanguage)) {
        if (opts.targetLanguage.trim().toLowerCase() === "css") {
          finalWhatToInsert = encodedNbspCss;
        } else if (opts.targetLanguage.trim().toLowerCase() === "js") {
          finalWhatToInsert = encodedNbspJs;
        }
      }
    }
    if (str.slice(finalStart, finalEnd) !== finalWhatToInsert) {
      rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
    }
  }
  function isStr(something) {
    return typeof something === "string";
  }
  var start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var isArr = Array.isArray;
  var len = str.length;
  var rangesArr = new Ranges({
    mergeType: 2
  });
  var punctuationCharsToConsiderWidowIssue = ["."];
  var postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  var postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  var leavePercForLastStage = 0.06;
  var currentPercentageDone;
  var lastPercentage = 0;
  var wordCount;
  var charCount;
  var secondToLastWhitespaceStartedAt;
  var secondToLastWhitespaceEndedAt;
  var lastWhitespaceStartedAt;
  var lastWhitespaceEndedAt;
  var lastEncodedNbspStartedAt;
  var lastEncodedNbspEndedAt;
  var doNothingUntil;
  var bumpWordCountAt;
  var opts = Object.assign({}, defaultOpts, originalOpts);
  var whatWasDone = {
    removeWidows: false,
    convertEntities: false
  };
  if (opts.dashes) {
    opts.hyphens = true;
    delete opts.dashes;
  }
  if (!opts.ignore || !isArr(opts.ignore) && !isStr(opts.ignore)) {
    opts.ignore = [];
  } else {
    opts.ignore = arrayiffyIfStr(opts.ignore);
    if (opts.ignore.includes("all")) {
      opts.ignore = opts.ignore.concat(headsAndTailsJinja.concat(headsAndTailsHexo));
    } else if (opts.ignore.some(function (val) {
      return isStr(val);
    })) {
      var temp = [];
      opts.ignore = opts.ignore.filter(function (val) {
        if (isStr(val) && val.length) {
          if (["nunjucks", "jinja", "liquid"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsJinja);
          } else if (["hugo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHugo);
          } else if (["hexo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHexo);
          }
          return false;
        } else if (_typeof(val) === "object") {
          return true;
        }
      });
      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }
  var ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }
  function resetAll() {
    wordCount = 0;
    charCount = 0;
    secondToLastWhitespaceStartedAt = undefined;
    secondToLastWhitespaceEndedAt = undefined;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
  }
  resetAll();
  var _loop = function _loop(_i) {
    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      opts.ignore.some(function (valObj, y) {
        if (isArr(valObj.heads) && valObj.heads.some(function (oneOfHeads) {
          return str.startsWith(oneOfHeads, _i);
        }) || isStr(valObj.heads) && str.startsWith(valObj.heads, _i)) {
          wordCount++;
          doNothingUntil = opts.ignore[y].tails;
          i = _i;
          return true;
        }
      });
    }
    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === _i) {
      wordCount++;
      bumpWordCountAt = undefined;
    }
    if (typeof opts.reportProgressFunc === "function") {
      currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * ceil);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    }
    if (!doNothingUntil && _i && str[_i] && str[_i].trim().length && (!str[_i - 1] || str[_i - 1] && !str[_i - 1].trim().length)) {
      lastWhitespaceEndedAt = _i;
    }
    if (!doNothingUntil && str[_i] && str[_i].trim().length) {
      charCount++;
    }
    if (!doNothingUntil && opts.hyphens && (str[_i] === "-" || str[_i] === rawMdash || str[_i] === rawNdash || str.slice(_i).startsWith(encodedNdashHtml) || str.slice(_i).startsWith(encodedNdashCss) || str.slice(_i).startsWith(encodedNdashJs) || str.slice(_i).startsWith(encodedMdashHtml) || str.slice(_i).startsWith(encodedMdashCss) || str.slice(_i).startsWith(encodedMdashJs)) && str[_i + 1] && (!str[_i + 1].trim().length || str[_i] === "&")) {
      if (str[_i - 1] && !str[_i - 1].trim().length && str[stringLeftRight.left(str, _i)]) {
        push(stringLeftRight.left(str, _i) + 1, _i);
        whatWasDone.removeWidows = true;
      }
    }
    if (!doNothingUntil && (str[_i] === "&" && str[_i + 1] === "n" && str[_i + 2] === "b" && str[_i + 3] === "s" && str[_i + 4] === "p" && str[_i + 5] === ";" || str[_i] === "&" && str[_i + 1] === "#" && str[_i + 2] === "1" && str[_i + 3] === "6" && str[_i + 4] === "0" && str[_i + 5] === ";")) {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6;
      if (str[_i + 6] && str[_i + 6].trim().length) {
        bumpWordCountAt = _i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    }
    if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] === "0" && str[_i + 2] === "0" && str[_i + 3] && str[_i + 3].toUpperCase() === "A" && str[_i + 4] === "0") {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 5;
      if (str[_i + 5] && str[_i + 5].trim().length) {
        bumpWordCountAt = _i + 5;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 5, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    }
    if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] && str[_i + 1].toLowerCase() === "u" && str[_i + 2] === "0" && str[_i + 3] === "0" && str[_i + 4] && str[_i + 4].toUpperCase() === "A" && str[_i + 5] === "0") {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6;
      if (str[_i + 6] && str[_i + 6].trim().length) {
        bumpWordCountAt = _i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
      }
    }
    if (!doNothingUntil && str[_i] === rawnbsp) {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 1;
      if (str[_i + 2] && str[_i + 2].trim().length) {
        bumpWordCountAt = _i + 2;
      }
      if (opts.convertEntities) {
        rangesArr.push(_i, _i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
      }
    }
    if (!doNothingUntil && str[_i] && str[_i].trim().length && (!str[_i - 1] || !str[_i - 1].trim().length)) {
      wordCount++;
    }
    if (!doNothingUntil && (!str[_i] || "\r\n".includes(str[_i]) || (str[_i] === "\n" || str[_i] === "\r" || str[_i] === "\r" && str[_i + 1] === "\n") && str[_i - 1] && punctuationCharsToConsiderWidowIssue.includes(str[stringLeftRight.left(str, _i)]))
    ) {
        if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
          var finalStart;
          var finalEnd;
          if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined && lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
            if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
              finalStart = lastWhitespaceStartedAt;
              finalEnd = lastWhitespaceEndedAt;
            } else {
              finalStart = lastEncodedNbspStartedAt;
              finalEnd = lastEncodedNbspEndedAt;
            }
          } else if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined) {
            finalStart = lastWhitespaceStartedAt;
            finalEnd = lastWhitespaceEndedAt;
          } else if (lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
            finalStart = lastEncodedNbspStartedAt;
            finalEnd = lastEncodedNbspEndedAt;
          }
          if (!(finalStart && finalEnd) && secondToLastWhitespaceStartedAt && secondToLastWhitespaceEndedAt) {
            finalStart = secondToLastWhitespaceStartedAt;
            finalEnd = secondToLastWhitespaceEndedAt;
          }
          if (finalStart && finalEnd) {
            push(finalStart, finalEnd);
            whatWasDone.removeWidows = true;
          }
        }
        resetAll();
      }
    if (opts.UKPostcodes && str[_i] && !str[_i].trim().length && str[_i - 1] && str[_i - 1].trim().length && postcodeRegexFront.test(str.slice(0, _i)) && str[stringLeftRight.right(str, _i)] && postcodeRegexEnd.test(str.slice(stringLeftRight.right(str, _i)))) {
      push(_i, stringLeftRight.right(str, _i));
      whatWasDone.removeWidows = true;
    }
    if (!doNothingUntil && str[_i] && !str[_i].trim().length && str[_i - 1] && str[_i - 1].trim().length && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim().length) && !"/>".includes(str[stringLeftRight.right(str, _i)]) && !str.slice(0, stringLeftRight.left(str, _i) + 1).endsWith("br") && !str.slice(0, stringLeftRight.left(str, _i) + 1).endsWith("hr") && !(str[stringLeftRight.left(str, _i)] === "<" && knownHTMLTags.some(function (tag) {
      return str.startsWith(tag, stringLeftRight.right(str, _i));
    }))) {
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
      lastWhitespaceStartedAt = _i;
      lastWhitespaceEndedAt = undefined;
      if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
      }
    }
    var tempTailFinding = void 0;
    if (doNothingUntil) {
      if (isStr(doNothingUntil) && (!doNothingUntil.length || str.startsWith(doNothingUntil, _i))) {
        doNothingUntil = undefined;
      } else if (isArr(doNothingUntil) && (!doNothingUntil.length || doNothingUntil.some(function (val) {
        if (str.startsWith(val, _i)) {
          tempTailFinding = val;
          i = _i;
          return true;
        }
      }))) {
        doNothingUntil = undefined;
        _i += tempTailFinding.length;
        if (isArr(opts.ignore) && opts.ignore.length && str[_i + 1]) {
          opts.ignore.some(function (oneOfHeadsTailsObjs) {
            i = _i;
            return stringMatchLeftRight.matchRightIncl(str, _i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: function cb(_char, theRemainderOfTheString, index) {
                if (index) {
                  _i = index - 1;
                  if (str[_i + 1] && str[_i + 1].trim().length) {
                    wordCount++;
                  }
                }
                i = _i;
                return true;
              }
            });
          });
        }
      }
    }
    if (str[_i] && "\r\n".includes(str[_i])) {
      wordCount = 0;
      charCount = 0;
    }
    if (isArr(opts.tagRanges) && opts.tagRanges.length && opts.tagRanges.some(function (rangeArr) {
      if (_i >= rangeArr[0] && _i <= rangeArr[1] && rangeArr[1] - 1 > _i) {
        _i = rangeArr[1] - 1;
        i = _i;
        return true;
      }
    })) ;
    i = _i;
  };
  for (var i = 0; i <= len; i++) {
    _loop(i);
  }
  return {
    res: apply(str, rangesArr.current(), opts.reportProgressFunc ? function (incomingPerc) {
      currentPercentageDone = Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * (1 - leavePercForLastStage) + incomingPerc / 100 * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    } : null),
    ranges: rangesArr.current(),
    log: {
      timeTakenInMiliseconds: Date.now() - start
    },
    whatWasDone: whatWasDone
  };
}

exports.defaultOpts = defaultOpts;
exports.removeWidows = removeWidows;
exports.version = version;
