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
    // detect by doctype meta tag
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
    // detect by scanning single tags
    allImageTagsArr = input.match(imgTag) || [];
    allBRTagsArr = input.match(brTag) || [];
    allHRTagsArr = input.match(hrTag) || [];

    // join all found tags
    allConcernedTagsArr = allImageTagsArr
      .concat(allBRTagsArr)
      .concat(allHRTagsArr);

    if (allConcernedTagsArr.length === 0) {
      return null;
    }

    // count closing slashes
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
