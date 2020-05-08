/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.9.57
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
 */

'use strict';

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
    var xhtmlRegex = /xhtml/gi;
    var svgRegex = /svg/gi;
    if (extractedMetaTag[0].match(xhtmlRegex) || extractedMetaTag[0].match(svgRegex)) {
      res = "xhtml";
    } else {
      res = "html";
    }
  } else {
    allImageTagsArr = input.match(imgTag) || [];
    allBRTagsArr = input.match(brTag) || [];
    allHRTagsArr = input.match(hrTag) || [];
    allConcernedTagsArr = allImageTagsArr.concat(allBRTagsArr).concat(allHRTagsArr);
    if (allConcernedTagsArr.length === 0) {
      return null;
    }
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

module.exports = detectIsItHTMLOrXhtml;
