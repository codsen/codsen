/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

// The character tests below are asked once per character of the input, so
// each takes a char code. Their string-level equivalents - a regex test,
// `char.trim()`, `char.toLowerCase() !== char.toUpperCase()` - allocate a
// fresh string (or a match object) on every call, and in a loop that visits
// every character that allocation costs more than the test it serves.

// equivalent to the /[-_A-Za-z0-9]/ test this replaced
/* c8 ignore next */
function characterSuitableForNames(code: number): boolean {
  return (
    (code > 96 && code < 123) || // a-z
    (code > 64 && code < 91) || // A-Z
    (code > 47 && code < 58) || // 0-9
    code === 45 || // -
    code === 95 // _
  );
}

// Exactly the set String.prototype.trim() strips - WhiteSpace plus
// LineTerminator - so `isWhitespaceCode(str.charCodeAt(i))` answers the same
// question as `!str[i].trim()`. NaN, which charCodeAt() yields past the end of
// the string, falls through every comparison and reports false.
function isWhitespaceCode(code: number): boolean {
  if (code === 32 || (code > 8 && code < 14)) {
    // space, and the \t \n \v \f \r run
    return true;
  }
  if (code < 128) {
    return false;
  }
  return (
    code === 0xa0 || // no-break space
    code === 0x1680 || // ogham space mark
    (code > 0x1fff && code < 0x200b) || // en quad .. hair space
    code === 0x2028 || // line separator
    code === 0x2029 || // paragraph separator
    code === 0x202f || // narrow no-break space
    code === 0x205f || // medium mathematical space
    code === 0x3000 || // ideographic space
    code === 0xfeff // zero width no-break space
  );
}

// Stands in for `str[i].toLowerCase() !== str[i].toUpperCase()`, the "is this
// character cased" test. ASCII settles it without touching Unicode case
// mapping; anything above it, including lone surrogates, falls back to the
// original comparison so the answer is unchanged. An index past the end of
// the string yields NaN, which is neither ASCII nor >= 128, so it reports
// false - matching the `typeof str[i] === "string"` guard it replaces.
//
// `code` is `str.charCodeAt(i)`, passed in because every caller already has
// it in hand.
function isCasedCharAt(code: number, str: string, i: number): boolean {
  if ((code > 96 && code < 123) || (code > 64 && code < 91)) {
    return true;
  }
  if (!(code >= 128)) {
    return false;
  }
  const char = str[i];
  return char.toLowerCase() !== char.toUpperCase();
}

// Answers `!name.replace(/-/g, "").length` - "is this nothing but dashes" -
// without building the stripped copy of the string the replace needed.
function containsOnlyDashes(str: string): boolean {
  for (let i = 0, len = str.length; i < len; i++) {
    if (str.charCodeAt(i) !== 45) {
      return false;
    }
  }
  return true;
}

// `Object.keys(obj).length` allocates an array of every key just to read a
// number off it; this stops as soon as the answer is settled.
function hasMoreKeysThan(obj: Obj, n: number): boolean {
  let count = 0;
  for (const _key in obj) {
    if (++count > n) {
      return true;
    }
  }
  return false;
}

/* c8 ignore next */
function prepHopefullyAnArray(something: any, name: string): string[] {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    if (!something.length) {
      return something;
    }
    return something.filter((val) => typeof val === "string" && val.trim());
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError(
    `string-strip-html/stripHtml(): [THROW_ID_08] ${name} must be array containing zero or more strings or something falsy. Currently it's equal to: ${something}, that a type of ${typeof something}.`,
  );
}

/* c8 ignore next */
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string,
): boolean {
  DEV && console.log(`xBeforeYOnTheRight(): called; x=${x}; y=${y}`);
  for (let i = startingIdx, len = str.length; i < len; i++) {
    DEV && console.log(`xBeforeYOnTheRight(): loop str[${i}] = ${str[i]}`);
    if (str.startsWith(x, i)) {
      DEV && console.log(`xBeforeYOnTheRight(): return true`);
      return true;
    }

    if (str.startsWith(y, i)) {
      DEV && console.log(`xBeforeYOnTheRight(): return false`);
      return false;
    }
  }

  DEV && console.log(`xBeforeYOnTheRight(): return false`);
  return false;
}

//
// precaution against JSP comparison
// kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn
//                                          ^
//                                        we're here, it's false ending
//
/* c8 ignore next */
function notWithinAttrQuotes(tag: Obj, str: string, i: number): boolean {
  DEV && console.log(`notWithinAttrQuotes(): start`);
  DEV &&
    console.log(
      `notWithinAttrQuotes(): ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
        tag,
        null,
        4,
      )}; i=${i}`,
    );

  // These four locals are the clauses of the returned condition. They are
  // computed once and read by both the log below and the `return`, so nothing
  // is scanned twice. Each clause is also guarded by the one before it, which
  // is the order the returned condition consumes them in: R2 and R32 each
  // rescan the input to the right, and a local computed eagerly for the log
  // alone survives minification, because esbuild cannot prove that
  // xBeforeYOnTheRight() is free of side effects.
  let R1 = !tag?.quotes;
  let R2 = !R1 && !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">");
  let R31 = R2 && tag.quotes.next !== -1;
  let R32 =
    R31 && xBeforeYOnTheRight(str, tag.quotes.next - 1, tag.quotes.value, `>`);

  DEV &&
    console.log(
      `notWithinAttrQuotes(): ███████████████████████████████████████ ${`\u001b[${33}m${`R1`}\u001b[${39}m`} = ${JSON.stringify(
        R1,
        null,
        4,
      )} || [ ${`\u001b[${33}m${`R2`}\u001b[${39}m`} = ${JSON.stringify(
        R2,
        null,
        4,
      )} && ${`\u001b[${33}m${`R31`}\u001b[${39}m`} = ${JSON.stringify(
        R31,
        null,
        4,
      )} && ${`\u001b[${33}m${`R32`}\u001b[${39}m`} = ${JSON.stringify(
        R32,
        null,
        4,
      )} ]`,
    );

  return R1 || (R2 && R31 && R32);
}

export function countInstancesOf(needle: string, hay: string): number {
  return (hay.match(new RegExp(needle, "g")) || []).length;
}

export const definitelyTagNames = new Set([
  "!doctype",
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
  "xml",
]);

export const singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);

// punctuation marks which we would delete if they were
// trailing the URL's when opts.dumpLinkHrefsNearby is
// enabled - for example:
// Here's a <a href="https://codsen.com">link</a>.
// turns into
// Here's a link https://codsen.com
// (no trailing full stop). We don't want to omit brackets though.
export const punctuationTrailing = new Set([`.`, `,`, `;`, `!`, `?`]);

// Both of these sat as array literals inside the whitespace calculation,
// which runs once per tag - and a literal is rebuilt on every call, because
// the engine cannot prove nobody holds on to it.
export const openingQuoteOrParenthesis = new Set([`"`, `(`]);

export const sentencePunctuation = new Set([";", ".", ":", "!"]);

export const punctuation = new Set([
  ".",
  ",",
  "?",
  ";",
  ")",
  "\u2026",
  '"',
  "\u00BB",
]);
// \u00BB is &raquo; - guillemet - right angled quote
// \u2026 is &hellip; - ellipsis

// adapted from https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
export const inlineTags = new Set([
  "a",
  "abbr",
  "acronym",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  // "br", - we replace it with a space, so the same-way as block-level element
  "button",
  "canvas",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "embed",
  "i",
  "iframe",
  // "img", - we replace it with a space, since we deleted that image
  "input",
  "ins",
  "kbd",
  "label",
  "map",
  "mark",
  "meter",
  "noscript",
  "object",
  "output",
  "picture",
  "progress",
  "q",
  "ruby",
  "s",
  "samp",
  // "script", - we also want at least a single space instead of script tag
  "select",
  "slot",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "svg",
  "template",
  "textarea",
  "time",
  "u",
  "tt",
  "var",
  "video",
  "wbr",
]);

export {
  characterSuitableForNames,
  containsOnlyDashes,
  hasMoreKeysThan,
  isCasedCharAt,
  isWhitespaceCode,
  notWithinAttrQuotes,
  type Obj,
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
};
