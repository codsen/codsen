import { left, right } from "string-left-right";
import type { Ranges } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Result {
  res: string[];
  ranges: Ranges;
}

/**
 * Extracts CSS class/id names from a string
 */
function extract(str: string): Result {
  // insurance
  // =========
  if (typeof str !== "string") {
    throw new TypeError(
      `string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }

  let badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs: "." | "#" | undefined; // "." or "#"

  // functions
  // =========

  function isLatinLetter(char: string): boolean {
    // we mean Latin letters A-Z, a-z
    return (
      typeof char === "string" &&
      !!char.length &&
      ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
    );
  }

  // action
  // ======

  let selectorStartsAt = null;
  let result: Result = {
    res: [],
    ranges: [],
  };

  // we iterate upto and including str.length - last element will be undefined
  // at cost of extra protective clauses (if not undefined) we simplify the
  // algorithm ending clauses - things' ending at string's end can now be
  // tackled in the same logic as things' that end in the middle of the string
  for (let i = 0, len = str.length; i <= len; i++) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`============================`}\u001b[${39}m`} ${`\u001b[${33}m${
          str[i]
        }\u001b[${39}m`} (${`\u001b[${31}m${i}\u001b[${39}m`})`
      );

    // catch the ending of a selector's name:

    if (
      selectorStartsAt !== null &&
      i >= selectorStartsAt &&
      // and...
      // either the end of string has been reached
      // or it's a whitespace
      (!str[i]?.trim() ||
        // or it's a character, unsuitable for class/id names
        badChars.includes(str[i]))
    ) {
      // if selector is more than dot or hash:
      if (i > selectorStartsAt + 1) {
        // If we reached the last character and selector's beginning has not been
        // interrupted, extend the slice's ending by 1 character. If we terminate
        // the selector because of illegal character, slice right here, at index "i".
        (result.ranges as [from: number, to: number][]).push([
          selectorStartsAt,
          i,
        ]);
        result.res.push(
          `${stateCurrentlyIs || ""}${str.slice(selectorStartsAt, i)}`
        );

        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
          DEV &&
            console.log(
              `097 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} stateCurrentlyIs = undefined`
            );
        }
      }
      selectorStartsAt = null;
      DEV &&
        console.log(
          `104 ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = null`
        );
    }

    // catch dot or hash:
    if (
      str[i] &&
      selectorStartsAt === null &&
      (str[i] === "." || str[i] === "#")
    ) {
      selectorStartsAt = i;
      DEV &&
        console.log(
          `117 SET ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = ${selectorStartsAt}`
        );
    }

    // catch zzz[class=]
    let temp1 = right(str, i + 4);
    if (
      str.startsWith("class", i) &&
      typeof left(str, i) === "number" &&
      str[left(str, i) as number] === "[" &&
      typeof temp1 === "number" &&
      str[temp1] === "="
    ) {
      DEV && console.log(`130 [class= caught`);
      // if it's zzz[class=something] (without quotes)
      /* c8 ignore next */
      if (
        right(str, temp1) &&
        isLatinLetter(str[right(str, temp1) as number])
      ) {
        selectorStartsAt = right(str, temp1);
        DEV && console.log(`138 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (
        `'"`.includes(str[right(str, temp1) as number]) &&
        isLatinLetter(str[right(str, right(str, temp1) as number) as number])
      ) {
        selectorStartsAt = right(str, right(str, temp1));
        DEV && console.log(`144 SET selectorStartsAt = ${selectorStartsAt}`);
      }
      stateCurrentlyIs = ".";
    }

    // catch zzz[id=]
    let temp2 = right(str, i + 1);
    if (
      str.startsWith("id", i) &&
      str[left(str, i) as number] === "[" &&
      temp2 !== null &&
      str[temp2] === "="
    ) {
      DEV && console.log(`157 [id= caught`);
      // if it's zzz[id=something] (without quotes)
      if (isLatinLetter(str[right(str, temp2) as number])) {
        selectorStartsAt = right(str, temp2);
        DEV && console.log(`161 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (
        `'"`.includes(str[right(str, temp2) as number]) &&
        isLatinLetter(str[right(str, right(str, temp2) as number) as number])
      ) {
        selectorStartsAt = right(str, right(str, temp2));
        DEV && console.log(`167 SET selectorStartsAt = ${selectorStartsAt}`);
      }
      stateCurrentlyIs = "#";
    }

    DEV &&
      console.log(
        `174 \u001b[${90}m${`ended with: selectorStartsAt = ${selectorStartsAt}; result = ${JSON.stringify(
          result,
          null,
          0
        )}`}\u001b[${39}m`
      );
  }

  // absence of ranges is falsy "null", not truthy empty array, so
  // if nothing was extracted and empty array is in result.ranges,
  // overwrite it to falsy "null"
  if (!(result.ranges as any[]).length) {
    result.ranges = null;
  }

  return result;
}

export { extract, version };
