/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.5.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
 */

import { matchRight } from 'string-match-left-right';
import { right } from 'string-left-right';

const BACKSLASH = "\u005C";
const knownHtmlTags = [
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
  "big",
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
  "dir",
  "div",
  "dl",
  "doctype",
  "dt",
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
  "h1 - h6",
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
  "slot",
  "small",
  "source",
  "span",
  "strike",
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
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xml"
];
function isStr(something) {
  return typeof something === "string";
}
function isNotLetter(char) {
  return (
    char === undefined ||
    (char.toUpperCase() === char.toLowerCase() && !`0123456789`.includes(char))
  );
}
function isOpening(str, idx = 0, originalOpts) {
  const defaults = {
    allowCustomTagNames: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  const r1 = /^<[\\ \t\r\n/]*\w+[\\ \t\r\n/]*>/g;
  const r5 = /^<[\\ \t\r\n/]*[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF]+[\\ \t\r\n/]*>/g;
  const r2 = /^<\s*\w+\s+\w+(?:-\w+)?\s*=\s*['"\w]/g;
  const r6 = /^<\s*\w+\s+[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF]+(?:-\w+)?\s*=\s*['"\w]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r7 = /^<\s*\/?\s*[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF]+\s*\/?\s*>/g;
  const r4 = /^<[\\ \t\r\n/]*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  const r8 = /^<[\\ \t\r\n/]*[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF]+(?:\s*\w+)*\s*\w+=['"]/g;
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (opts.allowCustomTagNames) {
    if (r5.test(whatToTest)) {
      passed = true;
    } else if (r6.test(whatToTest)) {
      passed = true;
    } else if (r7.test(whatToTest)) {
      passed = true;
    } else if (r8.test(whatToTest)) {
      passed = true;
    }
  } else {
    if (r1.test(whatToTest)) {
      passed = true;
    } else if (r2.test(whatToTest)) {
      passed = true;
    } else if (r3.test(whatToTest)) {
      passed = true;
    } else if (r4.test(whatToTest)) {
      passed = true;
    }
  }
  if (
    !passed &&
    str[idx] === "<" &&
    str[idx + 1] &&
    ((["/", BACKSLASH].includes(str[idx + 1]) &&
      matchRight(str, idx + 1, knownHtmlTags, {
        cb: isNotLetter,
        i: true
      })) ||
      (!isNotLetter(str[idx + 1]) &&
        matchRight(str, idx, knownHtmlTags, {
          cb: isNotLetter,
          i: true,
          trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
        })) ||
      (isNotLetter(str[idx + 1]) &&
        matchRight(str, idx, knownHtmlTags, {
          cb: (char, theRemainderOfTheString, indexOfTheFirstOutsideChar) => {
            return (
              (char === undefined ||
                (char.toUpperCase() === char.toLowerCase() &&
                  !`0123456789`.includes(char))) &&
              (str[right(str, indexOfTheFirstOutsideChar - 1)] === "/" ||
                str[right(str, indexOfTheFirstOutsideChar - 1)] === ">")
            );
          },
          i: true,
          trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
        })))
  ) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  return res;
}

export default isOpening;
