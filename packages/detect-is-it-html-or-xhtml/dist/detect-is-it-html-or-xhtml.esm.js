/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.9.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

function detectIsItHTMLOrXhtml(input) {
  function existy(x) {
    return x != null;
  }
  if (!existy(input)) {
    return null;
  }
  if (typeof input !== "string") {
    throw new TypeError(
      "detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string"
    );
  }
  let i;
  let len;
  let allImageTagsArr;
  let allBRTagsArr;
  let allHRTagsArr;
  let allConcernedTagsArr;
  let slashCount = 0;
  const metaTag = /<\s*!\s*doctype[^>]*>/im;
  const imgTag = /<\s*img[^>]*>/gi;
  const brTag = /<\s*br[^>]*>/gi;
  const hrTag = /<\s*hr[^>]*>/gi;
  const closingSlash = /\/\s*>/g;
  let extractedMetaTag = null;
  let res = null;
  extractedMetaTag = metaTag.exec(input);
  if (existy(extractedMetaTag)) {
    const xhtmlRegex = /xhtml/gi;
    const svgRegex = /svg/gi;
    if (
      extractedMetaTag[0].match(xhtmlRegex) ||
      extractedMetaTag[0].match(svgRegex)
    ) {
      res = "xhtml";
    } else {
      res = "html";
    }
  } else {
    allImageTagsArr = input.match(imgTag) || [];
    allBRTagsArr = input.match(brTag) || [];
    allHRTagsArr = input.match(hrTag) || [];
    allConcernedTagsArr = allImageTagsArr
      .concat(allBRTagsArr)
      .concat(allHRTagsArr);
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

export default detectIsItHTMLOrXhtml;
