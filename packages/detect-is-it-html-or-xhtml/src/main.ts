import { formatDiagnosticValue } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;
const metaTagRegex = /<\s*!\s*doctype[^>]*>/i;
const singleTagRegex = /<\s*(?:img|br|hr)[^>]*>/gi;
const closingSlashRegex = /\/\s*>/;
const xhtmlRegex = /xhtml/i;
const svgRegex = /svg/i;

// ===================================
// F U N C T I O N S

export type Output = "html" | "xhtml" | null;

function detectIsItHTMLOrXhtml(input: string): Output {
  if (input == null || input === "") {
    return null;
  }

  if (typeof input !== "string") {
    throw new TypeError(
      `detect-is-it-html-or-xhtml/detectIsItHTMLOrXhtml(): [THROW_ID_01] Input must be a string! It was given as ${formatDiagnosticValue(input, 4)} (type ${typeof input})`,
    );
  }

  const extractedMetaTag = input.match(metaTagRegex);

  if (extractedMetaTag) {
    // detect by doctype meta tag
    if (
      xhtmlRegex.test(extractedMetaTag[0]) ||
      svgRegex.test(extractedMetaTag[0])
    ) {
      return "xhtml";
    }
    return "html";
  }

  // ELSE - detect by scanning single tags
  const allConcernedTagsArr = input.match(singleTagRegex);
  if (!allConcernedTagsArr) {
    return null;
  }

  // count closing slashes
  let slashCount = 0;
  for (let i = 0, len = allConcernedTagsArr.length; i < len; i++) {
    if (closingSlashRegex.test(allConcernedTagsArr[i])) {
      slashCount += 1;
    }
  }

  if (slashCount > allConcernedTagsArr.length / 2) {
    return "xhtml";
  }
  return "html";
}

export { detectIsItHTMLOrXhtml, version };
