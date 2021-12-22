import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  leftOutsideNot: string | string[];
  leftOutside: string | string[];
  leftMaybe: string | string[];
  searchFor: string | string[];
  rightMaybe: string | string[];
  rightOutside: string | string[];
  rightOutsideNot: string | string[];
  i: {
    leftOutsideNot: boolean;
    leftOutside: boolean;
    leftMaybe: boolean;
    searchFor: boolean;
    rightMaybe: boolean;
    rightOutside: boolean;
    rightOutsideNot: boolean;
  };
}

// astralAwareSearch() - searches for strings, returns the findings in an array
function astralAwareSearch(
  whereToLook: string,
  whatToLookFor: string,
  opts?: { i?: boolean }
): number[] {
  function existy(something: any): boolean {
    return something != null;
  }
  if (
    typeof whereToLook !== "string" ||
    whereToLook.length === 0 ||
    typeof whatToLookFor !== "string" ||
    whatToLookFor.length === 0
  ) {
    return [];
  }
  let foundIndexArray = [];
  let arrWhereToLook = Array.from(whereToLook);
  let arrWhatToLookFor = Array.from(whatToLookFor);
  let found;

  for (let i = 0; i < arrWhereToLook.length; i++) {
    // check if current source character matches the first char of what we're looking for
    if (opts?.i) {
      if (
        arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()
      ) {
        found = true;
        // this means first character matches
        // match the rest:
        for (let i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
          if (
            !existy(arrWhereToLook[i + i2]) ||
            !existy(arrWhatToLookFor[i2]) ||
            arrWhereToLook[i + i2].toLowerCase() !==
              arrWhatToLookFor[i2].toLowerCase()
          ) {
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
      // this means first character matches
      // match the rest:
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

// ===========================

/**
 * stringise/arrayiffy - Turns null/undefined into ''. If array, turns each elem into String.
 * all other cases, runs through String()
 *
 * @param  {whatever} incoming     can be anything
 * @return {String/Array}          string or array of strings
 */
function stringise(incoming: any): string[] {
  function existy(something: any): boolean {
    return something != null;
  }
  if (!existy(incoming) || typeof incoming === "boolean") {
    return [""];
  }
  if (Array.isArray(incoming)) {
    return incoming
      .filter((el) => existy(el) && typeof el !== "boolean")
      .map((el) => String(el))
      .filter((el) => el.length > 0);
  }
  return [String(incoming)];
}

// ===========================

function iterateLeft(
  elem: string,
  arrSource: string[],
  foundBeginningIndex: number,
  i: boolean
): boolean {
  let matched = true;
  let charsArray = Array.from(elem);
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    // iterate each character of particular Outside:
    if (i) {
      if (
        charsArray[i2].toLowerCase() !==
        arrSource[
          foundBeginningIndex - Array.from(elem).length + i2
        ].toLowerCase()
      ) {
        matched = false;
        break;
      }
    } else if (
      charsArray[i2] !==
      arrSource[foundBeginningIndex - Array.from(elem).length + i2]
    ) {
      matched = false;
      break;
    }
  }
  return matched;
}

function iterateRight(
  elem: string,
  arrSource: string[],
  foundEndingIndex: number,
  i: boolean
): boolean {
  let matched = true;
  let charsArray = Array.from(elem);
  for (let i2 = 0, len = charsArray.length; i2 < len; i2++) {
    // iterate each character of particular Outside:
    if (i) {
      if (
        charsArray[i2].toLowerCase() !==
        arrSource[foundEndingIndex + i2].toLowerCase()
      ) {
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

//                      ____
//       bug hammer    |    |
//   O=================|    |
//     bugs into ham   |____|
//
//                     .=O=.

// =========================
// M A I N   F U N C T I O N
// =========================

function er(
  originalSource: string,
  options: Opts,
  originalReplacement: string
): string {
  let defaults = {
    i: {
      leftOutsideNot: false,
      leftOutside: false,
      leftMaybe: false,
      searchFor: false,
      rightMaybe: false,
      rightOutside: false,
      rightOutsideNot: false,
    },
  };
  let opts = { ...defaults, ...options };

  // enforce the peace and order:
  let source = stringise(originalSource);
  opts.leftOutsideNot = stringise(opts.leftOutsideNot);
  opts.leftOutside = stringise(opts.leftOutside);
  opts.leftMaybe = stringise(opts.leftMaybe);
  opts.searchFor = String(opts.searchFor);
  opts.rightMaybe = stringise(opts.rightMaybe);
  opts.rightOutside = stringise(opts.rightOutside);
  opts.rightOutsideNot = stringise(opts.rightOutsideNot);
  let replacement = stringise(originalReplacement);

  let arrSource = Array.from(source[0]);
  let foundBeginningIndex;
  let foundEndingIndex;
  let matched;
  let found;
  let replacementRecipe: [number, number][] = [];
  let result = "";

  //  T H E   L O O P

  let allResults = astralAwareSearch(source[0], opts.searchFor, {
    i: opts.i.searchFor,
  });

  for (
    let resIndex = 0, resLen = allResults.length;
    resIndex < resLen;
    resIndex++
  ) {
    let oneOfFoundIndexes = allResults[resIndex];

    // oneOfFoundIndexes is the index of starting index of found
    // the principle of replacement is after finding the searchFor string,
    // the boundaries optionally expand. That's left/right Maybe's from the
    // options object. When done, the outsides are checked, first positive
    // (leftOutside, rightOutside), then negative (leftOutsideNot, rightOutsideNot).
    // That's the plan.

    foundBeginningIndex = oneOfFoundIndexes;
    foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length;
    //
    // ===================== leftMaybe =====================
    // commence with maybe's
    // they're not hungry, i.e. the whole Maybe must be of the left of searchFor exactly
    //
    /* istanbul ignore else */
    if (opts.leftMaybe.length > 0) {
      for (let i = 0, len = opts.leftMaybe.length; i < len; i++) {
        // iterate each of the maybe's in the array:
        matched = true;
        let splitLeftMaybe = Array.from(opts.leftMaybe[i]);
        for (let i2 = 0, len2 = splitLeftMaybe.length; i2 < len2; i2++) {
          // iterate each character of particular Maybe:
          if (opts.i.leftMaybe) {
            if (
              splitLeftMaybe[i2].toLowerCase() !==
              arrSource[
                oneOfFoundIndexes - splitLeftMaybe.length + i2
              ].toLowerCase()
            ) {
              matched = false;
              break;
            }
          } else if (
            splitLeftMaybe[i2] !==
            arrSource[oneOfFoundIndexes - splitLeftMaybe.length + i2]
          ) {
            matched = false;
            break;
          }
        }
        if (
          matched &&
          oneOfFoundIndexes - splitLeftMaybe.length < foundBeginningIndex
        ) {
          foundBeginningIndex = oneOfFoundIndexes - splitLeftMaybe.length;
        }
      }
    }
    // ===================== rightMaybe =====================
    /* istanbul ignore else */
    if (opts.rightMaybe.length > 0) {
      for (let i = 0, len = opts.rightMaybe.length; i < len; i++) {
        // iterate each of the Maybe's in the array:
        matched = true;
        let splitRightMaybe = Array.from(opts.rightMaybe[i]);
        for (let i2 = 0, len2 = splitRightMaybe.length; i2 < len2; i2++) {
          // iterate each character of particular Maybe:
          if (opts.i.rightMaybe) {
            if (
              splitRightMaybe[i2].toLowerCase() !==
              arrSource[
                oneOfFoundIndexes + Array.from(opts.searchFor).length + i2
              ].toLowerCase()
            ) {
              matched = false;
              break;
            }
          } else if (
            splitRightMaybe[i2] !==
            arrSource[
              oneOfFoundIndexes + Array.from(opts.searchFor).length + i2
            ]
          ) {
            matched = false;
            break;
          }
        }
        if (
          matched &&
          foundEndingIndex <
            oneOfFoundIndexes +
              Array.from(opts.searchFor).length +
              splitRightMaybe.length
        ) {
          foundEndingIndex =
            oneOfFoundIndexes +
            Array.from(opts.searchFor).length +
            splitRightMaybe.length;
        }
      }
    }
    // ===================== leftOutside =====================
    if (opts.leftOutside[0] !== "") {
      found = false;
      for (let i = 0, len = opts.leftOutside.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateLeft(
          opts.leftOutside[i],
          arrSource,
          foundBeginningIndex,
          opts.i.leftOutside
        );
        if (matched) {
          found = true;
        }
      }
      if (!found) {
        continue;
      }
    }
    // ===================== rightOutside =====================
    if (opts.rightOutside[0] !== "") {
      found = false;
      for (let i = 0, len = opts.rightOutside.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateRight(
          opts.rightOutside[i],
          arrSource,
          foundEndingIndex,
          opts.i.rightOutside
        );
        if (matched) {
          found = true;
        }
      }
      if (!found) {
        continue;
      }
    }
    // ===================== leftOutsideNot =====================
    if (opts.leftOutsideNot[0] !== "") {
      for (let i = 0, len = opts.leftOutsideNot.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateLeft(
          opts.leftOutsideNot[i],
          arrSource,
          foundBeginningIndex,
          opts.i.leftOutsideNot
        );
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
    // ===================== rightOutsideNot =====================
    if (opts.rightOutsideNot[0] !== "") {
      for (let i = 0, len = opts.rightOutsideNot.length; i < len; i++) {
        // iterate each of the outsides in the array:
        matched = iterateRight(
          opts.rightOutsideNot[i],
          arrSource,
          foundEndingIndex,
          opts.i.rightOutsideNot
        );
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
    // ===================== the rest =====================
    replacementRecipe.push([foundBeginningIndex, foundEndingIndex]);
  }
  // =====
  // first we need to remove any overlaps in the recipe, cases like:
  // [ [0,10], [2,12] ] => [ [0,10], [10,12] ]
  if (replacementRecipe.length > 0) {
    replacementRecipe.forEach((_elem, i) => {
      // iterate through all replacement-recipe-array's elements:
      if (
        replacementRecipe[i + 1] !== undefined &&
        replacementRecipe[i][1] > replacementRecipe[i + 1][0]
      ) {
        replacementRecipe[i + 1][0] = replacementRecipe[i][1];
      }
    });
    // iterate the recipe array again, cleaning up elements like [12,12]
    replacementRecipe.forEach((elem, i) => {
      if (elem[0] === elem[1]) {
        replacementRecipe.splice(i, 1);
      }
    });
  } else {
    // there were no findings, so return source
    return source.join("");
  }
  //
  // iterate the recipe array and perform the replacement:
  // first, if replacements don't start with 0, attach this part onto result let:
  if (replacementRecipe.length > 0 && replacementRecipe[0][0] !== 0) {
    result += arrSource.slice(0, replacementRecipe[0][0]).join("");
  }
  replacementRecipe.forEach((_elem, i) => {
    // first position is replacement string:
    result += replacement.join("");
    if (replacementRecipe[i + 1] !== undefined) {
      // if next element exists, add content between current and next finding
      result += arrSource
        .slice(replacementRecipe[i][1], replacementRecipe[i + 1][0])
        .join("");
    } else {
      // if this is the last element in the replacement recipe array, add
      // remainder of the string after last replacement and the end:
      result += arrSource.slice(replacementRecipe[i][1]).join("");
    }
  });
  return result;
}

export { er, version };
