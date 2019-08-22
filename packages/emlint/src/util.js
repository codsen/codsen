import { left, right } from "string-left-right";
import he from "he";
import emailPatternNumericEntities from "./emailPatternNumericEntities.json";

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

function charSuitableForAttrName(char) {
  const res = !`"'><=`.includes(char);
  // console.log(`0082 emlint/util/charSuitableForAttrName(): return ${res}`);
  return res;
}

function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char); // notice, there's no dot or hash!
}

// onlyTheseLeadToThat() - automates lookups to the right.
//
// charWePassValidatorFuncArr - function or array of functions
// breakingCharValidatorFuncArr - function or array of functions
// terminatorCharValidatorFuncArr - null or function or array of functions.
//
// Under normal operation, selection is not greedy. Characters must pass
// the one of validator functions in array breakingCharValidatorFuncArr.
// If neither of validator functions pass before the braking character
// validator functions stop the process, result is return "false".
//
// Greedy approach is to catch sequences:
// valid chars - breaking chars - valid chars - breaking chars
// For example, when we detect unclosed attribute contents, they might
// contain unencoded closing brackets. In this case, we use greedy
// selection - stop at not the first encountered closing bracket, but the
// last closing bracket which is preceded by valid sequences, possibly
// interwined with breaking characters.
//
// Greedy operation requires that not only some breaking character validator
// is passed but also characters that follow must pass one of terminator
// validator functions.
//
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
  // if single functions are passed directly, it's fine, arrayiffy them:
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
    // console.log(`0137 str[${i}] = ${str[i]}`);
    // catch breaking character; run given char. through breaking validators
    if (breakingCharValidatorFuncArr.some(func => func(str[i], i))) {
      if (!terminatorCharValidatorFuncArr) {
        // not greedy
        // console.log(
        //   `0143 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${i}`}\u001b[${39}m`}`
        // );
        return i;
      }
      // ELSE, greedy cases:
      lastRes = i;
    }

    // greedy cases' break clauses
    if (
      terminatorCharValidatorFuncArr !== null &&
      lastRes &&
      terminatorCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      // console.log(
      //   `0158 util/onlyTheseLeadToThat: ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${31}m${`return ${lastRes}`}\u001b[${39}m`}`
      // );
      return lastRes;
    }

    // run given character through all given validators
    if (
      !charWePassValidatorFuncArr.some(func => func(str[i], i)) &&
      !breakingCharValidatorFuncArr.some(func => func(str[i], i))
    ) {
      // console.log(
      //   `0169 util/onlyTheseLeadToThat: ${`\u001b[${31}m${`██`}\u001b[${39}m`} return ${`\u001b[${31}m${`false`}\u001b[${39}m`}`
      // );
      return false;
    }
  }
}

// confirms that in string, traversing right of given index "idx", there are
// only spaces or attribute-friendly characters, followed by equal character
function onlyAttrFriendlyCharsLeadingToEqual(str, idx = 0) {
  // let ok = true;
  // for (let i = idx, len = str.length; i < len; i++) {
  //   if (str[i] === "=") {
  //     break;
  //   }
  //   if (!charSuitableForAttrName(str[i])) {
  //     ok = false;
  //   }
  // }
  // return ok;

  return onlyTheseLeadToThat(
    str,
    idx,
    charSuitableForAttrName, // validator
    char => char === "=" // breaking
  ); // ps. it's non-greedy
}

function charIsQuote(char) {
  // u201C - left double
  // u201D - right double
  // u2018 - left single
  // u2019 - right single
  // also notice backtick escaped below, third character in a quotes row:
  const res = `"'\`\u2018\u2019\u201C\u201D`.includes(char);
  // console.log(`0205 emlint/util/charIsQuote(): return ${res}`);
  return res;
}

function isTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/isTagChar(): input is not a single string character!"
    );
  }
  // const res = !`><=`.includes(char);
  // console.log(`0216 emlint/util/charNotTag(): return ${res}`);
  // return res;
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

// "is an upper case LATIN letter", that is
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
  // we mean Latin letters A-Z, a-z
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
      // 1st arg
      return `\u001b[${32}m${curr.toUpperCase()}\u001b[${39}m`;
    } else if (idx % 2 !== 0) {
      // 2nd arg, 4th, 6th and so on, even numbers
      return `${accum} \u001b[${33}m${curr}\u001b[${39}m`;
    }
    // 3rd, 5th, 7th and so on, uneven numbers
    return `${accum} = ${JSON.stringify(curr, null, 4)}${
      arr[idx + 1] ? ";" : ""
    }`;
  }, "");
}

// withinTagInnerspace() tells, are we currently located (string index zero or supplied index "idx")
// somewhere between tag's name and attribute, or between attributes, or between attribute and tag's
// closing slash (optional) and closing bracket.
//
// <img src="abc.jpg" alt="xyz" />
//     ^             ^         ^
//   yes            yes       yes
//
// All other locations besides the above would be falsey. Also, zero-width gaps report as true:
// <img alt="xyz"/>
//               ^
//              yes
// Remember, index means gap to the left of a given character at that index.
// For example, if you have a string "ab", a is index zero, b is index 1. Something being located "at
// index 1" would mean that exact meant location is to the left of "b", between "a" and "b".
function withinTagInnerspace(str, idx, closingQuotePos) {
  // console.log("\n\n\n\n\n");
  // console.log(`0324 withinTagInnerspace() called, idx = ${idx}`);
  if (typeof idx !== "number") {
    if (idx == null) {
      idx = 0;
    } else {
      throw new Error(
        `emlint/util.js/withinTagInnerspace(): second argument is of a type ${typeof idx}`
      );
    }
  }

  // vars
  // ---------------------------------------------------------------------------
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
  const attrNameChar = {
    at: null,
    last: false,
    precedes: false
  };
  const quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false // <----- !
  };
  // is true until up to the first non-whitespace character and at that character.
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
  // let r7_2 = false;
  // let r7_3 = false;

  //                         L O O P     S T A R T S
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                               \  |  /
  //                                \ | /
  //                                 \|/
  //                                  V
  for (let i = idx, len = str.length; i < len; i++) {
    // logging
    // -------------------------------------------------------------------------

    // const charcode = str[i].charCodeAt(0);
    // console.log(
    //   `${`\u001b[${
    //     closingQuotePos != null ? 35 : 36
    //   }m${`=`}\u001b[${39}m\u001b[${
    //     closingQuotePos != null ? 33 : 34
    //   }m${`=`}\u001b[${39}m`.repeat(15)} \u001b[${31}m${`str[ ${i} ] = ${
    //     str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
    //   }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} ${`\u001b[${
    //     closingQuotePos != null ? 35 : 36
    //   }m${`=`}\u001b[${39}m\u001b[${
    //     closingQuotePos != null ? 33 : 34
    //   }m${`=`}\u001b[${39}m`.repeat(15)}${
    //     closingQuotePos != null ? " RECURSION" : ""
    //   }`
    // );

    // action
    // -------------------------------------------------------------------------

    // catch the whitespace
    if (!str[i].trim().length) {
      // it's a whitespace character

      // reset whitespace marker
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
      if (attrNameChar.last) {
        attrNameChar.precedes = true;
      }
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                          STATE MARKERS
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // catch the closing brackets
    if (str[i] === ">") {
      closingBracket.at = i;
      closingBracket.last = true;
    } else if (closingBracket.last) {
      closingBracket.precedes = true;
      closingBracket.last = false;
    } else {
      closingBracket.precedes = false;
    }

    // catch the slashes
    if (str[i] === "/") {
      slash.at = i;
      slash.last = true;
    } else if (slash.last) {
      slash.precedes = true;
      slash.last = false;
    } else {
      slash.precedes = false;
    }

    // catch characters suitable for attribute name
    if (str[i] === ">") {
      attrNameChar.at = i;
      attrNameChar.last = true;
    } else if (attrNameChar.last) {
      attrNameChar.precedes = true;
      attrNameChar.last = false;
    } else {
      attrNameChar.precedes = false;
    }

    // catch quotes
    if (charIsQuote(str[i])) {
      // Quotes are different from other characters we catch because we keep
      // note of opening quotes and keep track of being within quotes this way.
      // Only matching quote (or really serious code pattern, if the given code
      // is broken) can terminate the state of "being within the quotes".
      if (quotes.at === null) {
        quotes.within = true;
        quotes.at = i;
      } else if (str[i] === str[quotes.at] || i === closingQuotePos) {
        // quotes.at = null; // <---- don't remove the opening quotes' index marker upon stepping onto
        // the closing quotes. Wipe it afterwards, upon stepping on a next character.
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
      // console.log(
      //   `0526 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "quotes.at",
      //     quotes.at
      //   )}`
      // );
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                              RULES
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // R1. Beginning, followed by a closing of a tag " / > " constitutes a
    // positive case (except when in quotes)
    if (
      !quotes.within &&
      beginningOfAString &&
      str[i] === "/" &&
      ">".includes(str[right(str, i)])
    ) {
      // console.log(
      //   `0563 ${`\u001b[${32}m${`██ R1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "return",
      //     "true"
      //   )}`
      // );
      // console.log("\n\n\n\n\n\n");
      return true;
    }

    // R2 swapped with R3, deliberately wrong order because r2 might jump into r3

    // R3. closing bracket only. This requires a tag to follow to prove it's a real tag ending.
    // For example: ` ><b>`
    // Consideration: what if text is present between tags? For example: ` >   zzz   <b>`
    // -------------------------------------------------------------------------

    // r3_1 - closing bracket
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      // console.log(
      //   `0583 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "r3_1",
      //     r3_1
      //   )}`
      // );

      // if there's string ending on the right or the rest of the string doesn't
      // contain any quotes, that's a tag ending, just the attribute was missing
      // the closing quote.
      if (
        !str[i + 1] ||
        !right(str, i) ||
        (!str.slice(i).includes("'") && !str.slice(i).includes('"'))
      ) {
        // quick ending, we have something like:
        // <img alt=>
        //          ^ <---- we're here, at closing bracket, further there's EOF
        // console.log(
        //   `0602 EOF detected ${`\u001b[${32}m${`██ R3.2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "return",
        //     "true"
        //   )}`
        // );
        // console.log("\n\n\n\n\n\n");
        return true;
      } else if (str[right(str, i)] === "<") {
        // nobody puts "><" within attribute values
        // console.log(
        //   `0612 ${`\u001b[${32}m${`██ R3.3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "return",
        //     "true"
        //   )}`
        // );
        // console.log("\n\n\n\n\n\n");
        return true;
      }
    }

    // r3_2 - opening bracket, optionally preceded by non-tag characters
    else if (r3_1 && !r3_2 && str[i].trim().length && !isTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
        // console.log(
        //   `0627 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r3_2",
        //     r3_2
        //   )}`
        // );
      } else {
        r3_1 = false;
        // console.log(
        //   `0636 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r3_1",
        //     r3_1
        //   )}`
        // );
      }
    }

    // r3_3 - one or more tag name-friendly characters
    else if (r3_2 && !r3_3 && str[i].trim().length) {
      if (charSuitableForTagName(str[i]) || str[i] === "/") {
        r3_3 = true;
        // console.log(
        //   `0650 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r3_3",
        //     r3_3
        //   )}`
        // );
      } else {
        r3_1 = false;
        r3_2 = false;
        // console.log(
        //   `0660 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r3_1",
        //     r3_1,
        //     "r3_2",
        //     r3_2
        //   )}`
        // );
      }
    }

    // r3_4 - healthy tag contents follow the tag name
    else if (
      r3_3 &&
      !r3_4 &&
      str[i].trim().length &&
      !charSuitableForTagName(str[i])
    ) {
      // if it's closing bracket or closing slash followed by an optional
      // whitespace and then closing bracket, that is a tag there
      if (
        "<>".includes(str[i]) ||
        (str[i] === "/" && "<>".includes(right(str, i)))
      ) {
        // console.log(
        //   `0685 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "return",
        //     "true"
        //   )}`
        // );
        // console.log("\n\n\n\n\n\n");
        return true;
      } else if (`='"`.includes(str[i])) {
        // this looks like an attribute, so freak out and wipe all r3_*
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        // console.log(
        //   `0698 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r3_1",
        //     r3_1,
        //     "r3_2",
        //     r3_2,
        //     "r3_3",
        //     r3_3
        //   )}`
        // );
      }
    }

    // r3_4 - if a space follows
    else if (r3_3 && !r3_4 && !str[i].trim().length) {
      r3_4 = true;
      // console.log(
      //   `0715 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "r3_4",
      //     r3_4
      //   )}`
      // );
    }

    // r3_5 - if an attribute's name follows
    else if (r3_4 && !r3_5 && str[i].trim().length) {
      if (charSuitableForAttrName(str[i])) {
        // if it seems an attribute name starts
        r3_5 = true;
        // console.log(
        //   `0729 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r3_5",
        //     r3_5
        //   )}`
        // );
      } else {
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        r3_4 = false;
        // console.log(
        //   `0741 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r3_1",
        //     r3_1,
        //     "r3_2",
        //     r3_2,
        //     "r3_3",
        //     r3_3,
        //     "r3_4",
        //     r3_4
        //   )}`
        // );
      }
    }

    // r3_4 - if a space follows (value-less attribute) or equal (healthy attr) or
    // quote of any king (messed up attr), it's confirmed to be a tag there
    else if (r3_5) {
      if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
        // console.log(
        //   `0761 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "return",
        //     "true"
        //   )}`
        // );
        // console.log("\n\n\n\n\n\n");
        return true;
      }
    }

    // -------------------------------------------------------------------------
    // important. R2 must be under R3 because R2 sometimes jumps into R3 flow
    // -------------------------------------------------------------------------

    // R2. attribute with equal, value surrounded with quotes and closing
    // bracket (slash optional) (clause R2/1), OR there's a space and
    // attribute-friendly character follows (clause R2/2).

    // we'll separate all clauses into separate pieces: r2_1 means R2 clause, piece 1.

    // r2_1 - chunk of characters, suitable for an attribute name
    if (
      !quotes.within &&
      beginningOfAString &&
      charSuitableForAttrName(str[i]) &&
      !r2_1 &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r2_1 = true;
      // console.log(
      //   `0791 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "r2_1",
      //     r2_1
      //   )}`
      // );
    }

    // r2_2 - equal that follows the attribute's name
    else if (
      !r2_2 &&
      r2_1 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      // if it's equal, activate r2_2, otherwise, wipe all preceding clauses (r2_1)
      if (str[i] === "=") {
        r2_2 = true;
        // console.log(
        //   `0810 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r2_2",
        //     r2_2
        //   )}`
        // );
      } else if (
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        let closingBracketAt = i;
        if (str[i] === "/") {
          closingBracketAt = str[right(str, i)];
        }

        // check, are there any characters after the closing bracket:
        if (right(str, closingBracketAt)) {
          // if it's a tag's closing, we've got a value-less attribute,
          // as in: " nobr>", right side of <td nobr> for example.
          r3_1 = true;
          r2_1 = false;
          // console.log(
          //   `0832 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          //     "set",
          //     "r2_1",
          //     r2_1,
          //     "r3_1",
          //     r3_1
          //   )}`
          // );
        } else {
          // console.log(
          //   `0842 ${`\u001b[${32}m${`██ R2.1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          //     "return",
          //     "true"
          //   )}`
          // );
          // console.log("\n\n\n\n\n\n");
          return true;
        }
      } else {
        r2_1 = false;
        // console.log(
        //   `0853 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r2_1",
        //     r2_1
        //   )}`
        // );
      }
    }

    // r2_3 - quote follows
    else if (!r2_3 && r2_2 && str[i].trim().length) {
      if (`'"`.includes(str[i])) {
        r2_3 = true;
        // console.log(
        //   `0867 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r2_3",
        //     r2_3
        //   )}`
        // );
      } else {
        r2_1 = false;
        r2_2 = false;
        // console.log(
        //   `0877 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "reset",
        //     "r2_1",
        //     r2_1,
        //     "r2_2",
        //     r2_2
        //   )}`
        // );
      }
    }

    // r2_4 - closing quote of an attribute
    else if (r2_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        r2_4 = true;
        // console.log(
        //   `0893 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r2_4",
        //     r2_4
        //   )}`
        // );
      } else {
        // check, is this a recursion and closing quote is given as a message
        // from the future
        if (closingQuotePos != null && closingQuotePos === i) {
          // console.log("0903 recursion, this is the index the future indicated");
          // it's a recursion

          // - if quotes are single-opening, double-closing or double-opening,
          // single-closing, we count this as positive case, with condition that
          // all other patterns are met.
          // - if quotes are out of whack, they must be the opposite-type, for
          // example, case where normal quotes got turned into "fancy" quotes,
          // - if it's a backtick, opening and closing must match, otherwise
          // it's a too messed up case

          if (
            isStr(str[quotes.at]) &&
            `"'`.includes(str[quotes.at]) &&
            `"'`.includes(str[i])
          ) {
            // we have a mismatching pair of single-double straight quotes

            // we'll forgive this mishap and let this recursive run continue:

            r2_4 = true;
            // console.log(
            //   `0925 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            //     "set",
            //     "r2_4",
            //     r2_4
            //   )}`
            // );
          } else if (
            isStr(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[quotes.at]) &&
            `\u2018\u2019`.includes(str[i])
          ) {
            // Single curly quotes. Fine.
            r2_4 = true;
            // console.log(
            //   `0939 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            //     "set",
            //     "r2_4",
            //     r2_4
            //   )}`
            // );
          } else if (
            isStr(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[quotes.at]) &&
            `\u201C\u201D`.includes(str[i])
          ) {
            // Double curly quotes. Fine too.
            r2_4 = true;
            // console.log(
            //   `0953 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            //     "set",
            //     "r2_4",
            //     r2_4
            //   )}`
            // );
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

          console.log(
            "0975 not a recursion, but result from one came positive"
          );

          // not a recursion, but it's confirmed that quotes were mismatching:
          // 1. turn off "quotes.within", because it won't turn off by itself
          if (quotes.within) {
            quotes.within = false;
          }
          // 2. do the other deeds
          r2_4 = true;
          console.log(
            `0986 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
              "set",
              "r2_4",
              r2_4
            )}`
          );
        }
      }
    }

    // final clause
    else if (r2_4 && !quotes.within && str[i].trim().length && str[i] !== "/") {
      if (str[i] === ">") {
        console.log(
          `1000 ${`\u001b[${32}m${`██ R2/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      } else if (charSuitableForAttrName(str[i])) {
        console.log(
          `1009 ${`\u001b[${32}m${`██ R2/2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }

    // R4. value-less attribute followed by slash followed by closing bracket
    // -------------------------------------------------------------------------

    // r4_1 - chunk of characters, suitable for an attribute name
    if (
      !quotes.within &&
      beginningOfAString &&
      !r4_1 &&
      charSuitableForAttrName(str[i]) &&
      (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r4_1 = true;
      console.log(
        `1032 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r4_1",
          r4_1
        )}`
      );
    }

    // r4_2 - if an XHTML style tag ending follows
    else if (
      r4_1 &&
      str[i].trim().length &&
      (!charSuitableForAttrName(str[i]) || str[i] === "/")
    ) {
      // if it's a slash+closing bracket
      if (str[i] === "/" && str[right(str, i)] === ">") {
        console.log(
          `1049 ${`\u001b[${32}m${`██ R4`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      r4_1 = false;
      console.log(
        `1059 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r4_1",
          r4_1
        )}`
      );
    }

    // R5. broken code: " zzz= >aaa<b>"
    // the quotes and content between them is missing on an attribute
    // -------------------------------------------------------------------------

    // r5_1 - attribute name character
    if (
      beginningOfAString &&
      !quotes.within &&
      !r5_1 &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i])
    ) {
      r5_1 = true;
      console.log(
        `1081 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r5_1",
          r5_1
        )}`
      );
    }

    // r5_2 - equal sign
    else if (
      r5_1 &&
      !r5_2 &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i])
    ) {
      if (str[i] === "=") {
        r5_2 = true;
        console.log(
          `1099 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_2",
            r5_2
          )}`
        );
      } else {
        r5_1 = false;
        console.log(
          `1108 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r5_1",
            r5_1
          )}`
        );
      }
    }

    // r5_3 - equal sign
    else if (r5_2 && !r5_3 && str[i].trim().length) {
      if (str[i] === ">") {
        r5_3 = true;
        console.log(
          `1122 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r5_3",
            r5_3
          )}`
        );
      } else {
        r5_1 = false;
        r5_2 = false;
        console.log(
          `1132 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r5_1",
            r5_1,
            "r5_2",
            r5_2
          )}`
        );
      }
    }

    // r5_4 - opening bracket, optionally preceded by non-tag characters
    else if (r5_3 && str[i].trim().length && !isTagChar(str[i])) {
      if (str[i] === "<") {
        r3_2 = true;
        // r3_2 and onwards match tag
        console.log(
          `1149 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `1160 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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

    // -------------------------------------------------------------------------

    // R6. clean attribute anywhere
    // this is primarily aiming to skip value-less attributes
    // also, we'll bail if suspicious characters are met
    //
    // something="zzz"
    // +
    // valuelessattr something="zzz"

    // r6_1 - catch sequences of attribute name characters, skipping spaces,
    // what in theory should bypass value-less attributes and jump onto first
    // value-containing attribute.

    // notice there's no "beginningOfAString" being used!!!
    // we're matching anywhere
    if (
      !quotes.within &&
      !r6_1 &&
      (charSuitableForAttrName(str[i]) || !str[i].trim().length) &&
      !charSuitableForAttrName(str[i - 1]) &&
      str[i - 1] !== "="
    ) {
      // chunk of attribute's name catched:
      r6_1 = true;
      console.log(
        `1199 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r6_1",
          r6_1
        )}`
      );
    }

    // r6_2 - catch equal
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
          `1218 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_2",
            r6_2
          )}`
        );
      } else {
        r6_1 = false;
        console.log(
          `1227 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r6_1",
            r6_1
          )}`
        );
      }
    }

    // r6_3 - opening quotes
    else if (!r6_3 && r6_2 && str[i].trim().length) {
      if (charIsQuote(str[i])) {
        r6_3 = true;
        console.log(
          `1241 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r6_3",
            r6_3
          )}`
        );
      } else {
        r6_1 = false;
        r6_2 = false;
        console.log(
          `1251 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r6_1",
            r6_1,
            "r6_2",
            r6_2
          )}`
        );
      }
    }

    // r6_4 - closing quote of an attribute
    else if (r6_3 && charIsQuote(str[i])) {
      if (str[i] === str[quotes.at]) {
        // matching closing quotes
        console.log(
          `1267 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      // it's mismatching quotes
      // further clauses needed
      else if (str[i + 1] && `/>`.includes(str[right(str, i)])) {
        // mismatching quotes, but tag ending follows
        console.log(
          `1280 ${`\u001b[${32}m${`██ R6/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
    }

    // R7. attribute's value is without quotes
    // For example: ` border=0><b>`
    // -------------------------------------------------------------------------

    // r7_1 - beginning of the input, attribute's name seems to start
    if (
      beginningOfAString &&
      str[i].trim().length &&
      charSuitableForAttrName(str[i]) &&
      !r7_1 // &&
      // (str[left(str, i)] !== "=" || onlyAttrFriendlyCharsLeadingToEqual(str, i))
    ) {
      r7_1 = true;
      console.log(
        `1304 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r7_1",
          r7_1
        )}`
      );
    }

    // detection of potential multiple attribute names. For example:
    // <a bcd = ef ghi = jk lmn / >
    //         ^
    // starting at index 8.
    // Notice there are two chunks of characters suitable for attribute name.
    // This is bad, there should be only one chunk of such characters.
    //
    // If such case was detected, turn off 7_1
    if (
      r7_1 &&
      !str[i].trim().length &&
      str[i + 1] &&
      charSuitableForAttrName(str[i + 1])
    ) {
      console.log(
        `1327 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r7_1",
          r7_1
        )}`
      );
      r7_1 = false;
    }

    // r7_2 - beginning of the input, attribute's name seems to start
    if (
      !quotes.within &&
      str[i].trim().length &&
      !charSuitableForAttrName(str[i]) &&
      r7_1 // &&
      // !r7_2
    ) {
      // if equal follows attribute's name, good
      if (str[i] === "=") {
        // r7_2 = true;
        // console.log(
        //   `1348 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
        //     "set",
        //     "r7_2",
        //     r7_2
        //   )}`
        // );
        console.log(
          `1355 ${`\u001b[${32}m${`██ R7/1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        console.log("\n\n\n\n\n\n");
        return true;
      }
      // ELSE, wipe
      r7_1 = false;
      console.log(
        `1366 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r7_1",
          r7_1
        )}`
      );
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                       RULES AT THE BOTTOM
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    if (whitespaceStartAt !== null) {
      // set whitespace marker
      whitespaceStartAt = null;
      // console.log(
      //   `1398 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "whitespaceStartAt",
      //     whitespaceStartAt
      //   )}`
      // );
    }

    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
      // console.log(
      //   `1409 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "beginningOfAString",
      //     beginningOfAString
      //   )}`
      // );
    }

    // logging:
    // -------------------------------------------------------------------------

    // console.log(`\u001b[${36}m${`█`}\u001b[${39}m`);
    // console.log(
    //   `${`\u001b[${33}m${`whitespaceStartAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     whitespaceStartAt,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`closingBracket`}\u001b[${39}m`} = ${JSON.stringify(
    //     closingBracket,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`slash`}\u001b[${39}m`} = ${JSON.stringify(
    //     slash,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`beginningOfAString`}\u001b[${39}m`} = ${JSON.stringify(
    //     beginningOfAString,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
    //     quotes,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`r2_1`}\u001b[${39}m`} = ${JSON.stringify(
    //     r2_1,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`r2_2`}\u001b[${39}m`} = ${JSON.stringify(
    //     r2_2,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`r2_3`}\u001b[${39}m`} = ${JSON.stringify(
    //     r2_3,
    //     null,
    //     0
    //   )}`
    // );
    // console.log(
    //   `${`\u001b[${33}m${`r2_4`}\u001b[${39}m`} = ${JSON.stringify(
    //     r2_4,
    //     null,
    //     0
    //   )}`
    // );
  }
  //                                  ^
  //                                 /|\
  //                                / | \
  //                               /  |  \
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                         L O O P     E N D S

  console.log(`1495 withinTagInnerspace(): FIN. RETURN FALSE.`);
  console.log("\n\n\n\n\n\n");
  return false;
}

// All previous regexes to recreate:
// const r1 = /^\s*\w+\s*=\s*(?:["'][^"']*["'])?(?:(?:\s*\/?>)|\s+)/g;
// const r2 = /^\s*\/*\s*>\s*</g;
// const r3 = /^\s*\/*\s*>\s*\w/g;
// const r4 = /^\s*\w*\s*\/+\s*>/g;
// const r5 = /^\s*\/*\s*>\s*$/g;
// const r6 = /^\s*\w*\s*\/?\s*>(?:(\s*$)|(\s*[^=>'"]*<))/g;
// const r7 = /^\s*\w+\s*\w+\s*=\s*(?:["'][^=>"']*["'])/g;

function tagOnTheRight(str, idx = 0) {
  console.log(
    `1511 util/tagOnTheRight() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`1513 tagOnTheRight() called, idx = ${idx}`);

  // r1. tag without attributes
  // for example <br>, <br/>
  const r1 = /^<\s*\w+\s*\/?\s*>/g;

  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;

  // r3. closing/self-closing tags
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;

  // r4. opening tag with attributes,
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;

  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(
      `1532 util/tagOnTheRight(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(
      `1537 util/tagOnTheRight(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(
      `1542 util/tagOnTheRight(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(
      `1547 util/tagOnTheRight(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `1553 util/tagOnTheRight(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
  return res;
}

// Confirms that's an attribute value, from double-quote to double quote.
// It is used to detect cases where one set of quotes is missing, like <img alt=">
//
// as in:
//
// 1.
// "blablabla">
// "blablabla"/>
// 2.
// "blablabla" attr="tralalaa"
// "blablabla" attr='tralalaa'
// and variations.
//
// but not:
// 1. ">
// 2. "/>
// 3. " attr=
// 4. " attr1 atr2=
// 5. " attr1 atr2>

// ----
// <img alt="sometext < more text = other/text' anotherTag="zzz"/><img alt="sometext < more text = other text"/>

function attributeOnTheRight(str, idx = 0, closingQuoteAt = null) {
  console.log(
    `${`\u001b[${32}m${`\n██`}\u001b[${39}m`} util/attributeOnTheRight() ${`\u001b[${32}m${`██\n`}\u001b[${39}m`}`
  );
  console.log(`closingQuoteAt = ${JSON.stringify(closingQuoteAt, null, 4)}`);
  // We start iterating from single or double quote, hoping to prove it's an
  // attribute's opening quote.
  // First, we traverse to the same closing or opening quote.
  // Then, we traverse further and find out, which one follows first:
  // 1. slash, closing bracket
  // or
  // 2. equals character followed by some quotes

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

  //                         L O O P     S T A R T S
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                               \  |  /
  //                                \ | /
  //                                 \|/
  //                                  V
  for (let i = idx, len = str.length; i < len; i++) {
    // logging
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
    // catch the closing quote
    if (
      (i === closingQuoteAt && i > idx) ||
      (closingQuoteAt === null && i > idx && str[i] === startingQuoteVal)
    ) {
      closingQuoteAt = i;
      console.log(
        `1646 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `1655 (util/attributeOnTheRight) ${log(
            "set",
            "closingQuoteMatched",
            closingQuoteMatched
          )}`
        );
      }
    }
    // regular catchers:
    if (str[i] === ">") {
      lastClosingBracket = i;
      console.log(
        `1667 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `1677 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `1687 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `1693 (util/attributeOnTheRight) ${log(
          "set",
          "lastSomeQuote",
          lastSomeQuote
        )}`
      );
    }

    // mismatching attribute correction
    // if we are within assumed "quotes", within attribute's value, but we spot
    // the suspicious tag contents, attributes etc., reset the calculation,
    // but provide insights to the second calculation.

    // catch pattern =" or ='
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log(
        "1709 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        //
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          // if this is the first such occurence after closing quotes matched,
          // this is it. We stumbled upon the new attribute
          console.log(
            `1717 (util/attributeOnTheRight) ${log(
              "return",
              "closingQuoteAt",
              closingQuoteAt
            )}`
          );
          return closingQuoteAt;
        }
      } else {
        // it's very dodgy, HTML attribute assignment within another attribute

        // now, if we are already within a correction check of a recursion,
        // that's it. No more recursive calls.
        if (closingQuoteAt) {
          console.log(
            "1732 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }

        console.log(
          `1739 (util/attributeOnTheRight) ${log(
            " ███████████████████████████████████████ correction!\n",
            "true"
          )}`
        );
        // 1. step1. check, maybe closing quote is mismatching the opening and
        // therefore we passed it without noticing. Get "lastSomeQuote" and
        // see do we get a positive result if we consider that quote's index
        // as a closing.

        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          // notice the 3rd input argument - it's suspected closing quote's position:
          const correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log(
              "1754 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `1757 (util/attributeOnTheRight) ${log(
                "return",
                "lastSomeQuote",
                lastSomeQuote
              )}`
            );
            return lastSomeQuote;
          }
        }

        // 2.
        const correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          // If there's a healthy attribute onwards, it's definitely false.
          // Otherwise, still dubious.
          console.log(
            "1773 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `1776 (util/attributeOnTheRight) ${log("return", "false")}`
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
      // if closing bracket is met, that's positive case
      console.log(
        `1790 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }

    // chopped off code scenarios
    if (
      closingQuoteMatched &&
      lastClosingBracket === null &&
      lastOpeningBracket === null &&
      (lastSomeQuote === null ||
        (lastSomeQuote && closingQuoteAt >= lastSomeQuote)) &&
      lastEqual === null
    ) {
      // closingQuoteAt >= ...
      // PS. closingQuoteAt above is deliberate, to exclude starting quotes,
      // which are at position zero.

      // yes, it's within attribute, albeit chopped off file end follows
      console.log(
        `1814 (util/attributeOnTheRight) ${log(
          "return",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      return closingQuoteAt;
    }

    //         S
    //         S
    //         S
    //         S
    //         S
    //         S
    //   BOTTOM RULES
    //         S
    //         S
    //         S
    //         S
    //         S
    //         S
    if (!str[i + 1]) {
      console.log(`1837 (util) "EOL reached"`);
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  //                                  ^
  //                                 /|\
  //                                / | \
  //                               /  |  \
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                         L O O P     E N D S

  // ;
  // by this point, we give a last chance, maybe quotes were mismatched:
  if (lastSomeQuote && closingQuoteAt === null) {
    // as in lastSomeQuote !== 0
    console.log("1855 (util) last chance, run correction 3");
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
        "1867 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`1869 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }

  console.log(`1874 (util) ${log("bottom - return", "false")}`);
  return false;
}

// findClosingQuote()

// Algorithm.

// Traverse until single/double quote, followed by zero or more whitespace, followed
// by zero or more slashes followed by one or more closing brackets.
// OR
// Traverse until the first =" pattern is found.
//
// Make a note of that single/double quote. If later checks pass, that's what
// we'll return - index of that single/double quote.
// Now, once such thing is found, check what's on the right of that quote, does
// it pass function withinTagInnerspace().
//  - If it does, return the single/double quote's position index.
//  - If it does not, move to the next occurence of the same pattern.
//
// If end of the loop is reached fruitless, return null.
function findClosingQuote(str, idx = 0) {
  console.log(
    `1897 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  let lastNonWhitespaceCharWasQuoteAt = null;
  let lastQuoteAt = null;
  const startingQuote = `"'`.includes(str[idx]) ? str[idx] : null;
  let lastClosingBracketAt = null;

  //                         L O O P     S T A R T S
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                               \  |  /
  //                                \ | /
  //                                 \|/
  //                                  V
  for (let i = idx, len = str.length; i < len; i++) {
    // logging
    const charcode = str[i].charCodeAt(0);

    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${34}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

    // if single or double quote
    if (charcode === 34 || charcode === 39) {
      // quick ending - if closing quote, matching the opening-one is met, that's the result
      if (str[i] === startingQuote && i > idx) {
        console.log(
          `1928 (util/findClosingQuote) quick ending, ${i} is the matching quote`
        );
        return i;
      }

      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `1936 (util/findClosingQuote) ${log(
          "set",
          "lastNonWhitespaceCharWasQuoteAt",
          lastNonWhitespaceCharWasQuoteAt
        )}`
      );

      // catch closing quotes, good code cases or good code with present quotes
      // but mismatching, such as <aaa bbb="ccc'>
      if (
        i > idx &&
        (str[i] === "'" || str[i] === '"') &&
        withinTagInnerspace(str, i + 1)
      ) {
        console.log(`1950 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
      console.log("1953 (util/findClosingQuote) didn't pass");
      // maybe this is an unclosed tag and there's a healthy tag on the right?
      if (tagOnTheRight(str, i + 1)) {
        console.log(
          `1957 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) tag on the right - return i=${i}`
        );
        return i;
      }
      console.log(
        `1962 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) NOT tag on the right`
      );
    }

    // catch non-whitespace characters
    else if (str[i].trim().length) {
      console.log("1968 (util/findClosingQuote)");

      if (str[i] === ">") {
        // catch closing brackets:
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          console.log(
            `1975 (util/findClosingQuote) ${log(
              "!",
              "suitable candidate found"
            )}`
          );
          // perform the check, are we outside quotes' content, within the space
          // of a tag:
          const temp = withinTagInnerspace(str, i);
          console.log(
            `1984 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
          );
          if (temp) {
            // now, we have two cases.
            // 1. In healthy code, where closing quote is present, this "last quote"
            // would be the one we want to report.
            // 2. In messed up code where there are no closing quotes, for example
            // <zzz alt=" />
            // the index of the opening quote, also "the last quote", would be
            // returned.
            // However, algorithmically, if we have to work with such code, in
            // case of our example <zzz alt=" />, the index of opening quote
            // means we would "insert" things in front of it. When string index is
            // given as starting-one, it means "to the left of it". When string
            // index is given as closing-one, it means "up to but not including it".
            // So, in dirty code cases, we want to report index as the next character,
            // for example <zzz alt=" /> - not 9 but 10 (to the right of double
            // quote), because inevitably we'll want to INSERT those missing
            // characters and index will be correct.

            // Detect if code is messed up - lastNonWhitespaceCharWasQuoteAt === idx
            if (lastNonWhitespaceCharWasQuoteAt === idx) {
              console.log(
                `2007 (util/findClosingQuote) ${log(
                  "return",
                  "lastNonWhitespaceCharWasQuoteAt + 1",
                  lastNonWhitespaceCharWasQuoteAt + 1
                )}`
              );
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            console.log(
              `2016 (util/findClosingQuote) ${log(
                "return",
                "lastNonWhitespaceCharWasQuoteAt",
                lastNonWhitespaceCharWasQuoteAt
              )}`
            );
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        //
        // cases like:
        // <zzz alt="nnn="mmm">
        //              ^

        // also, cases like:
        // <a bcd=ef ghj=kl mno=pqrs>
        //        ^

        const whatFollowsEq = right(str, i);
        console.log(
          `2037 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );

        if (whatFollowsEq && charIsQuote(str[whatFollowsEq])) {
          console.log("2045 (util/findClosingQuote)");
          console.log(
            `2047 (util/findClosingQuote) ${log(
              "log",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt,
              "lastQuoteAt",
              lastQuoteAt,
              "idx",
              idx
            )}`
          );

          // since we discovered another attribute starting, go back, to the
          // last quote, check does it pass the util/withinTagInnerspace()
          if (
            lastQuoteAt &&
            lastQuoteAt !== idx &&
            withinTagInnerspace(str, lastQuoteAt + 1)
          ) {
            console.log(
              `2066 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          } else if (!lastQuoteAt || lastQuoteAt === idx) {
            console.log(`2074 we don't have lastQuoteAt`);
            // we have a case like:
            // <a bcd=ef ghi='jk' lmn>
            // or
            // <a bcd="ef ghi='jk' lmn>
            //
            // if we started at index 7, at letter "e", went up to closing quote
            // after equal of "ghi=", at 14. There are no closing quotes up to
            // there.

            // turn back and go until first whitespace character is met. This
            // will be the starting point of the attribute (at whose closing we
            // are at). Then use left() and that will be the suitable position
            // for quotes suggestion (if quotes don't exist already there).

            const startingPoint = str[i - 1].trim().length
              ? i - 1
              : left(str, i);
            let res;
            console.log(
              `2094 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
                startingPoint,
                null,
                4
              )}; idx=${idx}`
            );
            for (let y = startingPoint; y--; ) {
              console.log(
                `2102 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
              );
              if (!str[y].trim().length) {
                res = left(str, y) + 1;
                console.log(
                  `2107 \u001b[${36}m${`break`}\u001b[${39}m res=${res}`
                );
                break;
              } else if (y === idx) {
                res = idx + 1;
                console.log(
                  `2113 \u001b[${36}m${`break`}\u001b[${39}m res=${res}`
                );
                break;
              }
            }
            console.log(
              `2119 ${`\u001b[${33}m${`RETURN`}\u001b[${39}m`}: ${JSON.stringify(
                res,
                null,
                4
              )}`
            );
            return res;
          }

          console.log(
            "2129 ${`\u001b[${31}m${`recursive cycle didn't pass`}\u001b[${39}m`}"
          );
        } else if (str[i + 1].trim().length) {
          // the quote is missing and there is no space after equal character
          console.log("");
          console.log(
            `2135 it's not the expected quote but ${str[whatFollowsEq]} at index ${whatFollowsEq}`
          );
          // for example, we have:
          // <a bcd=ef ghj=kl mno=pqrs>
          // we started at "e" (index 7) and we are at after "j", at "equal",
          // at index 13.
          // We must traverse backwards until the whitespace, then return the
          // last non-whitespace character leading to that whitespace.
          let temp;
          for (let y = i; y--; ) {
            console.log(
              `2146 \u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`
            );
            if (!str[y].trim().length) {
              temp = left(str, y);
              console.log(
                `2151 (util/findClosingQuote) ${log(
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
              `2162 (util/findClosingQuote) ${log("return", "temp", temp)}`
            );
            return temp;
          }
          console.log(
            `2167 (util/findClosingQuote) ${log(
              "return",
              "temp + 1",
              temp + 1
            )}`
          );
          return temp + 1;
        }
      } else if (str[i] !== "/") {
        // 1. catch <
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          console.log(`2178 ██ tag on the right`);
          if (lastClosingBracketAt !== null) {
            console.log(
              `2181 (util/findClosingQuote) ${log(
                "return",
                "lastClosingBracketAt",
                lastClosingBracketAt
              )}`
            );
            return lastClosingBracketAt;
          }
        }

        // 2. resets to catch sequences only
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          lastNonWhitespaceCharWasQuoteAt = null;
          console.log(
            `2195 (util/findClosingQuote) ${log(
              "set",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt
            )}`
          );
        }
      }
    }

    // ======
    console.log(
      `2207 (util/findClosingQuote) ${log(
        "END",
        "lastNonWhitespaceCharWasQuoteAt",
        lastNonWhitespaceCharWasQuoteAt
      )}`
    );
  }
  //                                  ^
  //                                 /|\
  //                                / | \
  //                               /  |  \
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                         L O O P     E N D S

  return null;
}

function encodeChar(str, i) {
  // if (
  //   str[i] === "&" &&
  //   (!str[i + 1] || str[i + 1] !== "a") &&
  //   (!str[i + 2] || str[i + 2] !== "m") &&
  //   (!str[i + 3] || str[i + 3] !== "p") &&
  //   (!str[i + 3] || str[i + 3] !== ";")
  // ) {
  //   return {
  //     name: "bad-character-unencoded-ampersand",
  //     position: [[i, i + 1, "&amp;"]]
  //   };
  // } else if (str[i] === "<") {
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

// flips string, preparing heuristical assumption of tails. Converts: { => },
// ( => ), and leaves the rest alone.
function flip(str) {
  if (isStr(str) && str.length) {
    return str.replace(/\{/g, "}").replace(/\(/g, ")");
  }
}

function pingEspTag(str, espTagObj, submit) {
  // 1. catch mismatching parentheses' errors:
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
        console.log(
          `2314 util.js: ${log(
            "push",
            "esp-more-opening-parentheses-than-closing",
            `${`[[${espTagObj.startAt}, ${espTagObj.endAt}]]`}`
          )}`
        );
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
        console.log(
          `2331 util.js: ${log(
            "push",
            "esp-more-closing-parentheses-than-opening",
            `${`[[${espTagObj.startAt}, ${espTagObj.endAt}]]`}`
          )}`
        );
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
      typeof emailPatternNumericEntities === "object" &&
      Object.prototype.hasOwnProperty.call(
        emailPatternNumericEntities,
        encoded.slice(1, encoded.length - 1)
      )
    ) {
      encoded = `&${
        emailPatternNumericEntities[encoded.slice(1, encoded.length - 1)]
      };`;
      console.log(
        `2362 util.js "${encoded.slice(
          1,
          encoded.length - 1
        )}" is email-pattern positive, we'll turn it into "${
          emailPatternNumericEntities[encoded.slice(1, encoded.length - 1)]
        }" instead`
      );
    }
    return encoded;
  }
}

export {
  characterSuitableForNames,
  charSuitableForAttrName,
  charSuitableForTagName,
  lowAsciiCharacterNames,
  attributeOnTheRight,
  onlyTheseLeadToThat,
  withinTagInnerspace,
  isLowerCaseLetter,
  isUppercaseLetter,
  findClosingQuote,
  secondToLastChar,
  c1CharacterNames,
  tagOnTheRight,
  isLatinLetter,
  isLowercase,
  charIsQuote,
  pingEspTag,
  encodeChar,
  secondChar,
  firstChar,
  isTagChar,
  lastChar,
  encode,
  isStr,
  isNum,
  flip,
  log
};
