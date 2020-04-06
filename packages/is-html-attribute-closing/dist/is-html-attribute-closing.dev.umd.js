/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.isHtmlAttributeClosing = factory());
}(this, (function () { 'use strict';

  // import { matchRight, matchRightIncl } from "string-match-left-right";
  function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
    if (typeof str !== "string" || !str.trim().length || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
      return false;
    }

    var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null; // happy path scenario: quote character in question
    // (the one at str[isThisClosingIdx]) is matching the
    // character at the opening (str[idxOfAttrOpening])
    // traverse string from "idxOfAttrOpening" up to
    // "isThisClosingIdx" and look for interesting things:

    for (var i = idxOfAttrOpening; i < isThisClosingIdx; i++) {
      //
      // Logging:
      // -------------------------------------------------------------------------
      // if =' or =" is encountered, it's false
      if (str[i] === "=" && "'\"".includes(str[i + 1])) {
        return false;
      }
    } // if this point was reached and loop didn't exit...
    // happy path scenario: current quote matches the opening
    // quote


    if (openingQuote && str[isThisClosingIdx] === str[isThisClosingIdx]) {
      return true;
    } // default is false


    return false;
  }

  return isAttrClosing;

})));
