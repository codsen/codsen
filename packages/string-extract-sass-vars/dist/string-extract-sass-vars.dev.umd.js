/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringExtractSassVars = factory());
}(this, (function () { 'use strict';

  // Takes string, SASS variables file and extracts the plain object of variables: key-value pairs
  // As a bonus, it turns digit-only value strings into numbers.
  var BACKSLASH = "\\";

  function extractVars(str, originalOpts) {
    var defaults = {
      throwIfEmpty: false
    };
    var opts = Object.assign({}, defaults, originalOpts);
    var len = str.length;
    var varNameStartsAt = null;
    var varValueStartsAt = null;
    var varName = null;
    var varValue = null;
    var withinQuotes = null;
    var lastNonQuoteCharAt = null;
    var withinComments = false;
    var withinSlashSlashComment = false;
    var withinSlashAsteriskComment = false;
    var res = {};

    for (var i = 0; i < len; i++) {
      //
      //
      //
      //
      //                                THE TOP
      //                                ███████
      //
      //
      // end the state of being within quotes
      if (!withinComments && withinQuotes && str[i] === withinQuotes && str[i - 1] !== BACKSLASH) {
        withinQuotes = null;
      } // catch the state of being within quotes
      else if (!withinQuotes && !withinComments && str[i - 1] !== BACKSLASH && "'\"".includes(str[i])) {
          withinQuotes = str[i];
        } // catch ending of withinSlashSlashComment


      if (withinSlashSlashComment && "\r\n".includes(str[i])) {
        withinSlashSlashComment = false;
      } // catch a start of slashslash comments block


      if (!withinComments && str[i] === "/" && str[i + 1] === "/") {
        withinSlashSlashComment = true;
      } // catch the ending of slash astrisk comments block


      if (withinSlashAsteriskComment && str[i - 2] === "*" && str[i - 1] === "/") {
        withinSlashAsteriskComment = false;
      } // catch a start of slash astrisk comments block
      // withinSlashAsteriskComment


      if (!withinComments && str[i] === "/" && str[i + 1] === "*") {
        withinSlashAsteriskComment = true;
      } // "within various comments" states aggregator


      withinComments = withinSlashSlashComment || withinSlashAsteriskComment; // Logging:
      // -------------------------------------------------------------------------
      //
      //
      //
      //
      //                              THE MIDDLE
      //                              ██████████
      //
      //
      //
      //
      // catch the beginning of the var name
      // -----------------------------------------------------------------------------

      if (!withinComments && str[i] === "$" && varNameStartsAt === null) {
        varNameStartsAt = i + 1;
      } // catch the ending of a value
      // -----------------------------------------------------------------------------


      if (!withinComments && varValueStartsAt !== null && !withinQuotes && str[i] === ";") {
        varValue = str.slice(!"\"'".includes(str[varValueStartsAt]) ? varValueStartsAt : varValueStartsAt + 1, lastNonQuoteCharAt + 1);

        if (/^-?\d*\.?\d*$/.test(varValue)) {
          varValue = +varValue;
        }

        res[varName] = varValue;
        varNameStartsAt = null;
        varValueStartsAt = null;
        varName = null;
        varValue = null;
      } // catch the beginning of a value
      // -----------------------------------------------------------------------------


      if (!withinComments && varName !== null && str[i] && str[i].trim().length && varValueStartsAt === null) {
        varValueStartsAt = i;
      } // catch the ending of the var name
      // -----------------------------------------------------------------------------


      if (!withinComments && !varName && varNameStartsAt !== null && str[i] === ":" && !withinQuotes) {
        varName = str.slice(varNameStartsAt, i);
      } //
      //
      //
      //
      //                              THE BOTTOM
      //                              ██████████
      //
      //
      //
      //


      if (!"'\"".includes(str[i])) {
        lastNonQuoteCharAt = i;
      } // LOGGING:

    }

    return res;
  }

  return extractVars;

})));
