import { stripHtml as originalStripHtml } from "../../dist/string-strip-html.esm.js";

// the "log" output key's value is indeterminable so we omit that
function stripHtml(...args) {
  let { result, ranges, allTagLocations, filteredTagLocations } =
    originalStripHtml(...args);
  return { result, ranges, allTagLocations, filteredTagLocations };
}

export { stripHtml };
