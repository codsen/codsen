/**
 * easy-replace
 * Replace strings with optional lookarounds, but without regexes
 * Version: 3.7.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/easy-replace
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var toArray = _interopDefault(require('lodash.toarray'));
var checkTypes = _interopDefault(require('check-types-mini'));

function existy(something) {
  return something != null;
}
function isBool(something) {
  return typeof something === "boolean";
}
function astralAwareSearch(whereToLook, whatToLookFor, opts) {
  if (typeof whereToLook !== "string" || whereToLook.length === 0 || typeof whatToLookFor !== "string" || whatToLookFor.length === 0) {
    return [];
  }
  var foundIndexArray = [];
  var arrWhereToLook = toArray(whereToLook);
  var arrWhatToLookFor = toArray(whatToLookFor);
  var found;
  for (var i = 0; i < arrWhereToLook.length; i++) {
    if (opts.i) {
      if (arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()) {
        found = true;
        for (var i2 = 0; i2 < arrWhatToLookFor.length; i2++) {
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
      for (var _i = 0; _i < arrWhatToLookFor.length; _i++) {
        if (arrWhereToLook[i + _i] !== arrWhatToLookFor[_i]) {
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
  if (!existy(incoming) || isBool(incoming)) {
    return [""];
  } else if (Array.isArray(incoming)) {
    return incoming.filter(function (el) {
      return existy(el) && !isBool(el);
    }).map(function (el) {
      return String(el);
    }).filter(function (el) {
      return el.length > 0;
    });
  }
  return [String(incoming)];
}
function iterateLeft(elem, arrSource, foundBeginningIndex, i) {
  var matched = true;
  var charsArray = toArray(elem);
  for (var i2 = 0, len = charsArray.length; i2 < len; i2++) {
    if (i) {
      if (charsArray[i2].toLowerCase() !== arrSource[foundBeginningIndex - toArray(elem).length + i2].toLowerCase()) {
        matched = false;
        break;
      }
    } else if (charsArray[i2] !== arrSource[foundBeginningIndex - toArray(elem).length + i2]) {
      matched = false;
      break;
    }
  }
  return matched;
}
function iterateRight(elem, arrSource, foundEndingIndex, i) {
  var matched = true;
  var charsArray = toArray(elem);
  for (var i2 = 0, len = charsArray.length; i2 < len; i2++) {
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
  var defaults = {
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
  var opts = Object.assign({}, defaults, options);
  checkTypes(opts, defaults, {
    schema: {
      leftOutsideNot: ["string", "number", "null", "undefined"],
      leftOutside: ["string", "number", "null", "undefined"],
      leftMaybe: ["string", "number", "null", "undefined"],
      searchFor: ["string", "number"],
      rightMaybe: ["string", "number", "null", "undefined"],
      rightOutside: ["string", "number", "null", "undefined"],
      rightOutsideNot: ["string", "number", "null", "undefined"]
    },
    msg: "easy-replace/module.exports():",
    optsVarName: "options",
    acceptArrays: true,
    acceptArraysIgnore: ["i"]
  });
  var source = stringise(originalSource);
  opts.leftOutsideNot = stringise(opts.leftOutsideNot);
  opts.leftOutside = stringise(opts.leftOutside);
  opts.leftMaybe = stringise(opts.leftMaybe);
  opts.searchFor = String(opts.searchFor);
  opts.rightMaybe = stringise(opts.rightMaybe);
  opts.rightOutside = stringise(opts.rightOutside);
  opts.rightOutsideNot = stringise(opts.rightOutsideNot);
  var replacement = stringise(originalReplacement);
  var arrSource = toArray(source[0]);
  var foundBeginningIndex;
  var foundEndingIndex;
  var matched;
  var found;
  var replacementRecipe = [];
  var result = "";
  var allResults = astralAwareSearch(source[0], opts.searchFor, {
    i: opts.i.searchFor
  });
  for (var resIndex = 0, resLen = allResults.length; resIndex < resLen; resIndex++) {
    var oneOfFoundIndexes = allResults[resIndex];
    foundBeginningIndex = oneOfFoundIndexes;
    foundEndingIndex = oneOfFoundIndexes + toArray(opts.searchFor).length;
    if (opts.leftMaybe.length > 0) {
      for (var i = 0, len = opts.leftMaybe.length; i < len; i++) {
        matched = true;
        var splitLeftMaybe = toArray(opts.leftMaybe[i]);
        for (var i2 = 0, len2 = splitLeftMaybe.length; i2 < len2; i2++) {
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
    if (opts.rightMaybe.length > 0) {
      for (var _i2 = 0, _len = opts.rightMaybe.length; _i2 < _len; _i2++) {
        matched = true;
        var splitRightMaybe = toArray(opts.rightMaybe[_i2]);
        for (var _i3 = 0, _len2 = splitRightMaybe.length; _i3 < _len2; _i3++) {
          if (opts.i.rightMaybe) {
            if (splitRightMaybe[_i3].toLowerCase() !== arrSource[oneOfFoundIndexes + toArray(opts.searchFor).length + _i3].toLowerCase()) {
              matched = false;
              break;
            }
          } else if (splitRightMaybe[_i3] !== arrSource[oneOfFoundIndexes + toArray(opts.searchFor).length + _i3]) {
            matched = false;
            break;
          }
        }
        if (matched && foundEndingIndex < oneOfFoundIndexes + toArray(opts.searchFor).length + splitRightMaybe.length) {
          foundEndingIndex = oneOfFoundIndexes + toArray(opts.searchFor).length + splitRightMaybe.length;
        }
      }
    }
    if (opts.leftOutside[0] !== "") {
      found = false;
      for (var _i4 = 0, _len3 = opts.leftOutside.length; _i4 < _len3; _i4++) {
        matched = iterateLeft(opts.leftOutside[_i4], arrSource, foundBeginningIndex, opts.i.leftOutside);
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
      for (var _i5 = 0, _len4 = opts.rightOutside.length; _i5 < _len4; _i5++) {
        matched = iterateRight(opts.rightOutside[_i5], arrSource, foundEndingIndex, opts.i.rightOutside);
        if (matched) {
          found = true;
        }
      }
      if (!found) {
        continue;
      }
    }
    if (opts.leftOutsideNot[0] !== "") {
      for (var _i6 = 0, _len5 = opts.leftOutsideNot.length; _i6 < _len5; _i6++) {
        matched = iterateLeft(opts.leftOutsideNot[_i6], arrSource, foundBeginningIndex, opts.i.leftOutsideNot);
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
      for (var _i7 = 0, _len6 = opts.rightOutsideNot.length; _i7 < _len6; _i7++) {
        matched = iterateRight(opts.rightOutsideNot[_i7], arrSource, foundEndingIndex, opts.i.rightOutsideNot);
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
    replacementRecipe.forEach(function (elem, i) {
      if (replacementRecipe[i + 1] !== undefined && replacementRecipe[i][1] > replacementRecipe[i + 1][0]) {
        replacementRecipe[i + 1][0] = replacementRecipe[i][1];
      }
    });
    replacementRecipe.forEach(function (elem, i) {
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
  replacementRecipe.forEach(function (elem, i) {
    result += replacement.join("");
    if (replacementRecipe[i + 1] !== undefined) {
      result += arrSource.slice(replacementRecipe[i][1], replacementRecipe[i + 1][0]).join("");
    } else {
      result += arrSource.slice(replacementRecipe[i][1]).join("");
    }
  });
  return result;
}

module.exports = er;
