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
  const res = !`"'><=`.includes(char);
  console.log(`157 emlint/util/charSuitableForAttrName(): return ${res}`);
  return res;
}

function charIsQuote(char) {
  const res = `"'\u2018\u2019\u201D\u201D`.includes(char);
  console.log(`163 emlint/util/charIsQuote(): return ${res}`);
  return res;
}

function notTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error(
      "emlint/util/charNotTag(): input is not a single string character!"
    );
  }
  const res = !`><=`.includes(char);
  console.log(`174 emlint/util/charNotTag(): return ${res}`);
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
  // we mean Latin letters A-Z, a-z
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
function withinTagInnerspace(str, idx = 0) {
  console.log(`250 withinTagInnerspace() called, idx = ${idx}`);
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

    // action
    // ---------------------------------------------------------------------------

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
    if (`'"`.includes(str[i])) {
      // Quotes are different from other characters we catch because we keep
      // note of opening quotes and keep track of being within quotes this way.
      // Only matching quote (or really serious code pattern, if the given code
      // is broken) can terminate the state of "being within the quotes".
      if (quotes.at === null) {
        quotes.within = true;
        quotes.at = i;
      } else if (str[i] === str[quotes.at]) {
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
      console.log(
        `423 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "quotes.at",
          quotes.at
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

    // R1. Closing of a tag " / > " constitutes a positive case (except when in quotes)
    if (
      !quotes.within &&
      beginningOfAString &&
      str[i] === "/" &&
      ">".includes(str[firstIdxOnTheRight(str, i)])
    ) {
      console.log(
        `459 ${`\u001b[${32}m${`██ R1`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "return",
          "true"
        )}`
      );
      return true;
    }

    // -----------------------------------------------------------------------------

    // R2. attribute with equal, value surrounded with quotes and closing bracket. Slash optional.
    // we'll separate all clauses into separate pieces: r2_1 means R2 clause, piece 1.

    // r2_1 - chunk of characters, suitable for an attribute name
    if (
      !quotes.within &&
      beginningOfAString &&
      charSuitableForAttrName(str[i]) &&
      !r2_1
    ) {
      r2_1 = true;
      console.log(
        `481 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r2_1",
          r2_1
        )}`
      );
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
        console.log(
          `500 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_2",
            r2_2
          )}`
        );
      } else {
        r2_1 = false;
        console.log(
          `509 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r2_1",
            r2_1
          )}`
        );
      }
    }

    // r2_3 - quote follows
    else if (!r2_3 && r2_2 && str[i].trim().length) {
      if (`'"`.includes(str[i])) {
        r2_3 = true;
        console.log(
          `523 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r2_3",
            r2_3
          )}`
        );
      } else {
        r2_1 = false;
        r2_2 = false;
        console.log(
          `533 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r2_1",
            r2_1,
            "r2_2",
            r2_2
          )}`
        );
      }
    }

    // r2_4 - closing quote of an attribute
    else if (r2_3 && str[i] === str[quotes.at]) {
      r2_4 = true;
      console.log(
        `548 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r2_4",
          r2_4
        )}`
      );
    }

    // final clause
    else if (r2_4 && !quotes.within && str[i] === ">") {
      console.log(
        `559 ${`\u001b[${32}m${`██ R2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "return",
          "true"
        )}`
      );
      return true;
    }

    // R3. closing bracket only. This requires a tag to follow to prove it's a real tag ending.
    // For example: ` ><b>`
    // Consideration: what if text is present between tags? For example: ` >   zzz   <b>`
    // -----------------------------------------------------------------------------

    // r3_1 - closing bracket
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      console.log(
        `576 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r3_1",
          r3_1
        )}`
      );

      if (str[firstIdxOnTheRight(str, i)] === "<") {
        // nobody puts "><" within attribute values
        console.log(
          `586 ${`\u001b[${32}m${`██ R3.2`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      }
    }

    // r3_2 - opening bracket, optionally preceded by non-tag characters
    else if (r3_1 && !r3_2 && !notTagChar(str[i])) {
      r3_2 = true;
      console.log(
        `599 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r3_2",
          r3_2
        )}`
      );
    }

    // r3_3 - one or more tag name-friendly characters
    else if (r3_2 && !r3_3 && str[i].trim().length) {
      if (charSuitableForTagName(str[i]) || str[i] === "/") {
        r3_3 = true;
        console.log(
          `612 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "set",
            "r3_3",
            r3_3
          )}`
        );
      } else {
        r3_1 = false;
        r3_2 = false;
        console.log(
          `622 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "reset",
            "r3_1",
            r3_1,
            "r3_2",
            r3_2
          )}`
        );
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
        (str[i] === "/" && "<>".includes(firstIdxOnTheRight(str, i)))
      ) {
        console.log(
          `647 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      } else if (`='"`.includes(str[i])) {
        // this looks like an attribute, so freak out and wipe all r3_*
        r3_1 = false;
        r3_2 = false;
        r3_3 = false;
        console.log(
          `659 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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

    // r3_4 - if a space follows
    else if (r3_3 && !r3_4 && !str[i].trim().length) {
      r3_4 = true;
      console.log(
        `676 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "r3_4",
          r3_4
        )}`
      );
    }

    // r3_5 - if an attribute's name follows
    else if (r3_4 && !r3_5 && str[i].trim().length) {
      if (charSuitableForAttrName(str[i])) {
        // if it seems an attribute name starts
        r3_5 = true;
        console.log(
          `690 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
          `702 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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

    // r3_4 - if a space follows (value-less attribute) or equal (healthy attr) or
    // quote of any king (messed up attr), it's confirmed to be a tag there
    else if (r3_5) {
      if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
        console.log(
          `722 ${`\u001b[${32}m${`██ R3`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      }
    }

    // R4. value-less attribute followed by slash followed by closing bracket
    // -----------------------------------------------------------------------------

    // r4_1 - chunk of characters, suitable for an attribute name
    if (
      !quotes.within &&
      beginningOfAString &&
      !r4_1 &&
      charSuitableForAttrName(str[i])
    ) {
      r4_1 = true;
      console.log(
        `743 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
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
      if (str[i] === "/" && str[firstIdxOnTheRight(str, i)] === ">") {
        console.log(
          `760 ${`\u001b[${32}m${`██ R4`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
            "return",
            "true"
          )}`
        );
        return true;
      }
      r4_1 = false;
      console.log(
        `769 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "reset",
          "r4_1",
          r4_1
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
      //   `801 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
      //     "set",
      //     "whitespaceStartAt",
      //     whitespaceStartAt
      //   )}`
      // );
    }

    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
      console.log(
        `812 ${`\u001b[${90}m${`withinTagInnerspace()`}\u001b[${39}m`} ${log(
          "set",
          "beginningOfAString",
          beginningOfAString
        )}`
      );
    }

    // logging:
    // -------------------------------------------------------------------------

    console.log(`\u001b[${36}m${`█`}\u001b[${39}m`);
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
      `${`\u001b[${33}m${`beginningOfAString`}\u001b[${39}m`} = ${JSON.stringify(
        beginningOfAString,
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
      `${`\u001b[${33}m${`r3_1`}\u001b[${39}m`} = ${JSON.stringify(
        r3_1,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r3_2`}\u001b[${39}m`} = ${JSON.stringify(
        r3_2,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r3_3`}\u001b[${39}m`} = ${JSON.stringify(
        r3_3,
        null,
        0
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`r3_4`}\u001b[${39}m`} = ${JSON.stringify(
        r3_4,
        null,
        0
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

  console.log(`\n███████████████████████████████████████`);
  console.log(`899 FIN. REACHED. RETURN FALSE.`);
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
    `914 util/tagOnTheRight() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`916 tagOnTheRight() called, idx = ${idx}`);

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
      `935 util/tagOnTheRight(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(
      `940 util/tagOnTheRight(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(
      `945 util/tagOnTheRight(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(
      `950 util/tagOnTheRight(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `956 util/tagOnTheRight(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
  return res;
}

// Looks what's the first non-whitespace character to the right of index "idx"
// on string "str". Returns index of that first non-whitespace character.
function firstIdxOnTheRight(str, idx = 0) {
  if (!str[idx + 1]) {
    return null;
  } else if (str[idx + 1] && str[idx + 1].trim().length) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  }
  // worst case scenario - traverse forwards
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}

// finds the index of the first non-whitespace character on the left
function firstOnTheLeft(str, idx = 0) {
  if (idx < 1) {
    return null;
  } else if (str[idx - 1] && str[idx - 1].trim().length) {
    // best case scenario - next character is non-whitespace:
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  }
  // worst case scenario - traverse backwards
  for (let i = idx; i--; ) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
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
        `1090 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `1099 (util/attributeOnTheRight) ${log(
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
        `1111 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `1121 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `1131 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `1137 (util/attributeOnTheRight) ${log(
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
        "1153 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        //
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          // if this is the first such occurence after closing quotes matched,
          // this is it. We stumbled upon the new attribute
          console.log(
            `1161 (util/attributeOnTheRight) ${log(
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
            "1176 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }

        console.log(
          `1183 (util/attributeOnTheRight) ${log(
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
              "1198 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `1201 (util/attributeOnTheRight) ${log(
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
            "1217 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `1220 (util/attributeOnTheRight) ${log("return", "false")}`
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
        `1234 (util/attributeOnTheRight) ${log(
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
        `1258 (util/attributeOnTheRight) ${log(
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
      console.log(`1281 (util) "EOL reached"`);
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
    console.log("1299 (util) last chance, run correction 3");
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
        "1311 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`1313 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }

  console.log(`1318 (util) ${log("bottom - return", "false")}`);
  return false;
}

// findClosingQuote()

// Algorithm.

// Traverse until single/double quote, followed by zero or more whitespace, followed
// by zero or more slashes followed by one or more closing brackets.
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
    `1338 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
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
          `1369 (util/findClosingQuote) quick ending, ${i} is the matching quote`
        );
        return i;
      }

      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `1377 (util/findClosingQuote) ${log(
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
        console.log(`1391 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
      console.log("1394 (util/findClosingQuote) didn't pass");
      // maybe this is an unclosed tag and there's a healthy tag on the right?
      if (tagOnTheRight(str, i + 1)) {
        console.log(
          `1398 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) tag on the right - return i=${i}`
        );
        return i;
      }
      console.log(
        `1403 \u001b[${35}m${`██`}\u001b[${39}m (util/findClosingQuote) NOT tag on the right`
      );
    }

    // catch non-whitespace characters
    else if (str[i].trim().length) {
      console.log("1409 (util/findClosingQuote)");

      if (str[i] === ">") {
        // catch closing brackets:
        lastClosingBracketAt = i;
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          console.log(
            `1416 (util/findClosingQuote) ${log(
              "!",
              "suitable candidate found"
            )}`
          );
          // perform the check, are we outside quotes' content, within the space
          // of a tag:
          const temp = withinTagInnerspace(str, i);
          console.log(
            `1425 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
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
                `1448 (util/findClosingQuote) ${log(
                  "return",
                  "lastNonWhitespaceCharWasQuoteAt + 1",
                  lastNonWhitespaceCharWasQuoteAt + 1
                )}`
              );
              return lastNonWhitespaceCharWasQuoteAt + 1;
            }
            console.log(
              `1457 (util/findClosingQuote) ${log(
                "return",
                "lastNonWhitespaceCharWasQuoteAt",
                lastNonWhitespaceCharWasQuoteAt
              )}`
            );
            return lastNonWhitespaceCharWasQuoteAt;
          }
        }
      } else if (str[i] === "=") {
        // cases like:
        // <zzz alt="nnn="mmm">
        //              ^
        const whatFollowsEq = firstIdxOnTheRight(str, i);
        console.log(
          `1472 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );
        if (
          whatFollowsEq &&
          (str[whatFollowsEq] === "'" || str[whatFollowsEq] === '"')
        ) {
          console.log("1482 (util/findClosingQuote)");
          console.log(
            `${`\u001b[${33}m${`lastNonWhitespaceCharWasQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastNonWhitespaceCharWasQuoteAt,
              null,
              4
            )}`
          );
          // since we discovered another attribute starting, go back, to the
          // last quote, check does it pass the util/withinTagInnerspace()
          if (withinTagInnerspace(str, lastQuoteAt + 1)) {
            console.log(
              `1494 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          }
          console.log("1502 didn't pass");
        }
      } else if (str[i] !== "/") {
        // 1. catch <
        if (str[i] === "<" && tagOnTheRight(str, i)) {
          console.log(`1507 ██ tag on the right`);
          if (lastClosingBracketAt !== null) {
            console.log(
              `1510 (util/findClosingQuote) ${log(
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
            `1524 (util/findClosingQuote) ${log(
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
      `1536 (util/findClosingQuote) ${log(
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

export {
  knownHTMLTags,
  charSuitableForTagName,
  charSuitableForAttrName,
  notTagChar,
  isUppercaseLetter,
  isLowercase,
  isStr,
  lowAsciiCharacterNames,
  log,
  isLatinLetter,
  withinTagInnerspace,
  firstIdxOnTheRight,
  firstOnTheLeft,
  attributeOnTheRight,
  findClosingQuote,
  encodeChar,
  tagOnTheRight
};
