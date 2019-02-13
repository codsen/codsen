/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import merge from 'ranges-merge';

var version = "0.7.0";

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
const knownHTMLTags = [
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
];
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
function withinTagInnerspace(str, idx = 0) {
  const r1 = /^\s*\w+\s*=\s*(?:["'][^"']*["'])?(?:(?:\s*\/?>)|\s+)/g;
  const r2 = /^\s*\/*\s*>\s*</g;
  const r3 = /^\s*\/*\s*>\s*\w/g;
  const r4 = /^\s*\w*\s*\/+\s*>/g;
  const r5 = /^\s*\/*\s*>\s*$/g;
  const r6 = /^\s*\w*\s*\/?\s*>(?:(\s*$)|(\s*[^=>'"]*<))/g;
  const r7 = /^\s*\w+\s*\w+\s*=\s*(?:["'][^=>"']*["'])/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    passed = true;
  } else if (r2.test(whatToTest)) {
    passed = true;
  } else if (r3.test(whatToTest)) {
    passed = true;
  } else if (r4.test(whatToTest)) {
    passed = true;
  } else if (r5.test(whatToTest)) {
    passed = true;
  } else if (r6.test(whatToTest)) {
    passed = true;
  } else if (r7.test(whatToTest)) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  return res;
}
function tagOnTheRight(str, idx = 0) {
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    passed = true;
  } else if (r2.test(whatToTest)) {
    passed = true;
  } else if (r3.test(whatToTest)) {
    passed = true;
  } else if (r4.test(whatToTest)) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  return res;
}
function firstOnTheRight(str, idx = 0) {
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
function firstOnTheLeft(str, idx = 0) {
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
    if (
      (i === closingQuoteAt && i > idx) ||
      (closingQuoteAt === null && i > idx && str[i] === startingQuoteVal)
    ) {
      closingQuoteAt = i;
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
    }
    if (str[i] === "=") {
      lastEqual = i;
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          return false;
        }
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            return lastSomeQuote;
          }
        }
        const correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          return false;
        }
      }
    }
    if (
      closingQuoteMatched &&
      lastClosingBracket &&
      lastClosingBracket > closingQuoteMatched
    ) {
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
      return closingQuoteAt;
    }
    if (!str[i + 1]) ;
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    const correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      return lastSomeQuote;
    }
  }
  return false;
}
function findClosingQuote(str, idx = 0) {
  let lastNonWhitespaceCharWasQuoteAt = null;
  let lastQuoteAt = null;
  const startingQuote = `"'`.includes(str[idx]) ? str[idx] : null;
  let lastClosingBracketAt = null;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      if (
        i > idx &&
        (str[i] === "'" || str[i] === '"') &&
        withinTagInnerspace(str, i + 1)
      ) {
        return i;
      }
      if (tagOnTheRight(str, i + 1)) {
        return i;
      }
    }
    else if (str[i].trim().length) {
      if (str[i] === ">") {
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          const temp = withinTagInnerspace(str, i);
          if (temp) {
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        const whatFollowsEq = firstOnTheRight(str, i);
        if (
          whatFollowsEq &&
          (str[whatFollowsEq] === "'" || str[whatFollowsEq] === '"')
        ) {
          if (withinTagInnerspace(str, lastQuoteAt + 1)) {
            return lastQuoteAt + 1;
          }
        }
      } else if (str[i] !== "/") {
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          if (lastClosingBracketAt !== null) {
            return lastClosingBracketAt;
          }
        }
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          lastNonWhitespaceCharWasQuoteAt = null;
        }
      }
    }
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
  knownHTMLTags: knownHTMLTags,
  charSuitableForTagName: charSuitableForTagName,
  isUppercaseLetter: isUppercaseLetter,
  isLowercase: isLowercase,
  isStr: isStr,
  lowAsciiCharacterNames: lowAsciiCharacterNames,
  log: log,
  isLatinLetter: isLatinLetter,
  withinTagInnerspace: withinTagInnerspace,
  firstOnTheRight: firstOnTheRight,
  firstOnTheLeft: firstOnTheLeft,
  attributeOnTheRight: attributeOnTheRight,
  findClosingQuote: findClosingQuote,
  encodeChar: encodeChar,
  tagOnTheRight: tagOnTheRight
});

const errors = "./errors.json";
const isArr = Array.isArray;
const {
  isStr: isStr$1,
  log: log$1,
  withinTagInnerspace: withinTagInnerspace$1,
  firstOnTheRight: firstOnTheRight$1,
  firstOnTheLeft: firstOnTheLeft$1,
  attributeOnTheRight: attributeOnTheRight$1,
  findClosingQuote: findClosingQuote$1,
  encodeChar: encodeChar$1,
  tagOnTheRight: tagOnTheRight$1
} = util;
function lint(str, originalOpts) {
  function pingTag(logTag) {
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
  for (let i = 0, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    if (logTag.tagNameEndAt !== null) {
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
        if (str[i] !== "=") {
          if (str[firstOnTheRight$1(str, i)] === "=") ;
        }
      }
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
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
        } else if (temp) {
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          logAttr.attrEqualAt = i;
          logAttr.attrValueStartAt = i + 1;
          logAttr.attrValueEndAt = temp;
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = str[i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          logAttr.attrValue = str.slice(i + 1, temp);
        } else {
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
          } else if (isLatinLetter(str[i])) {
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                }
              } else {
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
              }
            }
          }
        }
      }
      if (logAttr.attrStartAt === null && isLatinLetter(str[i])) {
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        if (logWhitespace.startAt !== null && logWhitespace.startAt < i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
          } else {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, i, " "]]
            });
          }
        }
      }
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrEqualAt < i &&
        logAttr.attrOpeningQuote.pos === null &&
        str[i].trim().length
      ) {
        if (charcode === 34 || charcode === 39) {
          if (logWhitespace.startAt && logWhitespace.startAt < i) {
            retObj.issues.push({
              name: "tag-attribute-space-between-equals-and-opening-quotes",
              position: [[logWhitespace.startAt, i]]
            });
          }
          resetLogWhitespace();
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = str[i];
          const closingQuotePeek = findClosingQuote$1(str, i);
          if (closingQuotePeek) {
            if (str[closingQuotePeek] !== str[i]) {
              if (
                str[closingQuotePeek] === "'" ||
                str[closingQuotePeek] === '"'
              ) {
                const isDouble = str[closingQuotePeek] === '"';
                const name$$1 = `tag-attribute-mismatching-quotes-is-${
                  isDouble ? "double" : "single"
                }`;
                retObj.issues.push({
                  name: name$$1,
                  position: [
                    [
                      closingQuotePeek,
                      closingQuotePeek + 1,
                      `${isDouble ? "'" : '"'}`
                    ]
                  ]
                });
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
                retObj.issues.push({
                  name: "tag-attribute-closing-quotation-mark-missing",
                  position: [
                    [
                      closingQuotePeek,
                      closingQuotePeek,
                      `${str[i]}${compensation}`
                    ]
                  ]
                });
              }
            }
            logAttr.attrClosingQuote.pos = closingQuotePeek;
            logAttr.attrClosingQuote.val = str[i];
            logAttr.attrValue = str.slice(i + 1, closingQuotePeek);
            logAttr.attrValueStartAt = i + 1;
            logAttr.attrValueEndAt = closingQuotePeek;
            logAttr.attrEndAt = closingQuotePeek;
            for (let y = i + 1; y < closingQuotePeek; y++) {
              const newIssue = encodeChar$1(str, y);
              if (newIssue) {
                tagIssueStaging.push(newIssue);
              }
            }
            if (rawIssueStaging.length) ;
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
            if (str[closingQuotePeek].trim().length) {
              i = closingQuotePeek;
            } else {
              i = firstOnTheLeft$1(str, closingQuotePeek);
            }
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
            }
            continue;
          }
        } else if (charcode === 8220 || charcode === 8221) {
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = `"`;
          const name$$1 =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, `"`]]
          });
        } else if (charcode === 8216 || charcode === 8217) {
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = `'`;
          const name$$1 =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, `'`]]
          });
          logAttr.attrValueStartAt = i + 1;
        } else if (withinTagInnerspace$1(str, i)) {
          let start = logAttr.attrStartAt;
          if (str[i] === "/" || str[i] === ">") {
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
          resetLogWhitespace();
          resetLogAttr();
        } else {
          const endingQuotesPos = findClosingQuote$1(str, i);
          if (endingQuotesPos !== null) {
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[i, i, str[endingQuotesPos]]]
            });
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = str[endingQuotesPos];
            logAttr.attrValueStartAt = i;
            logAttr.attrClosingQuote.pos = endingQuotesPos;
            logAttr.attrClosingQuote.val = str[endingQuotesPos];
            logAttr.attrValue = str.slice(i, endingQuotesPos);
            for (let y = i; y < endingQuotesPos; y++) {
              const newIssue = encodeChar$1(str, y);
              if (newIssue) {
                tagIssueStaging.push(newIssue);
              }
            }
          }
        }
        if (logWhitespace.startAt !== null) {
          if (str[i] === "'" || str[i] === '"') {
            retObj.issues.push({
              name: "tag-attribute-space-between-equals-and-opening-quotes",
              position: [[logWhitespace.startAt, i]]
            });
          } else if (withinTagInnerspace$1(str, i + 1)) {
            retObj.issues.push({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[logAttr.attrStartAt, i]]
            });
            resetLogAttr();
          }
        }
      }
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrOpeningQuote.pos !== null &&
        i > logAttr.attrOpeningQuote.pos &&
        (str[i] === logAttr.attrOpeningQuote.val ||
          withinTagInnerspace$1(str, i + 1))
      ) {
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
          }
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = str[i];
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
          }
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8220 || charcode === 8221)
        ) {
          const name$$1 =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, '"']]
          });
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (
          isStr$1(logAttr.attrOpeningQuote.val) &&
          (charcode === 8216 || charcode === 8217) &&
          ((firstOnTheRight$1(str, i) !== null &&
            (str[firstOnTheRight$1(str, i)] === ">" ||
              str[firstOnTheRight$1(str, i)] === "/")) ||
            withinTagInnerspace$1(str, i + 1))
        ) {
          const name$$1 =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, `'`]]
          });
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          logTag.attributes.push(clone(logAttr));
          resetLogAttr();
        } else if (withinTagInnerspace$1(str, i)) {
          let compensationSpace = " ";
          const whatsOnTheRight = str[firstOnTheRight$1(str, i - 1)];
          if (
            !str[i].trim().length ||
            !whatsOnTheRight ||
            whatsOnTheRight === ">" ||
            whatsOnTheRight === "/"
          ) {
            compensationSpace = "";
          }
          const issueName = "tag-attribute-closing-quotation-mark-missing";
          if (
            logAttr.attrOpeningQuote.val &&
            (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos === i)
          ) {
            if (
              !retObj.issues.some(issueObj => {
                return (
                  issueObj.name === issueName &&
                  issueObj.position.length === 1 &&
                  issueObj.position[0][0] === i &&
                  issueObj.position[0][1] === i
                );
              })
            ) {
              retObj.issues.push({
                name: issueName,
                position: [
                  [i, i, `${logAttr.attrOpeningQuote.val}${compensationSpace}`]
                ]
              });
            }
          }
          if (!logAttr.attrClosingQuote.pos) {
            logAttr.attrEndAt = i;
            logAttr.attrClosingQuote.pos = i;
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            logTag.attributes.push(clone(logAttr));
            resetLogAttr();
          }
        }
      }
      if (
        logAttr.attrOpeningQuote.val &&
        logAttr.attrOpeningQuote.pos < i &&
        logAttr.attrClosingQuote.pos === null &&
        ((str[i] === "/" &&
          firstOnTheRight$1(str, i) &&
          str[firstOnTheRight$1(str, i)] === ">") ||
          str[i] === ">")
      ) {
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        logTag.attributes.push(clone(logAttr));
        resetLogAttr();
      }
    }
    if (charcode < 32) {
      const name$$1 = `bad-character-${lowAsciiCharacterNames[charcode]}`;
      if (charcode === 9) {
        retObj.issues.push({
          name: name$$1,
          position: [[i, i + 1, "  "]]
        });
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
          } else {
            logLineEndings.crlf.push([i, i + 2]);
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
          } else {
            logLineEndings.cr.push([i, i + 1]);
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
          } else {
            logLineEndings.lf.push([i, i + 1]);
          }
        }
      } else {
        retObj.issues.push({
          name: name$$1,
          position: [[i, i + 1]]
        });
      }
    } else if (encodeChar$1(str, i)) {
      const newIssue = encodeChar$1(str, i);
      rawIssueStaging.push(newIssue);
    }
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" &&
            (str[i + 1] === ">" ||
              str
                .slice(i + 1)
                .trim()
                .startsWith(">"))))
      ) {
        let name$$1 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name$$1 = "tag-whitespace-closing-slash-and-bracket";
        }
        retObj.issues.push({
          name: name$$1,
          position: [[logWhitespace.startAt, i]]
        });
      }
    }
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
    }
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
      }
      logWhitespace.lastLinebreakAt = i;
    }
    if (
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      !isLatinLetter(str[i]) &&
      str[i] !== "<" &&
      str[i] !== "/"
    ) {
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(
        logTag.tagName.toLowerCase()
      );
    }
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }
    if (
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      isUppercaseLetter(str[i])
    ) {
      retObj.issues.push({
        name: "tag-name-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
    }
    if (str[i] === "<") {
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = i;
      } else if (tagOnTheRight$1(str, i)) {
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.length &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null &&
              attrObj.attrOpeningQuote.pos !== null
          )
        ) {
          const lastNonWhitespaceOnLeft = firstOnTheLeft$1(str, i);
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
          } else {
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
          }
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          logTag.tagStartAt = i;
        } else {
          if (rawIssueStaging.length) {
            rawIssueStaging.forEach(issueObj => {
              if (
                issueObj.position[0][0] < i
              ) {
                retObj.issues.push(issueObj);
              }
            });
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            tagIssueStaging = [];
          }
        }
      }
    }
    if (
      charcode === 62 &&
      logTag.tagStartAt !== null &&
      (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < i)
    ) {
      if (tagIssueStaging.length) {
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        rawIssueStaging.forEach(issueObj => {
          if (issueObj.position[0][0] < logTag.tagStartAt) {
            retObj.issues.push(issueObj);
          }
        });
        rawIssueStaging = [];
      }
      resetLogTag();
      resetLogAttr();
    }
    if (str[i].trim().length) {
      resetLogWhitespace();
    }
    if (!str[i + 1]) {
      if (rawIssueStaging.length) {
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null
          )
        ) {
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
            }
          });
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
        } else {
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          rawIssueStaging = [];
        }
      }
    }
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
