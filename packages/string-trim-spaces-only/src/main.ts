import type { Ranges } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  classicTrim: boolean;
  cr: boolean;
  lf: boolean;
  tab: boolean;
  space: boolean;
  nbsp: boolean;
}

const defaults: Opts = {
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false,
};

export interface Res {
  res: string;
  ranges: Ranges;
}

function trimSpaces(str: string, opts?: Partial<Opts>): Res {
  // insurance:
  if (typeof str !== "string") {
    throw new Error(
      `string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  // resolvedOpts preparation:
  let resolvedOpts = { ...defaults, ...opts };

  function check(char: string): boolean {
    return (
      (resolvedOpts.classicTrim && !char.trim()) ||
      (!resolvedOpts.classicTrim &&
        ((resolvedOpts.space && char === " ") ||
          (resolvedOpts.cr && char === "\r") ||
          (resolvedOpts.lf && char === "\n") ||
          (resolvedOpts.tab && char === "\t") ||
          (resolvedOpts.nbsp && char === "\u00a0")))
    );
  }

  // action:
  let newStart;
  let newEnd;
  DEV && console.log("061 about to check the length");
  if (str.length) {
    if (check(str[0])) {
      DEV &&
        console.log(
          `066 \u001b[${36}m${`traverse forwards to trim heads`}\u001b[${39}m`
        );
      for (let i = 0, len = str.length; i < len; i++) {
        DEV &&
          console.log(
            `\u001b[${36}m${`046 ------ str[${i}] = ${JSON.stringify(
              str[i],
              null,
              0
            )}`}\u001b[${39}m`
          );
        if (!check(str[i])) {
          newStart = i;
          DEV &&
            console.log(
              `081 SET ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
                newStart,
                null,
                4
              )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
            );
          break;
        }
        // if we traversed the whole string this way and didn't stumble on a non-
        // space/whitespace character (depending on resolvedOpts.classicTrim), this means
        // whole thing can be trimmed:
        if (i === str.length - 1) {
          // this means there are only spaces/whitespace from beginning to the end
          DEV && console.log("094");
          return {
            res: "",
            ranges: [[0, str.length]],
          };
        }
      }
    }

    // if we reached this far, check the last character - find out, is it worth
    // trimming the end of the given string:
    if (check(str[str.length - 1])) {
      DEV &&
        console.log(
          `108 \u001b[${36}m${`traverse backwards to trim tails`}\u001b[${39}m`
        );
      for (let i = str.length; i--; ) {
        DEV &&
          console.log(
            `\u001b[${36}m${`085 ------ str[${i}] = ${str[i]}`}\u001b[${39}m`
          );
        if (!check(str[i])) {
          newEnd = i + 1;
          DEV &&
            console.log(
              `119 SET ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
                newEnd,
                null,
                4
              )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
            );
          break;
        }
      }
    }
    DEV &&
      console.log(
        `131 CURRENTLY, ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
          newStart,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `139 CURRENTLY, ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
          newEnd,
          null,
          4
        )}`
      );
    if (newStart) {
      if (newEnd) {
        DEV && console.log("147 - returning trimmed both heads and tails");
        return {
          res: str.slice(newStart, newEnd),
          ranges: [
            [0, newStart],
            [newEnd, str.length],
          ],
        };
      }
      DEV && console.log("156 - returning trimmed heads");
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]],
      };
    }
    if (newEnd) {
      DEV && console.log("163 - returning trimmed tails");
      return {
        res: str.slice(0, newEnd),
        ranges: [[newEnd, str.length]],
      };
    }
    // if we reached this far, there was nothing to trim:
    return {
      res: str, // return original string. No need to clone because it's string.
      ranges: [],
    };
  }
  // if we reached this far, this means it's an empty string. In which case,
  // return empty values:
  return {
    res: "",
    ranges: [],
  };
}

export { trimSpaces, defaults, version };
