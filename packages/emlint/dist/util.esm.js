import { notEmailFriendly } from 'html-entities-not-email-friendly';
import { right, left } from 'string-left-right';
import arrayiffy from 'arrayiffy-if-string';
import he from 'he';

var $ = {
	sibling: "$",
	type: "closing"
};
var knownESPTags = {
	$: $,
	"{%": {
	sibling: [
		"%}",
		"-%}"
	],
	type: "opening"
},
	"%}": {
	sibling: [
		"{%",
		"{%-"
	],
	type: "closing"
},
	"*|": {
	sibling: "|*",
	type: "opening"
},
	"|*": {
	sibling: "*|",
	type: "closing"
},
	"{%-": {
	sibling: [
		"-%}",
		"%}"
	],
	type: "opening"
},
	"-%}": {
	sibling: [
		"{%-",
		"{%"
	],
	type: "closing"
},
	"{{": {
	sibling: "}}",
	type: "opening"
},
	"}}": {
	sibling: "{{",
	type: "closing"
}
};

const isArr = Array.isArray;
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
const c1CharacterNames = [
  "delete",
  "padding",
  "high-octet-preset",
  "break-permitted-here",
  "no-break-here",
  "index",
  "next-line",
  "start-of-selected-area",
  "end-of-selected-area",
  "character-tabulation-set",
  "character-tabulation-with-justification",
  "line-tabulation-set",
  "partial-line-forward",
  "partial-line-backward",
  "reverse-line-feed",
  "single-shift-two",
  "single-shift-three",
  "device-control-string",
  "private-use-1",
  "private-use-2",
  "set-transmit-state",
  "cancel-character",
  "message-waiting",
  "start-of-protected-area",
  "end-of-protected-area",
  "start-of-string",
  "single-graphic-character-introducer",
  "single-character-intro-introducer",
  "control-sequence-introducer",
  "string-terminator",
  "operating-system-command",
  "private-message",
  "application-program-command"
];
const espChars = `{}%-$_()*|`;
const espCharsFunc = `$`;
function charSuitableForAttrName(char) {
  const res = !`"'><=`.includes(char);
  return res;
}
function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
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
    if (breakingCharValidatorFuncArr.some(func => func(str[i], i))) {
      if (!terminatorCharValidatorFuncArr) {
        return i;
      }
      lastRes = i;
    }
    if (
      terminatorCharValidatorFuncArr !== null &&
      lastRes &&
      terminatorCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      return lastRes;
    }
    if (
      !charWePassValidatorFuncArr.some(func => func(str[i], i)) &&
      !breakingCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
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
function isTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/isTagChar(): input is not a single string character!"
    );
  }
  return !`><=`.includes(char);
}
function lastChar(str) {
  if (typeof str !== "string" || !str.length) {
    return "";
  }
  return str[str.length - 1];
}
function secondToLastChar(str) {
  if (typeof str !== "string" || !str.length || str.length === 1) {
    return "";
  }
  return str[str.length - 2];
}
function firstChar(str) {
  if (typeof str !== "string" || !str.length) {
    return "";
  }
  return str[0];
}
function secondChar(str) {
  if (typeof str !== "string" || !str.length || str.length === 1) {
    return "";
  }
  return str[1];
}
function isLowerCaseLetter(char) {
  return isStr(char) && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
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
function isNum(something) {
  return typeof something === "number";
}
function isLowercase(char) {
  return (
    isStr(char) && char.toLowerCase() === char && char.toUpperCase() !== char
  );
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
  return isLowerCaseLetter(char) || char === ":";
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
      return true;
    }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      if (
        !str[i + 1] ||
        !right(str, i) ||
        (!str.slice(i).includes("'") && !str.slice(i).includes('"'))
      ) {
        return true;
      } else if (str[right(str, i)] === "<") {
        return true;
      }
    }
    else if (r3_1 && !r3_2 && str[i].trim().length && !isTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
      } else {
        r3_1 = false;
      }
    }
    else if (r3_2 && !r3_3 && str[i].trim().length) {
      if (charSuitableForTagName(str[i]) || str[i] === "/") {
        r3_3 = true;
      } else {
        r3_1 = false;
        r3_2 = false;
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
        return true;
      } else if (`='"`.includes(str[i])) {
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
      }
    }
    else if (r3_3 && !r3_4 && !str[i].trim().length) {
      r3_4 = true;
    }
    else if (r3_4 && !r3_5 && str[i].trim().length) {
      if (charSuitableForAttrName(str[i])) {
        r3_5 = true;
      } else {
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        r3_4 = false;
      }
    }
    else if (r3_5) {
      if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
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
    }
    else if (
      !r2_2 &&
      r2_1 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r2_2 = true;
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
        } else {
          return true;
        }
      } else {
        r2_1 = false;
      }
    }
    else if (!r2_3 && r2_2 && str[i].trim().length) {
      if (`'"`.includes(str[i])) {
        r2_3 = true;
      } else {
        r2_1 = false;
        r2_2 = false;
      }
    }
    else if (r2_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        r2_4 = true;
      } else {
        if (closingQuotePos != null && closingQuotePos === i) {
          if (
            isStr(str[quotes.at]) &&
            `"'`.includes(str[quotes.at]) &&
            `"'`.includes(str[i])
          ) {
            r2_4 = true;
          } else if (
            isStr(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[i])
          ) {
            r2_4 = true;
          } else if (
            isStr(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[i])
          ) {
            r2_4 = true;
          }
        } else if (
          closingQuotePos == null &&
          withinTagInnerspace(str, null, i)
        ) {
          if (quotes.within) {
            quotes.within = false;
          }
          r2_4 = true;
        }
      }
    }
    else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
      if (str[i] === ">") {
        return true;
      } else if (charSuitableForAttrName(str[i])) {
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
    }
    else if (
      r4_1 &&
      str[i].trim().length &&
      (!charSuitableForAttrName(str[i]) || str[i] === "/")
    ) {
      if (str[i] === "/" && str[right(str, i)] === ">") {
        return true;
      }
      r4_1 = false;
    }
    if (
      beginningOfAString &&
      !quotes.within &&
      !r5_1 &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i])
    ) {
      r5_1 = true;
    }
    else if (
      r5_1 &&
      !r5_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r5_2 = true;
      } else {
        r5_1 = false;
      }
    }
    else if (r5_2 && !r5_3 && str[i].trim().length) {
      if (str[i] === ">") {
        r5_3 = true;
      } else {
        r5_1 = false;
        r5_2 = false;
      }
    }
    else if (r5_3 && str[i].trim().length && !isTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
      } else {
        r5_1 = false;
        r5_2 = false;
        r5_3 = false;
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
      } else {
        r6_1 = false;
      }
    }
    else if (!r6_3 && r6_2 && str[i].trim().length) {
      if (charIsQuote(str[i])) {
        r6_3 = true;
      } else {
        r6_1 = false;
        r6_2 = false;
      }
    }
    else if (r6_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        return true;
      }
      else if (str[i + 1] && `/>`.includes(str[right(str, i)])) {
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
    }
    if (
      r7_1 &&
      !str[i].trim().length &&
      str[i + 1] &&
      charSuitableForAttrName(str[i + 1])
    ) {
      r7_1 = false;
    }
    if (
      !quotes.within &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i]) &&
      r7_1
    ) {
      if (str[i] === "=") {
        return true;
      }
      r7_1 = false;
    }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
    }
  }
  return false;
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
  let doNothingUntil;
  for (let i = idx, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    let caughtTag;
    if (!doNothingUntil) {
      if (
        Object.keys(knownESPTags)
          .filter(tag => knownESPTags[tag].type === "opening")
          .some(tag => {
            if (str.startsWith(tag, i)) {
              caughtTag = tag;
              return true;
            }
          })
      ) {
        doNothingUntil = knownESPTags[caughtTag].sibling;
      }
    }
    if (
      doNothingUntil &&
      arrayiffy(doNothingUntil).some(val => str.startsWith(val, i))
    ) {
      doNothingUntil = undefined;
    }
    if (!doNothingUntil && (charcode === 34 || charcode === 39)) {
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
    else if (!doNothingUntil && str[i].trim().length) {
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
        const whatFollowsEq = right(str, i);
        if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
          if (
            lastQuoteAt &&
            lastQuoteAt !== idx &&
            withinTagInnerspace(str, lastQuoteAt + 1)
          ) {
            return lastQuoteAt + 1;
          } else if (!lastQuoteAt || lastQuoteAt === idx) {
            const startingPoint = str[i - 1].trim().length
              ? i - 1
              : left(str, i);
            let res;
            for (let y = startingPoint; y--; ) {
              if (!str[y].trim().length) {
                res = left(str, y) + 1;
                break;
              } else if (y === idx) {
                res = idx + 1;
                break;
              }
            }
            return res;
          }
        } else if (str[i + 1].trim().length) {
          let temp;
          for (let y = i; y--; ) {
            if (!str[y].trim().length) {
              temp = left(str, y);
              break;
            }
          }
          if (charIsQuote(temp)) {
            return temp;
          }
          return temp + 1;
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
  if (str[i] === "<") {
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
  } else if (str[i] === "`") {
    return {
      name: "bad-character-grave-accent",
      position: [[i, i + 1, "&#x60;"]]
    };
  } else if (str[i] === "\xA3") {
    return {
      name: "bad-character-unencoded-pound",
      position: [[i, i + 1, "&pound;"]]
    };
  } else if (str[i] === "\u20AC") {
    return {
      name: "bad-character-unencoded-euro",
      position: [[i, i + 1, "&euro;"]]
    };
  } else if (str[i] === "\xA2") {
    return {
      name: "bad-character-unencoded-cent",
      position: [[i, i + 1, "&cent;"]]
    };
  }
  return null;
}
function flip(str) {
  if (isStr(str) && str.length) {
    return str.replace(/\{/g, "}").replace(/\(/g, ")");
  }
}
function pingEspTag(str, espTagObj, submit) {
  if (isNum(espTagObj.startAt) && isNum(espTagObj.endAt)) {
    const openingParens = str
      .slice(espTagObj.startAt, espTagObj.endAt)
      .match(/\(/g);
    const closingParens = str
      .slice(espTagObj.startAt, espTagObj.endAt)
      .match(/\)/g);
    if (
      (isArr(openingParens) &&
        isArr(closingParens) &&
        openingParens.length !== closingParens.length) ||
      (isArr(openingParens) && !isArr(closingParens)) ||
      (!isArr(openingParens) && isArr(closingParens))
    ) {
      if (
        (isArr(openingParens) &&
          isArr(closingParens) &&
          openingParens.length > closingParens.length) ||
        (isArr(openingParens) && openingParens.length && !isArr(closingParens))
      ) {
        submit({
          name: "esp-more-opening-parentheses-than-closing",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      } else if (
        (isArr(openingParens) &&
          isArr(closingParens) &&
          openingParens.length < closingParens.length) ||
        (isArr(closingParens) && closingParens.length && !isArr(openingParens))
      ) {
        submit({
          name: "esp-more-closing-parentheses-than-opening",
          position: [[espTagObj.startAt, espTagObj.endAt]]
        });
      }
    }
  }
}
function encode(str, mode = "html") {
  if (mode === "html") {
    let encoded = he.encode(str, {
      useNamedReferences: true
    });
    if (
      typeof encoded === "string" &&
      encoded.length &&
      encoded.startsWith("&") &&
      encoded.endsWith(";") &&
      typeof notEmailFriendly === "object" &&
      Object.prototype.hasOwnProperty.call(
        notEmailFriendly,
        encoded.slice(1, encoded.length - 1)
      )
    ) {
      encoded = `&${notEmailFriendly[encoded.slice(1, encoded.length - 1)]};`;
    }
    return encoded;
  }
}

export { attributeOnTheRight, c1CharacterNames, charIsQuote, charSuitableForAttrName, charSuitableForTagName, characterSuitableForNames, encode, encodeChar, espChars, espCharsFunc, findClosingQuote, firstChar, flip, isLatinLetter, isLowerCaseLetter, isLowercase, isNum, isStr, isTagChar, isUppercaseLetter, lastChar, log, lowAsciiCharacterNames, onlyTheseLeadToThat, pingEspTag, secondChar, secondToLastChar, tagOnTheRight, withinTagInnerspace };
