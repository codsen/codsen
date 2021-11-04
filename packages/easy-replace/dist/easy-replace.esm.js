/**
 * @name easy-replace
 * @fileoverview Replace strings with optional lookarounds, but without regexes
 * @version 5.0.4
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/easy-replace/}
 */

var version$1 = "5.0.4";

const version = version$1;
function astralAwareSearch(whereToLook, whatToLookFor, opts) {
  function existy(something) {
    return something != null;
  }
  if (typeof whereToLook !== "string" || whereToLook.length === 0 || typeof whatToLookFor !== "string" || whatToLookFor.length === 0) {
    return [];
  }
  const foundIndexArray = [];
  const arrWhereToLook = Array.from(whereToLook);
  const arrWhatToLookFor = Array.from(whatToLookFor);
  let found;
  for (let i = 0; i < arrWhereToLook.length; i++) {
    if (opts && opts.i) {
      if (arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()) {
        found = true;
        for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
          if (!existy(arrWhereToLook[i + i2]) || !existy(arrWhatToLookFor[i2]) || arrWhereToLook[i + i2].toLowerCase() !== arrWhatToLookFor[i2].toLowerCase()) {
            found = false;
            break;
          }
        }
        if (found) {
          foundIndexArray.push(i);
        }
      }
    } else if (arrWhereToLook[i] === arrWhatToLookFor[0]) {
      found = true;
      for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
        if (arrWhereToLook[i + i2] !== arrWhatToLookFor[i2]) {
          found = false;
          break;
        }
      }
      if (found) {
        foundIndexArray.push(i);
      }
    }
  }
  return foundIndexArray;
}
function stringise(incoming) {
  function existy(something) {
    return something != null;
  }
  if (!existy(incoming) || typeof incoming === "boolean") {
    return [""];
  }
  if (Array.isArray(incoming)) {
    return incoming.filter(el => existy(el) && typeof el !== "boolean").map(el => String(el)).filter(el => el.length > 0);
  }
  return [String(incoming)];
}
function iterateLeft(elem, arrSource, foundBeginningIndex, i) {
  let matched = true;
  const charsArray = Array.from(elem);
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    if (i) {
      if (charsArray[i2].toLowerCase() !== arrSource[foundBeginningIndex - Array.from(elem).length + i2].toLowerCase()) {
        matched = false;
        break;
      }
    } else if (charsArray[i2] !== arrSource[foundBeginningIndex - Array.from(elem).length + i2]) {
      matched = false;
      break;
    }
  }
  return matched;
}
function iterateRight(elem, arrSource, foundEndingIndex, i) {
  let matched = true;
  const charsArray = Array.from(elem);
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    if (i) {
      if (charsArray[i2].toLowerCase() !== arrSource[foundEndingIndex + i2].toLowerCase()) {
        matched = false;
        break;
      }
    } else if (charsArray[i2] !== arrSource[foundEndingIndex + i2]) {
      matched = false;
      break;
    }
  }
  return matched;
}
function er(originalSource, options, originalReplacement) {
  const defaults = {
    i: {
      leftOutsideNot: false,
      leftOutside: false,
      leftMaybe: false,
      searchFor: false,
      rightMaybe: false,
      rightOutside: false,
      rightOutsideNot: false
    }
  };
  const opts = { ...defaults,
    ...options
  };
  const source = stringise(originalSource);
  opts.leftOutsideNot = stringise(opts.leftOutsideNot);
  opts.leftOutside = stringise(opts.leftOutside);
  opts.leftMaybe = stringise(opts.leftMaybe);
  opts.searchFor = String(opts.searchFor);
  opts.rightMaybe = stringise(opts.rightMaybe);
  opts.rightOutside = stringise(opts.rightOutside);
  opts.rightOutsideNot = stringise(opts.rightOutsideNot);
  const replacement = stringise(originalReplacement);
  const arrSource = Array.from(source[0]);
  let foundBeginningIndex;
  let foundEndingIndex;
  let matched;
  let found;
  const replacementRecipe = [];
  let result = "";
  const allResults = astralAwareSearch(source[0], opts.searchFor, {
    i: opts.i.searchFor
  });
  for (let resIndex = 0, resLen = allResults.length; resIndex < resLen; resIndex++) {
    const oneOfFoundIndexes = allResults[resIndex];
    foundBeginningIndex = oneOfFoundIndexes;
    foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length;
    /* istanbul ignore else */
    if (opts.leftMaybe.length > 0) {
      for (let i = 0, len = opts.leftMaybe.length; i < len; i++) {
        matched = true;
        const splitLeftMaybe = Array.from(opts.leftMaybe[i]);
        for (let i2 = 0, len2 = splitLeftMaybe.length; i2 < len2; i2++) {
          if (opts.i.leftMaybe) {
            if (splitLeftMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2].toLowerCase()) {
              matched = false;
              break;
            }
          } else if (splitLeftMaybe[i2] !== arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2]) {
            matched = false;
            break;
          }
        }
        if (matched && oneOfFoundIndexes - splitLeftMaybe.length < foundBeginningIndex) {
          foundBeginningIndex = oneOfFoundIndexes - splitLeftMaybe.length;
        }
      }
    }
    /* istanbul ignore else */
    if (opts.rightMaybe.length > 0) {
      for (let i = 0, len = opts.rightMaybe.length; i < len; i++) {
        matched = true;
        const splitRightMaybe = Array.from(opts.rightMaybe[i]);
        for (let i2 = 0, len2 = splitRightMaybe.length; i2 < len2; i2++) {
          if (opts.i.rightMaybe) {
            if (splitRightMaybe[i2].toLowerCase() !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + i2].toLowerCase()) {
              matched = false;
              break;
            }
          } else if (splitRightMaybe[i2] !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + i2]) {
            matched = false;
            break;
          }
        }
        if (matched && foundEndingIndex < oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length) {
          foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length;
        }
      }
    }
    if (opts.leftOutside[0] !== "") {
      found = false;
      for (let i = 0, len = opts.leftOutside.length; i < len; i++) {
        matched = iterateLeft(opts.leftOutside[i], arrSource, foundBeginningIndex, opts.i.leftOutside);
        if (matched) {
          found = true;
        }
      }
      if (!found) {
        continue;
      }
    }
    if (opts.rightOutside[0] !== "") {
      found = false;
      for (let i = 0, len = opts.rightOutside.length; i < len; i++) {
        matched = iterateRight(opts.rightOutside[i], arrSource, foundEndingIndex, opts.i.rightOutside);
        if (matched) {
          found = true;
        }
      }
      if (!found) {
        continue;
      }
    }
    if (opts.leftOutsideNot[0] !== "") {
      for (let i = 0, len = opts.leftOutsideNot.length; i < len; i++) {
        matched = iterateLeft(opts.leftOutsideNot[i], arrSource, foundBeginningIndex, opts.i.leftOutsideNot);
        if (matched) {
          foundBeginningIndex = -1;
          foundEndingIndex = -1;
          break;
        }
      }
      if (foundBeginningIndex === -1) {
        continue;
      }
    }
    if (opts.rightOutsideNot[0] !== "") {
      for (let i = 0, len = opts.rightOutsideNot.length; i < len; i++) {
        matched = iterateRight(opts.rightOutsideNot[i], arrSource, foundEndingIndex, opts.i.rightOutsideNot);
        if (matched) {
          foundBeginningIndex = -1;
          foundEndingIndex = -1;
          break;
        }
      }
      if (foundBeginningIndex === -1) {
        continue;
      }
    }
    replacementRecipe.push([foundBeginningIndex, foundEndingIndex]);
  }
  if (replacementRecipe.length > 0) {
    replacementRecipe.forEach((_elem, i) => {
      if (replacementRecipe[i + 1] !== undefined && replacementRecipe[i][1] > replacementRecipe[i + 1][0]) {
        replacementRecipe[i + 1][0] = replacementRecipe[i][1];
      }
    });
    replacementRecipe.forEach((elem, i) => {
      if (elem[0] === elem[1]) {
        replacementRecipe.splice(i, 1);
      }
    });
  } else {
    return source.join("");
  }
  if (replacementRecipe.length > 0 && replacementRecipe[0][0] !== 0) {
    result += arrSource.slice(0, replacementRecipe[0][0]).join("");
  }
  replacementRecipe.forEach((_elem, i) => {
    result += replacement.join("");
    if (replacementRecipe[i + 1] !== undefined) {
      result += arrSource.slice(replacementRecipe[i][1], replacementRecipe[i + 1][0]).join("");
    } else {
      result += arrSource.slice(replacementRecipe[i][1]).join("");
    }
  });
  return result;
}

export { er, version };
