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

function withinTagInnerspace(str, idx = 0) {
  console.log(`212 withinTagInnerspace() called, idx = ${idx}`);

  const r1 = /^\s*\w+\s*=\s*(?:["'][^"']*["'])?(?:(?:\s*\/?>)|\s+)/g;
  const r2 = /^\s*\/*\s*>\s*</g;
  const r3 = /^\s*\/*\s*>\s*\w/g;
  const r4 = /^\s*\w*\s*\/+\s*>/g;
  const r5 = /^\s*\/*\s*>\s*$/g;
  const r6 = /^\s*\w*\s*\/?\s*>(?:(\s*$)|(\s*[^=>'"]*<))/g;
  const r7 = /^\s*\w+\s*\w+\s*=\s*(?:["'][^=>"']*["'])/g;
  // regex matches beginning of a string, two cases:
  // "/><" (closing slash optional and there can be whitespace in between either char)
  // or
  // zzz="" (attribute, followed by whitespace or tag closing)
  // console.log(
  //   `226 (util) util/withinTagInnerspace ${`\u001b[${33}m${`str.slice(${idx})`}\u001b[${39}m`} = ${JSON.stringify(
  //     str.slice(idx),
  //     null,
  //     0
  //   )}`
  // );

  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(
      `237 util/withinTagInnerspace(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r2.test(whatToTest)) {
    console.log(
      `243 util/withinTagInnerspace(): ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r3.test(whatToTest)) {
    console.log(
      `249 util/withinTagInnerspace(): ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r4.test(whatToTest)) {
    console.log(
      `255 util/withinTagInnerspace(): ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r5.test(whatToTest)) {
    console.log(
      `261 util/withinTagInnerspace(): ${`\u001b[${31}m${`R5`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r6.test(whatToTest)) {
    console.log(
      `267 util/withinTagInnerspace(): ${`\u001b[${31}m${`R6`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  if (r7.test(whatToTest)) {
    console.log(
      `273 util/withinTagInnerspace(): ${`\u001b[${31}m${`R7`}\u001b[${39}m`} passed`
    );
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(
    `279 util/withinTagInnerspace(): return ${`\u001b[${36}m${res}\u001b[${39}m`}`
  );
  return res;
}

// Looks what's the first non-whitespace character to the right of index "idx"
// on string "str". Returns index of that first non-whitespace character.
function firstOnTheRight(str, idx = 0) {
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
        `404 (util/attributeOnTheRight) ${log(
          "set",
          "closingQuoteAt",
          closingQuoteAt
        )}`
      );
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log(
          `413 (util/attributeOnTheRight) ${log(
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
        `425 (util/attributeOnTheRight) ${log(
          "set",
          "lastClosingBracket",
          lastClosingBracket
        )}`
      );
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log(
        `435 (util/attributeOnTheRight) ${log(
          "set",
          "lastOpeningBracket",
          lastOpeningBracket
        )}`
      );
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log(
        `445 (util/attributeOnTheRight) ${log("set", "lastEqual", lastEqual)}`
      );
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log(
        `451 (util/attributeOnTheRight) ${log(
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
        "467 (util/attributeOnTheRight) within pattern check: equal-quote"
      );
      if (closingQuoteMatched) {
        //
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          // if this is the first such occurence after closing quotes matched,
          // this is it. We stumbled upon the new attribute
          console.log(
            `475 (util/attributeOnTheRight) ${log(
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
            "490 (util/attributeOnTheRight) STOP",
            'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".'
          );
          return false;
        }

        console.log(
          `497 (util/attributeOnTheRight) ${log(
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
              "512 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote"
            );
            console.log(
              `515 (util/attributeOnTheRight) ${log(
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
            "531 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow"
          );
          console.log(
            `534 (util/attributeOnTheRight) ${log("return", "false")}`
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
        `548 (util/attributeOnTheRight) ${log(
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
        `572 (util/attributeOnTheRight) ${log(
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
      console.log(`595 (util) "EOL reached"`);
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }

  // ;
  // by this point, we give a last chance, maybe quotes were mismatched:
  if (lastSomeQuote && closingQuoteAt === null) {
    // as in lastSomeQuote !== 0
    console.log("604 (util) last chance, run correction 3");
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
        "616 (util) CORRECTION #3 PASSED - mismatched quotes confirmed"
      );
      console.log(`618 (util) ${log("return", true)}`);
      return lastSomeQuote;
    }
  }

  console.log(`623 (util) ${log("bottom - return", "false")}`);
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
    `643 util/findClosingQuote() called, ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  let lastNonWhitespaceCharWasQuoteAt = null;
  let lastQuoteAt = null;
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
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log(
        `661 (util/findClosingQuote) ${log(
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
        console.log(`675 (util/findClosingQuote) ${log("return", i)}`);
        return i;
      }
    }

    // catch non-whitespace characters
    else if (str[i].trim().length) {
      console.log("682 (util/findClosingQuote)");
      if (str[i] === ">" && lastNonWhitespaceCharWasQuoteAt !== null) {
        console.log(
          `685 (util/findClosingQuote) ${log("!", "suitable candidate found")}`
        );
        // perform the check, are we outside quotes' content, within the space
        // of a tag:
        const temp = withinTagInnerspace(str, i);
        console.log(
          `691 (util/findClosingQuote) withinTagInnerspace() result: ${temp}`
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
              `714 (util/findClosingQuote) ${log(
                "return",
                "lastNonWhitespaceCharWasQuoteAt + 1",
                lastNonWhitespaceCharWasQuoteAt + 1
              )}`
            );
            return lastNonWhitespaceCharWasQuoteAt + 1;
          }
          console.log(
            `723 (util/findClosingQuote) ${log(
              "return",
              "lastNonWhitespaceCharWasQuoteAt",
              lastNonWhitespaceCharWasQuoteAt
            )}`
          );
          return lastNonWhitespaceCharWasQuoteAt;
        }
      } else if (str[i] === "=") {
        // cases like:
        // <zzz alt="nnn="mmm">
        //              ^
        const whatFollowsEq = firstOnTheRight(str, i);
        console.log(
          `737 (util/findClosingQuote) ${log(
            "set",
            "whatFollowsEq",
            whatFollowsEq
          )}`
        );
        if (
          whatFollowsEq &&
          (str[whatFollowsEq] === "'" || str[whatFollowsEq] === '"')
        ) {
          console.log("747 (util/findClosingQuote)");
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
              `759 (util/findClosingQuote) ${log(
                "return",
                "lastQuoteAt + 1",
                lastQuoteAt + 1
              )}`
            );
            return lastQuoteAt + 1;
          }
        }
      } else if (str[i] !== "/") {
        if (lastNonWhitespaceCharWasQuoteAt !== null) {
          lastNonWhitespaceCharWasQuoteAt = null;
          console.log(
            `772 (util/findClosingQuote) ${log(
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
      `784 (util/findClosingQuote) ${log(
        "END",
        "lastNonWhitespaceCharWasQuoteAt",
        lastNonWhitespaceCharWasQuoteAt
      )}`
    );
  }

  return null;
}

export {
  knownHTMLTags,
  charSuitableForTagName,
  isUppercaseLetter,
  isLowercase,
  isStr,
  lowAsciiCharacterNames,
  log,
  isLatinLetter,
  withinTagInnerspace,
  firstOnTheRight,
  firstOnTheLeft,
  attributeOnTheRight,
  findClosingQuote
};
