/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
 */

import { matchRight } from 'string-match-left-right';

const knownHtmlTags = [
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
function isStr(something) {
  return typeof something === "string";
}
function isSpace(char) {
  return char === undefined || (typeof char === "string" && char.trim() === "");
}
function isOpening(str, idx = 0) {
  const r1 = /^<\s*\w+\s*\/?\s*>/g;
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
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
    str[idx + 1].trim().length &&
    matchRight(str, idx, knownHtmlTags, { cb: isSpace })
  ) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  return res;
}

export default isOpening;
