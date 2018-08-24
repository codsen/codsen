import mergeRanges from 'ranges-merge';
import isregexp from 'lodash.isregexp';

function rangesRegex(regx, str, replacement) {
  if (regx === undefined) {
    throw new TypeError(
      `ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!`
    );
  } else if (!isregexp(regx)) {
    throw new TypeError(
      `ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof regx}, equal to: ${JSON.stringify(
        regx,
        null,
        4
      )}`
    );
  }
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (
    replacement !== undefined &&
    replacement !== null &&
    typeof replacement !== "string"
  ) {
    throw new TypeError(
      `ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof replacement}, equal to: ${JSON.stringify(
        replacement,
        null,
        4
      )}`
    );
  }
  if (str.length === 0) {
    return null;
  }
  let array1;
  const resRange = [];
  if (
    replacement === null ||
    (typeof replacement === "string" && replacement.length > 0)
  ) {
    while ((array1 = regx.exec(str)) !== null) {
      resRange.push([
        regx.lastIndex - array1[0].length,
        regx.lastIndex,
        replacement
      ]);
    }
  } else {
    while ((array1 = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - array1[0].length, regx.lastIndex]);
    }
  }
  if (resRange.length) {
    return mergeRanges(resRange);
  }
  return null;
}

export default rangesRegex;
