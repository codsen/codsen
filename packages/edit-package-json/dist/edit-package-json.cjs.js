/**
 * edit-package-json
 * Edit package.json without parsing, as string, to keep the formatting intact
 * Version: 0.3.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/edit-package-json/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stringLeftRight = require('string-left-right');
var rangesApply = require('ranges-apply');

var version = "0.3.3";

var version$1 = version;

function isStr(something) {
  return typeof something === "string";
}

function stringifyPath(something) {
  if (Array.isArray(something)) {
    return something.join(".");
  }

  if (isStr(something)) {
    return something;
  }

  return String(something);
}

function stringifyAndEscapeValue(something) { // since incoming strings will come already wrapped with legit double quotes, we don't need to escape them

  if (isStr(something) && something.startsWith("\"") && something.endsWith("\"")) {
    return "" + JSON.stringify(something.slice(1, something.length - 1), null, 0);
  }

  return JSON.stringify(something, null, 0);
}
/* istanbul ignore next */


function isNotEscape(str, idx) {
  if (str[idx] !== "\\") {
    // log(`045 yes, it's not excaped`);
    return true;
  }

  var temp = stringLeftRight.chompLeft(str, idx, {
    mode: 1
  }, "\\"); // log(
  //   `${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
  //     temp,
  //     null,
  //     4
  //   )}; ${`\u001b[${33}m${`(idx - temp) % 2`}\u001b[${39}m`} = ${(idx - temp) %
  //     2}`
  // );

  if (typeof temp === "number" && (idx - temp) % 2 !== 0) {
    // log(`059 yes, it's not excaped`);
    return true;
  } // log(`062 no, it's excaped!`);


  return false;
}

function main(_ref) {
  var str = _ref.str,
      path = _ref.path,
      valToInsert = _ref.valToInsert,
      mode = _ref.mode;
  var i = 0;

  function log(something) {
    // if (i > 80 && str[i] && str[i].trim()) {
    // if (str[i] && str[i].trim()) {
    if (str[i] !== " ") ;
  }

  var len = str.length;
  var ranges = [];
  log(); // bad characters

  var badChars = ["{", "}", "[", "]", ":", ","];
  var calculatedValueToInsert = valToInsert; // if string is passed and it's not wrapped with double quotes,
  // we must wrap it with quotes, we can't write it to JSON like that!

  if (isStr(valToInsert) && !valToInsert.startsWith("\"") && !valToInsert.startsWith("{")) {
    calculatedValueToInsert = "\"" + valToInsert + "\"";
  } // state trackers are arrays because both can be mixed of nested elements.
  // Imagine, you caught the ending of an array. How do you know, are you within
  // a (parent) array or within a (parent) object now?
  // We are going to record starting indexes of each object or array opening,
  // then pop them upon ending. This way we'll know exactly what's the depth
  // and where we are currently.


  var withinObjectIndexes = [];
  var withinArrayIndexes = [];
  var currentlyWithinObject = false;
  var currentlyWithinArray = false; // this mode is activated to instruct that the value must be replaced,
  // no matter how deeply nested it is. It is activated once the path is matched.
  // When this is on, we stop iterating each key/value and we capture only
  // the whole value.

  var replaceThisValue = false;
  var keyStartedAt = null;
  var keyEndedAt = null;
  var valueStartedAt = null;
  var valueEndedAt = null;
  var keyName = null;
  var keyValue = null;
  var withinQuotesSince;

  var itsTheFirstElem = false;
  var skipUntilTheFollowingIsMet = [];

  function reset() {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }

  reset(); // it's object-path notation - arrays are joined with dots too -
  // "arr.0.el.1.val" - instead of - "arr[0].el[1].val"
  // we keep it as array so that we can array.push/array.pop to go levels up and down

  var currentPath = [];

  for (i = 0; i < len; i++) {
    //
    //
    //
    //
    //                    TOP
    //
    //
    //
    //
    // Logging:
    // ███████████████████████████████████████
    log("\n\x1B[" + 36 + "m" + "===============================" + "\x1B[" + 39 + "m \x1B[" + 35 + "m" + ("str[ " + i + " ] = " + (str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 0))) + "\x1B[" + 39 + "m \x1B[" + 36 + "m" + "===============================" + "\x1B[" + 39 + "m\n"); // "within X" stage toggles
    // openings are easy:

    if (typeof withinQuotesSince !== "number" && str[i - 1] === "[") {
      currentlyWithinArray = true;

      if (str[i] !== "]") {
        currentlyWithinObject = false;
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i - 1] === "{") {
      currentlyWithinObject = true;

      if (str[i] !== "}") {
        currentlyWithinArray = false;
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "{" && isNotEscape(str, i - 1) && !replaceThisValue) {

      if (currentlyWithinArray) {
        // we can't push here first zero because opening bracket pushes the first
        // zero in path - we only bump for second element onwards -
        // that's needed to support empty arrays - if we waited for some value
        // to be inside in order to bump the path, empty array inside an array
        //  would never get correct path and thus deleted/set.
        //
        if (!itsTheFirstElem) {
          log("198 " + ("\x1B[" + 33 + "m" + "currentPath" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentPath, null, 4));
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
          log();
        }
      }

      withinObjectIndexes.push(i);
      log("215 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "withinObjectIndexes" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(withinObjectIndexes, null, 4));
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "}" && isNotEscape(str, i - 1) && !replaceThisValue) {
      withinObjectIndexes.pop();
      log("231 " + ("\x1B[" + 31 + "m" + "POP" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "withinObjectIndexes" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(withinObjectIndexes, null, 4));
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "]" && isNotEscape(str, i - 1) && !replaceThisValue) {
      withinArrayIndexes.pop();
      log("248 " + ("\x1B[" + 32 + "m" + "POP" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "withinArrayIndexes" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(withinArrayIndexes, null, 4));
      currentPath.pop();
      log("256 POP path, now = " + JSON.stringify(currentPath, null, 4));
      log();
      reset();

      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log();
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "]") {

      if (!withinArrayIndexes.length) {
        currentlyWithinArray = false;

        if (withinObjectIndexes.length && !currentlyWithinObject) {
          currentlyWithinObject = true;
        }
      } else if (withinArrayIndexes.length && (!withinObjectIndexes.length || withinArrayIndexes[withinArrayIndexes.length - 1] > withinObjectIndexes[withinObjectIndexes.length - 1])) {
        currentlyWithinArray = true;
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "}") {
      if (!withinObjectIndexes.length) {
        currentlyWithinObject = false;
      } else if (!withinArrayIndexes.length || withinObjectIndexes[withinObjectIndexes.length - 1] > withinArrayIndexes[withinArrayIndexes.length - 1]) {
        currentlyWithinObject = true;
      }
    } // for arrays, this is the beginning of what to replace

    if (currentlyWithinArray && stringifyPath(path) === currentPath.join(".") && !replaceThisValue && str[i].trim() // (stringifyPath(path) === currentPath.join(".") ||
    //   currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
    ) {
        replaceThisValue = true;
        log();
        valueStartedAt = i;
        log();
      }

    if (typeof withinQuotesSince !== "number" && str[i] === "[" && isNotEscape(str, i - 1) && !replaceThisValue) {
      withinArrayIndexes.push(i);
      itsTheFirstElem = true;
      log("348 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "withinArrayIndexes" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(withinArrayIndexes, null, 4) + "; " + ("\x1B[" + 33 + "m" + "itsTheFirstElem" + "\x1B[" + 39 + "m") + " = " + itsTheFirstElem); // if (left(str, i) !== null) {
      // console.log(`356 it's not root-level array, so push zero into path`);

      currentPath.push(0);
      log("359 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " zero to path, now = " + JSON.stringify(currentPath, null, 0)); // }
    } // catch comma within arrays


    if (currentlyWithinArray && str[i] === "," && itsTheFirstElem && !(typeof valueStartedAt === "number" && valueEndedAt === null) // precaution against comma within a string value
    ) {
        // that empty array will have itsTheFirstElem still on:
        // "e": [{}, ...],
        itsTheFirstElem = false;
        log();
      } //
    //
    //
    //
    //
    //
    //
    //
    //             MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //
    // catch the start of a value
    // in arrays, there are no keys, only values
    //
    // path-wise, object paths are calculated from the end of a key. Array paths
    // are calculated from the start of the value (there are no keys). It's from
    // the start, not from the end because it can be a big nested object, and
    // by the time we'd reach its end, we'd have new keys and values recorded.


    if (!replaceThisValue && valueStartedAt === null && str[i].trim() && !badChars.includes(str[i]) && (currentlyWithinArray || !currentlyWithinArray && keyName !== null)) {
      log();
      valueStartedAt = i;
      log(); // calculate the path on arrays

      if (currentlyWithinArray) {
        if (itsTheFirstElem) {
          itsTheFirstElem = false;
          log();
        } else if (typeof currentPath[currentPath.length - 1] === "number") {
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
          log();
        }
      }
    } // catch the end of a value


    if (!replaceThisValue && typeof withinQuotesSince !== "number" && (currentlyWithinArray || !currentlyWithinArray && keyName !== null) && typeof valueStartedAt === "number" && valueStartedAt < i && valueEndedAt === null && (str[valueStartedAt] === "\"" && str[i] === "\"" && str[i - 1] !== "\\" || str[valueStartedAt] !== "\"" && !str[i].trim() || ["}", ","].includes(str[i]))) {
      log();
      keyValue = str.slice(valueStartedAt, str[valueStartedAt] === "\"" ? i + 1 : i);
      log();
      valueEndedAt = i;
      log();
    } // catch the start of a key


    if (!replaceThisValue && !currentlyWithinArray && str[i] === "\"" && str[i - 1] !== "\\" && keyName === null && keyStartedAt === null && keyEndedAt === null && str[i + 1]) {
      keyStartedAt = i + 1;
      log();
    } // catch the end of a key
    //
    // path-wise, object paths are calculated from the end of a key. Array paths
    // are calculated from the start of the value (there are no keys). It's from
    // the start, not from the end because it can be a big nested object, and
    // by the time we'd reach its end, we'd have new keys and values recorded.


    if (!replaceThisValue && !currentlyWithinArray && str[i] === "\"" && str[i - 1] !== "\\" && keyEndedAt === null && typeof keyStartedAt === "number" && valueStartedAt === null && keyStartedAt < i) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      log(); // set the path

      currentPath.push(keyName);
      log("506 PUSH to path, now = " + JSON.stringify(currentPath, null, 4)); // array cases don't come here so there are no conditionals for currentlyWithinArray

      if (stringifyPath(path) === currentPath.join(".") // ||
      // currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
          replaceThisValue = true;
          log();
        }
    }

    if (!replaceThisValue && typeof withinQuotesSince !== "number" && str[i] === "," && currentlyWithinObject) {
      currentPath.pop();
      log("535 POP(), now " + ("\x1B[" + 33 + "m" + "currentPath" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentPath, null, 0));
    }

    if (!replaceThisValue && (typeof valueEndedAt === "number" && i >= valueEndedAt || ["}", "]"].includes(str[stringLeftRight.left(str, i)]) && ["}", "]"].includes(str[i]) || str[i] === "}" && str[stringLeftRight.left(str, i)] === "{") && str[i].trim()) {
      log();

      if (str[i] === "," && !["}", "]"].includes(str[stringLeftRight.right(str, i)])) {
        log();
        reset();
      } else if (str[i] === "}") {
        log();

        if (valueEndedAt || str[stringLeftRight.left(str, i)] !== "{") {
          currentPath.pop();
          log("569 POP(), now " + ("\x1B[" + 33 + "m" + "currentPath" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentPath, null, 0));
        }

        log();
        log();

        if (withinArrayIndexes.length && withinObjectIndexes.length && withinArrayIndexes[withinArrayIndexes.length - 1] > withinObjectIndexes[withinObjectIndexes.length - 1]) {
          currentlyWithinObject = false;
          currentlyWithinArray = true;
        } // also reset but don't touch the path - rabbit hole goes deeper


        log();
        reset();
      }
    } // catch plain object as a value


    if (!replaceThisValue && str[i] === "{" && isStr(keyName) && valueStartedAt === null && keyValue === null) {
      // also reset but don't touch the path - rabbit hole goes deeper
      log();
      reset();
    } // catch the start of the value when replaceThisValue is on


    if (str[i].trim() && replaceThisValue && valueStartedAt === null && typeof keyEndedAt === "number" && i > keyEndedAt && ![":"].includes(str[i])) {
      valueStartedAt = i;
      log();
    } // enable withinQuotesSince


    if (str[i] === "\"" && isNotEscape(str, i - 1) && (typeof keyStartedAt === "number" && keyEndedAt === null || typeof valueStartedAt === "number" && valueEndedAt === null) && typeof withinQuotesSince !== "number") {
      withinQuotesSince = i;
      log();
    } // The "skipUntilTheFollowingIsMet".
    //
    // Calculate going levels deep - curlies within quotes within brackets etc.
    // idea is, once we stumble upon opening bracket/curlie or first double quote,
    // no matter what follows, at first we march forward until we meet the first
    // closing counterpart. Then we continue seeking what we came.


    if (skipUntilTheFollowingIsMet.length && str[i] === skipUntilTheFollowingIsMet[skipUntilTheFollowingIsMet.length - 1] && isNotEscape(str, i - 1)) {
      skipUntilTheFollowingIsMet.pop();
      log("677 " + ("\x1B[" + 32 + "m" + "POP" + "\x1B[" + 39 + "m") + " skipUntilTheFollowingIsMet = " + JSON.stringify(skipUntilTheFollowingIsMet, null, 4));
    } else if ((typeof withinQuotesSince !== "number" || withinQuotesSince === i) && replaceThisValue && !currentlyWithinArray && typeof valueStartedAt === "number") {

      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push("}");
        log("695 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "skipUntilTheFollowingIsMet" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(skipUntilTheFollowingIsMet, null, 4));
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push("]");
        log("705 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "skipUntilTheFollowingIsMet" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(skipUntilTheFollowingIsMet, null, 4));
      } else if (str[i] === "\"" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push("\"");
        log("715 " + ("\x1B[" + 32 + "m" + "PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "skipUntilTheFollowingIsMet" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(skipUntilTheFollowingIsMet, null, 4));
      }
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //              BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //
    // disable withinQuotesSince


    if (str[i] === "\"" && isNotEscape(str, i - 1) && typeof withinQuotesSince === "number" && withinQuotesSince !== i) {
      withinQuotesSince = undefined;
      log();
    } // catch the end of the value when replaceThisValue is on


    if (replaceThisValue && Array.isArray(skipUntilTheFollowingIsMet) && !skipUntilTheFollowingIsMet.length && typeof valueStartedAt === "number" && i > valueStartedAt) {
      log();

      if (typeof withinQuotesSince !== "number" && (str[valueStartedAt] === "[" && str[i] === "]" || str[valueStartedAt] === "{" && str[i] === "}" || str[valueStartedAt] === "\"" && str[i] === "\"" || !["[", "{", "\""].includes(str[valueStartedAt]) && str[valueStartedAt].trim() && (!str[i].trim() || badChars.includes(str[i]) && isNotEscape(str, i - 1))) // cover numeric, bool, null etc, without quotes
      ) {
          log("780 INSIDE CATCH-END CLAUSES currently " + ("\x1B[" + 33 + "m" + ("str[valueStartedAt=" + valueStartedAt + "]") + "\x1B[" + 39 + "m") + " = " + JSON.stringify(str[valueStartedAt], null, 4));

          if (mode === "set") {
            // 1. if set()
            log();
            var extraLineBreak = "";

            if (str.slice(valueStartedAt, i + (str[i].trim() ? 1 : 0)).includes("\n") && str[i + (str[i].trim() ? 1 : 0)] !== "\n") {
              extraLineBreak = "\n";
            }

            var endingPartsBeginning = i + (str[i].trim() ? 1 : 0);

            if (currentlyWithinArray && !["\"", "[", "{"].includes(str[valueStartedAt]) && str[stringLeftRight.right(str, endingPartsBeginning - 1)] !== "]" || str[endingPartsBeginning - 1] === "," && str[valueStartedAt - 1] !== "\"") {
              endingPartsBeginning -= 1;
            }

            if (currentlyWithinArray && str[valueStartedAt - 1] === "\"") {
              valueStartedAt = valueStartedAt - 1;
            }
            return "" + str.slice(0, valueStartedAt) + stringifyAndEscapeValue(calculatedValueToInsert) + extraLineBreak + str.slice(endingPartsBeginning);
          }

          if (mode === "del") {
            // 1. if del()
            log();
            log("851 " + ("\x1B[" + 33 + "m" + "keyStartedAt" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(keyStartedAt, null, 4) + "; val = " + ((currentlyWithinArray ? valueStartedAt : keyStartedAt) - 1));
            var startingPoint = stringLeftRight.left(str, (currentlyWithinArray ? valueStartedAt : keyStartedAt) - 1);

            if (typeof startingPoint === "number") {
              startingPoint++;
            }

            log();
            var endingPoint = i + (str[i].trim() ? 1 : 0);

            if (typeof startingPoint === "number" && str[startingPoint - 1] === "," && ["}", "]"].includes(str[stringLeftRight.right(str, endingPoint - 1)])) {
              startingPoint -= 1;
              log();
            }

            if (str[endingPoint] === ",") {
              endingPoint += 1;
              log();
            }

            log("883 " + ("\x1B[" + 33 + "m" + "startingPoint" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(startingPoint, null, 4) + "; " + ("\x1B[" + 33 + "m" + "endingPoint" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(endingPoint, null, 4) + ";");
            ranges.push([startingPoint, endingPoint]);
            log("896 " + ("\x1B[" + 32 + "m" + "FINAL PUSH" + "\x1B[" + 39 + "m") + " " + ("\x1B[" + 33 + "m" + "ranges" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(ranges, null, 4));
            log();
            break;
          }
        } // 2. replace non-quoted values

    }

    log("\x1B[" + (withinQuotesSince ? 32 : 31) + "m" + ("withinQuotesSince" + (typeof withinQuotesSince === "number" ? "=" + withinQuotesSince : "")) + "\x1B[" + 39 + "m" + "; " + ("\x1B[" + (currentlyWithinObject ? 32 : 31) + "m" + "currentlyWithinObject" + "\x1B[" + 39 + "m") + "; " + ("\x1B[" + (currentlyWithinArray ? 32 : 31) + "m" + "currentlyWithinArray" + "\x1B[" + 39 + "m") + "; " + ("\x1B[" + (replaceThisValue ? 32 : 31) + "m" + "replaceThisValue" + "\x1B[" + 39 + "m") + "; " + ("\x1B[" + (itsTheFirstElem ? 32 : 31) + "m" + "itsTheFirstElem" + "\x1B[" + 39 + "m") + "; " + ("\x1B[" + (skipUntilTheFollowingIsMet.length ? 32 : 31) + "m" + ("skipUntilTheFollowingIsMet" + (skipUntilTheFollowingIsMet ? ": " + JSON.stringify(skipUntilTheFollowingIsMet, null, 0) : "")) + "\x1B[" + 39 + "m"));
    log("current path: " + JSON.stringify(currentPath.join("."), null, 0));
    log();
    log("\x1B[" + 33 + "m" + "withinArrayIndexes" + "\x1B[" + 39 + "m" + " = " + JSON.stringify(withinArrayIndexes, null, 0) + "; " + ("\x1B[" + 33 + "m" + "withinObjectIndexes" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(withinObjectIndexes, null, 0) + ";");
  }

  log();
  log("947 RETURN applied " + JSON.stringify(rangesApply.rApply(str, ranges), null, 4));
  return rangesApply.rApply(str, ranges);
}

function set(str, path, valToInsert) {

  if (!isStr(str) || !str.length) {
    throw new Error("edit-package-json/set(): [THROW_ID_01] first input argument must be a non-empty string. It was given as " + JSON.stringify(str, null, 4) + " (type " + typeof str + ")");
  }

  return main({
    str: str,
    path: path,
    valToInsert: valToInsert,
    mode: "set"
  });
}

function del(str, path) {

  if (!isStr(str) || !str.length) {
    throw new Error("edit-package-json/del(): [THROW_ID_02] first input argument must be a non-empty string. It was given as " + JSON.stringify(str, null, 4) + " (type " + typeof str + ")");
  } // absence of what to insert means delete


  return main({
    str: str,
    path: path,
    mode: "del"
  });
}

exports.del = del;
exports.set = set;
exports.version = version$1;
