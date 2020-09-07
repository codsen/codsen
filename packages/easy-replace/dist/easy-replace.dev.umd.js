/**
 * easy-replace
 * Replace strings with optional lookarounds, but without regexes
 * Version: 3.7.62
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/easy-replace/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.easyReplace = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * astralAwareSearch - searches for strings and returns the findings in an array
   *
   * @param  {String} whereToLook    string upon which to perform the search
   * @param  {String} whatToLookFor  string depicting what we are looking for
   * @return {Array}                 findings array, indexes of each first "letter" found
   */
  function astralAwareSearch(whereToLook, whatToLookFor, opts) {
    function existy(something) {
      return something != null;
    }

    if (typeof whereToLook !== "string" || whereToLook.length === 0 || typeof whatToLookFor !== "string" || whatToLookFor.length === 0) {
      return [];
    }

    var foundIndexArray = [];
    var arrWhereToLook = Array.from(whereToLook);
    var arrWhatToLookFor = Array.from(whatToLookFor);
    var found;

    for (var i = 0; i < arrWhereToLook.length; i++) {
      // check if current source character matches the first char of what we're looking for
      if (opts.i) {
        if (arrWhereToLook[i].toLowerCase() === arrWhatToLookFor[0].toLowerCase()) {
          found = true; // this means first character matches
          // match the rest:

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
        found = true; // this means first character matches
        // match the rest:

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
  } // ===========================

  /**
   * stringise/arrayiffy - Turns null/undefined into ''. If array, turns each elem into String.
   * all other cases, runs through String()
   *
   * @param  {whatever} incoming     can be anything
   * @return {String/Array}          string or array of strings
   */


  function stringise(incoming) {
    function existy(something) {
      return something != null;
    }

    if (!existy(incoming) || typeof incoming === "boolean") {
      return [""];
    }

    if (Array.isArray(incoming)) {
      return incoming.filter(function (el) {
        return existy(el) && typeof el !== "boolean";
      }).map(function (el) {
        return String(el);
      }).filter(function (el) {
        return el.length > 0;
      });
    }

    return [String(incoming)];
  } // ===========================


  function iterateLeft(elem, arrSource, foundBeginningIndex, i) {
    var matched = true;
    var charsArray = Array.from(elem);

    for (var i2 = 0, len = charsArray.length; i2 < len; i2++) {
      // iterate each character of particular Outside:
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
    var matched = true;
    var charsArray = Array.from(elem);

    for (var i2 = 0, len = charsArray.length; i2 < len; i2++) {
      // iterate each character of particular Outside:
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
  } //                      ____
  //       bug hammer    |    |
  //   O=================|    |
  //     bugs into ham   |____|
  //
  //                     .=O=.
  // =========================
  // M A I N   F U N C T I O N
  // =========================


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

    var opts = _objectSpread2(_objectSpread2({}, defaults), options); // enforce the peace and order:


    var source = stringise(originalSource);
    opts.leftOutsideNot = stringise(opts.leftOutsideNot);
    opts.leftOutside = stringise(opts.leftOutside);
    opts.leftMaybe = stringise(opts.leftMaybe);
    opts.searchFor = String(opts.searchFor);
    opts.rightMaybe = stringise(opts.rightMaybe);
    opts.rightOutside = stringise(opts.rightOutside);
    opts.rightOutsideNot = stringise(opts.rightOutsideNot);
    var replacement = stringise(originalReplacement);
    var arrSource = Array.from(source[0]);
    var foundBeginningIndex;
    var foundEndingIndex;
    var matched;
    var found;
    var replacementRecipe = [];
    var result = ""; //  T H E   L O O P

    var allResults = astralAwareSearch(source[0], opts.searchFor, {
      i: opts.i.searchFor
    });

    for (var resIndex = 0, resLen = allResults.length; resIndex < resLen; resIndex++) {
      var oneOfFoundIndexes = allResults[resIndex]; // oneOfFoundIndexes is the index of starting index of found
      // the principle of replacement is after finding the searchFor string,
      // the boundaries optionally expand. That's left/right Maybe's from the
      // options object. When done, the outsides are checked, first positive
      // (leftOutside, rightOutside), then negative (leftOutsideNot, rightOutsideNot).
      // That's the plan.

      foundBeginningIndex = oneOfFoundIndexes;
      foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length; //
      // ===================== leftMaybe =====================
      // commence with maybe's
      // they're not hungry, i.e. the whole Maybe must be of the left of searchFor exactly
      //

      if (opts.leftMaybe.length > 0) {
        for (var i = 0, len = opts.leftMaybe.length; i < len; i++) {
          // iterate each of the maybe's in the array:
          matched = true;
          var splitLeftMaybe = Array.from(opts.leftMaybe[i]);

          for (var i2 = 0, len2 = splitLeftMaybe.length; i2 < len2; i2++) {
            // iterate each character of particular Maybe:
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
      } // ===================== rightMaybe =====================


      if (opts.rightMaybe.length > 0) {
        for (var _i2 = 0, _len = opts.rightMaybe.length; _i2 < _len; _i2++) {
          // iterate each of the Maybe's in the array:
          matched = true;
          var splitRightMaybe = Array.from(opts.rightMaybe[_i2]);

          for (var _i3 = 0, _len2 = splitRightMaybe.length; _i3 < _len2; _i3++) {
            // iterate each character of particular Maybe:
            if (opts.i.rightMaybe) {
              if (splitRightMaybe[_i3].toLowerCase() !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + _i3].toLowerCase()) {
                matched = false;
                break;
              }
            } else if (splitRightMaybe[_i3] !== arrSource[oneOfFoundIndexes + Array.from(opts.searchFor).length + _i3]) {
              matched = false;
              break;
            }
          }

          if (matched && foundEndingIndex < oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length) {
            foundEndingIndex = oneOfFoundIndexes + Array.from(opts.searchFor).length + splitRightMaybe.length;
          }
        }
      } // ===================== leftOutside =====================


      if (opts.leftOutside[0] !== "") {
        found = false;

        for (var _i4 = 0, _len3 = opts.leftOutside.length; _i4 < _len3; _i4++) {
          // iterate each of the outsides in the array:
          matched = iterateLeft(opts.leftOutside[_i4], arrSource, foundBeginningIndex, opts.i.leftOutside);

          if (matched) {
            found = true;
          }
        }

        if (!found) {
          continue;
        }
      } // ===================== rightOutside =====================


      if (opts.rightOutside[0] !== "") {
        found = false;

        for (var _i5 = 0, _len4 = opts.rightOutside.length; _i5 < _len4; _i5++) {
          // iterate each of the outsides in the array:
          matched = iterateRight(opts.rightOutside[_i5], arrSource, foundEndingIndex, opts.i.rightOutside);

          if (matched) {
            found = true;
          }
        }

        if (!found) {
          continue;
        }
      } // ===================== leftOutsideNot =====================


      if (opts.leftOutsideNot[0] !== "") {
        for (var _i6 = 0, _len5 = opts.leftOutsideNot.length; _i6 < _len5; _i6++) {
          // iterate each of the outsides in the array:
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
      } // ===================== rightOutsideNot =====================


      if (opts.rightOutsideNot[0] !== "") {
        for (var _i7 = 0, _len6 = opts.rightOutsideNot.length; _i7 < _len6; _i7++) {
          // iterate each of the outsides in the array:
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
      } // ===================== the rest =====================


      replacementRecipe.push([foundBeginningIndex, foundEndingIndex]);
    } // =====
    // first we need to remove any overlaps in the recipe, cases like:
    // [ [0,10], [2,12] ] => [ [0,10], [10,12] ]


    if (replacementRecipe.length > 0) {
      replacementRecipe.forEach(function (elem, i) {
        // iterate through all replacement-recipe-array's elements:
        if (replacementRecipe[i + 1] !== undefined && replacementRecipe[i][1] > replacementRecipe[i + 1][0]) {
          replacementRecipe[i + 1][0] = replacementRecipe[i][1];
        }
      }); // iterate the recipe array again, cleaning up elements like [12,12]

      replacementRecipe.forEach(function (elem, i) {
        if (elem[0] === elem[1]) {
          replacementRecipe.splice(i, 1);
        }
      });
    } else {
      // there were no findings, so return source
      return source.join("");
    } //
    // iterate the recipe array and perform the replacement:
    // first, if replacements don't start with 0, attach this part onto result let:


    if (replacementRecipe.length > 0 && replacementRecipe[0][0] !== 0) {
      result += arrSource.slice(0, replacementRecipe[0][0]).join("");
    }

    replacementRecipe.forEach(function (elem, i) {
      // first position is replacement string:
      result += replacement.join("");

      if (replacementRecipe[i + 1] !== undefined) {
        // if next element exists, add content between current and next finding
        result += arrSource.slice(replacementRecipe[i][1], replacementRecipe[i + 1][0]).join("");
      } else {
        // if this is the last element in the replacement recipe array, add
        // remainder of the string after last replacement and the end:
        result += arrSource.slice(replacementRecipe[i][1]).join("");
      }
    });
    return result;
  }

  return er;

})));
