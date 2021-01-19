import { version as v } from "../package.json";
const version: string = v;
import { Ranges } from "../../../scripts/common";

interface Opts {
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

interface Res {
  res: string;
  ranges: Ranges;
}

function trimSpaces(str: string, originalOpts?: Partial<Opts>): Res {
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
  // opts preparation:
  const opts = { ...defaults, ...originalOpts };

  function check(char: string) {
    return (
      (opts.classicTrim && !char.trim()) ||
      (!opts.classicTrim &&
        ((opts.space && char === " ") ||
          (opts.cr && char === "\r") ||
          (opts.lf && char === "\n") ||
          (opts.tab && char === "\t") ||
          (opts.nbsp && char === "\u00a0")))
    );
  }

  // action:
  let newStart;
  let newEnd;
  console.log("038 about to check the length");
  if (str.length) {
    if (check(str[0])) {
      console.log(
        `042 \u001b[${36}m${`traverse forwards to trim heads`}\u001b[${39}m`
      );
      for (let i = 0, len = str.length; i < len; i++) {
        console.log(
          `\u001b[${36}m${`046 ------ str[${i}] = ${JSON.stringify(
            str[i],
            null,
            0
          )}`}\u001b[${39}m`
        );
        if (!check(str[i])) {
          newStart = i;
          console.log(
            `055 SET ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
              newStart,
              null,
              4
            )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }
        // if we traversed the whole string this way and didn't stumble on a non-
        // space/whitespace character (depending on opts.classicTrim), this means
        // whole thing can be trimmed:
        if (i === str.length - 1) {
          // this means there are only spaces/whitespace from beginning to the end
          console.log("068");
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
      console.log(
        `081 \u001b[${36}m${`traverse backwards to trim tails`}\u001b[${39}m`
      );
      for (let i = str.length; i--; ) {
        console.log(
          `\u001b[${36}m${`085 ------ str[${i}] = ${str[i]}`}\u001b[${39}m`
        );
        if (!check(str[i])) {
          newEnd = i + 1;
          console.log(
            `090 SET ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
              newEnd,
              null,
              4
            )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }
      }
    }
    console.log(
      `101 CURRENTLY, ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
        newStart,
        null,
        4
      )}`
    );
    console.log(
      `108 CURRENTLY, ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
        newEnd,
        null,
        4
      )}`
    );
    if (newStart) {
      if (newEnd) {
        console.log("116 - returning trimmed both heads and tails");
        return {
          res: str.slice(newStart, newEnd),
          ranges: [
            [0, newStart],
            [newEnd, str.length],
          ],
        };
      }
      console.log("125 - returning trimmed heads");
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]],
      };
    }
    if (newEnd) {
      console.log("132 - returning trimmed tails");
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
