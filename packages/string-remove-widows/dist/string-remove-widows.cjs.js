/**
 * string-remove-widows
 * Helps to prevent widow words in a text
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-widows/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var stringLeftRight = require('string-left-right');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "2.0.5";

// consts
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
var knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]; // finally,

var version$1 = version;
var defaults = {
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

function removeWidows(str, originalOpts) { // track time taken

  var start = Date.now(); // insurance:

  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as \"" + typeof str + "\", equal to:\n" + JSON.stringify(str, null, 4));
    }
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type " + typeof originalOpts + ", equal to " + JSON.stringify(originalOpts, null, 4));
  } // consts


  var isArr = Array.isArray;
  var len = str.length;
  var rangesArr = new rangesPush.Ranges({
    mergeType: 2
  });
  var punctuationCharsToConsiderWidowIssue = ["."];
  var postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  var postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  var leavePercForLastStage = 0.06; // in range of [0, 1]
  // vars

  var currentPercentageDone;
  var lastPercentage = 0;
  var wordCount = 0; // counted per-chunk (paragraph)

  var charCount = 0; // counted per-character, per chunk (paragraph)

  var secondToLastWhitespaceStartedAt; // necessary to support whitespace at line ends

  var secondToLastWhitespaceEndedAt; // necessary to support whitespace at line ends

  var lastWhitespaceStartedAt;
  var lastWhitespaceEndedAt;
  var lastEncodedNbspStartedAt;
  var lastEncodedNbspEndedAt; // let lineBreakCount;

  var doNothingUntil; // requests to bump word count in the future:

  var bumpWordCountAt; // prep the opts

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); // Now, strictly speaking, this program can remove widow words but also
  // it will decode any entities it encounters if option convertEntities is off.
  // We need an interface to report what actions were taken:


  var whatWasDone = {
    removeWidows: false,
    convertEntities: false
  };

  if (!opts.ignore || !isArr(opts.ignore) && typeof opts.ignore !== "string") {
    opts.ignore = [];
  } else {
    // arrayiffy
    if (typeof opts.ignore === "string") {
      opts.ignore = [opts.ignore];
    } // expand the string value presets


    if (opts.ignore.includes("all")) {
      // hugo heads tails and included in jinja's list, so can be omitted
      opts.ignore = opts.ignore.concat(headsAndTailsJinja.concat(headsAndTailsHexo));
    } else if (opts.ignore.some(function (val) {
      return typeof val === "string";
    })) {
      // if some values are strings, we need to either remove them or expand them
      // from string to recognised list of heads/tails
      var temp = []; // console.log(
      //   `166 ${`\u001b[${31}m${`OLD`}\u001b[${39}m`} ${`\u001b[${33}m${`opts.ignore`}\u001b[${39}m`} = ${JSON.stringify(
      //     opts.ignore,
      //     null,
      //     0
      //   )}`
      // );

      opts.ignore = opts.ignore.filter(function (val) {
        if (typeof val === "string" && val.length) {
          if (["nunjucks", "jinja", "liquid"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsJinja);
          } else if (["hugo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHugo);
          } else if (["hexo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHexo);
          }

          return false;
        }

        if (typeof val === "object") {
          return true;
        } // otherwise false is returned, value is excluded

      });

      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }

  var ceil;

  if (opts.reportProgressFunc) {
    // ceil is the top the range [0, 100], or whatever it was customised to,
    // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }

  function push(finalStart, finalEnd) {
    var finalWhatToInsert = rawnbsp; // calculate what to insert

    if (opts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (opts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;

      if (typeof opts.targetLanguage === "string") {
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

  function resetAll() {
    wordCount = 0;
    charCount = 0;
    secondToLastWhitespaceStartedAt = undefined;
    secondToLastWhitespaceEndedAt = undefined;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined; // lineBreakCount = undefined;
  }

  resetAll(); // iterate the string

  var _loop = function _loop(_i) {
    //
    //
    //
    //
    //                    TOP
    //
    //
    //
    //
    // Logging:
    // ███████████████████████████████████████ // detect templating language heads and tails

    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      opts.ignore.some(function (valObj, y) {
        if (isArr(valObj.heads) && valObj.heads.some(function (oneOfHeads) {
          return str.startsWith(oneOfHeads, _i);
        }) || typeof valObj.heads === "string" && str.startsWith(valObj.heads, _i)) {
          wordCount += 1;
          doNothingUntil = opts.ignore[y].tails;
          i = _i;
          return true;
        }
      });
    } // if there was word count bump request issued in the past for current
    // index, do bump it:


    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === _i) {
      wordCount += 1;
      bumpWordCountAt = undefined;
    } // Report the progress. Used in web worker setups.


    if (typeof opts.reportProgressFunc === "function") {
      // defaults:
      // opts.reportProgressFuncFrom = 0
      // opts.reportProgressFuncTo = 100
      currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * (ceil || 1)); // console.log(
      //   `309 ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${currentPercentageDone}; ${`\u001b[${33}m${`lastPercentage`}\u001b[${39}m`} = ${lastPercentage};`
      // );

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    } // catch the end of whitespace (must be at the top)


    if (!doNothingUntil && _i && str[_i] && str[_i].trim() && (!str[_i - 1] || str[_i - 1] && !str[_i - 1].trim())) {
      // 1. mark the ending
      lastWhitespaceEndedAt = _i;
    }

    if (!doNothingUntil && str[_i] && str[_i].trim()) {
      charCount += 1;
    } //
    //
    //
    //
    //
    //
    //
    //
    //             MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //
    // catch dashes


    if (!doNothingUntil && opts.hyphens && (("-" + rawMdash + rawNdash).includes(str[_i]) || str.startsWith(encodedNdashHtml, _i) || str.startsWith(encodedNdashCss, _i) || str.startsWith(encodedNdashJs, _i) || str.startsWith(encodedMdashHtml, _i) || str.startsWith(encodedMdashCss, _i) || str.startsWith(encodedMdashJs, _i)) && str[_i + 1] && (!str[_i + 1].trim() || str[_i] === "&")) {

      if (str[_i - 1] && !str[_i - 1].trim() && str[stringLeftRight.left(str, _i)]) {
        push(stringLeftRight.left(str, _i) + 1, _i); // report what was done:

        whatWasDone.removeWidows = true;
      }
    } // catch the HTML-encoded (named or numeric) nbsp's:


    if (!doNothingUntil && (str.startsWith("&nbsp;", _i) || str.startsWith("&#160;", _i))) {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[_i + 6] && str[_i + 6].trim()) {
        bumpWordCountAt = _i + 6;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    } // catch the CSS-encoded (\00A0) nbsp's:


    if (!doNothingUntil && str[_i + 4] && str[_i] === "\\" && str[_i + 1] === "0" && str[_i + 2] === "0" && str[_i + 3].toUpperCase() === "A" && str[_i + 4] === "0") {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 5; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[_i + 5] && str[_i + 5].trim()) {
        bumpWordCountAt = _i + 5;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 5, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    } // catch the JS-encoded (\u00A0) nbsp's:


    if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] && str[_i + 1].toLowerCase() === "u" && str[_i + 2] === "0" && str[_i + 3] === "0" && str[_i + 4] && str[_i + 4].toUpperCase() === "A" && str[_i + 5] === "0") {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[_i + 6] && str[_i + 6].trim()) {
        bumpWordCountAt = _i + 6;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
      }
    } // catch raw nbsp's:


    if (!doNothingUntil && str[_i] === rawnbsp) {
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 1; // if it opts.convertEntities is off, replace it right away

      if (opts.convertEntities) {
        rangesArr.push(_i, _i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
      }
    } // catch the first letter of the first word


    if (!doNothingUntil && str[_i] && str[_i].trim() && (!str[_i - 1] || !str[_i - 1].trim())) {
      // 1. bump the word counter
      wordCount += 1;
    } // catch the ending of paragraphs or the EOL - here's where the action happens


    if (!doNothingUntil && (!str[_i] || "\r\n".includes(str[_i]) || (str[_i] === "\n" || str[_i] === "\r" || str[_i] === "\r" && str[_i + 1] === "\n") && stringLeftRight.left(str, _i) && punctuationCharsToConsiderWidowIssue.includes(str[stringLeftRight.left(str, _i)]))) {

      if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
        var finalStart;
        var finalEnd; // calculate start and end values

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
        } // if by now the point to insert non-breaking space was not found,
        // give last chance to secondToLastWhitespaceStartedAt and
        // secondToLastWhitespaceEndedAt:


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
    } // catch postcodes
    // postcodeRegexFront, postcodeRegexEnd


    if (opts.UKPostcodes && str[_i] && !str[_i].trim() && str[_i - 1] && str[_i - 1].trim() && postcodeRegexFront.test(str.slice(0, _i)) && str[stringLeftRight.right(str, _i)] && postcodeRegexEnd.test(str.slice(stringLeftRight.right(str, _i)))) {
      push(_i, stringLeftRight.right(str, _i));
      whatWasDone.removeWidows = true;
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //              BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //
    // catch the start of whitespace (must be at the bottom)
    //
    // either it's first whitespace character ever met, or we're overwriting an
    // old whitespace record and it's the first character of new whitespace chunk


    if (!doNothingUntil && str[_i] && !str[_i].trim() && str[_i - 1] && str[_i - 1].trim() && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim()) && !"/>".includes(str[stringLeftRight.right(str, _i)]) && !str.slice(0, _i).trim().endsWith("br") && !str.slice(0, _i).trim().endsWith("hr") && !(str.slice(0, _i).endsWith("<") && knownHTMLTags.some(function (tag) {
      return str.startsWith(tag, stringLeftRight.right(str, _i));
    }))) { // 1. current value becomes second-to-last

      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt; // 2. mark new-one

      lastWhitespaceStartedAt = _i; // 2. wipe the ending of new-one

      lastWhitespaceEndedAt = undefined; // 3. wipe the records of the last nbsp because they are not relevant

      if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
      }
    } // look for templating tails


    var tempTailFinding = void 0;

    if (doNothingUntil) {
      if (typeof doNothingUntil === "string" && (!doNothingUntil.length || str.startsWith(doNothingUntil, _i))) {
        doNothingUntil = undefined;
      } else if (isArr(doNothingUntil) && (!doNothingUntil.length || doNothingUntil.some(function (val) {
        if (str.startsWith(val, _i)) {
          tempTailFinding = val;
          i = _i;
          return true;
        }
      }))) {
        doNothingUntil = undefined;
        _i += tempTailFinding.length; // imagine we caught "{% endif" of the following string:
        // {% if something %} some text and more text {% endif %}
        // we need to tackle the "%}" that follows.

        if (isArr(opts.ignore) && opts.ignore.length && str[_i + 1]) {
          opts.ignore.some(function (oneOfHeadsTailsObjs) {
            i = _i;
            // console.log("\n\n\n");
            // console.log(
            //   `857 ${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}\n\n\n`
            // );
            // console.log(
            //   `860 PROCESSING ${`\u001b[${33}m${`oneOfHeadsTailsObjs`}\u001b[${39}m`} = ${JSON.stringify(
            //     oneOfHeadsTailsObjs,
            //     null,
            //     4
            //   )}`
            // );
            return stringMatchLeftRight.matchRightIncl(str, _i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: function cb(_char, _theRemainderOfTheString, index) {
                if (index) {
                  _i = index - 1;

                  if (str[_i + 1] && str[_i + 1].trim()) {
                    wordCount += 1;
                  }
                }

                i = _i;
                return true;
              }
            });
          });
        }
      }
    } // if it's a CR or LF, reset the word/letter counts


    if (str[_i] && "\r\n".includes(str[_i])) {
      wordCount = 0;
      charCount = 0;
    } // skip known tag ranges


    if (isArr(opts.tagRanges) && opts.tagRanges.length && opts.tagRanges.some(function (rangeArr) {

      if (_i >= rangeArr[0] && _i <= rangeArr[1] && rangeArr[1] - 1 > _i) {
        _i = rangeArr[1] - 1;
        i = _i;
        return true;
      }
    })) ; // logging after each loop's iteration:
    // ███████████████████████████████████████ //
    //
    //
    // end of the loop

    i = _i;
  };

  for (var i = 0; i <= len; i++) {
    _loop(i);
  }
  rangesApply.rApply(str, rangesArr.current()).split("").forEach(function (key, i) {
  });
  return {
    res: rangesApply.rApply(str, rangesArr.current(), opts.reportProgressFunc ? function (incomingPerc) {
      currentPercentageDone = Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * (1 - leavePercForLastStage) + incomingPerc / 100 * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage);

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    } : undefined),
    ranges: rangesArr.current(),
    log: {
      timeTakenInMilliseconds: Date.now() - start
    },
    whatWasDone: whatWasDone
  };
} // main export

exports.defaults = defaults;
exports.removeWidows = removeWidows;
exports.version = version$1;
