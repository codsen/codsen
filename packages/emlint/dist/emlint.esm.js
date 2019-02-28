/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.8.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import merge from 'ranges-merge';

var knownBooleanHTMLAttributes = [
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "compact",
  "contenteditable",
  "controls",
  "default",
  "defer",
  "disabled",
  "formNoValidate",
  "frameborder",
  "hidden",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nohref",
  "nomodule",
  "noresize",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "readonly",
  "required",
  "reversed",
  "scoped",
  "scrolling",
  "seamless",
  "selected",
  "typemustmatch"
]
;

var knownHTMLTags = [
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "doctype",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "param",
  "picture",
  "pre",
  "progress",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "ul",
  "var",
  "video",
  "wbr",
  "xml"
]
;

var version = "0.8.0";

var errors = {
	"bad-character-acknowledge": {
	description: "https://www.fileformat.info/info/unicode/char/0006/index.htm",
	excerpt: "bad character - acknowledge",
	scope: "all"
},
	"bad-character-backspace": {
	description: "https://www.fileformat.info/info/unicode/char/0008/index.htm",
	excerpt: "bad character - backspace",
	scope: "all"
},
	"bad-character-bell": {
	description: "https://www.fileformat.info/info/unicode/char/0007/index.htm",
	excerpt: "bad character - bell",
	scope: "all"
},
	"bad-character-cancel": {
	description: "https://www.fileformat.info/info/unicode/char/0018/index.htm",
	excerpt: "bad character - cancel",
	scope: "all"
},
	"bad-character-character-tabulation": {
	description: "https://www.fileformat.info/info/unicode/char/0009/index.htm",
	excerpt: "bad character - character tabulation",
	scope: "all"
},
	"bad-character-data-link-escape": {
	description: "https://www.fileformat.info/info/unicode/char/0010/index.htm",
	excerpt: "bad character - data link escape",
	scope: "all"
},
	"bad-character-device-control-four": {
	description: "https://www.fileformat.info/info/unicode/char/0014/index.htm",
	excerpt: "bad character - device control four",
	scope: "all"
},
	"bad-character-device-control-one": {
	description: "https://www.fileformat.info/info/unicode/char/0011/index.htm",
	excerpt: "bad character - device control one",
	scope: "all"
},
	"bad-character-device-control-three": {
	description: "https://www.fileformat.info/info/unicode/char/0013/index.htm",
	excerpt: "bad character - device control three",
	scope: "all"
},
	"bad-character-device-control-two": {
	description: "https://www.fileformat.info/info/unicode/char/0012/index.htm",
	excerpt: "bad character - device control two",
	scope: "all"
},
	"bad-character-end-of-medium": {
	description: "https://www.fileformat.info/info/unicode/char/0019/index.htm",
	excerpt: "bad character - end of medium",
	scope: "all"
},
	"bad-character-end-of-text": {
	description: "https://www.fileformat.info/info/unicode/char/0003/index.htm",
	excerpt: "bad character - end of text",
	scope: "all"
},
	"bad-character-end-of-transmission": {
	description: "https://www.fileformat.info/info/unicode/char/0004/index.htm",
	excerpt: "bad character - end of transmission",
	scope: "all"
},
	"bad-character-end-of-transmission-block": {
	description: "https://www.fileformat.info/info/unicode/char/0017/index.htm",
	excerpt: "bad character - end of transmission block",
	scope: "all"
},
	"bad-character-enquiry": {
	description: "https://www.fileformat.info/info/unicode/char/0005/index.htm",
	excerpt: "bad character - enquiry",
	scope: "all"
},
	"bad-character-escape": {
	description: "https://www.fileformat.info/info/unicode/char/001b/index.htm",
	excerpt: "bad character - escape",
	scope: "all"
},
	"bad-character-form-feed": {
	description: "https://www.fileformat.info/info/unicode/char/000c/index.htm",
	excerpt: "bad character - form feed",
	scope: "all"
},
	"bad-character-information-separator-four": {
	description: "https://www.fileformat.info/info/unicode/char/001c/index.htm",
	excerpt: "bad character - information separator four",
	scope: "all"
},
	"bad-character-information-separator-one": {
	description: "https://www.fileformat.info/info/unicode/char/001f/index.htm",
	excerpt: "bad character - information separator one",
	scope: "all"
},
	"bad-character-information-separator-three": {
	description: "https://www.fileformat.info/info/unicode/char/001d/index.htm",
	excerpt: "bad character - information separator three",
	scope: "all"
},
	"bad-character-information-separator-two": {
	description: "https://www.fileformat.info/info/unicode/char/001e/index.htm",
	excerpt: "bad character - information separator two",
	scope: "all"
},
	"bad-character-line-tabulation": {
	description: "https://www.fileformat.info/info/unicode/char/000b/index.htm",
	excerpt: "bad character - line tabulation",
	scope: "all"
},
	"bad-character-negative-acknowledge": {
	description: "https://www.fileformat.info/info/unicode/char/0015/index.htm",
	excerpt: "bad character - negative acknowledge",
	scope: "all"
},
	"bad-character-null": {
	description: "https://www.fileformat.info/info/unicode/char/0000/index.htm",
	excerpt: "bad character - null",
	scope: "all"
},
	"bad-character-shift-in": {
	description: "https://www.fileformat.info/info/unicode/char/000f/index.htm",
	excerpt: "bad character - shift in",
	scope: "all"
},
	"bad-character-shift-out": {
	description: "https://www.fileformat.info/info/unicode/char/000e/index.htm",
	excerpt: "bad character - shift out",
	scope: "all"
},
	"bad-character-start-of-heading": {
	description: "https://www.fileformat.info/info/unicode/char/0001/index.htm",
	excerpt: "bad character - start of heading",
	scope: "all"
},
	"bad-character-start-of-text": {
	description: "https://www.fileformat.info/info/unicode/char/0002/index.htm",
	excerpt: "bad character - start of text",
	scope: "all"
},
	"bad-character-substitute": {
	description: "https://www.fileformat.info/info/unicode/char/001a/index.htm",
	excerpt: "bad character - substitute",
	scope: "all"
},
	"bad-character-synchronous-idle": {
	description: "https://www.fileformat.info/info/unicode/char/0016/index.htm",
	excerpt: "bad character - synchronous idle",
	scope: "all"
},
	"bad-character-unencoded-ampersand": {
	description: "There is unencoded ampersand",
	excerpt: "unencoded ampersand",
	scope: "html"
},
	"bad-character-unencoded-closing-bracket": {
	description: "There is unencoded closing bracket",
	excerpt: "unencoded closing bracket",
	scope: "html"
},
	"bad-character-unencoded-double-quotes": {
	description: "There is unencoded double quotes",
	excerpt: "unencoded double quotes",
	scope: "html"
},
	"bad-character-unencoded-opening-bracket": {
	description: "There is unencoded opening bracket",
	excerpt: "unencoded opening bracket",
	scope: "html"
},
	"file-empty": {
	description: "the contents are empty",
	excerpt: "the contents are empty",
	scope: "all"
},
	"file-missing-ending": {
	description: "the ending part of the contents is missing",
	excerpt: "ending part is missing",
	scope: "all"
},
	"file-mixed-line-endings-file-is-CR-mainly": {
	description: "mixed line endings detected, majority EOL's are CR",
	excerpt: "mixed line endings detected, majority EOL's are CR",
	scope: "all"
},
	"file-mixed-line-endings-file-is-CRLF-mainly": {
	description: "mixed line endings detected, majority EOL's are CRLF",
	excerpt: "mixed line endings detected, majority EOL's are CRLF",
	scope: "all"
},
	"file-mixed-line-endings-file-is-LF-mainly": {
	description: "mixed line endings detected, majority EOL's are LF",
	excerpt: "mixed line endings detected, majority EOL's are LF",
	scope: "all"
},
	"file-wrong-type-line-ending-CR": {
	description: "Carriage Return (ASCII #13) line ending detected",
	excerpt: "Carriage Return line ending",
	scope: "all"
},
	"file-wrong-type-line-ending-CRLF": {
	description: "CRLF (Carriage Return + Line Feed) line ending detected",
	excerpt: "CRLF line ending",
	scope: "all"
},
	"file-wrong-type-line-ending-LF": {
	description: "Line Feed (ASCII #10) line ending detected",
	excerpt: "Line Feed line ending",
	scope: "all"
},
	"tag-attribute-closing-quotation-mark-missing": {
	description: "The closing quotation mark is missing",
	excerpt: "the closing quotation mark is missing",
	scope: "html"
},
	"tag-attribute-left-double-quotation-mark": {
	description: "There's a left double quotation mark, https://www.fileformat.info/info/unicode/char/201C/index.htm",
	excerpt: "a left double quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-left-single-quotation-mark": {
	description: "There's a left single quotation mark, https://www.fileformat.info/info/unicode/char/2018/index.htm",
	excerpt: "a left single quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-mismatching-quotes-is-double": {
	description: "attribute's opening quote is single, but closing-one is double",
	excerpt: "there should be a single quote here instead",
	scope: "html"
},
	"tag-attribute-mismatching-quotes-is-single": {
	description: "attribute's opening quote is double, but closing-one is single",
	excerpt: "there should be a double quote here instead",
	scope: "html"
},
	"tag-attribute-missing-equal": {
	description: "The equal is missing between attribute's name and quotes",
	excerpt: "missing equal character",
	scope: "html"
},
	"tag-attribute-repeated-equal": {
	description: "The equal after attribute's name is repeated",
	excerpt: "repeated equal character",
	scope: "html"
},
	"tag-attribute-opening-quotation-mark-missing": {
	description: "The opening quotation mark is missing",
	excerpt: "the opening quotation mark is missing",
	scope: "html"
},
	"tag-attribute-quote-and-onwards-missing": {
	description: "One of the attributes ends with an equal sign, there are no quotes on it",
	excerpt: "attributes ends with an equal sign, there are no quotes on it",
	scope: "html"
},
	"tag-attribute-right-double-quotation-mark": {
	description: "There's a right double quotation mark, https://www.fileformat.info/info/unicode/char/201d/index.htm",
	excerpt: "a right double quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-right-single-quotation-mark": {
	description: "There's a right single quotation mark, https://www.fileformat.info/info/unicode/char/2019/index.htm",
	excerpt: "a right single quotation mark instead of a normal quotation mark",
	scope: "html"
},
	"tag-attribute-space-between-equals-and-opening-quotes": {
	description: "There's a space between attribute's equal sign and opening quotes",
	excerpt: "space between attribute's equal sign and opening quotes",
	scope: "html"
},
	"tag-attribute-space-between-name-and-equals": {
	description: "There's a space between attribute's name and equal sign",
	excerpt: "space between attribute's name and equal sign",
	scope: "html"
},
	"tag-excessive-whitespace-inside-tag": {
	description: "There's an excessive whitespace inside the tag",
	excerpt: "space between attribute's name and equal sign",
	scope: "html"
},
	"tag-generic-error": {
	description: "Something is wrong here",
	excerpt: "something is wrong here",
	scope: "html"
},
	"tag-missing-closing-bracket": {
	description: "Tag's closing bracket is missing",
	excerpt: "missing closing bracket",
	scope: "html"
},
	"tag-name-lowercase": {
	description: "Normally all tags are in lowercase",
	excerpt: "tag name contains uppercase characters",
	scope: "html"
},
	"tag-space-after-opening-bracket": {
	description: "Many browsers, including Chrome will not consider this a tag",
	excerpt: "space between opening bracket and tag name",
	scope: "html"
},
	"tag-whitespace-closing-slash-and-bracket": {
	description: "There's a whitespace between closing slash and closing bracket",
	excerpt: "whitespace between slash and closing bracket",
	scope: "html"
}
};

const lowAsciiCharacterNames = [
  "null",
  "start-of-heading",
  "start-of-text",
  "end-of-text",
  "end-of-transmission",
  "enquiry",
  "acknowledge",
  "bell",
  "backspace",
  "character-tabulation",
  "line-feed",
  "line-tabulation",
  "form-feed",
  "carriage-return",
  "shift-out",
  "shift-in",
  "data-link-escape",
  "device-control-one",
  "device-control-two",
  "device-control-three",
  "device-control-four",
  "negative-acknowledge",
  "synchronous-idle",
  "end-of-transmission-block",
  "cancel",
  "end-of-medium",
  "substitute",
  "escape",
  "information-separator-four",
  "information-separator-three",
  "information-separator-two",
  "information-separator-one",
  "space",
  "exclamation-mark"
];
function charSuitableForAttrName(char) {
  const res = !`"'><=`.includes(char);
  return res;
}
function onlyTheseLeadToThat(
  str,
  idx = 0,
  charWePassValidatorFuncArr,
  breakingCharValidatorFuncArr,
  terminatorCharValidatorFuncArr = null
) {
  if (typeof idx !== "number") {
    idx = 0;
  }
  if (typeof charWePassValidatorFuncArr === "function") {
    charWePassValidatorFuncArr = [charWePassValidatorFuncArr];
  }
  if (typeof breakingCharValidatorFuncArr === "function") {
    breakingCharValidatorFuncArr = [breakingCharValidatorFuncArr];
  }
  if (typeof terminatorCharValidatorFuncArr === "function") {
    terminatorCharValidatorFuncArr = [terminatorCharValidatorFuncArr];
  }
  let lastRes = false;
  for (let i = 0, len = str.length; i < len; i++) {
    console.log(`091 str[${i}] = ${str[i]}`);
    if (breakingCharValidatorFuncArr.some(func => func(str[i], i))) {
      if (!terminatorCharValidatorFuncArr) {
        console.log(
          `097 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${i}`}\u001b[${39}m`}`
        );
        return i;
      }
      lastRes = i;
    }
    if (
      terminatorCharValidatorFuncArr !== null &&
      lastRes &&
      terminatorCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      console.log(
        `112 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${lastRes}`}\u001b[${39}m`}`
      );
      return lastRes;
    }
    if (
      !charWePassValidatorFuncArr.some(func => func(str[i], i)) &&
      !breakingCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      console.log(
        `123 util/onlyTheseLeadToThat: ${`\u001b[${31}m${`██`}\u001b[${39}m`} return ${`\u001b[${31}m${`false`}\u001b[${39}m`}`
      );
      return false;
    }
  }
}
function onlyAttrFriendlyCharsLeadingToEqual(str, idx = 0) {
  return onlyTheseLeadToThat(
    str,
    idx,
    charSuitableForAttrName,
    char => char === "="
  );
}
function charIsQuote(char) {
  const res = `"'\`\u2018\u2019\u201C\u201D`.includes(char);
  return res;
}
function notTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/charNotTag(): input is not a single string character!"
    );
  }
  const res = !`><=`.includes(char);
  return res;
}
function isLowerCaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 96 &&
    char.charCodeAt(0) < 123
  );
}
function isUppercaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 64 &&
    char.charCodeAt(0) < 91
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isLowercase(char) {
  return char.toLowerCase() === char && char.toUpperCase() !== char;
}
function isLatinLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char);
}
function log(...pairs) {
  return pairs.reduce((accum, curr, idx, arr) => {
    if (idx === 0 && typeof curr === "string") {
      return `\u001b[${32}m${curr.toUpperCase()}\u001b[${39}m`;
    } else if (idx % 2 !== 0) {
      return `${accum} \u001b[${33}m${curr}\u001b[${39}m`;
    }
    return `${accum} = ${JSON.stringify(curr, null, 4)}${
      arr[idx + 1] ? ";" : ""
    }`;
  }, "");
}
function withinTagInnerspace(str, idx, closingQuotePos) {
  console.log("\n\n\n\n\n");
  console.log(`247 withinTagInnerspace() called, idx = ${idx}`);
  if (typeof idx !== "number") {
    if (idx == null) {
      idx = 0;
    } else {
      throw new Error(
        `emlint/util.js/withinTagInnerspace(): second argument is of a type ${typeof idx}`
      );
    }
  }
  const quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false
  };
  let beginningOfAString = true;
  let r2_1 = false;
  let r2_2 = false;
  let r2_3 = false;
  let r2_4 = false;
  let r3_1 = false;
  let r3_2 = false;
  let r3_3 = false;
  let r3_4 = false;
  let r3_5 = false;
  let r4_1 = false;
  let r5_1 = false;
  let r5_2 = false;
  let r5_3 = false;
  let r6_1 = false;
  let r6_2 = false;
  let r6_3 = false;
  let r7_1 = false;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    console.log(
      `${`\u001b[${
        closingQuotePos != null ? 35 : 36
      }m${`=`}\u001b[${39}m\u001b[${
        closingQuotePos != null ? 33 : 34
      }m${`=`}\u001b[${39}m`.repeat(15)} \u001b[${31}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} ${`\u001b[${
        closingQuotePos != null ? 35 : 36
      }m${`=`}\u001b[${39}m\u001b[${
        closingQuotePos != null ? 33 : 34
      }m${`=`}\u001b[${39}m`.repeat(15)}${
        closingQuotePos != null ? " RECURSION" : ""
      }`
    );
    if (!str[i].trim().length) {
      if (quotes.last) {
        quotes.precedes = true;
      }
    }
    if (str[i] === ">") ;
    if (str[i] === "/") ;
    if (str[i] === ">") ;
    if (charIsQuote(str[i])) {
      if (quotes.at === null) {
        quotes.within = true;
        quotes.at = i;
      } else if (str[i] === str[quotes.at] || i === closingQuotePos) {
        quotes.within = false;
      }
      quotes.last = true;
    } else if (quotes.last) {
      quotes.precedes = true;
      quotes.last = false;
    } else {
      quotes.precedes = false;
    }
    if (
      quotes.at &&
      !quotes.within &&
      quotes.precedes &&
      str[i] !== str[quotes.at]
    ) {
      quotes.at = null;
    }
    if (
      !quotes.within &&
      beginningOfAString &&
      str[i] === "/" &&
      ">".includes(str[right(str, i)])
    ) {
      console.log(
        `528 ${`\u001b[${32}m${`██ R1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "return",
          "true"
        )}`
      );
      console.log("\n\n\n\n\n\n");
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      console.log(
        `548 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r3_1",
          r3_1
        )}`
      );
      if (
        !str[i + 1] ||
        !right(str, i) ||
        (!str.slice(i).includes("'") && !str.slice(i).includes('"'))
      ) {
        console.log(
          `567 EOF detected ${`\u001b[${32}m${`██ R3.2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (str[right(str, i)] === "<") {
        console.log(
          `577 ${`\u001b[${32}m${`██ R3.3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    else if (r3_1 && !r3_2 && str[i].trim().length && !notTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
        console.log(
          `592 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_2",
            r3_2
          )}`
        );
      } else {
        r3_1 = false;
        console.log(
          `601 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r3_1",
            r3_1
          )}`
        );
      }
    }
    else if (r3_2 && !r3_3 && str[i].trim().length) {
      if (charSuitableForTagName(str[i]) || str[i] === "/") {
        r3_3 = true;
        console.log(
          `615 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_3",
            r3_3
          )}`
        );
      } else {
        r3_1 = false;
        r3_2 = false;
        console.log(
          `625 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r3_1",
            r3_1,
            "r3_2",
            r3_2
          )}`
        );
      }
    }
    else if (
      r3_3 &&
      !r3_4 &&
      str[i].trim().length &&
      !charSuitableForTagName(str[i])
    ) {
      if (
        "<>".includes(str[i]) ||
        (str[i] === "/" && "<>".includes(right(str, i)))
      ) {
        console.log(
          `650 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (`='"`.includes(str[i])) {
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        console.log(
          `663 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r3_1",
            r3_1,
            "r3_2",
            r3_2,
            "r3_3",
            r3_3
          )}`
        );
      }
    }
    else if (r3_3 && !r3_4 && !str[i].trim().length) {
      r3_4 = true;
      console.log(
        `680 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r3_4",
          r3_4
        )}`
      );
    }
    else if (r3_4 && !r3_5 && str[i].trim().length) {
      if (charSuitableForAttrName(str[i])) {
        r3_5 = true;
        console.log(
          `694 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_5",
            r3_5
          )}`
        );
      } else {
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        r3_4 = false;
        console.log(
          `706 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r3_1",
            r3_1,
            "r3_2",
            r3_2,
            "r3_3",
            r3_3,
            "r3_4",
            r3_4
          )}`
        );
      }
    }
    else if (r3_5) {
      if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
        console.log(
          `726 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    if (
      !quotes.within &&
      beginningOfAString &&
      charSuitableForAttrName(str[i]) &&
      !r2_1 &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r2_1 = true;
      console.log(
        `756 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r2_1",
          r2_1
        )}`
      );
    }
    else if (
      !r2_2 &&
      r2_1 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r2_2 = true;
        console.log(
          `775 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_2",
            r2_2
          )}`
        );
      } else if (
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        let closingBracketAt = i;
        if (str[i] === "/") {
          closingBracketAt = str[right(str, i)];
        }
        if (right(str, closingBracketAt)) {
          r3_1 = true;
          r2_1 = false;
          console.log(
            `797 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_1",
              r2_1,
              "r3_1",
              r3_1
            )}`
          );
        } else {
          console.log(
            `807 ${`\u001b[${32}m${`██ R2.1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "return",
              "true"
            )}`
          );
          console.log("\n\n\n\n\n\n");
          return true;
        }
      } else {
        r2_1 = false;
        console.log(
          `818 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r2_1",
            r2_1
          )}`
        );
      }
    }
    else if (!r2_3 && r2_2 && str[i].trim().length) {
      if (`'"`.includes(str[i])) {
        r2_3 = true;
        console.log(
          `832 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_3",
            r2_3
          )}`
        );
      } else {
        r2_1 = false;
        r2_2 = false;
        console.log(
          `842 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r2_1",
            r2_1,
            "r2_2",
            r2_2
          )}`
        );
      }
    }
    else if (r2_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        r2_4 = true;
        console.log(
          `858 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_4",
            r2_4
          )}`
        );
      } else {
        if (closingQuotePos != null && closingQuotePos === i) {
          console.log("868 recursion, this is the index the future indicated");
          if (
            isStr(str[quotes.at]) &&
            `"'`.includes(str[quotes.at]) &&
            `"'`.includes(str[i])
          ) {
            r2_4 = true;
            console.log(
              `890 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
                "set",
                "r2_4",
                r2_4
              )}`
            );
          } else if (
            isStr(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[i])
          ) {
            r2_4 = true;
            console.log(
              `904 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
                "set",
                "r2_4",
                r2_4
              )}`
            );
          } else if (
            isStr(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[i])
          ) {
            r2_4 = true;
            console.log(
              `918 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
                "set",
                "r2_4",
                r2_4
              )}`
            );
          }
        } else if (
          closingQuotePos == null &&
          withinTagInnerspace(str, null, i)
        ) {
          console.log("                        ██");
          console.log("                        ██");
          console.log("                        ██");
          console.log("                        ██");
          console.log("  OUTSIDE OF RECURSION, WITHIN MAIN LOOP AGAIN");
          console.log("                        ██");
          console.log("                        ██");
          console.log("                        ██");
          console.log("                        ██");
          console.log("939 not a recursion, but result from one came positive");
          if (quotes.within) {
            quotes.within = false;
          }
          r2_4 = true;
          console.log(
            `949 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_4",
              r2_4
            )}`
          );
        }
      }
    }
    else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
      if (str[i] === ">") {
        console.log(
          `963 ${`\u001b[${32}m${`██ R2/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (charSuitableForAttrName(str[i])) {
        console.log(
          `972 ${`\u001b[${32}m${`██ R2/2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    if (
      !quotes.within &&
      beginningOfAString &&
      !r4_1 &&
      charSuitableForAttrName(str[i]) &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r4_1 = true;
      console.log(
        `995 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r4_1",
          r4_1
        )}`
      );
    }
    else if (
      r4_1 &&
      str[i].trim().length &&
      (!charSuitableForAttrName(str[i]) || str[i] === "/")
    ) {
      if (str[i] === "/" && str[right(str, i)] === ">") {
        console.log(
          `1012 ${`\u001b[${32}m${`██ R4`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      r4_1 = false;
      console.log(
        `1022 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r4_1",
          r4_1
        )}`
      );
    }
    if (
      beginningOfAString &&
      !quotes.within &&
      !r5_1 &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i])
    ) {
      r5_1 = true;
      console.log(
        `1044 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r5_1",
          r5_1
        )}`
      );
    }
    else if (
      r5_1 &&
      !r5_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r5_2 = true;
        console.log(
          `1062 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_2",
            r5_2
          )}`
        );
      } else {
        r5_1 = false;
        console.log(
          `1071 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r5_1",
            r5_1
          )}`
        );
      }
    }
    else if (r5_2 && !r5_3 && str[i].trim().length) {
      if (str[i] === ">") {
        r5_3 = true;
        console.log(
          `1085 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_3",
            r5_3
          )}`
        );
      } else {
        r5_1 = false;
        r5_2 = false;
        console.log(
          `1095 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r5_1",
            r5_1,
            "r5_2",
            r5_2
          )}`
        );
      }
    }
    else if (r5_3 && str[i].trim().length && !notTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
        console.log(
          `1112 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_2",
            r3_2
          )}`
        );
      } else {
        r5_1 = false;
        r5_2 = false;
        r5_3 = false;
        console.log(
          `1123 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r5_1",
            r5_1,
            "r5_2",
            r5_2,
            "r5_3",
            r5_3
          )}`
        );
      }
    }
    if (
      !quotes.within &&
      !r6_1 &&
      (charSuitableForAttrName(str[i]) || !str[i].trim().length) &&
      !charSuitableForAttrName(str[i - 1]) &&
      str[i - 1] !== "="
    ) {
      r6_1 = true;
      console.log(
        `1162 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r6_1",
          r6_1
        )}`
      );
    }
    if (
      !quotes.within &&
      r6_1 &&
      !r6_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r6_2 = true;
        console.log(
          `1181 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_2",
            r6_2
          )}`
        );
      } else {
        r6_1 = false;
        console.log(
          `1190 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r6_1",
            r6_1
          )}`
        );
      }
    }
    else if (!r6_3 && r6_2 && str[i].trim().length) {
      if (charIsQuote(str[i])) {
        r6_3 = true;
        console.log(
          `1204 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_3",
            r6_3
          )}`
        );
      } else {
        r6_1 = false;
        r6_2 = false;
        console.log(
          `1214 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r6_1",
            r6_1,
            "r6_2",
            r6_2
          )}`
        );
      }
    }
    else if (r6_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        console.log(
          `1230 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      else if (str[i + 1] && `/>`.includes(str[right(str, i)])) {
        console.log(
          `1243 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }
    if (
      beginningOfAString &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i]) &&
      !r7_1
    ) {
      r7_1 = true;
      console.log(
        `1267 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r7_1",
          r7_1
        )}`
      );
    }
    if (
      r7_1 &&
      !str[i].trim().length &&
      str[i + 1] &&
      charSuitableForAttrName(str[i + 1])
    ) {
      console.log(
        `1290 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r7_1",
          r7_1
        )}`
      );
      r7_1 = false;
    }
    if (
      !quotes.within &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i]) &&
      r7_1
    ) {
      if (str[i] === "=") {
        console.log(
          `1318 ${`\u001b[${32}m${`██ R7/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      r7_1 = false;
      console.log(
        `1329 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r7_1",
          r7_1
        )}`
      );
    }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
    }
  }
  console.log(`1458 withinTagInnerspace(): FIN. RETURN FALSE.`);
  console.log("\n\n\n\n\n\n");
  return false;
}
function tagOnTheRight(str, idx = 0) {
  console.log(
    `1474 util/tagOnTheRight() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`1476 tagOnTheRight() called, idx = ${idx}`);
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(
      `1495 util/tagOnTheRight(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(
      `1500 util/tagOnTheRight(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(
      `1505 util/tagOnTheRight(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(
      `1510 util/tagOnTheRight(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `1516 util/tagOnTheRight(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
  return res;
}
function right(str, idx = 0) {
  if (!str[idx + 1]) {
    return null;
  } else if (str[idx + 1] && str[idx + 1].trim().length) {
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    return idx + 2;
  }
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function left(str, idx = 0) {
  if (idx < 1) {
    return null;
  } else if (str[idx - 1] && str[idx - 1].trim().length) {
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    return idx - 2;
  }
  for (let i = idx; i--; ) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function attributeOnTheRight(str, idx = 0, closingQuoteAt = null) {
  console.log(
    `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
  );
  console.log(`closingQuoteAt = ${JSON.stringify(closingQuoteAt, null, 4)}`);
  const startingQuoteVal = str[idx];
  if (startingQuoteVal !== "'" && startingQuoteVal !== '"') {
    throw new Error(
      `1 emlint/util/attributeOnTheRight(): first character is not a single/double quote!\nstartingQuoteVal = ${JSON.stringify(
        startingQuoteVal,
        null,
        0
      )}\nstr = ${JSON.stringify(str, null, 4)}\nidx = ${JSON.stringify(
        idx,
        null,
        0
      )}`
    );
  }
  let closingQuoteMatched = false;
  let lastClosingBracket = null;
  let lastOpeningBracket = null;
  let lastSomeQuote = null;
  let lastEqual = null;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    console.log(
      `\u001b[${
        closingQuoteAt === null ? 36 : 32
      }m${`===============================`}\u001b[${39}m \u001b[${
        closingQuoteAt === null ? 34 : 31
      }m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${
        closingQuoteAt === null ? 36 : 32
      }m${`===============================`}\u001b[${39}m`
    );
    if (
      (i === closingQuoteAt && i > idx) ||
      (closingQuoteAt === null && i > idx && str[i] === startingQuoteVal)
    ) {
      closingQuoteAt = i;
      console.log(
        `1650 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `1659 (util/attributeOnTheRight) ${log(
            "set",
            "closingQuoteMatched",
            closingQuoteMatched
          )}`
        );
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
      console.log(
        `1671 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `1681 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `1691 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `1697 (util/attributeOnTheRight) ${log(
          "set",
          "lastSomeQuote",
          lastSomeQuote
        )}`
      );
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log(
        "1713 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log(
            `1721 (util/attributeOnTheRight) ${log(
              "return",
              "closingQuoteAt",
              closingQuoteAt
            )}`
          );
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          console.log(
            "1736 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }
        console.log(
          `1743 (util/attributeOnTheRight) ${log(
            " ███████████████████████████████████████ correction!\n",
            "true"
          )}`
        );
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log(
              "1758 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `1761 (util/attributeOnTheRight) ${log(
                "return",
                "lastSomeQuote",
                lastSomeQuote
              )}`
            );
            return lastSomeQuote;
          }
        }
        const correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          console.log(
            "1777 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `1780 (util/attributeOnTheRight) ${log("return", "false")}`
          );
          return false;
        }
      }
    }
    if (
      closingQuoteMatched &&
      lastClosingBracket &&
      lastClosingBracket > closingQuoteMatched
    ) {
      console.log(
        `1794 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }
    if (
      closingQuoteMatched &&
      lastClosingBracket === null &&
      lastOpeningBracket === null &&
      (lastSomeQuote === null ||
        (lastSomeQuote && closingQuoteAt >= lastSomeQuote)) &&
      lastEqual === null
    ) {
      console.log(
        `1818 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log(`1841 (util) "EOL reached"`);
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1859 (util) last chance, run correction 3");
    console.log(
      `${`\u001b[${33}m${`lastSomeQuote`}\u001b[${39}m`} = ${JSON.stringify(
        lastSomeQuote,
        null,
        4
      )}`
    );
    const correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      console.log(
        "1871 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`1873 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }
  console.log(`1878 (util) ${log("bottom - return", "false")}`);
  return false;
}
function findClosingQuote(str, idx = 0) {
  console.log(
    `1898 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  let lastNonWhitespaceCharWasQuoteAt = null;
  let lastQuoteAt = null;
  const startingQuote = `"'`.includes(str[idx]) ? str[idx] : null;
  let lastClosingBracketAt = null;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${34}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
    );
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        console.log(
          `1929 (util/findClosingQuote) quick ending, ${i} is the matching quote`
        );
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `1937 (util/findClosingQuote) ${log(
          "set",
          "lastNonWhitespaceCharWasQuoteAt",
          lastNonWhitespaceCharWasQuoteAt
        )}`
      );
      if (
        i > idx &&
        (str[i] === "'" || str[i] === '"') &&
        withinTagInnerspace(str, i + 1)
      ) {
        console.log(`1951 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
      console.log("1954 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log(
          `1958 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) tag on the right - return i=${i}`
        );
        return i;
      }
      console.log(
        `1963 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) NOT tag on the right`
      );
    }
    else if (str[i].trim().length) {
      console.log("1969 (util/findClosingQuote)");
      if (str[i] === ">") {
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          console.log(
            `1976 (util/findClosingQuote) ${log(
              "!",
              "suitable candidate found"
            )}`
          );
          const temp = withinTagInnerspace(str, i);
          console.log(
            `1985 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
          );
          if (temp) {
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              console.log(
                `2008 (util/findClosingQuote) ${log(
                  "return",
                  "lastNonWhitespaceCharWasQuoteAt + 1",
                  lastNonWhitespaceCharWasQuoteAt + 1
                )}`
              );
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            console.log(
              `2017 (util/findClosingQuote) ${log(
                "return",
                "lastNonWhitespaceCharWasQuoteAt",
                lastNonWhitespaceCharWasQuoteAt
              )}`
            );
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        const whatFollowsEq = right(str, i);
        console.log(
          `2038 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );
        if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
          console.log("2048 (util/findClosingQuote)");
          console.log(
            `${`\u001b[${33}m${`lastNonWhitespaceCharWasQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharWasQuoteAt,
              null,
              4
            )}`
          );
          if (lastQuoteAt && withinTagInnerspace(str, lastQuoteAt + 1)) {
            console.log(
              `2060 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          } else if (!lastQuoteAt) {
            console.log(`2068 we don't have lastQuoteAt`);
            const startingPoint = str[i - 1].trim().length
              ? i - 1
              : left(str, i);
            let res;
            console.log(
              `2085 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
                startingPoint,
                null,
                4
              )}`
            );
            for (let y = startingPoint; y--; ) {
              console.log(
                `2093 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
              );
              if (!str[y].trim().length) {
                console.log(`2096 \u001b[${36}m${`break`}\u001b[${39}m`);
                res = left(str, y) + 1;
                break;
              }
            }
            console.log(
              `2102 ${`\u001b[${33}m${`RETURN`}\u001b[${39}m`}: ${JSON.stringify(
                res,
                null,
                4
              )}`
            );
            return res;
          }
          console.log("2111 recursive cycle didn't pass");
        } else if (str[i + 1].trim().length) {
          console.log("");
          console.log(
            `2116 it's not the expected quote but ${
              str[whatFollowsEq]
            } at index ${whatFollowsEq}`
          );
          let temp;
          for (let y = i; y--; ) {
            console.log(
              `2129 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
            );
            if (!str[y].trim().length) {
              temp = left(str, y);
              console.log(
                `2134 (util/findClosingQuote) ${log(
                  "set",
                  "temp",
                  temp
                )}, then BREAK`
              );
              break;
            }
          }
          if (charIsQuote(temp)) {
            console.log(
              `2145 (util/findClosingQuote) ${log("return", "temp", temp)}`
            );
            return temp;
          }
          console.log(
            `2150 (util/findClosingQuote) ${log(
              "return",
              "temp + 1",
              temp + 1
            )}`
          );
          return temp + 1;
        }
      } else if (str[i] !== "/") {
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          console.log(`2161 ██ tag on the right`);
          if (lastClosingBracketAt !== null) {
            console.log(
              `2164 (util/findClosingQuote) ${log(
                "return",
                "lastClosingBracketAt",
                lastClosingBracketAt
              )}`
            );
            return lastClosingBracketAt;
          }
        }
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          lastNonWhitespaceCharWasQuoteAt = null;
          console.log(
            `2178 (util/findClosingQuote) ${log(
              "set",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt
            )}`
          );
        }
      }
    }
    console.log(
      `2190 (util/findClosingQuote) ${log(
        "END",
        "lastNonWhitespaceCharWasQuoteAt",
        lastNonWhitespaceCharWasQuoteAt
      )}`
    );
  }
  return null;
}
function encodeChar(str, i) {
  if (
    str[i] === "&" &&
    (!str[i + 1] || str[i + 1] !== "a") &&
    (!str[i + 2] || str[i + 2] !== "m") &&
    (!str[i + 3] || str[i + 3] !== "p") &&
    (!str[i + 3] || str[i + 3] !== ";")
  ) {
    return {
      name: "bad-character-unencoded-ampersand",
      position: [[i, i + 1, "&amp;"]]
    };
  } else if (str[i] === "<") {
    return {
      name: "bad-character-unencoded-opening-bracket",
      position: [[i, i + 1, "&lt;"]]
    };
  } else if (str[i] === ">") {
    return {
      name: "bad-character-unencoded-closing-bracket",
      position: [[i, i + 1, "&gt;"]]
    };
  } else if (str[i] === '"') {
    return {
      name: "bad-character-unencoded-double-quotes",
      position: [[i, i + 1, "&quot;"]]
    };
  }
  return null;
}

var util = /*#__PURE__*/Object.freeze({
  charSuitableForTagName: charSuitableForTagName,
  charSuitableForAttrName: charSuitableForAttrName,
  charIsQuote: charIsQuote,
  notTagChar: notTagChar,
  isUppercaseLetter: isUppercaseLetter,
  isLowercase: isLowercase,
  isStr: isStr,
  lowAsciiCharacterNames: lowAsciiCharacterNames,
  log: log,
  isLatinLetter: isLatinLetter,
  withinTagInnerspace: withinTagInnerspace,
  right: right,
  left: left,
  attributeOnTheRight: attributeOnTheRight,
  findClosingQuote: findClosingQuote,
  encodeChar: encodeChar,
  tagOnTheRight: tagOnTheRight,
  onlyTheseLeadToThat: onlyTheseLeadToThat
});

const isArr = Array.isArray;
const {
  attributeOnTheRight: attributeOnTheRight$1,
  withinTagInnerspace: withinTagInnerspace$1,
  findClosingQuote: findClosingQuote$1,
  tagOnTheRight: tagOnTheRight$1,
  charIsQuote: charIsQuote$1,
  encodeChar: encodeChar$1,
  right: right$1,
  isStr: isStr$1,
  left: left$1,
  log: log$1
} = util;
function lint(str, originalOpts) {
  function pingTag(logTag) {
    console.log(`031 pingTag(): ${JSON.stringify(logTag, null, 4)}`);
  }
  if (!isStr$1(str)) {
    throw new Error(
      `emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  const defaults = {
    rules: "recommended",
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };
  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        msg: "emlint: [THROW_ID_03*]",
        schema: {
          rules: ["string", "object", "false", "null", "undefined"],
          style: ["object", "null", "undefined"],
          "style.line_endings_CR_LF_CRLF": ["string", "null", "undefined"]
        }
      });
      if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
        if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CR") {
            opts.style.line_endings_CR_LF_CRLF === "CR";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "lf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "LF") {
            opts.style.line_endings_CR_LF_CRLF === "LF";
          }
        } else if (
          opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf"
        ) {
          if (opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            opts.style.line_endings_CR_LF_CRLF === "CRLF";
          }
        } else {
          throw new Error(
            `emlint: [THROW_ID_04] opts.style.line_endings_CR_LF_CRLF should be either falsey or string "CR" or "LF" or "CRLF". It was given as:\n${JSON.stringify(
              opts.style.line_endings_CR_LF_CRLF,
              null,
              4
            )} (type is string)`
          );
        }
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (type ${typeof originalOpts})`
      );
    }
  } else {
    opts = clone(defaults);
  }
  console.log(
    `113 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  let rawEnforcedEOLChar;
  if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
    if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
      rawEnforcedEOLChar = "\r";
    } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
      rawEnforcedEOLChar = "\r\n";
    } else {
      rawEnforcedEOLChar = "\n";
    }
  }
  let doNothingUntil = null;
  let logTag;
  const defaultLogTag = {
    tagStartAt: null,
    tagEndAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    recognised: null,
    pureHTML: true,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  let logAttr;
  const defaultLogAttr = {
    attrStartAt: null,
    attrEndAt: null,
    attrNameStartAt: null,
    attrNameEndAt: null,
    attrName: null,
    attrValue: null,
    attrValueStartAt: null,
    attrValueEndAt: null,
    attrEqualAt: null,
    attrOpeningQuote: { pos: null, val: null },
    attrClosingQuote: { pos: null, val: null },
    recognised: null,
    pureHTML: true
  };
  function resetLogAttr() {
    logAttr = clone(defaultLogAttr);
  }
  resetLogAttr();
  let logWhitespace;
  const defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  const retObj = {
    issues: []
  };
  let tagIssueStaging = [];
  let rawIssueStaging = [];
  const logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };
  if (str.length === 0) {
    retObj.issues.push({
      name: "file-empty",
      position: [[0, 0]]
    });
    console.log(`238 ${log$1("push", "file-empty")}`);
  }
  for (let i = 0, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m ${`\u001b[${31}m${
        doNothingUntil ? `██ doNothingUntil ${doNothingUntil}` : ""
      }\u001b[${39}m`}`
    );
    if (doNothingUntil && i >= doNothingUntil) {
      doNothingUntil = null;
      console.log(`282 ${log$1("RESET", "doNothingUntil", doNothingUntil)}`);
    }
    if (!doNothingUntil && logTag.tagNameEndAt !== null) {
      console.log(
        `317 ${`\u001b[${90}m${`above catching the ending of an attribute's name`}\u001b[${39}m`}`
      );
      if (
        logAttr.attrNameStartAt !== null &&
        logAttr.attrNameEndAt === null &&
        logAttr.attrName === null &&
        !isLatinLetter(str[i])
      ) {
        logAttr.attrNameEndAt = i;
        logAttr.attrName = str.slice(
          logAttr.attrNameStartAt,
          logAttr.attrNameEndAt
        );
        console.log(
          `332 ${log$1(
            "SET",
            "logAttr.attrNameEndAt",
            logAttr.attrNameEndAt,
            "logAttr.attrName",
            logAttr.attrName
          )}`
        );
        if (str[i] !== "=") {
          if (str[right$1(str, i)] === "=") {
            console.log("347 equal to the right though");
          } else {
            console.log("350 not equal, so terminate attr");
          }
        }
      }
      console.log(
        `356 ${`\u001b[${90}m${`above catching what follows the attribute's name`}\u001b[${39}m`}`
      );
      if (
        logAttr.attrNameEndAt !== null &&
        logAttr.attrEqualAt === null &&
        i >= logAttr.attrNameEndAt &&
        str[i].trim().length
      ) {
        let temp;
        if (str[i] === "'" || str[i] === '"') {
          temp = attributeOnTheRight$1(str, i);
        }
        console.log(
          `370 ${`\u001b[${90}m${`inside catch what follows the attribute's name`}\u001b[${39}m`}`
        );
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
          console.log(
            `375 ${log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
          if (str[i + 1]) {
            const nextCharOnTheRightAt = right$1(str, i);
            if (str[nextCharOnTheRightAt] === "=") {
              console.log(`394 REPEATED EQUAL DETECTED`);
              let nextEqualStartAt = i + 1;
              let nextEqualEndAt = nextCharOnTheRightAt + 1;
              doNothingUntil = nextEqualEndAt;
              console.log(
                `404 ${log$1("set", "doNothingUntil", doNothingUntil)}`
              );
              console.log(
                `408 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
              );
              while (nextEqualStartAt && nextEqualEndAt) {
                console.log(`       ${`\u001b[${35}m${`*`}\u001b[${39}m`}`);
                retObj.issues.push({
                  name: "tag-attribute-repeated-equal",
                  position: [[nextEqualStartAt, nextEqualEndAt]]
                });
                console.log(
                  `417 ${log$1(
                    "push",
                    "tag-attribute-repeated-equal",
                    `${`[[${nextEqualStartAt}, ${nextEqualEndAt}]]`}`
                  )}`
                );
                const temp = right$1(str, nextEqualEndAt - 1);
                console.log(`425 ${log$1("set", "temp", temp)}`);
                if (str[temp] === "=") {
                  console.log(
                    `428 ${`\u001b[${36}m${`yes, there's "=" on the right`}\u001b[${39}m`}`
                  );
                  nextEqualStartAt = nextEqualEndAt;
                  nextEqualEndAt = temp + 1;
                  console.log(
                    `433 SET ${`\u001b[${36}m${`nextEqualStartAt = "${nextEqualStartAt}"; nextEqualEndAt = "${nextEqualEndAt};"`}\u001b[${39}m`}`
                  );
                  doNothingUntil = nextEqualEndAt;
                  console.log(
                    `440 ${log$1("set", "doNothingUntil", doNothingUntil)}`
                  );
                } else {
                  nextEqualStartAt = null;
                  console.log(
                    `445 ${log$1("set", "nextEqualStartAt", nextEqualStartAt)}`
                  );
                }
              }
              console.log(`       ${`\u001b[${35}m${`*`}\u001b[${39}m`}`);
            }
          }
        } else if (temp) {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          console.log(
            "479 quoted attribute's value on the right, equal is indeed missing"
          );
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          console.log(
            `487 ${log$1(
              "push",
              "tag-attribute-missing-equal",
              `${`[[${i}, ${i}, "="]]`}`
            )}`
          );
          logAttr.attrEqualAt = i;
          console.log(
            `496 ${log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
          logAttr.attrValueStartAt = i + 1;
          console.log(
            `501 ${log$1(
              "SET",
              "logAttr.attrValueStartAt",
              logAttr.attrValueStartAt
            )}`
          );
          logAttr.attrValueEndAt = temp;
          console.log(
            `510 ${log$1(
              "SET",
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = str[i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          console.log(
            `522 ${log$1(
              "SET",
              "logAttr.attrOpeningQuote",
              logAttr.attrOpeningQuote,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logAttr.attrValue = str.slice(i + 1, temp);
          console.log(
            `533 ${log$1("SET", "logAttr.attrValue", logAttr.attrValue)}`
          );
        } else {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`545 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
            console.log(
              `560 ${log$1(
                "push",
                "tag-attribute-space-between-name-and-equals",
                `${`[[${logWhitespace.startAt}, ${i}]]`}`
              )}`
            );
            resetLogWhitespace();
          } else if (isLatinLetter(str[i])) {
            logTag.attributes.push(clone(logAttr));
            console.log(`573 ${log$1("PUSH, then RESET", "logAttr")}`);
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                  console.log(
                    `588 ${log$1(
                      "push",
                      "tag-excessive-whitespace-inside-tag",
                      `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
                    )}`
                  );
                }
                console.log("595 dead end of excessive whitespace check");
              } else {
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
                console.log(
                  `603 ${log$1(
                    "push",
                    "tag-excessive-whitespace-inside-tag",
                    `${`[[${logWhitespace.startAt}, ${i}, " "]]`}`
                  )}`
                );
              }
            }
          }
        }
      }
      console.log(
        `618 ${`\u001b[${90}m${`above catching the begining of an attribute's name`}\u001b[${39}m`}`
      );
      if (logAttr.attrStartAt === null && isLatinLetter(str[i])) {
        console.log(
          `623 ${`\u001b[${90}m${`inside catching the begining of an attribute's name`}\u001b[${39}m`}`
        );
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        console.log(
          `628 ${log$1(
            "SET",
            "logAttr.attrStartAt",
            logAttr.attrStartAt,
            "logAttr.attrNameStartAt",
            logAttr.attrNameStartAt
          )}`
        );
        if (logWhitespace.startAt !== null && logWhitespace.startAt < i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
            console.log(
              `650 ${log$1(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
              )}`
            );
          } else {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i, " "]]
            });
            console.log(
              `663 ${log$1(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt}, ${i}, " "]]`}`
              )}`
            );
          }
        }
      }
      console.log(
        `674 ${`\u001b[${90}m${`above catching what follows attribute's equal`}\u001b[${39}m`}`
      );
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos === null
      ) {
        console.log(
          `682 ${`\u001b[${90}m${`inside catching what follows attribute's equal`}\u001b[${39}m`}`
        );
        if (logAttr.attrEqualAt < i && str[i].trim().length) {
          console.log("685 catching what follows equal");
          if (charcode === 34 || charcode === 39) {
            if (logWhitespace.startAt && logWhitespace.startAt < i) {
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `696 ${log$1(
                  "push",
                  "tag-attribute-space-between-equals-and-opening-quotes",
                  `${JSON.stringify([[logWhitespace.startAt, i]], null, 0)}`
                )}`
              );
            }
            resetLogWhitespace();
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = str[i];
            const closingQuotePeek = findClosingQuote$1(str, i);
            console.log(
              `710 ${log$1("set", "closingQuotePeek", closingQuotePeek)}`
            );
            if (closingQuotePeek) {
              if (str[closingQuotePeek] !== str[i]) {
                if (
                  str[closingQuotePeek] === "'" ||
                  str[closingQuotePeek] === '"'
                ) {
                  const isDouble = str[closingQuotePeek] === '"';
                  const name = `tag-attribute-mismatching-quotes-is-${
                    isDouble ? "double" : "single"
                  }`;
                  retObj.issues.push({
                    name: name,
                    position: [
                      [
                        closingQuotePeek,
                        closingQuotePeek + 1,
                        `${isDouble ? "'" : '"'}`
                      ]
                    ]
                  });
                  console.log(
                    `741 ${log$1(
                      "push",
                      name,
                      `${`[[${closingQuotePeek}, ${closingQuotePeek + 1}, ${
                        isDouble ? "'" : '"'
                      }]]`}`
                    )}`
                  );
                } else {
                  let compensation = "";
                  if (
                    str[closingQuotePeek - 1] &&
                    str[closingQuotePeek] &&
                    str[closingQuotePeek - 1].trim().length &&
                    str[closingQuotePeek].trim().length &&
                    str[closingQuotePeek] !== "/" &&
                    str[closingQuotePeek] !== ">"
                  ) {
                    compensation = " ";
                  }
                  let fromPositionToInsertAt = str[closingQuotePeek - 1].trim()
                    .length
                    ? closingQuotePeek
                    : left$1(str, closingQuotePeek) + 1;
                  console.log(
                    `774 ${log$1(
                      "set",
                      "fromPositionToInsertAt",
                      fromPositionToInsertAt
                    )}`
                  );
                  let toPositionToInsertAt = closingQuotePeek;
                  console.log(
                    `782 ${log$1(
                      "set",
                      "toPositionToInsertAt",
                      toPositionToInsertAt
                    )}`
                  );
                  if (str[left$1(str, closingQuotePeek)] === "/") {
                    console.log("790 SLASH ON THE LEFT");
                    toPositionToInsertAt = left$1(str, closingQuotePeek);
                    if (toPositionToInsertAt + 1 < closingQuotePeek) {
                      retObj.issues.push({
                        name: "tag-whitespace-closing-slash-and-bracket",
                        position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                      });
                      console.log(
                        `799 ${log$1(
                          "push",
                          "tag-whitespace-closing-slash-and-bracket",
                          `${`[[${toPositionToInsertAt +
                            1}, ${closingQuotePeek}]]`}`
                        )}`
                      );
                    }
                    fromPositionToInsertAt =
                      left$1(str, toPositionToInsertAt) + 1;
                    console.log(
                      `812 ${log$1(
                        "set",
                        "toPositionToInsertAt",
                        toPositionToInsertAt,
                        "fromPositionToInsertAt",
                        fromPositionToInsertAt
                      )}`
                    );
                  }
                  retObj.issues.push({
                    name: "tag-attribute-closing-quotation-mark-missing",
                    position: [
                      [
                        fromPositionToInsertAt,
                        toPositionToInsertAt,
                        `${str[i]}${compensation}`
                      ]
                    ]
                  });
                  console.log(
                    `833 ${log$1(
                      "push",
                      "tag-attribute-closing-quotation-mark-missing",
                      `${`[[${closingQuotePeek}, ${closingQuotePeek}, ${`${
                        str[i]
                      }${compensation}`}]]`}`
                    )}`
                  );
                }
              }
              logAttr.attrClosingQuote.pos = closingQuotePeek;
              logAttr.attrClosingQuote.val = str[i];
              logAttr.attrValue = str.slice(i + 1, closingQuotePeek);
              logAttr.attrValueStartAt = i + 1;
              logAttr.attrValueEndAt = closingQuotePeek;
              logAttr.attrEndAt = closingQuotePeek;
              console.log(
                `851 ${log$1(
                  "set",
                  "logAttr.attrClosingQuote",
                  logAttr.attrClosingQuote,
                  "logAttr.attrValue",
                  logAttr.attrValue,
                  "logAttr.attrValueStartAt",
                  logAttr.attrValueStartAt,
                  "logAttr.attrValueEndAt",
                  logAttr.attrValueEndAt,
                  "logAttr.attrEndAt",
                  logAttr.attrEndAt
                )}`
              );
              for (let y = i + 1; y < closingQuotePeek; y++) {
                const newIssue = encodeChar$1(str, y);
                if (newIssue) {
                  tagIssueStaging.push(newIssue);
                  console.log(
                    `877 ${log$1("push tagIssueStaging", "newIssue", newIssue)}`
                  );
                }
              }
              if (rawIssueStaging.length) {
                console.log(
                  `886 ${`\u001b[${31}m${`██`}\u001b[${39}m`} raw stage present!`
                );
              }
              logTag.attributes.push(clone(logAttr));
              console.log(`892 ${log$1("PUSH, then RESET", "logAttr")}`);
              resetLogAttr();
              if (str[closingQuotePeek].trim().length) {
                i = closingQuotePeek;
              } else {
                i = left$1(str, closingQuotePeek);
              }
              console.log(`907 ${log$1("set", "i", i, "then CONTINUE")}`);
              if (
                i === len - 1 &&
                logTag.tagStartAt !== null &&
                ((logAttr.attrEqualAt !== null &&
                  logAttr.attrOpeningQuote.pos !== null) ||
                  logTag.attributes.some(
                    attrObj =>
                      attrObj.attrEqualAt !== null &&
                      attrObj.attrOpeningQuote.pos !== null
                  ))
              ) {
                retObj.issues.push({
                  name: "tag-missing-closing-bracket",
                  position: [[i + 1, i + 1, ">"]]
                });
                console.log(
                  `927 ${log$1(
                    "push",
                    "tag-missing-closing-bracket",
                    `${`[[${i + 1}, ${i + 1}, ">"]]`}`
                  )}`
                );
              }
              continue;
            }
          } else if (charcode === 8220 || charcode === 8221) {
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `"`;
            console.log(
              `945 ${log$1(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote
              )}`
            );
            const name =
              charcode === 8220
                ? "tag-attribute-left-double-quotation-mark"
                : "tag-attribute-right-double-quotation-mark";
            retObj.issues.push({
              name,
              position: [[i, i + 1, `"`]]
            });
            console.log(
              `962 ${log$1("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );
            logAttr.attrValueStartAt = i + 1;
            console.log(
              `967 ${log$1(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
          } else if (charcode === 8216 || charcode === 8217) {
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = `'`;
            console.log(
              `981 ${log$1(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote
              )}`
            );
            const name =
              charcode === 8216
                ? "tag-attribute-left-single-quotation-mark"
                : "tag-attribute-right-single-quotation-mark";
            retObj.issues.push({
              name,
              position: [[i, i + 1, `'`]]
            });
            console.log(
              `998 ${log$1("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
            );
            logAttr.attrValueStartAt = i + 1;
            console.log(
              `1003 ${log$1(
                "set",
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
          } else if (!withinTagInnerspace$1(str, i)) {
            console.log(
              `1011 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`false`}\u001b[${39}m`}`
            );
            const closingQuotePeek = findClosingQuote$1(str, i);
            console.log(`1017 ███████████████████████████████████████`);
            console.log(
              `1019 ${log$1("set", "closingQuotePeek", closingQuotePeek)}`
            );
            const quoteValToPut = charIsQuote$1(str[closingQuotePeek])
              ? str[closingQuotePeek]
              : `"`;
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[left$1(str, i) + 1, i, quoteValToPut]]
            });
            console.log(
              `1032 ${log$1(
                "push",
                "tag-attribute-opening-quotation-mark-missing",
                `${`[[${left$1(str, i) + 1}, ${i}, ${quoteValToPut}]]`}`
              )}`
            );
            logAttr.attrOpeningQuote = {
              pos: i,
              val: quoteValToPut
            };
            logAttr.attrValueStartAt = i;
            console.log(
              `1046 mark opening quote: ${log$1(
                "set",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote,
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt
              )}`
            );
            console.log("1058 traverse forward\n\n\n");
            let closingBracketIsAt = null;
            let innerTagEndsAt = null;
            for (let y = i; y < len; y++) {
              console.log(
                `1085 \u001b[${36}m${`str[${y}] = "${str[y]}"`}\u001b[${39}m`
              );
              if (
                str[y] === ">" &&
                ((str[left$1(str, y)] !== "/" && withinTagInnerspace$1(str, y)) ||
                  str[left$1(str, y)] === "/")
              ) {
                const leftAt = left$1(str, y);
                closingBracketIsAt = y;
                console.log(
                  `1095 ${log$1(
                    "set",
                    "leftAt",
                    leftAt,
                    "closingBracketIsAt",
                    closingBracketIsAt
                  )}`
                );
                innerTagEndsAt = y;
                if (str[leftAt] === "/") {
                  innerTagEndsAt = leftAt;
                  console.log(
                    `1107 ${log$1("set", "innerTagEndsAt", innerTagEndsAt)}`
                  );
                }
              }
              const dealBrakerCharacters = `=<`;
              if (
                innerTagEndsAt !== null &&
                dealBrakerCharacters.includes(str[y])
              ) {
                console.log(
                  `1119 \u001b[${36}m${`break ("${
                    str[y]
                  }" is a bad character)`}\u001b[${39}m`
                );
                break;
              }
            }
            console.log(
              `1127 ${log$1(
                "set",
                "closingBracketIsAt",
                closingBracketIsAt,
                "innerTagEndsAt",
                innerTagEndsAt
              )}`
            );
            let innerTagContents;
            if (i < innerTagEndsAt) {
              innerTagContents = str.slice(i, innerTagEndsAt);
            } else {
              innerTagContents = "";
            }
            console.log(
              `1143 ${log$1("set", "innerTagContents", innerTagContents)}`
            );
            let startingPoint = innerTagEndsAt;
            let attributeOnTheRightBeginsAt;
            if (innerTagContents.includes("=")) {
              console.log(`1158 inner tag contents include an equal character`);
              const temp1 = innerTagContents.split("=")[0];
              console.log(`1171 ${log$1("set", "temp1", temp1)}`);
              if (temp1.split("").some(char => !char.trim().length)) {
                console.log(
                  "1176 traverse backwards to find beginning of the attr on the right\n\n\n"
                );
                for (let z = i + temp1.length; z--; ) {
                  console.log(
                    `1181 \u001b[${35}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                  );
                  if (!str[z].trim().length) {
                    attributeOnTheRightBeginsAt = z + 1;
                    console.log(
                      `1189 ${log$1(
                        "set",
                        "attributeOnTheRightBeginsAt",
                        attributeOnTheRightBeginsAt,
                        "then BREAK"
                      )}`
                    );
                    break;
                  }
                  if (z === i) {
                    break;
                  }
                }
                console.log("\n\n\n");
                console.log(
                  `1206 ${log$1(
                    "log",
                    "attributeOnTheRightBeginsAt",
                    attributeOnTheRightBeginsAt
                  )}`
                );
                const temp2 = left$1(str, attributeOnTheRightBeginsAt);
                if (!charIsQuote$1(temp2)) {
                  startingPoint = temp2 + 1;
                }
              }
            } else {
              console.log(
                `1222 inner tag contents don't include an equal character`
              );
            }
            let caughtAttrEnd = null;
            let caughtAttrStart = null;
            let finalClosingQuotesShouldBeAt = null;
            let boolAttrFound = false;
            console.log("\n\n\n\n\n\n");
            console.log(
              `1238 ${`\u001b[${31}m${`TRAVERSE BACKWARDS`}\u001b[${39}m`}; startingPoint=${startingPoint}`
            );
            for (let z = startingPoint; z--; z > i) {
              console.log(
                `1243 ${`\u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`}`
              );
              if (str[z] === "=") {
                console.log(`1247 ${log$1("break")}`);
                break;
              }
              if (caughtAttrEnd === null && str[z].trim().length) {
                caughtAttrEnd = z + 1;
                console.log(
                  `1255 ${log$1("set", "caughtAttrEnd", caughtAttrEnd)}`
                );
                if (boolAttrFound) {
                  finalClosingQuotesShouldBeAt = caughtAttrEnd;
                  console.log(
                    `1262 ${log$1(
                      "set",
                      "finalClosingQuotesShouldBeAt",
                      finalClosingQuotesShouldBeAt
                    )}`
                  );
                  boolAttrFound = false;
                  console.log(
                    `1271 ${log$1("set", "boolAttrFound", boolAttrFound)}`
                  );
                }
              }
              if (!str[z].trim().length && caughtAttrEnd) {
                caughtAttrStart = z + 1;
                console.log(
                  `1279 ${`\u001b[${35}m${`ATTR`}\u001b[${39}m`}: ${str.slice(
                    caughtAttrStart,
                    caughtAttrEnd
                  )} (${caughtAttrStart}-${caughtAttrEnd})`
                );
                if (str[right$1(str, caughtAttrEnd)] === "=") {
                  const temp1 = left$1(str, caughtAttrStart);
                  if (!charIsQuote$1(str[temp1])) {
                    attributeOnTheRightBeginsAt = right$1(str, temp1 + 1);
                    console.log(
                      `1353 ${log$1(
                        "set",
                        "attributeOnTheRightBeginsAt",
                        attributeOnTheRightBeginsAt
                      )}`
                    );
                  }
                  break;
                } else {
                  if (
                    knownBooleanHTMLAttributes.includes(
                      str.slice(caughtAttrStart, caughtAttrEnd)
                    )
                  ) {
                    boolAttrFound = true;
                    console.log(
                      `1372 ${log$1("set", "boolAttrFound", boolAttrFound)}`
                    );
                  } else {
                    console.log(`1376 ${log$1("break")}`);
                    break;
                  }
                }
                caughtAttrEnd = null;
                caughtAttrStart = null;
                console.log(
                  `1385 ${log$1(
                    "reset",
                    "caughtAttrEnd",
                    caughtAttrEnd,
                    "caughtAttrStart",
                    caughtAttrStart
                  )}`
                );
              }
            }
            console.log(
              `1396 ${`\u001b[${31}m${`TRAVERSE ENDED`}\u001b[${39}m`}`
            );
            console.log(
              `1405 ${log$1(
                "log",
                "finalClosingQuotesShouldBeAt",
                finalClosingQuotesShouldBeAt,
                "attributeOnTheRightBeginsAt",
                attributeOnTheRightBeginsAt
              )}`
            );
            if (!finalClosingQuotesShouldBeAt && attributeOnTheRightBeginsAt) {
              finalClosingQuotesShouldBeAt =
                left$1(str, attributeOnTheRightBeginsAt) + 1;
              console.log(
                `1419 ${log$1(
                  "log",
                  "attributeOnTheRightBeginsAt",
                  attributeOnTheRightBeginsAt
                )}`
              );
              console.log(
                `1426 ${log$1(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }
            console.log(
              `1435 ██ ${log$1(
                "log",
                "caughtAttrEnd",
                caughtAttrEnd,
                "left(str, caughtAttrEnd)",
                left$1(str, caughtAttrEnd)
              )}`
            );
            if (
              caughtAttrEnd &&
              logAttr.attrOpeningQuote &&
              !finalClosingQuotesShouldBeAt &&
              str[left$1(str, caughtAttrEnd)] !== logAttr.attrOpeningQuote.val
            ) {
              finalClosingQuotesShouldBeAt = caughtAttrEnd;
              console.log(
                `1452 ${log$1(
                  "set",
                  "finalClosingQuotesShouldBeAt",
                  finalClosingQuotesShouldBeAt
                )}`
              );
            }
            console.log(
              `1461 ${`\u001b[${32}m${`██`} \u001b[${39}m`} ${`\u001b[${33}m${`finalClosingQuotesShouldBeAt`}\u001b[${39}m`} = ${JSON.stringify(
                finalClosingQuotesShouldBeAt,
                null,
                4
              )}`
            );
            if (finalClosingQuotesShouldBeAt) {
              retObj.issues.push({
                name: "tag-attribute-closing-quotation-mark-missing",
                position: [
                  [
                    finalClosingQuotesShouldBeAt,
                    finalClosingQuotesShouldBeAt,
                    logAttr.attrOpeningQuote.val
                  ]
                ]
              });
              console.log(
                `1483 ${log$1(
                  "push",
                  "tag-attribute-closing-quotation-mark-missing",
                  `${`[[${finalClosingQuotesShouldBeAt}, ${finalClosingQuotesShouldBeAt}, ${
                    logAttr.attrOpeningQuote.val
                  }]]`}`
                )}`
              );
              logAttr.attrClosingQuote.pos = finalClosingQuotesShouldBeAt;
              logAttr.attrValueEndAt = finalClosingQuotesShouldBeAt;
              logAttr.attrEndAt = finalClosingQuotesShouldBeAt + 1;
            } else {
              logAttr.attrClosingQuote.pos = left$1(str, caughtAttrEnd);
              logAttr.attrValueEndAt = logAttr.attrClosingQuote.pos;
              logAttr.attrEndAt = caughtAttrEnd;
            }
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            logAttr.attrValue = str.slice(
              logAttr.attrOpeningQuote.pos,
              logAttr.attrClosingQuote.pos
            );
            console.log(
              `1511 ${log$1(
                "set",
                "logAttr.attrClosingQuote.pos",
                logAttr.attrClosingQuote.pos,
                "logAttr.attrClosingQuote.val",
                logAttr.attrClosingQuote.val,
                "logAttr.attrValueEndAt",
                logAttr.attrValueEndAt,
                "logAttr.attrEndAt",
                logAttr.attrEndAt,
                "logAttr.attrValue",
                logAttr.attrValue
              )}`
            );
            if (logAttr.attrValueStartAt < logAttr.attrValueEndAt) {
              for (
                let z = logAttr.attrValueStartAt;
                z < logAttr.attrValueEndAt;
                z++
              ) {
                console.log(
                  `1534 \u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m`
                );
                const temp = encodeChar$1(str, z);
                if (temp) {
                  retObj.issues.push(temp);
                  console.log(
                    `1540 ${log$1("push", "unencoded character", temp)}`
                  );
                }
              }
            }
            if (!doNothingUntil) {
              doNothingUntil = logAttr.attrClosingQuote.pos;
              logWhitespace.startAt = null;
              console.log(
                `1552 ${log$1(
                  "set",
                  "doNothingUntil",
                  doNothingUntil,
                  "logWhitespace.startAt",
                  logWhitespace.startAt
                )}`
              );
            }
            console.log(`1563 ${log$1("about to push", "logAttr", logAttr)}`);
            logTag.attributes.push(clone(logAttr));
            console.log(
              `1566 ${log$1("PUSH, then RESET", "logAttr", "then CONTINUE")}`
            );
            resetLogAttr();
            continue;
          } else {
            console.log(
              `1576 \u001b[${33}m${`██`}\u001b[${39}m - withinTagInnerspace() ${`\u001b[${32}m${`true`}\u001b[${39}m`}`
            );
            let start = logAttr.attrStartAt;
            const temp = right$1(str, i);
            console.log(`1590 ${log$1("set", "start", start, "temp", temp)}`);
            if (
              (str[i] === "/" && temp && str[temp] === ">") ||
              str[i] === ">"
            ) {
              for (let y = logAttr.attrStartAt; y--; ) {
                if (str[y].trim().length) {
                  start = y + 1;
                  break;
                }
              }
            }
            retObj.issues.push({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[start, i]]
            });
            console.log(
              `1609 ${log$1(
                "push",
                "tag-attribute-quote-and-onwards-missing",
                `${`[[${start}, ${i}]]`}`
              )}`
            );
            console.log(`1616 ${log$1("reset", "logWhitespace")}`);
            resetLogWhitespace();
            console.log(`1618 ${log$1("reset", "logAttr")}`);
            resetLogAttr();
          }
          console.log(
            `1623 ${log$1(
              "SET",
              "logAttr.attrOpeningQuote.pos",
              logAttr.attrOpeningQuote.pos,
              "logAttr.attrOpeningQuote.val",
              logAttr.attrOpeningQuote.val
            )}`
          );
          if (logWhitespace.startAt !== null) {
            if (str[i] === "'" || str[i] === '"') {
              retObj.issues.push({
                name: "tag-attribute-space-between-equals-and-opening-quotes",
                position: [[logWhitespace.startAt, i]]
              });
              console.log(
                `1641 ${log$1(
                  "push",
                  "tag-attribute-space-between-equals-and-opening-quotes",
                  `${`[[${logWhitespace.startAt}, ${i}]]`}`
                )}`
              );
            } else if (withinTagInnerspace$1(str, i + 1)) {
              retObj.issues.push({
                name: "tag-attribute-quote-and-onwards-missing",
                position: [[logAttr.attrStartAt, i]]
              });
              console.log(
                `1656 ${log$1(
                  "push",
                  "tag-attribute-quote-and-onwards-missing",
                  `${`[[${logAttr.attrStartAt}, ${i}]]`}`
                )}`
              );
              console.log(`1662 ${log$1("reset", "logAttr")}`);
              resetLogAttr();
            }
          }
        } else if (!str[i + 1] || !right$1(str, i)) {
          console.log("1667");
          retObj.issues.push({
            name: "file-missing-ending",
            position: [[i + 1, i + 1]]
          });
          console.log(
            `1673 ${log$1(
              "push",
              "tag-attribute-quote-and-onwards-missing",
              `${`[[${i + 1}, ${i + 1}]]`}`
            )}`
          );
        }
      }
      console.log(
        `1683 ${`\u001b[${90}m${`above catching closing quote (single or double)`}\u001b[${39}m`}`
      );
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos !== null &&
        (logAttr.attrClosingQuote.pos === null ||
          i === logAttr.attrClosingQuote.pos) &&
        i > logAttr.attrOpeningQuote.pos &&
        charIsQuote$1(str[i])
      ) {
        console.log(
          `1695 ${`\u001b[${90}m${`inside catching closing quote (single or double)`}\u001b[${39}m`}`
        );
        if (charcode === 34 || charcode === 39) {
          const issueName = `tag-attribute-mismatching-quotes-is-${
            charcode === 34 ? "double" : "single"
          }`;
          if (
            str[i] !== logAttr.attrOpeningQuote.val &&
            (!retObj.issues.length ||
              !retObj.issues.some(issueObj => {
                return (
                  issueObj.name === issueName &&
                  issueObj.position.length === 1 &&
                  issueObj.position[0][0] === i &&
                  issueObj.position[0][1] === i + 1
                );
              }))
          ) {
            retObj.issues.push({
              name: issueName,
              position: [[i, i + 1, `${charcode === 34 ? "'" : '"'}`]]
            });
            console.log(
              `1723 ${log$1(
                "push",
                issueName,
                `${`[[${i}, ${i + 1}, ${charcode === 34 ? "'" : '"'}]]`}`
              )}`
            );
          } else {
            console.log(
              `1731 ${`\u001b[${31}m${`didn't push an issue`}\u001b[${39}m`}`
            );
          }
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = str[i];
          console.log(
            `1742 ${log$1(
              "SET",
              "logAttr.attrClosingQuote.pos",
              logAttr.attrClosingQuote.pos,
              "logAttr.attrClosingQuote.val",
              logAttr.attrClosingQuote.val
            )}`
          );
          if (logAttr.attrValue === null) {
            if (
              logAttr.attrOpeningQuote.pos &&
              logAttr.attrClosingQuote.pos &&
              logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos
            ) {
              logAttr.attrValue = str.slice(
                logAttr.attrOpeningQuote.pos,
                logAttr.attrClosingQuote.pos
              );
            } else {
              logAttr.attrValue = "";
            }
            console.log(
              `1770 ${log$1("SET", "logAttr.attrValue", logAttr.attrValue)}`
            );
          }
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          console.log(
            `1778 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1789 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8220 || charcode === 8221)
        ) {
          const name =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: name,
            position: [[i, i + 1, '"']]
          });
          console.log(
            `1811 ${log$1("push", name, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          console.log(
            `1819 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1830 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8216 || charcode === 8217) &&
          ((right$1(str, i) !== null &&
            (str[right$1(str, i)] === ">" || str[right$1(str, i)] === "/")) ||
            withinTagInnerspace$1(str, i + 1))
        ) {
          const name =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: name,
            position: [[i, i + 1, `'`]]
          });
          console.log(
            `1851 ${log$1("push", name, `${`[[${i}, ${i + 1}, "'"]]`}`)}`
          );
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          console.log(
            `1859 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1870 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        }
      }
      console.log(`1878 ${`\u001b[${90}m${`error clauses`}\u001b[${39}m`}`);
      if (
        logAttr.attrOpeningQuote.val &&
        logAttr.attrOpeningQuote.pos < i &&
        logAttr.attrClosingQuote.pos === null &&
        ((str[i] === "/" && right$1(str, i) && str[right$1(str, i)] === ">") ||
          str[i] === ">")
      ) {
        console.log("1889 inside error catch clauses");
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        console.log(
          `1896 ${log$1(
            "push",
            "tag-attribute-closing-quotation-mark-missing",
            `${`[[${i}, ${i}, ${logAttr.attrOpeningQuote.val}]]`}`
          )}`
        );
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log(
          `1906 ${log$1(
            "set",
            "logAttr.attrClosingQuote",
            logAttr.attrClosingQuote
          )}`
        );
        logTag.attributes.push(clone(logAttr));
        console.log(`1914 ${log$1("PUSH, then RESET", "logAttr")}`);
        resetLogAttr();
      }
    }
    if (!doNothingUntil && charcode < 32) {
      const name = `bad-character-${lowAsciiCharacterNames[charcode]}`;
      if (charcode === 9) {
        retObj.issues.push({
          name,
          position: [[i, i + 1, "  "]]
        });
        console.log(`1942 PUSH "${name}", [[${i}, ${i + 1}, "  "]]`);
      } else if (charcode === 13) {
        if (isStr$1(str[i + 1]) && str[i + 1].charCodeAt(0) === 10) {
          if (
            opts.style &&
            opts.style.line_endings_CR_LF_CRLF &&
            opts.style.line_endings_CR_LF_CRLF !== "CRLF"
          ) {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-CRLF",
              position: [[i, i + 2, rawEnforcedEOLChar]]
            });
            console.log(
              `1961 ${log$1(
                "push",
                "file-wrong-type-line-ending-CRLF",
                `${`[[${i}, ${i + 2}, ${JSON.stringify(
                  rawEnforcedEOLChar,
                  null,
                  0
                )}]]`}`
              )}`
            );
          } else {
            logLineEndings.crlf.push([i, i + 2]);
            console.log(
              `1975 ${log$1("logLineEndings.crlf push", `[${i}, ${i + 2}]`)}`
            );
          }
        } else {
          if (
            opts.style &&
            opts.style.line_endings_CR_LF_CRLF &&
            opts.style.line_endings_CR_LF_CRLF !== "CR"
          ) {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-CR",
              position: [[i, i + 1, rawEnforcedEOLChar]]
            });
            console.log(
              `1991 ${log$1(
                "push",
                "file-wrong-type-line-ending-CR",
                `${`[[${i}, ${i + 1}, ${JSON.stringify(
                  rawEnforcedEOLChar,
                  null,
                  0
                )}]]`}`
              )}`
            );
          } else {
            logLineEndings.cr.push([i, i + 1]);
            console.log(
              `2005 ${log$1("logLineEndings.cr push", `[${i}, ${i + 1}]`)}`
            );
          }
        }
      } else if (charcode === 10) {
        if (!(isStr$1(str[i - 1]) && str[i - 1].charCodeAt(0) === 13)) {
          if (
            opts.style &&
            opts.style.line_endings_CR_LF_CRLF &&
            opts.style.line_endings_CR_LF_CRLF !== "LF"
          ) {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-LF",
              position: [[i, i + 1, rawEnforcedEOLChar]]
            });
            console.log(
              `2025 ${log$1(
                "push",
                "file-wrong-type-line-ending-LF",
                `${`[[${i}, ${i + 1}, ${JSON.stringify(
                  rawEnforcedEOLChar,
                  null,
                  0
                )}]]`}`
              )}`
            );
          } else {
            logLineEndings.lf.push([i, i + 1]);
            console.log(
              `2039 ${log$1("logLineEndings.lf push", `[${i}, ${i + 1}]`)}`
            );
          }
        }
      } else {
        retObj.issues.push({
          name,
          position: [[i, i + 1]]
        });
        console.log(`2049 ${log$1("push", name, `${`[[${i}, ${i + 1}]]`}`)}`);
      }
    } else if (!doNothingUntil && encodeChar$1(str, i)) {
      const newIssue = encodeChar$1(str, i);
      console.log(
        `2054 ${`\u001b[${31}m${`██`}\u001b[${39}m`} new issue: ${JSON.stringify(
          newIssue,
          null,
          0
        )}`
      );
      rawIssueStaging.push(newIssue);
      console.log(
        `2062 push above issue to ${`\u001b[${36}m${`rawIssueStaging`}\u001b[${39}m`}`
      );
    }
    if (
      !doNothingUntil &&
      logWhitespace.startAt !== null &&
      str[i].trim().length
    ) {
      console.log(
        `2074 ${`\u001b[${90}m${`inside whitespace chunks ending clauses`}\u001b[${39}m`}`
      );
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" && "<>".includes(str[right$1(str, i)])))
      ) {
        console.log("2083");
        let name = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name = "tag-whitespace-closing-slash-and-bracket";
        }
        retObj.issues.push({
          name: name,
          position: [[logWhitespace.startAt, i]]
        });
        console.log(
          `2096 ${log$1("push", name, `${`[[${logWhitespace.startAt}, ${i}]]`}`)}`
        );
      }
    }
    if (
      !doNothingUntil &&
      !str[i].trim().length &&
      logWhitespace.startAt === null
    ) {
      logWhitespace.startAt = i;
      console.log(
        `2109 ${log$1("set", "logWhitespace.startAt", logWhitespace.startAt)}`
      );
    }
    if ((!doNothingUntil && str[i] === "\n") || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `2118 ${log$1(
            "set",
            "logWhitespace.includesLinebreaks",
            logWhitespace.includesLinebreaks
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
      console.log(
        `2127 ${log$1(
          "set",
          "logWhitespace.lastLinebreakAt",
          logWhitespace.lastLinebreakAt
        )}`
      );
    }
    console.log("2135");
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      !isLatinLetter(str[i]) &&
      str[i] !== "<" &&
      str[i] !== "/"
    ) {
      console.log("2147 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log(
        `2152 ${log$1(
          "set",
          "logTag.tagNameEndAt",
          logTag.tagNameEndAt,
          "logTag.tagName",
          logTag.tagName,
          "logTag.recognised",
          logTag.recognised
        )}`
      );
    }
    console.log("2164");
    if (
      !doNothingUntil &&
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      console.log(
        `2175 ${log$1("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)}`
      );
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
        console.log(
          `2185 ${log$1(
            "stage",
            "tag-space-after-opening-bracket",
            `${`[[${logTag.tagStartAt + 1}, ${i}]]`}`
          )}`
        );
      }
    }
    if (
      !doNothingUntil &&
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      isUppercaseLetter(str[i])
    ) {
      retObj.issues.push({
        name: "tag-name-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
      console.log(
        `2206 ${log$1(
          "push",
          "tag-name-lowercase",
          `${`[[${i}, ${i + 1}, ${JSON.stringify(
            str[i].toLowerCase(),
            null,
            4
          )}]]`}`
        )}`
      );
    }
    if (!doNothingUntil && str[i] === "<") {
      console.log(
        `2221 catch the beginning of a tag ${`\u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`}`
      );
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = i;
        console.log(
          `2227 ${log$1("set", "logTag.tagStartAt", logTag.tagStartAt)}`
        );
      } else if (tagOnTheRight$1(str, i)) {
        console.log(
          `2233 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new tag starts`
        );
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.length &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null &&
              attrObj.attrOpeningQuote.pos !== null
          )
        ) {
          console.log(
            `2249 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)`
          );
          const lastNonWhitespaceOnLeft = left$1(str, i);
          console.log(
            `2263 ${log$1(
              "set",
              "lastNonWhitespaceOnLeft",
              lastNonWhitespaceOnLeft
            )}`
          );
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log(
              `2276 ${log$1("set", "logTag.tagEndAt", logTag.tagEndAt)}`
            );
          } else {
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
            console.log(
              `2286 ${log$1(
                "push",
                "tag-missing-closing-bracket",
                `${`[[${lastNonWhitespaceOnLeft + 1}, ${i}, ">"]]`}`
              )}`
            );
          }
          if (rawIssueStaging.length) {
            console.log(
              `2296 let's process all ${
                rawIssueStaging.length
              } raw character issues at staging`
            );
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
                console.log(`2303 ${log$1("push", "issueObj", issueObj)}`);
              } else {
                console.log(
                  `2306 discarding ${JSON.stringify(issueObj, null, 4)}`
                );
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          console.log(
            `2320 ${log$1("reset", "logTag & logAttr && rawIssueStaging")}`
          );
          logTag.tagStartAt = i;
          console.log(
            `2326 ${log$1("set", "logTag.tagStartAt", logTag.tagStartAt)}`
          );
        } else {
          console.log(`2329 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS`);
          if (rawIssueStaging.length) {
            console.log(
              `2334 ${log$1("processing", "rawIssueStaging", rawIssueStaging)}`
            );
            console.log(
              `2337 ${log$1("log", "logTag.tagStartAt", logTag.tagStartAt)}`
            );
            console.log(
              `2340 ${`\u001b[${31}m${JSON.stringify(
                logAttr,
                null,
                4
              )}\u001b[${39}m`}`
            );
            rawIssueStaging.forEach(issueObj => {
              if (
                issueObj.position[0][0] < i
              ) {
                retObj.issues.push(issueObj);
                console.log(`2353 ${log$1("push", "issueObj", issueObj)}`);
              } else {
                console.log("");
                console.log(
                  `2357 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                    issueObj,
                    null,
                    4
                  )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                    issueObj.position[0][0]
                  } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                    logTag.tagStartAt
                  }`
                );
              }
            });
            console.log(`2369 wipe rawIssueStaging`);
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            console.log(`2375 ${log$1("wipe", "tagIssueStaging")}`);
            tagIssueStaging = [];
          }
        }
      }
    }
    if (
      !doNothingUntil &&
      charcode === 62 &&
      logTag.tagStartAt !== null &&
      (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < i)
    ) {
      if (tagIssueStaging.length) {
        console.log(
          `2392 concat ${`\u001b[${33}m${`tagIssueStaging`}\u001b[${39}m`} then wipe`
        );
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        console.log(
          `2400 ${log$1("processing", "rawIssueStaging", rawIssueStaging)}`
        );
        console.log(
          `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} = ${JSON.stringify(
            logTag,
            null,
            4
          )}`
        );
        rawIssueStaging.forEach(issueObj => {
          if (
            issueObj.position[0][0] < logTag.tagStartAt ||
            (logTag.attributes.some(attrObj => {
              return (
                attrObj.attrValueStartAt < issueObj.position[0][0] &&
                attrObj.attrValueEndAt > issueObj.position[0][0]
              );
            }) &&
              !retObj.issues.some(existingIssue => {
                return (
                  existingIssue.position[0][0] === issueObj.position[0][0] &&
                  existingIssue.position[0][1] === issueObj.position[0][1]
                );
              }))
          ) {
            retObj.issues.push(issueObj);
            console.log(`2426 ${log$1("push", "issueObj", issueObj)}`);
          } else {
            console.log("");
            console.log(
              `2430 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                issueObj,
                null,
                4
              )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                issueObj.position[0][0]
              } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                logTag.tagStartAt
              }`
            );
          }
        });
        console.log(`2442 wipe rawIssueStaging`);
        rawIssueStaging = [];
      }
      resetLogTag();
      resetLogAttr();
      console.log(`2449 ${log$1("reset", "logTag & logAttr")}`);
    }
    if (!doNothingUntil && str[i].trim().length) {
      resetLogWhitespace();
      console.log(`2475 ${log$1("reset", "logWhitespace")}`);
    }
    if (!doNothingUntil && !str[i + 1]) {
      console.log("2480");
      if (rawIssueStaging.length) {
        console.log("2483");
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null
          )
        ) {
          console.log("2494");
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
              console.log(`2499 ${log$1("push", "issueObj", issueObj)}`);
            } else {
              console.log(
                `\n1519 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
                  issueObj,
                  null,
                  4
                )}\nbecause ${`\u001b[${33}m${`issueObj.position[0][0]`}\u001b[${39}m`}=${
                  issueObj.position[0][0]
                } not < ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`}=${
                  logTag.tagStartAt
                }`
              );
            }
          });
          console.log(`2514 wipe rawIssueStaging`);
          rawIssueStaging = [];
          retObj.issues.push({
            name: "tag-missing-closing-bracket",
            position: [
              [
                logWhitespace.startAt ? logWhitespace.startAt : i + 1,
                i + 1,
                ">"
              ]
            ]
          });
          console.log(
            `2529 ${log$1(
              "push",
              "tag-missing-closing-bracket",
              `${`[[${
                logWhitespace.startAt ? logWhitespace.startAt : i + 1
              }, ${i + 1}, ">"]]`}`
            )}`
          );
        } else if (
          !retObj.issues.some(
            issueObj => issueObj.name === "file-missing-ending"
          )
        ) {
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          console.log(
            `2547 concat, then wipe ${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`}`
          );
          rawIssueStaging = [];
        }
      }
    }
    const output = {
      logTag: false,
      logAttr: false,
      logWhitespace: false,
      logLineEndings: false,
      retObj: true,
      tagIssueStaging: false,
      rawIssueStaging: false
    };
    console.log(
      `${
        Object.keys(output).some(key => output[key])
          ? `${`\u001b[${31}m${`█ `}\u001b[${39}m`}`
          : ""
      }${
        output.logTag && logTag.tagStartAt !== null
          ? `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} ${JSON.stringify(
              logTag,
              null,
              4
            )}; `
          : ""
      }${
        output.logAttr && logAttr.attrStartAt !== null
          ? `${`\u001b[${33}m${`logAttr`}\u001b[${39}m`} ${JSON.stringify(
              logAttr,
              null,
              4
            )}; `
          : ""
      }${
        output.logWhitespace && logWhitespace.startAt !== null
          ? `${`\u001b[${33}m${`logWhitespace`}\u001b[${39}m`} ${JSON.stringify(
              logWhitespace,
              null,
              0
            )}; `
          : ""
      }${
        output.logLineEndings
          ? `${`\u001b[${33}m${`logLineEndings`}\u001b[${39}m`} ${JSON.stringify(
              logLineEndings,
              null,
              0
            )}; `
          : ""
      }${
        output.retObj
          ? `${`\u001b[${33}m${`retObj`}\u001b[${39}m`} ${JSON.stringify(
              retObj,
              null,
              4
            )}; `
          : ""
      }${
        output.tagIssueStaging && tagIssueStaging.length
          ? `\n${`\u001b[${33}m${`tagIssueStaging`}\u001b[${39}m`} ${JSON.stringify(
              tagIssueStaging,
              null,
              4
            )}; `
          : ""
      }${
        output.rawIssueStaging && rawIssueStaging.length
          ? `\n${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`} ${JSON.stringify(
              rawIssueStaging,
              null,
              4
            )}; `
          : ""
      }`
    );
  }
  if (
    (!opts.style || !opts.style.line_endings_CR_LF_CRLF) &&
    ((logLineEndings.cr.length && logLineEndings.lf.length) ||
      (logLineEndings.lf.length && logLineEndings.crlf.length) ||
      (logLineEndings.cr.length && logLineEndings.crlf.length))
  ) {
    if (
      logLineEndings.cr.length > logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      console.log("2660 CR clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (
      logLineEndings.lf.length > logLineEndings.crlf.length &&
      logLineEndings.lf.length > logLineEndings.cr.length
    ) {
      console.log("2682 LF clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length > logLineEndings.lf.length &&
      logLineEndings.crlf.length > logLineEndings.cr.length
    ) {
      console.log("2704 CRLF clearly prevalent");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      logLineEndings.crlf.length === logLineEndings.lf.length &&
      logLineEndings.lf.length === logLineEndings.cr.length
    ) {
      console.log("2726 same amount of each type of EOL");
      logLineEndings.crlf.forEach(eolEntryArr => {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(eolEntryArr => {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (
      logLineEndings.cr.length === logLineEndings.crlf.length &&
      logLineEndings.cr.length > logLineEndings.lf.length
    ) {
      console.log("2745 CR & CRLF are prevalent over LF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (
      (logLineEndings.lf.length === logLineEndings.crlf.length &&
        logLineEndings.lf.length > logLineEndings.cr.length) ||
      (logLineEndings.cr.length === logLineEndings.lf.length &&
        logLineEndings.cr.length > logLineEndings.crlf.length)
    ) {
      console.log(
        "2770 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF"
      );
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(eolEntryArr => {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    }
  }
  console.log("2793 BEFORE FIX");
  console.log(
    `2795 ${`\u001b[${33}m${`retObj.issues`}\u001b[${39}m`} = ${JSON.stringify(
      retObj.issues,
      null,
      4
    )}`
  );
  retObj.fix =
    isArr(retObj.issues) && retObj.issues.length
      ? merge(
          retObj.issues.reduce((acc, obj) => {
            return acc.concat(obj.position);
          }, [])
        )
      : null;
  return retObj;
}

export { lint, version, errors };
