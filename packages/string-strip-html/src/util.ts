/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

interface Obj {
  [key: string]: any;
}

/* c8 ignore next */
function characterSuitableForNames(char: string): boolean {
  return /[-_A-Za-z0-9]/.test(char);
}

/* c8 ignore next */
function prepHopefullyAnArray(something: any, name: string): string[] {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    return something.filter((val) => typeof val === "string" && val.trim());
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError(
    `string-strip-html/stripHtml(): [THROW_ID_03] ${name} must be array containing zero or more strings or something falsey. Currently it's equal to: ${something}, that a type of ${typeof something}.`
  );
}

/* c8 ignore next */
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string
): boolean {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    }

    if (str.startsWith(y, i)) {
      return false;
    }
  }

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
  return (
    !tag ||
    !tag.quotes ||
    !xBeforeYOnTheRight(str, i + 1, tag.quotes.value, ">")
  );
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
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
  notWithinAttrQuotes,
  Obj,
};
