/**
 * is-html-tag-opening
 * Does an HTML tag start at given position?
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-tag-opening/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var defaultOpts = {
  allowCustomTagNames: false,
  skipOpeningBracket: false
};
var BACKSLASH = "\\";
var knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];

function isNotLetter(char) {
  return char === undefined || char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
}

function extraRequirements(str, idx) {
  return str[idx] === "<" ||
  str[stringLeftRight.left(str, idx)] === "<";
}

var version$1 = "2.0.12";

var version = version$1;
function isOpening(str, idx, originalOpts) {
  if (idx === void 0) {
    idx = 0;
  }
  if (typeof str !== "string") {
    throw new Error("is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as \"" + typeof str + "\", value being " + JSON.stringify(str, null, 4));
  }
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error("is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as \"" + typeof idx + "\", value being " + JSON.stringify(idx, null, 4));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaultOpts), originalOpts);
  var whitespaceChunk = "[\\\\ \\t\\r\\n/]*";
  var generalChar = "._a-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF";
  var r1 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "\\w+" + whitespaceChunk + "\\/?" + whitespaceChunk + ">", "g");
  var r5 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "[" + generalChar + "]+[-" + generalChar + "]*" + whitespaceChunk + ">", "g");
  var r2 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['\"\\w]", "g");
  var r6 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\w+\\s+[" + generalChar + "]+[-" + generalChar + "]*(?:-\\w+)?\\s*=\\s*['\"\\w]");
  var r3 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\/?\\s*\\w+\\s*\\/?\\s*>", "g");
  var r7 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\/?\\s*[" + generalChar + "]+[-" + generalChar + "]*\\s*\\/?\\s*>", "g");
  var r4 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "\\w+(?:\\s*\\w+)?\\s*\\w+=['\"]", "g");
  var r8 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "[" + generalChar + "]+[-" + generalChar + "]*\\s+(?:\\s*\\w+)?\\s*\\w+=['\"]", "g");
  var r9 = new RegExp("^<" + (opts.skipOpeningBracket ? "?\\/?" : "") + "(" + whitespaceChunk + "[" + generalChar + "]+)+" + whitespaceChunk + "[\\\\/=>]", "");
  var r10 = new RegExp("^\\/\\s*\\w+s*>");
  var whatToTest = idx ? str.slice(idx) : str;
  var leftSideIdx = stringLeftRight.left(str, idx);
  var qualified = false;
  var passed = false;
  var matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
  };
  if (opts.allowCustomTagNames) {
    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[stringLeftRight.left(str, leftSideIdx)] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))) {
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r6.test(whatToTest)) {
      passed = true;
    } else if (r7.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r8.test(whatToTest)) {
      passed = true;
    } else if (str[idx] === "/" && str[leftSideIdx] !== "<" && r10.test(whatToTest)) {
      passed = true;
    }
  } else {
    if ((opts.skipOpeningBracket && (
    str[idx - 1] === "<" ||
    str[idx - 1] === "/" && str[stringLeftRight.left(str, leftSideIdx)] === "<") || (whatToTest[0] === "<" || whatToTest[0] === "/" && (!str[leftSideIdx] || str[leftSideIdx] !== "<")) && whatToTest[1] && whatToTest[1].trim()) && r9.test(whatToTest)) {
      qualified = true;
    } else if (r1.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r2.test(whatToTest)) {
      qualified = true;
    } else if (r3.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r4.test(whatToTest)) {
      qualified = true;
    }
    if (qualified && stringMatchLeftRight.matchRightIncl(str, idx, knownHtmlTags, {
      cb: function cb(char) {
        if (char === undefined) {
          if (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() || str[idx - 1] === "<") {
            passed = true;
          }
          return true;
        }
        return char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
      },
      i: true,
      trimCharsBeforeMatching: ["<", "/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
    })) {
      passed = true;
    }
  }
  if (!passed && str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() && stringMatchLeftRight.matchRight(str, idx, knownHtmlTags, matchingOptions)) {
    passed = true;
  }
  var res = typeof str === "string" && idx < str.length && passed;
  return res;
}

exports.defaults = defaultOpts;
exports.isOpening = isOpening;
exports.version = version;
