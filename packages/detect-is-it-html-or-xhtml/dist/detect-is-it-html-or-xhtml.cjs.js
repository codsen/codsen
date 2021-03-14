/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 4.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "4.0.8";

var version = version$1;
function detectIsItHTMLOrXhtml(input) {
  function existy(x) {
    return x != null;
  }
  if (!input) {
    return null;
  }
  if (typeof input !== "string") {
    throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");
  }
  var metaTag = /<\s*!\s*doctype[^>]*>/im;
  var imgTag = /<\s*img[^>]*>/gi;
  var brTag = /<\s*br[^>]*>/gi;
  var hrTag = /<\s*hr[^>]*>/gi;
  var closingSlash = /\/\s*>/g;
  var extractedMetaTag = input.match(metaTag);
  if (extractedMetaTag) {
    var xhtmlRegex = /xhtml/gi;
    var svgRegex = /svg/gi;
    if (extractedMetaTag[0].match(xhtmlRegex) || extractedMetaTag[0].match(svgRegex)) {
      return "xhtml";
    }
    return "html";
  }
  var allImageTagsArr = input.match(imgTag) || [];
  var allBRTagsArr = input.match(brTag) || [];
  var allHRTagsArr = input.match(hrTag) || [];
  var allConcernedTagsArr = allImageTagsArr.concat(allBRTagsArr).concat(allHRTagsArr);
  if (allConcernedTagsArr.length === 0) {
    return null;
  }
  var slashCount = 0;
  for (var i = 0, len = allConcernedTagsArr.length; i < len; i++) {
    if (existy(allConcernedTagsArr[i].match(closingSlash))) {
      slashCount += 1;
    }
  }
  if (slashCount > allConcernedTagsArr.length / 2) {
    return "xhtml";
  }
  return "html";
}

exports.detectIsItHTMLOrXhtml = detectIsItHTMLOrXhtml;
exports.version = version;
