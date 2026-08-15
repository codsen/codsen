/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

declare let DEV: boolean;

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
  DEV && console.log(`037 xBeforeYOnTheRight(): called; x=${x}; y=${y}`);
  for (let i = startingIdx, len = str.length; i < len; i++) {
    DEV && console.log(`039 xBeforeYOnTheRight(): loop str[${i}] = ${str[i]}`);
    if (str.startsWith(x, i)) {
      DEV && console.log(`041 xBeforeYOnTheRight(): return true`);
      return true;
    }

    if (str.startsWith(y, i)) {
      DEV && console.log(`046 xBeforeYOnTheRight(): return false`);
      return false;
    }
  }

  DEV && console.log(`051 xBeforeYOnTheRight(): return false`);
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
  DEV && console.log(`063 notWithinAttrQuotes(): start`);
  DEV &&
    console.log(
      `066 notWithinAttrQuotes(): ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
      `088 notWithinAttrQuotes(): ███████████████████████████████████████ ${`\u001b[${33}m${`R1`}\u001b[${39}m`} = ${JSON.stringify(
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
  notWithinAttrQuotes,
  type Obj,
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
};
