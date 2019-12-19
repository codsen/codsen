import isRegExp from "lodash.isregexp";

function includesWithRegex(arr, whatToMatch) {
  console.log(`004 includesWithRegex() called to match "${whatToMatch}"`);
  if (!Array.isArray(arr) || !arr.length) {
    // definitely does not include
    console.log(`007 includesWithRegex() quick end, return false`);
    return false;
  }
  return arr.some(
    val =>
      (typeof val === "string" && whatToMatch === val) ||
      (isRegExp(val) && val.test(whatToMatch))
  );
}

export default includesWithRegex;
