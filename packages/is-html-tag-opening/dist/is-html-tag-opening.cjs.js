/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
 */

'use strict';

var stringMatchLeftRight = require('string-match-left-right');

var knownHtmlTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];
function isStr(something) {
  return typeof something === "string";
}
function isSpace(_char) {
  return _char === undefined || typeof _char === "string" && _char.trim() === "";
}
function isOpening(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var r1 = /^<\s*\w+\s*\/?\s*>/g;
  var r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  var r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  var r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  if (r1.test(whatToTest)) {
    passed = true;
  } else if (r2.test(whatToTest)) {
    passed = true;
  } else if (r3.test(whatToTest)) {
    passed = true;
  } else if (r4.test(whatToTest)) {
    passed = true;
  } else if (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim().length && stringMatchLeftRight.matchRight(str, idx, knownHtmlTags, {
    cb: isSpace
  })) {
    passed = true;
  }
  var res = isStr(str) && idx < str.length && passed;
  return res;
}

module.exports = isOpening;
