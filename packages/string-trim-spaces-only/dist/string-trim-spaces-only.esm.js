/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.9.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-trim-spaces-only/
 */

function trimSpaces(s, originalOpts) {
  if (typeof s !== "string") {
    throw new Error(
      `string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof s}, equal to:\n${JSON.stringify(
        s,
        null,
        4
      )}`
    );
  }
  const defaults = {
    classicTrim: false,
    cr: false,
    lf: false,
    tab: false,
    space: true,
    nbsp: false,
  };
  const opts = { ...defaults, ...originalOpts };
  function check(char) {
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
  let newStart;
  let newEnd;
  if (s.length) {
    if (check(s[0])) {
      for (let i = 0, len = s.length; i < len; i++) {
        if (!check(s[i])) {
          newStart = i;
          break;
        }
        if (i === s.length - 1) {
          return {
            res: "",
            ranges: [[0, s.length]],
          };
        }
      }
    }
    if (check(s[s.length - 1])) {
      for (let i = s.length; i--; ) {
        if (!check(s[i])) {
          newEnd = i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return {
          res: s.slice(newStart, newEnd),
          ranges: [
            [0, newStart],
            [newEnd, s.length],
          ],
        };
      }
      return {
        res: s.slice(newStart),
        ranges: [[0, newStart]],
      };
    }
    if (newEnd) {
      return {
        res: s.slice(0, newEnd),
        ranges: [[newEnd, s.length]],
      };
    }
    return {
      res: s,
      ranges: [],
    };
  }
  return {
    res: "",
    ranges: [],
  };
}

export default trimSpaces;
