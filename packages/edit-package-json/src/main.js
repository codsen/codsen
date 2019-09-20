import { left, right } from "string-left-right";
import apply from "ranges-apply";

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function stringifyPath(something) {
  if (isArr(something)) {
    return something.join(".");
  } else if (isStr(something)) {
    return something;
  }
  return String(something);
}

function isNotEscape(str, idx) {
  return str[idx] !== "\\" || str[idx - 2] === "\\";
}

function main({ str, path, valToInsert, mode }) {
  const ranges = [];
  console.log(`023 main(): MODE=${mode}`);
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

  let itsTheFirstElem = false;

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

  const len = str.length;
  for (let i = 0; i < len; i++) {
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
    console.log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          console.log(
            `133 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          console.log(
            `143 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${currentPath.length -
              1}]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`
          );
        }
      }

      withinObject.push(i);
      console.log(
        `151 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${withinObject}`
      );
    }

    if (str[i] === "}" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinObject.pop();
      console.log(
        `158 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${withinObject}`
      );
    }

    if (str[i] === "[" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.push(i);
      itsTheFirstElem = true;
      console.log(
        `166 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${withinArray}; ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
      );
    }

    if (str[i] === "]" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.pop();
      console.log(
        `173 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${withinArray}`
      );

      currentPath.pop();
      console.log(
        `178 POP path, now = ${JSON.stringify(currentPath, null, 4)}`
      );

      console.log(`181 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();

      if (!itsTheFirstElem && currentlyWithinObject()) {
        // last digit with numeric index might have been popped which leaves the
        // key still in place. Imagine, we're on
        // "c": [],
        // the path was "c" and was popped, we are ready for next key. All fine.
        // But case #2, imagine we're on
        // "d": ["a", "b"],
        // the path was "d.1". When we popped above, we're still on "d", we're
        // not ready to move on to next object's key. We need to pop that "d" too:
        currentPath.pop();
        console.log(
          `195 POP path again, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        console.log(
          `201 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
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
      console.log(
        `217 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
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
      valueStartedAt = i;
      console.log(
        `255 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );

      // calculate the path on arrays
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          console.log(
            `263 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );

          itsTheFirstElem = false;
          console.log(
            `272 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
          );
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          console.log(
            `278 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${currentPath.length -
              1}]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`
          );
        }
      }
    }

    // catch the end of a value
    if (
      !replaceThisValue &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        ((str[valueStartedAt] !== `"` && !str[i].trim().length) ||
          ["}", ","].includes(str[i])))
    ) {
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      console.log(
        `301 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}`
      );
      valueEndedAt = i;
      console.log(
        `305 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
      );

      // for arrays, this is the beginning of what to replace
      if (
        currentlyWithinArray() &&
        (stringifyPath(path) === currentPath.join(".") ||
          currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
      ) {
        replaceThisValue = true;
        console.log(
          `316 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
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
      console.log(
        `334 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}`
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
      console.log(
        `357 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt};  ${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}`
      );

      // set the path
      currentPath.push(keyName);
      console.log(
        `363 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`
      );

      // array cases don't come here so there are no conditionals for currentlyWithinArray()
      if (
        stringifyPath(path) === currentPath.join(".") ||
        currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
        console.log(
          `373 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
        );
      }
    }

    // catch the end of a key-value pair
    if (
      !replaceThisValue &&
      valueEndedAt &&
      i >= valueEndedAt &&
      str[i].trim().length
    ) {
      console.log(`385 ${`\u001b[${36}m${`██`}\u001b[${39}m`}`);
      if (str[i] === ",") {
        console.log(`387 comma caught`);

        if (currentlyWithinArray()) {
          // currentPath[currentPath.length - 1] =
          //   currentPath[currentPath.length - 1] + 1;
          // console.log(
          //   `393 BUMP index of last path digit, now = ${JSON.stringify(
          //     currentPath,
          //     null,
          //     4
          //   )}`
          // );
        } else {
          currentPath.pop();
          console.log(
            `402 POP path, now = ${JSON.stringify(currentPath, null, 4)}`
          );
        }

        console.log(`406 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();
      } else if (str[i] === "}") {
        console.log(`409 closing curlie caught`);

        // also reset but don't touch the path - rabbit hole goes deeper
        console.log(`412 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();

        currentPath.pop();
        currentPath.pop();

        console.log(
          `419 POP path twice, now = ${JSON.stringify(currentPath, null, 4)}`
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
      console.log(`433 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
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
      console.log(
        `447 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );
    }

    // catch the end of the value when replaceThisValue is on
    if (replaceThisValue && valueStartedAt && i > valueStartedAt) {
      console.log(`453 within catching the end clauses`);

      if (
        (str[valueStartedAt] === "[" && str[i] === "]") ||
        (str[valueStartedAt] === "{" && str[i] === "}") ||
        (str[valueStartedAt] === `"` && str[i] === `"`) ||
        (str[valueStartedAt].trim().length &&
          (!str[i].trim().length ||
            (badChars.includes(str[i]) && isNotEscape(str, i - 1))))
      ) {
        if (mode === "set") {
          // 1. if set()
          console.log(`465 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
          return `${str.slice(
            0,
            valueStartedAt
          )}${calculatedValueToInsert}${str.slice(
            i + (str[i].trim().length ? 1 : 0)
          )}`;
        } else if (mode === "del") {
          // 1. if del()
          console.log(`474 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
          let startingPoint = left(str, keyStartedAt - 1) + 1;
          let endingPoint = i + (str[i].trim().length ? 1 : 0);
          if (
            str[startingPoint - 1] === "," &&
            str[right(str, endingPoint - 1)] === "}"
          ) {
            startingPoint--;
            console.log(
              `483 SET ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${startingPoint}`
            );
          }
          if (str[endingPoint] === ",") {
            endingPoint++;
            console.log(
              `489 SET ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${endingPoint}`
            );
          }

          ranges.push([startingPoint, endingPoint]);
          console.log(
            `495 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
          console.log(`501 then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
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

    console.log(`----------------`);
    console.log(
      `${`\u001b[${
        currentlyWithinObject() ? 32 : 31
      }m${`currentlyWithinObject()`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinArray() ? 32 : 31
      }m${`currentlyWithinArray()`}\u001b[${39}m`}; ${`\u001b[${
        replaceThisValue ? 32 : 31
      }m${`replaceThisValue`}\u001b[${39}m`}; ${`\u001b[${
        itsTheFirstElem ? 32 : 31
      }m${`itsTheFirstElem`}\u001b[${39}m`}`
    );
    console.log(`current path: ${currentPath.join(".")}`);
    console.log(
      `${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}; ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}; ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}; ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt}; ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}; ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
    );
    console.log(
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
  console.log(
    `\n\u001b[${36}m${`===============================`}\u001b[${39}m`
  );

  return apply(str, ranges);
}

function set(str, path, valToInsert) {
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
