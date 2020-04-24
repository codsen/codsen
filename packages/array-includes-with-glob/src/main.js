import matcher from "matcher";

const isArr = Array.isArray;

function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
  // internal f()'s
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }

  const defaults = {
    arrayVsArrayAllMustBeFound: "any", // two options: 'any' or 'all'
  };

  const opts = { ...defaults, ...originalOpts };

  // insurance
  if (arguments.length === 0) {
    throw new Error(
      "array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!"
    );
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      // eslint-disable-next-line no-param-reassign
      originalInput = [originalInput];
    } else {
      throw new Error(
        `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ${typeof originalInput}`
      );
    }
  }
  if (!isStr(stringToFind) && !isArr(stringToFind)) {
    throw new Error(
      `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ${typeof stringToFind}`
    );
  }
  if (
    opts.arrayVsArrayAllMustBeFound !== "any" &&
    opts.arrayVsArrayAllMustBeFound !== "all"
  ) {
    throw new Error(
      `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ${opts.arrayVsArrayAllMustBeFound}. It must be equal to either "any" or "all".`
    );
  }

  // maybe we can end prematurely:
  if (originalInput.length === 0) {
    return false; // because nothing can be found in it
  }

  // prevent any mutation + filter out undefined and null elements:
  const input = originalInput.filter((elem) => existy(elem));

  // if array contained only null/undefined values, do a Dutch leave:
  if (input.length === 0) {
    return false;
  }

  if (isStr(stringToFind)) {
    return input.some((val) =>
      matcher.isMatch(val, stringToFind, { caseSensitive: true })
    );
  }
  // array then.
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some((stringToFindVal) =>
      input.some((val) =>
        matcher.isMatch(val, stringToFindVal, { caseSensitive: true })
      )
    );
  }
  return stringToFind.every((stringToFindVal) =>
    input.some((val) =>
      matcher.isMatch(val, stringToFindVal, { caseSensitive: true })
    )
  );
}

export default arrayIncludesWithGlob;
