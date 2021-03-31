/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 4.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

var version$1 = "4.0.12";

const version = version$1;
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
  const metaTag = /<\s*!\s*doctype[^>]*>/im;
  const imgTag = /<\s*img[^>]*>/gi;
  const brTag = /<\s*br[^>]*>/gi;
  const hrTag = /<\s*hr[^>]*>/gi;
  const closingSlash = /\/\s*>/g;
  const extractedMetaTag = input.match(metaTag);
  if (extractedMetaTag) {
    const xhtmlRegex = /xhtml/gi;
    const svgRegex = /svg/gi;
    if (extractedMetaTag[0].match(xhtmlRegex) || extractedMetaTag[0].match(svgRegex)) {
      return "xhtml";
    }
    return "html";
  }
  const allImageTagsArr = input.match(imgTag) || [];
  const allBRTagsArr = input.match(brTag) || [];
  const allHRTagsArr = input.match(hrTag) || [];
  const allConcernedTagsArr = allImageTagsArr.concat(allBRTagsArr).concat(allHRTagsArr);
  if (allConcernedTagsArr.length === 0) {
    return null;
  }
  let slashCount = 0;
  for (let i = 0, len = allConcernedTagsArr.length; i < len; i++) {
    if (existy(allConcernedTagsArr[i].match(closingSlash))) {
      slashCount += 1;
    }
  }
  if (slashCount > allConcernedTagsArr.length / 2) {
    return "xhtml";
  }
  return "html";
}

export { detectIsItHTMLOrXhtml, version };
