import { formatDiagnosticValue, isNum, isStr } from "codsen-utils";
import { rApply } from "ranges-apply";
import { chompLeft, left, right } from "string-left-right";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function stringifyPath(something: any): string {
  if (Array.isArray(something)) {
    return something.join(".");
  }
  if (isStr(something)) {
    return something;
  }
  return String(something);
}
function stringifyAndEscapeValue(something: any): string {
  DEV &&
    console.log(
      `██ stringifyAndEscapeValue() called with ${JSON.stringify(
        something,
        null,
        0,
      )} (${typeof something})`,
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
      0,
    )}`;
  }
  return JSON.stringify(something, null, 0);
}

/* c8 ignore next */
function isNotEscape(str: string, idx: number): boolean {
  if (str[idx] !== "\\") {
    // log(`045 yes, it's not escaped`);
    return true;
  }

  let temp = chompLeft(str, idx, { mode: 1 }, "\\");
  if (isNum(temp) && (idx - temp) % 2 !== 0) {
    // log(`059 yes, it's not escaped`);
    return true;
  }
  // log(`062 no, it's escaped!`);
  return false;
}

export interface Inputs {
  str: string;
  path: string;
  valToInsert?: string | number;
  mode: "set" | "del" | "locate";
}

/** where a value sits in the source string: [from, to) */
interface Located {
  from: number;
  to: number;
}

function main({
  str,
  path,
  valToInsert,
  mode,
}: Inputs): string | Located | null {
  let i = 0;

  function log(something: any): void {
    // if (i > 80 && str[i] && str[i].trim()) {
    // if (str[i] && str[i].trim()) {
    if (str[i] !== " ") {
      DEV && console.log(`${something}`);
    }
  }
  let len = str.length;
  let ranges = [];
  log(`077 main(): MODE=${mode}`);
  // bad characters
  let badChars = ["{", "}", "[", "]", ":", ","];

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
  let withinObjectIndexes = [];
  let withinArrayIndexes = [];

  let currentlyWithinObject = false;
  let currentlyWithinArray = false;

  // this mode is activated to instruct that the value must be replaced,
  // no matter how deeply nested it is. It is activated once the path is matched.
  // When this is on, we stop iterating each key/value and we capture only
  // the whole value.
  let replaceThisValue = false;

  let keyStartedAt: number | null = null;
  let keyEndedAt: number | null = null;
  let valueStartedAt: number | null = null;
  let valueEndedAt: number | null = null;
  let keyName: string | null = null;
  let keyValue: string | null = null;
  let withinQuotesSince: number | undefined;
  function withinQuotes(): boolean {
    return typeof withinQuotesSince === "number";
  }

  let itsTheFirstElem = false;

  let skipUntilTheFollowingIsMet = [];

  function reset(): void {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }
  reset();

  // it's object-path notation - arrays are joined with dots too -
  // "arr.0.el.1.val" - instead of - "arr[0].el[1].val"
  // we keep it as array so that we can array.push/array.pop to go levels up and down
  let currentPath: (string | number)[] = [];

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
        str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
    );

    // "within X" stage toggles

    // openings are easy:
    if (typeof withinQuotesSince !== "number" && str[i - 1] === "[") {
      currentlyWithinArray = true;
      if (str[i] !== "]") {
        currentlyWithinObject = false;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray};  ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`,
          );
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i - 1] === "{") {
      currentlyWithinObject = true;
      if (str[i] !== "}") {
        currentlyWithinArray = false;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray};  ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`,
          );
      }
    }

    if (
      typeof withinQuotesSince !== "number" &&
      str[i] === "{" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      DEV && console.log(`object's start caught`);
      if (currentlyWithinArray) {
        // we can't push here first zero because opening bracket pushes the first
        // zero in path - we only bump for second element onwards -
        // that's needed to support empty arrays - if we waited for some value
        // to be inside in order to bump the path, empty array inside an array
        //  would never get correct path and thus deleted/set.
        //
        if (!itsTheFirstElem) {
          log(
            `198 ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              4,
            )}`,
          );
          currentPath[currentPath.length - 1] =
            (currentPath[currentPath.length - 1] as number) + 1;
          log(
            `207 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${
              currentPath.length - 1
            }]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`,
          );
        }
      }

      withinObjectIndexes.push(i);
      log(
        `215 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinObjectIndexes,
          null,
          4,
        )}`,
      );
    }

    // an array element that is itself an array moves the index on, the same way
    // an element that is an object does just above. It belongs here rather than
    // with the rest of the "[" handling further down, because the path is
    // compared against in between the two, and an element addressed before its
    // index moved answers to its neighbour's path
    if (
      typeof withinQuotesSince !== "number" &&
      str[i] === "[" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue &&
      currentlyWithinArray &&
      !itsTheFirstElem
    ) {
      currentPath[currentPath.length - 1] =
        (currentPath[currentPath.length - 1] as number) + 1;
      log(
        `224 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${
          currentPath.length - 1
        }]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`,
      );
    }

    if (
      typeof withinQuotesSince !== "number" &&
      str[i] === "}" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      withinObjectIndexes.pop();
      log(
        `231 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinObjectIndexes,
          null,
          4,
        )}`,
      );
    }

    if (
      typeof withinQuotesSince !== "number" &&
      str[i] === "]" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      DEV && console.log(`inside sq. bracket clauses`);
      withinArrayIndexes.pop();
      log(
        `248 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinArrayIndexes,
          null,
          4,
        )}`,
      );

      currentPath.pop();
      log(`256 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);

      log(`258 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();

      DEV &&
        console.log(
          `FIY, currentlyWithinObject = ${currentlyWithinObject}; currentlyWithinArray = ${currentlyWithinArray}`,
        );
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log(
          `267 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`,
        );
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "]") {
      DEV && console.log();
      if (!withinArrayIndexes.length) {
        currentlyWithinArray = false;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray}`,
          );
        if (withinObjectIndexes.length && !currentlyWithinObject) {
          currentlyWithinObject = true;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} currentlyWithinObject = ${currentlyWithinObject}`,
            );
        }
      } else if (
        withinArrayIndexes.length &&
        (!withinObjectIndexes.length ||
          withinArrayIndexes[withinArrayIndexes.length - 1] >
            withinObjectIndexes[withinObjectIndexes.length - 1])
      ) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray}`,
          );
        currentlyWithinArray = true;
      }
    }

    if (typeof withinQuotesSince !== "number" && str[i] === "}") {
      if (!withinObjectIndexes.length) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`,
          );
        currentlyWithinObject = false;
      } else if (
        !withinArrayIndexes.length ||
        withinObjectIndexes[withinObjectIndexes.length - 1] >
          withinArrayIndexes[withinArrayIndexes.length - 1]
      ) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`,
          );
        currentlyWithinObject = true;
      }
    }

    // The index has to move on before the path is compared just below. The
    // value-start clauses further down used to do it, which left an element
    // that is a bare number, boolean or null answering to its neighbour's path
    // for the one character where the two disagreed - and when such an element
    // was the last one in the array, there was no later character for the
    // comparison to catch up on, so it never matched at all. Openings are left
    // out because "{" and "[" are bad characters here, and each moves the index
    // on in its own handler above
    if (
      !replaceThisValue &&
      currentlyWithinArray &&
      valueStartedAt === null &&
      str[i].trim() &&
      !badChars.includes(str[i])
    ) {
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log(
          `363 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`,
        );
      } else if (typeof currentPath[currentPath.length - 1] === "number") {
        currentPath[currentPath.length - 1] =
          (currentPath[currentPath.length - 1] as number) + 1;
        log(
          `368 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentPath[${
            currentPath.length - 1
          }]`}\u001b[${39}m`} = ${currentPath[currentPath.length - 1]}`,
        );
      }
    }

    // for arrays, this is the beginning of what to replace
    DEV && console.log(`above of beginning of what to replace in arrays`);
    if (
      currentlyWithinArray &&
      stringifyPath(path) === currentPath.join(".") &&
      !replaceThisValue &&
      str[i].trim()
      // (stringifyPath(path) === currentPath.join(".") ||
      //   currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
    ) {
      DEV && console.log(`arrays - beginning of what to replace`);
      replaceThisValue = true;
      log(
        `329 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`,
      );

      // An element that opens with a bracket is met here first, so this is
      // where its value starts. An unquoted one - a number, a boolean, null -
      // is met by the value-start clauses further down instead, which is also
      // what moves the index on, so the path only matches here one character
      // in. Overwriting the start it recorded chopped the first character off
      // every such element that got replaced
      if (valueStartedAt === null) {
        valueStartedAt = i;
      }
      log(
        `334 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`,
      );
    }

    if (
      typeof withinQuotesSince !== "number" &&
      str[i] === "[" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      DEV && console.log(`array's start caught`);
      withinArrayIndexes.push(i);
      itsTheFirstElem = true;
      log(
        `348 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinArrayIndexes,
          null,
          4,
        )}; ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`,
      );

      // if (left(str, i) !== null) {
      // DEV && console.log(`356 it's not root-level array, so push zero into path`);
      currentPath.push(0);
      log(
        `359 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
          currentPath,
          null,
          0,
        )}`,
      );
      // }
    }

    // catch comma within arrays
    if (
      currentlyWithinArray &&
      str[i] === "," &&
      itsTheFirstElem &&
      !(typeof valueStartedAt === "number" && valueEndedAt === null) // precaution against comma within a string value
    ) {
      // that empty array will have itsTheFirstElem still on:
      // "e": [{}, ...],
      itsTheFirstElem = false;
      log(
        `379 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`,
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
      valueStartedAt === null &&
      str[i].trim() &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName !== null))
    ) {
      log(`415 catching the start of a value clauses`);
      valueStartedAt = i;
      log(
        `418 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`,
      );
      // the path on arrays has already been moved on, above
    }

    // catch the end of a value
    if (
      !replaceThisValue &&
      typeof withinQuotesSince !== "number" &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName !== null)) &&
      typeof valueStartedAt === "number" &&
      valueStartedAt < i &&
      valueEndedAt === null &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        (str[valueStartedAt] !== `"` && !str[i].trim()) ||
        ["}", ","].includes(str[i]))
    ) {
      log(`451 catching the end of a value clauses`);
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i,
      );
      log(
        `457 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}`,
      );
      valueEndedAt = i;
      log(
        `461 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`,
      );
    }

    // catch the start of a key
    if (
      !replaceThisValue &&
      !currentlyWithinArray &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      keyName === null &&
      keyStartedAt === null &&
      keyEndedAt === null &&
      str[i + 1]
    ) {
      keyStartedAt = i + 1;
      log(
        `478 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}`,
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
      !currentlyWithinArray &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      keyEndedAt === null &&
      typeof keyStartedAt === "number" &&
      valueStartedAt === null &&
      keyStartedAt < i
    ) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      log(
        `501 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt};  ${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}`,
      );

      // set the path
      currentPath.push(keyName);
      log(`506 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`);

      // array cases don't come here so there are no conditionals for currentlyWithinArray
      if (
        stringifyPath(path) === currentPath.join(".") // ||
        // currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
        log(
          `515 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`,
        );
      }
    }

    if (
      !replaceThisValue &&
      typeof withinQuotesSince !== "number" &&
      str[i] === "," &&
      currentlyWithinObject
    ) {
      DEV &&
        console.log(
          `COMMA within object caught - before popping, ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
            currentPath,
            null,
            0,
          )}`,
        );
      currentPath.pop();
      log(
        `535 POP(), now ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
          currentPath,
          null,
          0,
        )}`,
      );
    }

    if (
      !replaceThisValue &&
      ((typeof valueEndedAt === "number" && i >= valueEndedAt) ||
        (["}", "]"].includes(str[left(str, i) as number]) &&
          ["}", "]"].includes(str[i])) ||
        (str[i] === "}" && str[left(str, i) as number] === "{")) &&
      str[i].trim()
    ) {
      log(
        `552 ${`\u001b[${36}m${`██`}\u001b[${39}m`} catch the end of a key-value pair clauses`,
      );
      if (
        str[i] === "," &&
        !["}", "]"].includes(str[right(str, i) as number])
      ) {
        log(`555 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();
      } else if (str[i] === "}") {
        log(`558 closing curlie caught`);
        if (valueEndedAt || str[left(str, i) as number] !== "{") {
          DEV &&
            console.log(
              `before popping, ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
                currentPath,
                null,
                0,
              )}`,
            );
          currentPath.pop();
          log(
            `569 POP(), now ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              0,
            )}`,
          );
        }

        log(`577 currently, currentlyWithinObject: ${currentlyWithinObject}`);
        log(`578 currently, currentlyWithinArray: ${currentlyWithinArray}`);

        if (
          withinArrayIndexes.length &&
          // an array that nothing else is open inside of counts too - without
          // this, closing an object element of a top-level array left us
          // thinking we were still inside that object, so the next element's
          // opening brace never bumped the index and every element past the
          // first answered to the wrong path. Same shape as the "]" handler
          // above
          (!withinObjectIndexes.length ||
            withinArrayIndexes[withinArrayIndexes.length - 1] >
              withinObjectIndexes[withinObjectIndexes.length - 1])
        ) {
          currentlyWithinObject = false;
          currentlyWithinArray = true;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}; ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray}`,
            );
        }

        // also reset but don't touch the path - rabbit hole goes deeper
        log(`616 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();
      }
    }

    // catch plain object as a value
    if (
      !replaceThisValue &&
      str[i] === "{" &&
      isStr(keyName) &&
      valueStartedAt === null &&
      keyValue === null
    ) {
      // also reset but don't touch the path - rabbit hole goes deeper
      log(`630 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();
    }

    // catch the start of the value when replaceThisValue is on
    if (
      str[i].trim() &&
      replaceThisValue &&
      valueStartedAt === null &&
      typeof keyEndedAt === "number" &&
      i > keyEndedAt &&
      ![":"].includes(str[i])
    ) {
      valueStartedAt = i;
      log(
        `644 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`,
      );
    }

    // enable withinQuotesSince
    if (
      str[i] === `"` &&
      isNotEscape(str, i - 1) &&
      ((typeof keyStartedAt === "number" && keyEndedAt === null) ||
        (typeof valueStartedAt === "number" && valueEndedAt === null)) &&
      typeof withinQuotesSince !== "number"
    ) {
      withinQuotesSince = i;
      log(
        `658 SET ${`\u001b[${33}m${`withinQuotesSince`}\u001b[${39}m`} = ${withinQuotesSince}; withinQuotes = ${withinQuotes()}`,
      );
    }

    // The "skipUntilTheFollowingIsMet".
    //
    // Calculate going levels deep - curlies within quotes within brackets etc.
    // idea is, once we stumble upon opening bracket/curlie or first double quote,
    // no matter what follows, at first we march forward until we meet the first
    // closing counterpart. Then we continue seeking what we came.
    if (
      skipUntilTheFollowingIsMet.length &&
      str[i] ===
        skipUntilTheFollowingIsMet[skipUntilTheFollowingIsMet.length - 1] &&
      isNotEscape(str, i - 1)
    ) {
      DEV && console.log(`POP clause`);
      skipUntilTheFollowingIsMet.pop();
      log(
        `677 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} skipUntilTheFollowingIsMet = ${JSON.stringify(
          skipUntilTheFollowingIsMet,
          null,
          4,
        )}`,
      );
    } else if (
      (typeof withinQuotesSince !== "number" || withinQuotesSince === i) &&
      replaceThisValue &&
      typeof valueStartedAt === "number"
    ) {
      DEV && console.log(`about to catch various opening brackets/quotes`);
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        DEV && console.log();
        skipUntilTheFollowingIsMet.push("}");
        log(
          `695 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4,
          )}`,
        );
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        DEV && console.log();
        skipUntilTheFollowingIsMet.push("]");
        log(
          `705 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4,
          )}`,
        );
      } else if (str[i] === `"` && isNotEscape(str, i - 1)) {
        DEV && console.log();
        skipUntilTheFollowingIsMet.push(`"`);
        log(
          `715 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4,
          )}`,
        );
      }
      DEV && console.log();
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

    // disable withinQuotesSince
    if (
      str[i] === `"` &&
      isNotEscape(str, i - 1) &&
      typeof withinQuotesSince === "number" &&
      withinQuotesSince !== i
    ) {
      withinQuotesSince = undefined;
      log(
        `753 RESET ${`\u001b[${33}m${`withinQuotesSince`}\u001b[${39}m`} = ${withinQuotesSince}; withinQuotes = ${withinQuotes()}`,
      );
    }

    // catch the end of the value when replaceThisValue is on
    if (
      replaceThisValue &&
      Array.isArray(skipUntilTheFollowingIsMet) &&
      !skipUntilTheFollowingIsMet.length &&
      typeof valueStartedAt === "number" &&
      i > valueStartedAt
    ) {
      log(
        `766 within catch the end of the value when replaceThisValue is on clauses`,
      );

      if (
        typeof withinQuotesSince !== "number" &&
        ((str[valueStartedAt] === "[" && str[i] === "]") ||
          (str[valueStartedAt] === "{" && str[i] === "}") ||
          (str[valueStartedAt] === `"` && str[i] === `"`) ||
          (!["[", "{", `"`].includes(str[valueStartedAt]) &&
            str[valueStartedAt].trim() &&
            (!str[i].trim() ||
              (badChars.includes(str[i]) && isNotEscape(str, i - 1))))) // cover numeric, bool, null etc, without quotes
      ) {
        log(
          `780 INSIDE CATCH-END CLAUSES currently ${`\u001b[${33}m${`str[valueStartedAt=${valueStartedAt}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[valueStartedAt],
            null,
            4,
          )}`,
        );

        if (mode === "locate") {
          // 0. if locate() - report where the value sits and leave the string
          // alone. Only bracketed and quoted values include the character we
          // stopped on; numbers, booleans and null stop on whatever follows
          // them, be that whitespace or a comma
          return {
            from: valueStartedAt,
            to: ["[", "{", `"`].includes(str[valueStartedAt]) ? i + 1 : i,
          };
        }
        if (mode === "set") {
          // 1. if set()
          log(`789 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
          let endingPartsBeginning = i + (str[i].trim() ? 1 : 0);

          // Replacing a value that spanned lines with one that does not can
          // leave whatever follows it stranded on the same line, so a line
          // break goes in to make up for it - but only when there isn't one
          // already. The comma that separates members sits before that break,
          // so it has to be stepped over, or every replacement of a multi-line
          // value that was not the last one wedged a newline in front of the
          // comma
          let extraLineBreak = "";
          if (str.slice(valueStartedAt, endingPartsBeginning).includes("\n")) {
            let y = endingPartsBeginning;
            if (str[y] === ",") {
              y += 1;
            }
            let breakAlreadyFollows = false;
            while (y < len && !str[y].trim()) {
              if (str[y] === "\n") {
                breakAlreadyFollows = true;
                break;
              }
              y += 1;
            }
            if (!breakAlreadyFollows) {
              extraLineBreak = "\n";
            }
          }
          // a number, boolean or null does not own the character that ended
          // it - counting it in swallowed the "}" or "]" closing the container
          // around it, which only showed on minified input, where no
          // whitespace separates the value from the bracket
          if (
            ![`"`, `[`, `{`].includes(str[valueStartedAt]) &&
            ["}", "]"].includes(str[i])
          ) {
            endingPartsBeginning -= 1;
          }
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`endingPartsBeginning`}\u001b[${39}m`} = ${JSON.stringify(
                endingPartsBeginning,
                null,
                4,
              )}`,
            );

          if (
            (currentlyWithinArray &&
              ![`"`, `[`, `{`].includes(str[valueStartedAt]) &&
              str[right(str, endingPartsBeginning - 1) as number] !== "]") ||
            (str[endingPartsBeginning - 1] === "," &&
              str[valueStartedAt - 1] !== `"`)
          ) {
            DEV &&
              console.log(
                `endingPartsBeginning before = ${endingPartsBeginning}`,
              );
            endingPartsBeginning -= 1;
            DEV &&
              console.log(
                `endingPartsBeginning after = ${endingPartsBeginning}`,
              );
          }

          if (currentlyWithinArray && str[valueStartedAt - 1] === `"`) {
            DEV && console.log(`valueStartedAt before = ${valueStartedAt}`);
            valueStartedAt = valueStartedAt - 1;
            DEV && console.log(`valueStartedAt after = ${valueStartedAt}`);
          }

          DEV &&
            console.log(
              `RETURNING:\n${`\u001b[${36}m${`[0, ${valueStartedAt}]`}\u001b[${39}m`}: ${JSON.stringify(
                str.slice(0, valueStartedAt),
                null,
                0,
              )}\nstringifyAndEscapeValue(calculatedValueToInsert) = ${JSON.stringify(
                stringifyAndEscapeValue(calculatedValueToInsert),
                null,
                0,
              )}\n${`\u001b[${36}m${`[${endingPartsBeginning}, ${str.length}]`}\u001b[${39}m`}: ${JSON.stringify(
                str.slice(endingPartsBeginning),
                null,
                0,
              )}`,
            );
          return `${str.slice(0, valueStartedAt)}${stringifyAndEscapeValue(
            calculatedValueToInsert,
          )}${extraLineBreak}${str.slice(endingPartsBeginning)}`;
        }
        if (mode === "del") {
          // 1. if del()
          log(`848 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

          log(
            `851 ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              keyStartedAt,
              null,
              4,
            )}; val = ${
              ((currentlyWithinArray
                ? valueStartedAt
                : keyStartedAt) as number) - 1
            }`,
          );
          // an array element is anchored at its value; only an object member
          // has a key to delete from. An element that is itself an object
          // leaves currentlyWithinArray false by the time we get here, and
          // there is no key either, so the value is the only anchor there is
          let deletingAValue = currentlyWithinArray || keyStartedAt === null;
          let deleteAnchor = (
            deletingAValue ? valueStartedAt : keyStartedAt
          ) as number;
          // Deletion starts just past whatever non-whitespace precedes the
          // member. Where to look left from differs between the two anchors:
          // keyStartedAt sits inside a key's opening quote, so the search has
          // to begin one earlier to clear it, while valueStartedAt is already
          // on the value's first character. The fallback covers the first
          // member of a top-level container, which has nothing to its left.
          let startingPoint =
            (left(str, deletingAValue ? deleteAnchor : deleteAnchor - 1) ??
              deleteAnchor - 1) + 1;
          log(
            `864 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} initial ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${startingPoint}`,
          );
          let endingPoint = i + (str[i].trim() ? 1 : 0);
          // as in the "set" branch above - a number, boolean or null does not
          // own the character that ended it, and taking it along deleted the
          // "}" or "]" that closes the container around it
          if (
            ![`"`, `[`, `{`].includes(str[valueStartedAt as number]) &&
            ["}", "]"].includes(str[i])
          ) {
            endingPoint -= 1;
          }
          if (
            typeof startingPoint === "number" &&
            str[startingPoint - 1] === "," &&
            ["}", "]"].includes(str[right(str, endingPoint - 1) as number])
          ) {
            startingPoint -= 1;
            log(
              `873 SET ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${startingPoint}`,
            );
          }
          if (str[endingPoint] === ",") {
            endingPoint += 1;
            log(
              `879 SET ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${endingPoint}`,
            );
          }
          log(
            `883 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              startingPoint,
              null,
              4,
            )}; ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              endingPoint,
              null,
              4,
            )};`,
          );

          ranges.push([startingPoint, endingPoint]);
          log(
            `896 ${`\u001b[${32}m${`FINAL PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4,
            )}`,
          );
          log(`902 then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
      }
      // 2. replace non-quoted values
    }

    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------
    // --------------------

    // at the very bottom:
    if (
      (currentlyWithinObject && currentlyWithinArray) ||
      (currentlyWithinArray &&
        typeof withinQuotesSince !== "number" &&
        str[i] === "]" &&
        isNotEscape(str, i - 1))
    ) {
      // what we drop back into is whichever container is still open innermost,
      // which is not always an object - a nested array closing inside an array
      // used to leave us thinking we were in an object, and then the next
      // element's opening bracket never moved the index on
      let innermostOpenIsArray =
        !!withinArrayIndexes.length &&
        (!withinObjectIndexes.length ||
          withinArrayIndexes[withinArrayIndexes.length - 1] >
            withinObjectIndexes[withinObjectIndexes.length - 1]);
      currentlyWithinArray = innermostOpenIsArray;
      currentlyWithinObject = !innermostOpenIsArray;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray};  ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`,
        );
    }

    // logs:

    log(
      `${`\u001b[${withinQuotesSince ? 32 : 31}m${`withinQuotesSince${
        typeof withinQuotesSince === "number" ? `=${withinQuotesSince}` : ""
      }`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinObject ? 32 : 31
      }m${`currentlyWithinObject`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinArray ? 32 : 31
      }m${`currentlyWithinArray`}\u001b[${39}m`}; ${`\u001b[${
        replaceThisValue ? 32 : 31
      }m${`replaceThisValue`}\u001b[${39}m`}; ${`\u001b[${
        itsTheFirstElem ? 32 : 31
      }m${`itsTheFirstElem`}\u001b[${39}m`}; ${`\u001b[${
        skipUntilTheFollowingIsMet.length ? 32 : 31
      }m${`skipUntilTheFollowingIsMet${
        skipUntilTheFollowingIsMet
          ? `: ${JSON.stringify(skipUntilTheFollowingIsMet, null, 0)}`
          : ""
      }`}\u001b[${39}m`}`,
    );

    log(`current path: ${JSON.stringify(currentPath.join("."), null, 0)}`);
    log(
      `${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}; ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}; ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}; ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt}; ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}; ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`,
    );
    log(
      `${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
        withinArrayIndexes,
        null,
        0,
      )}; ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
        withinObjectIndexes,
        null,
        0,
      )};`,
    );
  }
  log(`\n\u001b[${36}m${`=============================== FIN.`}\u001b[${39}m`);

  if (mode === "del") {
    log(
      `947 RETURN applied ${JSON.stringify(rApply(str, ranges as any), null, 4)}`,
    );
    return rApply(str, ranges as any);
  }

  // "set" and "locate" walked the whole string without meeting the path. For
  // set() that is not a no-op any more - it goes on to add the path
  log(`947 RETURN null - path not found`);
  return null;
}

// -----------------------------------------------------------------------------
//                       A D D I N G   N E W   P A T H S
// -----------------------------------------------------------------------------
//
// Everything above edits values that are already in the string. What follows
// grafts on the ones that are not, keeping to the formatting the string already
// uses, and matching what object-path's set() would have done to the parsed
// equivalent - that is the contract the tests hold this package to.

// object-path reads a segment as an array index only when it is a canonically
// spelled non-negative integer - "01" addresses a key called "01", not slot one
function isArrayIndex(segment: string): boolean {
  return /^(?:0|[1-9]\d*)$/.test(segment);
}

/** whitespace at the start of the line the given index sits on */
function indentOfLineAt(str: string, idx: number): string {
  let lineStartsAt = str.lastIndexOf("\n", idx) + 1;
  let i = lineStartsAt;
  while (i < idx && (str[i] === " " || str[i] === "\t")) {
    i += 1;
  }
  return str.slice(lineStartsAt, i);
}

interface Style {
  /** what the string puts between a key's colon and its value */
  colonGap: string;
  /** one step of indentation, empty when the string is minified */
  indentUnit: string;
  multiline: boolean;
}

// Read the formatting off the string rather than imposing one: a minified
// package.json must stay minified, and an indented one must keep its indent.
function detectStyle(str: string): Style {
  let colonGap = "";
  let withinQuotes = false;
  for (let i = 0, len = str.length; i < len; i++) {
    if (withinQuotes) {
      if (str[i] === `"` && isNotEscape(str, i - 1)) {
        withinQuotes = false;
      }
      continue;
    }
    if (str[i] === `"`) {
      withinQuotes = true;
    } else if (str[i] === ":") {
      let gapEndsAt = i + 1;
      while (gapEndsAt < len && !str[gapEndsAt].trim()) {
        gapEndsAt += 1;
      }
      colonGap = str.slice(i + 1, gapEndsAt);
      break;
    }
  }

  // the first indented line gives away the indentation unit - the outermost
  // container starts at column zero, so its members sit exactly one step in
  let indentUnit = "";
  let firstLineBreakAt = str.indexOf("\n");
  if (firstLineBreakAt !== -1) {
    indentUnit = indentOfLineAt(str, str.length);
    let i = firstLineBreakAt + 1;
    while (i < str.length && (str[i] === " " || str[i] === "\t")) {
      i += 1;
    }
    indentUnit = str.slice(firstLineBreakAt + 1, i);
  }

  return {
    colonGap: colonGap.includes("\n") ? " " : colonGap,
    indentUnit,
    multiline: firstLineBreakAt !== -1,
  };
}

interface ContainerContents {
  memberCount: number;
  /** index of the first character of the last member, -1 when there are none */
  lastMemberStart: number;
  /** index after the last character of the last member, -1 when there are none */
  lastMemberEnd: number;
}

// One depth- and quote-aware pass over a container's insides. Enough to tell an
// empty container from a populated one, to count an array's elements, and to
// find where the last member ends - which is where a new one goes.
function scanContainer(
  str: string,
  from: number,
  to: number,
): ContainerContents {
  let depth = 0;
  let withinQuotes = false;
  let commaCount = 0;
  let hasContent = false;
  let expectingMember = true;
  let lastMemberStart = -1;
  let lastMemberEnd = -1;

  for (let i = from + 1, upto = to - 1; i < upto; i++) {
    let char = str[i];
    if (withinQuotes) {
      if (char === `"` && isNotEscape(str, i - 1)) {
        withinQuotes = false;
      }
      lastMemberEnd = i + 1;
      continue;
    }
    if (char === `"`) {
      withinQuotes = true;
    } else if (char === "{" || char === "[") {
      depth += 1;
    } else if (char === "}" || char === "]") {
      depth -= 1;
    } else if (char === "," && !depth) {
      commaCount += 1;
      expectingMember = true;
      continue;
    }
    if (!char.trim()) {
      continue;
    }
    hasContent = true;
    if (expectingMember) {
      expectingMember = false;
      lastMemberStart = i;
    }
    lastMemberEnd = i + 1;
  }

  return {
    memberCount: hasContent ? commaCount + 1 : 0,
    lastMemberStart,
    lastMemberEnd,
  };
}

/** the outermost container - the one no path segment addresses */
function locateRoot(str: string): Located | null {
  let from = -1;
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].trim()) {
      from = i;
      break;
    }
  }
  if (from === -1 || (str[from] !== "{" && str[from] !== "[")) {
    return null;
  }

  let depth = 0;
  let withinQuotes = false;
  for (let i = from, len = str.length; i < len; i++) {
    let char = str[i];
    if (withinQuotes) {
      if (char === `"` && isNotEscape(str, i - 1)) {
        withinQuotes = false;
      }
      continue;
    }
    if (char === `"`) {
      withinQuotes = true;
    } else if (char === "{" || char === "[") {
      depth += 1;
    } else if (char === "}" || char === "]") {
      depth -= 1;
      if (!depth) {
        return { from, to: i + 1 };
      }
    }
  }
  return null;
}

// The value for a path whose last few segments don't exist yet - "a.b.0.c"
// grafted onto an empty object needs {"b":[{"c":<value>}]} building around it.
// Which container gets created depends on the segment that addresses it, the
// same way object-path decides: all-digits means an array, anything else an
// object. An index past the end pads with nulls, again matching object-path.
function buildNestedValue(
  segments: string[],
  leaf: string,
  style: Style,
  baseIndent: string,
): string {
  if (!segments.length) {
    return leaf;
  }
  let innerIndent = baseIndent + style.indentUnit;
  let inner = buildNestedValue(segments.slice(1), leaf, style, innerIndent);
  let [openBracket, closeBracket, member] = isArrayIndex(segments[0])
    ? ["[", "]", inner]
    : ["{", "}", `${JSON.stringify(segments[0])}:${style.colonGap}${inner}`];

  let members = isArrayIndex(segments[0])
    ? [...(new Array(Number(segments[0])).fill("null") as string[]), member]
    : [member];

  if (!style.multiline) {
    return `${openBracket}${members.join(",")}${closeBracket}`;
  }
  return `${openBracket}\n${innerIndent}${members.join(
    `,\n${innerIndent}`,
  )}\n${baseIndent}${closeBracket}`;
}

// Grafts the segments that don't exist yet onto the container that does.
function graftOntoContainer(
  str: string,
  container: Located,
  segments: string[],
  leaf: string,
  style: Style,
): string {
  let opening = str[container.from];
  if (opening !== "{" && opening !== "[") {
    // the closest thing that exists is a plain value, so there is nothing to
    // add a key to. object-path throws here; a string editor that never parses
    // is better off handing the input back untouched
    return str;
  }
  let { memberCount, lastMemberStart, lastMemberEnd } = scanContainer(
    str,
    container.from,
    container.to,
  );

  // an array only takes indexes, and only ones at or past its end - anything
  // before that would already have been found and edited in place
  let fillerCount = 0;
  if (opening === "[") {
    if (!isArrayIndex(segments[0])) {
      return str;
    }
    fillerCount = Number(segments[0]) - memberCount;
    if (fillerCount < 0) {
      return str;
    }
  }

  // what separates this container's members is whatever already separates
  // them - copied off the gap in front of the last one
  let memberGap = "";
  let memberIndent: string;
  if (memberCount) {
    let gapStartsAt = lastMemberStart;
    while (gapStartsAt > container.from + 1 && !str[gapStartsAt - 1].trim()) {
      gapStartsAt -= 1;
    }
    memberGap = str.slice(gapStartsAt, lastMemberStart);
    memberIndent = memberGap.includes("\n")
      ? memberGap.slice(memberGap.lastIndexOf("\n") + 1)
      : indentOfLineAt(str, container.from) + style.indentUnit;
  } else {
    // nothing in there to copy, so open the container up the way the rest of
    // the string is laid out
    memberIndent = indentOfLineAt(str, container.from) + style.indentUnit;
    memberGap = style.multiline ? `\n${memberIndent}` : "";
  }

  let addition = [
    ...(new Array(fillerCount).fill("null") as string[]),
    opening === "["
      ? buildNestedValue(segments.slice(1), leaf, style, memberIndent)
      : `${JSON.stringify(segments[0])}:${style.colonGap}${buildNestedValue(
          segments.slice(1),
          leaf,
          style,
          memberIndent,
        )}`,
  ].join(`,${memberGap}`);

  if (memberCount) {
    return `${str.slice(0, lastMemberEnd)},${memberGap}${addition}${str.slice(
      lastMemberEnd,
    )}`;
  }
  let closingGap = style.multiline
    ? `\n${indentOfLineAt(str, container.from)}`
    : "";
  return `${str.slice(0, container.from + 1)}${memberGap}${addition}${closingGap}${str.slice(container.to - 1)}`;
}

// Finds the deepest ancestor of the wanted path that does exist, then grafts
// the rest of the path onto it.
function addNewPath(
  str: string,
  path: string,
  valToInsert: string | number,
): string {
  let segments = stringifyPath(path).split(".");
  if (segments.some((segment) => !segment.length)) {
    return str;
  }
  let style = detectStyle(str);
  let leaf = stringifyAndEscapeValue(
    isStr(valToInsert) &&
      !valToInsert.startsWith(`"`) &&
      !valToInsert.startsWith(`{`)
      ? `"${valToInsert}"`
      : valToInsert,
  );

  for (let take = segments.length - 1; take >= 0; take--) {
    let container = take
      ? (main({
          str,
          path: segments.slice(0, take).join("."),
          mode: "locate",
        }) as Located | null)
      : locateRoot(str);
    if (!container) {
      continue;
    }
    return graftOntoContainer(
      str,
      container,
      segments.slice(take),
      leaf,
      style,
    );
  }
  return str;
}

function set(str: string, path: string, valToInsert: string | number): string {
  DEV && console.log(`set()`);
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json/set(): [THROW_ID_01] first input argument must be a non-empty string. It was given as ${formatDiagnosticValue(str, 4)} (type ${typeof str})`,
    );
  }
  let edited = main({ str, path, valToInsert, mode: "set" });
  if (isStr(edited)) {
    return edited;
  }
  // the path is not in there yet - add it
  return addNewPath(str, path, valToInsert);
}

function del(str: string, path: string): string {
  DEV && console.log(`del()`);
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json/del(): [THROW_ID_02] first input argument must be a non-empty string. It was given as ${formatDiagnosticValue(str, 4)} (type ${typeof str})`,
    );
  }
  // absence of what to insert means delete
  return main({ str, path, mode: "del" }) as string;
}

export { del, set, version };
