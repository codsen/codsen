import { version as v } from "../package.json";

const version: string = v;

// ===================================
// F U N C T I O N S

export type Output = "html" | "xhtml" | null;

function detectIsItHTMLOrXhtml(input: string): Output {
  function existy(x: any): boolean {
    return x != null;
  }

  if (!input) {
    return null;
  }

  if (typeof input !== "string") {
    throw new TypeError(
      `detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be a string! It was given as ${JSON.stringify(
        input,
        null,
        4,
      )} (type ${typeof input})`,
    );
  }

  let metaTag = /<\s*!\s*doctype[^>]*>/im;
  let imgTag = /<\s*img[^>]*>/gi;
  let brTag = /<\s*br[^>]*>/gi;
  let hrTag = /<\s*hr[^>]*>/gi;
  let closingSlash = /\/\s*>/g;
  let extractedMetaTag = input.match(metaTag);

  if (extractedMetaTag) {
    // detect by doctype meta tag
    let xhtmlRegex = /xhtml/gi;
    let svgRegex = /svg/gi;
    if (
      extractedMetaTag[0].match(xhtmlRegex) ||
      extractedMetaTag[0].match(svgRegex)
    ) {
      return "xhtml";
    }
    return "html";
  }

  // ELSE - detect by scanning single tags
  let allImageTagsArr: string[] = input.match(imgTag) || [];
  let allBRTagsArr: string[] = input.match(brTag) || [];
  let allHRTagsArr: string[] = input.match(hrTag) || [];

  // join all found tags
  let allConcernedTagsArr = allImageTagsArr
    .concat(allBRTagsArr)
    .concat(allHRTagsArr);

  if (allConcernedTagsArr.length === 0) {
    return null;
  }

  // count closing slashes
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
