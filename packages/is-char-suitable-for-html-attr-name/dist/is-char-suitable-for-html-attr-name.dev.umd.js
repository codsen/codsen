/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.isCharSuitableForHtmlAttrName = factory());
}(this, (function () { 'use strict';

  function charSuitableForHTMLAttrName(_char) {
    return typeof _char === "string" && ( //
    // lowercase letters, indexes 97 - 122:
    _char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123 || // uppercase letters, indexes 65 - 90
    _char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 || // digits 0 - 9, indexes 48 - 57
    _char.charCodeAt(0) > 47 && _char.charCodeAt(0) < 58 || _char === ":" || _char === "-");
  }

  return charSuitableForHTMLAttrName;

})));
