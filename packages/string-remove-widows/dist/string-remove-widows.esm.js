/**
 * @name string-remove-widows
 * @fileoverview Helps to prevent widow words in a text
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-remove-widows/}
 */

import { matchRightIncl } from 'string-match-left-right';
import { left, right } from 'string-left-right';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';

var version$1 = "2.0.14";

const rawnbsp = "\u00A0";
const encodedNbspHtml = "&nbsp;";
const encodedNbspCss = "\\00A0";
const encodedNbspJs = "\\u00A0";
const rawNdash = "\u2013";
const encodedNdashHtml = "&ndash;";
const encodedNdashCss = "\\2013";
const encodedNdashJs = "\\u2013";
const rawMdash = "\u2014";
const encodedMdashHtml = "&mdash;";
const encodedMdashCss = "\\2014";
const encodedMdashJs = "\\u2014";
const headsAndTailsJinja = [{
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
const headsAndTailsHugo = [{
  heads: "{{",
  tails: "}}"
}];
const headsAndTailsHexo = [{
  heads: ["<%", "<%=", "<%-"],
  tails: ["%>", "=%>", "-%>"]
}];
const knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];

const version = version$1;
const defaults = {
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
  const start = Date.now();
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  const isArr = Array.isArray;
  const len = str.length;
  const rangesArr = new Ranges({
    mergeType: 2
  });
  const punctuationCharsToConsiderWidowIssue = ["."];
  const postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  const postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  const leavePercForLastStage = 0.06;
  let currentPercentageDone;
  let lastPercentage = 0;
  let wordCount = 0;
  let charCount = 0;
  let secondToLastWhitespaceStartedAt;
  let secondToLastWhitespaceEndedAt;
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  let doNothingUntil;
  let bumpWordCountAt;
  const opts = { ...defaults,
    ...originalOpts
  };
  const whatWasDone = {
    removeWidows: false,
    convertEntities: false
  };
  if (!opts.ignore || !isArr(opts.ignore) && typeof opts.ignore !== "string") {
    opts.ignore = [];
  } else {
    if (typeof opts.ignore === "string") {
      opts.ignore = [opts.ignore];
    }
    if (opts.ignore.includes("all")) {
      opts.ignore = opts.ignore.concat(headsAndTailsJinja.concat(headsAndTailsHexo));
    } else if (opts.ignore.some(val => typeof val === "string")) {
      let temp = [];
      opts.ignore = opts.ignore.filter(val => {
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
        }
      });
      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }
  let ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }
  function push(finalStart, finalEnd) {
    let finalWhatToInsert = rawnbsp;
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
    lastEncodedNbspEndedAt = undefined;
  }
  resetAll();
  for (let i = 0; i <= len; i++) {
    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      opts.ignore.some((valObj, y) => {
        if (isArr(valObj.heads) && valObj.heads.some(oneOfHeads => str.startsWith(oneOfHeads, i)) || typeof valObj.heads === "string" && str.startsWith(valObj.heads, i)) {
          wordCount += 1;
          doNothingUntil = opts.ignore[y].tails;
          return true;
        }
      });
    }
    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === i) {
      wordCount += 1;
      bumpWordCountAt = undefined;
    }
    if (typeof opts.reportProgressFunc === "function") {
      currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1));
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    }
    if (!doNothingUntil && i && str[i] && str[i].trim() && (!str[i - 1] || str[i - 1] && !str[i - 1].trim())) {
      lastWhitespaceEndedAt = i;
    }
    if (!doNothingUntil && str[i] && str[i].trim()) {
      charCount += 1;
    }
    if (!doNothingUntil && opts.hyphens && (`-${rawMdash}${rawNdash}`.includes(str[i]) || str.startsWith(encodedNdashHtml, i) || str.startsWith(encodedNdashCss, i) || str.startsWith(encodedNdashJs, i) || str.startsWith(encodedMdashHtml, i) || str.startsWith(encodedMdashCss, i) || str.startsWith(encodedMdashJs, i)) && str[i + 1] && (!str[i + 1].trim() || str[i] === "&")) {
      if (str[i - 1] && !str[i - 1].trim() && str[left(str, i)]) {
        push(left(str, i) + 1, i);
        whatWasDone.removeWidows = true;
      }
    }
    if (!doNothingUntil && (str.startsWith("&nbsp;", i) || str.startsWith("&#160;", i))) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
        rangesArr.push(i, i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    }
    if (!doNothingUntil && str[i + 4] && str[i] === "\\" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3].toUpperCase() === "A" && str[i + 4] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      if (str[i + 5] && str[i + 5].trim()) {
        bumpWordCountAt = i + 5;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 5, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
        rangesArr.push(i, i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    }
    if (!doNothingUntil && str[i] === "\\" && str[i + 1] && str[i + 1].toLowerCase() === "u" && str[i + 2] === "0" && str[i + 3] === "0" && str[i + 4] && str[i + 4].toUpperCase() === "A" && str[i + 5] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
        rangesArr.push(i, i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
      }
    }
    if (!doNothingUntil && str[i] === rawnbsp) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      if (opts.convertEntities) {
        rangesArr.push(i, i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
      }
    }
    if (!doNothingUntil && str[i] && str[i].trim() && (!str[i - 1] || !str[i - 1].trim())) {
      wordCount += 1;
    }
    if (!doNothingUntil && (!str[i] || `\r\n`.includes(str[i]) || (str[i] === "\n" || str[i] === "\r" || str[i] === "\r" && str[i + 1] === "\n") && left(str, i) && punctuationCharsToConsiderWidowIssue.includes(str[left(str, i)]))) {
      if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
        let finalStart;
        let finalEnd;
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
    if (opts.UKPostcodes && str[i] && !str[i].trim() && str[i - 1] && str[i - 1].trim() && postcodeRegexFront.test(str.slice(0, i)) && str[right(str, i)] && postcodeRegexEnd.test(str.slice(right(str, i)))) {
      push(i, right(str, i));
      whatWasDone.removeWidows = true;
    }
    if (!doNothingUntil && str[i] && !str[i].trim() && str[i - 1] && str[i - 1].trim() && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim()) && !"/>".includes(str[right(str, i)]) && !str.slice(0, i).trim().endsWith("br") && !str.slice(0, i).trim().endsWith("hr") && !(str.slice(0, i).endsWith("<") && knownHTMLTags.some(tag => str.startsWith(tag, right(str, i))))) {
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
      lastWhitespaceStartedAt = i;
      lastWhitespaceEndedAt = undefined;
      if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
      }
    }
    let tempTailFinding;
    if (doNothingUntil) {
      if (typeof doNothingUntil === "string" && (!doNothingUntil.length || str.startsWith(doNothingUntil, i))) {
        doNothingUntil = undefined;
      } else if (isArr(doNothingUntil) && (!doNothingUntil.length || doNothingUntil.some(val => {
        if (str.startsWith(val, i)) {
          tempTailFinding = val;
          return true;
        }
      }))) {
        doNothingUntil = undefined;
        i += tempTailFinding.length;
        if (isArr(opts.ignore) && opts.ignore.length && str[i + 1]) {
          opts.ignore.some(oneOfHeadsTailsObjs => {
            return matchRightIncl(str, i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: (_char, _theRemainderOfTheString, index) => {
                if (index) {
                  i = index - 1;
                  if (str[i + 1] && str[i + 1].trim()) {
                    wordCount += 1;
                  }
                }
                return true;
              }
            });
          });
        }
      }
    }
    if (str[i] && `\r\n`.includes(str[i])) {
      wordCount = 0;
      charCount = 0;
    }
    if (isArr(opts.tagRanges) && opts.tagRanges.length && opts.tagRanges.some(rangeArr => {
      if (i >= rangeArr[0] && i <= rangeArr[1] && rangeArr[1] - 1 > i) {
        i = rangeArr[1] - 1;
        return true;
      }
    })) ;
  }
  rApply(str, rangesArr.current()).split("").forEach((key, i) => {
  });
  return {
    res: rApply(str, rangesArr.current(), opts.reportProgressFunc ? incomingPerc => {
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
    whatWasDone
  };
}

export { defaults, removeWidows, version };
