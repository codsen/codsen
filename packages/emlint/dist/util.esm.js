import { right, left } from 'string-left-right';

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
    console.log(`129 str[${i}] = ${str[i]}`);
    if (breakingCharValidatorFuncArr.some(func => func(str[i], i))) {
      if (!terminatorCharValidatorFuncArr) {
        console.log(
          `135 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${i}`}\u001b[${39}m`}`
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
        `150 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${lastRes}`}\u001b[${39}m`}`
      );
      return lastRes;
    }
    if (
      !charWePassValidatorFuncArr.some(func => func(str[i], i)) &&
      !breakingCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      console.log(
        `161 util/onlyTheseLeadToThat: ${`\u001b[${31}m${`██`}\u001b[${39}m`} return ${`\u001b[${31}m${`false`}\u001b[${39}m`}`
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
  console.log(`285 withinTagInnerspace() called, idx = ${idx}`);
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
        `566 ${`\u001b[${32}m${`██ R1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `586 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `605 EOF detected ${`\u001b[${32}m${`██ R3.2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (str[right(str, i)] === "<") {
        console.log(
          `615 ${`\u001b[${32}m${`██ R3.3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `630 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_2",
            r3_2
          )}`
        );
      } else {
        r3_1 = false;
        console.log(
          `639 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `653 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_3",
            r3_3
          )}`
        );
      } else {
        r3_1 = false;
        r3_2 = false;
        console.log(
          `663 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `688 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `701 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `718 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `732 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `744 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `764 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `794 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `813 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
            `835 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_1",
              r2_1,
              "r3_1",
              r3_1
            )}`
          );
        } else {
          console.log(
            `845 ${`\u001b[${32}m${`██ R2.1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `856 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `870 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_3",
            r2_3
          )}`
        );
      } else {
        r2_1 = false;
        r2_2 = false;
        console.log(
          `880 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `896 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_4",
            r2_4
          )}`
        );
      } else {
        if (closingQuotePos != null && closingQuotePos === i) {
          console.log("906 recursion, this is the index the future indicated");
          if (
            isStr(str[quotes.at]) &&
            `"'`.includes(str[quotes.at]) &&
            `"'`.includes(str[i])
          ) {
            r2_4 = true;
            console.log(
              `928 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
              `942 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
              `956 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          console.log("977 not a recursion, but result from one came positive");
          if (quotes.within) {
            quotes.within = false;
          }
          r2_4 = true;
          console.log(
            `987 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1001 ${`\u001b[${32}m${`██ R2/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (charSuitableForAttrName(str[i])) {
        console.log(
          `1010 ${`\u001b[${32}m${`██ R2/2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `1033 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1050 ${`\u001b[${32}m${`██ R4`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      r4_1 = false;
      console.log(
        `1060 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `1082 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1100 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_2",
            r5_2
          )}`
        );
      } else {
        r5_1 = false;
        console.log(
          `1109 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1123 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_3",
            r5_3
          )}`
        );
      } else {
        r5_1 = false;
        r5_2 = false;
        console.log(
          `1133 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1150 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1161 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `1200 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1219 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_2",
            r6_2
          )}`
        );
      } else {
        r6_1 = false;
        console.log(
          `1228 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1242 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_3",
            r6_3
          )}`
        );
      } else {
        r6_1 = false;
        r6_2 = false;
        console.log(
          `1252 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1268 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      else if (str[i + 1] && `/>`.includes(str[right(str, i)])) {
        console.log(
          `1281 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `1305 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
        `1328 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1356 ${`\u001b[${32}m${`██ R7/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      r7_1 = false;
      console.log(
        `1367 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
  console.log(`1496 withinTagInnerspace(): FIN. RETURN FALSE.`);
  console.log("\n\n\n\n\n\n");
  return false;
}
function tagOnTheRight(str, idx = 0) {
  console.log(
    `1512 util/tagOnTheRight() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`1514 tagOnTheRight() called, idx = ${idx}`);
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(
      `1533 util/tagOnTheRight(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(
      `1538 util/tagOnTheRight(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(
      `1543 util/tagOnTheRight(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(
      `1548 util/tagOnTheRight(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `1554 util/tagOnTheRight(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
  return res;
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
        `1647 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `1656 (util/attributeOnTheRight) ${log(
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
        `1668 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `1678 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `1688 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `1694 (util/attributeOnTheRight) ${log(
          "set",
          "lastSomeQuote",
          lastSomeQuote
        )}`
      );
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log(
        "1710 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log(
            `1718 (util/attributeOnTheRight) ${log(
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
            "1733 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }
        console.log(
          `1740 (util/attributeOnTheRight) ${log(
            " ███████████████████████████████████████ correction!\n",
            "true"
          )}`
        );
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log(
              "1755 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `1758 (util/attributeOnTheRight) ${log(
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
            "1774 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `1777 (util/attributeOnTheRight) ${log("return", "false")}`
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
        `1791 (util/attributeOnTheRight) ${log(
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
        `1815 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log(`1838 (util) "EOL reached"`);
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1856 (util) last chance, run correction 3");
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
        "1868 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`1870 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }
  console.log(`1875 (util) ${log("bottom - return", "false")}`);
  return false;
}
function findClosingQuote(str, idx = 0) {
  console.log(
    `1895 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
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
          `1926 (util/findClosingQuote) quick ending, ${i} is the matching quote`
        );
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `1934 (util/findClosingQuote) ${log(
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
        console.log(`1948 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
      console.log("1951 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log(
          `1955 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) tag on the right - return i=${i}`
        );
        return i;
      }
      console.log(
        `1960 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) NOT tag on the right`
      );
    }
    else if (str[i].trim().length) {
      console.log("1966 (util/findClosingQuote)");
      if (str[i] === ">") {
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          console.log(
            `1973 (util/findClosingQuote) ${log(
              "!",
              "suitable candidate found"
            )}`
          );
          const temp = withinTagInnerspace(str, i);
          console.log(
            `1982 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
          );
          if (temp) {
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              console.log(
                `2005 (util/findClosingQuote) ${log(
                  "return",
                  "lastNonWhitespaceCharWasQuoteAt + 1",
                  lastNonWhitespaceCharWasQuoteAt + 1
                )}`
              );
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            console.log(
              `2014 (util/findClosingQuote) ${log(
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
          `2035 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );
        if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
          console.log("2045 (util/findClosingQuote)");
          console.log(
            `${`\u001b[${33}m${`lastNonWhitespaceCharWasQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharWasQuoteAt,
              null,
              4
            )}`
          );
          if (lastQuoteAt && withinTagInnerspace(str, lastQuoteAt + 1)) {
            console.log(
              `2057 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          } else if (!lastQuoteAt) {
            console.log(`2065 we don't have lastQuoteAt`);
            const startingPoint = str[i - 1].trim().length
              ? i - 1
              : left(str, i);
            let res;
            console.log(
              `2082 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
                startingPoint,
                null,
                4
              )}`
            );
            for (let y = startingPoint; y--; ) {
              console.log(
                `2090 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
              );
              if (!str[y].trim().length) {
                console.log(`2093 \u001b[${36}m${`break`}\u001b[${39}m`);
                res = left(str, y) + 1;
                break;
              }
            }
            console.log(
              `2099 ${`\u001b[${33}m${`RETURN`}\u001b[${39}m`}: ${JSON.stringify(
                res,
                null,
                4
              )}`
            );
            return res;
          }
          console.log("2108 recursive cycle didn't pass");
        } else if (str[i + 1].trim().length) {
          console.log("");
          console.log(
            `2113 it's not the expected quote but ${
              str[whatFollowsEq]
            } at index ${whatFollowsEq}`
          );
          let temp;
          for (let y = i; y--; ) {
            console.log(
              `2126 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
            );
            if (!str[y].trim().length) {
              temp = left(str, y);
              console.log(
                `2131 (util/findClosingQuote) ${log(
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
              `2142 (util/findClosingQuote) ${log("return", "temp", temp)}`
            );
            return temp;
          }
          console.log(
            `2147 (util/findClosingQuote) ${log(
              "return",
              "temp + 1",
              temp + 1
            )}`
          );
          return temp + 1;
        }
      } else if (str[i] !== "/") {
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          console.log(`2158 ██ tag on the right`);
          if (lastClosingBracketAt !== null) {
            console.log(
              `2161 (util/findClosingQuote) ${log(
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
            `2175 (util/findClosingQuote) ${log(
              "set",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt
            )}`
          );
        }
      }
    }
    console.log(
      `2187 (util/findClosingQuote) ${log(
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
  } else if (str[i] === "`") {
    return {
      name: "bad-character-grave-accent",
      position: [[i, i + 1, "&#x60;"]]
    };
  }
  return null;
}

export { charSuitableForTagName, charSuitableForAttrName, charIsQuote, notTagChar, isUppercaseLetter, isLowercase, isStr, lowAsciiCharacterNames, c1CharacterNames, log, isLatinLetter, withinTagInnerspace, attributeOnTheRight, findClosingQuote, encodeChar, tagOnTheRight, onlyTheseLeadToThat };
