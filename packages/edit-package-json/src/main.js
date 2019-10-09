import { left, right, chompLeft } from "string-left-right";
import apply from "ranges-apply";

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function stringifyPath(something) {
  if (isArr(something)) {
    return something.join(".");
  } else if (isStr(something)) {
    return something;
  }
  return String(something);
}
function stringifyAndEscapeValue(something) {
  console.log(
    `021 ██ stringifyAndEscapeValue() called with ${JSON.stringify(
      something,
      null,
      0
    )} (${typeof something})`
  );

  // since incoming strings will come already wrapped with legit double quotes, we don't need to escape them
  if (
    isStr(something) &&
    something.startsWith(`"`) &&
    something.endsWith(`"`)
  ) {
    return `${JSON.stringify(
      something.slice(1, something.length - 1),
      null,
      0
    )}`;
  }
  return JSON.stringify(something, null, 0);
}

function isNotEscape(str, idx) {
  if (str[idx] !== "\\") {
    // log(`045 yes, it's not excaped`);
    return true;
  }

  const temp = chompLeft(str, idx, { mode: 1 }, "\\");
  // log(
  //   `${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
  //     temp,
  //     null,
  //     4
  //   )}; ${`\u001b[${33}m${`(idx - temp) % 2`}\u001b[${39}m`} = ${(idx - temp) %
  //     2}`
  // );
  if (isNum(temp) && (idx - temp) % 2 !== 0) {
    // log(`059 yes, it's not excaped`);
    return true;
  }
  // log(`062 no, it's excaped!`);
  return false;
}

function main({ str, path, valToInsert, mode }) {
  let i;
  function log(something) {
    // if (i > 80 && str[i] && str[i].trim().length) {
    if (str[i] && str[i].trim().length) {
      console.log(something);
    }
  }
  const len = str.length;
  const ranges = [];
  log(`076 main(): MODE=${mode}`);
  // bad characters
  const badChars = ["{", "}", "[", "]", ":", ","];

  let calculatedValueToInsert = valToInsert;
  // if string is passed and it's not wrapped with double quotes,
  // we must wrap it with quotes, we can't write it to JSON like that!
  if (
    isStr(valToInsert) &&
    !valToInsert.startsWith(`"`) &&
    !valToInsert.startsWith(`{`)
  ) {
    calculatedValueToInsert = `"${valToInsert}"`;
  }

  // state trackers are arrays because both can be mixed of nested elements.
  // Imagine, you caught the ending of an array. How do you know, are you within
  // a (parent) array or within a (parent) object now?
  // We are going to record starting indexes of each object or array opening,
  // then pop them upon ending. This way we'll know exactly what's the depth
  // and where we are currently.
  const withinObject = [];
  const withinArray = [];

  function currentlyWithinObject() {
    /* istanbul ignore next */
    if (!withinObject.length) {
      // if there is no depth recorded Bob's your uncle here's the answer
      return false;
    } else if (withinArray.length) {
      // if we're also within an array, it mixes up things a little bit.
      // We must now check, which starting opening was later, array's or object's
      return (
        // last object's opening is later than last array's opening
        withinObject[withinObject.length - 1] >
        withinArray[withinArray.length - 1]
      );
    }
    return true;
  }

  function currentlyWithinArray() {
    if (!withinArray.length) {
      return false;
    } else if (withinObject.length) {
      // if we're also within an object, it mixes up things a little bit.
      // We must now check, which starting opening was later, array's or object's
      return (
        // last array's opening is later than last object's opening
        withinArray[withinArray.length - 1] >
        withinObject[withinObject.length - 1]
      );
    }
    return true;
  }

  // this mode is activated to instruct that the value must be replaced,
  // no matter how deeply nested it is. It is activated once the path is matched.
  // When this is on, we stop iterating each key/value and we capture only
  // the whole value.
  let replaceThisValue = false;

  let keyStartedAt;
  let keyEndedAt;
  let valueStartedAt;
  let valueEndedAt;
  let keyName;
  let keyValue;
  let withinQuotesSince;
  function withinQuotes() {
    return isNum(withinQuotesSince);
  }

  let itsTheFirstElem = false;

  let skipUntilTheFollowingIsMet;

  function reset() {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }
  reset();

  // we keep it as array so that we can array.push/array.pop to go levels up and down
  const currentPath = [];

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
    log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // toggle withinQuotesSince
    if (str[i] === `"` && isNotEscape(str, i - 1) && keyName) {
      log(`189 toggle withinQuotesSince clause`);
      withinQuotesSince = isNum(withinQuotesSince) ? undefined : i;
      log(
        `192 SET ${`\u001b[${33}m${`withinQuotesSince`}\u001b[${39}m`} = ${withinQuotesSince}; withinQuotes = ${withinQuotes()}`
      );
    }

    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log(
            `201 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );
        } else {
          log(
            `209 ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              4
            )}`
          );
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          log(
            `218 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${currentPath.length -
              1}]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`
          );
        }
      }

      withinObject.push(i);
      log(
        `226 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
          withinObject,
          null,
          4
        )}`
      );
    }

    if (str[i] === "}" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinObject.pop();
      log(
        `237 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
          withinObject,
          null,
          4
        )}`
      );
    }

    if (
      !isNum(withinQuotesSince) &&
      str[i] === "[" &&
      str[i - 1] !== "\\" &&
      !replaceThisValue
    ) {
      withinArray.push(i);
      itsTheFirstElem = true;
      log(
        `249 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
          withinArray,
          null,
          4
        )}; ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
      );
    }

    if (str[i] === "]" && str[i - 1] !== "\\" && !replaceThisValue) {
      console.log(`263 inside sq. bracket clauses`);
      withinArray.pop();
      log(
        `260 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
          withinArray,
          null,
          4
        )}`
      );

      currentPath.pop();
      log(`269 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);

      log(`272 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();

      // if (!itsTheFirstElem && currentlyWithinObject()) {
      if (
        currentlyWithinObject() &&
        (!itsTheFirstElem || !(str[i] === "]" && str[left(str, i)] === "["))
      ) {
        // last digit with numeric index might have been popped which leaves the
        // key still in place. Imagine, we're on
        // "c": [],
        // the path was "c" and was popped, we are ready for next key. All fine.
        // But case #2, imagine we're on
        // "d": ["a", "b"],
        // the path was "d.1". When we popped above, we're still on "d", we're
        // not ready to move on to next object's key. We need to pop that "d" too:
        currentPath.pop();
        log(
          `286 POP path again, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log(
          `292 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
        );
      }
    }

    // catch comma within arrays
    if (
      currentlyWithinArray() &&
      str[i] === "," &&
      itsTheFirstElem &&
      !(valueStartedAt && !valueEndedAt) // precaution against comma within a string value
    ) {
      // that empty array will have itsTheFirstElem still on:
      // "e": [{}, ...],
      itsTheFirstElem = false;
      log(
        `308 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
      );
    }

    //
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
    if (
      !replaceThisValue &&
      !valueStartedAt &&
      str[i].trim().length &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName))
    ) {
      log(`344 catching the start of a value clauses`);
      valueStartedAt = i;
      log(
        `347 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );

      // calculate the path on arrays
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log(
            `355 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );

          itsTheFirstElem = false;
          log(
            `364 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
          );
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          log(
            `370 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${currentPath.length -
              1}]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`
          );
        }
      }
    }

    // catch the end of a value
    if (
      !replaceThisValue &&
      !withinQuotes() &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        ((str[valueStartedAt] !== `"` && !str[i].trim().length) ||
          ["}", ","].includes(str[i])))
    ) {
      log(`389 catching the end of a value clauses`);
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      log(
        `395 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}`
      );
      valueEndedAt = i;
      log(
        `399 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
      );

      // for arrays, this is the beginning of what to replace
      if (
        currentlyWithinArray() &&
        (stringifyPath(path) === currentPath.join(".") ||
          currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
      ) {
        replaceThisValue = true;
        log(
          `410 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
        );
      }
    }

    // catch the start of a key
    if (
      !replaceThisValue &&
      !currentlyWithinArray() &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyName &&
      !keyStartedAt &&
      !keyEndedAt &&
      str[i + 1]
    ) {
      keyStartedAt = i + 1;
      log(
        `428 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}`
      );
    }

    // catch the end of a key
    //
    // path-wise, object paths are calculated from the end of a key. Array paths
    // are calculated from the start of the value (there are no keys). It's from
    // the start, not from the end because it can be a big nested object, and
    // by the time we'd reach its end, we'd have new keys and values recorded.
    if (
      !replaceThisValue &&
      !currentlyWithinArray() &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyEndedAt &&
      keyStartedAt &&
      !valueStartedAt &&
      keyStartedAt < i
    ) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      log(
        `451 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt};  ${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}`
      );

      // set the path
      currentPath.push(keyName);
      log(`457 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`);

      // array cases don't come here so there are no conditionals for currentlyWithinArray()
      if (
        stringifyPath(path) === currentPath.join(".") ||
        currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
        log(
          `467 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
        );
      }
    }

    // if (
    //   !replaceThisValue &&
    //   ((valueEndedAt && i >= valueEndedAt) ||
    //   (["}", "]"].includes(str[left(str, i)]) &&
    //   ["}", "]"].includes(str[i])) ||
    //   ((str[i] === "]" && str[left(str, i)] === "[") ||
    //   (str[i] === "}" && str[left(str, i)] === "{"))) &&
    //   str[i].trim().length
    // ) {
    // catch the end of a key-value pair, also end of empty object/array
    if (
      !replaceThisValue &&
      ((valueEndedAt && i >= valueEndedAt) ||
        (["}", "]"].includes(str[left(str, i)]) &&
          ["}", "]"].includes(str[i])) ||
        (str[i] === "}" && str[left(str, i)] === "{")) &&
      str[i].trim().length
    ) {
      log(
        `491 ${`\u001b[${36}m${`██`}\u001b[${39}m`} catch the end of a key-value pair clauses`
      );
      if (str[i] === ",") {
        log(`494 comma caught`);

        if (currentlyWithinArray()) {
          // currentPath[currentPath.length - 1] =
          //   currentPath[currentPath.length - 1] + 1;
          // log(
          //   `500 BUMP index of last path digit, now = ${JSON.stringify(
          //     currentPath,
          //     null,
          //     4
          //   )}`
          // );
        } else {
          currentPath.pop();
          log(`509 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);
        }

        log(`513 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();
      } else if (str[i] === "}") {
        log(`516 closing curlie caught`);

        if (valueEndedAt) {
          log(`519 POP()`);
          currentPath.pop();
        }

        log(
          `524 currently, currentlyWithinObject(): ${currentlyWithinObject()}`
        );
        log(`527 currently, currentlyWithinArray(): ${currentlyWithinArray()}`);

        if (!currentlyWithinArray()) {
          log(`531 POP()`);
          currentPath.pop();
        }

        // also reset but don't touch the path - rabbit hole goes deeper
        log(`536 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();

        log(
          `540 POP path twice, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
    }

    // catch plain object as a value
    if (
      !replaceThisValue &&
      str[i] === "{" &&
      isStr(keyName) &&
      !valueStartedAt &&
      !keyValue
    ) {
      // also reset but don't touch the path - rabbit hole goes deeper
      log(`554 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();
    }

    // catch the start of the value when replaceThisValue is on
    if (
      str[i].trim().length &&
      replaceThisValue &&
      !valueStartedAt &&
      i > keyEndedAt &&
      ![":"].includes(str[i])
    ) {
      valueStartedAt = i;
      log(
        `568 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );
    }

    // The "skipUntilTheFollowingIsMet".
    //
    // Calculate going levels deep - curlies within quotes within brackets etc.
    // idea is, once we stumble upon opening bracket/curlie or first double quote,
    // no matter what follows, at first we march forward until we meet the first
    // closing counterpart. Then we continue seeking what we came.
    if (
      skipUntilTheFollowingIsMet &&
      str[i] === skipUntilTheFollowingIsMet &&
      isNotEscape(str, i - 1)
    ) {
      skipUntilTheFollowingIsMet = undefined;
      log(
        `585 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} skipUntilTheFollowingIsMet = ${skipUntilTheFollowingIsMet}`
      );
    } else if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      !currentlyWithinArray() &&
      valueStartedAt
    ) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "}";
        log(
          `596 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${skipUntilTheFollowingIsMet}`
        );
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "]";
        log(
          `601 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${skipUntilTheFollowingIsMet}`
        );
      } else if (str[i] === `"` && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = `"`;
        log(
          `606 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${skipUntilTheFollowingIsMet}`
        );
      }
    }

    // catch the end of the value when replaceThisValue is on
    if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      valueStartedAt &&
      i > valueStartedAt
    ) {
      log(`618 within catching the end clauses`);

      if (
        (str[valueStartedAt] === "[" && str[i] === "]") ||
        (str[valueStartedAt] === "{" && str[i] === "}") ||
        (str[valueStartedAt] === `"` && str[i] === `"`) ||
        (str[valueStartedAt].trim().length &&
          (!str[i].trim().length ||
            (badChars.includes(str[i]) && isNotEscape(str, i - 1)))) // cover numeric, bool, null etc, without quotes
      ) {
        log(
          `629 currently ${`\u001b[${33}m${`str[valueStartedAt=${valueStartedAt}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[valueStartedAt],
            null,
            4
          )}`
        );
        if (mode === "set") {
          // 1. if set()
          log(`637 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
          return `${str.slice(0, valueStartedAt)}${stringifyAndEscapeValue(
            calculatedValueToInsert
          )}${str.slice(i + (str[i].trim().length ? 1 : 0))}`;
        } else if (mode === "del") {
          // 1. if del()
          log(`643 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

          log(
            `646 ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              keyStartedAt,
              null,
              4
            )}; val = ${(currentlyWithinArray()
              ? valueStartedAt
              : keyStartedAt) - 1}`
          );
          let startingPoint =
            left(
              str,
              (currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1
            ) + 1;
          log(
            `660 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} initial ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${startingPoint}`
          );
          let endingPoint = i + (str[i].trim().length ? 1 : 0);
          if (
            str[startingPoint - 1] === "," &&
            ["}", "]"].includes(str[right(str, endingPoint - 1)])
          ) {
            startingPoint--;
            log(
              `669 SET ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${startingPoint}`
            );
          }
          if (str[endingPoint] === ",") {
            endingPoint++;
            log(
              `675 SET ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${endingPoint}`
            );
          }
          log(
            `679 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              startingPoint,
              null,
              4
            )}; ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              endingPoint,
              null,
              4
            )};`
          );

          ranges.push([startingPoint, endingPoint]);
          log(
            `692 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
          log(`698 then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
      }
      // 2. replace non-quoted values
    }

    //
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

    log(
      `${`\u001b[${withinQuotesSince ? 32 : 31}m${`withinQuotesSince${
        isNum(withinQuotesSince) ? `=${withinQuotesSince}` : ""
      }`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinObject() ? 32 : 31
      }m${`currentlyWithinObject()`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinArray() ? 32 : 31
      }m${`currentlyWithinArray()`}\u001b[${39}m`}; ${`\u001b[${
        replaceThisValue ? 32 : 31
      }m${`replaceThisValue`}\u001b[${39}m`}; ${`\u001b[${
        itsTheFirstElem ? 32 : 31
      }m${`itsTheFirstElem`}\u001b[${39}m`}; ${`\u001b[${
        skipUntilTheFollowingIsMet ? 32 : 31
      }m${`skipUntilTheFollowingIsMet${
        skipUntilTheFollowingIsMet ? `: ${skipUntilTheFollowingIsMet}` : ""
      }`}\u001b[${39}m`}`
    );

    log(`current path: ${currentPath.join(".")}`);
    log(
      `${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}; ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}; ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}; ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt}; ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}; ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
    );
    log(
      `${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
        withinArray,
        null,
        0
      )}; ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
        withinObject,
        null,
        0
      )};`
    );
  }
  log(`\n\u001b[${36}m${`=============================== FIN.`}\u001b[${39}m`);

  log(`763 RETURN applied ${JSON.stringify(apply(str, ranges), null, 4)}`);
  return apply(str, ranges);
}

function set(str, path, valToInsert) {
  console.log(`767 set()`);
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json/set(): [THROW_ID_01] first input argument must be a non-empty string. It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  return main({ str, path, valToInsert, mode: "set" });
}

function del(str, path) {
  console.log(`781 del()`);
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json/del(): [THROW_ID_02] first input argument must be a non-empty string. It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  // absence of what to insert means delete
  return main({ str, path, mode: "del" });
}

export { set, del };
