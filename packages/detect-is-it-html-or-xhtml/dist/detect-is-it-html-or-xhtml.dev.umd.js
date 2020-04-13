/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.9.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.detectIsItHtmlOrXhtml = factory());
}(this, (function () { 'use strict';

  // ===================================
  // F U N C T I O N S
  function detectIsItHTMLOrXhtml(input) {
    function existy(x) {
      return x != null;
    }

    if (!existy(input)) {
      return null;
    }

    if (typeof input !== "string") {
      throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");
    }

    var i;
    var len;
    var allImageTagsArr;
    var allBRTagsArr;
    var allHRTagsArr;
    var allConcernedTagsArr;
    var slashCount = 0;
    var metaTag = /<\s*!\s*doctype[^>]*>/im;
    var imgTag = /<\s*img[^>]*>/gi;
    var brTag = /<\s*br[^>]*>/gi;
    var hrTag = /<\s*hr[^>]*>/gi;
    var closingSlash = /\/\s*>/g;
    var extractedMetaTag = null;
    var res = null;
    extractedMetaTag = metaTag.exec(input);

    if (existy(extractedMetaTag)) {
      // detect by doctype meta tag
      var xhtmlRegex = /xhtml/gi;
      var svgRegex = /svg/gi;

      if (extractedMetaTag[0].match(xhtmlRegex) || extractedMetaTag[0].match(svgRegex)) {
        res = "xhtml";
      } else {
        res = "html";
      }
    } else {
      // detect by scanning single tags
      allImageTagsArr = input.match(imgTag) || [];
      allBRTagsArr = input.match(brTag) || [];
      allHRTagsArr = input.match(hrTag) || []; // join all found tags

      allConcernedTagsArr = allImageTagsArr.concat(allBRTagsArr).concat(allHRTagsArr);

      if (allConcernedTagsArr.length === 0) {
        return null;
      } // count closing slashes


      for (i = 0, len = allConcernedTagsArr.length; i < len; i++) {
        if (existy(allConcernedTagsArr[i].match(closingSlash))) {
          slashCount += 1;
        }
      }

      if (slashCount > allConcernedTagsArr.length / 2) {
        res = "xhtml";
      } else {
        res = "html";
      }
    }

    return res;
  }

  return detectIsItHTMLOrXhtml;

})));
