/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.4.0
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
function isOpening(str, idx = 0) {
  const r1 = /^<[\\ \t\r\n/]*\w+[\\ \t\r\n/]*>/g;
  const r2 = /^<\s*\w+\s+\w+(?:-\w+)?\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<[\\ \t\r\n/]*\w+(?:\s*\w+)*\s*\w+=['"]/g;
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
  } else if (
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
