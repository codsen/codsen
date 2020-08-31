/**
 * is-html-tag-opening
 * Is given opening bracket a beginning of a tag?
 * Version: 1.7.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
 */

'use strict';

var stringMatchLeftRight = require('string-match-left-right');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var BACKSLASH = "\\";
var knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype",
"dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];
function isNotLetter(char) {
  return char === undefined || char.toUpperCase() === char.toLowerCase() && !"0123456789".includes(char) && char !== "=";
}
function isOpening(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var originalOpts = arguments.length > 2 ? arguments[2] : undefined;
  if (typeof str !== "string") {
    throw new Error("is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as \"".concat(_typeof(str), "\", value being ").concat(JSON.stringify(str, null, 4)));
  }
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error("is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as \"".concat(_typeof(idx), "\", value being ").concat(JSON.stringify(idx, null, 4)));
  }
  var defaults = {
    allowCustomTagNames: false,
    skipOpeningBracket: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var whitespaceChunk = "[\\\\ \\t\\r\\n/]*";
  var generalChar = "._a-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF";
  var r1 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<").concat(whitespaceChunk, "\\w+").concat(whitespaceChunk, ">"), "g");
  var r5 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<").concat(whitespaceChunk, "[").concat(generalChar, "]+[-").concat(generalChar, "]*").concat(whitespaceChunk, ">"), "g");
  var r2 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<", "\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['\"\\w]"), "g");
  var r6 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<", "\\s*\\w+\\s+[").concat(generalChar, "]+[-").concat(generalChar, "]*(?:-\\w+)?\\s*=\\s*['\"\\w]"));
  var r3 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<", "\\s*\\/?\\s*\\w+\\s*\\/?\\s*>"), "g");
  var r7 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<", "\\s*\\/?\\s*[").concat(generalChar, "]+[-").concat(generalChar, "]*\\s*\\/?\\s*>"), "g");
  var r4 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<").concat(whitespaceChunk, "\\w+(?:\\s*\\w+)*\\s*\\w+=['\"]"), "g");
  var r8 = new RegExp("^".concat(opts.skipOpeningBracket ? "" : "<").concat(whitespaceChunk, "[").concat(generalChar, "]+[-").concat(generalChar, "]*(?:\\s*\\w+)*\\s*\\w+=['\"]"), "g");
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  var matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
  };
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
  } else if (stringMatchLeftRight.matchRightIncl(str, idx, knownHtmlTags, {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["<", "/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
  })) {
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
  if (!passed && !opts.skipOpeningBracket && str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() && stringMatchLeftRight.matchRight(str, idx, knownHtmlTags, matchingOptions)) {
    passed = true;
  }
  var res = typeof str === "string" && idx < str.length && passed;
  return res;
}

module.exports = isOpening;
