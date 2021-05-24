/**
 * @name string-trim-spaces-only
 * @fileoverview Like String.trim() but you can choose granularly what to trim
 * @version 3.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-trim-spaces-only/}
 */

var version$1 = "3.1.0";

const version = version$1;
const defaults = {
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false
};
function trimSpaces(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`);
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  function check(char) {
    return opts.classicTrim && !char.trim() || !opts.classicTrim && (opts.space && char === " " || opts.cr && char === "\r" || opts.lf && char === "\n" || opts.tab && char === "\t" || opts.nbsp && char === "\u00a0");
  }
  let newStart;
  let newEnd;
  if (str.length) {
    if (check(str[0])) {
      for (let i = 0, len = str.length; i < len; i++) {
        if (!check(str[i])) {
          newStart = i;
          break;
        }
        if (i === str.length - 1) {
          return {
            res: "",
            ranges: [[0, str.length]]
          };
        }
      }
    }
    if (check(str[str.length - 1])) {
      for (let i = str.length; i--;) {
        if (!check(str[i])) {
          newEnd = i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return {
          res: str.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, str.length]]
        };
      }
      return {
        res: str.slice(newStart),
        ranges: [[0, newStart]]
      };
    }
    if (newEnd) {
      return {
        res: str.slice(0, newEnd),
        ranges: [[newEnd, str.length]]
      };
    }
    return {
      res: str,
      ranges: []
    };
  }
  return {
    res: "",
    ranges: []
  };
}

export { defaults, trimSpaces, version };
