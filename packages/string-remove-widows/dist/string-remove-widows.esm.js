/**
 * string-remove-widows
 * Helps to prevent widow words in a text
 * Version: 1.7.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-widows/
 */

import { matchRightIncl } from 'string-match-left-right';
import { left, right } from 'string-left-right';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';

var version = "1.7.3";

// consts
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
const knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]; // finally,

const version$1 = version;
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

function removeWidows(str, originalOpts) { // track time taken

  const start = Date.now(); // insurance:

  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  } // consts


  const isArr = Array.isArray;
  const len = str.length;
  const rangesArr = new Ranges({
    mergeType: 2
  });
  const punctuationCharsToConsiderWidowIssue = ["."];
  const postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  const postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  const leavePercForLastStage = 0.06; // in range of [0, 1]
  // vars

  let currentPercentageDone;
  let lastPercentage = 0;
  let wordCount = 0; // counted per-chunk (paragraph)

  let charCount = 0; // counted per-character, per chunk (paragraph)

  let secondToLastWhitespaceStartedAt; // necessary to support whitespace at line ends

  let secondToLastWhitespaceEndedAt; // necessary to support whitespace at line ends

  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt; // let lineBreakCount;

  let doNothingUntil; // requests to bump word count in the future:

  let bumpWordCountAt; // prep the opts

  const opts = { ...defaults,
    ...originalOpts
  }; // Now, strictly speaking, this program can remove widow words but also
  // it will decode any entities it encounters if option convertEntities is off.
  // We need an interface to report what actions were taken:

  const whatWasDone = {
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
    } else if (opts.ignore.some(val => typeof val === "string")) {
      // if some values are strings, we need to either remove them or expand them
      // from string to recognised list of heads/tails
      let temp = []; // console.log(
      //   `166 ${`\u001b[${31}m${`OLD`}\u001b[${39}m`} ${`\u001b[${33}m${`opts.ignore`}\u001b[${39}m`} = ${JSON.stringify(
      //     opts.ignore,
      //     null,
      //     0
      //   )}`
      // );

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
        } // otherwise false is returned, value is excluded

      });

      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }

  let ceil;

  if (opts.reportProgressFunc) {
    // ceil is the top the range [0, 100], or whatever it was customised to,
    // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }

  function push(finalStart, finalEnd) {
    let finalWhatToInsert = rawnbsp; // calculate what to insert

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

  for (let i = 0; i <= len; i++) {
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
      opts.ignore.some((valObj, y) => {
        if (isArr(valObj.heads) && valObj.heads.some(oneOfHeads => str.startsWith(oneOfHeads, i)) || typeof valObj.heads === "string" && str.startsWith(valObj.heads, i)) {
          wordCount += 1;
          doNothingUntil = opts.ignore[y].tails;
          return true;
        }
      });
    } // if there was word count bump request issued in the past for current
    // index, do bump it:


    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === i) {
      wordCount += 1;
      bumpWordCountAt = undefined;
    } // Report the progress. Used in web worker setups.


    if (typeof opts.reportProgressFunc === "function") {
      // defaults:
      // opts.reportProgressFuncFrom = 0
      // opts.reportProgressFuncTo = 100
      currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1)); // console.log(
      //   `309 ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${currentPercentageDone}; ${`\u001b[${33}m${`lastPercentage`}\u001b[${39}m`} = ${lastPercentage};`
      // );

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    } // catch the end of whitespace (must be at the top)


    if (!doNothingUntil && i && str[i] && str[i].trim() && (!str[i - 1] || str[i - 1] && !str[i - 1].trim())) {
      // 1. mark the ending
      lastWhitespaceEndedAt = i;
    }

    if (!doNothingUntil && str[i] && str[i].trim()) {
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


    if (!doNothingUntil && opts.hyphens && (`-${rawMdash}${rawNdash}`.includes(str[i]) || str.startsWith(encodedNdashHtml, i) || str.startsWith(encodedNdashCss, i) || str.startsWith(encodedNdashJs, i) || str.startsWith(encodedMdashHtml, i) || str.startsWith(encodedMdashCss, i) || str.startsWith(encodedMdashJs, i)) && str[i + 1] && (!str[i + 1].trim() || str[i] === "&")) {

      if (str[i - 1] && !str[i - 1].trim() && str[left(str, i)]) {
        push(left(str, i) + 1, i); // report what was done:

        whatWasDone.removeWidows = true;
      }
    } // catch the HTML-encoded (named or numeric) nbsp's:


    if (!doNothingUntil && (str.startsWith("&nbsp;", i) || str.startsWith("&#160;", i))) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
        rangesArr.push(i, i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    } // catch the CSS-encoded (\00A0) nbsp's:


    if (!doNothingUntil && str[i + 4] && str[i] === "\\" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3].toUpperCase() === "A" && str[i + 4] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[i + 5] && str[i + 5].trim()) {
        bumpWordCountAt = i + 5;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(i, i + 5, rawnbsp);
        whatWasDone.convertEntities = true;
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
        rangesArr.push(i, i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
        whatWasDone.convertEntities = true;
      }
    } // catch the JS-encoded (\u00A0) nbsp's:


    if (!doNothingUntil && str[i] === "\\" && str[i + 1] && str[i + 1].toLowerCase() === "u" && str[i + 2] === "0" && str[i + 3] === "0" && str[i + 4] && str[i + 4].toUpperCase() === "A" && str[i + 5] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6; // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time

      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
      } // if it opts.convertEntities is off, replace it right away


      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
        rangesArr.push(i, i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
      }
    } // catch raw nbsp's:


    if (!doNothingUntil && str[i] === rawnbsp) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1; // if it opts.convertEntities is off, replace it right away

      if (opts.convertEntities) {
        rangesArr.push(i, i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
      }
    } // catch the first letter of the first word


    if (!doNothingUntil && str[i] && str[i].trim() && (!str[i - 1] || !str[i - 1].trim())) {
      // 1. bump the word counter
      wordCount += 1;
    } // catch the ending of paragraphs or the EOL - here's where the action happens


    if (!doNothingUntil && (!str[i] || `\r\n`.includes(str[i]) || (str[i] === "\n" || str[i] === "\r" || str[i] === "\r" && str[i + 1] === "\n") && left(str, i) && punctuationCharsToConsiderWidowIssue.includes(str[left(str, i)]))) {

      if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
        let finalStart;
        let finalEnd; // calculate start and end values

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


    if (opts.UKPostcodes && str[i] && !str[i].trim() && str[i - 1] && str[i - 1].trim() && postcodeRegexFront.test(str.slice(0, i)) && str[right(str, i)] && postcodeRegexEnd.test(str.slice(right(str, i)))) {
      push(i, right(str, i));
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


    if (!doNothingUntil && str[i] && !str[i].trim() && str[i - 1] && str[i - 1].trim() && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim()) && !"/>".includes(str[right(str, i)]) && !str.slice(0, i).trim().endsWith("br") && !str.slice(0, i).trim().endsWith("hr") && !(str.slice(0, i).endsWith("<") && knownHTMLTags.some(tag => str.startsWith(tag, right(str, i))))) { // 1. current value becomes second-to-last

      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt; // 2. mark new-one

      lastWhitespaceStartedAt = i; // 2. wipe the ending of new-one

      lastWhitespaceEndedAt = undefined; // 3. wipe the records of the last nbsp because they are not relevant

      if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
      }
    } // look for templating tails


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
        i += tempTailFinding.length; // imagine we caught "{% endif" of the following string:
        // {% if something %} some text and more text {% endif %}
        // we need to tackle the "%}" that follows.

        if (isArr(opts.ignore) && opts.ignore.length && str[i + 1]) {
          opts.ignore.some(oneOfHeadsTailsObjs => {
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
    } // if it's a CR or LF, reset the word/letter counts


    if (str[i] && `\r\n`.includes(str[i])) {
      wordCount = 0;
      charCount = 0;
    } // skip known tag ranges


    if (isArr(opts.tagRanges) && opts.tagRanges.length && opts.tagRanges.some(rangeArr => {

      if (i >= rangeArr[0] && i <= rangeArr[1] && rangeArr[1] - 1 > i) {
        i = rangeArr[1] - 1;
        return true;
      }
    })) ; // logging after each loop's iteration:
    // ███████████████████████████████████████ //
    //
    //
    // end of the loop
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
} // main export

export { defaults, removeWidows, version$1 as version };
