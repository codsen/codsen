/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.8.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import { allHtmlAttribs } from 'html-all-known-attributes';
import { matchRight, matchLeft, matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import { right, left } from 'string-left-right';
import clone from 'lodash.clonedeep';
import isTagOpening from 'is-html-tag-opening';

function startsComment(str, i, token) {
  return (
    ((str[i] === "<" &&
      matchRight(
        str,
        i,
        [
          "!-",
          "![",
          "[endif",
          "!endif",
          "1endif",
          "1[endif",
          "[!endif",
          "]!endif",
          "!]endif"
        ],
        {
          i: true,
          trimBeforeMatching: true
        }
      ) &&
      !matchRight(str, i, ["![cdata", "[cdata", "!cdata"], {
        i: true,
        trimBeforeMatching: true
      }) &&
      (token.type !== "comment" || token.kind !== "not")) ||
      (str[i] === "-" &&
        matchRight(str, i, ["->"], {
          trimBeforeMatching: true
        }) &&
        (token.type !== "comment" ||
          (!token.closing && token.kind !== "not")) &&
        !matchLeft(str, i, "<", {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["-", "!"]
        }))) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

function startsTag(str, i, token, layers) {
  console.log(
    `011 ██ startsTag(): ${isTagOpening(str, i, {
      allowCustomTagNames: true
    })}`
  );
  return (
    str[i] === "<" &&
    ((token.type === "text" &&
      isTagOpening(str, i, {
        allowCustomTagNames: true
      })) ||
      !layers.length) &&
    (str[right(str, i)] === ">" ||
      isTagOpening(str, i, {
        allowCustomTagNames: true
      }) ||
      matchRight(str, i, ["doctype", "xml", "cdata"], {
        i: true,
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
      })) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

const allHTMLTagsKnownToHumanity = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
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
  "command",
  "content",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
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
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "multicol",
  "nav",
  "nextid",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
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
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp"
];
const espChars = `{}%-$_()*|`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "{}", "%)", "*)", "**"];
function isStr(something) {
  return typeof something === "string";
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
  return /[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/i.test(
    char
  );
}
function charSuitableForHTMLAttrName(char) {
  return (
    isLatinLetter(char) ||
    (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) ||
    [":", "-"].includes(char)
  );
}
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = `]${res}`;
    } else if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}
function isTagNameRecognised(tagName) {
  return (
    allHTMLTagsKnownToHumanity.includes(tagName.toLowerCase()) ||
    ["doctype", "cdata", "xml"].includes(tagName.toLowerCase())
  );
}

function startsEsp(str, i, token, layers, styleStarts) {
  return (
    espChars.includes(str[i]) &&
    str[i + 1] &&
    espChars.includes(str[i + 1]) &&
    token.type !== "rule" &&
    token.type !== "at" &&
    !(str[i] === "-" && str[i + 1] === "-") &&
    !(
      (
        "0123456789".includes(str[left(str, i)]) &&
        (!str[i + 2] ||
          [`"`, `'`, ";"].includes(str[i + 2]) ||
          !str[i + 2].trim().length)
      )
    ) &&
    !(
      styleStarts &&
      ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))
    )
  );
}

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];
const charsThatEndCSSChunks = ["{", "}", ","];
function tokenizer(str, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.tagCb &&
    typeof originalOpts.tagCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(
        originalOpts.tagCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.charCb &&
    typeof originalOpts.charCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(
        originalOpts.charCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.reportProgressFunc &&
    typeof originalOpts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(
        originalOpts.reportProgressFunc,
        null,
        4
      )}`
    );
  }
  const defaults = {
    tagCb: null,
    charCb: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  const opts = Object.assign({}, defaults, originalOpts);
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing;
  let styleStarts = false;
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null
  };
  function tokenReset() {
    console.log(
      `190 ${`\u001b[${36}m${`██ tokenReset():`}\u001b[${39}m`} tokenReset() called`
    );
    token = clone(tokenDefault);
    attribReset();
    return token;
  }
  let attrib = {};
  const attribDefault = {
    attribName: null,
    attribNameRecognised: null,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValue: null,
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStart: null,
    attribEnd: null
  };
  function attribReset() {
    attrib = clone(attribDefault);
  }
  tokenReset();
  attribReset();
  let selectorChunkStartedAt;
  let layers = [];
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    const whichLayerToMatch = matchFirstInstead
      ? layers[0]
      : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return str[i] === flipEspTag(whichLayerToMatch.value);
    } else if (whichLayerToMatch.type === "esp") {
      if (!espChars.includes(str[i])) {
        return false;
      }
      let wholeEspTagLump = "";
      const len = str.length;
      for (let y = i; y < len; y++) {
        if (espChars.includes(str[y])) {
          wholeEspTagLump = wholeEspTagLump + str[y];
        } else {
          break;
        }
      }
      console.log(
        `299 ${`\u001b[${33}m${`wholeEspTagLump`}\u001b[${39}m`} = ${JSON.stringify(
          wholeEspTagLump,
          null,
          4
        )}`
      );
      console.log(
        `306 ${`\u001b[${33}m${`whichLayerToMatch.openingLump`}\u001b[${39}m`} = ${JSON.stringify(
          whichLayerToMatch.openingLump,
          null,
          4
        )}`
      );
      if (
        wholeEspTagLump &&
        whichLayerToMatch.openingLump &&
        wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length
      ) {
        if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
          console.log(
            `328 RETURN ${wholeEspTagLump.length -
              whichLayerToMatch.openingLump.length}`
          );
          return wholeEspTagLump.length - whichLayerToMatch.openingLump.length;
        }
        let uniqueCharsListFromGuessedClosingLumpArr = whichLayerToMatch.guessedClosingLump
          .split("")
          .reduce((acc, curr) => {
            if (!acc.includes(curr)) {
              return acc.concat([curr]);
            }
            return acc;
          }, []);
        console.log(
          `351 ${`\u001b[${33}m${`uniqueCharsListFromGuessedClosingLumpArr`}\u001b[${39}m`} = ${JSON.stringify(
            uniqueCharsListFromGuessedClosingLumpArr,
            null,
            0
          )}`
        );
        let found = 0;
        for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
          console.log(`360 char = ${wholeEspTagLump[y]}`);
          if (
            !uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            ) &&
            found > 1
          ) {
            console.log(`368 RETURN ${y}`);
            return y;
          }
          if (
            uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            )
          ) {
            found++;
            uniqueCharsListFromGuessedClosingLumpArr = uniqueCharsListFromGuessedClosingLumpArr.filter(
              el => el !== wholeEspTagLump[y]
            );
            console.log(
              `382 SET found = ${found}; uniqueCharsListFromGuessedClosingLumpArr = ${JSON.stringify(
                uniqueCharsListFromGuessedClosingLumpArr,
                null,
                0
              )}`
            );
          }
        }
      } else if (
        whichLayerToMatch.guessedClosingLump
          .split("")
          .every(char => wholeEspTagLump.includes(char))
      ) {
        console.log(`397 RETURN ${wholeEspTagLump.length}`);
        return wholeEspTagLump.length;
      }
    }
  }
  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }
  function pingCharCb(incomingToken) {
    if (opts.charCb) {
      opts.charCb(incomingToken);
    }
  }
  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      console.log(
        `417 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
          incomingToken,
          null,
          4
        )}`
      );
      opts.tagCb(clone(incomingToken));
    }
  }
  function dumpCurrentToken(token, i) {
    console.log(
      `430 ${`\u001b[${35}m${`dumpCurrentToken()`}\u001b[${39}m`}; incoming token=${JSON.stringify(
        token,
        null,
        0
      )}; i = ${`\u001b[${33}m${i}\u001b[${39}m`}`
    );
    if (
      !["text", "esp"].includes(token.type) &&
      token.start !== null &&
      token.start < i &&
      ((str[i - 1] && !str[i - 1].trim().length) || str[i] === "<")
    ) {
      console.log(
        `448 ${
          str[i] === "<"
            ? "this token was an unclosed tag"
            : "this token indeed had trailing whitespace"
        }`
      );
      token.end = left(str, i) + 1;
      token.value = str.slice(token.start, token.end);
      console.log(
        `463 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
          token.end
        } (last two characters ending at token.end: ${JSON.stringify(
          str[token.end - 1],
          null,
          4
        )} + ${JSON.stringify(
          str[token.end],
          null,
          4
        )}); ${`\u001b[${33}m${`token.value`}\u001b[${39}m`} = "${token.value}"`
      );
      if (token.type === "tag" && str[token.end - 1] !== ">") {
        console.log(
          `477 ${`\u001b[${35}m${`██ UNCLOSED TAG CASES`}\u001b[${39}m`}`
        );
        let cutOffIndex = token.tagNameEndsAt || i;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          console.log(
            `496 ${`\u001b[${32}m${`██ validate all attributes`}\u001b[${39}m`}`
          );
          console.log(`499 SET cutOffIndex = ${cutOffIndex}`);
          for (let i = 0, len = token.attribs.length; i < len; i++) {
            console.log(
              `503 ${`\u001b[${36}m${`token.attribs[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
                token.attribs[i],
                null,
                4
              )}`
            );
            if (token.attribs[i].attribNameRecognised) {
              cutOffIndex = token.attribs[i].attribEnd;
              console.log(
                `512 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
              );
              if (
                str[cutOffIndex + 1] &&
                !str[cutOffIndex].trim().length &&
                str[cutOffIndex + 1].trim().length
              ) {
                cutOffIndex++;
                console.log(
                  `531 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`cutOffIndex`}\u001b[${39}m`} = ${cutOffIndex}`
                );
              }
            } else {
              console.log(`535 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
              if (i === 0) {
                token.attribs = [];
              } else {
                token.attribs = token.attribs.splice(0, i);
              }
              console.log(
                `548 ${`\u001b[${32}m${`CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`token.attribs`}\u001b[${39}m`} = ${JSON.stringify(
                  token.attribs,
                  null,
                  4
                )}`
              );
              break;
            }
          }
        }
        token.end = cutOffIndex;
        token.value = str.slice(token.start, token.end);
        if (!token.tagNameEndsAt) {
          token.tagNameEndsAt = cutOffIndex;
          console.log(
            `566 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
              token.tagNameEndsAt
            }`
          );
        }
        if (
          Number.isInteger(token.tagNameStartsAt) &&
          Number.isInteger(token.tagNameEndsAt) &&
          !token.tagName
        ) {
          token.tagName = str.slice(token.tagNameStartsAt, cutOffIndex);
          console.log(
            `578 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
              token.tagName
            }`
          );
          token.recognised = isTagNameRecognised(token.tagName);
        }
        console.log(`585 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        console.log(`587 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        token = tokenReset();
        initToken("text", cutOffIndex);
        console.log(
          `592 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
      } else {
        console.log(`598 ${`\u001b[${35}m${`██ HEALTHY TAG`}\u001b[${39}m`}`);
        console.log(`599 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        console.log(`601 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        token = tokenReset();
        if (!str[i - 1].trim().length) {
          console.log(`605 indeed there was whitespace after token's end`);
          initToken("text", left(str, i) + 1);
          console.log(
            `608 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      }
      console.log(
        `616 FINALLY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        console.log(
          `631 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }; ${`\u001b[${33}m${`token.value`}\u001b[${39}m`} = ${token.value}`
        );
      }
      if (token.start !== null && token.end !== null) {
        console.log(`638 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
      }
      console.log(`642 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
      token = tokenReset();
    }
  }
  function atRuleWaitingForClosingCurlie() {
    return (
      layers.length &&
      layers[layers.length - 1].type === "at" &&
      isObj(layers[layers.length - 1].token) &&
      Number.isInteger(layers[layers.length - 1].token.openingCurlyAt) &&
      !Number.isInteger(layers[layers.length - 1].token.closingCurlyAt)
    );
  }
  function initToken(type, start) {
    attribReset();
    if (type === "tag") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.tagNameStartsAt = null;
      token.tagNameEndsAt = null;
      token.tagName = null;
      token.recognised = null;
      token.closing = false;
      token.void = false;
      token.pureHTML = true;
      token.esp = [];
      token.kind = null;
      token.attribs = [];
    } else if (type === "comment") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.kind = "simple";
      token.closing = false;
    } else if (type === "rule") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
      token.selectorsStart = null;
      token.selectorsEnd = null;
      token.selectors = [];
    } else if (type === "at") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.identifier = null;
      token.identifierStartsAt = null;
      token.identifierEndsAt = null;
      token.query = null;
      token.queryStartsAt = null;
      token.queryEndsAt = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
    } else if (type === "text") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
    } else if (type === "esp") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.head = null;
      token.tail = null;
      token.kind = null;
    }
  }
  for (let i = 0; i <= len; i++) {
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );
    if (!doNothing && str[i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(
            Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
            )
          );
        }
      } else if (len >= 2000) {
        currentPercentageDone =
          opts.reportProgressFuncFrom +
          Math.floor(
            (i / len) *
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom)
          );
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
          console.log(`781 DONE ${currentPercentageDone}%`);
        }
      }
    }
    if (
      styleStarts &&
      token.type &&
      !["rule", "at", "text"].includes(token.type)
    ) {
      console.log(
        `795 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
          token,
          null,
          4
        )}`
      );
      styleStarts = false;
      console.log(
        `803 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
      );
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log(`809 TURN OFF doNothing`);
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      console.log(`816 inside catch the curly tails of at-rules' clauses`);
      if (str[i] === "}") {
        if (
          token.type === null ||
          token.type === "text" ||
          (token.type === "rule" && token.openingCurlyAt === null)
        ) {
          if (token.type === "rule") {
            console.log(`828 complete the "rule" token`);
            token.end = left(str, i) + 1;
            token.value = str.slice(token.start, token.end);
            console.log(
              `832 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                token,
                null,
                4
              )} before pinging`
            );
            pingTagCb(token);
            token = tokenReset();
            if (left(str, i) < i - 1) {
              console.log(
                `844 initiate whitespace from [${left(str, i) + 1}, ${i}]`
              );
              initToken("text", left(str, i) + 1);
              console.log(
                `848 ${`\u001b[${33}m${`token`}\u001b[${39}m`} now = ${JSON.stringify(
                  token,
                  null,
                  4
                )}`
              );
            }
          }
          console.log(`857 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
          console.log(
            `861 ${`\u001b[${35}m${`██`}\u001b[${39}m`} restore at rule from layers`
          );
          const poppedToken = layers.pop();
          token = poppedToken.token;
          console.log(`865 new token: ${JSON.stringify(token, null, 4)}`);
          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          console.log(
            `873 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
          token = tokenReset();
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i].trim().length) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        console.log(
          `891 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )} before pinging`
        );
        pingTagCb(token);
        token = tokenReset();
      }
    }
    if (token.end && token.end === i) {
      console.log(`904 call dumpCurrentToken()`);
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
        console.log(
          `908 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = true`
        );
      }
      dumpCurrentToken(token, i);
      console.log(`914 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} layers`);
      layers = [];
    }
    if (!doNothing) {
      if (
        ["tag", "esp", "rule", "at"].includes(token.type) &&
        token.kind !== "cdata"
      ) {
        if (
          [`"`, `'`, `(`, `)`].includes(str[i]) &&
          !(
            (
              [`"`, `'`].includes(str[left(str, i)]) &&
              str[left(str, i)] === str[right(str, i)]
            )
          )
        ) {
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log(`952 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
            console.log(
              `961 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i]
                },
                null,
                4
              )}`
            );
          }
        }
      } else if (
        token.type === "comment" &&
        ["only", "not"].includes(token.kind)
      ) {
        console.log(`976 inside "comments" layers clauses`);
        if ([`[`, `]`].includes(str[i])) {
          if (matchLayerLast(str, i)) {
            layers.pop();
            console.log(`981 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
            console.log(
              `990 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "simple",
                  value: str[i]
                },
                null,
                4
              )}`
            );
          }
        }
      }
      console.log(
        `1004 now ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
          null,
          4
        )}`
      );
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.start) &&
      i >= token.start &&
      !Number.isInteger(token.identifierStartsAt) &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== "@"
    ) {
      token.identifierStartsAt = i;
      console.log(
        `1031 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierStartsAt`}\u001b[${39}m`} = ${
          token.identifierStartsAt
        }`
      );
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.queryStartsAt) &&
      !Number.isInteger(token.queryEndsAt) &&
      "{};".includes(str[i])
    ) {
      if (str[i - 1] && str[i - 1].trim().length) {
        token.queryEndsAt = i;
      } else {
        token.queryEndsAt = left(str, i) + 1;
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      console.log(
        `1064 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryEndsAt`}\u001b[${39}m`} = ${
          token.queryEndsAt
        }; ${`\u001b[${33}m${`token.query`}\u001b[${39}m`} = "${token.query}"`
      );
    }
    if (
      !doNothing &&
      token.type === "at" &&
      str[i] === "{" &&
      token.identifier &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      token.openingCurlyAt = i;
      console.log(
        `1082 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
          token.openingCurlyAt
        }`
      );
      layers.push({
        type: "at",
        token
      });
      console.log(
        `1093 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} "at" token to layers`
      );
      const charIdxOnTheRight = right(str, i);
      console.log(
        `1100 ${`\u001b[${33}m${`charIdxOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
          charIdxOnTheRight,
          null,
          4
        )}`
      );
      if (str[charIdxOnTheRight] === "}") {
        token.closingCurlyAt = charIdxOnTheRight;
        console.log(
          `1111 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} until ${doNothing}`
        );
        console.log(
          `1118 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )} before pinging`
        );
        pingTagCb(token);
        doNothing = charIdxOnTheRight;
      } else {
        tokenReset();
        if (charIdxOnTheRight > i + 1) {
          console.log(
            `1145 submit this whitespace token, [${i +
              1}, ${charIdxOnTheRight}]`
          );
          initToken("text", i + 1);
          token.end = charIdxOnTheRight;
          token.value = str.slice(token.start, token.end);
          console.log(
            `1153 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
              token,
              null,
              4
            )} before pinging`
          );
          pingTagCb(token);
        }
        tokenReset();
        initToken("rule", charIdxOnTheRight);
        doNothing = charIdxOnTheRight;
        console.log(
          `1167 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
            token.type
          }; set ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} until ${doNothing}`
        );
      }
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.identifier &&
      str[i].trim().length &&
      !Number.isInteger(token.queryStartsAt)
    ) {
      token.queryStartsAt = i;
      console.log(
        `1188 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.queryStartsAt`}\u001b[${39}m`} = ${
          token.queryStartsAt
        }`
      );
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.identifierStartsAt) &&
      i >= token.start &&
      (!str[i].trim().length || "()".includes(str[i])) &&
      !Number.isInteger(token.identifierEndsAt)
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
      console.log(
        `1208 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.identifierEndsAt`}\u001b[${39}m`} = ${
          token.identifierEndsAt
        }; ${`\u001b[${33}m${`token.identifier`}\u001b[${39}m`} = "${
          token.identifier
        }"`
      );
    }
    if (
      token.type === "rule" &&
      Number.isInteger(selectorChunkStartedAt) &&
      (charsThatEndCSSChunks.includes(str[i]) ||
        (str[i] &&
          !str[i].trim().length &&
          charsThatEndCSSChunks.includes(str[right(str, i)])))
    ) {
      console.log(
        `1229 FIY, ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} was ${selectorChunkStartedAt}`
      );
      console.log(
        `1232 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to selectors[]: ${JSON.stringify(
          {
            value: str.slice(selectorChunkStartedAt, i),
            selectorStarts: selectorChunkStartedAt,
            selectorEnds: i
          },
          null,
          4
        )}`
      );
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: i
      });
      selectorChunkStartedAt = undefined;
      console.log(
        `1250 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`}`
      );
      token.selectorsEnd = i;
      console.log(
        `1255 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
          token.selectorsEnd
        }`
      );
    }
    if (!doNothing) {
      console.log(
        `1270 ███████████████████████████████████████ IS TAG STARTING? ${startsTag(
          str,
          i,
          token,
          layers)}`
      );
      if (startsTag(str, i, token, layers)) {
        console.log(`1287 (html) tag opening`);
        if (token.type && token.start !== null) {
          console.log(`1290 call dumpCurrentToken()`);
          dumpCurrentToken(token, i);
          console.log(`1293 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
          tokenReset();
        }
        initToken("tag", i);
        console.log(
          `1302 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1310 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }
        if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "doctype";
          console.log(
            `1324 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "cdata";
          console.log(
            `1336 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "xml";
          console.log(
            `1348 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }
      } else if (startsComment(str, i, token)) {
        console.log(`1361 comment opening`);
        console.log(`1363 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);
        console.log(`1366 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();
        initToken("comment", i);
        console.log(
          `1374 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
            token.start
          }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
        );
        if (str[i] === "-") {
          token.closing = true;
          console.log(
            `1383 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else if (
          matchRightIncl(
            str,
            i,
            [
              "<![e",
              "<[endif",
              "<!endif",
              "<1[endif",
              "<1endif",
              "<[!endif",
              "<]!endif",
              "<!]endif"
            ],
            {
              trimBeforeMatching: true
            }
          )
        ) {
          token.closing = true;
          token.kind = "only";
          console.log(
            `1409 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }; ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${token.kind}`
          );
        }
        if (styleStarts) {
          styleStarts = false;
          console.log(
            `1418 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`styleStarts`}\u001b[${39}m`} = false`
          );
        }
      } else if (startsEsp(str, i, token, layers, styleStarts)) {
        console.log(`1429 ESP tag opening`);
        let wholeEspTagLump = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log(
          `1447 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wholeEspTagLump = ${wholeEspTagLump}`
        );
        console.log(
          `1450 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
        console.log(
          `1457 FIY, ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
            token,
            null,
            4
          )}`
        );
        if (
          !espLumpBlacklist.includes(wholeEspTagLump) &&
          (!Array.isArray(layers) ||
            !layers.length ||
            layers[layers.length - 1].type !== "simple" ||
            layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])
        ) {
          let lengthOfClosingEspChunk;
          if (layers.length && matchLayerLast(str, i)) {
            console.log(
              `1479 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against the last layer`
            );
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            console.log(
              `1483 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                console.log(
                  `1497 SET ${`\u001b[${32}m${`token.end`}\u001b[${39}m`} = ${
                    token.end
                  }`
                );
              }
              console.log(
                `1503 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                  token,
                  null,
                  4
                )} before pinging`
              );
              dumpCurrentToken(token, i);
              console.log(
                `1512 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }
            layers.pop();
            console.log(`1520 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} layers`);
          } else if (layers.length && matchLayerFirst(str, i)) {
            console.log(
              `1523 closing part of a set ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} against first layer`
            );
            console.log(
              `1526 wipe all layers, there were strange unclosed characters`
            );
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            console.log(
              `1530 ${`\u001b[${33}m${`lengthOfClosingEspChunk`}\u001b[${39}m`} = ${JSON.stringify(
                lengthOfClosingEspChunk,
                null,
                4
              )}`
            );
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                console.log(
                  `1544 ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
                    token,
                    null,
                    4
                  )} before pinging`
                );
              }
              dumpCurrentToken(token, i);
              console.log(
                `1554 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`
              );
              tokenReset();
            }
            layers = [];
            console.log(`1562 ${`\u001b[${32}m${`WIPE`}\u001b[${39}m`} layers`);
          } else {
            console.log(
              `1565 closing part of a set ${`\u001b[${31}m${`NOT MATCHED`}\u001b[${39}m`} - means it's a new opening`
            );
            console.log(`1567 push new layer`);
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            });
            console.log(
              `1575 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                {
                  type: "esp",
                  openingLump: wholeEspTagLump,
                  guessedClosingLump: flipEspTag(wholeEspTagLump),
                  position: i
                },
                null,
                4
              )}`
            );
            console.log(
              `1587 ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
            if (
              !(
                token.type === "tag" &&
                (token.kind === "comment" ||
                  (Number.isInteger(attrib.attribStart) &&
                    !Number.isInteger(attrib.attribEnd)))
              )
            ) {
              console.log(
                `1607 ${`\u001b[${36}m${`██`}\u001b[${39}m`} standalone ESP tag`
              );
              dumpCurrentToken(token, i);
              initToken("esp", i);
              console.log(
                `1613 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );
              token.tail = flipEspTag(wholeEspTagLump);
              console.log(
                `1621 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tail`}\u001b[${39}m`} = ${
                  token.tail
                }`
              );
              token.head = wholeEspTagLump;
            }
          }
          doNothing =
            i +
            (lengthOfClosingEspChunk
              ? lengthOfClosingEspChunk
              : wholeEspTagLump.length);
          console.log(
            `1636 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log(`1643`);
          if (str[i] && !str[i].trim().length) {
            console.log(`1646 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();
            initToken("text", i);
            token.end = right(str, i) || str.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `1652 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
            pingTagCb(token);
            doNothing = token.end;
            console.log(
              `1663 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
            console.log(`1666 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();
            if (
              right(str, i) &&
              !["{", "}", "<"].includes(str[right(str, i)])
            ) {
              const idxOnTheRight = right(str, i);
              initToken(
                str[idxOnTheRight] === "@" ? "at" : "rule",
                idxOnTheRight
              );
              console.log(
                `1681 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                  token.start
                }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${
                  token.type
                }`
              );
              if (str[i + 1] && !str[i + 1].trim().length) {
                doNothing = right(str, i);
                console.log(
                  `1692 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
                );
              }
            }
          } else if (str[i]) {
            console.log(`1698 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
            tokenReset();
            if ("}".includes(str[i])) {
              console.log(
                `1704 ${`\u001b[${31}m${`BAD CHARACTER`}\u001b[${39}m`}, initiated "text" node`
              );
              initToken("text", i);
              doNothing = i + 1;
              console.log(
                `1709 SET ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            } else {
              initToken(str[i] === "@" ? "at" : "rule", i);
            }
            console.log(
              `1718 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
                token.start
              }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
            );
          }
        } else if (str[i]) {
          console.log(`1725 ${`\u001b[${31}m${`reset`}\u001b[${39}m`} token`);
          token = tokenReset();
          initToken("text", i);
          console.log(
            `1732 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.start`}\u001b[${39}m`} = ${
              token.start
            }; ${`\u001b[${33}m${`token.type`}\u001b[${39}m`} = ${token.type}`
          );
        }
      } else if (
        token.type === "text" &&
        styleStarts &&
        str[i].trim().length &&
        !"{},".includes(str[i])
      ) {
        console.log(`1747 ██ terminate text token, rule starts`);
        console.log(`1749 call dumpCurrentToken()`);
        dumpCurrentToken(token, i);
        console.log(`1752 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} token`);
        tokenReset();
        initToken("rule", i);
      }
    }
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i] &&
      str[i].trim().length &&
      !"{}".includes(str[i]) &&
      !Number.isInteger(selectorChunkStartedAt) &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        console.log(
          `1775 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`
        );
        if (token.selectorsStart === null) {
          token.selectorsStart = i;
          console.log(
            `1781 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsStart`}\u001b[${39}m`} = ${
              token.selectorsStart
            }`
          );
        }
      } else {
        token.selectorsEnd = i + 1;
        console.log(
          `1791 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.selectorsEnd`}\u001b[${39}m`} = ${
            token.selectorsEnd
          }`
        );
      }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[i] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        console.log(
          `1816 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
      } else if (
        token.type === "comment" &&
        !layers.length &&
        token.kind === "simple" &&
        ((str[token.start] === "<" &&
          str[i] === "-" &&
          (matchLeft(str, i, "!-", {
            trimBeforeMatching: true
          }) ||
            (matchLeftIncl(str, i, "!-", {
              trimBeforeMatching: true
            }) &&
              str[i + 1] !== "-"))) ||
          (str[token.start] === "-" &&
            str[i] === ">" &&
            matchLeft(str, i, "--", {
              trimBeforeMatching: true
            })))
      ) {
        if (
          matchRightIncl(str, i, ["-[if"], {
            trimBeforeMatching: true
          })
        ) {
          console.log(
            `1853 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "ONLY" DETECTED`}\u001b[${39}m`}`
          );
          token.kind = "only";
          console.log(
            `1857 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else if (
          matchRightIncl(str, i, ["-<![endif"], {
            trimBeforeMatching: true
          })
        ) {
          console.log(
            `1873 ${`\u001b[${32}m${`OUTLOOK CONDITIONAL "NOT" DETECTED`}\u001b[${39}m`}`
          );
          token.kind = "not";
          token.closing = true;
          console.log(
            `1878 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }; ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        } else {
          console.log(
            `1887 ${`\u001b[${32}m${`${token.kind} comment token's ending caught`}\u001b[${39}m`}`
          );
          token.end = i + 1;
          if (str[left(str, i)] === "!" && str[right(str, i)] === "-") {
            token.end = right(str, i) + 1;
            console.log(
              `1896 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
          }
          token.value = str.slice(token.start, token.end);
          console.log(
            `1904 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
      } else if (token.type === "comment" && !layers.length && str[i] === ">") {
        if (
          matchRight(str, i, "<!-->", {
            trimBeforeMatching: true
          })
        ) {
          console.log(
            `1920 that's end of opening type="comment", kind="only" comment`
          );
          token.kind = "not";
          console.log(
            `1924 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        } else {
          console.log(
            `1930 that's end of opening type="comment", kind="not" comment`
          );
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          console.log(
            `1935 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
        }
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        console.log(`1946 POSSIBLE ESP TAILS`);
        let wholeEspTagClosing = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        console.log(`1957 wholeEspTagClosing = ${wholeEspTagClosing}`);
        if (wholeEspTagClosing.length > token.head.length) {
          console.log(
            `1967 wholeEspTagClosing.length = ${`\u001b[${33}m${
              wholeEspTagClosing.length
            }\u001b[${39}m`} > token.head.length = ${`\u001b[${33}m${
              token.head.length
            }\u001b[${39}m`}`
          );
          const headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            console.log(`1995 - chunk ends with the same heads`);
            token.end = i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2018 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2024 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2030 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2036 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            console.log(`2044`);
            const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              0,
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            console.log(
              `${`\u001b[${33}m${`firstPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                firstPartOfWholeEspTagClosing,
                null,
                4
              )}`
            );
            console.log(
              `${`\u001b[${33}m${`secondPartOfWholeEspTagClosing`}\u001b[${39}m`} = ${JSON.stringify(
                secondPartOfWholeEspTagClosing,
                null,
                4
              )}`
            );
            if (
              firstPartOfWholeEspTagClosing.length &&
              secondPartOfWholeEspTagClosing.length &&
              token.tail
                .split("")
                .every(char => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              console.log(`2079 definitely tails + new heads`);
              token.end = i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              console.log(
                `2083 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                  token.end
                }`
              );
              doNothing = token.end;
              console.log(
                `2089 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
              );
            }
          } else {
            console.log(`CASE #2.`);
            token.end = i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            console.log(
              `2105 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
                token.end
              }`
            );
            doNothing = token.end;
            console.log(
              `2111 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
            );
          }
          console.log(`2114`);
        } else {
          token.end = i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          console.log(
            `2120 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
              token.end
            }`
          );
          doNothing = token.end;
          console.log(
            `2126 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`
          );
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(token.tagNameStartsAt) &&
      !Number.isInteger(token.tagNameEndsAt)
    ) {
      console.log(`2142 catch the end of a tag name clauses`);
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        console.log(
          `2148 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameEndsAt`}\u001b[${39}m`} = ${
            token.tagNameEndsAt
          }`
        );
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        console.log(
          `2155 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagName`}\u001b[${39}m`} = ${
            token.tagName
          }`
        );
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
          console.log(
            `2163 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${
              token.kind
            }`
          );
        }
        if (voidTags.includes(token.tagName)) {
          token.void = true;
          console.log(
            `2175 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.void`}\u001b[${39}m`} = ${
              token.void
            }`
          );
        }
        token.recognised = isTagNameRecognised(token.tagName);
        console.log(
          `2184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.recognised`}\u001b[${39}m`} = ${
            token.recognised
          }`
        );
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(token.tagNameStartsAt) &&
      Number.isInteger(token.start) &&
      token.start < i
    ) {
      if (str[i] === "/") {
        token.closing = true;
        console.log(
          `2207 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
            token.closing
          }`
        );
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        console.log(
          `2214 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.tagNameStartsAt`}\u001b[${39}m`} = ${
            token.tagNameStartsAt
          }`
        );
        if (!token.closing) {
          token.closing = false;
          console.log(
            `2223 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closing`}\u001b[${39}m`} = ${
              token.closing
            }`
          );
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(attrib.attribNameStartsAt) &&
      i > attrib.attribNameStartsAt &&
      attrib.attribNameEndsAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2245 inside catch the tag attribute name end clauses`);
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.includes(attrib.attribName);
      console.log(
        `2250 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
          attrib.attribNameEndsAt
        }; ${`\u001b[${33}m${`attrib.attribName`}\u001b[${39}m`} = ${JSON.stringify(
          attrib.attribName,
          null,
          0
        )}`
      );
      if (str[i] && !str[i].trim().length && str[right(str, i)] === "=") {
        console.log(`2261 equal on the right`);
      } else if (
        (str[i] && !str[i].trim().length) ||
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        attrib.attribEnd = i;
        console.log(
          `2270 SET ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribNameEndsAt`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (
      !doNothing &&
      str[i] &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(token.tagNameEndsAt) &&
      i > token.tagNameEndsAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      console.log(`2293 inside catch the tag attribute name start clauses`);
      attrib.attribStart = i;
      attrib.attribNameStartsAt = i;
      console.log(
        `2297 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribStart`}\u001b[${39}m`} = ${
          attrib.attribStart
        }; ${`\u001b[${33}m${`attrib.attribNameStartsAt`}\u001b[${39}m`} = ${
          attrib.attribNameStartsAt
        }`
      );
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = i;
        console.log(
          `2312 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.openingCurlyAt`}\u001b[${39}m`} = ${
            token.openingCurlyAt
          }`
        );
      } else if (
        str[i] === "}" &&
        Number.isInteger(token.openingCurlyAt) &&
        !Number.isInteger(token.closingCurlyAt)
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        console.log(
          `2325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.closingCurlyAt`}\u001b[${39}m`} = ${
            token.closingCurlyAt
          }; ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${token.end}`
        );
        console.log(`2330 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
        pingTagCb(token);
        tokenReset();
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(attrib.attribValueStartsAt) &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      console.log(`2346 inside catching end of a tag attr clauses`);
      if (`'"`.includes(str[i])) {
        if (
          str[attrib.attribOpeningQuoteAt] === str[i] &&
          !layers.some(layerObj => layerObj.type === "esp")
        ) {
          console.log(`2353 opening and closing quotes matched!`);
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          attrib.attribEnd = i + 1;
          console.log(
            `2359 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribClosingQuoteAt`}\u001b[${39}m`} = ${
              attrib.attribClosingQuoteAt
            }; ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
              attrib.attribValueEndsAt
            }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
              attrib.attribValue
            }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
              attrib.attribEnd
            }`
          );
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim().length) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        console.log(`2382 opening quote was missing, terminate attr val here`);
        attrib.attribValueEndsAt = i;
        attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
        attrib.attribEnd = i;
        console.log(
          `2388 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueEndsAt`}\u001b[${39}m`} = ${
            attrib.attribValueEndsAt
          }; ${`\u001b[${33}m${`attrib.attribValue`}\u001b[${39}m`} = ${
            attrib.attribValue
          }; ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(attrib.attribValueStartsAt) &&
      Number.isInteger(attrib.attribNameEndsAt) &&
      attrib.attribNameEndsAt <= i &&
      str[i].trim().length
    ) {
      console.log(`2414 inside catching attr value start clauses`);
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)])
      ) {
        attrib.attribValueStartsAt = right(str, i);
        console.log(
          `2422 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartsAt
          }`
        );
      } else if (`'"`.includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartsAt = i + 1;
        }
        console.log(
          `2432 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrib.attribOpeningQuoteAt`}\u001b[${39}m`} = ${
            attrib.attribOpeningQuoteAt
          }; ${`\u001b[${33}m${`attrib.attribValueStartsAt`}\u001b[${39}m`} = ${
            attrib.attribValueStartsAt
          }`
        );
      }
    }
    if (
      str[i] === ">" &&
      token.type === "tag" &&
      attrib.attribStart !== null &&
      attrib.attribEnd === null
    ) {
      console.log(
        `2463 ${`\u001b[${31}m${`██`}\u001b[${39}m`} bracket within attribute's value`
      );
      let thisIsRealEnding = false;
      if (str[i + 1]) {
        for (let y = i + 1; y < len; y++) {
          console.log(
            `2482 ${`\u001b[${36}m${`str[${y}] = ${JSON.stringify(
              str[y],
              null,
              0
            )}`}\u001b[${39}m`}`
          );
          if (
            attrib.attribOpeningQuoteAt !== null &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            console.log(
              `2495 closing quote (${
                str[attrib.attribOpeningQuoteAt]
              }) found, ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
            );
            if (y !== i + 1 && str[y - 1] !== "=") {
              thisIsRealEnding = true;
              console.log(
                `2502 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
              );
            }
            break;
          } else if (str[y] === ">") {
            break;
          } else if (str[y] === "<") {
            thisIsRealEnding = true;
            console.log(
              `2513 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );
            layers.pop();
            console.log(
              `2520 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`}, now:\n${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
            console.log(`2527 break`);
            break;
          } else if (!str[y + 1]) {
            thisIsRealEnding = true;
            console.log(
              `2533 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`thisIsRealEnding`}\u001b[${39}m`} = ${thisIsRealEnding}`
            );
            console.log(`2536 break`);
            break;
          }
        }
      } else {
        console.log(`2541 string ends so this was the bracket`);
        thisIsRealEnding = true;
      }
      if (thisIsRealEnding) {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        console.log(
          `2558 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`token.end`}\u001b[${39}m`} = ${
            token.end
          }`
        );
        if (
          Number.isInteger(attrib.attribValueStartsAt) &&
          attrib.attribValueStartsAt < i &&
          str.slice(attrib.attribValueStartsAt, i).trim().length
        ) {
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
        } else {
          attrib.attribValueStartsAt = null;
        }
        attrib.attribEnd = i;
        console.log(
          `2580 ${`\u001b[${32}m${`SET`}\u001b[${39}m`}  ${`\u001b[${33}m${`attrib.attribEnd`}\u001b[${39}m`} = ${
            attrib.attribEnd
          }`
        );
        console.log(
          `2587 ${`\u001b[${32}m${`attrib wipe, push and reset`}\u001b[${39}m`}`
        );
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (str[i] && opts.charCb) {
      console.log(
        `2616 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
          {
            type: token.type,
            chr: str[i],
            i
          },
          null,
          4
        )}`
      );
      pingCharCb({
        type: token.type,
        chr: str[i],
        i
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      token.value = str.slice(token.start, token.end);
      console.log(`2647 ${`\u001b[${32}m${`PING`}\u001b[${39}m`}`);
      pingTagCb(token);
    }
    console.log(
      `${`\u001b[${90}m${`==========================================\n██ token: ${JSON.stringify(
        token,
        null,
        4
      )}${
        attrib.attribStart !== null
          ? `\n██ attrib: ${JSON.stringify(attrib, null, 4)}`
          : ""
      }${
        layers.length ? `\n██ layers: ${JSON.stringify(layers, null, 4)}` : ""
      }`}\u001b[${39}m`}${
        doNothing
          ? `\n${`\u001b[${31}m${`DO NOTHING UNTIL ${doNothing}`}\u001b[${39}m`}`
          : ""
      }`
    );
    console.log(
      `${`\u001b[${90}m${`styleStarts = ${styleStarts}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`selectorChunkStartedAt = ${selectorChunkStartedAt}`}\u001b[${39}m`}`
    );
  }
}

export default tokenizer;
