import { patcher } from "../dist/html-table-patcher.esm.js";

function processThis(str, opts) {
  return tiny(patcher(str, opts).result);
}

function tiny(something) {
  if (typeof something !== "string") {
    return "";
  }
  return something.replace(/\s+/g, "");
}

export { processThis, tiny };
