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
function charSuitableForAttrName(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/charSuitableForAttrName(): input is not a single string character!"
    );
  }
  const res = !`"'><=`.includes(char);
  console.log(`162 emlint/util/charSuitableForAttrName(): return ${res}`);
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
function withinTagInnerspace(str, idx = 0) {
  console.log(`238 withinTagInnerspace() called, idx = ${idx}`);
  let whitespaceStartAt = null;
  const closingBracket = {
    at: null,
    last: false,
    precedes: false
  };
  const slash = {
    at: null,
    last: false,
    precedes: false
  };
  const quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false
  };
  const beginningOfAString = true;
  let r2_1 = false;
  let r2_2 = false;
  let r2_3 = false;
  let r2_4 = false;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    console.log(
      `${`\u001b[${36}m${`=`}\u001b[${39}m\u001b[${34}m${`=`}\u001b[${39}m`.repeat(
        15
      )} \u001b[${31}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} ${`\u001b[${36}m${`=`}\u001b[${39}m\u001b[${34}m${`=`}\u001b[${39}m`.repeat(
        15
      )}`
    );
    if (!str[i].trim().length) {
      if (whitespaceStartAt === null) {
        whitespaceStartAt = i;
      }
      if (closingBracket.last) {
        closingBracket.precedes = true;
      }
      if (slash.last) {
        slash.precedes = true;
      }
      if (quotes.last) {
        quotes.precedes = true;
      }
    } else {
      if (str[i] === ">") {
        closingBracket.at = i;
        closingBracket.last = true;
      } else if (closingBracket.last) {
        closingBracket.precedes = true;
        closingBracket.last = false;
      } else {
        closingBracket.precedes = false;
      }
      if (str[i] === "/") {
        slash.at = i;
        slash.last = true;
      } else if (slash.last) {
        slash.precedes = true;
        slash.last = false;
      } else {
        slash.precedes = false;
      }
      if (str[i] === ">") ;
      if (`'"`.includes(str[i])) {
        if (quotes.at === null) {
          quotes.within = true;
          quotes.at = i;
        } else if (str[i] === str[quotes.at]) {
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
        console.log(
          `405 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "quotes.at",
            quotes.at
          )}`
        );
      }
      if (!quotes.within && closingBracket.last && slash.precedes) {
        console.log(
          `436 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${`\u001b[${31}m${`R1`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      }
      if (
        !quotes.within &&
        beginningOfAString &&
        charSuitableForAttrName(str[i]) &&
        !r2_1
      ) {
        r2_1 = true;
        console.log(
          `458 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
            `477 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_2",
              r2_2
            )}`
          );
        } else {
          r2_1 = false;
          console.log(
            `486 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
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
            `500 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_3",
              r2_3
            )}`
          );
        } else {
          r2_1 = false;
          r2_2 = false;
          console.log(
            `510 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_1",
              r2_1,
              "r2_2",
              r2_2
            )}`
          );
        }
      }
      else if (r2_3 && str[i] === str[quotes.at]) {
        r2_4 = true;
        console.log(
          `525 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_4",
            r2_4
          )}`
        );
      }
      else if (r2_4 && !quotes.within && str[i] === ">") {
        console.log(
          `536 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      }
      if (whitespaceStartAt !== null) {
        whitespaceStartAt = null;
      }
    }
    console.log(
      `${`\u001b[${33}m${`whitespaceStartAt`}\u001b[${39}m`} = ${JSON.stringify(
        whitespaceStartAt,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`closingBracket`}\u001b[${39}m`} = ${JSON.stringify(
        closingBracket,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`slash`}\u001b[${39}m`} = ${JSON.stringify(
        slash,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
        quotes,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r2_1`}\u001b[${39}m`} = ${JSON.stringify(
        r2_1,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r2_2`}\u001b[${39}m`} = ${JSON.stringify(
        r2_2,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r2_3`}\u001b[${39}m`} = ${JSON.stringify(
        r2_3,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r2_4`}\u001b[${39}m`} = ${JSON.stringify(
        r2_4,
        null,
        0
      )}`
    );
  }
  return false;
}
function tagOnTheRight(str, idx = 0) {
  console.log(
    `661 util/tagOnTheRight() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`663 tagOnTheRight() called, idx = ${idx}`);
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(
      `682 util/tagOnTheRight(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(
      `687 util/tagOnTheRight(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(
      `692 util/tagOnTheRight(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(
      `697 util/tagOnTheRight(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `703 util/tagOnTheRight(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
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
        `837 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `846 (util/attributeOnTheRight) ${log(
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
        `858 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `868 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `878 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `884 (util/attributeOnTheRight) ${log(
          "set",
          "lastSomeQuote",
          lastSomeQuote
        )}`
      );
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log(
        "900 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log(
            `908 (util/attributeOnTheRight) ${log(
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
            "923 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }
        console.log(
          `930 (util/attributeOnTheRight) ${log(
            " ███████████████████████████████████████ correction!\n",
            "true"
          )}`
        );
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log(
              "945 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `948 (util/attributeOnTheRight) ${log(
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
            "964 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `967 (util/attributeOnTheRight) ${log("return", "false")}`
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
        `981 (util/attributeOnTheRight) ${log(
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
        `1005 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log(`1028 (util) "EOL reached"`);
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1046 (util) last chance, run correction 3");
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
        "1058 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`1060 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }
  console.log(`1065 (util) ${log("bottom - return", "false")}`);
  return false;
}
function findClosingQuote(str, idx = 0) {
  console.log(
    `1085 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
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
          `1116 (util/findClosingQuote) quick ending, ${i} is the matching quote`
        );
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `1124 (util/findClosingQuote) ${log(
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
        console.log(`1138 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
      console.log("1141 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log(
          `1145 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) tag on the right - return i=${i}`
        );
        return i;
      }
      console.log(
        `1150 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) NOT tag on the right`
      );
    }
    else if (str[i].trim().length) {
      console.log("1156 (util/findClosingQuote)");
      if (str[i] === ">") {
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          console.log(
            `1163 (util/findClosingQuote) ${log(
              "!",
              "suitable candidate found"
            )}`
          );
          const temp = withinTagInnerspace(str, i);
          console.log(
            `1172 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
          );
          if (temp) {
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              console.log(
                `1195 (util/findClosingQuote) ${log(
                  "return",
                  "lastNonWhitespaceCharWasQuoteAt + 1",
                  lastNonWhitespaceCharWasQuoteAt + 1
                )}`
              );
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            console.log(
              `1204 (util/findClosingQuote) ${log(
                "return",
                "lastNonWhitespaceCharWasQuoteAt",
                lastNonWhitespaceCharWasQuoteAt
              )}`
            );
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        const whatFollowsEq = firstOnTheRight(str, i);
        console.log(
          `1219 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );
        if (
          whatFollowsEq &&
          (str[whatFollowsEq] === "'" || str[whatFollowsEq] === '"')
        ) {
          console.log("1229 (util/findClosingQuote)");
          console.log(
            `${`\u001b[${33}m${`lastNonWhitespaceCharWasQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharWasQuoteAt,
              null,
              4
            )}`
          );
          if (withinTagInnerspace(str, lastQuoteAt + 1)) {
            console.log(
              `1241 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          }
          console.log("1249 didn't pass");
        }
      } else if (str[i] !== "/") {
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          console.log(`1254 ██ tag on the right`);
          if (lastClosingBracketAt !== null) {
            console.log(
              `1257 (util/findClosingQuote) ${log(
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
            `1271 (util/findClosingQuote) ${log(
              "set",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt
            )}`
          );
        }
      }
    }
    console.log(
      `1283 (util/findClosingQuote) ${log(
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
    console.log(`027 pingTag(): ${JSON.stringify(logTag, null, 4)}`);
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
    `109 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
    );
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
        console.log(
          `305 ${log$1(
            "SET",
            "logAttr.attrNameEndAt",
            logAttr.attrNameEndAt,
            "logAttr.attrName",
            logAttr.attrName
          )}`
        );
        if (str[i] !== "=") {
          if (str[firstOnTheRight$1(str, i)] === "=") {
            console.log("320 equal to the right though");
          } else {
            console.log("323 not equal, so terminate attr");
          }
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
        console.log("339 catch what follows the attribute's name");
        if (str[i] === "=") {
          logAttr.attrEqualAt = i;
          console.log(
            `343 ${log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
        } else if (temp) {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          console.log(
            "350 quoted attribute's value on the right, equal is indeed missing"
          );
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[i, i, "="]]
          });
          console.log(
            `358 ${log$1(
              "push",
              "tag-attribute-missing-equal",
              `${`[[${i}, ${i}, "="]]`}`
            )}`
          );
          logAttr.attrEqualAt = i;
          console.log(
            `367 ${log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)}`
          );
          logAttr.attrValueStartAt = i + 1;
          console.log(
            `372 ${log$1(
              "SET",
              "logAttr.attrValueStartAt",
              logAttr.attrValueStartAt
            )}`
          );
          logAttr.attrValueEndAt = temp;
          console.log(
            `381 ${log$1(
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
            `393 ${log$1(
              "SET",
              "logAttr.attrOpeningQuote",
              logAttr.attrOpeningQuote,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logAttr.attrValue = str.slice(i + 1, temp);
          console.log(
            `404 ${log$1("SET", "logAttr.attrValue", logAttr.attrValue)}`
          );
        } else {
          console.log(
            `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ENDED ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`416 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, i]]
            });
            console.log(
              `431 ${log$1(
                "push",
                "tag-attribute-space-between-name-and-equals",
                `${`[[${logWhitespace.startAt}, ${i}]]`}`
              )}`
            );
          } else if (isLatinLetter(str[i])) {
            logTag.attributes.push(clone(logAttr));
            console.log(`440 ${log$1("PUSH, then RESET", "logAttr")}`);
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < i) {
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, i]]
                  });
                  console.log(
                    `455 ${log$1(
                      "push",
                      "tag-excessive-whitespace-inside-tag",
                      `${`[[${logWhitespace.startAt + 1}, ${i}]]`}`
                    )}`
                  );
                }
                console.log("462 dead end of excessive whitespace check");
              } else {
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, i, " "]]
                });
                console.log(
                  `470 ${log$1(
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
      if (logAttr.attrStartAt === null && isLatinLetter(str[i])) {
        console.log("486 above catching the begining of an attribute's name");
        logAttr.attrStartAt = i;
        logAttr.attrNameStartAt = i;
        console.log(
          `490 ${log$1("SET", "logAttr.attrStartAt", logAttr.attrStartAt)}`
        );
        if (logWhitespace.startAt !== null && logWhitespace.startAt < i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, i]]
            });
            console.log(
              `506 ${log$1(
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
              `519 ${log$1(
                "push",
                "tag-excessive-whitespace-inside-tag",
                `${`[[${logWhitespace.startAt}, ${i}, " "]]`}`
              )}`
            );
          }
        }
      }
      if (
        logAttr.attrEqualAt !== null &&
        logAttr.attrEqualAt < i &&
        logAttr.attrOpeningQuote.pos === null &&
        str[i].trim().length
      ) {
        console.log("536 rules above catching what follows attribute's equal");
        if (charcode === 34 || charcode === 39) {
          if (logWhitespace.startAt && logWhitespace.startAt < i) {
            retObj.issues.push({
              name: "tag-attribute-space-between-equals-and-opening-quotes",
              position: [[logWhitespace.startAt, i]]
            });
            console.log(
              `547 ${log$1(
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
            `561 ${log$1("set", "closingQuotePeek", closingQuotePeek)}`
          );
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
                console.log(
                  `592 ${log$1(
                    "push",
                    name$$1,
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
                  : firstOnTheLeft$1(str, closingQuotePeek) + 1;
                console.log(
                  `625 ${log$1(
                    "set",
                    "fromPositionToInsertAt",
                    fromPositionToInsertAt
                  )}`
                );
                let toPositionToInsertAt = closingQuotePeek;
                console.log(
                  `633 ${log$1(
                    "set",
                    "toPositionToInsertAt",
                    toPositionToInsertAt
                  )}`
                );
                if (str[firstOnTheLeft$1(str, closingQuotePeek)] === "/") {
                  console.log("641 SLASH ON THE LEFT");
                  toPositionToInsertAt = firstOnTheLeft$1(str, closingQuotePeek);
                  if (toPositionToInsertAt + 1 < closingQuotePeek) {
                    retObj.issues.push({
                      name: "tag-whitespace-closing-slash-and-bracket",
                      position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                    });
                    console.log(
                      `650 ${log$1(
                        "push",
                        "tag-whitespace-closing-slash-and-bracket",
                        `${`[[${toPositionToInsertAt +
                          1}, ${closingQuotePeek}]]`}`
                      )}`
                    );
                  }
                  fromPositionToInsertAt =
                    firstOnTheLeft$1(str, toPositionToInsertAt) + 1;
                  console.log(
                    `663 ${log$1(
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
                  `684 ${log$1(
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
              `702 ${log$1(
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
                  `728 ${log$1("push tagIssueStaging", "newIssue", newIssue)}`
                );
              }
            }
            if (rawIssueStaging.length) {
              console.log(
                `737 ${`\u001b[${31}m${`██`}\u001b[${39}m`} raw stage present!`
              );
            }
            logTag.attributes.push(clone(logAttr));
            console.log(`743 ${log$1("PUSH, then RESET", "logAttr")}`);
            resetLogAttr();
            if (str[closingQuotePeek].trim().length) {
              i = closingQuotePeek;
            } else {
              i = firstOnTheLeft$1(str, closingQuotePeek);
            }
            console.log(`758 ${log$1("set", "i", i, "then CONTINUE")}`);
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
                `778 ${log$1(
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
            `796 ${log$1(
              "set",
              "logAttr.attrOpeningQuote",
              logAttr.attrOpeningQuote
            )}`
          );
          const name$$1 =
            charcode === 8220
              ? "tag-attribute-left-double-quotation-mark"
              : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, `"`]]
          });
          console.log(
            `813 ${log$1("push", name$$1, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );
        } else if (charcode === 8216 || charcode === 8217) {
          logAttr.attrOpeningQuote.pos = i;
          logAttr.attrOpeningQuote.val = `'`;
          console.log(
            `823 ${log$1(
              "set",
              "logAttr.attrOpeningQuote",
              logAttr.attrOpeningQuote
            )}`
          );
          const name$$1 =
            charcode === 8216
              ? "tag-attribute-left-single-quotation-mark"
              : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: name$$1,
            position: [[i, i + 1, `'`]]
          });
          console.log(
            `840 ${log$1("push", name$$1, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );
          logAttr.attrValueStartAt = i + 1;
          console.log(
            `845 ${log$1(
              "set",
              "logAttr.attrValueStartAt",
              logAttr.attrValueStartAt
            )}`
          );
        } else if (withinTagInnerspace$1(str, i)) {
          console.log(
            `853 withinTagInnerspace() ${`\u001b[${32}m${`positive`}\u001b[${39}m`}`
          );
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
          console.log(
            `871 ${log$1(
              "push",
              "tag-attribute-quote-and-onwards-missing",
              `${`[[${start}, ${i}]]`}`
            )}`
          );
          console.log(`878 ${log$1("reset", "logWhitespace")}`);
          resetLogWhitespace();
          console.log(`880 ${log$1("reset", "logAttr")}`);
          resetLogAttr();
        } else {
          console.log(
            `884 withinTagInnerspace() ${`\u001b[${31}m${`negative`}\u001b[${39}m`} - final ELSE clauses`
          );
          const endingQuotesPos = findClosingQuote$1(str, i);
          if (endingQuotesPos !== null) {
            console.log(
              `892 ending quote found: ${log$1(
                "set",
                "endingQuotesPos",
                endingQuotesPos
              )}`
            );
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[i, i, str[endingQuotesPos]]]
            });
            console.log(
              `904 ${log$1(
                "push",
                "tag-attribute-space-between-equals-and-opening-quotes",
                `${`[[${i}, ${i}, ${JSON.stringify(
                  str[endingQuotesPos],
                  null,
                  0
                )}]]`}`
              )}`
            );
            logAttr.attrOpeningQuote.pos = i;
            logAttr.attrOpeningQuote.val = str[endingQuotesPos];
            logAttr.attrValueStartAt = i;
            logAttr.attrClosingQuote.pos = endingQuotesPos;
            logAttr.attrClosingQuote.val = str[endingQuotesPos];
            logAttr.attrValue = str.slice(i, endingQuotesPos);
            console.log(
              `923 ${log$1(
                "SET",
                "logAttr.attrOpeningQuote",
                logAttr.attrOpeningQuote,
                "logAttr.attrClosingQuote",
                logAttr.attrClosingQuote,
                "logAttr.attrValueStartAt",
                logAttr.attrValueStartAt,
                "logAttr.attrValue",
                logAttr.attrValue
              )}`
            );
            for (let y = i; y < endingQuotesPos; y++) {
              const newIssue = encodeChar$1(str, y);
              if (newIssue) {
                tagIssueStaging.push(newIssue);
                console.log(
                  `943 ${log$1("push tagIssueStaging", "newIssue", newIssue)}`
                );
              }
            }
          } else {
            console.log(
              `949 ${log$1("set", "endingQuotesPos", endingQuotesPos)}`
            );
          }
        }
        console.log(
          `956 ${log$1(
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
              `974 ${log$1(
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
              `989 ${log$1(
                "push",
                "tag-attribute-quote-and-onwards-missing",
                `${`[[${logAttr.attrStartAt}, ${i}]]`}`
              )}`
            );
            console.log(`995 ${log$1("reset", "logAttr")}`);
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
        console.log("1009 above catching closing quote (single or double)");
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
              `1035 ${log$1(
                "push",
                issueName,
                `${`[[${i}, ${i + 1}, ${charcode === 34 ? "'" : '"'}]]`}`
              )}`
            );
          } else {
            console.log(
              `1043 ${`\u001b[${31}m${`didn't push an issue`}\u001b[${39}m`}`
            );
          }
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = str[i];
          console.log(
            `1054 ${log$1(
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
              `1082 ${log$1("SET", "logAttr.attrValue", logAttr.attrValue)}`
            );
          }
          logAttr.attrEndAt = i;
          logAttr.attrValueEndAt = i;
          console.log(
            `1090 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrValueEndAt",
              logAttr.attrValueEndAt
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1101 ${log$1("PUSH, then RESET", "logAttr")}`);
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
          console.log(
            `1123 ${log$1("push", name$$1, `${`[[${i}, ${i + 1}, '"']]`}`)}`
          );
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = '"';
          console.log(
            `1131 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1142 ${log$1("PUSH, then RESET", "logAttr")}`);
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
          console.log(
            `1164 ${log$1("push", name$$1, `${`[[${i}, ${i + 1}, "'"]]`}`)}`
          );
          logAttr.attrEndAt = i;
          logAttr.attrClosingQuote.pos = i;
          logAttr.attrClosingQuote.val = "'";
          console.log(
            `1172 ${log$1(
              "SET",
              "logAttr.attrEndAt",
              logAttr.attrEndAt,
              "logAttr.attrClosingQuote",
              logAttr.attrClosingQuote
            )}`
          );
          logTag.attributes.push(clone(logAttr));
          console.log(`1183 ${log$1("PUSH, then RESET", "logAttr")}`);
          resetLogAttr();
        } else if (withinTagInnerspace$1(str, i)) {
          let compensationSpace = " ";
          const whatsOnTheRight = str[firstOnTheRight$1(str, i - 1)];
          console.log(
            `1193 ${`\u001b[${33}m${`whatsOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
              whatsOnTheRight,
              null,
              4
            )}`
          );
          if (
            !str[i].trim().length ||
            !whatsOnTheRight ||
            whatsOnTheRight === ">" ||
            whatsOnTheRight === "/"
          ) {
            compensationSpace = "";
            console.log("1206 no compensation space");
          }
          console.log(
            `1210 compensationSpace.length = ${compensationSpace.length}`
          );
          const issueName = "tag-attribute-closing-quotation-mark-missing";
          if (
            logAttr.attrOpeningQuote.val &&
            (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos === i)
          ) {
            console.log("1219");
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
              console.log(
                `1238 ${log$1(
                  "push",
                  issueName,
                  `${`[[${i}, ${i}, ${`${
                    logAttr.attrOpeningQuote.val
                  }${compensationSpace}`}]]`}`
                )}`
              );
            } else {
              console.log(
                `1248 ${`\u001b[${31}m${`didn't push a duplicate issue`}\u001b[${39}m`}`
              );
            }
          }
          if (!logAttr.attrClosingQuote.pos) {
            logAttr.attrEndAt = i;
            logAttr.attrClosingQuote.pos = i;
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            console.log(
              `1259 ${log$1(
                "set",
                "logAttr.attrClosingQuote",
                logAttr.attrClosingQuote,
                "logAttr.attrEndAt",
                logAttr.attrEndAt
              )}`
            );
            logTag.attributes.push(clone(logAttr));
            console.log(`1269 ${log$1("PUSH, then RESET", "logAttr")}`);
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
        console.log("1289 inside error catch clauses");
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[i, i, logAttr.attrOpeningQuote.val]]
        });
        console.log(
          `1296 ${log$1(
            "push",
            "tag-attribute-closing-quotation-mark-missing",
            `${`[[${i}, ${i}, ${logAttr.attrOpeningQuote.val}]]`}`
          )}`
        );
        logAttr.attrClosingQuote.pos = i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log(
          `1306 ${log$1(
            "set",
            "logAttr.attrClosingQuote",
            logAttr.attrClosingQuote
          )}`
        );
        logTag.attributes.push(clone(logAttr));
        console.log(`1314 ${log$1("PUSH, then RESET", "logAttr")}`);
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
        console.log(`1342 PUSH "${name$$1}", [[${i}, ${i + 1}, "  "]]`);
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
              `1361 ${log$1(
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
              `1375 ${log$1("logLineEndings.crlf push", `[${i}, ${i + 2}]`)}`
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
              `1391 ${log$1(
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
              `1405 ${log$1("logLineEndings.cr push", `[${i}, ${i + 1}]`)}`
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
              `1425 ${log$1(
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
              `1439 ${log$1("logLineEndings.lf push", `[${i}, ${i + 1}]`)}`
            );
          }
        }
      } else {
        retObj.issues.push({
          name: name$$1,
          position: [[i, i + 1]]
        });
        console.log(`1449 ${log$1("push", name$$1, `${`[[${i}, ${i + 1}]]`}`)}`);
      }
    } else if (encodeChar$1(str, i)) {
      const newIssue = encodeChar$1(str, i);
      console.log(
        `1454 ${`\u001b[${31}m${`██`}\u001b[${39}m`} new issue: ${JSON.stringify(
          newIssue,
          null,
          0
        )}`
      );
      rawIssueStaging.push(newIssue);
      console.log(
        `1462 push above issue to ${`\u001b[${36}m${`rawIssueStaging`}\u001b[${39}m`}`
      );
    }
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      console.log("1469 - inside whitespace chunks ending clauses");
      if (
        logTag.tagNameStartAt !== null &&
        logAttr.attrStartAt === null &&
        (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= i) &&
        (str[i] === ">" ||
          (str[i] === "/" && "<>".includes(str[firstOnTheRight$1(str, i)])))
      ) {
        console.log("1477");
        let name$$1 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          name$$1 = "tag-whitespace-closing-slash-and-bracket";
        }
        retObj.issues.push({
          name: name$$1,
          position: [[logWhitespace.startAt, i]]
        });
        console.log(
          `1490 ${log$1("push", name$$1, `${`[[${logWhitespace.startAt}, ${i}]]`}`)}`
        );
      }
    }
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
      console.log(
        `1499 ${log$1("set", "logWhitespace.startAt", logWhitespace.startAt)}`
      );
    }
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `1508 ${log$1(
            "set",
            "logWhitespace.includesLinebreaks",
            logWhitespace.includesLinebreaks
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
      console.log(
        `1517 ${log$1(
          "set",
          "logWhitespace.lastLinebreakAt",
          logWhitespace.lastLinebreakAt
        )}`
      );
    }
    if (
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      !isLatinLetter(str[i]) &&
      str[i] !== "<" &&
      str[i] !== "/"
    ) {
      console.log("1535 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      logTag.recognised = knownHTMLTags.includes(
        logTag.tagName.toLowerCase()
      );
      console.log(
        `1542 ${log$1(
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
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      console.log(
        `1563 ${log$1("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)}`
      );
      if (logTag.tagStartAt < i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
        console.log(
          `1573 ${log$1(
            "stage",
            "tag-space-after-opening-bracket",
            `${`[[${logTag.tagStartAt + 1}, ${i}]]`}`
          )}`
        );
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
      console.log(
        `1593 ${log$1(
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
    if (str[i] === "<") {
      console.log(
        `1608 catch the beginning of a tag ${`\u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`}`
      );
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = i;
        console.log(
          `1614 ${log$1("set", "logTag.tagStartAt", logTag.tagStartAt)}`
        );
      } else if (tagOnTheRight$1(str, i)) {
        console.log(
          `1620 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new tag starts`
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
            `1636 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)`
          );
          const lastNonWhitespaceOnLeft = firstOnTheLeft$1(str, i);
          console.log(
            `1650 ${log$1(
              "set",
              "lastNonWhitespaceOnLeft",
              lastNonWhitespaceOnLeft
            )}`
          );
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log(
              `1663 ${log$1("set", "logTag.tagEndAt", logTag.tagEndAt)}`
            );
          } else {
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, i, ">"]]
            });
            console.log(
              `1673 ${log$1(
                "push",
                "tag-missing-closing-bracket",
                `${`[[${lastNonWhitespaceOnLeft + 1}, ${i}, ">"]]`}`
              )}`
            );
          }
          if (rawIssueStaging.length) {
            console.log(
              `1683 let's process all ${
                rawIssueStaging.length
              } raw character issues at staging`
            );
            rawIssueStaging.forEach(issueObj => {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
                console.log(`1690 ${log$1("push", "issueObj", issueObj)}`);
              } else {
                console.log(
                  `1693 discarding ${JSON.stringify(issueObj, null, 4)}`
                );
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          console.log(
            `1707 ${log$1("reset", "logTag & logAttr && rawIssueStaging")}`
          );
          logTag.tagStartAt = i;
          console.log(
            `1713 ${log$1("set", "logTag.tagStartAt", logTag.tagStartAt)}`
          );
        } else {
          console.log(`1716 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS`);
          if (rawIssueStaging.length) {
            console.log(
              `1721 ${log$1("processing", "rawIssueStaging", rawIssueStaging)}`
            );
            console.log(
              `1724 ${log$1("log", "logTag.tagStartAt", logTag.tagStartAt)}`
            );
            console.log(
              `1727 ${`\u001b[${31}m${JSON.stringify(
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
                console.log(`1740 ${log$1("push", "issueObj", issueObj)}`);
              } else {
                console.log("");
                console.log(
                  `1744 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
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
            console.log(`1756 wipe rawIssueStaging`);
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            console.log(`1762 ${log$1("wipe", "tagIssueStaging")}`);
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
        console.log(
          `1778 concat ${`\u001b[${33}m${`tagIssueStaging`}\u001b[${39}m`} then wipe`
        );
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        console.log(
          `1786 ${log$1("processing", "rawIssueStaging", rawIssueStaging)}`
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
            console.log(`1812 ${log$1("push", "issueObj", issueObj)}`);
          } else {
            console.log("");
            console.log(
              `1816 ${`\u001b[${31}m${`not pushed`}\u001b[${39}m`} ${`\u001b[${33}m${`issueObj`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`1828 wipe rawIssueStaging`);
        rawIssueStaging = [];
      }
      resetLogTag();
      resetLogAttr();
      console.log(`1835 ${log$1("reset", "logTag & logAttr")}`);
    }
    if (str[i].trim().length) {
      resetLogWhitespace();
      console.log(`1861 ${log$1("reset", "logWhitespace")}`);
    }
    if (!str[i + 1]) {
      console.log("1866");
      if (rawIssueStaging.length) {
        console.log("1869");
        if (
          logTag.tagStartAt !== null &&
          logTag.attributes.some(
            attrObj =>
              attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null
          )
        ) {
          console.log("1880");
          rawIssueStaging.forEach(issueObj => {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
              console.log(`1885 ${log$1("push", "issueObj", issueObj)}`);
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
          console.log(`1900 wipe rawIssueStaging`);
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
            `1915 ${log$1(
              "push",
              "tag-missing-closing-bracket",
              `${`[[${
                logWhitespace.startAt ? logWhitespace.startAt : i + 1
              }, ${i + 1}, ">"]]`}`
            )}`
          );
        } else {
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          console.log(
            `1929 concat, then wipe ${`\u001b[${33}m${`rawIssueStaging`}\u001b[${39}m`}`
          );
          rawIssueStaging = [];
        }
      }
    }
    const output = {
      logTag: true,
      logAttr: true,
      logWhitespace: true,
      logLineEndings: false,
      retObj: false,
      tagIssueStaging: true,
      rawIssueStaging: true
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
      console.log("2042 CR clearly prevalent");
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
      console.log("2064 LF clearly prevalent");
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
      console.log("2086 CRLF clearly prevalent");
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
      console.log("2108 same amount of each type of EOL");
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
      console.log("2127 CR & CRLF are prevalent over LF");
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
        "2152 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF"
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
  console.log("2175 BEFORE FIX");
  console.log(
    `2177 ${`\u001b[${33}m${`retObj.issues`}\u001b[${39}m`} = ${JSON.stringify(
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
