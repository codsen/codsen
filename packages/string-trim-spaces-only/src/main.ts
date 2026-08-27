import { formatDiagnosticValue } from "codsen-format-diagnostic-value";
import type { Range } from "../../../ops/typedefs/common";

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
  ranges: Range[];
}

function trimSpaces(str: string, opts?: Partial<Opts>): Res {
  // insurance:
  if (typeof str !== "string") {
    throw new Error(
      `string-trim-spaces-only/trimSpaces(): [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${formatDiagnosticValue(str, 4)}`,
    );
  }
  // Avoid allocating a merged object on the dominant no-options path while
  // still snapshotting every exported default once per call.
  const resolvedOpts = opts ? { ...defaults, ...opts } : defaults;
  const { classicTrim, cr, lf, tab, space, nbsp } = resolvedOpts;

  function check(char: string): boolean {
    return (
      (classicTrim && !char.trim()) ||
      (!classicTrim &&
        ((space && char === " ") ||
          (cr && char === "\r") ||
          (lf && char === "\n") ||
          (tab && char === "\t") ||
          (nbsp && char === "\u00a0")))
    );
  }

  // action:
  DEV && console.log("about to check the length");
  const len = str.length;
  if (len) {
    let start = 0;
    while (start < len) {
      if (!check(str[start])) {
        if (start) {
          DEV &&
            console.log(
              `\u001b[${36}m${`------ str[${start}] = ${JSON.stringify(
                str[start],
                null,
                0,
              )}`}\u001b[${39}m`,
            );
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
                start,
                null,
                4,
              )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`,
            );
        }
        break;
      }
      if (start === 0) {
        DEV &&
          console.log(
            `\u001b[${36}m${`traverse forwards to trim heads`}\u001b[${39}m`,
          );
      }
      DEV &&
        console.log(
          `\u001b[${36}m${`------ str[${start}] = ${JSON.stringify(
            str[start],
            null,
            0,
          )}`}\u001b[${39}m`,
        );
      start += 1;
    }

    if (start === len) {
      DEV && console.log();
      return {
        res: "",
        ranges: [[0, len]],
      };
    }

    let end = len;
    while (end > start) {
      const i = end - 1;
      if (!check(str[i])) {
        if (end < len) {
          DEV &&
            console.log(
              `\u001b[${36}m${`------ str[${i}] = ${str[i]}`}\u001b[${39}m`,
            );
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
                end,
                null,
                4,
              )}, then ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`,
            );
        }
        break;
      }
      if (end === len) {
        DEV &&
          console.log(
            `\u001b[${36}m${`traverse backwards to trim tails`}\u001b[${39}m`,
          );
      }
      DEV &&
        console.log(
          `\u001b[${36}m${`------ str[${i}] = ${str[i]}`}\u001b[${39}m`,
        );
      end = i;
    }

    const newStart = start || undefined;
    const newEnd = end < len ? end : undefined;
    DEV &&
      console.log(
        `CURRENTLY, ${`\u001b[${33}m${`newStart`}\u001b[${39}m`} = ${JSON.stringify(
          newStart,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `CURRENTLY, ${`\u001b[${33}m${`newEnd`}\u001b[${39}m`} = ${JSON.stringify(
          newEnd,
          null,
          4,
        )}`,
      );
    if (newStart !== undefined) {
      if (newEnd !== undefined) {
        DEV && console.log("- returning trimmed both heads and tails");
        return {
          res: str.slice(newStart, newEnd),
          ranges: [
            [0, newStart],
            [newEnd, len],
          ],
        };
      }
      DEV && console.log("- returning trimmed heads");
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]],
      };
    }
    if (newEnd !== undefined) {
      DEV && console.log("- returning trimmed tails");
      return {
        res: str.slice(0, newEnd),
        ranges: [[newEnd, len]],
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

export { defaults, trimSpaces, version };
